// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Prompt } from "./Prompt";
import { SongDocument } from "./SongDocument";

import { PatternEditor } from "./PatternEditor";
// import { ColorConfig } from "./ColorConfig";

//namespace beepbox {
const { button, div, h2, input, p, a} = HTML;
let doReload = false;
export class CustomPrompt implements Prompt {
	private readonly _fileInput: HTMLInputElement = input({ type: "file", accept: ".png,.jpg,.jpeg,.gif", text: "choose editor background image"});
	private readonly _fileInput2: HTMLInputElement = input({ type: "file", accept: ".png,.jpg,.jpeg,.gif", text: "choose website background image" });
	private readonly _colorInput: HTMLInputElement = input({ type: "text", value: localStorage.getItem("customColors") || `:root {
		--page-margin: #040410;
		--editor-background: #040410;
		--hover-preview: white;
		--playhead: rgba(255, 255, 255, 0.9);
		--primary-text: white;
		--secondary-text: #84859a;
		--inverted-text: black;
		--text-selection: rgba(119,68,255,0.99);
		--box-selection-fill: #044b94;
		--loop-accent: #74f;
		--link-accent: #98f;
		--ui-widget-background: #393e4f;
		--ui-widget-focus: #6d6886;
		--pitch-background: #393e4f;
		--tonic: #725491;
		--fifth-note: #54547a;
		--white-piano-key: #eee;
		--black-piano-key: #666;
		--white-piano-key-text: #131200;
		--black-piano-key-text: #fff;
		--use-color-formula: true;
		--track-editor-bg-pitch: #393e4f;
		--track-editor-bg-pitch-dim: #1c1d28;
		--track-editor-bg-noise: #3d3535;
		--track-editor-bg-noise-dim: #161313;
		--track-editor-bg-mod: #283560;
		--track-editor-bg-mod-dim: #0a101f;
		--multiplicative-mod-slider: #606c9f;
		--overwriting-mod-slider: #6850b5;
		--indicator-primary: #9c64f7;
		--indicator-secondary: #393e4f;
		--select2-opt-group: #5d576f;
		--input-box-outline: #222;
		--mute-button-normal: #dda85d;
		--mute-button-mod: #886eae;
		--mod-label-primary: #282840;
		--mod-label-secondary-text: rgb(87, 86, 120);
		--mod-label-primary-text: white;
		--pitch-secondary-channel-hue: 0;
		--pitch-secondary-channel-hue-scale: 6.5;
		--pitch-secondary-channel-sat: 83.3;
		--pitch-secondary-channel-sat-scale: 0.1;
		--pitch-secondary-channel-lum: 40;
		--pitch-secondary-channel-lum-scale: 0.05;
		--pitch-primary-channel-hue: 0;
		--pitch-primary-channel-hue-scale: 6.5;
		--pitch-primary-channel-sat: 100;
		--pitch-primary-channel-sat-scale: 0.1;
		--pitch-primary-channel-lum: 67.5;
		--pitch-primary-channel-lum-scale: 0.05;
		--pitch-secondary-note-hue: 0;
		--pitch-secondary-note-hue-scale: 6.5;
		--pitch-secondary-note-sat: 93.9;
		--pitch-secondary-note-sat-scale: 0.1;
		--pitch-secondary-note-lum: 25;
		--pitch-secondary-note-lum-scale: 0.05;
		--pitch-primary-note-hue: 0;
		--pitch-primary-note-hue-scale: 6.5;
		--pitch-primary-note-sat: 100;
		--pitch-primary-note-sat-scale: 0.05;
		--pitch-primary-note-lum: 85.6;
		--pitch-primary-note-lum-scale: 0.025;
		--noise-secondary-channel-hue: 0;
		--noise-secondary-channel-hue-scale: 2;
		--noise-secondary-channel-sat: 25;
		--noise-secondary-channel-sat-scale: 0;
		--noise-secondary-channel-lum: 42;
		--noise-secondary-channel-lum-scale: 0;
		--noise-primary-channel-hue: 0;
		--noise-primary-channel-hue-scale: 2;
		--noise-primary-channel-sat: 33;
		--noise-primary-channel-sat-scale: 0;
		--noise-primary-channel-lum: 63.5;
		--noise-primary-channel-lum-scale: 0;
		--noise-secondary-note-hue: 0;
		--noise-secondary-note-hue-scale: 2;
		--noise-secondary-note-sat: 33.5;
		--noise-secondary-note-sat-scale: 0;
		--noise-secondary-note-lum: 55;
		--noise-secondary-note-lum-scale: 0;
		--noise-primary-note-hue: 0;
		--noise-primary-note-hue-scale: 2;
		--noise-primary-note-sat: 46.5;
		--noise-primary-note-sat-scale: 0;
		--noise-primary-note-lum: 74;
		--noise-primary-note-lum-scale: 0;
		--mod-secondary-channel-hue: 192;
		--mod-secondary-channel-hue-scale: 1.5;
		--mod-secondary-channel-sat: 88;
		--mod-secondary-channel-sat-scale: 0;
		--mod-secondary-channel-lum: 50;
		--mod-secondary-channel-lum-scale: 0;
		--mod-primary-channel-hue: 192;
		--mod-primary-channel-hue-scale: 1.5;
		--mod-primary-channel-sat: 96;
		--mod-primary-channel-sat-scale: 0;
		--mod-primary-channel-lum: 80;
		--mod-primary-channel-lum-scale: 0;
		--mod-secondary-note-hue: 192;
		--mod-secondary-note-hue-scale: 1.5;
		--mod-secondary-note-sat: 92;
		--mod-secondary-note-sat-scale: 0;
		--mod-secondary-note-lum: 45;
		--mod-secondary-note-lum-scale: 0;
		--mod-primary-note-hue: 192;
		--mod-primary-note-hue-scale: 1.5;
		--mod-primary-note-sat: 96;
		--mod-primary-note-sat-scale: 0;
		--mod-primary-note-lum: 85;
		--mod-primary-note-lum-scale: 0;
		--disabled-note-primary:    #91879f;
		--disabled-note-secondary:  #6a677a;
	}`});
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");
	private readonly _resetButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size);" }, "Reset to defaults");

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 300px;" },
		h2("Import"),
		p({ style: "text-align: left; margin: 0.5em 0;" },
			"You can upload images to create a custom theme. The first image will become the editor background, and the second image will be tiled across the webpage.",
		),
		// p({ style: "text-align: left; margin: 0.5em 0;" },
		// 	"The first image will become the editor background, and the second image will be tiled across the webpage.",
		// ),
		div({ style: "text-align: left; margin-top: 0.5em; margin-bottom: 0.5em;" },
			"You can find a list of custom themes made by other users on the ",
			a({ target: "_blank", href: "https://docs.google.com/spreadsheets/d/1dGjEcLgJrPwzBExPmwA9pbE_KVQ3jNrnTBrd46d2IKo/edit" }, "custom theme sheet."),
        ),
		div(),
		p({ style: "text-align: left; margin: 0;" },
			"Editor Background Image:",
			this._fileInput
		),
		p({ style: "text-align: left; margin: 0.5em 0;"},
			"Website Background Image:",
			this._fileInput2
		),
		div(),
		p({ style: "text-align: left; margin: 0;"},
			"Replace the text below with your custom theme data to load it:",
		),
		this._colorInput,
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._resetButton
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);
	// private readonly lastTheme: string | null = window.localStorage.getItem("colorTheme")

	constructor(private _doc: SongDocument, private _pattern: PatternEditor, private _pattern2: HTMLDivElement, private _pattern3: HTMLElement) {
		this._fileInput.addEventListener("change", this._whenFileSelected);
		this._fileInput2.addEventListener("change", this._whenFileSelected2);
		this._colorInput.addEventListener("change", this._whenColorsChanged);
		this._okayButton.addEventListener("click", this._close);
		this._cancelButton.addEventListener("click", this._close);
		this._resetButton.addEventListener("click", this._reset);
	}

	private _close = (): void => {
		this._doc.prompt = null;
		this._doc.undo();
		if(doReload) {
			// The prompt seems to get stuck if reloading is done too quickly.
			setTimeout(() => { window.location.reload(); }, 50);
		}
	}

	public cleanUp = (): void => {
		this._okayButton.removeEventListener("click", this._close);
		this._cancelButton.removeEventListener("click", this._close);
		// this.container.removeEventListener("keydown", this._whenKeyPressed);
		this._resetButton.removeEventListener("click", this._reset);
	}
	private _reset = (): void => {
		window.localStorage.removeItem("colorTheme");
		window.localStorage.removeItem("customTheme");
		window.localStorage.removeItem("customTheme2");
		window.localStorage.removeItem("customColors");
		this._pattern._svg.style.backgroundImage = "";
		document.body.style.backgroundImage = "";
		this._pattern2.style.backgroundImage = "";
		this._pattern3.style.backgroundImage = "";
		const secondImage: HTMLElement | null = document.getElementById("secondImage");
		if (secondImage != null) {
			secondImage.style.backgroundImage = "";
		}
		doReload = true;
		this._close();
	}
	private _whenColorsChanged = (): void => {
		localStorage.setItem("customColors", this._colorInput.value);
		window.localStorage.setItem("colorTheme", "custom");
		this._doc.colorTheme = "custom";
		doReload = true;
	}
	private _whenFileSelected = (): void => {
		const file: File = this._fileInput.files![0];
		if (!file) return;
		const reader: FileReader = new FileReader();
		reader.addEventListener("load", (event: Event): void => {
			//this._doc.prompt = null;
			//this._doc.goBackToStart();
			let base64 = <string>reader.result;
			window.localStorage.setItem("customTheme", base64);
			const value = `url("${window.localStorage.getItem('customTheme')}")`
			console.log('setting', value)
			this._pattern._svg.style.backgroundImage = value;
			console.log('done')
		});
		reader.readAsDataURL(file);
	}
	private _whenFileSelected2 = (): void => {
		const file: File = this._fileInput2.files![0];
		if (!file) return;
		const reader: FileReader = new FileReader();
		reader.addEventListener("load", (event: Event): void => {
			//this._doc.prompt = null;
			//this._doc.goBackToStart();
			let base64 = <string>reader.result;
			window.localStorage.setItem("customTheme2", base64);
			const value = `url("${window.localStorage.getItem('customTheme2')}")`
			document.body.style.backgroundImage = `url(${base64})`;
			this._pattern2.style.backgroundImage = value;
			this._pattern3.style.backgroundImage = value;
			const secondImage: HTMLElement | null = document.getElementById("secondImage");
			if (secondImage != null) {
				secondImage.style.backgroundImage = `url(${base64})`;
			}
			// document.body.style.backgroundImage = `url(${newURL})`;
			// window.localStorage.setItem("customTheme2", <string>reader.result);
			// this._doc.record(new ChangeSong(this._doc, <string>reader.result), true, true);
		});
		reader.readAsDataURL(file);
	}
	// private _whenKeyPressed = (event: KeyboardEvent): void => {
	// 	if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
	// 		this._saveChanges();
	// 	}
	// }

	// private _previewTheme = (): void => {
	// 	ColorConfig.setTheme(this._themeSelect.value);
	// }
}
//}
