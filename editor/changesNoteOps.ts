import { NotePin, Note, Pattern, Config } from "../synth/synth";
import { ChangeSequence } from "./Change";
import { SongDocument } from "./SongDocument";
import { ChangeNotesAdded, ChangeSplitNotesAtPoint, removeRedundantPins } from "./changes";

/** Merges adjacent notes that share the same pitches in the given range.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 */
export class ChangeMergeAcrossAdjacent extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length <= 1) { return; }

        let note: Note;
        let prevNote: Note | null = null;
        for (let i = 1; i < pattern.notes.length; i++) {
            note = pattern.notes[i];
            prevNote = pattern.notes[i - 1];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { break; }
            if (prevNote.end <= x1 || prevNote.start >= x2) { continue; }

            const lastInterval = prevNote.pins[prevNote.pins.length - 1].interval;
            if (note.start === prevNote.end
                && note.pitches.length === prevNote.pitches.length
                && (new Set(note.pitches) as any).isSubsetOf(new Set(prevNote.pitches.map(pitch => pitch + lastInterval)))) {
                this.append(new ChangeMergeAcross(doc, pattern, prevNote.start, note.end));
                prevNote = null;
                i -= 1;
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Merges notes in the given range, and will even push by 1, or delete pins to guarantee a merge.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 */
export class ChangeMergeAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length <= 1) { return; }

        let note: Note;
        let firstNote: Note | null = null;
        let lastNote: Note | null = null;
        let firstPitch = 0, notePitch = 0;
        const notesMergedOver: Note[] = [];
        let notePinList: NotePin[] = [];

        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { break; }

            if (!firstNote) {
                firstNote = note;
                firstPitch = firstNote.pitches.reduce((a, b) => Math.min(a, b));

                notesMergedOver.push(note);
                notePinList = firstNote.pins;
            }

            if (note.end <= x2 && (!lastNote || note.end > lastNote.end)) {
                lastNote = note;
            }

            if (note !== firstNote) {
                notePitch = note.pitches.reduce((a, b) => Math.min(a, b));

                // Accumulate pins across notes (adjust relative values based on first note)
                let newPin: NotePin;
                let lastPin = notePinList.length > 0 ? notePinList[notePinList.length - 1] : null;
                let pinBeforeLast: NotePin | null;
                for (const pin of note.pins) {
                    newPin = {
                        interval: notePitch + pin.interval - firstPitch,
                        size: pin.size,
                        time: note.start - firstNote.start + pin.time
                    };

                    // If the last note's ending pin is fully redundant with the start of the new note, or if it has
                    // a length of 1, delete the last note's ending pin. Else, if they have the same time but aren't
                    // identical, nudge the last note's end pin backwards 1 unit of time.
                    if (lastPin) {
                        pinBeforeLast = notePinList.length > 1 ? notePinList[notePinList.length - 2] : null;
                        if (newPin.time == lastPin.time) {
                            // Delete prior pin if it's fully redundant with this one.
                            // Delete prior pin if it can't be nudged back by 1 (time - 1 conflicts with pin before it).
                            if ((newPin.interval === lastPin.interval && newPin.size === lastPin.size) ||
                                (pinBeforeLast && lastPin.time - 1 == pinBeforeLast.time)) {
                                notePinList.splice(notePinList.length - 1, 1);
                            } else {
                                // Adjust last pin time backwards by 1 since it's not redundant and is nudgeable.
                                lastPin.time -= 1;
                            }
                        }
                    }

                    notePinList.push(newPin);
                }

                notesMergedOver.push(note);
            }
        }

        // Nothing to merge if entire range is one note, or if no notes were found in range.
        if (firstNote === lastNote || !firstNote || !lastNote) {
            return;
        }

        // Span the first note through all pins, assuming its pitches across the full length.
        let firstNoteCopy = firstNote.clone();
        firstNoteCopy.end = lastNote.end;
        firstNoteCopy.pins = notePinList;
        this.append(new ChangeNotesAdded(doc, pattern, notesMergedOver, [firstNoteCopy]));
        doc.notifier.changed();
        this._didSomething();
    }
}

/** Creates single notes to span the empty space between any two notes in the given range.
 * These notes have the pitch array of the note to their left.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 * @param doBends If true, the bridge notes end with the right note's starting pitch and volume.
 * @param copyEnds If true, the bridge notes copy the left note's start volume; also end unless bends are performed.
 */
export class ChangeBridgeAcross extends ChangeSequence {
    private _notesInserted: Note[] = [];
    private _pattern: Pattern;
    constructor(doc: SongDocument, pattern: Pattern, doBends: boolean, copyEnds: boolean, x1?: number, x2?: number) {
        super();
        this._pattern = pattern;

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length <= 1) { return; }

        if (x1 !== 0) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1)); }
        if (x2 !== doc.song.partsPerPattern) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2)); }

        let note: Note;
        let prevNote: Note | null;
        let noteLeftOfSelection: number | null = null;
        let startSize: number;
        let newNote: Note;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            // Skip out-of-bounds notes
            if (note.end <= x1) { noteLeftOfSelection = i; continue; }
            if (note.start >= x2) { break; }

            // Don't bridge from the note left of selection to first within.
            if (i - 1 == noteLeftOfSelection) { continue; }

            if (i > 0) {
                prevNote = pattern.notes[i - 1];
                if (note.start - prevNote.end > 0) {
                    startSize = copyEnds ? prevNote.pins[0].size : prevNote.pins[prevNote.pins.length - 1].size;
                    newNote = new Note(-1, prevNote.end, note.start, startSize, false);

                    // Adjust pitch so first pin has 0 interval
                    newNote.pitches = [];
                    for (let pitch of prevNote.pitches) {
                        newNote.pitches.push(pitch + prevNote.pins[prevNote.pins.length - 1].interval);
                    }

                    newNote.pins[1].size =
                        copyEnds ? prevNote!.pins[prevNote.pins.length - 1].size :
                        doBends ? note.pins[0].size :
                        newNote.pins[1].size;

                    if (doBends) {
                        newNote.pins[1].interval = note.pitches[0] - newNote.pitches[0] + note.pins[0].interval;
                    }

                    this._notesInserted.push(newNote);
                }
            }
        }

        if (this._notesInserted.length === 0) {
            return;
        }

        this.append(new ChangeNotesAdded(doc, pattern, [], this._notesInserted));
        doc.notifier.changed();
        this._didSomething();
    }

    /**
     * Performs a callback per-note added from this operation. Only includes matching notes.
     * Return true anytime to exit early.
    */
    public perNote(callback: (note: Note) => boolean | void) {
        if (callback === null) { return; }

        for (const entry of this._notesInserted) {
			if (this._pattern.notes.includes(entry) && callback(entry)) { return; }
        }
    }
}

/** Performs cuts spread across the given range, which separate any notes they intersect.
 * Cuts are performed like space-around, not space-between, for a CSS analogy.
 * 
 * x1, x2 defaults to active selection. This is intended to be overridden to control where the operation works.
 * @param numCuts How many.
 */
export class ChangeSplitAcross extends ChangeSequence {
    private _pattern: Pattern;
    private _splitNotes: Note[] = [];
    private _cuts: number[] = [];
    constructor(doc: SongDocument, pattern: Pattern, numCuts: number, x1?: number, x2?: number) {
        super();
        this._pattern = pattern;

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (pattern.notes.length === 0) { return; }

        const range = x2 - x1;
        numCuts = Math.min(numCuts, x2 - x1 - 1);
        if (numCuts < 1 || range <= 1) { return; }

        let cutIndices: number[] = [];

        if (numCuts === 1) { cutIndices.push(Math.round((x1 + x2) / 2)); }
        else {
            const chunk = Math.max(range / (numCuts + 1), 1); // Never less than 1 for time.
            let cut: number;
            for (let i = 1; i < numCuts + 1; i++) {
                // Always cut integer sizes or greater; never the same spot twice.
                cut = Math.round(x1 + chunk * i);
                if (cutIndices.length === 0 || cutIndices[cutIndices.length - 1] !== cut) {
                    cutIndices.push(cut)
                }
            }
        }

        let splitOp: ChangeSplitNotesAtPoint;
        for (let i = 0; i < cutIndices.length; i++) {
            splitOp = new ChangeSplitNotesAtPoint(doc, pattern, cutIndices[i]);
            this.append(splitOp);
            this._splitNotes.push(splitOp.leftNote, splitOp.rightNote);
        }

        // Split occurs across any note(s) so there may be duplicates and it's easiest to just iterate to remove them.
        this._cuts = cutIndices;
        this._splitNotes = this._splitNotes.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })

        if (cutIndices.length > 0) {
            doc.notifier.changed();
            this._didSomething();    
        }
    }

    /** Performs a callback for each cut position, providing its position. */
    public perCut(callback: (cutPosition: number) => boolean | void) {
        if (callback === null) { return; }
        this._cuts.every(cut => { callback(cut) !== true })
    }

    /**
     * Performs a callback per-note for all splits created. Only includes matching notes.
     * Return true anytime to exit early.
     */
    public perNote(callback: (note: Note) => boolean | void) {
        if (callback === null) { return; }
        this._splitNotes.every(note => !(this._pattern.notes.includes(note) && callback(note) === true))
    }
}

/** Stacks all notes in range to the left side so that they're all touching.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 */
export class ChangeStackLeftAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length === 0) { return; }

        if (x1 !== 0) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1)); }
        if (x2 !== doc.song.partsPerPattern) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2)); }

        let firstNote = false;
        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { break; }

            if (!firstNote) {
                firstNote = true;
                note.start = x1;
                note.end = note.start + note.pins[note.pins.length - 1].time;
            } else if (i > 0) {
                note.start = pattern.notes[i - 1].end;
                note.end = note.start + note.pins[note.pins.length - 1].time;
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/**
 * Represents an array with metadata for how to use it. Used in ChangeStepAcross.
 * 
 * An array can be a list of numbers or math strings that evaluate to a number.
 * - math strings are simple expressions like "random() * 2 == 0 ? x : 0" or "42" and have access to Math (no prefix).
 * They also have these "x" for current value, "i" and "len" for index and length of the source defined by per.
 * - type is how the array index is determined. Both normal and step pick the nearest index, and normal lerps between their values
 *   - normal: nearest index is picked, then the fractional difference is used as a ratio to perform lerp between this and next index.
 *   - step: nearest index is picked by rounding down.
 *   - cycle: picks indices sequentially, restarting when it reaches the end
 * - per is the ratio used to pick array index, all are current-to-length ratios.
 *   - note: Uses a ratio of note index / note count among notes affected
 *   - pin: Uses a ratio of pin index / pins count per note
 *   - time: Uses a ratio of current note time (minus selection start) + pin time / total note time among notes affected.
 * Pin time is only added if iterating pins.
*/
export interface IStepArray {
    array: (number|string)[]
    type?: 'normal'|'step'|'cycle' // across-lerp is default
    per?: 'note'|'pin'|'time' // note is default
}

/** Represents the full options set of ChangeStepAcross for all arrays and their metadata, refer to function.
 * 
 * - volAdd/mult: multiplies, or adds to existing volume. Values are normalized to 0-1.
 * - pitchAdd/mult multiplies, or adds to existing pitches. Values are 0 to pitch limit.
 * - insertPinsEvery: inserts pins at regular intervals. Must be an integer > 0.
 * 
 * Arrays are evaluated in this order: first pins are inserted, if any, then iterating over pins, the volume functions run
 * (multiply, then add). Then similarly while iterating over pitches.
*/
export interface IStepData {
    volAdd?: IStepArray
    volMult?: IStepArray
    pitchAdd?: IStepArray
    pitchMult?: IStepArray
    insertPinsEvery?: number
}

/** Adjusts volume/pitch across the given range using arrays of expressions & numbers to add and multiply.
 * 
 * You supply value(s) to multiply or add, in that order, and they're applied according to the interpretation behavior,
 * multiplied by current/total fraction. See stepAcrossPresets in Selection.ts for many examples.
 * See IStepData and IStepArray for details.
 * 
 * @param data Any of a few arrays to multiply or add (in that order) volume and pitch.
*/
export class ChangeStepAcross extends ChangeSequence {
    constructor(doc: SongDocument, channelIndex: number, pattern: Pattern, data: IStepData, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);

        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length === 0) { return; }

        // Split now and re-merge later if needed.
        let intersects = getIntersects(doc, pattern, x1, x2, this);

        // Find the start/end indices to find how many notes are in range.
        let note: Note;
        let firstIndex = intersects.L !== -1 ? intersects.L + 1 : -1;
        let endIndex = intersects.R !== -1 ? intersects.R - 1 : -1;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { endIndex = i - 1; break; }
            if (firstIndex === -1) { firstIndex = i; }
        }
        if (endIndex === -1) { endIndex = pattern.notes.length - 1; }

        // Runs unsafe eval on user-provided expressions in the array, substituting math and injecting for x, i, len
        // for convenience. This doesn't strip non-alphanumeric characters, so exploits may be possible and this is ok
        // as long as it remains a user-only operation (no cross-user or server sharing).
        const matchVariables = new RegExp('(?<!\w)([a-zA-Z]+)\w*', 'gm')
        const resolve = (entry: string | number, val: number, index: number, length: number) => {
            if (typeof entry === 'number') { return entry; }

            try {
                entry = +eval(entry.replaceAll(matchVariables, match => {
                        match = match.trim().toLowerCase();

                        return Object.hasOwn(Math, match) ? `Math.${match}`
                            : Object.hasOwn(Math, match.toUpperCase()) ? `Math.${match.toUpperCase()}`
                            : match === 'x' ? String(val)
                            : match === 'i' ? String(index)
                            : match === 'len' ? String(length)
                            : ''}));

                return (typeof entry === 'number' && !isNaN(entry) && isFinite(entry)) ? entry : 0;
            } catch {
                return 0;
            }
        }

        // This subfunction picks the ratio based on desired type, and gets the actual value from the array.
        const getArrayValue = (val: number, index: number, ratios: number[], lengths: number[], stepArray: IStepArray | undefined) => {
            if (!stepArray) { return undefined; }
            if (ratios.length === 3 && stepArray?.array.length !== 0) {
                const slot =
                    stepArray?.per === 'note' ? 0 :
                    stepArray?.per === 'pin' ? 1 :
                    2;

                if (stepArray.type !== 'cycle') {
                    const numbersLR = [
                        resolve(stepArray.array[Math.floor(ratios[slot] * stepArray.array.length)], val, index, lengths[slot]),
                        resolve(stepArray.array[Math.ceil(ratios[slot] * stepArray.array.length)], val, index, lengths[slot])];
                    let fraction = ratios[slot] * stepArray.array.length - Math.floor(ratios[slot] * stepArray.array.length)
                    return stepArray.type === 'step' ? numbersLR[0] : numbersLR[0] + fraction * (numbersLR[1] - numbersLR[0])
                }
                
                return resolve(stepArray.array[lengths[slot] % stepArray.array.length], val, index, lengths[slot]);
            }

            return undefined;
        }

        const pitchLimit = doc.song.getChannelIsNoise(channelIndex) ? Config.drumCount - 1 : Config.maxPitch;
        const noteCount = endIndex - firstIndex + 1;
        let volMultValue = 1;
        let volAddValue = 0;
        let pitchMultValue = 1;
        let pitchAddValue = 0;

        let noteRatio: number;
        let notePinOrPitchRatio: number;
        let timeRatio: number;
        let lengths: number[];
        let ratios: number[];
        
        for (let i = firstIndex; i < endIndex + 1; i++) {
            note = pattern.notes[i];
            noteRatio = (i - firstIndex) / noteCount;

            // Insert first
            if (data.insertPinsEvery && data.insertPinsEvery > 0) {
                let pin: NotePin;
                let prevPin: NotePin;
                let timeSince: number;
                let lerpTime: number;
                for (let j = 1; j < note.pins.length; j++) {
                    pin = note.pins[j];
                    prevPin = note.pins[j - 1];
                    timeSince = pin.time - prevPin.time;
                    for (let k = 0; k < timeSince; k++) {
                        if ((prevPin.time + k) % data.insertPinsEvery === 0) {
                            lerpTime = k/timeSince;
                            note.pins.splice(j - 1, 0, {
                                ...prevPin,
                                interval: Math.round(prevPin.interval + lerpTime * (pin.interval - prevPin.interval)),
                                size: Math.round(prevPin.size + lerpTime * (pin.size - prevPin.size)),
                                time: prevPin.time + k
                            })
                            j++;
                        }
                    }
                }
            }

            // Pins
            if (data.volAdd || data.volMult) {
                lengths = [noteCount, note.pins.length, pattern.notes[endIndex].end - pattern.notes[firstIndex].start]
                for (let j = 0; j < note.pins.length; j++) {
                    notePinOrPitchRatio = j / lengths[1];
                    timeRatio = (note.start - pattern.notes[firstIndex].start + note.pins[note.pins.length - 1].time) / lengths[2];
                    ratios = [noteRatio, notePinOrPitchRatio, timeRatio];
    
                    volMultValue = getArrayValue(note.pins[j].size, j, ratios, lengths, data.volMult) ?? volMultValue;
                    volAddValue = getArrayValue(note.pins[j].size, j, ratios, lengths, data.volAdd) ?? volAddValue;
    
                    // Perform.
                    note.pins[j].size *= volMultValue;
                    note.pins[j].size = Math.round(note.pins[j].size + volAddValue * Config.noteSizeMax);
                    note.pins[j].size = Math.max(Math.min(note.pins[j].size, Config.noteSizeMax), 0);
                }
            }

            // Pitches
            if (data.pitchAdd || data.pitchMult) {
                lengths = [noteCount, note.pitches.length, pattern.notes[endIndex].end - pattern.notes[firstIndex].start]
                timeRatio = (note.start - pattern.notes[firstIndex].start) / lengths[2];
                for (let j = 0; j < note.pitches.length; j++) {
                    notePinOrPitchRatio = j / lengths[1];
                    ratios = [noteRatio, notePinOrPitchRatio, timeRatio];
    
                    pitchMultValue = getArrayValue(note.pitches[j], j, ratios, lengths, data.pitchMult) ?? pitchMultValue;
                    pitchAddValue = getArrayValue(note.pitches[j], j, ratios, lengths, data.pitchAdd) ?? pitchAddValue;
    
                    // Perform.
                    note.pitches[j] = note.pitches[j] * (pitchMultValue * Config.noteSizeMax);
                    note.pitches[j] = Math.round(note.pitches[j] + pitchAddValue * Config.noteSizeMax);
                    note.pitches[j] = Math.max(Math.min(note.pitches[j], pitchLimit), 0);
                }
    
                note.pitches = [...new Set(note.pitches)]; // Keep unique.
                const highestPitch = note.pitches.reduce((prev, curr) => Math.max(prev, curr));
                note.pins.forEach(pin => pin.interval = Math.max(Math.min(highestPitch + pin.interval, pitchLimit), 0));    
            }

            // If pins were interacted with, remove excess pins to avoid creating UI frustrations later.
            if (data.insertPinsEvery || data.volAdd || data.volMult) {
                removeRedundantPins(note.pins);
            }
        }

        // Notes should only remain split if pitch was edited, otherwise re-merge them.
        if (!data.pitchAdd && !data.pitchMult) {
            if (intersects.L !== -1) {
                this.append(new ChangeMergeAcross(doc, pattern, pattern.notes[intersects.L].start, pattern.notes[intersects.L + 1].end))
                intersects.R--;
            }
            if (intersects.R > -1) {
                this.append(new ChangeMergeAcross(doc, pattern, pattern.notes[intersects.R - 1].start, pattern.notes[intersects.R].end))
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Spreads notes horizontally across the given range such that they have equal space between. Centers single notes.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
*/
export class ChangeSpreadAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length === 0) { return; }

        if (x1 !== 0) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1)); }
        if (x2 !== doc.song.partsPerPattern) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2)); }

        // Get the total free space available and number of notes in the range.
        let note: Note;
        let totalSpace = 0;
        let firstIndex = -1;
        let finalIndex = -1;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { finalIndex = i - 1; break; }

            if (firstIndex === -1) {
                firstIndex = i;
                totalSpace += note.start - x1;
            } else {
                totalSpace += note.start - pattern.notes[i - 1].end;
            }
        }
        if (finalIndex === -1) { finalIndex = pattern.notes.length - 1; }
        totalSpace += x2 - pattern.notes[finalIndex].end;

        if (totalSpace === 0) { return; }

        // Stack left, leaving no space.
        const spaceBetween = totalSpace / (finalIndex - firstIndex);
        this.append(new ChangeStackLeftAcross(doc, pattern, x1, x2));

        // Add space between.
        for (let i = firstIndex; i < finalIndex + 1; i++) {
            note = pattern.notes[i];

            if (i === firstIndex) {
                // Center an individual note, if only one.
                if (firstIndex === finalIndex) {
                    note.start += Math.round(totalSpace / 2);
                    note.end = note.start + note.pins[note.pins.length - 1].time;
                    if (note.start !== 0) { note.continuesLastPattern = false; }
                }
            } else {
                note.start += Math.floor(spaceBetween * (i - firstIndex));
                note.end = note.start + note.pins[note.pins.length - 1].time;
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Spreads notes vertically (pitch edit) in a de/crescendo via slope detection, between detected bounds for the given
 * range. Chorused notes are placed using the computed center pitch as the origin, so that the difference in pitch
 * remains unaffected. (Note: rounding may cause drift between consecutive applications of this operation, and merge touching
 * pitches within the same note.)
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
*/
export class ChangeSpreadVertical extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length <= 1) { return; }

        if (x1 !== 0) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1)); }
        if (x2 !== doc.song.partsPerPattern) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2)); }

        // Get the note count, the min/max pitch of every note + overall min/max, and detect slope.
        let note: Note;
        let noteCount = 0;
        let indices: { start: number, end: number } = {} as any;
        let vertBounds = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
        let notePitches: { min: number, max: number }[] = [];
        let slope = 0;

        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { break; }

            noteCount++;
            indices = { start: indices.start ?? i, end: i };
            notePitches[i - indices.start] = getVerticalBounds([note], note.start, note.end);
            vertBounds = {
                min: Math.min(vertBounds.min, notePitches[i - indices.start].min),
                max: Math.max(vertBounds.max, notePitches[i - indices.start].max)
            };

            // The trendline informs whether to force a crescendo ( slope>=0), or a decrescendo.
            if (i - indices.start > 0) {
                const last = notePitches[i - indices.start - 1];
                const curr = notePitches[i - indices.start];
                const oldCenter = last.min + (last.max - last.min)/2;
                const center = curr.min + (curr.max - curr.min)/2;
                slope += center - oldCenter;
            }
        }

        if (noteCount < 2) { return; }
        if (vertBounds.max === vertBounds.min) { return; }

        // Get the total bounds.
        const vertRange = vertBounds.max - vertBounds.min;
        const verticalSpaceBetween = vertRange / (noteCount - 1);

        // Set the new note pitches based on ratio of the ranges, following trendline.
        let targetPitch: number;
        let nearestEdgeToTarget: number;
        let offset: number;

        for (let i = indices.start; i <= indices.end; i++) {
            note = pattern.notes[i];
            targetPitch = slope >= 0
                ? vertBounds.min + verticalSpaceBetween * (i - indices.start) //crescendo
                : vertBounds.max - verticalSpaceBetween * (i - indices.start); //decrescendo

            let range = notePitches[i - indices.start];
            nearestEdgeToTarget =
                ((range.min >= targetPitch) ? range.min // bottom
                : (targetPitch >= range.max) ? range.max // top
                : range.min + (range.max - range.min)/2); // center

            offset = targetPitch - nearestEdgeToTarget;

            // Add offset to pitch. For some reason this results in mathematical anomalies
            // at large range differences, which is compensated by bruteforce measure-and-fix :|
            let overageLow = 0;
            let overageHigh = 0;
            note.pitches = note.pitches.map((pitch) =>
            {
                pitch = Math.round(pitch + offset); 
                if (pitch > vertBounds.max) {
                    overageHigh = Math.max(overageHigh, pitch - vertBounds.max);
                    pitch = vertBounds.max;
                } else if (pitch < vertBounds.min) {
                    overageLow = Math.max(overageLow, vertBounds.min - pitch);
                    pitch = vertBounds.min;
                }

                return pitch;
            });

            note.pitches = note.pitches.map((pitch) => pitch - overageHigh + overageLow);
            note.pitches = [...new Set(note.pitches)]; // Keep unique.
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Randomly nudges notes in range left/right by 1 time unit if possible. (Note: this is a weak implementation because
 * it goes left-to-right, thus requiring the edges to move to create the space needed to nudge notes in the center of
 * several touching notes.)
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
*/
export class ChangeTapNotesAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length === 0) { return; }

        if (x1 !== 0) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1)); }
        if (x2 !== doc.song.partsPerPattern) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2)); }

        let canTapLeft: boolean;
        let canTapRight: boolean;
        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.start < x2 && note.end > x1) {
                canTapLeft = note.start > x1
                    && (i == 0 || note.start - pattern.notes[i - 1].end > 0);

                canTapRight = note.end < x2
                    && note.end < doc.song.partsPerPattern
                    && (i === pattern.notes.length - 1 || pattern.notes[i + 1].start - note.end > 0);

                if (canTapLeft && Math.random() >= 0.5) { note.start--; note.end--; }
                if (canTapRight && Math.random() >= 0.5) { note.start++; note.end++; }
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Horizontally flips notes notes in the given range, or flips them in-place.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 * @param inPlace If true, reverses pins without changing any note positions.
 */
export class ChangeMirrorHorizontal extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, inPlace?: boolean, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length === 0) { return; }

        if (x1 !== 0) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1)); }
        if (x2 !== doc.song.partsPerPattern) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2)); }

        let note: Note;
        const firstNote = pattern.notes[0].clone();
        let startDist: number;
        let endDist: number;

        const center = (x1 + x2) / 2;

        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { break; }
            if (!inPlace || note.pins[note.pins.length - 1].interval !== 0) {
                note.continuesLastPattern = false;
            }

            for (let j = 0; j < note.pins.length; j++) {
                note.pins[j].time = Math.abs(note.pins[j].time - note.pins[note.pins.length - 1].time);
            }
            note.pins.reverse();

            // It's so simple...but it was too hard for me to compute. So here's 2 functions.
            if (!inPlace) {
                if (note.start < center) {
                    endDist = center - note.end;
                    note.start = center + endDist
                } else {
                    startDist = note.start - center;
                    note.start = center - startDist - note.pins[note.pins.length - 1].time;
                }

                note.end = note.start + note.pins[note.pins.length - 1].time;
            }
        }
        pattern.notes.sort((a, b) => a.start - b.start);

        // Restore last pattern continuation if the mirrored note starts at x=0 and has same pitches.
        if (!inPlace && firstNote.start === 0
            && pattern.notes[0].start === 0
            && pattern.notes[0].pitches.every((pitch, index) => pitch === firstNote.pitches[index])) {
                pattern.notes[0].continuesLastPattern = firstNote.continuesLastPattern;
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Stretch/shrink notes by position proportionate to the selected range containing them, and transpose to a new range. Notes will
 * automatically get mirrored if x2 < x1.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 * 
 * x1b, x2b define the location of the new range.
*/
export class ChangeStretchHorizontal extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1b: number, x2b: number, x1?: number, x2?: number) {
        super();

        x2b = Math.min(x2b, doc.song.partsPerPattern);
        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern
            || x1b < 0 || x2b < 0 || x1b == x2b || x1b > doc.song.partsPerPattern || x2b > doc.song.partsPerPattern
            || (x1 === x1b && x2 == x2b)) {
            return;
        }

        if (x1 !== 0) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1)); }
        if (x2 !== doc.song.partsPerPattern) { this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2)); }

        if (x2b < x1b) {
            this.append(new ChangeMirrorHorizontal(doc, pattern, true, x1, x2));
            [x1b, x2b] = [x2b, x1b] //swap
        }

        const newNotes: Note[] = [];
        const scaleFactor = (x2b - x1b) / (x2 - x1);

        // Construct stretched notes
        let note: Note;
        let prevNote: Note | null = null;
        let newNote: Note;
        let oldRangeStart = -1, oldRangeEnd = -1;
        let newRangeStart = -1, newRangeEnd = -1;
        let minCompressedSize = 0;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            // Track which notes are in the deletion ranges. All notes to be stretched will be in the old range.
            if (note.start >= x2 && note.start >= x2b) { break; }
            if (note.end > x1b && note.start < x2b) {
                if (newRangeStart === -1) { newRangeStart = i; }
            }
            if (note.end > x1 && note.start < x2) {
                if (oldRangeStart === -1) { oldRangeStart = i; }

                // The new range must be at least this big to avoid loss.
                minCompressedSize += note.pins.length;

                // transpose the note, then stretch it to hold at minimum its pins.
                newNote = note.clone();
                newNote.start = Math.round(newNote.start + x1b - x1);
                newNote.end += x1b - x1;

                let prevPin: NotePin | null = null;
                for (const pin of newNote.pins) {
                    // Stretch the pins, but don't allow them to overlap. Assumes they're sorted by time.
                    pin.time = Math.round(pin.time * scaleFactor);
                    if (prevPin && pin.time === prevPin.time) {
                        pin.time += 1;
                    }

                    prevPin = pin;
                }
                newNote.end = Math.round(Math.max(
                    newNote.start + newNote.pins[newNote.pins.length - 1].time,
                    newNote.start + newNote.pins.length - 1));

                // Move notes so they don't overlap.
                if (prevNote && newNote.start < prevNote.end) {
                    newNote.end += prevNote.end - newNote.start;
                    newNote.start = prevNote.end;
                }

                newNotes.push(newNote);
                prevNote = newNote;
            }
            
            if (note.start >= x2 && oldRangeEnd === -1) { oldRangeEnd = i; }
            if (note.start >= x2b && newRangeEnd === -1) { newRangeEnd = i; }
        }

        // Do nothing if overly shrunk or out of bounds.
        if (x2b - x1b < minCompressedSize ||
            newNotes.length === 0 ||
            newNotes[newNotes.length - 1].end > x2b) {
            return;
        }

        // When there are no notes to the right of the range(s).
        if (oldRangeEnd === -1) { oldRangeEnd = pattern.notes.length; }
        if (newRangeEnd === -1) { newRangeEnd = pattern.notes.length; }

        // Delete the notes in the old range, then replace the notes in the new range.
        const oldRangeToDelete = pattern.notes.slice(oldRangeStart, oldRangeEnd);
        const newRangeToDelete = pattern.notes.slice(newRangeStart, newRangeEnd).filter((note) => !oldRangeToDelete.includes(note));
        this.append(new ChangeNotesAdded(doc, pattern, oldRangeToDelete, []));
        this.append(new ChangeNotesAdded(doc, pattern, newRangeToDelete, newNotes));
        doc.notifier.changed();
        this._didSomething();
    }
}

/** Stretch/shrink note pitches proportionate to the selected range containing them using their center pitch as the
 * origin for stretching. The stretch factor is a multiply and/or added value, both which may be negative. Negative
 * stretch will mirror the notes across their pitch.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 * @param multBy A multiplier, which if negative will mirror the notes across their computed center pitch.
 * @param add This is added to the pitch of all notes.
 * @param yOrig Instead of detecting the original note bounds, uses this range when provided. This is useful when the
 * function is iteratively applied per-note and those notes need the context of their combined range
 * */
export class ChangeStretchVerticalRelative extends ChangeSequence {
    constructor(doc: SongDocument, channelIndex: number, pattern: Pattern,
        multBy?: number, add?: number, perNote?: boolean, x1?: number, x2?: number, yOrig?: { min: number, max: number }) {
        super();

        const pitchLimit = doc.song.getChannelIsNoise(channelIndex) ? Config.drumCount - 1 : Config.maxPitch;
        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length === 0) { return; }

        multBy ??= 1;
        add ??= 0;

        const bounds = yOrig ?? getVerticalBounds(pattern.notes, x1, x2);
        const stretch = (xStart: number, xEnd: number, yRange: { min: number, max: number }) => {
            const halfDist = (yRange.max - yRange.min) / 2;
            const center = yRange.min + halfDist;
            this.append(new ChangeStretchVertical(doc, channelIndex, pattern,
                Math.max(center - (halfDist * multBy) - add/2, 0),
                Math.min(center + (halfDist * multBy) + add/2, pitchLimit),
                yRange, xStart, xEnd));
        }

        if (perNote) {
            let note: Note;
            for (note of pattern.notes) {
                if (note.end <= x1) { continue; }
                if (note.start >= x2) { break; }
                stretch(note.start, note.end, bounds);
            }
        } else {
            stretch(x1, x2, bounds);
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Stretch/shrink a section of notes vertically to fit a new vertical range. yMax < yMin can mirror notes.
 * 
 * x1, x2 defaults to active selection and are intended to be overridden to control where the operation works.
 * 
 * yMin, yMax define the location of the new range.
 * @param yOrig Instead of detecting the original note bounds, uses this range when provided. This is useful when the
 * function is iteratively applied per-note and those notes need the context of their combined range
 */
export class ChangeStretchVertical extends ChangeSequence {
    constructor(doc: SongDocument, channelIndex: number, pattern: Pattern,
        yMin: number, yMax: number, yOrig?: { min: number, max: number }, x1?: number, x2?: number) {
        super();

        const pitchLimit = doc.song.getChannelIsNoise(channelIndex) ? Config.drumCount - 1 : Config.maxPitch;
        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern
            || yMin < 0 || yMin > pitchLimit
            || yMax < 0 || yMax > pitchLimit) { return; }
        if (pattern.notes.length === 0) { return; }

        const bounds = yOrig ?? getVerticalBounds(pattern.notes, x1, x2);
        let origRange = bounds.max - bounds.min;
        let newRange = yMax - yMin;
        if (origRange === 0) { origRange = 1; newRange = 1; } // only transpose if same-line.

        let note: Note;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            if (note.end <= x1) { continue; }
            if (note.start >= x2) { break; }

            // Pins are relative to pitches, so they'll fit when multiplied by the ratio of the ranges.
            for (let j = 0; j < note.pins.length; j++) {
                note.pins[j].interval = Math.round(note.pins[j].interval * (newRange / origRange));
            }

            // Pitches are set to a lerped position of new range based on their position in the old range.
            let origDistance: number;
            for (let j = 0; j < note.pitches.length; j++) {
                origDistance = (note.pitches[j] - bounds.min) / origRange;
                note.pitches[j] = Math.round(yMin + origDistance * newRange);
            }
            note.pitches = [...new Set(note.pitches)].sort() // Keep it unique and sorted.
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Returns the pitches of the lowest and highest point among all notes in the given range. */
export function getVerticalBounds(notes: Note[], x1: number, x2: number) {
    let absoluteMax = 0;
    let absoluteMin = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].end <= x1) { continue; }
        if (notes[i].start >= x2) { break; }

        // For all notes in selection range
        let pinMax = 0;
        let pinMin = Number.MAX_SAFE_INTEGER;

        // Find vertical min/max among pins.
        for (let j = 0; j < notes[i].pins.length; j++) {
            pinMax = Math.max(pinMax, notes[i].pins[j].interval);
            pinMin = Math.min(pinMin, notes[i].pins[j].interval);
        }

        // The vertical min/max among pitches + pin min/max gives the highest/lowest points in a note.
        for (let j = 0; j < notes[i].pitches.length; j++) {
            absoluteMax = Math.max(absoluteMax, notes[i].pitches[j] + pinMax);
            absoluteMin = Math.min(absoluteMin, notes[i].pitches[j] + pinMin);
        }
    }

    return { min: absoluteMin, max: absoluteMax };
}

/** For the given range, returns the indices of the notes that cross the boundaries on left and right. -1 indicates
 * that side does not cross boundaries. x1,x2 define the range.
 * @param appendSplits Splits at the bounds for convenience, and adjusts indices.R accordingly.
 */
export function getIntersects(doc: SongDocument, pattern: Pattern, x1: number, x2: number, appendSplits?: ChangeSequence) {
    const indices = {L: -1, R: -1};
    for (let i = 0; i < pattern.notes.length; i++) {
        if (indices.L === -1 && (pattern.notes[i].start < x1 && pattern.notes[i].end > x1)) {
            indices.L = i;
        }
        if (indices.R === -1 && (pattern.notes[i].start < x2 && pattern.notes[i].end > x2)) {
            indices.R = i;
            break;
        }
    }

    if (appendSplits) {
        if (indices.L !== -1) {
            appendSplits.append(new ChangeSplitNotesAtPoint(doc, pattern, x1));
        }
        if (indices.R !== -1) {
            appendSplits.append(new ChangeSplitNotesAtPoint(doc, pattern, x2));
        }
        // Rightmost index moves due to split operation(s).
        if (indices.R !== -1) {
            indices.R += (indices.L !== -1) ? 2 : 1;
        }
    }

    return indices;
}