import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
// import { Config } from "../synth/SynthConfig";
import { ChangeGroup } from "./Change";
import { ChangeSongAuthor, ChangeSongTitle, ChangeSongDescription, ChangeShowSongDetails } from "./changes";

const {button, div, h2, input, br, textarea} = HTML;

export class SongDetailsPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({class: "cancelButton"});
	private readonly _okayButton: HTMLButtonElement = button({class: "okayButton", style: "width:45%;"}, "Okay");
	private readonly _songTitle: HTMLInputElement = input({ type: "text", style: "width: 100%;", value: this._doc.song.title, maxlength: 30, "autofocus": "autofocus" });
	private readonly _songAuthor: HTMLInputElement = input({ type: "text", style: "width: 100%;", value: this._doc.song.author, maxlength: 30 });
	private readonly _songDescription: HTMLTextAreaElement = textarea({ style: "width: 100%; resize: none; background: var(--editor-background); color: white; height: 64px; border: 0.5px solid var(--input-box-outline); font-size: 14px;", maxlength: 120 }, this._doc.song.description);
	// private readonly _songWebLink: HTMLInputElement = input({ type: "text", style: "width: 13em;", value: "https://example.com", maxlength: 30 });
	private readonly _showSongDetailsBox: HTMLInputElement = input({style: "width: 3em; margin-left: 1em;", type: "checkbox"});
	private readonly _computedSamplesLabel: HTMLDivElement = div({ style: "width: 10em;" }, new Text("0:00"));
	
	public readonly container: HTMLDivElement = div({class: "prompt noSelection", style: "width: 250px;"},
		h2("Song Details"),
		// justify-content: start;
		div({ style: "display: flex; flex-direction: row; align-items: baseline; gap: 10px;" },
            "Title: ",
            this._songTitle,
            ),
		div({ style: "display: flex; flex-direction: row; align-items: baseline; gap: 10px;" },
            "Author: ",
            this._songAuthor,
            ),
		div({ style: "display: flex; flex-direction: column; align-items: baseline;" },
            "Description: ",
            this._songDescription,
            ),
		div({style: "vertical-align: middle; align-items: center; justify-content: space-between;"},
			"Show info on load: ",
			this._showSongDetailsBox,
		),
		div({ style: "text-align: left;" },
			div({style:"display:flex; gap: 3px; margin-bottom: 1em;"},"Song Length: ", this._computedSamplesLabel,),
		// br(),
		div({style:"margin-bottom: 0.5em;"},"Pitch Channels: " + this._doc.song.pitchChannelCount),
		div({style:"margin-bottom: 0.5em;"},"Noise Channels: " + this._doc.song.noiseChannelCount),
		div({},"Mod Channels: " + this._doc.song.modChannelCount),
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
		this._showSongDetailsBox.checked = this._doc.song.showSongDetails;

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
		group.append(new ChangeSongTitle(this._doc, this._doc.song.title, this._songTitle.value));
		group.append(new ChangeSongAuthor(this._doc, this._doc.song.author, this._songAuthor.value));
		group.append(new ChangeSongDescription(this._doc, this._doc.song.description, this._songDescription.value));
		group.append(new ChangeShowSongDetails(this._doc, this._doc.song.showSongDetails, this._showSongDetailsBox.checked));
		this._doc.prompt = null;
		this._doc.record(group, true);
	}
}
