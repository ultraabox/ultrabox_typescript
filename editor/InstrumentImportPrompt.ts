// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
//import { SongEditor } from "./SongEditor";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Channel, Instrument } from "../synth/synth";
import { ChangePasteInstrument, ChangeAppendInstrument, ChangeViewInstrument } from "./changes";

const {button, div, h2, input, select, option, code } = HTML;

export class InstrumentImportPrompt implements Prompt {
		private readonly _cancelButton: HTMLButtonElement = button({class: "cancelButton"});
		private readonly _importStrategySelect: HTMLSelectElement = select({style: "width: 100%;"},
			option({value: "append"}, "Append instruments to the end of the list."),
			option({value: "replace"}, "Replace only the selected instrument."),
			option({value: "all"}, "Replace all instruments in the channel."),
		);
		private readonly _fileInput: HTMLInputElement = input({type: "file", accept: ".json,application/json"});

		private readonly _strategyInfoText: HTMLDivElement = div({ style: "text-align: left;" },
		"You must enable either ",
		code("Simultaneous instruments per channel"),
		" or ",
		code("Different instruments per pattern"),
		" to change the import strategy.",
		);

		public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 300px;" },
		    h2("Import Instrument(s)"),
			this._strategyInfoText,
            div({style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;"},
				div({class: "selectContainer", style: "width: 100%;"}, this._importStrategySelect),
			),
		this._fileInput,
		this._cancelButton,

		//If file has 1 instrument, and no checkboxes are selected, add all the instrument to the end
		//If file has multiple instruments, and no checkboxes are selected, add all the instruments to the end

		//If file has 1 instrument, and checkbox 1 is selected, clear all current isntruments and add the file instrument
		//If file has multiple instruments, and checkbox 1 is selected, clear all current isntruments and add the file instruments

		//If file has 1 instrument, and checkbox 2 is selected, replace the currently selected instrument with the file instrument
		//If file has multiple instruments, and checkbox 2 is selected, replace the currently selected instrument with the file instrument 1, add all the rest of the instruments to the end

		//importing a multi instrument with no multi instrument settings turned on will alert an a warning and not import the instrument
		//checkbox 1 and 2 will always be grayed out if multi instruments arent enabled.
	);

	constructor(private _doc: SongDocument) {
		
		if ((_doc.song.patternInstruments||_doc.song.layeredInstruments)==false) {
			this._importStrategySelect.disabled = true;
			this._importStrategySelect.value = "replace";
			this._strategyInfoText.hidden = false;
		} else {
			const lastStrategy: string | null = window.localStorage.getItem("instrumentImportStrategy");
			if (lastStrategy != null) this._importStrategySelect.value = lastStrategy;
			this._strategyInfoText.hidden = true;
		}
		this._fileInput.addEventListener("change", this._whenFileSelected);
		this._cancelButton.addEventListener("click", this._close);
	}

		private _whenFileSelected = (): void => {
			const file: File = this._fileInput.files![0];
			if (!file) return;
			const reader: FileReader = new FileReader()
			reader.onload = (e) => {
			try {
					const fileParsed: any = JSON.parse(String(e.target?.result));
					console.log("Processing file:", fileParsed)
					if (fileParsed.constructor.name == "Array") {
						if ((this._doc.song.patternInstruments||this._doc.song.layeredInstruments)==false) {
							alert("Instrument file contains multiple instruments! Please turn on either Simultaneous instruments per channel or Different instruments per pattern!");
							return;
						}
						this._import_multiple(fileParsed);
						return;
					} else {
						this._import_single(fileParsed);
					}
				} catch (error) {
					console.error('Error reading file:', error);
				}
			};
			reader.readAsText(file);
	}

		private _close = (): void => {
		this._doc.undo();
	}

		public cleanUp = (): void => {
		this._fileInput.removeEventListener("change", this._whenFileSelected);
		this._cancelButton.removeEventListener("click", this._close);
	}

        public _import_multiple = (file: any): void => {
			const channel: Channel = this._doc.song.channels[this._doc.channel];
			const currentInstrum: Instrument = channel.instruments[this._doc.getCurrentInstrument()];
			switch (this._importStrategySelect.value) {
				case "replace":
					// console.log("multi replace");
					window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
					//Replace the current instrument with the first one, then add the rest
					const firstInstrum = file[0];
					this._doc.record(new ChangePasteInstrument(this._doc, currentInstrum, firstInstrum));
					for (let i = 1; i < file.length; i++) {
						const insturm: any = file[i];
						if (!this._validate_instrument_limit(channel)) { 
							alert("Max instruments reached! Some instruments were not imported.");
							break;
						}
						this._doc.record(new ChangeAppendInstrument(this._doc, channel, insturm));
					}
					this._doc.record(new ChangeViewInstrument(this._doc, this._doc.getCurrentInstrument()))
					this._doc.prompt = null;
					this._doc.notifier.changed();
					return;
				case "all":
					// console.log("multi all");
					window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
					//Delete all instruments then add these ones
					channel.instruments.length = 0;
					for (let insturm of file) {
						if (!this._validate_instrument_limit(channel)) { 
							alert("Max instruments reached! Some instruments were not imported.");
							break;
						}
						this._doc.record(new ChangeAppendInstrument(this._doc, channel, insturm));
					}
					this._doc.record(new ChangeViewInstrument(this._doc, channel.instruments.length-1))
					this._doc.prompt = null;
					this._doc.notifier.changed();
					return;
				default:
					// console.log("multi append");
					window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
					//Add these instruments
					for (let insturm of file) {
						if (!this._validate_instrument_limit(channel)) { 
							alert("Max instruments reached! Some instruments were not imported.");
							break;
						}
						this._doc.record(new ChangeAppendInstrument(this._doc, channel, insturm));
					}
					this._doc.record(new ChangeViewInstrument(this._doc, channel.instruments.length-1))
					this._doc.prompt = null;
					this._doc.notifier.changed();
					return;
			}

    }

		public _validate_instrument_limit = (channel: Channel): boolean => {
			if (this._doc.song.getMaxInstrumentsPerChannel()<=channel.instruments.length) {
				return false;
			}
			return true;
		}

        public _import_single = (file: any): void => {
			const channel: Channel = this._doc.song.channels[this._doc.channel];
			const currentInstrum: Instrument = channel.instruments[this._doc.getCurrentInstrument()];
			switch (this._importStrategySelect.value) {
				case "replace":
					//Replace the current instrument with this one
					// console.log("single replace");
					window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
					this._doc.record(new ChangePasteInstrument(this._doc, currentInstrum, file));
					this._doc.record(new ChangeViewInstrument(this._doc, this._doc.getCurrentInstrument()))
					this._doc.prompt = null;
					this._doc.notifier.changed();
					return;
				case "all":
					//Delete all instruments then add this one
					// console.log("single all");
					window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
					channel.instruments.length = 1;
					const firstInstrum = channel.instruments[0];
					this._doc.record(new ChangePasteInstrument(this._doc, firstInstrum, file));
					this._doc.record(new ChangeViewInstrument(this._doc, 0))
					this._doc.prompt = null;
					this._doc.notifier.changed();
					return;
				default:
					//Add this instrument
					if (!this._validate_instrument_limit(channel)) { alert("Max instruments reached! The instrument was not imported."); this._doc.prompt = null; return; }
					// console.log("single append");
					window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
					this._doc.record(new ChangeAppendInstrument(this._doc, channel, file));
					this._doc.record(new ChangeViewInstrument(this._doc, channel.instruments.length-1))
					this._doc.prompt = null;
					this._doc.notifier.changed();
					return;
			}
    }

}
