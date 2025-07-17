// Copyright (c) 2025 ThinkAndWander and contributing authors, distributed under the MIT license, per the accompanying LICENSE.md file.

import { Config } from "../synth/SynthConfig";
import { NotePin, Note, Pattern } from "../synth/synth";
import { ChangeSequence } from "./Change";
import { SongDocument } from "./SongDocument";
import { ChangeNoteAdded, ChangeNotesAdded, ChangeSplitNotesAtPoint, ChangeSplitNotesAtSelection } from "./changes";

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

export class ChangeMergeAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, x1?: number, x2?: number) {
        super();

        x1 = x1 ?? (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 = x2 ?? (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.beatsPerBar * Config.partsPerBeat);
        if (x1 < 0 || x2 <= x1 || x2 > doc.song.beatsPerBar * Config.partsPerBeat) { return; }
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

export class ChangeBridgeAcross extends ChangeSequence {
    private _notesInserted: {insertAt: number, note: Note}[] = [];
    private _pattern: Pattern;
    constructor(doc: SongDocument, pattern: Pattern, doBends: boolean, copyEnds: boolean) {
        super();
        this._pattern = pattern;

        if (pattern.notes.length == 0) { return; }

        let note: Note;
        let prevNote: Note | null;
        let noteLeftOfSelection: number | null = null;
        for (let i = 0; i < pattern.notes.length; i++) {
            note = pattern.notes[i];

            // Skip out-of-bounds notes
            if (doc.selection.patternSelectionActive) {
                if (note.end <= doc.selection.patternSelectionStart) {
                    noteLeftOfSelection = i;
                    continue;
                }
                if (note.start >= doc.selection.patternSelectionEnd) {
                    break;
                }
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

export class ChangeSegmentizeAcross extends ChangeSequence {
    private _pattern: Pattern;
    private _splitNotes: Note[] = [];
    private _cuts: number[] = [];
    constructor(doc: SongDocument, pattern: Pattern, numCuts: number, x1?: number, x2?: number) {
        super();
        this._pattern = pattern;

        x1 = x1 ?? (doc.selection.patternSelectionActive ? doc.selection.patternSelectionStart : 0);
        x2 = x2 ?? (doc.selection.patternSelectionActive ? doc.selection.patternSelectionEnd : doc.song.beatsPerBar * Config.partsPerBeat);

        const range = x2 - x1;
        if (numCuts < 1) { return; }
        if (numCuts > 1 && range <= 1) { return; }

        let cutIndices: number[] = [];

        if (numCuts === 1) { cutIndices.push(x1); }
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
     * Performs a callback per-note for all segments created. Only includes matching notes.
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

export class ChangeDivideSelfAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern) {
        super();
        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtPoint(doc, pattern, doc.selection.patternSelectionStart));
            doc.notifier.changed();
            this._didSomething();
        }
    }
}

export class ChangeFlattenAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern) {
        super();

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
        }

        for (const note of pattern.notes) {
            if (doc.selection.patternSelectionActive && (note.end <= doc.selection.patternSelectionStart || note.start >= doc.selection.patternSelectionEnd)) {
                continue;
            }

            // TODO
        }
    }
}

export class ChangeStackLeftAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern) {
        super();

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
        }

        for (const note of pattern.notes) {
            if (doc.selection.patternSelectionActive && (note.end <= doc.selection.patternSelectionStart || note.start >= doc.selection.patternSelectionEnd)) {
                continue;
            }

            // TODO
        }
    }
}

export class ChangeSpreadAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern) {
        super();

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
        }

        for (const note of pattern.notes) {
            if (doc.selection.patternSelectionActive && (note.end <= doc.selection.patternSelectionStart || note.start >= doc.selection.patternSelectionEnd)) {
                continue;
            }

            // TODO
        }
    }
}

export class ChangeMirrorAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, mirrorVertically: boolean) {
        super();

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
        }

        for (const note of pattern.notes) {
            if (doc.selection.patternSelectionActive && (note.end <= doc.selection.patternSelectionStart || note.start >= doc.selection.patternSelectionEnd)) {
                continue;
            }

            // TODO
        }
    }
}

export class ChangeStretchAcross extends ChangeSequence {
    constructor(doc: SongDocument, pattern: Pattern, oldX1: number, oldX2: number, newX1: number, newX2: number) {
        super();

        newX2 = Math.min(newX2, doc.song.beatsPerBar * Config.partsPerBeat);

        if (oldX1 < 0 || oldX2 <= oldX1 || newX1 < 0 || newX2 <= newX1) { return; }

        if (doc.selection.patternSelectionActive) {
            this.append(new ChangeSplitNotesAtSelection(doc, pattern));
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
                newNote.start = Math.round((newNote.start + newX1 - oldX1) * scaleFactor);
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
        const oldRangeToDelete = pattern.notes.slice(oldRangeStart, oldRangeEnd)
        const newRangeToDelete = pattern.notes.slice(newRangeStart, newRangeEnd)
        this.append(new ChangeNotesAdded(doc, pattern, oldRangeToDelete, []));
        this.append(new ChangeNotesAdded(doc, pattern, newRangeToDelete, newNotes));
        doc.notifier.changed();
        this._didSomething();
    }
}