// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { Config } from "../synth/SynthConfig";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { ChangeCustomScale } from "./changes";


//namespace beepbox {
const { button, div, h2, input, p } = HTML;

export class CustomScalePrompt implements Prompt {
    private readonly _flags: boolean[] = [];
    private readonly _scaleFlags: HTMLInputElement[] = [];
    private readonly _scaleRows: HTMLDivElement[] = [];
    private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
    private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");

    public readonly container: HTMLDivElement;

    constructor(private _doc: SongDocument) {
        this._flags = _doc.song.scaleCustom.slice();
        let scaleHolder: HTMLDivElement = div({});
        for (var i = 1; i < Config.pitchesPerOctave; i++) {
            this._scaleFlags[i] = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;", "checked": this._flags[i], "value": i });
            this._scaleRows[i] = div({ style: "text-align: right; height: 2em;" },
                "Note " + i + ":",
                this._scaleFlags[i]
            );
            scaleHolder.appendChild(this._scaleRows[i])
        }

        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);

        this.container = div({ class: "prompt noSelection", style: "width: 250px;" },
            h2("Custom Scale"),
            p("Here, you can make your own scale to use in your song. Press the checkboxes below to toggle which notes of an octave are in the scale. For this to work, you'll need to have the \"Custom\" scale selected."),
            div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end;" },
                scaleHolder,
            ),
            div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
                this._okayButton,
            ),
            this._cancelButton,
        )
        this.container.addEventListener("keydown", this.whenKeyPressed);
    }

    private _close = (): void => {
        this._doc.undo();
    }

    public cleanUp = (): void => {
        this._okayButton.removeEventListener("click", this._saveChanges);
        this._cancelButton.removeEventListener("click", this._close);
        this.container.removeEventListener("keydown", this.whenKeyPressed);
    }

    public whenKeyPressed = (event: KeyboardEvent): void => {
        if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
            this._saveChanges();
        }
    }
    

    private _saveChanges = (): void => {
        for (var i = 1; i < this._scaleFlags.length; i++) {
            this._flags[i] = this._scaleFlags[i].checked;
        }
        this._doc.prompt = null;
        this._doc.record(new ChangeCustomScale(this._doc, this._flags));
    }
}
//}
