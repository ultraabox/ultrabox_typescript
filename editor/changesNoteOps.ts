import { NotePin, Note, Pattern, Config } from "../synth/synth";
import { ChangeSequence } from "./Change";
import { SongDocument } from "./SongDocument";
import { ChangeNoteAdded, ChangeNotesAdded, ChangeSplitNotesAtPoint, ChangeSplitNotesAtSelection } from "./changes";

/** Merge notes that touch into one. */
export class ChangeMergeAcrossAdjacent extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern) {
        super();

        if (pattern.notes.length === 0) {
            return;
        }

        let found: boolean;

        do {
            found = false;
            for (let i = 0; i < pattern.notes.length; i++) {
                const note = pattern.notes[i];

                // Note must be within selection bounds.
                if (doc.selection.patternSelectionActive &&
                    (note.end <= doc.selection.patternSelectionStart || note.start >= doc.selection.patternSelectionEnd)) {
                    continue;
                }

                if (i > 0) {
                    const lastNote = pattern.notes[i - 1];

                    // Last note can't be compared if it's outside selection.
                    if (doc.selection.patternSelectionActive &&
                        (lastNote.end <= doc.selection.patternSelectionStart || lastNote.start >= doc.selection.patternSelectionEnd)) {
                        continue;
                    }

                    // If this and last note are touching and have the same pitches, merges them.
                    if (note.pitches[0] + note.pins[0].interval === lastNote.pitches[0] + lastNote.pins[lastNote.pins.length - 1].interval
                        && note.start === lastNote.end
                        && note.pitches.length === lastNote.pitches.length && note.pitches.every((pitch) => lastNote.pitches.includes(pitch))) {
                        this.append(new ChangeMergeAcross(doc, pattern, lastNote.start, note.end));
                        found = true;
                        break;
                    }
                }
            }
        } while (found);

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Merge notes in selected range. */
export class ChangeMergeAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length == 0) { return; }

        let firstNoteIndex = 0;
        let firstNote: Note | null = null;
        let lastNote: Note | null = null;
        const notesMergedOver: Note[] = [];
        let notePinList: NotePin[] = [];

        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];
            if (note.end <= x1) {
                continue;
            }
            if (note.start >= x2) {
                break;
            }

            if (!firstNote) {
                firstNote = note;
                firstNoteIndex = i;
                notesMergedOver.push(note);
                notePinList = firstNote.pins;
            }

            if (note.end <= x2 && (!lastNote || note.end > lastNote.end)) {
                lastNote = note;
            }
            
            if (note != firstNote) {
                // Accumulate pins across notes (adjust relative values based on first note)
                for (const pin of note.pins) {
                    const newPin = {
                        interval: note.pitches[0] + pin.interval - firstNote.pitches[0],
                        size: pin.size,
                        time: note.start - firstNote.start + pin.time
                    };

                    // If the last note's ending pin is fully redundant with the start of the new note, or if it has
                    // a length of 1, delete the last note's ending pin. Else, if they have the same time but aren't
                    // identical, nudge the last note's end pin backwards 1 unit of time.
                    if (notePinList.length > 0) {
                        const lastPin = notePinList[notePinList.length - 1];
                        const pinBeforeLast = notePinList.length > 1 ? notePinList[notePinList.length - 2] : null;
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

                // We need to remove these later.
                notesMergedOver.push(note);
            }
        }

        // Nothing to merge if entire range is one note, or if no notes were found in range.
        if (firstNote === lastNote || !firstNote || !lastNote) {
            return;
        }

        // Delete all notes within range
        for (const note of notesMergedOver) {
            this.append(new ChangeNoteAdded(doc, pattern, note, firstNoteIndex, true));
        }

        // Span first note to the end note length and recreate all other notes as pins.
        let firstNoteCopy = firstNote.clone();
        firstNoteCopy.end = lastNote.end;
        firstNoteCopy.pins = notePinList;
        this.append(new ChangeNoteAdded(doc, pattern, firstNoteCopy, firstNoteIndex, false));
        doc.notifier.changed();
        this._didSomething();
    }
}

/** Bridge between notes in selected range. */
export class ChangeBridgeAcross extends ChangeSequence {
    private _notesInserted: {insertAt: number, note: Note}[] = [];
    private _pattern: Pattern;
    constructor(doc: SongDocument, pattern: Pattern, doBends: boolean, copyEnds: boolean, x1?: number, x2?: number) {
        super();
        this._pattern = pattern;

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.partsPerPattern) { return; }
        if (pattern.notes.length == 0) { return; }

        let note: Note;
        let prevNote: Note | null;
        let noteLeftOfSelection: number | null = null;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            // Skip out-of-bounds notes
            if (note.end <= x1) {
                noteLeftOfSelection = i;
                continue;
            }
            if (note.start >= x2) {
                break;
            }

            // Don't bridge from the note left of selection to first within.
            if (doc.selection.patternSelectionActive && i - 1 == noteLeftOfSelection) { continue; }

            if (i > 0) {
                prevNote = pattern.notes[i - 1];
                if (note.start - prevNote.end > 0) {
                    const startSize = copyEnds ? prevNote.pins[0].size : prevNote.pins[prevNote.pins.length - 1].size;
                    const newNote = new Note(-1, prevNote.end, note.start, startSize, false);

                    // Adjust pitch so first pin has 0 interval
                    newNote.pitches = [];
                    for (let pitch of prevNote.pitches) {
                        newNote.pitches.push(pitch + prevNote.pins[prevNote.pins.length - 1].interval);
                    }

                    if (doBends) {
                        newNote.pins[1].interval = note.pitches[0] - newNote.pitches[0] + note.pins[0].interval;
                        newNote.pins[1].size = note.pins[0].size;
                    } else if (copyEnds) {
                        newNote.pins[1].size = prevNote!.pins[prevNote.pins.length - 1].size;
                    }

                    this._notesInserted.push({ insertAt: i, note: newNote });
                }
            }
        }

        if (this._notesInserted.length === 0) {
            return;
        }
        for (let i = 0; i < this._notesInserted.length; i++) {
            this.append(new ChangeNoteAdded(doc, pattern, this._notesInserted[i].note, this._notesInserted[i].insertAt + i, false));
        }

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
            const match = this._pattern.notes.findIndex((note) => note === entry.note);
			if (match !== -1 && callback(entry.note)) { return; }
        }
    }
}

/** Draw cuts across notes in selected range. */
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
        if (numCuts < 1) { return; }
        if (numCuts >= 1 && range <= 1) { return; }

        let cutIndices: number[] = [];

        if (numCuts === 1) { cutIndices.push(Math.round((x1 + x2) / 2)); }
        else {
            const chunk = Math.max(range / (numCuts + 1), 1); // Never less than 1 for time.
            for (let i = 1; i < numCuts + 1; i++) {
                // Always cut integer sizes or greater; never the same spot twice.
                const cut = Math.round(x1 + chunk * i)
                if (cutIndices.length === 0 || cutIndices[cutIndices.length - 1] !== cut) {
                    cutIndices.push(cut)
                }
            }
        }

        for (let i = 0; i < cutIndices.length; i++) {
            const splitOp = new ChangeSplitNotesAtPoint(doc, pattern, cutIndices[i]);
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

        for (const note of this._splitNotes) {
            const match = this._pattern.notes.findIndex((note2) => note2 === note);
			if (match !== -1 && callback(note)) { return; }
        }
    }
}

/** Stacks all notes in range to the left side so that they're all touching. */
export class ChangeStackLeftAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtPoint(doc, pattern, doc.selection.patternSelectionStart));
        }

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1) { return; }
        if (pattern.notes.length === 0) { return; }

        let firstNote = false;
        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.start < x2 && note.end > x1) {
                if (!firstNote) {
                    firstNote = true;
                    note.start = x1;
                    note.end = note.start + note.pins[note.pins.length - 1].time;
                } else if (i > 0) {
                    const prevNote = pattern.notes[i - 1];
                    note.start = prevNote.end;
                    note.end = note.start + note.pins[note.pins.length - 1].time;
                }
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Cumulatively shifts every note up or down with an optional vertical multiplier. Makes crescendos and descendos. */
export class ChangeStepAcross extends ChangeSequence {
    constructor(doc: SongDocument, channelIndex: number, pattern: Pattern, step?: number, x1?: number, x2?: number) {
        super();

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtPoint(doc, pattern, doc.selection.patternSelectionStart));
        }

        const pitchLimit = doc.song.getChannelIsNoise(channelIndex) ? Config.drumCount - 1 : Config.maxPitch;

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        step ??= 1;

        if (x1 < 0 || x2 <= x1) { return; }
        if (pattern.notes.length === 0) { return; }

        let firstIndex = -1;
        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.start < x2 && note.end > x1) {
                if (firstIndex === -1) { firstIndex = i; }
                note.pitches = note.pitches.map((pitch) => Math.min(Math.max(pitch + step * (i - firstIndex), 0), pitchLimit));
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Spreads notes in range evenly across it. */
export class ChangeSpreadAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1) { return; }
        if (pattern.notes.length === 0) { return; }

        this.append(new ChangeSplitNotesAtPoint(doc, pattern, x1));
        this.append(new ChangeSplitNotesAtPoint(doc, pattern, x2));

        // Get the total free space available and number of notes in the range.
        let firstNote = false;
        let totalSpace = 0;
        let noteCount = 0;
        let finalIndex = -1;
        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.start < x2 && note.end > x1) {
                noteCount++;
                if (!firstNote) {
                    firstNote = true;
                    totalSpace += note.start - x1;
                } else {
                    totalSpace += note.start - pattern.notes[i - 1].end;
                }

                finalIndex = i;
            }
        }
        if (finalIndex > -1) {
            totalSpace += x2 - pattern.notes[finalIndex].end;
        }

        if (noteCount === 0 || totalSpace === 0) { return; }

        // Stack left, leaving no space.
        const spaceBetween = totalSpace / (noteCount - 1);
        this.append(new ChangeStackLeftAcross(doc, pattern, x1, x2));

        // Add space between.
        let firstIndex = -1;
        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.start < x2 && note.end > x1) {
                if (firstIndex === -1) {
                    firstIndex = i;
                } else {
                    note.start += Math.floor(spaceBetween * (i - firstIndex));
                    note.end = note.start + note.pins[note.pins.length - 1].time;
                }
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Randomly nudges notes in range left/right by 1 time unit if possible. */
export class ChangeTapNotesAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1) { return; }
        if (pattern.notes.length === 0) { return; }

        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.start < x2 && note.end > x1) {
                const canTapLeft = note.start > x1
                    && (i == 0 || note.start - pattern.notes[i - 1].end > 0);

                const canTapRight = note.end < x2
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

/** Mirrors notes in the given range horizontally. */
export class ChangeMirrorHorizontal extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, inPlace?: boolean, x1?: number, x2?: number) {
        super();

        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        const center = (x1 + x2) / 2;
        
        if (x1 < 0 || x2 <= x1) { return; }
        if (pattern.notes.length === 0) { return; }

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
        }

        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.end > x1 && note.start < x2) {
                for (let j = 0; j < note.pins.length; j++) {
                    note.pins[j].time = Math.abs(note.pins[j].time - note.pins[note.pins.length - 1].time);
                }
                note.pins.reverse();

                // It's so simple...but it was too hard for me to compute. So here's 2 functions.
                if (!inPlace) {
                    if (note.start < center) {
                        const endDist = center - note.end;
                        note.start = center + endDist
                    } else {
                        const startDist = note.start - center;
                        note.start = center - startDist - note.pins[note.pins.length - 1].time;
                    }

                    note.end = note.start + note.pins[note.pins.length - 1].time;
                }
            }
        }
        pattern.notes.sort((a, b) => a.start - b.start); // Keep it sorted.

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Stretch/shrink the selected range and transpose it to the new location. newX2 < newX1 can mirror notes. */
export class ChangeStretchHorizontal extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, oldX1: number, oldX2: number, newX1: number, newX2: number) {
        super();

        newX2 = Math.min(newX2, doc.song.partsPerPattern);

        if (oldX1 < 0 || oldX2 <= oldX1 || newX1 < 0 || newX2 < 0 || newX1 == newX2
            || newX1 > doc.song.partsPerPattern || newX2 > doc.song.partsPerPattern
            || (oldX1 === newX1 && oldX2 == newX2)) {
            return;
        }

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
        }

        if (newX2 < newX1) {
            this.append(new ChangeMirrorHorizontal(doc, pattern, true, oldX1, oldX2));
            [newX1, newX2] = [newX2, newX1] //swap
        }

        const newNotes: Note[] = [];
        const scaleFactor = (newX2 - newX1) / (oldX2 - oldX1);

        // Construct stretched notes
        let note: Note;
        let prevNote: Note | null = null;
        let oldRangeStart = -1, oldRangeEnd = -1;
        let newRangeStart = -1, newRangeEnd = -1;
        let minCompressedSize = 0;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            // Track which notes are in the deletion ranges. All notes to be stretched will be in the old range.
            if (note.end > newX1 && note.start < newX2) {
                if (newRangeStart === -1) { newRangeStart = i; }
            }
            if (note.end > oldX1 && note.start < oldX2) {
                if (oldRangeStart === -1) { oldRangeStart = i; }

                // The new range must be at least this big to avoid loss.
                minCompressedSize += note.pins.length;

                // transpose the note, then stretch it to hold at minimum its pins.
                const newNote = note.clone();
                newNote.start = Math.round(newNote.start + newX1 - oldX1);
                newNote.end += newX1 - oldX1;

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
            
            if (note.start >= oldX2 && oldRangeEnd === -1) { oldRangeEnd = i; }
            if (note.start >= newX2 && newRangeEnd === -1) { newRangeEnd = i; }
        }

        // Do nothing if overly shrunk or out of bounds.
        if (newX2 - newX1 < minCompressedSize ||
            newNotes.length === 0 ||
            newNotes[newNotes.length - 1].end > newX2) {
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

/** Stretch/shrink a section of notes vertically across center with a multiplier/addition for all or every note. */
export class ChangeStretchVerticalRelative extends ChangeSequence {
    constructor(doc: SongDocument, channelIndex: number, pattern: Pattern,
        multBy?: number, add?: number, perNote?: boolean, x1?: number, x2?: number, yOrig?: { min: number, max: number }) {
        super();

        const pitchLimit = doc.song.getChannelIsNoise(channelIndex) ? Config.drumCount - 1 : Config.maxPitch;
        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        if (x1 < 0 || x2 <= x1) { return; }
        if (pattern.notes.length === 0) { return; }

        multBy ??= 1;
        add ??= 0;        

        const stretch = (notes: Note[], bounds?: { min: number, max: number }) => {
            const newBounds = {...(bounds ?? yOrig ?? getVerticalBounds(notes, x1, x2))};
            const halfDist = (newBounds.max - newBounds.min) / 2;
            const center = newBounds.min + halfDist;
            this.append(new ChangeStretchVertical(doc, channelIndex, pattern,
                Math.max(center - (halfDist * multBy) - add/2, 0),
                Math.min(center + (halfDist * multBy) + add/2, pitchLimit),
                newBounds, x1, x2));
        }

        if (perNote) {
            pattern.notes.forEach(note => stretch([note], yOrig ?? getVerticalBounds(pattern.notes, x1, x2)));
        } else {
            stretch(pattern.notes);
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/**
 * Stretch/shrink a section of notes vertically to fit a new vertical range. yMax < yMin can mirror notes.
 * @param yMin Bottom of the new vertical range in absolute units
 * @param yMax Top of the new vertical range in absolute units
 * @param x1 Start of selection range, which defaults to active selection if any, or left side
 * @param x2 End of selection range, which defaults to active selection if any, or right side
 * @param yOrig Instead of detecting the original note bounds, uses this range when provided (range not safety-checked). This
 * is useful when the function is iteratively applied per-note and those notes need the context of their combined range
 */
export class ChangeStretchVertical extends ChangeSequence {
    constructor(doc: SongDocument, channelIndex: number, pattern: Pattern,
        yMin: number, yMax: number, yOrig?: { min: number, max: number }, x1?: number, x2?: number) {
        super();

        const pitchLimit = doc.song.getChannelIsNoise(channelIndex) ? Config.drumCount - 1 : Config.maxPitch;
        x1 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 ??= (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.partsPerPattern);
        
        if (x1 < 0 || x2 <= x1 || yMin < 0 || yMin > pitchLimit || yMax < 0 || yMax > pitchLimit) { return; }
        if (pattern.notes.length === 0) { return; }

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
        }

        const bounds = yOrig ?? getVerticalBounds(pattern.notes, x1, x2);
        let origRange = bounds.max - bounds.min;
        let newRange = yMax - yMin;
        if (origRange === 0) { origRange = 1; newRange = 1; } // only transpose if same-line.

        for (let i = 0; i < pattern.notes.length; i++) {
            const note = pattern.notes[i];

            if (note.end > x1 && note.start < x2) {
                // Pins are relative to pitches, so they'll fit when multiplied by the ratio of the ranges.
                for (let j = 0; j < note.pins.length; j++) {
                    note.pins[j].interval = Math.round(note.pins[j].interval * (newRange / origRange));
                }

                // Pitches are set to a lerped position of new range based on their position in the old range.
                for (let j = 0; j < note.pitches.length; j++) {
                    const origDistance = (note.pitches[j] - bounds.min) / origRange;
                    note.pitches[j] = Math.round(yMin + origDistance * newRange);
                }
                note.pitches = [...new Set(note.pitches)].sort() // Keep it unique and sorted.
            }
        }

        doc.notifier.changed();
        this._didSomething();
    }
}

/** Returns the pitches of the lowest and highest point among all notes in the given range. */
function getVerticalBounds(notes: Note[], x1: number, x2: number) {
    let absoluteMax = 0;
    let absoluteMin = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];

        // For all notes in selection range
        if (note.end > x1 && note.start < x2) {
            let pinMax = 0;
            let pinMin = Number.MAX_SAFE_INTEGER;
    
            // Find vertical min/max among pins.
            for (let j = 0; j < note.pins.length; j++) {
                pinMax = Math.max(pinMax, note.pins[j].interval);
                pinMin = Math.min(pinMin, note.pins[j].interval);
            }
    
            // The vertical min/max among pitches + pin min/max gives the highest/lowest points in a note.
            for (let j = 0; j < note.pitches.length; j++) {
                absoluteMax = Math.max(absoluteMax, note.pitches[j] + pinMax);
                absoluteMin = Math.min(absoluteMin, note.pitches[j] + pinMin);
            }
        }
    }

    return { min: absoluteMin, max: absoluteMax };
}