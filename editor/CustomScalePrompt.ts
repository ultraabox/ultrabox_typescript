// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { Config } from "../synth/SynthConfig";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { ChangeCustomScale } from "./changes";
import { ColorConfig } from "./ColorConfig";


//namespace beepbox {
const { button, div, h2, p } = HTML;

export class CustomScalePrompt implements Prompt {
    private readonly _flags: boolean[] = [];
    private readonly _scaleFlags: HTMLInputElement[] = [];
    private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
    private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");

    private readonly _editorWidth: number = 240;
    private readonly _editorHeight: number = 100;
    private readonly _keys: SVGRectElement[] = [];
    private readonly _keyNames: SVGTextElement[];
    private readonly _highlights: SVGRectElement[] = [];
    private readonly _svg: SVGSVGElement;

    public readonly container: HTMLDivElement;

    constructor(private _doc: SongDocument) {
        this._flags = _doc.song.scaleCustom.slice();
        this._keyNames = [];
        for (let i: number = 0; i < Config.pitchesPerOctave; i++) {
            this._keyNames[i] = SVG.text({ style: "font-size: 12px;", "fill": ColorConfig.invertedText, "text-anchor": "middle", "dominant-baseline": "central", "pointer-events": "none", "font-weight": "bolder" });
        }

        let whiteKeyCount: number = 0;
        const blackKeys: SVGGElement[] = [];
        const sortedKeys: SVGGElement[] = [];
        const shift: number = CustomScalePrompt.getPitchName(this._doc.song.key, 0).length == 2 ? this._editorWidth * 1 / 10 : 0;
        const editorWidth: number = this._editorWidth - shift - (CustomScalePrompt.getPitchName(this._doc.song.key, 11).length == 2 ? this._editorWidth * 1 / 10 : 0);
        for (let i: number = 0; i < Config.pitchesPerOctave; i++) {
            const text = CustomScalePrompt.getPitchName(this._doc.song.key, i);
            const isBlackKey: boolean = text.length == 2;
            this._keyNames[i].textContent = text;
            this._keyNames[i].setAttribute("fill", isBlackKey ? ColorConfig.blackPianoKeyText : ColorConfig.whitePianoKeyText);

            const width: number = isBlackKey ? editorWidth * 1 / 10 : editorWidth * 1 / 7;
            const height: number = isBlackKey ? this._editorHeight * 2 / 3 : this._editorHeight;
            let x: number = (isBlackKey ? whiteKeyCount * editorWidth / 7 - width / 2 : whiteKeyCount * editorWidth / 7) + shift;
            let y: number = isBlackKey ? -4 : 0;

            const key: SVGRectElement = SVG.rect({ fill: isBlackKey ? ColorConfig.blackPianoKey : ColorConfig.whitePianoKey });

            key.setAttribute("x", String(x));
            key.setAttribute("y", String(y));
            this._keyNames[i].setAttribute("x", String(x + width / 2));
            this._keyNames[i].setAttribute("y", String(y + height - 20));
            key.setAttribute("width", String(width));
            key.setAttribute("height", String(height));

            const highlight: SVGRectElement = SVG.rect({ x: x, y: y + height - 3, width: width, height: 3, fill: ColorConfig.primaryText });
            //SVG.polygon({ points: `${x},${y + height} ${x + width / 2},${y + height - 10} ${x + width},${y + height}`, fill: ColorConfig.primaryText });
            this._highlights.push(highlight);

            const wrappedKey: SVGGElement = SVG.g(
                key,
                //shadows
                SVG.rect({ x: x, y: y, width: 1, height: height, rx: "0.6", fill: "rgba(255,255,255,0.4)" }),
                SVG.path({ d: `M ${x + 3} ${y + height - 3} L ${x + width - 3} ${y + height - 3} L ${x + width - 3} 0 L ${x + width} -1 L ${x + width} ${y + height} L ${x} ${y + height} z`, fill: "rgba(0,0,0,0.7)" }),
                SVG.rect({ x: x, y: y, width: width, height: height / 2, rx: "0.6", fill: "url(#shadow)" }),
                highlight
            );
            if (isBlackKey) blackKeys.push(wrappedKey);
            else sortedKeys.push(wrappedKey);
            whiteKeyCount += +!isBlackKey;

            this._keys.push(key);

            //don't let users toggle the base key, since that apparently causes issues
            if (i > 0) wrappedKey.addEventListener("click", () => { this._flags[i] = !this._flags[i]; this._render(); });
        }
        for (const blackKey of blackKeys) {
            sortedKeys.push(blackKey);
        }

        this._svg = SVG.svg({ style: `background-color: ${ColorConfig.editorBackground}; touch-action: none;`, width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" },
            SVG.defs(
                SVG.linearGradient({ id: "shadow", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
                    SVG.stop({ offset: "0%", "stop-color": "rgba(0,0,0,0.5)" }),
                    SVG.stop({ offset: "100%", "stop-color": "transparent" })
                )
            ),
            ...sortedKeys,
            ...this._keyNames
        );

        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);

        this.container = div({ class: "prompt noSelection", style: "width: 250px;" },
            h2("Custom Scale"),
            p("Here, you can make your own scale to use in your song. Press the keys below to toggle which notes of an octave are in the scale. For this to work, you'll need to have the \"Custom\" scale selected."),
            div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end;" },
                this._svg
            ),
            div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
                this._okayButton,
            ),
            this._cancelButton,
        )
        this.container.addEventListener("keydown", this.whenKeyPressed);
        this._render();
    }

    private static getPitchName(key: number, index: number): string {
        let text: string = "";
        const pitchNameIndex = (key + index) % 12;
        if (Config.keys[pitchNameIndex].isWhiteKey) {
            text = Config.keys[pitchNameIndex].name;
        } else {
            const shiftDir: number = Config.blackKeyNameParents[key % Config.pitchesPerOctave];
            text = Config.keys[(pitchNameIndex + Config.pitchesPerOctave + shiftDir) % Config.pitchesPerOctave].name;
            if (shiftDir == 1) {
                text += "♭";
            } else if (shiftDir == -1) {
                text += "♯";
            }
        }

        return text;
    }

    private _render = (): void => {
        for (let i: number = 0; i < Config.pitchesPerOctave; i++) {
            this._keyNames[i].style.filter = this._flags[i] ? "brightness(0.5)" : "";
            this._keys[i].style.filter = this._flags[i] ? "brightness(0.5)" : "";
            this._highlights[i].style.display = this._flags[i] ? "" : "none";
        }
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