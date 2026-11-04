import { Config } from "../synth/SynthConfig";
import { EditorConfig, isMobile } from "./EditorConfig";
import { PatternEditor } from "./PatternEditor";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";
import { KeyboardLayout } from "./KeyboardLayout";
import { Piano } from "./Piano";
import { Layout } from "./Layout";

const { button, label, div, h3, form, input, select, option, optgroup } = HTML;

function buildOptions(menu: HTMLSelectElement, items: ReadonlyArray<string | number>): HTMLSelectElement {
	for (let index: number = 0; index < items.length; index++) {
		menu.appendChild(option({ value: index }, items[index]));
	}
	return menu;
}

export class PreferencesPrompt implements Prompt {
	private readonly _showFifth: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _notesFlashWhenPlayed: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _frostedGlassBackground: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _showChannels: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _showInstrumentScrollbars: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _instrumentCopyPaste: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _instrumentImportExport: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _instrumentButtonsAtTop: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _showLetters: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _displayVolumeBar: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _showOscilloscope: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _showSampleLoadingStatus: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _showDescription: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });

	private readonly _layoutForm: HTMLFormElement = form({ style: "display: flex; gap: 10px;" },
		label({ class: "layout-option" },
			  input({ type: "radio", name: "layout", value: "small" }),
			  SVG(`\
			  <svg viewBox="-4 -1 28 22">
			  <rect x="0" y="0" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			  <rect x="2" y="2" width="11" height="10" fill="currentColor"/>
			  <rect x="14" y="2" width="4" height="16" fill="currentColor"/>
			  <rect x="2" y="13" width="11" height="5" fill="currentColor"/>
			  </svg>
			  `),
		div("Small"),
		),
		label({ class: "layout-option" },
			  input({ type: "radio", name: "layout", value: "long" }),
			  SVG(`\
			  <svg viewBox="-1 -1 28 22">
			  <rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			  <rect x="2" y="2" width="12" height="10" fill="currentColor"/>
			  <rect x="15" y="2" width="4" height="10" fill="currentColor"/>
			  <rect x="20" y="2" width="4" height="10" fill="currentColor"/>
			  <rect x="2" y="13" width="22" height="5" fill="currentColor"/>
			  </svg>
			  `),
		div("Long"),
		),
		label({ class: "layout-option" },
			  input({ type: "radio", name: "layout", value: "tall" }),
			  SVG(`\
			  <svg viewBox="-1 -1 28 22">
			  <rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			  <rect x="11" y="2" width="8" height="16" fill="currentColor"/>
			  <rect x="20" y="2" width="4" height="16" fill="currentColor"/>
			  <rect x="2" y="2" width="8" height="16" fill="currentColor"/>
			  </svg>
			  `),
		div("Tall"),
		),
		label({ class: "layout-option" },
			  input({ type: "radio", name: "layout", value: "wide" }),
			  SVG(`\
			  <svg viewBox="-1 -1 28 22">
			  <rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			  <rect x="2" y="2" width="4" height="16" fill="currentColor"/>
			  <rect x="18" y="2" width="2.5" height="16" fill="currentColor"/>
			  <rect x="21.5" y="2" width="2.5" height="16" fill="currentColor"/>
			  <rect x="7" y="2" width="10" height="16" fill="currentColor"/>
			  </svg>
			  `),
		div("Wide (JB)"),
		),
		label({ class: "layout-option" },
			  input({ type: "radio", name: "layout", value: "wide long" }),
			  SVG(`\
			  <svg viewBox="-1 -1 28 22">
			  <rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			  <rect x="2" y="2" width="12" height="10" fill="currentColor"/>
			  <rect x="15" y="2" width="4" height="16" fill="currentColor"/>
			  <rect x="20" y="2" width="4" height="16" fill="currentColor"/>
			  <rect x="2" y="13" width="12" height="5" fill="currentColor"/>
			  </svg>
			  `),
		div("Wide Long (AB)"),
		),
		label({ class: "layout-option" },
			  input({ type: "radio", name: "layout", value: "flipped long" }),
			  SVG(`\
			  <svg viewBox="-1 -1 28 22">
			  <rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			  <rect x="2" y="2" width="22" height="2" fill="currentColor"/>
			  <rect x="2" y="5" width="4" height="8" fill="currentColor"/>
			  <rect x="7" y="5" width="17" height="8" fill="currentColor"/>
			  <rect x="2" y="14" width="22" height="4" fill="currentColor"/>
			  </svg>
			  `),
			  div("Flipped Long (AB)"),
		),
		label({ class: "layout-option" },
			  input({ type: "radio", name: "layout", value: "focused long" }),
			  SVG(`\
			  <svg viewBox="-1 -1 28 22">
			  <rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			  <rect x="2" y="2" width="17" height="10" fill="currentColor"/>
			  <rect x="20" y="2" width="4" height="16" fill="currentColor"/>
			  <rect x="2" y="13" width="17" height="5" fill="currentColor"/>
			  </svg>
			  `),
			  div("Focused long (AB)"),
		),
	);

	private readonly _themeSelect: HTMLSelectElement = select({ style: "width: 100%;" },
		optgroup({ label: "Default Themes" },
			option({ value: "ultrabox dark" }, "UltraBox"),
			option({ value: "forest" }, "Forest"),
			option({ value: "canyon" }, "Canyon"),
			option({ value: "midnight" }, "Midnight"),
			option({ value: "beachcombing" }, "Beachcombing"),
			option({ value: "violet verdant" }, "Violet Verdant"),
			option({ value: "sunset" }, "Sunset"),
			option({ value: "autumn" }, "Autumn"),
			option({ value: "fruit" }, "Shadowfruit"),
			option({ value: "toxic" }, "Toxic"),
			option({ value: "roe" }, "Roe"),
			option({ value: "moonlight" }, "Moonlight"),
			option({ value: "portal" }, "Portal"),
			option({ value: "fusion" }, "Fusion"),
			option({ value: "inverse" }, "Inverse"),
			option({ value: "nebula" }, "Nebula"),
			option({ value: "roe light" }, "Roe Light"),
			option({ value: "amoled dark" }, "High Contrast Dark"),
			option({ value: "energized" }, "Energized"),
			option({ value: "neapolitan" }, "Neapolitan"),
			option({ value: "poly" }, "Poly"),
			option({ value: "blutonium" }, "Blutonium"),
			option({ value: "slushie" }, "Slushie"),
		),
		optgroup({ label: "Mod Themes" },
			option({ value: "dark classic" }, "BeepBox Dark"),
			option({ value: "light classic" }, "BeepBox Light"),
			option({ value: "dark competition" }, "BeepBox Competition Dark"),
			option({ value: "jummbox classic" }, "JummBox Dark"),
			// let's retire this again.
			// option({ value: "jummbox light" }, "JummBox Light"), 
			option({ value: "modbox classic" }, "Modbox"),
			option({ value: "sandbox classic" }, "Sandbox"),
			option({ value: "harrybox" }, "Haileybox"),
			option({ value: "brucebox" }, "Brucebox"),
			option({ value: "shitbox 3.0" }, "Shitbox 1.0/3.0"),
			option({ value: "shitbox 2.0" }, "Shitbox 2.0"),
			option({ value: "nerdbox" }, "NerdBox"),
			option({ value: "zefbox" }, "Zefbox"),
			option({ value: "cardboardbox classic" }, "Cardboardbox"),
			option({ value: "blubox classic" }, "Blubox"),
			option({ value: "dogebox classic" }, "Dogebox"),
			option({ value: "wackybox" }, "Wackybox"),
			option({ value: "todbox dark mode" }, "Todbox Dark Mode"),
			option({ value: "mainbox 1.0" }, "Mainbox"),
			option({ value: "microbox" }, "MicroBox"),
			option({ value: "paandorasbox" }, "PaandorasBox"),
			option({ value: "foxbox" }, "FoxBox"),
			option({ value: "midbox" }, "Midbox"),
			option({ value: "dogebox2" }, "Dogebox2"),
			option({ value: "abyssbox classic"}, "AbyssBox Classic"),
			option({ value: "abyssbox light"}, "AbyssBox Light"),
			option({ value: "nepbox" }, "Nepbox"),
			option({ value: "slarmoosbox"}, "Slarmoo's Box"),
			option({ value: "axobox"}, "AxoBox"),
			option({ value: "lemmbox dark"}, "LemmBox"),
		),
		optgroup({ label: "Misc" },
			option({ value: "custom" }, "Custom")
		),
	);

	private readonly _customThemeFileInput: HTMLInputElement = input({ type: "file", accept: "image/*", text: "choose editor background image"});
	private readonly _customThemeFileInput2: HTMLInputElement = input({ type: "file", accept: "image/*", text: "choose website background image" });
	private readonly _colorInput: HTMLInputElement = input({ type: "text", style: "width: auto"});
	private readonly _customThemeFileReset: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size);" }, "Reset background images");

	private readonly _autoPlay: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _autoFollow: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _enableNotePreview: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _notesOutsideScale: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _alwaysFineNoteVol: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _showScrollBar: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _enableChannelMuting: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _displayBrowserUrl: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _removeWhitespace: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _closePromptByClickoff: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });

	private readonly _defaultScaleSelect: HTMLSelectElement = buildOptions(select({ style: "width: 100%;" } ), Config.scales.map(scale => scale.name));

    private readonly _keyboardMode: HTMLSelectElement = select({ style: "width: 100%;" },
        option({ value: "useCapsLockForNotes" }, "use caps lock to play notes"),
        option({ value: "pressControlForShortcuts" }, "press " + EditorConfig.ctrlName + " for shortcuts"),
    );
    private readonly _keyboardLayout: HTMLSelectElement = select({ style: "width: 100%;" },
        option({ value: "wickiHayden" }, "Wicki-Hayden"),
        option({ value: "songScale" }, "selected song scale"),
        option({ value: "pianoAtC" }, "piano starting at C :)"),
        option({ value: "pianoAtA" }, "piano starting at A :("),
        option({ value: "pianoTransposingC" }, "piano transposing C :) to song key"),
        option({ value: "pianoTransposingA" }, "piano transposing A :( to song key"),
    );
    private readonly _bassOffset: HTMLSelectElement = select({ style: "width: 100%;" },
        option({ value: "0" }, "disabled"),
        option({ value: "-1" }, "before"),
        option({ value: "1" }, "after"),
    );
    private readonly _keyboardLayoutPreview: HTMLDivElement = div({ style: "display: grid; row-gap: 4px; margin: 4px auto; font-size: 10px;" });
    private readonly _enableMidi: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
    private readonly _showRecordButton: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
    private readonly _snapRecordedNotesToRhythm: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
    private readonly _ignorePerformedNotesNotInScale: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
    private readonly _metronomeCountIn: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });
	private readonly _metronomeWhileRecording: HTMLInputElement = input({ style: "width: 2em; margin-left: 1em;", type: "checkbox" });

    private readonly _shortenerStrategySelect: HTMLSelectElement = select({ style: "width: 100%;" },
        option({ value: "wackybox" }, "wackybox.org"),
        option({ value: "isgd" }, "is.gd"),
	);

	private readonly _fileAreaButton: HTMLButtonElement = button({ class: "fileAreaButton", style: "width: 16%;" }, "File");
	private readonly _audioAreaButton: HTMLButtonElement = button({ class: "audioAreaButton", style: "width: 16%;" }, "Audio");
	private readonly _layoutAreaButton: HTMLButtonElement = button({ class: "layoutAreaButton", style: "width: 16%;" }, "Layout");
	private readonly _themeAreaButton: HTMLButtonElement = button({ class: "themeAreaButton", style: "width: 16%;" }, "Theme");
	private readonly _inputAreaButton: HTMLButtonElement = button({ class: "inputAreaButton", style: "width: 16%;" }, "Input");
	private readonly _divWidth: number = isMobile ? 25 : 50;

	private readonly _autoPlayRow: HTMLDivElement = div(
		label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
			  "Auto-play on load:",
		div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._autoPlay),
		),
	);

	private readonly _fileArea: HTMLDivElement = div({ style: "overflow-y: visible; overflow-x: hidden;" },
		div({ style: "text-align: left;" },
			h3("URL"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable song data in URL:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._displayBrowserUrl),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Song URL shortener:",
				div({ class: "selectContainer", style: `width: 50%; text-align: center;` }, this._shortenerStrategySelect),
			),
			h3("Export"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Remove whitespace characters in json export:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._removeWhitespace),
			),
		)
	);

	private readonly _audioArea: HTMLDivElement = div({ style: "display: none; overflow-y: visible; overflow-x: hidden;" },
		div({ style: "text-align: left;" },
			h3("Playback"),
			this._autoPlayRow,
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Auto-follow playhead:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._autoFollow),
			),
			h3("Note Placement"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Hear preview of placed notes:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._enableNotePreview),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Always use fine note volume:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._alwaysFineNoteVol),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Edit notes out of scale:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._notesOutsideScale),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Set default scale:",
				div({  class: "selectContainer", style: `width:50%; text-align: center;` }, this._defaultScaleSelect),
			),
		)
	);

	private readonly _layoutRow: HTMLDivElement = div({ style : "" },
		"Layout:",
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._layoutForm)
	);

	private readonly _layoutArea: HTMLDivElement = div({ style: "display: none; overflow-y: visible; overflow-x: hidden;" },
		div({ style: "text-align: left;" },
			h3("Channel"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable channel mute buttons:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._enableChannelMuting),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Enable instrument copy/paste buttons:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._instrumentCopyPaste),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Enable instrument import/export buttons:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._instrumentImportExport),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Display instrument buttons at top:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._instrumentButtonsAtTop),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable channel ghosting:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showChannels),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable octave scroll bar:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showScrollBar),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable instrument scrollbars:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showInstrumentScrollbars),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable piano keys:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showLetters),
			),
			h3("Global"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable global volume bar:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._displayVolumeBar),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable global oscilloscope:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showOscilloscope),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Display sample loading status:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showSampleLoadingStatus),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Display site description:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showDescription),
			),
			this._layoutRow,
		)
	);

	private readonly _themeArea: HTMLDivElement = div({ style: "display: none; overflow-y: visible; overflow-x: hidden;" },
		div({ style: "text-align: left;" },
			h3("General"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				'Highlight "fifth" note:',
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showFifth),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Flash notes when played:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._notesFlashWhenPlayed),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Blur background while in prompt:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._frostedGlassBackground),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Preset color palette:",
				div({ class: "selectContainer", style: `width: 50%; text-align: center;` }, this._themeSelect),
			),
			h3("Custom"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Custom color palette data:",
				div({ style: `width: 50%; text-align: center;` }, this._colorInput)
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Editor background image:"),
				div({ style: `width: 50%; text-align: center;` }, this._customThemeFileInput)
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Website background image:"),
				div({ style: `width: 50%; text-align: center;` }, this._customThemeFileInput2)
			),
			div({ style: "text-align: center; margin-top: 0.5em; margin-bottom: 0.5em;" }, this._customThemeFileReset),
		)
	);

	private readonly _inputArea: HTMLDivElement = div({ style: "display: none; overflow-y: visible; overflow-x: hidden;" },
		div({ style: "text-align: left;" },
			h3("Note Recording"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Always show recording button:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._showRecordButton),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Snap recorded notes to rhythm:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._snapRecordedNotesToRhythm),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Ignore recorded notes outside of the scale:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._ignorePerformedNotesNotInScale),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Recording keyboard layout:",
				div({ class: "selectContainer", style: `width: 50%; text-align: center;` }, this._keyboardLayout),
			),
			div({ style: "display: flex; margin-top: 0.5em; margin-bottom: 0.5em;" }, this._keyboardLayoutPreview),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 0.5em; height: 2em;" },
				"Shortcut / Recording mode:",
				div({ class: "selectContainer", style: `width: 50%; text-align: center;` }, this._keyboardMode),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Enable MIDI performance:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._enableMidi),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Record with metronome:",
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._metronomeWhileRecording),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" }, "Count-in recording with metronome:"),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._metronomeCountIn),
			),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				"Bass channel offset:",
				div({ class: "selectContainer", style: `width: 50%; text-align: center;` }, this._bassOffset),
			),
			h3("Misc"),
			label({ style: "display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 0.5em; margin-bottom: 0.5em; height: 2em;" },
				div({ style: "width: 50%;" },"Close prompts when clicking outside of the prompt:" ),
				div({ style: `width: ${this._divWidth}%; text-align: center;` }, this._closePromptByClickoff),
			),
		)
	);

    private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");
    private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection recordingSetupPrompt", style: "width: 600px;" },
		div({ style: "display: flex; flex-direction: row; justify-content: center;" },
			this._fileAreaButton,
			this._audioAreaButton,
			this._layoutAreaButton,
			this._themeAreaButton,
			this._inputAreaButton,
		),
		this._fileArea,
		this._audioArea,
		this._layoutArea,
		this._themeArea,
		this._inputArea,
        div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
            this._okayButton,
        ),
        this._cancelButton,
    );

	private _lastTheme: string | null = window.localStorage.getItem("colorTheme");
	private _newTheme: boolean = false;
	private _resetCustomTheme: boolean = false;
	private _mustReload: boolean = false;
	private _currentTab: string | null = window.localStorage.getItem("prefTab");

	constructor(private _doc: SongDocument, private _pattern: PatternEditor, private _pattern2: HTMLDivElement, private _pattern3: HTMLElement) {
		this._showFifth.checked = this._doc.prefs.showFifth;
		this._notesFlashWhenPlayed.checked = this._doc.prefs.notesFlashWhenPlayed;
		this._frostedGlassBackground.checked = this._doc.prefs.frostedGlassBackground;
		this._showChannels.checked = this._doc.prefs.showChannels;
		this._showInstrumentScrollbars.checked = this._doc.prefs.showInstrumentScrollbars;
		this._instrumentCopyPaste.checked = this._doc.prefs.instrumentCopyPaste;
		this._instrumentImportExport.checked = this._doc.prefs.instrumentImportExport;
		this._instrumentButtonsAtTop.checked = this._doc.prefs.instrumentButtonsAtTop;
		this._showLetters.checked = this._doc.prefs.showLetters;
		this._displayVolumeBar.checked = this._doc.prefs.displayVolumeBar;
		this._showOscilloscope.checked = this._doc.prefs.showOscilloscope;
		this._showSampleLoadingStatus.checked = this._doc.prefs.showSampleLoadingStatus;
		this._showDescription.checked = this._doc.prefs.showDescription;

		(<any>this._layoutForm.elements)["layout"].value = this._doc.prefs.layout;

		if (this._lastTheme != null) {
			this._themeSelect.value = this._lastTheme;
		}

		this._colorInput.value = this._doc.prefs.customColors || "";

		this._autoPlay.checked = this._doc.prefs.autoPlay;
		this._autoFollow.checked = this._doc.prefs.autoFollow;
		this._enableNotePreview.checked = this._doc.prefs.enableNotePreview;
		this._notesOutsideScale.checked = this._doc.prefs.notesOutsideScale;
		this._alwaysFineNoteVol.checked = this._doc.prefs.alwaysFineNoteVol;
		this._showScrollBar.checked = this._doc.prefs.showScrollBar;
		this._enableChannelMuting.checked = this._doc.prefs.enableChannelMuting;
		this._displayBrowserUrl.checked = this._doc.prefs.displayBrowserUrl;
		this._removeWhitespace.checked = this._doc.prefs.removeWhitespace;
		this._closePromptByClickoff.checked = this._doc.prefs.closePromptByClickoff;

		this._defaultScaleSelect.selectedIndex = this._doc.prefs.defaultScale;

		this._shortenerStrategySelect.value = this._doc.prefs.shortenerStrategySelect;

        this._keyboardMode.value = this._doc.prefs.pressControlForShortcuts ? "pressControlForShortcuts" : "useCapsLockForNotes";
        this._keyboardLayout.value = this._doc.prefs.keyboardLayout;
        this._bassOffset.value = String(this._doc.prefs.bassOffset);
        this._enableMidi.checked = this._doc.prefs.enableMidi;
        this._showRecordButton.checked = this._doc.prefs.showRecordButton;
        this._snapRecordedNotesToRhythm.checked = this._doc.prefs.snapRecordedNotesToRhythm;
        this._ignorePerformedNotesNotInScale.checked = this._doc.prefs.ignorePerformedNotesNotInScale;
        this._metronomeCountIn.checked = this._doc.prefs.metronomeCountIn;
        this._metronomeWhileRecording.checked = this._doc.prefs.metronomeWhileRecording;

        setTimeout(() => this._showRecordButton.focus());

		if (isMobile) { this._autoPlayRow.setAttribute("hidden", ""); }

		if (window.screen.availWidth < 710) { this._layoutRow.setAttribute("hidden", ""); }

		this._renderKeyboardLayoutPreview();
		this._keyboardLayout.addEventListener("change", this._renderKeyboardLayoutPreview);
		this._bassOffset.addEventListener("change", this._renderKeyboardLayoutPreview);

		this._customThemeFileInput.addEventListener("change", this._whenCustomThemeFileSelected);
		this._customThemeFileInput2.addEventListener("change", this._whenCustomThemeFileSelected2);
		this._customThemeFileReset.addEventListener("click", this._resetCustomThemeFile);
		this._colorInput.addEventListener("change", this._whenColorsChanged);
		this._themeSelect.addEventListener("change", this._previewTheme);

		this._fileAreaButton.addEventListener("click", this._renderFileArea);
		this._audioAreaButton.addEventListener("click", this._renderAudioArea);
		this._layoutAreaButton.addEventListener("click", this._renderLayoutArea);
		this._themeAreaButton.addEventListener("click", this._renderThemeArea);
		this._inputAreaButton.addEventListener("click", this._renderInputArea);
		this._okayButton.addEventListener("click", this._confirm);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);

		if (this._currentTab == "audio") {
			this._audioAreaButton.dispatchEvent(new MouseEvent("click"));
		} else if (this._currentTab == "layout") {
			this._layoutAreaButton.dispatchEvent(new MouseEvent("click"));
		} else if (this._currentTab == "theme") {
			this._themeAreaButton.dispatchEvent(new MouseEvent("click"));
		} else if (this._currentTab == "input") {
			this._inputAreaButton.dispatchEvent(new MouseEvent("click"));
		} else {
			this._fileAreaButton.dispatchEvent(new MouseEvent("click"));
		}
	}

	private _close = (): void => {
		if (!this._newTheme && this._lastTheme != null) {
			ColorConfig.setTheme(this._lastTheme);
		} else if (!this._newTheme) {
			ColorConfig.setTheme(ColorConfig.defaultTheme);
		}
		this._doc.prompt = null;
		this._doc.undo();
		if (this._mustReload) {
			// The prompt seems to get stuck if reloading is done too quickly.
			setTimeout(() => { window.location.reload(); }, 50);
		}
    }

    public cleanUp = (): void => {
        this._okayButton.removeEventListener("click", this._confirm);
        this._cancelButton.removeEventListener("click", this._close);
        this.container.removeEventListener("keydown", this._whenKeyPressed);
    }

    private _whenKeyPressed = (event: KeyboardEvent): void => {
        if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
            this._confirm();
        }
    }

    private _confirm = (): void => {
		window.localStorage.setItem("prefTab", String(this._currentTab));

		this._doc.prefs.showFifth = this._showFifth.checked;
		this._doc.prefs.notesFlashWhenPlayed = this._notesFlashWhenPlayed.checked;
		this._doc.prefs.frostedGlassBackground = this._frostedGlassBackground.checked;
		this._doc.prefs.showChannels = this._showChannels.checked;
		this._doc.prefs.showInstrumentScrollbars = this._showInstrumentScrollbars.checked;
		this._doc.prefs.instrumentCopyPaste = this._instrumentCopyPaste.checked;
		this._doc.prefs.instrumentImportExport = this._instrumentImportExport.checked;
		this._doc.prefs.instrumentButtonsAtTop = this._instrumentButtonsAtTop.checked;
		this._doc.prefs.showLetters = this._showLetters.checked;
		this._doc.prefs.displayVolumeBar = this._displayVolumeBar.checked;
		this._doc.prefs.showOscilloscope = this._showOscilloscope.checked;
		this._doc.prefs.showSampleLoadingStatus = this._showSampleLoadingStatus.checked;
		this._doc.prefs.showDescription = this._showDescription.checked;

		this._doc.prefs.layout = (<any>this._layoutForm.elements)["layout"].value;

		this._doc.prefs.colorTheme = this._themeSelect.value;
		this._newTheme = true

		this._doc.prefs.customColors = this._colorInput.value;

		if (this._resetCustomTheme) {
			this._mustReload = true
			this._doc.prefs.customTheme = null
			this._doc.prefs.customTheme2 = null
			this._pattern._svg.style.backgroundImage = "";
			document.body.style.backgroundImage = "";
			this._pattern2.style.backgroundImage = "";
			this._pattern3.style.backgroundImage = "";
			const secondImage: HTMLElement | null = document.getElementById("secondImage");
			if (secondImage != null) {
				secondImage.style.backgroundImage = "";
			}
		}

		this._doc.prefs.autoPlay = this._autoPlay.checked;
		this._doc.prefs.autoFollow = this._autoFollow.checked;
		this._doc.prefs.enableNotePreview = this._enableNotePreview.checked;
		this._doc.prefs.notesOutsideScale = this._notesOutsideScale.checked;
		this._doc.prefs.alwaysFineNoteVol = this._alwaysFineNoteVol.checked;
		this._doc.prefs.showScrollBar = this._showScrollBar.checked;
		this._doc.prefs.enableChannelMuting = this._enableChannelMuting.checked;
		this._doc.prefs.displayBrowserUrl = this._displayBrowserUrl.checked;
		this._doc.prefs.removeWhitespace = this._removeWhitespace.checked;
		this._doc.prefs.closePromptByClickoff = this._closePromptByClickoff.checked;

		this._doc.prefs.defaultScale = this._defaultScaleSelect.selectedIndex;

		this._doc.prefs.shortenerStrategySelect = this._shortenerStrategySelect.value;

        this._doc.prefs.pressControlForShortcuts = (this._keyboardMode.value == "pressControlForShortcuts");
        this._doc.prefs.keyboardLayout = this._keyboardLayout.value;
        this._doc.prefs.bassOffset = Number(this._bassOffset.value);
        this._doc.prefs.enableMidi = this._enableMidi.checked;
        this._doc.prefs.showRecordButton = this._showRecordButton.checked;
        this._doc.prefs.snapRecordedNotesToRhythm = this._snapRecordedNotesToRhythm.checked;
        this._doc.prefs.ignorePerformedNotesNotInScale = this._ignorePerformedNotesNotInScale.checked;
        this._doc.prefs.metronomeCountIn = this._metronomeCountIn.checked;
		this._doc.prefs.metronomeWhileRecording = this._metronomeWhileRecording.checked;

		this._doc.prefs.save();
		Layout.setLayout(this._doc.prefs.layout);
		this._close();
	}

	private _renderFileArea = (event: Event): void => {
		event.preventDefault();
		this._fileArea.style.display = "";
		this._audioArea.style.display = "none";
		this._layoutArea.style.display = "none";
		this._themeArea.style.display = "none";
		this._inputArea.style.display = "none";
		this._fileAreaButton.style.backgroundColor = ColorConfig.uiWidgetFocus;
		this._audioAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._layoutAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._themeAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._inputAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._currentTab = "file";
	}

	private _renderAudioArea = (event: Event): void => {
		event.preventDefault();
		this._fileArea.style.display = "none";
		this._audioArea.style.display = "";
		this._layoutArea.style.display = "none";
		this._themeArea.style.display = "none";
		this._inputArea.style.display = "none";
		this._fileAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._audioAreaButton.style.backgroundColor = ColorConfig.uiWidgetFocus;
		this._layoutAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._themeAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._inputAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._currentTab = "audio";
	}

	private _renderLayoutArea = (event: Event): void => {
		event.preventDefault();
		this._fileArea.style.display = "none";
		this._audioArea.style.display = "none";
		this._layoutArea.style.display = "";
		this._themeArea.style.display = "none";
		this._inputArea.style.display = "none";
		this._fileAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._audioAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._layoutAreaButton.style.backgroundColor = ColorConfig.uiWidgetFocus;
		this._themeAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._inputAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._currentTab = "layout";
	}

	private _renderThemeArea = (event: Event): void => {
		event.preventDefault();
		this._fileArea.style.display = "none";
		this._audioArea.style.display = "none";
		this._layoutArea.style.display = "none";
		this._themeArea.style.display = "";
		this._inputArea.style.display = "none";
		this._fileAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._audioAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._layoutAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._themeAreaButton.style.backgroundColor = ColorConfig.uiWidgetFocus;
		this._inputAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._currentTab = "theme";
	}

	private _renderInputArea = (event: Event): void => {
		event.preventDefault();
		this._fileArea.style.display = "none";
		this._audioArea.style.display = "none";
		this._layoutArea.style.display = "none";
		this._themeArea.style.display = "none";
		this._inputArea.style.display = "";
		this._fileAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._audioAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._layoutAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._themeAreaButton.style.backgroundColor = ColorConfig.uiWidgetBackground;
		this._inputAreaButton.style.backgroundColor = ColorConfig.uiWidgetFocus;
		this._currentTab = "input";
	}

    private _renderKeyboardLayoutPreview = (): void => {
        while (this._keyboardLayoutPreview.firstChild) {
            this._keyboardLayoutPreview.removeChild(this._keyboardLayoutPreview.firstChild);
        }
        const rowLengths: number[] = [12, 12, 11, 10];
        const scale: ReadonlyArray<boolean> = Config.scales[this._doc.song.scale].flags;
        for (let rowIndex: number = 0; rowIndex < 4; rowIndex++) {
            const row: HTMLDivElement = div({ style: "display: flex;" });
            this._keyboardLayoutPreview.appendChild(row);
            const spacer: HTMLDivElement = div({ style: "width: " + (rowIndex * 12) + "px; height: 20px; flex-shrink: 0;" });
            row.appendChild(spacer);
            for (let colIndex: number = 0; colIndex < rowLengths[rowIndex]; colIndex++) {
                const key: HTMLDivElement = div({ style: `width: 20px; height: 20px; margin: 0 2px; box-sizing: border-box; flex-shrink: 0; display: flex; justify-content: center; align-items: center;` });
                row.appendChild(key);
                const pitch: number | null = KeyboardLayout.keyPosToPitch(this._doc, colIndex, 3 - rowIndex, this._keyboardLayout.value);
                if (pitch != null) {
                    const scalePitch: number = pitch % 12;
                    if (scale[scalePitch]) {
                        if (scalePitch == 0) {
                            key.style.background = ColorConfig.tonic;
                        } else if (scalePitch == 7 && this._doc.prefs.showFifth) {
                            key.style.background = ColorConfig.fifthNote;
                        } else {
                            key.style.background = ColorConfig.pitchBackground;
                        }
                    } else {
                        key.style.border = "2px solid " + ColorConfig.pitchBackground;
                    }

                    if (this._bassOffset.selectedIndex != 0 && pitch <= Piano.getBassCutoffPitch(this._doc)) {
                        key.style.setProperty("filter", "hue-rotate(60deg) brightness(0.5)");
                    }
                    else {
                        key.style.setProperty("filter", "");
                    }

                    const pitchNameIndex: number = (scalePitch + Config.keys[this._doc.song.key].basePitch) % Config.pitchesPerOctave;
                    key.textContent = Piano.getPitchName(pitchNameIndex, scalePitch, Math.floor(pitch / 12));
                }
            }
        }
	}

	private _previewTheme = (): void => {
		ColorConfig.setTheme(this._themeSelect.value);
		this._doc.prefs.customColors = "";
	}

	private _whenColorsChanged = (): void => {
		this._doc.prefs.customColors = this._colorInput.value;
		this._doc.prefs.colorTheme = "custom";
		this._themeSelect.value = "custom";
		this._mustReload = true;
	}

	private _whenCustomThemeFileSelected = (): void => {
		const file: File = this._customThemeFileInput.files![0];
		if (!file) return;
		const reader: FileReader = new FileReader();
		reader.addEventListener("load", (event: Event): void => {
			let base64 = <string>reader.result;
			this._doc.prefs.customTheme = base64;
			this._pattern._svg.style.backgroundImage = `url("${base64}")`;
		});
		reader.readAsDataURL(file);
	}

	private _whenCustomThemeFileSelected2 = (): void => {
		const file: File = this._customThemeFileInput2.files![0];
		if (!file) return;
		const reader: FileReader = new FileReader();
		reader.addEventListener("load", (event: Event): void => {
			let base64 = <string>reader.result;
			this._doc.prefs.customTheme2 = base64
			const value = `url("${base64}")`
			document.body.style.backgroundImage = value;
			this._pattern2.style.backgroundImage = value;
			this._pattern3.style.backgroundImage = value;
			const secondImage: HTMLElement | null = document.getElementById("secondImage");
			if (secondImage != null) {
				secondImage.style.backgroundImage = value;
			}
		});
		reader.readAsDataURL(file);
	}

	private _resetCustomThemeFile = (): void => {
		this._resetCustomTheme = true;
	}
}