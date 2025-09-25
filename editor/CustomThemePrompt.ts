import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Prompt } from "./Prompt";
import { SongDocument } from "./SongDocument";

import { PatternEditor } from "./PatternEditor";
// import { ColorConfig } from "./ColorConfig";

//namespace beepbox {
const { button, div, h2, input, p, a} = HTML;
let doReload = false;
export class CustomThemePrompt implements Prompt {
	private readonly _fileInput: HTMLInputElement = input({ type: "file", accept: "image/*", text: "choose editor background image"});
	private readonly _fileInput2: HTMLInputElement = input({ type: "file", accept: "image/*", text: "choose website background image" });
	private readonly _colorInput: HTMLInputElement = input({ type: "text", value: localStorage.getItem("customColors") || `:root {
	--page-margin: black;
	--editor-background: black;
	--hover-preview: white;
	--playhead: white;
	--primary-text: white;
	--secondary-text: #999;
	--inverted-text: black;
	--text-selection: rgba(119,68,255,0.99);
	--box-selection-fill: rgba(255,255,255,0.2);
	--loop-accent: #74f;
	--link-accent: #98f;
	--ui-widget-background: #444;
	--ui-widget-focus: #777;
	--pitch-background: #444;
	--tonic: #864;
	--fifth-note: #468;
	--white-piano-key: #bbb;
	--black-piano-key: #444;
	--white-piano-key-text: #131200;
	--black-piano-key-text: #fff;
	--use-color-formula: false;
	--track-editor-bg-pitch: #444;
	--track-editor-bg-pitch-dim: #333;
	--track-editor-bg-noise: #444;
	--track-editor-bg-noise-dim: #333;
	--track-editor-bg-mod: #234;
	--track-editor-bg-mod-dim: #123;
	--multiplicative-mod-slider: #456;
	--overwriting-mod-slider: #654;
	--indicator-primary: #74f;
	--indicator-secondary: #444;
	--select2-opt-group: #585858;
	--input-box-outline: #333;
	--mute-button-normal: #ffa033;
	--mute-button-mod: #9a6bff;
	--pitch1-secondary-channel: #0099A1;
	--pitch1-primary-channel:   #25F3FF;
	--pitch1-secondary-note:    #00BDC7;
	--pitch1-primary-note:      #92F9FF;
	--pitch2-secondary-channel: #A1A100;
	--pitch2-primary-channel:   #FFFF25;
	--pitch2-secondary-note:    #C7C700;
	--pitch2-primary-note:      #FFFF92;
	--pitch3-secondary-channel: #C75000;
	--pitch3-primary-channel:   #FF9752;
	--pitch3-secondary-note:    #FF771C;
	--pitch3-primary-note:      #FFCDAB;
	--pitch4-secondary-channel: #00A100;
	--pitch4-primary-channel:   #50FF50;
	--pitch4-secondary-note:    #00C700;
	--pitch4-primary-note:      #A0FFA0;
	--pitch5-secondary-channel: #D020D0;
	--pitch5-primary-channel:   #FF90FF;
	--pitch5-secondary-note:    #E040E0;
	--pitch5-primary-note:      #FFC0FF;
	--pitch6-secondary-channel: #7777B0;
	--pitch6-primary-channel:   #A0A0FF;
	--pitch6-secondary-note:    #8888D0;
	--pitch6-primary-note:      #D0D0FF;
	--pitch7-secondary-channel: #8AA100;
	--pitch7-primary-channel:   #DEFF25;
	--pitch7-secondary-note:    #AAC700;
	--pitch7-primary-note:      #E6FF92;
	--pitch8-secondary-channel: #DF0019;
	--pitch8-primary-channel:   #FF98A4;
	--pitch8-secondary-note:    #FF4E63;
	--pitch8-primary-note:      #FFB2BB;
	--pitch9-secondary-channel: #00A170;
	--pitch9-primary-channel:   #50FFC9;
	--pitch9-secondary-note:    #00C78A;
	--pitch9-primary-note:      #83FFD9;
	--pitch10-secondary-channel:#A11FFF;
	--pitch10-primary-channel:  #CE8BFF;
	--pitch10-secondary-note:   #B757FF;
	--pitch10-primary-note:     #DFACFF;
	--noise1-secondary-channel: #6F6F6F;
	--noise1-primary-channel:   #AAAAAA;
	--noise1-secondary-note:    #A7A7A7;
	--noise1-primary-note:      #E0E0E0;
	--noise2-secondary-channel: #996633;
	--noise2-primary-channel:   #DDAA77;
	--noise2-secondary-note:    #CC9966;
	--noise2-primary-note:      #F0D0BB;
	--noise3-secondary-channel: #4A6D8F;
	--noise3-primary-channel:   #77AADD;
	--noise3-secondary-note:    #6F9FCF;
	--noise3-primary-note:      #BBD7FF;
	--noise4-secondary-channel: #7A4F9A;
	--noise4-primary-channel:   #AF82D2;
	--noise4-secondary-note:    #9E71C1;
	--noise4-primary-note:      #D4C1EA;
	--noise5-secondary-channel: #607837;
	--noise5-primary-channel:   #A2BB77;
	--noise5-secondary-note:    #91AA66;
	--noise5-primary-note:      #C5E2B2;
	--mod1-secondary-channel:   #339955;
	--mod1-primary-channel:     #77fc55;
	--mod1-secondary-note:      #77ff8a;
	--mod1-primary-note:        #cdffee;
	--mod2-secondary-channel:   #993355;
	--mod2-primary-channel:     #f04960;
	--mod2-secondary-note:      #f057a0;
	--mod2-primary-note:        #ffb8de;
	--mod3-secondary-channel:   #553399;
	--mod3-primary-channel:     #8855fc;
	--mod3-secondary-note:      #aa64ff;
	--mod3-primary-note:	    #f8ddff;
	--mod4-secondary-channel:   #a86436;
	--mod4-primary-channel:     #c8a825;
	--mod4-secondary-note:      #e8ba46;
	--mod4-primary-note:        #fff6d3;
	--mod-label-primary:        #999;
	--mod-label-secondary-text: #333;
	--mod-label-primary-text:   black;
	--disabled-note-primary:    #999;
	--disabled-note-secondary:  #666; }`});
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");
	private readonly _resetButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size);" }, "Reset to defaults");

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 300px;" },
		h2("Import"),
		p({ style: "text-align: left; margin: 0.5em 0;" },
			"You can upload images to create a custom theme. The first image will become the editor background, and the second image will be tiled across the webpage.",
		),
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
