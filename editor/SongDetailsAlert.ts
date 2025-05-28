import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
// import { Config } from "../synth/SynthConfig";

const {button, div, h2, br} = HTML;

// "Pseudo-prompt"
export class SongDetailsAlert {
	private readonly _okayButton: HTMLButtonElement = button({class: "okayButton", style: "width:45%;"}, "Okay");
	private readonly _computedSamplesLabel: HTMLDivElement = div({ style: "width: 10em;" }, new Text("0:00"));
	
	public readonly container: HTMLDivElement = div({class: "alert load", style: "width: 250px;"},
		h2(this._doc.song.title != "" ? this._doc.song.title : "Untitled"),
		// h2(this._doc.song.title),
		br,
		div({ style: "display: flex; flex-direction: row; align-items: baseline; gap: 10px;" },
            this._doc.song.author != "" ? "\n\nBy " + this._doc.song.author : "",
            ),
		br,
		div({ style: "display: flex; flex-direction: column; align-items: baseline;" },
			this._doc.song.description != "" ? "\n\n\n" + this._doc.song.description : "",
            ),
		br,
		
		div({ style: "text-align: left;" },
		div({style:"display:flex; gap: 3px; margin-bottom: 1em;"},"Song Length: ", this._computedSamplesLabel),
		// div({style:"margin-bottom: 0.5em;"},"Pitch Channels: " + this._doc.song.pitchChannelCount),
		// div({style:"margin-bottom: 0.5em;"},"Noise Channels: " + this._doc.song.noiseChannelCount),
		// div({},"Mod Channels: " + this._doc.song.modChannelCount),
		// br(),
		// "URL Length: " + location.href.length,
		// br(),
		),

		div({style: "display: flex; flex-direction: row-reverse; justify-content: space-between;"},
			this._okayButton,
		),
	);
		
	constructor(private _doc: SongDocument) {	
		(this._computedSamplesLabel.firstChild as Text).textContent = this._doc.samplesToTime(this._doc.synth.getTotalSamples(true, true, 0));

		this._okayButton.addEventListener("click", this._close);
	}
		
	private _close = (): void => {
		this.container.style.display = "none";
		this._okayButton.removeEventListener("click", this._close);
	}
}
