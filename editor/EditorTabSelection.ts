import { ColorConfig } from "./ColorConfig";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Slider } from "./HTMLWrapper";
import { PatternEditor, SelectionMode } from "./PatternEditor";
import { SongDocument } from "./SongDocument";

const { button, div, label, input } = HTML;

/** This contains the controls for the Selection tab in the song editor. */
export class EditorTabSelection {
    public htmlEntryPoint: HTMLDivElement;

    private _doc: SongDocument;
    private _patternEditor: PatternEditor;
    private _selectionModeMoveLabel: HTMLDivElement;
    private _selectionModeStretchLabel : HTMLDivElement;
    private _selectionModeLabel : HTMLDivElement;
    private _merge : HTMLButtonElement;
    private _mergeAll : HTMLInputElement;
    private _bridge : HTMLButtonElement;
    private _bridgeBend : HTMLInputElement;
    private _spread : HTMLButtonElement;
    private _spreadPitch : HTMLInputElement;
    private _flatten : HTMLButtonElement;
    private _flattenPitch : HTMLInputElement;
    private _mirrorH : HTMLButtonElement;
    private _mirrorV : HTMLButtonElement;
    private _split : HTMLButtonElement;
    private _splitSlider : Slider;
    private _splitAbsolute : HTMLInputElement;
    private _splitAcross : HTMLInputElement;
    private _splitLabel : HTMLDivElement;

    constructor(doc: SongDocument, patternEditor: PatternEditor, tipHandler: (tipName: string) => void) {
        this._doc = doc;
        this._patternEditor = patternEditor;
        this._constructHTML(tipHandler);
    }

    private _constructHTML(tipHandler: (tipName: string) => void) {
        const _selectionOpsDescription = div({ style: `padding: 3px 0; max-width: 15em; text-align: center; color: ${ColorConfig.secondaryText};` }, "Selection");
        this._selectionModeLabel = div({ style: `padding: 3px 0; color: ${ColorConfig.secondaryText};` }, "Move mode");
        const _selectionModeBtnMove = input({ type: "radio", name: "selection-mode-radio-group", class: "tab-settings-radio" });
        this._selectionModeMoveLabel = div({ class: "tab-settings-radio selected-tab" }, "↤");
        const _selectionModeBtnStretch = input({ type: "radio", name: "selection-mode-radio-group", class: "tab-settings-radio" });
        this._selectionModeStretchLabel = div({ class: "tab-settings-radio" }, "↔");
        const  _selectionModeButtonsGroup: HTMLDivElement = div({ class: "tab-settings-buttons-group" },
            div({ class: "tab-settings-radiodiv" }, _selectionModeBtnMove, this._selectionModeMoveLabel),
            div({ class: "tab-settings-radiodiv" }, _selectionModeBtnStretch, this._selectionModeStretchLabel)
        );
        this._merge = button({ class: "selectionOps-actionbutton noteOpMerge" });
        this._mergeAll = input({ type: "checkbox", class: "selectionOps-checkbox"});
        this._bridge = button({ class: "selectionOps-actionbutton noteOpBridge" });
        this._bridgeBend = input({ type: "checkbox", class: "selectionOps-checkbox"});
        this._spread = button({ class: "selectionOps-actionbutton noteOpSpread" });
        this._spreadPitch = input({ type: "checkbox", class: "selectionOps-checkbox"});
        this._mirrorH = button({ class: "selectionOps-actionbutton noteOpMirror" });
        this._mirrorV = button({ class: "selectionOps-actionbutton noteOpMirror", style: 'transform: rotate(90deg);' });
        this._flatten = button({ class: "selectionOps-actionbutton noteOpFlatten" });
        this._flattenPitch = input({ type: "checkbox", class: "selectionOps-checkbox"});
        this._split = button({ class: "selectionOps-actionbutton noteOpSplit" });
        this._splitLabel = div({ class: "tip", onclick: () => tipHandler("selectionSplit") }, "");
        this._splitSlider = new Slider(
            input({ title: "cuts", style: "width: 6rem; flex-grow: 1; margin-left: 0.5rem;", type: "range", min: "1", max: String(Math.floor(this._doc.song.partsPerPattern / 2)), value: "1", step: "1" }), this._doc, null, false);
        this._splitAcross = input({ type: "checkbox", class: "selectionOps-checkbox"});
        this._splitAbsolute = input({ type: "checkbox", class: "selectionOps-checkbox"});
        const _selectionOpsRow1 = div({ class: "selectionOps-row"},
            div({ class: "selectionOps-action"},
                div({ class: "tip", onclick: () => tipHandler("selectionMerge") }, "Merge"),
                div({ class: "selectionOps-action-controls"},
                    this._merge,
                    label({ class: "checkbox-container" }, this._mergeAll, "All"))),
            div({ class: "selectionOps-action"},
                div({ class: "tip", onclick: () => tipHandler("selectionBridge") }, "Bridge"),
                div({ class: "selectionOps-action-controls"},
                    this._bridge,
                    label({ class: "checkbox-container" }, this._bridgeBend, "Bend"))),
            div({ class: "selectionOps-action"},
                div({ class: "tip", onclick: () => tipHandler("selectionSpread") }, "Spread"),
                div({ class: "selectionOps-action-controls"},
                    this._spread,
                    label({ class: "checkbox-container" }, this._spreadPitch, "Pitch")))
        );

        const _selectionOpsRow2 = div({ class: "selectionOps-row"},
            div({ class: "selectionOps-action"},
                div({ class: "tip", onclick: () => tipHandler("selectionMirror") }, "Mirror"),
                div({ class: "selectionOps-row-inside"},
                    div({ class: "selectionOps-action-controls"}, this._mirrorH),
                    div({ class: "selectionOps-action-controls"}, this._mirrorV))),
            div({ class: "selectionOps-action"},
                div({ class: "tip", onclick: () => tipHandler("selectionFlatten") }, "Flatten"),
                div({ class: "selectionOps-action-controls"},
                    this._flatten,
                    label({ class: "checkbox-container" }, this._flattenPitch, "Pitch")))
        );

        const _selectionOpsRow3 = div({ class: "selectionOps-row"},
            div({ class: "selectionOps-action"},
                this._splitLabel,
                div({ class: "selectionOps-action-controls"},
                    div({ class: "selectionOps-row-inside"},
                        this._split,
                        this._splitSlider.container),
                    div({ class: "selectionOps-row-inside"},
                        label({ class: "checkbox-container" }, this._splitAcross, "Across"),
                        label({ class: "checkbox-container" }, this._splitAbsolute, "Absolute"))))
        );

        _selectionModeBtnMove.addEventListener("change", () => this._whenSelectionModeChanged(SelectionMode.Move));
        _selectionModeBtnStretch.addEventListener("change", () => this._whenSelectionModeChanged(SelectionMode.Stretch));

        [this._merge, this._bridge, this._spread,
            this._mirrorH, this._mirrorV, this._flatten,
            this._split]
            .forEach((o) => o.addEventListener("click", this._whenSettingButtonClicked));

        this._splitSlider.input.addEventListener("input", this._updateSplitSliderLabel);
        this._splitSlider.input.addEventListener("change", this._updateSplitSliderLabel);
        this._splitAcross.addEventListener("change", this._updateSplitSliderLabel);
        this._splitAbsolute.addEventListener("change", this._updateSplitSliderLabel);
        this._updateSplitSliderLabel(); // Set initial label.

        this.htmlEntryPoint = div({},
            _selectionOpsDescription,
            this._selectionModeLabel,
            _selectionModeButtonsGroup,
            _selectionOpsRow1,
            _selectionOpsRow2,
            _selectionOpsRow3);
    }

    private _whenSelectionModeChanged = (type: SelectionMode): void => {
        [
            {type: SelectionMode.Move, obj: this._selectionModeMoveLabel},
            {type: SelectionMode.Stretch, obj: this._selectionModeStretchLabel}
        ].forEach((entry) => {
            if (type == entry.type) {
                if (!entry.obj.classList.contains('selected-tab')) { entry.obj.classList.add('selected-tab') }
            } else {
                entry.obj.classList.remove('selected-tab')
            }
        })

        this._patternEditor.switchEditingMode(type);
        this._selectionModeLabel.innerText = (type === SelectionMode.Move) ? "Move mode" : "Stretch mode";
    }

    private _whenSettingButtonClicked = (event: MouseEvent): void => {
        if (event.target === this._merge) {
            this._doc.selection.noteMerge(!this._mergeAll.checked);
        } else if (event.target === this._bridge) {
            this._doc.selection.noteBridge(this._bridgeBend.checked, false);
        } else if (event.target === this._spread) {
            this._doc.selection.noteSpreadAcross(this._spreadPitch.checked);
        } else if (event.target === this._flatten) {
            this._doc.selection.noteFlattenAcross(!this._flattenPitch.checked);
        } else if (event.target === this._mirrorH) {
            this._doc.selection.noteMirrorAcross(false);
        } else if (event.target === this._mirrorV) {
            this._doc.selection.noteMirrorAcross(true);
        } else if (event.target === this._split) {
            this._doc.selection.noteSplitAcross(Number(this._splitSlider.input.value),
            this._splitAbsolute.checked, !this._splitAcross.checked)
        }
    }

    private _updateSplitSliderLabel = (): void => {
        const num = this._splitSlider.input.valueAsNumber;
        this._splitLabel.innerText =
            this._splitAcross.checked && !this._splitAbsolute.checked
                ? `Split ${num} times`:
            !this._splitAcross.checked && !this._splitAbsolute.checked
                ? `Split each note ${num} times`:
            !this._splitAcross.checked && this._splitAbsolute.checked
                ? `Split every ${num} parts per note`:
            `Split every ${num} parts`;
    }
}