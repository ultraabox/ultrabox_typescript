// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import {Scale, Config} from "../synth/SynthConfig";
import {ColorConfig} from "../editor/ColorConfig";

export class Preferences {
	public static readonly defaultVisibleOctaves: number = 3;
	public static readonly defaultCustomColors: string = `:root {
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
		--disabled-note-secondary:  #666; }`
	
	public customTheme: string | null;
	public customTheme2: string | null;
	public customColors: string | null;
	public autoPlay: boolean;
	public autoFollow: boolean;
	public enableNotePreview: boolean;
	public showFifth: boolean;
	public notesOutsideScale: boolean;
	public defaultScale: number;
	public showLetters: boolean;
	public showChannels: boolean;
	public showScrollBar: boolean;
	public alwaysFineNoteVol: boolean;
	public displayVolumeBar: boolean;
	public instrumentCopyPaste: boolean;
	public instrumentImportExport: boolean;
	public instrumentButtonsAtTop: boolean;
	public enableChannelMuting: boolean;
	public colorTheme: string;
	public layout: string;
	public displayBrowserUrl: boolean;
	public volume: number = 75;
	public visibleOctaves: number = Preferences.defaultVisibleOctaves;
	public pressControlForShortcuts: boolean;
	public keyboardLayout: string;
	public bassOffset: number;
	public enableMidi: boolean;
	public showRecordButton: boolean;
	public snapRecordedNotesToRhythm: boolean;
	public ignorePerformedNotesNotInScale: boolean;
	public metronomeCountIn: boolean;
	public metronomeWhileRecording: boolean;
	public notesFlashWhenPlayed: boolean;
	public showOscilloscope: boolean;
	public showSampleLoadingStatus: boolean;
	public showDescription: boolean;
	public showInstrumentScrollbars: boolean;
	public closePromptByClickoff: boolean;
	public frostedGlassBackground: boolean;
	public shortenerStrategySelect: string;
	public removeWhitespace: boolean;
	
	constructor() {
		this.reload();
	}
	
	public reload(): void {
		this.autoPlay = window.localStorage.getItem("autoPlay") == "true";
		this.autoFollow = window.localStorage.getItem("autoFollow") != "false";
		this.enableNotePreview = window.localStorage.getItem("enableNotePreview") != "false";
		this.showFifth = window.localStorage.getItem("showFifth") == "true";
		this.notesOutsideScale = window.localStorage.getItem("notesOutsideScale") == "true";
		this.showLetters = window.localStorage.getItem("showLetters") == "true";
		this.showChannels = window.localStorage.getItem("showChannels") == "true";
		this.showScrollBar = window.localStorage.getItem("showScrollBar") != "false";
		this.alwaysFineNoteVol = window.localStorage.getItem("alwaysFineNoteVol") == "true";
		this.displayVolumeBar = window.localStorage.getItem("displayVolumeBar") != "false";
		this.instrumentCopyPaste = window.localStorage.getItem("instrumentCopyPaste") != "false";
		this.instrumentImportExport = window.localStorage.getItem("instrumentImportExport") == "true";
		this.instrumentButtonsAtTop = window.localStorage.getItem("instrumentButtonsAtTop") == "true"
		this.enableChannelMuting = window.localStorage.getItem("enableChannelMuting") != "false";
		this.displayBrowserUrl = window.localStorage.getItem("displayBrowserUrl") != "false";
		this.pressControlForShortcuts = window.localStorage.getItem("pressControlForShortcuts") == "true";
		this.enableMidi = window.localStorage.getItem("enableMidi") != "false";
		this.showRecordButton = window.localStorage.getItem("showRecordButton") == "true";
		this.snapRecordedNotesToRhythm = window.localStorage.getItem("snapRecordedNotesToRhythm") == "true";
		this.ignorePerformedNotesNotInScale = window.localStorage.getItem("ignorePerformedNotesNotInScale") == "true";
		this.metronomeCountIn = window.localStorage.getItem("metronomeCountIn") != "false";
		this.metronomeWhileRecording = window.localStorage.getItem("metronomeWhileRecording") != "false";
		this.notesFlashWhenPlayed = window.localStorage.getItem("notesFlashWhenPlayed") == "true";
		this.showOscilloscope = window.localStorage.getItem("showOscilloscope") == "true";
		this.showSampleLoadingStatus = window.localStorage.getItem("showSampleLoadingStatus") != "false";
		this.showDescription = window.localStorage.getItem("showDescription") != "false";
		this.showInstrumentScrollbars = window.localStorage.getItem("showInstrumentScrollbars") == "true";
		this.closePromptByClickoff = window.localStorage.getItem("closePromptByClickoff") == "true";
		this.frostedGlassBackground = window.localStorage.getItem("frostedGlassBackground") == "true";
		this.shortenerStrategySelect = window.localStorage.getItem("shortenerStrategySelect") || "tinyurl";
		this.removeWhitespace = window.localStorage.getItem("removeWhitespace") != "false";
		this.keyboardLayout = window.localStorage.getItem("keyboardLayout") || "pianoTransposingC";
		this.bassOffset = (+(<any>window.localStorage.getItem("bassOffset"))) || 0;
		this.layout = window.localStorage.getItem("layout") || "small";
		this.colorTheme = window.localStorage.getItem("colorTheme") || ColorConfig.defaultTheme;
		this.customTheme = window.localStorage.getItem("customTheme");
        this.customTheme2 = window.localStorage.getItem("customTheme2");
		this.customColors = window.localStorage.getItem("customColors") || "";
		this.visibleOctaves = ((<any>window.localStorage.getItem("visibleOctaves")) >>> 0) || Preferences.defaultVisibleOctaves;
		
		const defaultScale: Scale | undefined = Config.scales.dictionary[window.localStorage.getItem("defaultScale")!];
		this.defaultScale = (defaultScale != undefined) ? defaultScale.index : 0;
		
		if (window.localStorage.getItem("volume") != null) {
			this.volume = Math.min(<any>window.localStorage.getItem("volume") >>> 0, 75);
		}
		
		if (window.localStorage.getItem("fullScreen") != null) {
			if (window.localStorage.getItem("fullScreen") == "true") this.layout = "long";
			window.localStorage.removeItem("fullScreen");
		}
		
	}
	
	public save(): void {
		window.localStorage.setItem("autoPlay", this.autoPlay ? "true" : "false");
		window.localStorage.setItem("autoFollow", this.autoFollow ? "true" : "false");
		window.localStorage.setItem("enableNotePreview", this.enableNotePreview ? "true" : "false");
		window.localStorage.setItem("showFifth", this.showFifth ? "true" : "false");
		window.localStorage.setItem("notesOutsideScale", this.notesOutsideScale ? "true" : "false");
		window.localStorage.setItem("defaultScale", Config.scales[this.defaultScale].name);
		window.localStorage.setItem("showLetters", this.showLetters ? "true" : "false");
		window.localStorage.setItem("showChannels", this.showChannels ? "true" : "false");
		window.localStorage.setItem("showScrollBar", this.showScrollBar ? "true" : "false");
		window.localStorage.setItem("alwaysFineNoteVol", this.alwaysFineNoteVol ? "true" : "false");
		window.localStorage.setItem("displayVolumeBar", this.displayVolumeBar ? "true" : "false");
		window.localStorage.setItem("enableChannelMuting", this.enableChannelMuting ? "true" : "false");
		window.localStorage.setItem("instrumentCopyPaste", this.instrumentCopyPaste ? "true" : "false");
		window.localStorage.setItem("instrumentImportExport", this.instrumentImportExport ? "true" : "false");
		window.localStorage.setItem("instrumentButtonsAtTop", this.instrumentButtonsAtTop ? "true" : "false");
		window.localStorage.setItem("displayBrowserUrl", this.displayBrowserUrl ? "true" : "false");
		window.localStorage.setItem("pressControlForShortcuts", this.pressControlForShortcuts ? "true" : "false");
		window.localStorage.setItem("enableMidi", this.enableMidi ? "true" : "false");
		window.localStorage.setItem("showRecordButton", this.showRecordButton ? "true" : "false");
		window.localStorage.setItem("snapRecordedNotesToRhythm", this.snapRecordedNotesToRhythm ? "true" : "false");
		window.localStorage.setItem("ignorePerformedNotesNotInScale", this.ignorePerformedNotesNotInScale ? "true" : "false");
		window.localStorage.setItem("metronomeCountIn", this.metronomeCountIn ? "true" : "false");
		window.localStorage.setItem("metronomeWhileRecording", this.metronomeWhileRecording ? "true" : "false");
		window.localStorage.setItem("notesFlashWhenPlayed", this.notesFlashWhenPlayed ? "true" : "false");
		window.localStorage.setItem("showOscilloscope", this.showOscilloscope ? "true" : "false");
		window.localStorage.setItem("showSampleLoadingStatus", this.showSampleLoadingStatus ? "true" : "false");
		window.localStorage.setItem("showDescription", this.showDescription ? "true" : "false");
		window.localStorage.setItem("showInstrumentScrollbars", this.showInstrumentScrollbars ? "true" : "false");
		window.localStorage.setItem("closePromptByClickoff", this.closePromptByClickoff ? "true" : "false");
		window.localStorage.setItem("frostedGlassBackground", this.frostedGlassBackground ? "true" : "false");
		window.localStorage.setItem("shortenerStrategySelect", this.shortenerStrategySelect);
		window.localStorage.setItem("removeWhitespace", this.removeWhitespace ? "true" : "false");
		window.localStorage.setItem("keyboardLayout", this.keyboardLayout);
		window.localStorage.setItem("bassOffset", String(this.bassOffset));
		window.localStorage.setItem("layout", this.layout);
		window.localStorage.setItem("colorTheme", this.colorTheme);
		window.localStorage.setItem("customTheme", this.customTheme!);
		window.localStorage.setItem("customTheme2", this.customTheme2!);
		window.localStorage.setItem("customColors", this.customColors || "");
		window.localStorage.setItem("volume", String(this.volume));
		window.localStorage.setItem("visibleOctaves", String(this.visibleOctaves));
		
	}
}
