// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
// import { Config } from "../synth/SynthConfig";
import { ChangeGroup } from "./Change";
import { ChangeSongAuthor, ChangeSongTitle, ChangeSongDescription } from "./changes";

const {button, div, h2, input, br} = HTML;

export class SongDetailsPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({class: "cancelButton"});
	private readonly _okayButton: HTMLButtonElement = button({class: "okayButton", style: "width:45%;"}, "Okay");
	private readonly _songTitle: HTMLInputElement = input({ type: "text", style: "width: 10em;", value: this._doc.song.title, maxlength: 30, "autofocus": "autofocus" });
	private readonly _songAuthor: HTMLInputElement = input({ type: "text", style: "width: 10em;", value: this._doc.song.author, maxlength: 30 });
	// this is an input because textarea doesn't support value
	private readonly _songDescription: HTMLInputElement = input({ type: "text", style: "width: 10em;", value: this._doc.song.description, maxlength: 120 });
	// private readonly _songWebLink: HTMLInputElement = input({ type: "text", style: "width: 13em;", value: "https://example.com", maxlength: 30 });
	private readonly _computedSamplesLabel: HTMLDivElement = div({ style: "width: 10em;" }, new Text("0:00"));
	
	public readonly container: HTMLDivElement = div({class: "prompt noSelection", style: "width: 250px;"},
		h2("Song Details"),
		// justify-content: start;
		div({ style: "display: flex; flex-direction: row; align-items: center;" },
            "Title: ",
            this._songTitle,
            ),
		div({ style: "display: flex; flex-direction: row; align-items: center;" },
            "Author: ",
            this._songAuthor,
            ),
		div({ style: "display: flex; flex-direction: row; align-items: center;" },
            "Description: ",
            this._songDescription,
            ),
		div({ style: "text-align: left;" },
		"Song Length: ", this._computedSamplesLabel,
		// br(),
		"Pitch: " + this._doc.song.pitchChannelCount + ", Noise: " + this._doc.song.noiseChannelCount + ", Mod: " + this._doc.song.modChannelCount,
		br(),
		"URL Length: " + location.href.length,
		br(),
		),
		// div({ style: "display: flex; flex-direction: row; align-items: center;" },
        //     "Song Length:",
        //     this._computedSamplesLabel,
		// ),
		div({style: "display: flex; flex-direction: row-reverse; justify-content: space-between;"},
			this._okayButton,
		),
		this._cancelButton,
	);
		
	constructor(private _doc: SongDocument) {	
		(this._computedSamplesLabel.firstChild as Text).textContent = this._doc.samplesToTime(this._doc.synth.getTotalSamples(true, true, 0));

		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
	}
		
		private _close = (): void => { 
		this._doc.undo();
	}
		
		public cleanUp = (): void => { 
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
	}
		
	// private _whenKeyPressed = (event: KeyboardEvent): void => {
	// 		if ((<Element> event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
	// 		this._saveChanges();
	// 	}
	// }
		
	private _saveChanges = (): void => {
		const group: ChangeGroup = new ChangeGroup();
		group.append(new ChangeSongTitle(this._doc, this._doc.song.author, this._songTitle.value));
		group.append(new ChangeSongAuthor(this._doc, this._doc.song.author, this._songAuthor.value));
		group.append(new ChangeSongDescription(this._doc, this._doc.song.author, this._songDescription.value));
		this._doc.prompt = null;
		this._doc.record(group, true);
	}
}
