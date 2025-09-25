// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig";
import { SpectrumWave, Instrument } from "../synth/synth";
import { SongDocument } from "./SongDocument";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";
import { ChangeSpectrum } from "./changes";
import { prettyNumber } from "./EditorConfig";
import { Prompt } from "./Prompt";
import { SongEditor } from "./SongEditor";
import { ChangeGroup } from "./Change";

export class SpectrumEditor {
	private readonly _editorWidth: number = 120;
	private readonly _editorHeight: number = 26;
		private readonly _fill: SVGPathElement = SVG.path({fill: ColorConfig.uiWidgetBackground, "pointer-events": "none"});
		private readonly _octaves: SVGSVGElement = SVG.svg({"pointer-events": "none"});
		private readonly _fifths: SVGSVGElement = SVG.svg({"pointer-events": "none"});
		private readonly _curve: SVGPathElement = SVG.path({fill: "none", stroke: "currentColor", "stroke-width": 2, "pointer-events": "none"});
		private readonly _arrow: SVGPathElement = SVG.path({fill: "currentColor", "pointer-events": "none"});
		private readonly _svg: SVGSVGElement = SVG.svg({style: `background-color: ${ColorConfig.editorBackground}; touch-action: none; cursor: crosshair;`, width: "100%", height: "100%", viewBox: "0 0 "+this._editorWidth+" "+this._editorHeight, preserveAspectRatio: "none"},
		this._fill,
		this._octaves,
		this._fifths,
		this._curve,
		this._arrow,
	);

	public readonly container: HTMLElement = HTML.div({class: "spectrum", style: "height: 100%;"}, this._svg);

	private _mouseX: number = 0;
	private _mouseY: number = 0;
	private _freqPrev: number = 0;
	private _ampPrev: number = 0;
	private _mouseDown: boolean = false;
	private _change: ChangeSpectrum | null = null;
	private _renderedPath: String = "";
	private _renderedFifths: boolean = true;
	private instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
	private _initial: SpectrumWave = new SpectrumWave(this._spectrumIndex != null); 

	private _undoHistoryState: number = 0;
	private _changeQueue: number[][] = [];
		
	constructor(private _doc: SongDocument, private _spectrumIndex: number | null, private _isPrompt: boolean = false) {
		this._initial.spectrum = this._spectrumIndex == null ? this.instrument.spectrumWave.spectrum.slice() : this.instrument.drumsetSpectrumWaves[this._spectrumIndex].spectrum.slice();
		for (let i: number = 0; i < Config.spectrumControlPoints; i += Config.spectrumControlPointsPerOctave) {
				this._octaves.appendChild(SVG.rect({fill: ColorConfig.tonic, x: (i+1) * this._editorWidth / (Config.spectrumControlPoints + 2) - 1, y: 0, width: 2, height: this._editorHeight}));
		}
		for (let i: number = 4; i <= Config.spectrumControlPoints; i += Config.spectrumControlPointsPerOctave) {
				this._fifths.appendChild(SVG.rect({fill: ColorConfig.fifthNote, x: (i+1) * this._editorWidth / (Config.spectrumControlPoints + 2) - 1, y: 0, width: 2, height: this._editorHeight}));
		}
			
		this.storeChange();

		this.container.addEventListener("mousedown", this._whenMousePressed);
		document.addEventListener("mousemove", this._whenMouseMoved);
		document.addEventListener("mouseup", this._whenCursorReleased);

		this.container.addEventListener("touchstart", this._whenTouchPressed);
		this.container.addEventListener("touchmove", this._whenTouchMoved);
		this.container.addEventListener("touchend", this._whenCursorReleased);
		this.container.addEventListener("touchcancel", this._whenCursorReleased);
	}
		
	public storeChange = (): void => {
		// Check if change is unique compared to the current history state
		var sameCheck = true;
		if (this._changeQueue.length > 0) {
			for (var i = 0; i < Config.spectrumControlPoints; i++) {
				if (this._changeQueue[this._undoHistoryState][i] != this.instrument.spectrumWave.spectrum[i]) {
					sameCheck = false; i = Config.spectrumControlPoints;
				}
			}
		}

		if (sameCheck == false || this._changeQueue.length == 0) {

			// Create new branch in history, removing all after this in time
			this._changeQueue.splice(0, this._undoHistoryState);

			this._undoHistoryState = 0;

			this._changeQueue.unshift(this.instrument.spectrumWave.spectrum.slice());

			// 32 undo max
			if (this._changeQueue.length > 32) {
				this._changeQueue.pop();
			}

		}

	}

	public undo = (): void => {
		// Go backward, if there is a change to go back to
		if (this._undoHistoryState < this._changeQueue.length - 1) {
			this._undoHistoryState++;
			const spectrum: number[] = this._changeQueue[this._undoHistoryState].slice();
			this.setSpectrumWave(spectrum);
		}

	}

	public redo = (): void => {
		// Go forward, if there is a change to go to
		if (this._undoHistoryState > 0) {
			this._undoHistoryState--;
			const spectrum: number[] = this._changeQueue[this._undoHistoryState].slice();
			this.setSpectrumWave(spectrum);
		}

	}

	private _xToFreq(x: number): number {
		return (Config.spectrumControlPoints + 2) * x / this._editorWidth - 1;
	}

	private _yToAmp(y: number): number {
		return Config.spectrumMax * (1 - (y - 1) / (this._editorHeight - 2));
	}

	private _whenMousePressed = (event: MouseEvent): void => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect: ClientRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;

		this._freqPrev = this._xToFreq(this._mouseX);
		this._ampPrev = this._yToAmp(this._mouseY);
		this._whenCursorMoved();
	}

	private _whenTouchPressed = (event: TouchEvent): void => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect: ClientRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;

		this._freqPrev = this._xToFreq(this._mouseX);
		this._ampPrev = this._yToAmp(this._mouseY);
		this._whenCursorMoved();
	}

	private _whenMouseMoved = (event: MouseEvent): void => {
		if (this.container.offsetParent == null) return;
		const boundingRect: ClientRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._whenCursorMoved();
	}

	private _whenTouchMoved = (event: TouchEvent): void => {
		if (this.container.offsetParent == null) return;
		if (!this._mouseDown) return;
		event.preventDefault();
		const boundingRect: ClientRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._whenCursorMoved();
		this.render();
	}

	private _whenCursorMoved(): void {
		if (this._mouseDown) {
			const freq: number = this._xToFreq(this._mouseX);
			const amp: number = this._yToAmp(this._mouseY);

			const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
			const spectrumWave: SpectrumWave = (this._spectrumIndex == null) ? instrument.spectrumWave : instrument.drumsetSpectrumWaves[this._spectrumIndex];

			if (freq != this._freqPrev) {
				const slope: number = (amp - this._ampPrev) / (freq - this._freqPrev);
				const offset: number = this._ampPrev - this._freqPrev * slope;
				const lowerFreq: number = Math.ceil(Math.min(this._freqPrev, freq));
				const upperFreq: number = Math.floor(Math.max(this._freqPrev, freq));
				for (let i: number = lowerFreq; i <= upperFreq; i++) {
					if (i < 0 || i >= Config.spectrumControlPoints) continue;
					spectrumWave.spectrum[i] = Math.max(0, Math.min(Config.spectrumMax, Math.round(i * slope + offset)));
				}
			}

			spectrumWave.spectrum[Math.max(0, Math.min(Config.spectrumControlPoints - 1, Math.round(freq)))] = Math.max(0, Math.min(Config.spectrumMax, Math.round(amp)));

			this._freqPrev = freq;
			this._ampPrev = amp;

			this._change = new ChangeSpectrum(this._doc, instrument, spectrumWave);
			this._doc.setProspectiveChange(this._change);
		}
	}

	private _whenCursorReleased = (event: Event): void => {
		if (this._mouseDown) {
			if (!this._isPrompt) {
				this._doc.record(this._change!);
			}
			this.storeChange();
			this._change = null;
		}
		this._mouseDown = false;
	}

	public getSpectrumWave(): SpectrumWave {
		const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		if (this._spectrumIndex == null) {
			return instrument.spectrumWave;
		} else {
			return instrument.drumsetSpectrumWaves[this._spectrumIndex];
		}
	}

	public setSpectrumWave(spectrum: number[], saveHistory: boolean = false) {
		const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		if (this._spectrumIndex == null) {
			for (let i = 0; i < Config.spectrumControlPoints; i++) {
				instrument.spectrumWave.spectrum[i] = spectrum[i];
			}
			const spectrumChange: ChangeSpectrum = new ChangeSpectrum(this._doc, instrument, instrument.spectrumWave);
			if (saveHistory) {
				this._doc.record(spectrumChange);
			} 
		} else {
			for (let i = 0; i < Config.spectrumControlPoints; i++) {
				instrument.drumsetSpectrumWaves[this._spectrumIndex].spectrum[i] = spectrum[i];
			}
			const spectrumChange: ChangeSpectrum = new ChangeSpectrum(this._doc, instrument, instrument.drumsetSpectrumWaves[this._spectrumIndex]);
			if (saveHistory) {
				this._doc.record(spectrumChange);
			} 
		}
		this.render();
	}

	public saveSettings(): ChangeSpectrum {
		const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		if (this._spectrumIndex == null || this._spectrumIndex == undefined) {
			return new ChangeSpectrum(this._doc, instrument, instrument.spectrumWave);
		} else {
			return new ChangeSpectrum(this._doc, instrument, instrument.drumsetSpectrumWaves[this._spectrumIndex]);
		}
	}

	public resetToInitial() {
		this._changeQueue = [];
		this._undoHistoryState = 0;
		//this.setSpectrumWave(this._initial.spectrum, false);
	}

	public render(): void {
		const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		const spectrumWave: SpectrumWave = (this._spectrumIndex == null) ? instrument.spectrumWave : instrument.drumsetSpectrumWaves[this._spectrumIndex];
		const controlPointToHeight = (point: number): number => {
			return (1 - (point / Config.spectrumMax)) * (this._editorHeight - 1) + 1;
		}

		let lastValue: number = 0;
		let path: string = "M 0 " + prettyNumber(this._editorHeight) + " ";
		for (let i: number = 0; i < Config.spectrumControlPoints; i++) {
			let nextValue: number = spectrumWave.spectrum[i];
			if (lastValue != 0 || nextValue != 0) {
				path += "L ";
			} else {
				path += "M ";
			}
			path += prettyNumber((i + 1) * this._editorWidth / (Config.spectrumControlPoints + 2)) + " " + prettyNumber(controlPointToHeight(nextValue)) + " ";
			lastValue = nextValue;
		}

		const lastHeight: number = controlPointToHeight(lastValue);
		if (lastValue > 0) {
			path += "L " + (this._editorWidth - 1) + " " + prettyNumber(lastHeight) + " ";
		}

		if (this._renderedPath != path) {
			this._renderedPath = path;
			this._curve.setAttribute("d", path);
			this._fill.setAttribute("d", path + "L " + this._editorWidth + " " + prettyNumber(lastHeight) + " L " + this._editorWidth + " " + prettyNumber(this._editorHeight) + " L 0 " + prettyNumber(this._editorHeight) + " z ");

			this._arrow.setAttribute("d", "M " + this._editorWidth + " " + prettyNumber(lastHeight) + " L " + (this._editorWidth - 4) + " " + prettyNumber(lastHeight - 4) + " L " + (this._editorWidth - 4) + " " + prettyNumber(lastHeight + 4) + " z");
			this._arrow.style.display = (lastValue > 0) ? "" : "none";
		}
		if (this._renderedFifths != this._doc.prefs.showFifth) {
			this._renderedFifths = this._doc.prefs.showFifth;
			this._fifths.style.display = this._doc.prefs.showFifth ? "" : "none";
		}
	}
}

export class SpectrumEditorPrompt implements Prompt {

	public spectrumEditor: SpectrumEditor = new SpectrumEditor(this._doc, null, true);

	private readonly spectrumEditors: SpectrumEditor[] = [];

	private _drumsetSpectrumIndex: number = 0;

	public readonly _playButton: HTMLButtonElement = HTML.button({ style: "width: 55%;", type: "button" });

	public readonly _drumsetButtons: HTMLButtonElement[] = [];
	public readonly _drumsetButtonContainer: HTMLDivElement = HTML.div({ class: "instrument-bar", style: "justify-content: center;" });

	private readonly _cancelButton: HTMLButtonElement = HTML.button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = HTML.button({ class: "okayButton", style: "width:45%;" }, "Okay");

	private readonly copyButton: HTMLButtonElement = HTML.button({ style: "width:86px; margin-right: 5px;", class: "copyButton" }, [
		"Copy",
		// Copy icon:
		SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "-5 -21 26 26" }, [
			SVG.path({ d: "M 0 -15 L 1 -15 L 1 0 L 13 0 L 13 1 L 0 1 L 0 -15 z M 2 -1 L 2 -17 L 10 -17 L 14 -13 L 14 -1 z M 3 -2 L 13 -2 L 13 -12 L 9 -12 L 9 -16 L 3 -16 z", fill: "currentColor" }),
		]),
	]);
	private readonly pasteButton: HTMLButtonElement = HTML.button({ style: "width:86px;", class: "pasteButton" }, [
		"Paste",
		// Paste icon:
		SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "0 0 26 26" }, [
			SVG.path({ d: "M 8 18 L 6 18 L 6 5 L 17 5 L 17 7 M 9 8 L 16 8 L 20 12 L 20 22 L 9 22 z", stroke: "currentColor", fill: "none" }),
			SVG.path({ d: "M 9 3 L 14 3 L 14 6 L 9 6 L 9 3 z M 16 8 L 20 12 L 16 12 L 16 8 z", fill: "currentColor", }),
		]),
	]);
	private readonly copyPasteContainer: HTMLDivElement = HTML.div({ style: "width: 185px;" }, this.copyButton, this.pasteButton);
	public readonly container: HTMLDivElement = HTML.div({ class: "prompt noSelection", style: "width: 500px;"},
		HTML.h2("Edit Spectrum Instrument"),
		HTML.div({ style: "display: flex; width: 55%; align-self: center; flex-direction: row; align-items: center; justify-content: center;" },
			this._playButton,
		),
		this._drumsetButtonContainer,
		HTML.div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center; height: 80%" },
			this.spectrumEditor.container,
		),
		HTML.div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
			this.copyPasteContainer,
		),
		this._cancelButton,
	);

	constructor(private _doc: SongDocument, private _songEditor: SongEditor, private _isDrumset: boolean) {
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this.whenKeyPressed);
		this.copyButton.addEventListener("click", this._copySettings);
		this.pasteButton.addEventListener("click", this._pasteSettings);
		this._playButton.addEventListener("click", this._togglePlay);
		//this.spectrumEditor.container.addEventListener("mousemove", () => this.spectrumEditor.render());
		this.container.addEventListener("mousemove", () => {
			this.spectrumEditor.render(); this.spectrumEditors[this._drumsetSpectrumIndex].setSpectrumWave(this.spectrumEditor.getSpectrumWave().spectrum);
		});
		this.container.addEventListener("mousedown", this.spectrumEditor.render);
		this.spectrumEditor.container.addEventListener("mousemove", () => {
			this.spectrumEditor.render(); this.spectrumEditors[this._drumsetSpectrumIndex].setSpectrumWave(this.spectrumEditor.getSpectrumWave().spectrum);
		});
		this.spectrumEditor.container.addEventListener("mousedown", this.spectrumEditor.render);
		this.updatePlayButton();
		if (this._isDrumset) {
			for (let i: number = Config.drumCount-1; i >= 0 ; i--) {
				this.spectrumEditors[i] = new SpectrumEditor(this._doc, Config.drumCount - 1 - i, true);
				this.spectrumEditors[i].setSpectrumWave(this._songEditor._drumsetSpectrumEditors[Config.drumCount - 1-i].getSpectrumWave().spectrum);
			}
			let colors = ColorConfig.getChannelColor(this._doc.song, this._doc.channel);
			for (let i: number = 0; i < Config.drumCount ; i++) {
				let newSpectrumButton: HTMLButtonElement = HTML.button({ class: "no-underline", style: "max-width: 2em;" }, "" + (i+1));
				this._drumsetButtons.push(newSpectrumButton);
				this._drumsetButtonContainer.appendChild(newSpectrumButton);
				newSpectrumButton.addEventListener("click", () => { this._setDrumSpectrum(i); });
			}
			this._drumsetButtons[Config.drumCount - 1].classList.add("last-button");
			this._drumsetButtons[0].classList.add("selected-instrument");

			this._drumsetButtonContainer.style.setProperty("--text-color-lit", colors.primaryNote);
			this._drumsetButtonContainer.style.setProperty("--text-color-dim", colors.secondaryNote);
			this._drumsetButtonContainer.style.setProperty("--background-color-lit", colors.primaryChannel);
			this._drumsetButtonContainer.style.setProperty("--background-color-dim", colors.secondaryChannel);
			this._drumsetButtonContainer.style.display = "";
			this.spectrumEditor.container.style.display = "";
			this.spectrumEditor.setSpectrumWave(this.spectrumEditors[this._drumsetSpectrumIndex].getSpectrumWave().spectrum);
			
		} else {
			this._drumsetButtonContainer.style.display = "none";
			this.spectrumEditors[0] = this.spectrumEditor;
		}

		setTimeout(() => this._playButton.focus());
			this.spectrumEditor.render();
	}

	private _setDrumSpectrum = (index: number/*, useHistory: boolean = true, doSwap: boolean = true*/): void => {
		this._drumsetButtons[this._drumsetSpectrumIndex] .classList.remove("selected-instrument");
		//if (doSwap) this.swapDrumsetSpectrums(this._drumsetSpectrumIndex, index, useHistory);
		this.spectrumEditors[this._drumsetSpectrumIndex].setSpectrumWave(this.spectrumEditor.getSpectrumWave().spectrum);

		this._drumsetSpectrumIndex = index;
		this._drumsetButtons[index].classList.add("selected-instrument");
		//this.spectrumEditor = new SpectrumEditor(this._doc, this._drumsetSpectrumIndex, true);
		this.spectrumEditor.setSpectrumWave(this.spectrumEditors[this._drumsetSpectrumIndex].getSpectrumWave().spectrum);
		this.spectrumEditor.render();
	}

	private _togglePlay = (): void => {
		this._songEditor.togglePlay();
		this.updatePlayButton();
	}

	public updatePlayButton(): void {
		if (this._doc.synth.playing) {
			this._playButton.classList.remove("playButton");
			this._playButton.classList.add("pauseButton");
			this._playButton.title = "Pause (Space)";
			this._playButton.innerText = "Pause";
		} else {
			this._playButton.classList.remove("pauseButton");
			this._playButton.classList.add("playButton");
			this._playButton.title = "Play (Space)";
			this._playButton.innerText = "Play";
		}
	}

	private _close = (): void => {
		// for (let i = 0; i < this.spectrumEditors.length; i++) {
		//	 this.spectrumEditors[i].resetToInitial();
		// }
		this._doc.prompt = null;
		this._doc.undo();
	}

	public cleanUp = (): void => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this.whenKeyPressed);
		this.spectrumEditor.container.removeEventListener("mousemove", () => this.spectrumEditor.render());
		this._playButton.removeEventListener("click", this._togglePlay);
	}

	private _copySettings = (): void => {
		const spectrumCopy: SpectrumWave = this.spectrumEditor.getSpectrumWave();
		window.localStorage.setItem("spectrumCopy", JSON.stringify(spectrumCopy.spectrum));
	}

	private _pasteSettings = (): void => {
		const storedSpectrumWave: any = JSON.parse(String(window.localStorage.getItem("spectrumCopy")));
		this.spectrumEditor.setSpectrumWave(storedSpectrumWave);
	}

	public whenKeyPressed = (event: KeyboardEvent): void => {
		if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
		else if (event.keyCode == 32) {
			this._togglePlay();
			event.preventDefault();
		}
		else if (event.keyCode == 90) { // z
			this.spectrumEditor.undo();
			event.stopPropagation();
		}
		else if (event.keyCode == 89) { // y
			this.spectrumEditor.redo();
			event.stopPropagation();
		}
		else if (event.keyCode == 219) { // [
			this._doc.synth.goToPrevBar();
		}
		else if (event.keyCode == 221) { // ]
			this._doc.synth.goToNextBar();
		}
		else if (event.keyCode >= 49 && event.keyCode <= 57) { // 1-9
			if (event.shiftKey && this._isDrumset) {
				this._setDrumSpectrum(event.keyCode - 49);
			}
		} else if (event.keyCode == 48) { // 0
			if (event.shiftKey && this._isDrumset) {
				this._setDrumSpectrum(9);
			}
		} else if (event.keyCode == 189 || event.keyCode == 173) { //-
			if (event.shiftKey && this._isDrumset) {
				this._setDrumSpectrum(10);
			}
		} else if (event.keyCode == 187 || event.keyCode == 61 || event.keyCode == 171) { //+
			if (event.shiftKey && this._isDrumset) {
				this._setDrumSpectrum(11);
			}
		}
	}

	private _saveChanges = (): void => {
		// Save again just in case
		const group: ChangeGroup = new ChangeGroup();
		for (let i = 0; i < this.spectrumEditors.length; i++) {
			group.append(this.spectrumEditors[i].saveSettings());
		}
		this._doc.record(group, true);
		this._doc.prompt = null;
	}
}