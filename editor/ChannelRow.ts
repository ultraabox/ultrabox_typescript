// Copyright (C) 2021 John Nesky, distributed under the MIT license.

import {Pattern} from "../synth/synth";
import {ColorConfig, ChannelColors} from "./ColorConfig";
import {SongDocument} from "./SongDocument";
import {HTML} from "imperative-html/dist/esm/elements-strict";

export class Box {
	private readonly _text: Text = document.createTextNode("");
	private readonly _label: HTMLElement = HTML.div({class: "channelBoxLabel"}, this._text);
	public readonly container: HTMLElement = HTML.div({class: "channelBox", style: `margin: 1px; height: ${ChannelRow.patternHeight - 2}px;`}, this._label);
	private _renderedIndex: number = -1;
    private _renderedLabelColor: string = "?";
    private _renderedBackgroundColor: string = "?";
	constructor(channel: number, color: string) {
		this.container.style.background = ColorConfig.uiWidgetBackground;
		this._label.style.color = color;
	}
	
	public setWidth(width: number): void {
		this.container.style.width = (width - 2) + "px"; // there's a 1 pixel margin on either side.
	}

	public setHeight(height: number): void {
		this.container.style.height = (height - 2) + "px"; // there's a 1 pixel margin on either side.
	}
	
	public setIndex(index: number, selected: boolean, dim: boolean, color: string, isNoise: boolean, isMod: boolean): void {
		if (this._renderedIndex != index) {			
			if (index >= 100) {
				this._label.setAttribute("font-size", "16");
				this._label.style.setProperty("transform", "translate(0px, -1.5px)");
			}
			else {
				this._label.setAttribute("font-size", "20");
				this._label.style.setProperty("transform", "translate(0px, 0px)");
			}

			this._renderedIndex = index;
			this._text.data = String(index);
		}
		let useColor: string = selected ? ColorConfig.c_invertedText : color;
		if (this._renderedLabelColor != useColor) {
			this._label.style.color = useColor;
			this._renderedLabelColor = useColor;
		}
		if (!selected) {
			if (isNoise)
				color = dim ? ColorConfig.c_trackEditorBgNoiseDim : ColorConfig.c_trackEditorBgNoise;
			else if (isMod)
				color = dim ? ColorConfig.c_trackEditorBgModDim : ColorConfig.c_trackEditorBgMod;
			else
				color = dim ? ColorConfig.c_trackEditorBgPitchDim : ColorConfig.c_trackEditorBgPitch;
		}
		color = selected ? color : (index == 0) ? "none" : color;
		if (this._renderedBackgroundColor != color) {
			this.container.style.background = color;
			this._renderedBackgroundColor = color;
		}
	}
}

export class ChannelRow {
	public static patternHeight: number = 28;
	
	private _renderedBarWidth: number = -1;
	private _renderedBarHeight: number = -1;
	private _boxes: Box[] = [];
	
	public readonly container: HTMLElement = HTML.div({class: "channelRow"});
	
	constructor(private readonly _doc: SongDocument, public readonly index: number) {}
	
	public render(): void {
		ChannelRow.patternHeight = this._doc.getChannelHeight();

		const barWidth: number = this._doc.getBarWidth();
		if (this._boxes.length != this._doc.song.barCount) {
			for (let x: number = this._boxes.length; x < this._doc.song.barCount; x++) {
				const box: Box = new Box(this.index, ColorConfig.getChannelColor(this._doc.song, this.index).secondaryChannel);
				box.setWidth(barWidth);
				this.container.appendChild(box.container);
				this._boxes[x] = box;
			}
			for (let x: number = this._doc.song.barCount; x < this._boxes.length; x++) {
				this.container.removeChild(this._boxes[x].container);
			}
			this._boxes.length = this._doc.song.barCount;
		}
		
		if (this._renderedBarWidth != barWidth) {
			this._renderedBarWidth = barWidth;
			for (let x: number = 0; x < this._boxes.length; x++) {
				this._boxes[x].setWidth(barWidth);
			}
		}

		if (this._renderedBarHeight != ChannelRow.patternHeight) {
			this._renderedBarHeight = ChannelRow.patternHeight;
			for (let x: number = 0; x < this._boxes.length; x++) {
				this._boxes[x].setHeight(ChannelRow.patternHeight);
			}
		}
		
		for (let i: number = 0; i < this._boxes.length; i++) {
			const pattern: Pattern | null = this._doc.song.getPattern(this.index, i);
			const selected: boolean = (i == this._doc.bar && this.index == this._doc.channel);
			const dim: boolean = (pattern == null || pattern.notes.length == 0);
			
			const box: Box = this._boxes[i];
			if (i < this._doc.song.barCount) {
				const colors: ChannelColors = ColorConfig.getChannelColor(this._doc.song, this.index);
				box.setIndex(this._doc.song.channels[this.index].bars[i], selected, dim, dim && !selected ? colors.secondaryChannel : colors.primaryChannel,
					this.index >= this._doc.song.pitchChannelCount && this.index < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount, this.index >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount);
				box.container.style.visibility = "visible";
			} else {
				box.container.style.visibility = "hidden";
			}
			if (i == this._doc.synth.loopBarStart) {
				box.container.style.setProperty("border-left", `1px dashed ${ColorConfig.uiWidgetFocus}`);
			}
			else {
				box.container.style.setProperty("border-left", "none");
            }
			if (i == this._doc.synth.loopBarEnd) {
				box.container.style.setProperty("border-right", `1px dashed ${ColorConfig.uiWidgetFocus}`);
			}
			else {
				box.container.style.setProperty("border-right", "none");
            }
		}
	}
}
