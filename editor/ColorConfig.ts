// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { BeepBoxOption, DictionaryArray, toNameMap, Config } from "../synth/SynthConfig";
import { Song } from "../synth/synth";
import { HTML } from "imperative-html/dist/esm/elements-strict";

export interface ChannelColors extends BeepBoxOption {
    readonly secondaryChannel: string;
    readonly primaryChannel: string;
    readonly secondaryNote: string;
    readonly primaryNote: string;
}

export class ColorConfig {
    public static colorLookup: Map<number, ChannelColors> = new Map<number, ChannelColors>();
	public static usesColorFormula: boolean = false;
	public static readonly defaultTheme: string = "ultrabox dark";
    public static readonly themes: { [name: string]: string } = {
	"dark classic": ``,
        "dark competition": `
				:root {
					--hover-preview: #ddd;
					--playhead: #ddd;
					--primary-text: #ddd;
					--secondary-text: #8e695b;
					--text-selection: rgba(169,0,255,0.99);
					--box-selection-fill: rgba(221,221,221,0.2);
					--loop-accent: #bf15ba;
					--link-accent: #f888ff;
					--ui-widget-background: #443a3a;
					--pitch-background: #353333;
					--tonic: #884a44;
					--fifth-note: #415498;
					--noise4-secondary-channel: #6B3E8E;
			}
		`,
        "light classic": `
			:root {
				-webkit-text-stroke-width: 0.5px;
				--page-margin: #685d88;
				--editor-background: white;
				--hover-preview: black;
				--playhead: rgba(0,0,0,0.5);
				--primary-text: black;
				--secondary-text: #777;
				--inverted-text: white;
				--text-selection: rgba(200,170,255,0.99);
				--box-selection-fill: rgba(0,0,0,0.1);
				--loop-accent: #98f;
				--link-accent: #74f;
				--ui-widget-background: #ececec;
				--ui-widget-focus: #eee;
				--pitch-background: #ececec;
				--tonic: #f0d6b6;
				--fifth-note: #bbddf0;
				--white-piano-key: #eee;
				--black-piano-key: #666;
					--track-editor-bg-pitch: #ececec;
					--track-editor-bg-pitch-dim: #fdfdfd;
					--track-editor-bg-noise: #ececec;
					--track-editor-bg-noise-dim: #fdfdfd;
					--track-editor-bg-mod: #dbecfd;
					--track-editor-bg-mod-dim: #ecfdff;
					--multiplicative-mod-slider: #789;
					--overwriting-mod-slider: #987;
					--indicator-primary: #98f;
					--indicator-secondary: #cde;
					--select2-opt-group: #cecece;
					--input-box-outline: #ddd;
					--mute-button-normal: #c0b47f;
					--mute-button-mod: #bd7fc0;
				--pitch1-secondary-channel: #6CD9ED;
				--pitch1-primary-channel:   #00A0BD;
				--pitch1-secondary-note:    #34C2DC;
				--pitch1-primary-note:      #00758A;
				--pitch2-secondary-channel: #E3C941;
				--pitch2-primary-channel:   #B49700;
				--pitch2-secondary-note:    #D1B628;
				--pitch2-primary-note:      #836E00;
				--pitch3-secondary-channel: #FF9D61;
				--pitch3-primary-channel:   #E14E00;
				--pitch3-secondary-note:    #F67D3C;
				--pitch3-primary-note:      #B64000;
				--pitch4-secondary-channel: #4BE24B;
				--pitch4-primary-channel:   #00A800;
				--pitch4-secondary-note:    #2DC82D;
				--pitch4-primary-note:      #008000;
				--pitch5-secondary-channel: #FF90FF;
				--pitch5-primary-channel:   #E12EDF;
				--pitch5-secondary-note:    #EC6EEC;
				--pitch5-primary-note:      #A600A5;
				--pitch6-secondary-channel: #B5B5FE;
				--pitch6-primary-channel:   #6969FD;
				--pitch6-secondary-note:    #9393FE;
				--pitch6-primary-note:      #4A4AD7;
				--pitch7-secondary-channel: #C2D848;
				--pitch7-primary-channel:   #8EA800;
				--pitch7-secondary-note:    #B0C82D;
				--pitch7-primary-note:      #6C8000;
				--pitch8-secondary-channel: #FF90A4;
				--pitch8-primary-channel:   #E12E4D;
				--pitch8-secondary-note:    #EC6E85;
				--pitch8-primary-note:      #A6001D;
				--pitch9-secondary-channel: #41E3B5;
				--pitch9-primary-channel:   #00B481;
				--pitch9-secondary-note:    #28D1A1;
				--pitch9-primary-note:      #00835E;
				--pitch10-secondary-channel:#CA77FF;
				--pitch10-primary-channel:  #9609FF;
				--pitch10-secondary-note:   #B54FFF;
				--pitch10-primary-note:     #8400E3;
				--noise1-secondary-channel: #C1C1C1;
				--noise1-primary-channel:   #898989;
				--noise1-secondary-note:    #ADADAD;
				--noise1-primary-note:      #6C6C6C;
				--noise2-secondary-channel: #E8BB8C;
				--noise2-primary-channel:   #BD7D3A;
				--noise2-secondary-note:    #D1A374;
				--noise2-primary-note:      #836342;
				--noise3-secondary-channel: #9BC4EB;
				--noise3-primary-channel:   #4481BE;
				--noise3-secondary-note:    #7CA7D3;
				--noise3-primary-note:      #476685;
				--noise4-secondary-channel: #C5A5E0;
				--noise4-primary-channel:   #8553AE;
				--noise4-secondary-note:    #B290CC;
				--noise4-primary-note:      #684F7D;
				--noise5-secondary-channel: #B8CE93;
				--noise5-primary-channel:   #87A74F;
				--noise5-secondary-note:    #ABC183;
				--noise5-primary-note:      #68784C;
					--mod1-secondary-channel:   #339955;
					--mod1-primary-channel:     #77dd55;
					--mod1-primary-note:        #2ad84a;
					--mod2-primary-note:        #ba124a;
					--mod3-primary-note:        #7a1caa;
					--mod4-primary-note:        #a86810;
					--mod-label-primary:        #dddddd;
					--mod-label-secondary-text: #777;
					--disabled-note-primary:    #666;
					--disabled-note-secondary:  #aaa;
			}
			
			.beepboxEditor button, .beepboxEditor select {
				box-shadow: inset 0 0 0 1px var(--secondary-text);
			}

				.select2-selection__rendered {
					box-shadow: inset 0 0 0 1px var(--secondary-text);
				}

				.promptContainerBG::before {
					box-shadow: inset 0 0 2000px rgba(255, 255, 255, .5);
				}	
		`,
        "jummbox classic": `
				:root {
					--page-margin: #040410;
					--editor-background: #040410;
					--playhead: rgba(255, 255, 255, 0.9);
					--secondary-text: #84859a;
					--box-selection-fill: #044b94;
					--ui-widget-background: #393e4f;
					--ui-widget-focus: #6d6886;
					--pitch-background: #393e4f;
					--tonic: #725491;
					--fifth-note: #54547a;
					--white-piano-key: #eee;
					--black-piano-key: #666;
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
				}
			`,
        "forest": `
				:root {
					--page-margin: #010c03;
					--editor-background: #010c03;
					--hover-preview: #efe;
					--playhead: rgba(232, 255, 232, 0.9);
					--primary-text: #efe;
					--secondary-text: #70A070;
					--inverted-text: #280228;
					--text-selection: rgba(255,68,199,0.99);
					--box-selection-fill: #267aa3;
					--loop-accent: #ffe845;
					--link-accent: #9f8;
					--ui-widget-background: #203829;
					--ui-widget-focus: #487860;
					--pitch-background: #203829;
					--tonic: #2b8d20;
					--fifth-note: #385840;
					--white-piano-key: #bda;
					--black-piano-key: #573;
                    --black-piano-key-text: #ffffff;
					--use-color-formula: true;
					--track-editor-bg-pitch: #254820;
					--track-editor-bg-pitch-dim: #102819;
					--track-editor-bg-noise: #304050;
					--track-editor-bg-noise-dim: #102030;
					--track-editor-bg-mod: #506030;
					--track-editor-bg-mod-dim: #2a300a;
					--multiplicative-mod-slider: #205c8f;
					--overwriting-mod-slider: #20ac6f;
					--indicator-primary: #dcd866;
					--indicator-secondary: #203829;
					--select2-opt-group: #1a6f5a;
					--input-box-outline: #242;
					--mute-button-normal: #49e980;
					--mute-button-mod: #c2e502;
					--mod-label-primary: #133613;
					--mod-label-secondary-text: rgb(27, 126, 40);
					--mod-label-primary-text: #efe;
					--pitch-secondary-channel-hue: 120;
					--pitch-secondary-channel-hue-scale: 8.1;
					--pitch-secondary-channel-sat: 59;
					--pitch-secondary-channel-sat-scale: 0.1;
					--pitch-secondary-channel-lum: 50;
					--pitch-secondary-channel-lum-scale: 0.04;
					--pitch-primary-channel-hue: 120;
					--pitch-primary-channel-hue-scale: 8.1;
					--pitch-primary-channel-sat: 86;
					--pitch-primary-channel-sat-scale: 0.1;
					--pitch-primary-channel-lum: 70;
					--pitch-primary-channel-lum-scale: 0.04;
					--pitch-secondary-note-hue: 120;
					--pitch-secondary-note-hue-scale: 8.1;
					--pitch-secondary-note-sat: 85;
					--pitch-secondary-note-sat-scale: 0.1;
					--pitch-secondary-note-lum: 30;
					--pitch-secondary-note-lum-scale: 0.04;
					--pitch-primary-note-hue: 120;
					--pitch-primary-note-hue-scale: 8.1;
					--pitch-primary-note-sat: 90;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 80;
					--pitch-primary-note-lum-scale: 0.025;
					--noise-secondary-channel-hue: 200;
					--noise-secondary-channel-hue-scale: 1.1;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 22;
					--noise-secondary-channel-lum-scale: 0;
					--noise-primary-channel-hue: 200;
					--noise-primary-channel-hue-scale: 1.1;
					--noise-primary-channel-sat: 48;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 65;
					--noise-primary-channel-lum-scale: 0;
					--noise-secondary-note-hue: 200;
					--noise-secondary-note-hue-scale: 1.1;
					--noise-secondary-note-sat: 33.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 33;
					--noise-secondary-note-lum-scale: 0;
					--noise-primary-note-hue: 200;
					--noise-primary-note-hue-scale: 1.1;
					--noise-primary-note-sat: 46.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 64;
					--noise-primary-note-lum-scale: 0;
					--mod-secondary-channel-hue: 40;
					--mod-secondary-channel-hue-scale: 1.8;
					--mod-secondary-channel-sat: 44;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 50;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 40;
					--mod-primary-channel-hue-scale: 1.8;
					--mod-primary-channel-sat: 60;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 80;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 40;
					--mod-secondary-note-hue-scale: 1.8;
					--mod-secondary-note-sat: 62;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 55;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 40;
					--mod-primary-note-hue-scale: 1.8;
					--mod-primary-note-sat: 66;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 85;
					--mod-primary-note-lum-scale: 0;
					--disabled-note-primary:    #536e5c;
					--disabled-note-secondary:  #395440;
				}
			`,
        "canyon": `
				:root {
					--page-margin: #0a0000;
					--editor-background: #0a0000;
					--playhead: rgba(247, 172, 196, 0.9);
					--primary-text: #f5d6bf;
					--secondary-text: #934050;
					--inverted-text: #290505;
					--text-selection: rgba(255, 208, 68, 0.99);
					--box-selection-fill: #94044870;
					--loop-accent: #ff1e1e;
					--link-accent: #da7b76;
					--ui-widget-background: #533137;
					--ui-widget-focus: #743e4b;
					--pitch-background: #4f3939;
					--tonic: #9e4145;
					--fifth-note: #5b3e6b;
					--white-piano-key: #d89898;
					--black-piano-key: #572b29;
                    --black-piano-key-text: #ffffff;
					--use-color-formula: true;
					--track-editor-bg-pitch: #5e3a41;
					--track-editor-bg-pitch-dim: #281d1c;
					--track-editor-bg-noise: #3a3551;
					--track-editor-bg-noise-dim: #272732;
					--track-editor-bg-mod: #552045;
					--track-editor-bg-mod-dim: #3e1442;
					--multiplicative-mod-slider: #9f6095;
					--overwriting-mod-slider: #b55050;
					--indicator-primary: #f2f764;
					--indicator-secondary: #4f3939;
					--select2-opt-group: #673030;
					--input-box-outline: #443131;
					--mute-button-normal: #d81833;
					--mute-button-mod: #9e2691;
					--mod-label-primary: #5f2b39;
					--mod-label-secondary-text: rgb(158, 66, 122);
					--mod-label-primary-text: #e6caed;
					--pitch-secondary-channel-hue: 0;
					--pitch-secondary-channel-hue-scale: 11.8;
					--pitch-secondary-channel-sat: 73.3;
					--pitch-secondary-channel-sat-scale: 0.1;
					--pitch-secondary-channel-lum: 40;
					--pitch-secondary-channel-lum-scale: 0.05;
					--pitch-primary-channel-hue: 0;
					--pitch-primary-channel-hue-scale: 11.8;
					--pitch-primary-channel-sat: 90;
					--pitch-primary-channel-sat-scale: 0.1;
					--pitch-primary-channel-lum: 67.5;
					--pitch-primary-channel-lum-scale: 0.05;
					--pitch-secondary-note-hue: 0;
					--pitch-secondary-note-hue-scale: 11.8;
					--pitch-secondary-note-sat: 83.9;
					--pitch-secondary-note-sat-scale: 0.1;
					--pitch-secondary-note-lum: 35;
					--pitch-secondary-note-lum-scale: 0.05;
					--pitch-primary-note-hue: 0;
					--pitch-primary-note-hue-scale: 11.8;
					--pitch-primary-note-sat: 100;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 85.6;
					--pitch-primary-note-lum-scale: 0.025;
					--noise-secondary-channel-hue: 60;
					--noise-secondary-channel-hue-scale: 2;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 42;
					--noise-secondary-channel-lum-scale: 0;
					--noise-primary-channel-hue: 60;
					--noise-primary-channel-hue-scale: 2;
					--noise-primary-channel-sat: 33;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 63.5;
					--noise-primary-channel-lum-scale: 0;
					--noise-secondary-note-hue: 60;
					--noise-secondary-note-hue-scale: 2;
					--noise-secondary-note-sat: 33.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 55;
					--noise-secondary-note-lum-scale: 0;
					--noise-primary-note-hue: 60;
					--noise-primary-note-hue-scale: 2;
					--noise-primary-note-sat: 46.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 74;
					--noise-primary-note-lum-scale: 0;
					--mod-secondary-channel-hue: 222;
					--mod-secondary-channel-hue-scale: 1.5;
					--mod-secondary-channel-sat: 88;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 50;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 222;
					--mod-primary-channel-hue-scale: 1.5;
					--mod-primary-channel-sat: 96;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 80;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 222;
					--mod-secondary-note-hue-scale: 1.5;
					--mod-secondary-note-sat: 92;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 54;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 222;
					--mod-primary-note-hue-scale: 1.5;
					--mod-primary-note-sat: 96;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 75;
					--mod-primary-note-lum-scale: 0;
					--disabled-note-primary:    #515164;
					--disabled-note-secondary:  #2a2a3a;
				}
			`,
        "midnight": `
		:root {
			--page-margin: #000;
			--editor-background: #000;
			--hover-preview: #757575;
			--playhead: #fff;
			--primary-text: #fff;
			--secondary-text: #acacac;
			--inverted-text: #290505;
			--text-selection: rgba(155, 155, 155, 0.99);
			--box-selection-fill: #79797970;
			--loop-accent: #646464;
			--link-accent: #707070;
			--ui-widget-background: #353535;
			--ui-widget-focus: #464646;
			--pitch-background: #222121;
			--tonic: #555955;
			--fifth-note: #1a1818;
			--white-piano-key: #a89e9e;
			--black-piano-key: #2d2424;
            --black-piano-key-text: #ffffff;
			--use-color-formula: true;
			--track-editor-bg-pitch: #373737;
			--track-editor-bg-pitch-dim: #131313;
			--track-editor-bg-noise: #484848;
			--track-editor-bg-noise-dim: #131313;
			--track-editor-bg-mod: #373737;
			--track-editor-bg-mod-dim: #131313;
			--multiplicative-mod-slider: #555;
			--overwriting-mod-slider: #464545;
			--indicator-primary: #e0e0e0;
			--indicator-secondary: #404040;
			--select2-opt-group: #3c3b3b;
			--input-box-outline: #757575;
			--mute-button-normal: #8e8d8d;
			--mute-button-mod: #ddd;
			--mod-label-primary: #262526;
			--mod-label-secondary-text: rgb(227, 222, 225);
			--mod-label-primary-text: #b9b9b9;
			--pitch-secondary-channel-hue: 240;
			--pitch-secondary-channel-hue-scale: 228;
			--pitch-secondary-channel-sat: 73.3;
			--pitch-secondary-channel-sat-scale: 0.1;
			--pitch-secondary-channel-lum: 25;
			--pitch-secondary-channel-lum-scale: 0.05;
			--pitch-primary-channel-hue: 240;
			--pitch-primary-channel-hue-scale: 228;
			--pitch-primary-channel-sat: 80;
			--pitch-primary-channel-sat-scale: 0.1;
			--pitch-primary-channel-lum: 60.5;
			--pitch-primary-channel-lum-scale: 0.05;
			--pitch-secondary-note-hue: 240;
			--pitch-secondary-note-hue-scale: 228;
			--pitch-secondary-note-sat: 73.9;
			--pitch-secondary-note-sat-scale: 0.1;
			--pitch-secondary-note-lum: 32;
			--pitch-secondary-note-lum-scale: 0.05;
			--pitch-primary-note-hue: 240;
			--pitch-primary-note-hue-scale: 228;
			--pitch-primary-note-sat: 90;
			--pitch-primary-note-sat-scale: 0.05;
			--pitch-primary-note-lum: 80.6;
			--pitch-primary-note-lum-scale: 0.025;
			--noise-secondary-channel-hue: 160;
			--noise-secondary-channel-hue-scale: 2;
			--noise-secondary-channel-sat: 25;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 42;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 160;
			--noise-primary-channel-hue-scale: 2;
			--noise-primary-channel-sat: 33;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 63.5;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 160;
			--noise-secondary-note-hue-scale: 2;
			--noise-secondary-note-sat: 33.5;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 55;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 160;
			--noise-primary-note-hue-scale: 2;
			--noise-primary-note-sat: 46.5;
			--noise-primary-note-sat-scale: 0;
			--noise-primary-note-lum: 74;
			--noise-primary-note-lum-scale: 0;
			--mod-secondary-channel-hue: 62;
			--mod-secondary-channel-hue-scale: 1.5;
			--mod-secondary-channel-sat: 88;
			--mod-secondary-channel-sat-scale: 0;
			--mod-secondary-channel-lum: 30;
			--mod-secondary-channel-lum-scale: 0;
			--mod-primary-channel-hue: 62;
			--mod-primary-channel-hue-scale: 1.5;
			--mod-primary-channel-sat: 96;
			--mod-primary-channel-sat-scale: 0;
			--mod-primary-channel-lum: 80;
			--mod-primary-channel-lum-scale: 0;
			--mod-secondary-note-hue: 62;
			--mod-secondary-note-hue-scale: 1.5;
			--mod-secondary-note-sat: 92;
			--mod-secondary-note-sat-scale: 0;
			--mod-secondary-note-lum: 34;
			--mod-secondary-note-lum-scale: 0;
			--mod-primary-note-hue: 62;
			--mod-primary-note-hue-scale: 1.5;
			--mod-primary-note-sat: 96;
			--mod-primary-note-sat-scale: 0;
			--mod-primary-note-lum: 75;
			--mod-primary-note-lum-scale: 0;
			--disabled-note-primary:    #66a;
			--disabled-note-secondary:  #447;
		}
	`,
        "jummbox light": `
				:root {
					-webkit-text-stroke-width: 0.5px;
					--page-margin: #cab1d3;
					--editor-background: #f4f4f4;
					--hover-preview: #2d26a2;
					--playhead: rgb(20 25 153 / 90%);
					--primary-text: #b686c3;
					--secondary-text: #970f38;
					--inverted-text: #fefdff;
					--text-selection: rgb(56 21 8 / 99%);
					--box-selection-fill: rgb(20 203 160 / 61%);
					--loop-accent: #09dc0e;
					--link-accent: #3ee669;
					--ui-widget-background: #0e0a42;
					--ui-widget-focus: #380c42;
					--pitch-background: #8daf96;
					--tonic: #a16fb1;
					--fifth-note: #d08c8c;
					--white-piano-key: #fbffee;
					--black-piano-key: #c9d8e5;
					--white-piano-key-text: #101160;
					--black-piano-key-text: #231b03;
					--use-color-formula: true;
					--track-editor-bg-pitch: #34456a;
					--track-editor-bg-pitch-dim: #88afad;
					--track-editor-bg-noise: #564566;
					--track-editor-bg-noise-dim: #aaa;
					--track-editor-bg-mod: #7f779d;
					--track-editor-bg-mod-dim: #aaa;
					--multiplicative-mod-slider: #807caf;
					--overwriting-mod-slider: #909cdf;
					--indicator-primary: #ae38ff;
					--indicator-secondary: #5c8dbb;
					--select2-opt-group: #581b50;
					--input-box-outline: #6f7074;
					--mute-button-normal: #db1e00;
					--mute-button-mod: #883bf9;
					--mod-label-primary: #525297;
					--mod-label-secondary-text: rgb(197 147 245);
					--mod-label-primary-text: #a3aae9;
                    --pitch-secondary-channel-hue: 26;
                    --pitch-secondary-channel-hue-scale: 214.5;
                    --pitch-secondary-channel-sat: 74.3;
                    --pitch-secondary-channel-sat-scale: -0.1;
					--pitch-secondary-channel-lum: 55;
					--pitch-secondary-channel-lum-scale: -0.05;
					--pitch-primary-channel-hue: 26;
					--pitch-primary-channel-hue-scale: 214.5;
					--pitch-primary-channel-sat: 74;
					--pitch-primary-channel-sat-scale: -0.1;
					--pitch-primary-channel-lum: 65.5;
					--pitch-primary-channel-lum-scale: -0.05;
					--pitch-secondary-note-hue: 26;
					--pitch-secondary-note-hue-scale: 214.5;
					--pitch-secondary-note-sat: 74.9;
					--pitch-secondary-note-sat-scale: -0.1;
					--pitch-secondary-note-lum: 70;
					--pitch-secondary-note-lum-scale: -0.05;
					--pitch-primary-note-hue: 26;
					--pitch-primary-note-hue-scale: 214.5;
					--pitch-primary-note-sat: 85;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 64.6;
					--pitch-primary-note-lum-scale: -0.025;
					--noise-secondary-channel-hue: 220;
					--noise-secondary-channel-hue-scale: 2;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 62;
					--noise-secondary-channel-lum-scale: -0.1;
					--noise-primary-channel-hue: 220;
					--noise-primary-channel-hue-scale: 2;
					--noise-primary-channel-sat: 53;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 53.5;
					--noise-primary-channel-lum-scale: -0.1;
					--noise-secondary-note-hue: 220;
					--noise-secondary-note-hue-scale: 2;
					--noise-secondary-note-sat: 58.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 85;
					--noise-secondary-note-lum-scale: -1;
					--noise-primary-note-hue: 220;
					--noise-primary-note-hue-scale: 2;
					--noise-primary-note-sat: 56.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 54;
					--noise-primary-note-lum-scale: -1;
					--mod-secondary-channel-hue: 90;
					--mod-secondary-channel-hue-scale: 1.5;
					--mod-secondary-channel-sat: 88;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 60;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 90;
					--mod-primary-channel-hue-scale: 1.5;
					--mod-primary-channel-sat: 89;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 65;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 90;
					--mod-secondary-note-hue-scale: 1.5;
					--mod-secondary-note-sat: 79;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 95;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 90;
					--mod-primary-note-hue-scale: 1.5;
					--mod-primary-note-sat: 79;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 55;
					--mod-primary-note-lum-scale: 0;
					--disabled-note-primary:    #868;
					--disabled-note-secondary:  #767;
				}

				.beepboxEditor button, .beepboxEditor select {
					background-color: var(--secondary-text);
				}

				.select2-selection__rendered {
					background-color: var(--secondary-text);
				}

				.beepboxEditor .piano-button::before {
					display: none;
				}

				.promptContainerBG::before {
					box-shadow: inset 0 0 2000px rgba(255, 255, 255, .5);
				}
			`,
        "amoled dark": `
				:root {
					--page-margin: #000;
					--editor-background: #020406;
					--playhead: rgba(255, 255, 255, 0.9);
					--secondary-text: #8e88ce;
					--box-selection-fill: #044b94;
					--loop-accent: #ad38f9;
					--link-accent: #bd25ff;
					--ui-widget-background: #080d1f;
					--ui-widget-focus: #060f2d;
					--pitch-background: #02060b;
					--tonic: #00113a;
					--fifth-note: #1b0019;
					--white-piano-key: #02040c;
					--black-piano-key: #02040c;
                    --white-piano-key-text: #fff;
					--use-color-formula: true;
					--track-editor-bg-pitch: #050829;
					--track-editor-bg-pitch-dim: #010213;
					--track-editor-bg-noise: #051529;
					--track-editor-bg-noise-dim: #010b13;
					--track-editor-bg-mod: #150529;
					--track-editor-bg-mod-dim: #0a0113;
					--multiplicative-mod-slider: #2b409c;
					--overwriting-mod-slider: #6850b5;
					--indicator-primary: #7f3bec;
					--indicator-secondary: #213888;
					--select2-opt-group: #1d123c;
					--input-box-outline: #1b1e48;
					--mute-button-normal: #d234b0;
					--mute-button-mod: #263d98;
					--mod-label-primary: #090910;
					--mod-label-secondary-text: rgb(73, 69, 214);
					--mod-label-primary-text: white;
					--pitch-secondary-channel-hue: 183;
					--pitch-secondary-channel-hue-scale: 158.7;
					--pitch-secondary-channel-sat: 83.3;
					--pitch-secondary-channel-sat-scale: 0.1;
					--pitch-secondary-channel-lum: 40;
					--pitch-secondary-channel-lum-scale: 0.05;
					--pitch-primary-channel-hue: 183;
					--pitch-primary-channel-hue-scale: 158.7;
					--pitch-primary-channel-sat: 100;
					--pitch-primary-channel-sat-scale: 0.1;
					--pitch-primary-channel-lum: 67.5;
					--pitch-primary-channel-lum-scale: 0.05;
					--pitch-secondary-note-hue: 183;
					--pitch-secondary-note-hue-scale: 158.7;
					--pitch-secondary-note-sat: 93.9;
					--pitch-secondary-note-sat-scale: 0.1;
					--pitch-secondary-note-lum: 25;
					--pitch-secondary-note-lum-scale: 0.05;
					--pitch-primary-note-hue: 183;
					--pitch-primary-note-hue-scale: 158.7;
					--pitch-primary-note-sat: 100;
					--pitch-primary-note-sat-scale: 0.05;
					--pitch-primary-note-lum: 85.6;
					--pitch-primary-note-lum-scale: 0.025;
					--noise-secondary-channel-hue: 30;
					--noise-secondary-channel-hue-scale: 2;
					--noise-secondary-channel-sat: 25;
					--noise-secondary-channel-sat-scale: 0;
					--noise-secondary-channel-lum: 42;
					--noise-secondary-channel-lum-scale: 0;
					--noise-primary-channel-hue: 30;
					--noise-primary-channel-hue-scale: 2;
					--noise-primary-channel-sat: 33;
					--noise-primary-channel-sat-scale: 0;
					--noise-primary-channel-lum: 63.5;
					--noise-primary-channel-lum-scale: 0;
					--noise-secondary-note-hue: 30;
					--noise-secondary-note-hue-scale: 2;
					--noise-secondary-note-sat: 33.5;
					--noise-secondary-note-sat-scale: 0;
					--noise-secondary-note-lum: 55;
					--noise-secondary-note-lum-scale: 0;
					--noise-primary-note-hue: 30;
					--noise-primary-note-hue-scale: 2;
					--noise-primary-note-sat: 46.5;
					--noise-primary-note-sat-scale: 0;
					--noise-primary-note-lum: 74;
					--noise-primary-note-lum-scale: 0;
					--mod-secondary-channel-hue: 0;
					--mod-secondary-channel-hue-scale: 1.5;
					--mod-secondary-channel-sat: 88;
					--mod-secondary-channel-sat-scale: 0;
					--mod-secondary-channel-lum: 50;
					--mod-secondary-channel-lum-scale: 0;
					--mod-primary-channel-hue: 0;
					--mod-primary-channel-hue-scale: 1.5;
					--mod-primary-channel-sat: 96;
					--mod-primary-channel-sat-scale: 0;
					--mod-primary-channel-lum: 80;
					--mod-primary-channel-lum-scale: 0;
					--mod-secondary-note-hue: 0;
					--mod-secondary-note-hue-scale: 1.5;
					--mod-secondary-note-sat: 92;
					--mod-secondary-note-sat-scale: 0;
					--mod-secondary-note-lum: 45;
					--mod-secondary-note-lum-scale: 0;
					--mod-primary-note-hue: 0;
					--mod-primary-note-hue-scale: 1.5;
					--mod-primary-note-sat: 96;
					--mod-primary-note-sat-scale: 0;
					--mod-primary-note-lum: 85;
					--mod-primary-note-lum-scale: 0;
					--disabled-note-primary: #91879f;
					--disabled-note-secondary: #6a677a;
				}

			`,
        "beachcombing": `
			:root {
			  --page-margin: #010121;
  --editor-background: #020222;
  --hover-preview: #f3ffff;
  --playhead: #fff;
  --primary-text: #c1f1ff;
  --secondary-text: #546775;
  --box-selection-fill: #3e0028;
  --loop-accent: #5e68fffc;
  --link-accent: #ff3ad5fc;
  --ui-widget-background: #1f2b52;
  --ui-widget-focus: #384e91;
  --pitch-background: #2c3155;
  --tonic: #935175;
  --fifth-note: #1f569f;
  --white-piano-key: #f3f2ff;
  --black-piano-key: #4b4471;
  --white-piano-key-text: #4b4471;
  --track-editor-bg-pitch: #34406c;
  --track-editor-bg-pitch-dim: #121931;
  --track-editor-bg-noise: #562e3b;
  --track-editor-bg-noise-dim: #161313;
  --track-editor-bg-mod: #372e66;
  --track-editor-bg-mod-dim: #2a1640;
  --multiplicative-mod-slider: #606c9f;
  --overwriting-mod-slider: #6850b5;
  --indicator-primary: #ff8bd1;
  --indicator-secondary: #393e4f;
  --select2-opt-group: #5d576f;
  --input-box-outline: #222;
  --mute-button-normal: #7ce1ff;
  --mute-button-mod: #db519d;
  --pitch1-secondary-channel: #329b70;
  --pitch1-primary-channel: #53ffb8;
  --pitch1-secondary-note: #4cb98c;
  --pitch1-primary-note: #98ffd4;
  --pitch2-secondary-channel: #b08e4d;
  --pitch2-primary-channel: #ffe185;
  --pitch2-secondary-note: #91782e;
  --pitch2-primary-note: #ffd968;
  --pitch3-secondary-channel: #018e8e;
  --pitch3-primary-channel: #3de4ff;
  --pitch3-secondary-note: #24b7b7;
  --pitch3-primary-note: #a7ffff;
  --pitch4-secondary-channel: #792354;
  --pitch4-primary-channel: #ff68bd;
  --pitch4-secondary-note: #a73c78;
  --pitch4-primary-note: #ff98d2;
  --pitch5-secondary-channel: #185aab;
  --pitch5-primary-channel: #6493ff;
  --pitch5-secondary-note: #3e99d9;
  --pitch5-primary-note: #b3e3ff;
  --pitch6-secondary-channel: #953C47;
  --pitch6-primary-channel: #FF7888;
  --pitch6-secondary-note: #DF4F60;
  --pitch6-primary-note: #FFB2BB;
  --pitch7-secondary-channel: #4f007d;
  --pitch7-primary-channel: #a54cd9;
  --pitch7-secondary-note: #732b9d;
  --pitch7-primary-note: #d386ff;
  --pitch8-secondary-channel: #323c99;
  --pitch8-primary-channel: #1b61ff;
  --pitch8-secondary-note: #1848b3;
  --pitch8-primary-note: #6f9bff;
  --pitch9-secondary-channel: #1F605A;
  --pitch9-primary-channel: #69FFEA;
  --pitch9-secondary-note: #178076;
  --pitch10-secondary-channel: #6D438C;
  --pitch10-secondary-note: #8040B0;
  --noise1-secondary-channel: #635070;
  --noise1-primary-channel: #9071db;
  --noise1-secondary-note: #915dc1;
  --noise1-primary-note: #c5a5ff;
  --noise2-secondary-channel: #993367;
  --noise2-primary-channel: #dd777c;
  --noise2-secondary-note: #cc6695;
  --noise2-primary-note: #f0bbd1;
  --noise3-secondary-channel: #4a8c8f;
  --noise3-primary-channel: #77c5dd;
  --noise3-secondary-note: #6fb4cf;
  --noise3-primary-note: #bbf2ff;
  --noise4-secondary-channel: #8e3e7d;
  --noise4-primary-channel: #c682d2;
  --noise4-secondary-note: #b871c1;
  --noise4-primary-note: #ffb8f0;
  --noise5-secondary-channel: #785e37;
  --noise5-primary-channel: #bb9d77;
  --noise5-secondary-note: #aa8c66;
  --noise5-primary-note: #e2d1b2;
  --mod1-secondary-channel: #4e8397;
  --mod1-primary-channel: #92e6f3;
  --mod1-secondary-note: #76b9d9;
  --mod1-primary-note: #cde3ff;
  --mod2-secondary-channel: #ad5774;
  --mod2-primary-channel: #eba4ae;
  --mod2-secondary-note: #c9719b;
  --mod2-primary-note: #fdcee7;
  --mod3-secondary-channel: #6f579f;
  --mod3-primary-channel: #b192f7;
  --mod3-secondary-note: #7c3fc8;
  --mod4-secondary-channel: #a88a36;
  --mod4-primary-channel: #bec825;
  --mod4-secondary-note: #aecb57;
  --mod4-primary-note: #dee9bd;
  --mod-label-primary: #2c2c56;
  --mod-label-secondary-text: rgb(71,69,147);
  --mod-label-primary-text: white;
  --disabled-note-primary: #91879f;
  --disabled-note-secondary: #6a677a;


			}
		`,
        "roe": `
			:root {
			--page-margin: #050000;
			--editor-background: #050000;
			--primary-text: #b8cee0;
			--secondary-text: #cb3434;
			--text-selection: rgb(255 68 68 / 99%);
			--box-selection-fill: rgb(255 0 0 / 30%);
			--loop-accent: #7744FF;
			--link-accent: #FF2A2A;
			--ui-widget-background: #1a2642;
			--ui-widget-focus: #2c3f6d;
			--pitch-background: #15111a;
			--tonic: #1b3041;
			--fifth-note: #381818;
			--white-piano-key: #cdcdcd;
			--black-piano-key: #232323;
			--track-editor-bg-pitch: #302938;
			--track-editor-bg-pitch-dim: #211c26;
			--track-editor-bg-noise: #261f42;
			--track-editor-bg-noise-dim: #1a152d;
			--track-editor-bg-mod: #183049;
			--track-editor-bg-mod-dim: #102132;
			--multiplicative-mod-slider: #344a7f;
			--overwriting-mod-slider: #344a7f;
			--indicator-primary: #FF2A2A;
			--indicator-secondary: #800000;
			--select2-opt-group: #141e34;
			--input-box-outline: #141e34;
			--mute-button-normal: #299eff;
			--mute-button-mod: #165a93;
			--pitch1-secondary-channel: #273c90;
			--pitch1-primary-channel: #476BFF;
			--pitch1-secondary-note: #273c90;
			--pitch1-primary-note: #476BFF;
			--pitch2-secondary-channel: #3a3898;
			--pitch2-primary-channel: #625FFB;
			--pitch2-secondary-note: #3a3898;
			--pitch2-primary-note: #625FFB;
			--pitch3-secondary-channel: #542780;
			--pitch3-primary-channel: #9C49EC;
			--pitch3-secondary-note: #542780;
			--pitch3-primary-note: #9C49EC;
			--pitch4-secondary-channel: #84225d;
			--pitch4-primary-channel: #fd3fb1;
			--pitch4-secondary-note: #84225d;
			--pitch4-primary-note: #fd3fb1;
			--pitch5-secondary-channel: #8d2323;
			--pitch5-primary-channel: #ff3f3f;
			--pitch5-secondary-note: #8d2323;
			--pitch5-primary-note: #ff3f3f;
			--pitch6-secondary-channel: #84225d;
			--pitch6-primary-channel: #fd3fb1;
			--pitch6-secondary-note: #84225d;
			--pitch6-primary-note: #fd3fb1;
			--pitch7-secondary-channel: #542780;
			--pitch7-primary-channel: #9C49EC;
			--pitch7-secondary-note: #542780;
			--pitch7-primary-note: #9C49EC;
			--pitch8-secondary-channel: #3a3898;
			--pitch8-primary-channel: #625FFB;
			--pitch8-secondary-note: #3a3898;
			--pitch8-primary-note: #625FFB;
			--pitch9-secondary-channel: #273c90;
			--pitch9-primary-channel: #476BFF;
			--pitch9-secondary-note: #273c90;
			--pitch9-primary-note: #476BFF;
			--pitch10-secondary-channel: #165a93;
			--pitch10-primary-channel: #299EFF;
			--pitch10-secondary-note: #165a93;
			--pitch10-primary-note: #299EFF;
			--noise1-secondary-channel: #4281FF;
			--noise1-primary-channel: #96b9ff;
			--noise1-secondary-note: #4281FF;
			--noise1-primary-note: #96b9ff;
			--noise2-secondary-channel: #7347FF;
			--noise2-primary-channel: #c3b0ff;
			--noise2-secondary-note: #7347FF;
			--noise2-primary-note: #c3b0ff;
			--noise3-secondary-channel: #9F3CBF;
			--noise3-primary-channel: #e29cf9;
			--noise3-secondary-note: #9F3CBF;
			--noise3-primary-note: #e29cf9;
			--noise4-secondary-channel: #D3326F;
			--noise4-primary-channel: #fb9bbf;
			--noise4-secondary-note: #D3326F;
			--noise4-primary-note: #fb9bbf;
			--noise5-secondary-channel: #FF2A2A;
			--noise5-primary-channel: #ffa2a2;
			--noise5-secondary-note: #FF2A2A;
			--noise5-primary-note: #ffa2a2;
			--mod1-secondary-channel: #47587a;
			--mod1-primary-channel: #96b9ff;
			--mod1-secondary-note: #47587a;
			--mod1-primary-note: #96b9ff;
			--mod2-secondary-channel: #716791;
			--mod2-primary-channel: #c3b0ff;
			--mod2-secondary-note: #716791;
			--mod2-primary-note: #c3b0ff;
			--mod3-secondary-channel: #6f4c7b;
			--mod3-primary-channel: #e29cf9;
			--mod3-secondary-note: #6f4c7b;
			--mod3-primary-note: #e29cf9;
			--mod4-secondary-channel: #9e6279;
			--mod4-primary-channel: #fb9bbf;
			--mod4-secondary-note: #9e6279;
			--mod4-primary-note: #fb9bbf;
			--mod-label-primary: #15111a;
			--mod-label-secondary-text: #cb3434;
			--mod-label-primary-text: white;
			--disabled-note-primary: #c9c9c9;
			--disabled-note-secondary: #616161;
		}`,
        "moonlight": `
			:root {
			--page-margin: #020514;
			--editor-background: #020514;
			--primary-text: #D4DCE9;
			--secondary-text: #3E87DA;
			--text-selection: #03599bd9;
			--box-selection-fill: hsl(206deg 66% 41% / 85%);
			--loop-accent: #639BD6;
			--link-accent: #A8C6E8;
			--ui-widget-background: #1e2940;
			--ui-widget-focus: #324b81;
			--pitch-background: #223849;
			--tonic: #33536c;
			--fifth-note: hsl(206deg 36% 16%);
			--white-piano-key: #c1bfe9;
			--black-piano-key: #454354;
			--track-editor-bg-pitch: #25568d80;
			--track-editor-bg-pitch-dim: #10253c80;
			--track-editor-bg-noise: #25568d80;
			--track-editor-bg-noise-dim: #10253c80;
			--track-editor-bg-mod: #25568d80;
			--track-editor-bg-mod-dim: #10253c80;
			--multiplicative-mod-slider: #0476cd;
			--overwriting-mod-slider: #035899;
			--indicator-primary: #57a1f4;
			--indicator-secondary: #2e5684;
			--select2-opt-group: #24355c;
			--input-box-outline: #141e34;
			--mute-button-normal: #6ebffc;
			--mute-button-mod: #0a92fa;
			--pitch1-secondary-channel: #47425c;
			--pitch1-primary-channel: #918bac;
			--pitch1-secondary-note: #6b6489;
			--pitch1-primary-note: #a8a3bf;
			--pitch2-secondary-channel: #626493;
			--pitch2-primary-channel: #bdbed3;
			--pitch2-secondary-note: #626493;
			--pitch2-primary-note: #bdbed3;
			--pitch3-secondary-channel: #6e89b4;
			--pitch3-primary-channel: #d4dce9;
			--pitch3-secondary-note: #6e89b4;
			--pitch3-primary-note: #d4dce9;
			--pitch4-secondary-channel: #4c77a9;
			--pitch4-primary-channel: #a8c6e8;
			--pitch4-secondary-note: #4c77a9;
			--pitch4-primary-note: #a8c6e8;
			--pitch5-secondary-channel: #314e6d;
			--pitch5-primary-channel: #639bd6;
			--pitch5-secondary-note: #46698f;
			--pitch5-primary-note: #639bd6;
			--pitch6-secondary-channel: #143d6b;
			--pitch6-primary-channel: #3e87da;
			--pitch6-secondary-note: #143d6b;
			--pitch6-primary-note: #3e87da;
			--pitch7-secondary-channel: #314e6d;
			--pitch7-primary-channel: #639bd6;
			--pitch7-secondary-note: #314e6d;
			--pitch7-primary-note: #639bd6;
			--pitch8-secondary-channel: #4c77a9;
			--pitch8-primary-channel: #a8c6e8;
			--pitch8-secondary-note: #4c77a9;
			--pitch8-primary-note: #a8c6e8;
			--pitch9-secondary-channel: #6e89b4;
			--pitch9-primary-channel: #d4dce9;
			--pitch9-secondary-note: #6e89b4;
			--pitch9-primary-note: #d4dce9;
			--pitch10-secondary-channel: #626493;
			--pitch10-primary-channel: #bdbed3;
			--pitch10-secondary-note: #626493;
			--pitch10-primary-note: #bdbed3;
			--noise1-secondary-channel: #4b4a55;
			--noise1-primary-channel: #9795a3;
			--noise1-secondary-note: #4b4a55;
			--noise1-primary-note: #9795a3;
			--noise2-secondary-channel: #858e9d;
			--noise2-primary-channel: #d7dce5;
			--noise2-secondary-note: #858e9d;
			--noise2-primary-note: #d7dce5;
			--noise3-secondary-channel: #394e65;
			--noise3-primary-channel: #809bb7;
			--noise3-secondary-note: #394e65;
			--noise3-primary-note: #809bb7;
			--noise4-secondary-channel: #37577b;
			--noise4-primary-channel: #6189b8;
			--noise4-secondary-note: #37577b;
			--noise4-primary-note: #6189b8;
			--noise5-secondary-channel: #223849;
			--noise5-primary-channel: #5588af;
			--noise5-secondary-note: #223849;
			--noise5-primary-note: #5588af;
			--mod1-secondary-channel: #3e336c;
			--mod1-primary-channel: #6d60a4;
			--mod1-secondary-note: #3e336c;
			--mod1-primary-note: #6d60a4;
			--mod2-secondary-channel: #716791;
			--mod2-primary-channel: #bdbed3;
			--mod2-secondary-note: #716791;
			--mod2-primary-note: #bdbed3;
			--mod3-secondary-channel: #6b91bd;
			--mod3-primary-channel: #4b8fdd;
			--mod3-secondary-note: #597ca7;
			--mod3-primary-note: #7eade3;
			--mod4-secondary-channel: #14559f;
			--mod4-primary-channel: #3386e6;
			--mod4-secondary-note: #14559f;
			--mod4-primary-note: #3386e6;
			--mod-label-primary: #1e2940;
			--mod-label-secondary-text: #748ebe;
			--mod-label-primary-text: white;
			--disabled-note-primary: #828282;
			--disabled-note-secondary: #4f4f4f;
			}`,
        "autumn": `
		:root {
			--page-margin: #060304;
			--editor-background: #060304;
			--text-selection: rgb(115 80 76);
			--box-selection-fill: rgb(174 73 81 / 45%);
			--loop-accent: #834A69;
			--ui-widget-background: #2a2523;
			--ui-widget-focus: #4e4c44;
			--pitch-background: #121212;
			--tonic: #4f4f4f;
			--fifth-note: #222;
			--white-piano-key: #b59b9b;
			--black-piano-key: #231e1e;
			--track-editor-bg-pitch: #352f38;
			--track-editor-bg-pitch-dim: #232025;
			--track-editor-bg-noise: #3c3029;
			--track-editor-bg-noise-dim: #251d19;
			--track-editor-bg-mod: #202623;
			--track-editor-bg-mod-dim: #131715;
			--multiplicative-mod-slider: #D9D16E;
			--overwriting-mod-slider: #2D826F;
			--indicator-primary: #D9D16E;
			--indicator-secondary: #444226;
			--select2-opt-group: #20191c;
			--input-box-outline: #20191c;
			--mute-button-normal: var(--pitch2-primary-channel);
			--mute-button-mod: var(--pitch4-primary-channel);
			--pitch1-secondary-channel: #704a34;
			--pitch1-primary-channel: #D9895A;
			--pitch1-secondary-note: #704a34;
			--pitch1-primary-note: #D9895A;
			--pitch2-secondary-channel: #5f3538;
			--pitch2-primary-channel: #AE4951;
			--pitch2-secondary-note: #5f3538;
			--pitch2-primary-note: #AE4951;
			--pitch3-secondary-channel: #5c4336;
			--pitch3-primary-channel: #CA9A81;
			--pitch3-secondary-note: #5c4336;
			--pitch3-primary-note: #CA9A81;
			--pitch4-secondary-channel: #1d3143;
			--pitch4-primary-channel: #386995;
			--pitch4-secondary-note: #1d3143;
			--pitch4-primary-note: #386995;
			--pitch5-secondary-channel: #9c8a58;
			--pitch5-primary-channel: #D9D16E;
			--pitch5-secondary-note: #7c783f;
			--pitch5-primary-note: #D9D16E;
			--pitch6-secondary-channel: #886562;
			--pitch6-primary-channel: #D3A9A5;
			--pitch6-secondary-note: #886562;
			--pitch6-primary-note: #D3A9A5;
			--pitch7-secondary-channel: #1c3f37;
			--pitch7-primary-channel: #2D826F;
			--pitch7-secondary-note: #1c3f37;
			--pitch7-primary-note: #2D826F;
			--pitch8-secondary-channel: #442e2d;
			--pitch8-primary-channel: #815150;
			--pitch8-secondary-note: #442e2d;
			--pitch8-primary-note: #815150;
			--pitch9-secondary-channel: #8e6f60;
			--pitch9-primary-channel: #E5B8A1;
			--pitch9-secondary-note: #8e6f60;
			--pitch9-primary-note: #E5B8A1;
			--pitch10-secondary-channel: #4f3142;
			--pitch10-primary-channel: #834A69;
			--pitch10-secondary-note: #4f3142;
			--pitch10-primary-note: #834A69;
			--noise1-secondary-channel: #6b5346;
			--noise1-primary-channel: #b99c89;
			--noise1-secondary-note: #6b5346;
			--noise1-primary-note: #F0D0BB;
			--noise2-secondary-channel: #4a3839;
			--noise2-primary-channel: #9c6b6e;
			--noise2-secondary-note: #4a3839;
			--noise2-primary-note: #c18b8f;
			--noise3-secondary-channel: #2d3c4a;
			--noise3-primary-channel: #536e86;
			--noise3-secondary-note: #2d3c4a;
			--noise3-primary-note: #8fa8c0;
			--noise4-secondary-channel: #273f3a;
			--noise4-primary-channel: #4e8377;
			--noise4-secondary-note: #273f3a;
			--noise4-primary-note: #87baae;
			--noise5-secondary-channel: #372730;
			--noise5-primary-channel: #7f5e70;
			--noise5-secondary-note: #372730;
			--noise5-primary-note: #cc96b3;
			--mod1-secondary-channel: #783f1f;
			--mod1-primary-channel: #dc6d2c;
			--mod1-secondary-note: #783f1f;
			--mod1-primary-note: #dc6d2c;
			--mod2-secondary-channel: #0b3153;
			--mod2-primary-channel: #1464ac;
			--mod2-secondary-note: #0b3153;
			--mod2-primary-note: #1464ac;
			--mod3-secondary-channel: #075040;
			--mod3-primary-channel: #08a17f;
			--mod3-secondary-note: #075040;
			--mod3-primary-note: #08a17f;
			--mod4-secondary-channel: #631640;
			--mod4-primary-channel: #b4186d;
			--mod4-secondary-note: #631640;
			--mod4-primary-note: #b4186d;
			--mod-label-primary: #000;
			--mod-label-secondary-text: #707070;
			--mod-label-primary-text: white;
			--disabled-note-primary: #5d5d5d;
			--disabled-note-secondary: #292929;
		}`,
        "fruit": `
		:root {
			--page-margin: #040507;
			--editor-background: #040507;
			--text-selection: rgb(115 103 76);
			--box-selection-fill: rgb(174 109 73 / 45%);
			--loop-accent: #EC897D;
			--link-accent: #FDE484;
			--ui-widget-background: #22222c;
			--ui-widget-focus: #39394c;
			--pitch-background: #101010;
			--tonic: #2c2d34;
			--fifth-note: #191a20;
			--white-piano-key: #bbbaba;
			--black-piano-key: #2d2d2d;
			--track-editor-bg-pitch: #2b2d40;
			--track-editor-bg-pitch-dim: #191a25;
			--track-editor-bg-noise: #3c3644;
			--track-editor-bg-noise-dim: #26222b;
			--track-editor-bg-mod: #322a2a;
			--track-editor-bg-mod-dim: #191515;
			--multiplicative-mod-slider: #977da9;
			--overwriting-mod-slider: #798FA7;
			--indicator-primary: #EAAC9D;
			--indicator-secondary: #5e413a;
			--select2-opt-group: #191920;
			--input-box-outline: #191920;
			--mute-button-normal: #798FA7;
			--mute-button-mod: #354457;
			--pitch1-secondary-channel: #91655a;
			--pitch1-primary-channel: #EAAC9D;
			--pitch1-secondary-note: #91655a;
			--pitch1-primary-note: #EAAC9D;
			--pitch2-secondary-channel: #8f6513;
			--pitch2-primary-channel: #FFAF12;
			--pitch2-secondary-note: #8f6513;
			--pitch2-primary-note: #FFAF12;
			--pitch3-secondary-channel: #212f46;
			--pitch3-primary-channel: #34558B;
			--pitch3-secondary-note: #212f46;
			--pitch3-primary-note: #34558B;
			--pitch4-secondary-channel: #2e6b5b;
			--pitch4-primary-channel: #4EC5A7;
			--pitch4-secondary-note: #2e6b5b;
			--pitch4-primary-note: #4EC5A7;
			--pitch5-secondary-channel: #555D46;
			--pitch5-primary-channel: #aabf84;
			--pitch5-secondary-note: #555D46;
			--pitch5-primary-note: #aabf84;
			--pitch6-secondary-channel: #A2553B;
			--pitch6-primary-channel: #e59a81;
			--pitch6-secondary-note: #A2553B;
			--pitch6-primary-note: #e59a81;
			--pitch7-secondary-channel: #7b4021;
			--pitch7-primary-channel: #FE813E;
			--pitch7-secondary-note: #7b4021;
			--pitch7-primary-note: #FE813E;
			--pitch8-secondary-channel: #847753;
			--pitch8-primary-channel: #EFDAA3;
			--pitch8-secondary-note: #847753;
			--pitch8-primary-note: #EFDAA3;
			--pitch9-secondary-channel: #2c3642;
			--pitch9-primary-channel: #798FA7;
			--pitch9-secondary-note: #2c3642;
			--pitch9-primary-note: #798FA7;
			--pitch10-secondary-channel: #0d4453;
			--pitch10-primary-channel: #107895;
			--pitch10-secondary-note: #0d4453;
			--pitch10-primary-note: #107895;
			--noise1-secondary-channel: #71617C;
			--noise1-primary-channel: #977da9;
			--noise1-secondary-note: #71617C;
			--noise1-primary-note: #977da9;
			--noise2-secondary-channel: #3B3D4A;
			--noise2-primary-channel: #707591;
			--noise2-secondary-note: #3B3D4A;
			--noise2-primary-note: #707591;
			--noise3-secondary-channel: #625f5e;
			--noise3-primary-channel: #A19D9C;
			--noise3-secondary-note: #625f5e;
			--noise3-primary-note: #A19D9C;
			--noise4-secondary-channel: #ab847b;
			--noise4-primary-channel: #EAAC9D;
			--noise4-secondary-note: #ab847b;
			--noise4-primary-note: #EAAC9D;
			--noise5-secondary-channel: #B49D74;
			--noise5-primary-channel: #dec69b;
			--noise5-secondary-note: #B49D74;
			--noise5-primary-note: #dec69b;
			--mod1-secondary-channel: #722124;
			--mod1-primary-channel: #D13A41;
			--mod1-secondary-note: #722124;
			--mod1-primary-note: #D13A41;
			--mod2-secondary-channel: #213657;
			--mod2-primary-channel: #34558B;
			--mod2-secondary-note: #213657;
			--mod2-primary-note: #34558B;
			--mod3-secondary-channel: #555D46;
			--mod3-primary-channel: #848f6d;
			--mod3-secondary-note: #555D46;
			--mod3-primary-note: #848f6d;
			--mod4-secondary-channel: #71617C;
			--mod4-primary-channel: #a68ab9;
			--mod4-secondary-note: #71617C;
			--mod4-primary-note: #a68ab9;
			--mod-label-primary: #282828;
			--mod-label-secondary-text: #707070;
			--mod-label-primary-text: white;
			--disabled-note-primary: #5d5d5d;
			--disabled-note-secondary: #292929;
		}`,
        "sunset": `
		:root {
			--page-margin: #040300;
			--editor-background: #040300;
			--text-selection: rgb(94 0 157);
			--box-selection-fill: rgb(174 173 73 / 45%);
			--loop-accent: #EC897D;
			--link-accent: #FDE484;
			--ui-widget-background: #241b24;
			--ui-widget-focus: #3a2e39;
			--pitch-background: #141414;
			--tonic: #2C212B;
			--fifth-note: #2E2A15;
			--white-piano-key: #bbbaba;
			--black-piano-key: #2d2d2d;
			--track-editor-bg-pitch: #2d2e42;
			--track-editor-bg-pitch-dim: #191a25;
			--track-editor-bg-noise: #393340;
			--track-editor-bg-noise-dim: #26222b;
			--track-editor-bg-mod: #232a2c;
			--track-editor-bg-mod-dim: #151819;
			--multiplicative-mod-slider: #977da9;
			--overwriting-mod-slider: #798FA7;
			--indicator-primary: #F28891;
			--indicator-secondary: #601d23;
			--select2-opt-group: #151015;
			--input-box-outline: #151015;
			--mute-button-normal: #E4739D;
			--mute-button-mod: #9650A6;
			--pitch1-secondary-channel: #7F7721;
			--pitch1-primary-channel: #F3E79A;
			--pitch1-secondary-note: #7F7721;
			--pitch1-primary-note: #F3E79A;
			--pitch2-secondary-channel: #785E20;
			--pitch2-primary-channel: #F7D086;
			--pitch2-secondary-note: #785E20;
			--pitch2-primary-note: #F7D086;
			--pitch3-secondary-channel: #6E4219;
			--pitch3-primary-channel: #F9B881;
			--pitch3-secondary-note: #6E4219;
			--pitch3-primary-note: #F9B881;
			--pitch4-secondary-channel: #79351F;
			--pitch4-primary-channel: #F7A086;
			--pitch4-secondary-note: #79351F;
			--pitch4-primary-note: #F7A086;
			--pitch5-secondary-channel: #81272F;
			--pitch5-primary-channel: #F28891;
			--pitch5-secondary-note: #81272F;
			--pitch5-primary-note: #F28891;
			--pitch6-secondary-channel: #8F224D;
			--pitch6-primary-channel: #E4739D;
			--pitch6-secondary-note: #8F224D;
			--pitch6-primary-note: #E4739D;
			--pitch7-secondary-channel: #611548;
			--pitch7-primary-channel: #CF63A6;
			--pitch7-secondary-note: #611548;
			--pitch7-primary-note: #CF63A6;
			--pitch8-secondary-channel: #561253;
			--pitch8-primary-channel: #B557A9;
			--pitch8-secondary-note: #4D104A;
			--pitch8-primary-note: #B557A9;
			--pitch9-secondary-channel: #4c1260;
			--pitch9-primary-channel: #9650A6;
			--pitch9-secondary-note: #3C0F4C;
			--pitch9-primary-note: #9650A6;
			--pitch10-secondary-channel: #3e1d78;
			--pitch10-primary-channel: #704D9E;
			--pitch10-secondary-note: #27124C;
			--pitch10-primary-note: #704D9E;
			--noise1-secondary-channel: #A7A578;
			--noise1-primary-channel: #EFE9AC;
			--noise1-secondary-note: #A7A578;
			--noise1-primary-note: #EFE9AC;
			--noise2-secondary-channel: #947A5F;
			--noise2-primary-channel: #FBCEA8;
			--noise2-secondary-note: #947A5F;
			--noise2-primary-note: #FBCEA8;
			--noise3-secondary-channel: #A3635D;
			--noise3-primary-channel: #F4A5AB;
			--noise3-secondary-note: #A3635D;
			--noise3-primary-note: #F4A5AB;
			--noise4-secondary-channel: #724D60;
			--noise4-primary-channel: #CD90B6;
			--noise4-secondary-note: #724D60;
			--noise4-primary-note: #CD90B6;
			--noise5-secondary-channel: #503F5C;
			--noise5-primary-channel: #7C6A9E;
			--noise5-secondary-note: #503F5C;
			--noise5-primary-note: #7C6A9E;
			--mod1-secondary-channel: #371883;
			--mod1-primary-channel: #6416C6;
			--mod1-secondary-note: #1F0A52;
			--mod1-primary-note: #6416C6;
			--mod2-secondary-channel: #690645;
			--mod2-primary-channel: #E52FA2;
			--mod2-secondary-note: #690645;
			--mod2-primary-note: #E52FA2;
			--mod3-secondary-channel: #943618;
			--mod3-primary-channel: #eb5b2c;
			--mod3-secondary-note: #943618;
			--mod3-primary-note: #eb5b2c;
			--mod4-secondary-channel: #928409;
			--mod4-primary-channel: #ecd50e;
			--mod4-secondary-note: #928409;
			--mod4-primary-note: #ecd50e;
			--mod-label-primary: #282828;
			--mod-label-secondary-text: #707070;
			--mod-label-primary-text: white;
			--disabled-note-primary: #5d5d5d;
			--disabled-note-secondary: #292929;
		}`,
        "toxic": `
		:root {
			--page-margin: #010003;
			--editor-background: #010003;
			--text-selection: rgb(147 195 0);
			--box-selection-fill: rgb(145 174 73 / 49%);
			--loop-accent: #BCDE2C;
			--link-accent: #edff9f;
			--ui-widget-background: #261e2e;
			--ui-widget-focus: #322042;
			--pitch-background: #141c15;
			--tonic: #282c21;
			--fifth-note: #18221a;
			--white-piano-key: #e3e3e3;
			--black-piano-key: #2d2d2d;
			--track-editor-bg-pitch: #38293e;
			--track-editor-bg-pitch-dim: #251c29;
			--track-editor-bg-noise: #2c304c;
			--track-editor-bg-noise-dim: #191b2b;
			--track-editor-bg-mod: #311b32;
			--track-editor-bg-mod-dim: #1d101e;
			--multiplicative-mod-slider: #977da9;
			--overwriting-mod-slider: #798FA7;
			--indicator-primary: #aae9ff;
			--indicator-secondary: #253e46;
			--select2-opt-group: #110d15;
			--input-box-outline: #110d15;
			--mute-button-normal: #8f5ad1;
			--mute-button-mod: #482574;
			--pitch1-secondary-channel: #6b7f19;
			--pitch1-primary-channel: #BCDE2C;
			--pitch1-secondary-note: #6b7f19;
			--pitch1-primary-note: #BCDE2C;
			--pitch2-secondary-channel: #497a31;
			--pitch2-primary-channel: #7BD152;
			--pitch2-secondary-note: #497a31;
			--pitch2-primary-note: #7BD152;
			--pitch3-secondary-channel: #286b40;
			--pitch3-primary-channel: #45BE71;
			--pitch3-secondary-note: #286b40;
			--pitch3-primary-note: #45BE71;
			--pitch4-secondary-channel: #125140;
			--pitch4-primary-channel: #25A884;
			--pitch4-secondary-note: #125140;
			--pitch4-primary-note: #25A884;
			--pitch5-secondary-channel: #114c49;
			--pitch5-primary-channel: #21908C;
			--pitch5-secondary-note: #114c49;
			--pitch5-primary-note: #21908C;
			--pitch6-secondary-channel: #143843;
			--pitch6-primary-channel: #2B788E;
			--pitch6-secondary-note: #143843;
			--pitch6-primary-note: #2B788E;
			--pitch7-secondary-channel: #1d354e;
			--pitch7-primary-channel: #355F8D;
			--pitch7-secondary-note: #1a2f46;
			--pitch7-primary-note: #355F8D;
			--pitch8-secondary-channel: #2c2e5a;
			--pitch8-primary-channel: #414486;
			--pitch8-secondary-note: #1e1f3d;
			--pitch8-primary-note: #414486;
			--pitch9-secondary-channel: #3c1f5e;
			--pitch9-primary-channel: #5e3b89;
			--pitch9-secondary-note: #25133b;
			--pitch9-primary-note: #5e3b89;
			--pitch10-secondary-channel: #510264;
			--pitch10-primary-channel: #720d8a;
			--pitch10-secondary-note: #440154;
			--pitch10-primary-note: #720d8a;
			--noise1-secondary-channel: #BCDE2C;
			--noise1-primary-channel: #edff9f;
			--noise1-secondary-note: #BCDE2C;
			--noise1-primary-note: #edff9f;
			--noise2-secondary-channel: #45BE71;
			--noise2-primary-channel: #89ffb4;
			--noise2-secondary-note: #45BE71;
			--noise2-primary-note: #89ffb4;
			--noise3-secondary-channel: #21908C;
			--noise3-primary-channel: #72fffa;
			--noise3-secondary-note: #21908C;
			--noise3-primary-note: #72fffa;
			--noise4-secondary-channel: #355F8D;
			--noise4-primary-channel: #7cb6f5;
			--noise4-secondary-note: #355F8D;
			--noise4-primary-note: #7cb6f5;
			--noise5-secondary-channel: #482574;
			--noise5-primary-channel: #8f5ad1;
			--noise5-secondary-note: #48257A;
			--noise5-primary-note: #8f5ad1;
			--mod1-secondary-channel: #815a16;
			--mod1-primary-channel: #F5AB29;
			--mod1-secondary-note: #815a16;
			--mod1-primary-note: #F5AB29;
			--mod2-secondary-channel: #4d341a;
			--mod2-primary-channel: #C98540;
			--mod2-secondary-note: #4d341a;
			--mod2-primary-note: #C98540;
			--mod3-secondary-channel: #643734;
			--mod3-primary-channel: #A75D58;
			--mod3-secondary-note: #643734;
			--mod3-primary-note: #A75D58;
			--mod4-secondary-channel: #461430;
			--mod4-primary-channel: #812359;
			--mod4-secondary-note: #3f112b;
			--mod4-primary-note: #812359;
			--mod-label-primary: #282828;
			--mod-label-secondary-text: #707070;
			--mod-label-primary-text: white;
			--disabled-note-primary: #5d5d5d;
			--disabled-note-secondary: #292929;
		}`,
        "violet verdant": `
		:root {
			--page-margin: #0e031a;
			--editor-background: #0e031a;
			--hover-preview: #e5ffea;
			--playhead: rgba(255, 255, 255, 0.9);
			--primary-text: #f0e0ff;
			--secondary-text: #706087;
			--box-selection-fill: #225835;
			--loop-accent: #8f00fb;
			--link-accent: #82dd5d;
			--ui-widget-background: #303c66;
			--ui-widget-focus: #62559b;
			--pitch-background: #293b52;
			--tonic: #5b46ad;
			--fifth-note: #42604d;
			--white-piano-key: #f6e8ff;
			--black-piano-key: #5a4972;
			--use-color-formula: true;
			--track-editor-bg-pitch: #392a46;
			--track-editor-bg-pitch-dim: #1c1d28;
			--track-editor-bg-noise: #403150;
			--track-editor-bg-noise-dim: #161313;
			--track-editor-bg-mod: #253c25;
			--track-editor-bg-mod-dim: #0c1811;
			--multiplicative-mod-slider: #606c9f;
			--overwriting-mod-slider: #6850b5;
			--indicator-primary: #9c64f7;
			--indicator-secondary: #393e4f;
			--select2-opt-group: #5d576f;
			--input-box-outline: #403150;
			--mute-button-normal: #82dd5d;
			--mute-button-mod: #945de5;
			--mod-label-primary: #312840;
			--mod-label-secondary-text: rgb(88 70 104);
			--mod-label-primary-text: #82dd5d;
			--pitch-secondary-channel-hue: 64;
			--pitch-secondary-channel-hue-scale: 6.1;
			--pitch-secondary-channel-sat: 63.3;
			--pitch-secondary-channel-sat-scale: 0.1;
			--pitch-secondary-channel-lum: 40;
			--pitch-secondary-channel-lum-scale: 0.05;
			--pitch-primary-channel-hue: 64;
			--pitch-primary-channel-hue-scale: 6.1;
			--pitch-primary-channel-sat: 90;
			--pitch-primary-channel-sat-scale: 0.1;
			--pitch-primary-channel-lum: 67.5;
			--pitch-primary-channel-lum-scale: 0.05;
			--pitch-secondary-note-hue: 32;
			--pitch-secondary-note-hue-scale: 6.1;
			--pitch-secondary-note-sat: 87.9;
			--pitch-secondary-note-sat-scale: 0.1;
			--pitch-secondary-note-lum: 25;
			--pitch-secondary-note-lum-scale: 0.05;
			--pitch-primary-note-hue: 64;
			--pitch-primary-note-hue-scale: 6.1;
			--pitch-primary-note-sat: 90;
			--pitch-primary-note-sat-scale: 0.05;
			--pitch-primary-note-lum: 85.6;
			--pitch-primary-note-lum-scale: 0.025;
			--noise-secondary-channel-hue: 192;
			--noise-secondary-channel-hue-scale: 2;
			--noise-secondary-channel-sat: 45;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 32;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 192;
			--noise-primary-channel-hue-scale: 2;
			--noise-primary-channel-sat: 33;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 43.5;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 160;
			--noise-secondary-note-hue-scale: 2;
			--noise-secondary-note-sat: 33.5;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 45;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 192;
			--noise-primary-note-hue-scale: 2;
			--noise-primary-note-sat: 46.5;
			--noise-primary-note-sat-scale: 0;
			--noise-primary-note-lum: 74;
			--noise-primary-note-lum-scale: 0;
			--mod-secondary-channel-hue: 132;
			--mod-secondary-channel-hue-scale: 1.5;
			--mod-secondary-channel-sat: 88;
			--mod-secondary-channel-sat-scale: 0;
			--mod-secondary-channel-lum: 50;
			--mod-secondary-channel-lum-scale: 0;
			--mod-primary-channel-hue: 132;
			--mod-primary-channel-hue-scale: 1.5;
			--mod-primary-channel-sat: 96;
			--mod-primary-channel-sat-scale: 0;
			--mod-primary-channel-lum: 80;
			--mod-primary-channel-lum-scale: 0;
			--mod-secondary-note-hue: 100;
			--mod-secondary-note-hue-scale: 1.5;
			--mod-secondary-note-sat: 92;
			--mod-secondary-note-sat-scale: 0;
			--mod-secondary-note-lum: 45;
			--mod-secondary-note-lum-scale: 0;
			--mod-primary-note-hue: 132;
			--mod-primary-note-hue-scale: 1.5;
			--mod-primary-note-sat: 96;
			--mod-primary-note-sat-scale: 0;
			--mod-primary-note-lum: 85;
			--mod-primary-note-lum-scale: 0;
			--disabled-note-primary: #91879f;
			--disabled-note-secondary: #6a677a;
		}`,
        "portal": `
		:root {
			--page-margin: #04081a;
			--editor-background: #04081a;
			--box-selection-fill: rgb(0 72 181);
			--loop-accent: #44d4ff;
			--link-accent: #ffa500;
			--ui-widget-background: #212c4a;
			--ui-widget-focus: #121f42;
			--pitch-background: #1b263e;
			--tonic: #995d00;
			--fifth-note: #0898a1;
			--white-piano-key: #ffffff;
			--black-piano-key: #516d7a;
			--track-editor-bg-pitch: #213352;
			--track-editor-bg-pitch-dim: #152032;
			--track-editor-bg-noise: #403524;
			--track-editor-bg-noise-dim: #2a1f0e;
			--indicator-primary: #5490ff;
			--mute-button-normal: #3372ff;
			--mute-button-mod: #dd872f;
			--pitch1-primary-channel: #77f7ff;
			--pitch2-secondary-channel: #0083a1;
			--pitch2-primary-channel: #35d9ff;
			--pitch2-secondary-note: #0083a1;
			--pitch2-primary-note: #a4eeff;
			--pitch3-secondary-channel: #0074c7;
			--pitch3-primary-channel: #3caeff;
			--pitch3-secondary-note: #00477a;
			--pitch3-primary-note: #aadcff;
			--pitch4-secondary-channel: #0039a1;
			--pitch4-primary-channel: #2673ff;
			--pitch4-secondary-note: #001f56;
			--pitch4-primary-note: #9bbeff;
			--pitch5-secondary-channel: #31148b;
			--pitch5-primary-channel: #7042ff;
			--pitch5-secondary-note: #190656;
			--pitch5-primary-note: #b79fff;
			--pitch6-secondary-channel: #979934;
			--pitch6-primary-channel: #fbff2f;
			--pitch6-secondary-note: #5d5e0a;
			--pitch6-primary-note: #fdff9a;
			--pitch7-secondary-channel: #b78f00;
			--pitch7-primary-channel: #ffd747;
			--pitch7-secondary-note: #5e3d00;
			--pitch7-primary-note: #ffe381;
			--pitch8-secondary-channel: #9d6500;
			--pitch8-primary-channel: #ffa400;
			--pitch8-secondary-note: #583900;
			--pitch8-primary-note: #ffd07c;
			--pitch9-secondary-channel: #744203;
			--pitch9-primary-channel: #ff8e00;
			--pitch9-secondary-note: #502d00;
			--pitch9-primary-note: #ffcb89;
			--pitch10-secondary-channel: #a32d00;
			--pitch10-primary-channel: #ff885b;
			--pitch10-secondary-note: #521700;
			--pitch10-primary-note: #ffb397;
			--noise1-secondary-channel: #6e2210;
			--noise1-primary-channel: #ff4600;
			--noise1-secondary-note: #4c1a08;
			--noise1-primary-note: #ffc9b4;
			--noise2-secondary-channel: #6a3110;
			--noise2-primary-channel: #ff782a;
			--noise2-secondary-note: #4c1f05;
			--noise2-primary-note: #ffb488;
			--noise3-secondary-channel: #72460e;
			--noise3-primary-channel: #d9871f;
			--noise3-secondary-note: #442905;
			--noise3-primary-note: #ffdcae;
			--noise4-secondary-channel: #837a0f;
			--noise4-primary-channel: #f7ea55;
			--noise4-secondary-note: #605906;
			--noise4-primary-note: #fff9ab;
			--noise5-secondary-channel: #8c8f00;
			--noise5-primary-channel: #fdff90;
			--noise5-secondary-note: #606200;
			--noise5-primary-note: #feffbc;
			--mod1-secondary-channel: #561b97;
			--mod1-primary-channel: #aa66f5;
			--mod1-secondary-note: #30075c;
			--mod1-primary-note: #cd9fff;
			--mod2-secondary-channel: #5116df;
			--mod2-primary-channel: #6b2dff;
			--mod2-secondary-note: #36138b;
			--mod2-primary-note: #bea3ff;
			--mod3-secondary-channel: #2535a1;
			--mod3-primary-channel: #3f57ff;
			--mod3-secondary-note: #0e185c;
			--mod3-primary-note: #8494ff;
			--mod4-secondary-channel: #1b5883;
			--mod4-primary-channel: #5eb7f5;
			--mod4-secondary-note: #072f4a;
			--mod4-primary-note: #63beff;
			--mod-label-primary: #24293a;
			--mod-label-secondary-text: #454d4e;
			--mod-label-primary-text: #7bd4ff;
			--disabled-note-primary: #072f4a;
			--disabled-note-secondary: #6585a7;
		}`,
        "fusion": `:root {
			--page-margin: #0c0306;
			--editor-background: #0c0306;
			--primary-text: #26d9cd;
			--secondary-text: #ff6666;
			--inverted-text: white;
			--text-selection: #ffffff;
			--box-selection-fill: #ff00004d;
			--loop-accent: #ff6666;
			--link-accent: white;
			--ui-widget-background: #232323;
			--ui-widget-focus: #303030;
			--pitch-background: hsl(61deg 100% 70% / 25%);
			--tonic: #66a3ff40;
			--fifth-note: #ff666640;
			--white-piano-key: #cdcdcd;
			--black-piano-key: #232323;
			--track-editor-bg-pitch: #404040bf;
			--track-editor-bg-pitch-dim: #151515;
			--track-editor-bg-noise: #404040bf;
			--track-editor-bg-noise-dim: #151515;
			--track-editor-bg-mod: #404040bf;
			--track-editor-bg-mod-dim: #151515;
			--multiplicative-mod-slider: #ef7692;
			--overwriting-mod-slider: #f43e69;
			--indicator-primary: #26d9cd;
			--indicator-secondary: hsl(176deg 70% 25%);
			--select2-opt-group: #232323;
			--input-box-outline: #141e34;
			--mute-button-normal: #26d9cd;
			--mute-button-mod: hsl(346deg 70% 50%);
			--pitch1-secondary-channel: #bf4040;
			--pitch1-primary-channel: #ff6666;
			--pitch1-secondary-note: #bf4040;
			--pitch1-primary-note: #ff6666;
			--pitch2-secondary-channel: #bf5b40;
			--pitch2-primary-channel: #ff8766;
			--pitch2-secondary-note: #bf5b40;
			--pitch2-primary-note: #ff8766;
			--pitch3-secondary-channel: #bf7940;
			--pitch3-primary-channel: #ffab66;
			--pitch3-secondary-note: #bf7940;
			--pitch3-primary-note: #ffab66;
			--pitch4-secondary-channel: #bf9b40;
			--pitch4-primary-channel: #ffd466;
			--pitch4-secondary-note: #bf9b40;
			--pitch4-primary-note: #ffd466;
			--pitch5-secondary-channel: #bdbf40;
			--pitch5-primary-channel: #fcff66;
			--pitch5-secondary-note: #bdbf40;
			--pitch5-primary-note: #fcff66;
			--pitch6-secondary-channel: #9dbf40;
			--pitch6-primary-channel: #d6ff66;
			--pitch6-secondary-note: #9dbf40;
			--pitch6-primary-note: #d6ff66;
			--pitch7-secondary-channel: #9dbf40;
			--pitch7-primary-channel: #fcff66;
			--pitch7-secondary-note: #9dbf40;
			--pitch7-primary-note: #fcff66;
			--pitch8-secondary-channel: #bf9b40;
			--pitch8-primary-channel: #ffd466;
			--pitch8-secondary-note: #bf9b40;
			--pitch8-primary-note: #ffd466;
			--pitch9-secondary-channel: #bf5b40;
			--pitch9-primary-channel: #ffab66;
			--pitch9-secondary-note: #bf5b40;
			--pitch9-primary-note: #ffab66;
			--pitch10-secondary-channel: #d15a1f;
			--pitch10-primary-channel: #ff8766;
			--pitch10-secondary-note: #d15a1f;
			--pitch10-primary-note: #ff8766;
			--noise1-secondary-channel: #4073bf;
			--noise1-primary-channel: #66a3ff;
			--noise1-secondary-note: #4073bf;
			--noise1-primary-note: #66a3ff;
			--noise2-secondary-channel: #405dbf;
			--noise2-primary-channel: #668aff;
			--noise2-secondary-note: #405dbf;
			--noise2-primary-note: #668aff;
			--noise3-secondary-channel: #4f40bf;
			--noise3-primary-channel: #7866ff;
			--noise3-secondary-note: #4f40bf;
			--noise3-primary-note: #7866ff;
			--noise4-secondary-channel: #8840bf;
			--noise4-primary-channel: #bd66ff;
			--noise4-secondary-note: #8840bf;
			--noise4-primary-note: #bd66ff;
			--noise5-secondary-channel: #bf40b5;
			--noise5-primary-channel: #ff66f2;
			--noise5-secondary-note: #bf40b5;
			--noise5-primary-note: #ff66f2;
			--mod1-secondary-channel: #cc6666;
			--mod1-primary-channel: #ff9999;
			--mod1-secondary-note: #cc6666;
			--mod1-primary-note: #ff9999;
			--mod2-secondary-channel: #cc7766;
			--mod2-primary-channel: #ffaa99;
			--mod2-secondary-note: #bf5540;
			--mod2-primary-note: #ffaa99;
			--mod3-secondary-channel: #cc8866;
			--mod3-primary-channel: #ffbb99;
			--mod3-secondary-note: #cc8866;
			--mod3-primary-note: #ffbb99;
			--mod4-secondary-channel: #cc9966;
			--mod4-primary-channel: #ffcc99;
			--mod4-secondary-note: #cc9966;
			--mod4-primary-note: #ffcc99;
			--disabled-note-primary: #696969;
			--disabled-note-secondary: #232323;
		}`,
        "inverse": `:root {
			--page-margin: #c4c8e3;
			--editor-background: #c4c8e3;
			--hover-preview: #000000;
			--playhead: #243953;
			--primary-text: black;
			--secondary-text: #855b95;
			--text-selection: rgb(132 125 255);
			--box-selection-fill: rgb(174 109 73 / 65%);
			--loop-accent: #EC897D;
			--link-accent: #4e00c8;
			--ui-widget-background: #e7e7ff;
			--ui-widget-focus: #d0d3e9;
			--pitch-background: #ffffff;
			--tonic: #bbbbbb;
			--fifth-note: #dcdcdc;
			--white-piano-key: #ffffff;
			--black-piano-key: #615f66;
			--track-editor-bg-pitch: #e9ebff;
			--track-editor-bg-pitch-dim: #e9ebff;
			--track-editor-bg-noise: #fdf2fe;
			--track-editor-bg-noise-dim: #fdf2fe;
			--track-editor-bg-mod: #dbdefe;
			--track-editor-bg-mod-dim: #dbdefe;
			--multiplicative-mod-slider: #6900b3;
			--overwriting-mod-slider: #004b9d;
			--indicator-primary: #ff633d;
			--indicator-secondary: #933822;
			--select2-opt-group: #e7e7ff;
			--input-box-outline: #e7e7ff;
			--mute-button-normal: #0072ef;
			--mute-button-mod: #002e67;
			--pitch1-secondary-channel: #b77d6e;
			--pitch1-primary-channel: #ff9d85;
			--pitch1-secondary-note: #b77d6e;
			--pitch1-primary-note: #ff9d85;
			--pitch2-secondary-channel: #be8821;
			--pitch2-primary-channel: #FFAF12;
			--pitch2-secondary-note: #be8821;
			--pitch2-primary-note: #FFAF12;
			--pitch3-secondary-channel: #3a62a4;
			--pitch3-primary-channel: #528ae6;
			--pitch3-secondary-note: #3a62a4;
			--pitch3-primary-note: #528ae6;
			--pitch4-secondary-channel: #3e8d78;
			--pitch4-primary-channel: #4EC5A7;
			--pitch4-secondary-note: #3e8d78;
			--pitch4-primary-note: #4EC5A7;
			--pitch5-secondary-channel: #84906d;
			--pitch5-primary-channel: #aabf84;
			--pitch5-secondary-note: #84906d;
			--pitch5-primary-note: #aabf84;
			--pitch6-secondary-channel: #bd6345;
			--pitch6-primary-channel: #e59a81;
			--pitch6-secondary-note: #bd6345;
			--pitch6-primary-note: #e59a81;
			--pitch7-secondary-channel: #aa592f;
			--pitch7-primary-channel: #FE813E;
			--pitch7-secondary-note: #aa592f;
			--pitch7-primary-note: #FE813E;
			--pitch8-secondary-channel: #b2a171;
			--pitch8-primary-channel: #ffd76d;
			--pitch8-secondary-note: #b2a171;
			--pitch8-primary-note: #ffd76d;
			--pitch9-secondary-channel: #4f6177;
			--pitch9-primary-channel: #798FA7;
			--pitch9-secondary-note: #4f6177;
			--pitch9-primary-note: #798FA7;
			--pitch10-secondary-channel: #165162;
			--pitch10-primary-channel: #107895;
			--pitch10-secondary-note: #165162;
			--pitch10-primary-note: #107895;
			--noise1-secondary-channel: #71617C;
			--noise1-primary-channel: #977da9;
			--noise1-secondary-note: #71617C;
			--noise1-primary-note: #977da9;
			--noise2-secondary-channel: #4a4c5b;
			--noise2-primary-channel: #707591;
			--noise2-secondary-note: #4a4c5b;
			--noise2-primary-note: #707591;
			--noise3-secondary-channel: #817c7b;
			--noise3-primary-channel: #A19D9C;
			--noise3-secondary-note: #817c7b;
			--noise3-primary-note: #A19D9C;
			--noise4-secondary-channel: #ab847b;
			--noise4-primary-channel: #EAAC9D;
			--noise4-secondary-note: #ab847b;
			--noise4-primary-note: #EAAC9D;
			--noise5-secondary-channel: #B49D74;
			--noise5-primary-channel: #dec69b;
			--noise5-secondary-note: #B49D74;
			--noise5-primary-note: #dec69b;
			--mod1-secondary-channel: #722124;
			--mod1-primary-channel: #D13A41;
			--mod1-secondary-note: #722124;
			--mod1-primary-note: #D13A41;
			--mod2-secondary-channel: #213657;
			--mod2-primary-channel: #34558B;
			--mod2-secondary-note: #213657;
			--mod2-primary-note: #34558B;
			--mod3-secondary-channel: #555D46;
			--mod3-primary-channel: #848f6d;
			--mod3-secondary-note: #555D46;
			--mod3-primary-note: #848f6d;
			--mod4-secondary-channel: #71617C;
			--mod4-primary-channel: #a68ab9;
			--mod4-secondary-note: #71617C;
			--mod4-primary-note: #a68ab9;
			--mod-label-primary: #e9e9e9;
			--mod-label-secondary-text: #707070;
			--disabled-note-primary: #959595;
			--disabled-note-secondary: #6e6e6e;
			}`,
        "nebula": `
		:root {
			--page-margin: #040410;
			--editor-background: #150e1f;
			--playhead: rgba(255, 255, 255, 0.9);
			--secondary-text: #8C849A;
			--text-selection: rgba(141,79,201,0.99);
			--box-selection-fill: #311E44;
			--loop-accent: #CC688C;
			--link-accent: #817DC9;
			--ui-widget-background: #44394F;
			--ui-widget-focus: #7A6386;
			--pitch-background: #393e4f40;
			--tonic: #7D5C9EC0;
			--fifth-note: #ab77bd50;
			--white-piano-key: #EEEEEE;
			--black-piano-key: #5F5566;
			--use-color-formula: true;
			--track-editor-bg-pitch: #46374C;
			--track-editor-bg-pitch-dim: #1F1C2850;
			--track-editor-bg-noise: #3D353B;
			--track-editor-bg-noise-dim: #16131550;
			--track-editor-bg-mod: #623F4C;
			--track-editor-bg-mod-dim: #361A2450;
			--multiplicative-mod-slider: #9F6E6A;
			--overwriting-mod-slider: #A664B5;
			--indicator-primary: #CC6B8E;
			--indicator-secondary: #44394F;
			--select2-opt-group: #6A576F;
			--input-box-outline: #222;
			--mute-button-normal: #BF91DC;
			--mute-button-mod: #DC8C9A;
			--mod-label-primary: #3A2840;
			--mod-label-secondary-text: #62485E;
			--mod-label-primary-text: white;
			--pitch-secondary-channel-hue: -96;
			--pitch-secondary-channel-hue-scale: 4.2;
			--pitch-secondary-channel-sat: 50.3;
			--pitch-secondary-channel-sat-scale: 0.1;
			--pitch-secondary-channel-lum: 40;
			--pitch-secondary-channel-lum-scale: 0.05;
			--pitch-primary-channel-hue: -96;
			--pitch-primary-channel-hue-scale: 4.2;
			--pitch-primary-channel-sat: 70;
			--pitch-primary-channel-sat-scale: 0.1;
			--pitch-primary-channel-lum: 67.5;
			--pitch-primary-channel-lum-scale: 0.05;
			--pitch-secondary-note-hue: -96;
			--pitch-secondary-note-hue-scale: 4.2;
			--pitch-secondary-note-sat: 70.9;
			--pitch-secondary-note-sat-scale: 0.1;
			--pitch-secondary-note-lum: 25;
			--pitch-secondary-note-lum-scale: 0.05;
			--pitch-primary-note-hue: -96;
			--pitch-primary-note-hue-scale: 4.2;
			--pitch-primary-note-sat: 90;
			--pitch-primary-note-sat-scale: 0.05;
			--pitch-primary-note-lum: 85.6;
			--pitch-primary-note-lum-scale: 0.025;
			--noise-secondary-channel-hue: 16;
			--noise-secondary-channel-hue-scale: -1.33;
			--noise-secondary-channel-sat: 25;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 42;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 16;
			--noise-primary-channel-hue-scale: -1.33;
			--noise-primary-channel-sat: 33;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 63.5;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 12;
			--noise-secondary-note-hue-scale: -1.33;
			--noise-secondary-note-sat: 33.5;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 55;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 12;
			--noise-primary-note-hue-scale: -1.33;
			--noise-primary-note-sat: 46.5;
			--noise-primary-note-sat-scale: 0;
			--noise-primary-note-lum: 74;
			--noise-primary-note-lum-scale: 0;
			--mod-secondary-channel-hue: 12;
			--mod-secondary-channel-hue-scale: -.75;
			--mod-secondary-channel-sat: 50;
			--mod-secondary-channel-sat-scale: 0;
			--mod-secondary-channel-lum: 50;
			--mod-secondary-channel-lum-scale: 0;
			--mod-primary-channel-hue: 12;
			--mod-primary-channel-hue-scale: -.75;
			--mod-primary-channel-sat: 70;
			--mod-primary-channel-sat-scale: 0;
			--mod-primary-channel-lum: 80;
			--mod-primary-channel-lum-scale: 0;
			--mod-secondary-note-hue: 12;
			--mod-secondary-note-hue-scale: -.75;
			--mod-secondary-note-sat: 75;
			--mod-secondary-note-sat-scale: 0;
			--mod-secondary-note-lum: 45;
			--mod-secondary-note-lum-scale: 0;
			--mod-primary-note-hue: 12;
			--mod-primary-note-hue-scale: -.75;
			--mod-primary-note-sat: 85;
			--mod-primary-note-sat-scale: 0;
			--mod-primary-note-lum: 85;
			--mod-primary-note-lum-scale: 0;
			--disabled-note-primary: #aaa;
		}`,
        "roe light": `
		:root {
			--page-margin: #fff5f5;
			--editor-background: #fff5f5;
			--hover-preview: #0e8bf1;
			--playhead: 000;
			--primary-text: #0e8bf1;
			--secondary-text: #f10e0e;
			--inverted-text: white;
			--text-selection: #ff4444fc;
			--box-selection-fill: #ff00004d;
			--loop-accent: #9a75ff;
			--link-accent: #ff7070;
			--ui-widget-background: #bdc9e5;
			--ui-widget-focus: #a3b7e5;
			--pitch-background: #d0c7db;
			--tonic: #bed3e4;
			--fifth-note: #e7c6c6;
			--white-piano-key: #cdcdcd;
			--black-piano-key: #232323;
			--track-editor-bg-pitch: #e5e1ea;
			--track-editor-bg-pitch-dim: #cbc4d4;
			--track-editor-bg-noise: #e0ddee;
			--track-editor-bg-noise-dim: #c1bade;
			--track-editor-bg-mod: #d8e6f3;
			--track-editor-bg-mod-dim: #b1cce7;
			--multiplicative-mod-slider: #8097cb;
			--overwriting-mod-slider: #8097cb;
			--indicator-primary: #FF2A2A;
			--indicator-secondary: #92a6d3;
			--select2-opt-group: #b6c4e2;
			--input-box-outline: #bdc9e5;
			--mute-button-normal: #66baff;
			--mute-button-mod: #1a98ff;
			--pitch1-secondary-channel: #273c90;
			--pitch1-primary-channel: #476BFF;
			--pitch1-secondary-note: #273c90;
			--pitch1-primary-note: #476BFF;
			--pitch2-secondary-channel: #3a3898;
			--pitch2-primary-channel: #625FFB;
			--pitch2-secondary-note: #3a3898;
			--pitch2-primary-note: #625FFB;
			--pitch3-secondary-channel: #542780;
			--pitch3-primary-channel: #9C49EC;
			--pitch3-secondary-note: #542780;
			--pitch3-primary-note: #9C49EC;
			--pitch4-secondary-channel: #84225d;
			--pitch4-primary-channel: #fd3fb1;
			--pitch4-secondary-note: #84225d;
			--pitch4-primary-note: #fd3fb1;
			--pitch5-secondary-channel: #8d2323;
			--pitch5-primary-channel: #ff3f3f;
			--pitch5-secondary-note: #8d2323;
			--pitch5-primary-note: #ff3f3f;
			--pitch6-secondary-channel: #84225d;
			--pitch6-primary-channel: #fd3fb1;
			--pitch6-secondary-note: #84225d;
			--pitch6-primary-note: #fd3fb1;
			--pitch7-secondary-channel: #542780;
			--pitch7-primary-channel: #9C49EC;
			--pitch7-secondary-note: #542780;
			--pitch7-primary-note: #9C49EC;
			--pitch8-secondary-channel: #3a3898;
			--pitch8-primary-channel: #625FFB;
			--pitch8-secondary-note: #3a3898;
			--pitch8-primary-note: #625FFB;
			--pitch9-secondary-channel: #273c90;
			--pitch9-primary-channel: #476BFF;
			--pitch9-secondary-note: #273c90;
			--pitch9-primary-note: #476BFF;
			--pitch10-secondary-channel: #165a93;
			--pitch10-primary-channel: #299EFF;
			--pitch10-secondary-note: #165a93;
			--pitch10-primary-note: #299EFF;
			--noise1-secondary-channel: #336bdb;
			--noise1-primary-channel: #4281FF;
			--noise1-secondary-note: #336bdb;
			--noise1-primary-note: #4281FF;
			--noise2-secondary-channel: #5e38dc;
			--noise2-primary-channel: #7347FF;
			--noise2-secondary-note: #5e38dc;
			--noise2-primary-note: #7347FF;
			--noise3-secondary-channel: #7d3097;
			--noise3-primary-channel: #9F3CBF;
			--noise3-secondary-note: #7d3097;
			--noise3-primary-note: #9F3CBF;
			--noise4-secondary-channel: #ad2559;
			--noise4-primary-channel: #D3326F;
			--noise4-secondary-note: #ad2559;
			--noise4-primary-note: #D3326F;
			--noise5-secondary-channel: #d02525;
			--noise5-primary-channel: #FF2A2A;
			--noise5-secondary-note: #d02525;
			--noise5-primary-note: #FF2A2A;
			--mod1-secondary-channel: #35415a;
			--mod1-primary-channel: #47587a;
			--mod1-secondary-note: #35415a;
			--mod1-primary-note: #47587a;
			--mod2-secondary-channel: #5a5374;
			--mod2-primary-channel: #716791;
			--mod2-secondary-note: #5a5374;
			--mod2-primary-note: #716791;
			--mod3-secondary-channel: #53385c;
			--mod3-primary-channel: #6f4c7b;
			--mod3-secondary-note: #53385c;
			--mod3-primary-note: #6f4c7b;
			--mod4-secondary-channel: #7e4e60;
			--mod4-primary-channel: #9e6279;
			--mod4-secondary-note: #7e4e60;
			--mod4-primary-note: #9e6279;
			--mod-label-primary: #d0c7db;
			--mod-label-secondary-text: #cb3434;
			--disabled-note-primary: #616161;
			--disabled-note-secondary: #474747;
		}
		.promptContainerBG::before {
			box-shadow: inset 0 0 2000px rgba(255, 255, 255, .5);
		}`,
        "energized": `
		:root {
			--page-margin: #000a08;
			--editor-background: #000a08;
			--hover-preview: #ffffcc;
			--playhead: #ccfff5;
			--secondary-text: #d9d98c;
			--text-selection: #ffff6659;
			--box-selection-fill: #ffffff33;
			--loop-accent: #ffff00;
			--link-accent: #00ffcc;
			--ui-widget-background: #141f1d;
			--ui-widget-focus: #24423d;
			--pitch-background: #001410;
			--tonic: #00241d;
			--fifth-note: #ffff6633;
			--white-piano-key: #66998f;
			--black-piano-key: #141f1d;
			--track-editor-bg-pitch: #66998f40;
			--track-editor-bg-pitch-dim: #293d3940;
			--track-editor-bg-noise: #66998f40;
			--track-editor-bg-noise-dim: #293d3940;
			--track-editor-bg-mod: #99996640;
			--track-editor-bg-mod-dim: #3d3d2940;
			--multiplicative-mod-slider: #ffff00;
			--overwriting-mod-slider: #00ffcc;
			--indicator-primary: #ffff00;
			--indicator-secondary: #141f1d;
			--select2-opt-group: #1b312e;
			--input-box-outline: #141f1d;
			--mute-button-normal: #00ffcc;
			--mute-button-mod: #00997a;
			--pitch1-secondary-channel: #bfbf40;
			--pitch1-primary-channel: #ffff64;
			--pitch1-secondary-note: #bfbf40;
			--pitch1-primary-note: #ffff64;
			--pitch2-secondary-channel: #a2bf40;
			--pitch2-primary-channel: #e0ff7d;
			--pitch2-secondary-note: #a2bf40;
			--pitch2-primary-note: #e0ff7d;
			--pitch3-secondary-channel: #75bf40;
			--pitch3-primary-channel: #c1ff96;
			--pitch3-secondary-note: #75bf40;
			--pitch3-primary-note: #c1ff96;
			--pitch4-secondary-channel: #40bf51;
			--pitch4-primary-channel: #a2ffaf;
			--pitch4-secondary-note: #40bf51;
			--pitch4-primary-note: #a2ffaf;
			--pitch5-secondary-channel: #40bf86;
			--pitch5-primary-channel: #83ffc8;
			--pitch5-secondary-note: #40bf86;
			--pitch5-primary-note: #83ffc8;
			--pitch6-secondary-channel: #40bfa6;
			--pitch6-primary-channel: #64ffe1;
			--pitch6-secondary-note: #40bfa6;
			--pitch6-primary-note: #64ffe1;
			--pitch7-secondary-channel: #40bf86;
			--pitch7-primary-channel: #83ffc8;
			--pitch7-secondary-note: #40bf86;
			--pitch7-primary-note: #83ffc8;
			--pitch8-secondary-channel: #40bf51;
			--pitch8-primary-channel: #a2ffaf;
			--pitch8-secondary-note: #40bf51;
			--pitch8-primary-note: #a2ffaf;
			--pitch9-secondary-channel: #75bf40;
			--pitch9-primary-channel: #c1ff96;
			--pitch9-secondary-note: #75bf40;
			--pitch9-primary-note: #c1ff96;
			--pitch10-secondary-channel: #a2bf40;
			--pitch10-primary-channel: #e0ff7d;
			--pitch10-secondary-note: #a2bf40;
			--pitch10-primary-note: #e0ff7d;
			--noise1-secondary-channel: #a6a659;
			--noise1-primary-channel: #ffffcc;
			--noise1-secondary-note: #a6a659;
			--noise1-primary-note: #ffffcc;
			--noise2-secondary-channel: #94a659;
			--noise2-primary-channel: #f3ffcc;
			--noise2-secondary-note: #94a659;
			--noise2-primary-note: #f3ffcc;
			--noise3-secondary-channel: #79a659;
			--noise3-primary-channel: #e1ffcc;
			--noise3-secondary-note: #79a659;
			--noise3-primary-note: #e1ffcc;
			--noise4-secondary-channel: #94a659;
			--noise4-primary-channel: #f3ffcc;
			--noise4-secondary-note: #94a659;
			--noise4-primary-note: #f3ffcc;
			--noise5-secondary-channel: #a6a659;
			--noise5-primary-channel: #ffffcc;
			--noise5-secondary-note: #a6a659;
			--noise5-primary-note: #ffffcc;
			--mod1-secondary-channel: #a3a329;
			--mod1-primary-channel: #ffff00;
			--mod1-secondary-note: #a3a329;
			--mod1-primary-note: #ffff00;
			--mod2-secondary-channel: #a38529;
			--mod2-primary-channel: #ffbf00;
			--mod2-secondary-note: #a38529;
			--mod2-primary-note: #ffbf00;
			--mod3-secondary-channel: #a36629;
			--mod3-primary-channel: #ff7f00;
			--mod3-secondary-note: #a36629;
			--mod3-primary-note: #ff7f00;
			--mod4-secondary-channel: #a38529;
			--mod4-primary-channel: #ffbf00;
			--mod4-secondary-note: #a38529;
			--mod4-primary-note: #ffbf00;
			--mod-label-primary: #141f1d;
			--mod-label-secondary-text: #d9d98c;
			--mod-label-primary-text: white;
			--disabled-note-primary: #808080;
			--disabled-note-secondary: #666666;
		}`,
        "neapolitan": `:root {
			--page-margin: #120807;
			--editor-background: #120807;
			--hover-preview: #e79a82;
			--playhead: #e79a82;
			--primary-text: #decdbf;
			--secondary-text: #fa99bb;
			--text-selection: #990036;
			--loop-accent: #f6377a;
			--link-accent: #f6377a;
			--ui-widget-background: #24160f;
			--ui-widget-focus: #362217;
			--pitch-background: #1e1106;
			--tonic: #382414;
			--fifth-note: #41240c;
			--white-piano-key: #e1c5b7;
			--black-piano-key: #482c1e;
			--white-piano-key-text: black;
			--black-piano-key-text: white;
			--track-editor-bg-pitch: #4d2a19;
			--track-editor-bg-pitch-dim: #27150c;
			--track-editor-bg-noise: #4d2a19;
			--track-editor-bg-noise-dim: #27150c;
			--track-editor-bg-mod: #4d2a19;
			--track-editor-bg-mod-dim: #27150c;
			--multiplicative-mod-slider: #decdbf;
			--overwriting-mod-slider: #decdbf;
			--indicator-primary: #decdbf;
			--indicator-secondary: #362217;
			--select2-opt-group: #24160f;
			--input-box-outline: #24160f;
			--mute-button-normal: #ff66a1;
			--mute-button-mod: #e61968;
			--pitch1-secondary-channel: #680029;
			--pitch1-primary-channel: #cc0052;
			--pitch1-secondary-note: #660029;
			--pitch1-primary-note: #cc0052;
			--pitch2-secondary-channel: #7e1b43;
			--pitch2-primary-channel: #d32e71;
			--pitch2-secondary-note: #7e1b43;
			--pitch2-primary-note: #d32e71;
			--pitch3-secondary-channel: #aa275e;
			--pitch3-primary-channel: #da5d91;
			--pitch3-secondary-note: #aa275e;
			--pitch3-primary-note: #da5d91;
			--pitch4-secondary-channel: #cc3878;
			--pitch4-primary-channel: #e18bb0;
			--pitch4-secondary-note: #cc3878;
			--pitch4-primary-note: #e18bb0;
			--pitch5-secondary-channel: #d06c9b;
			--pitch5-primary-channel: #e9bad0;
			--pitch5-secondary-note: #d06c9b;
			--pitch5-primary-note: #e9bad0;
			--pitch6-secondary-channel: #c9acc5;
			--pitch6-primary-channel: #f0e8ef;
			--pitch6-secondary-note: #c9acc5;
			--pitch6-primary-note: #f0e8ef;
			--pitch7-secondary-channel: #d06c9b;
			--pitch7-primary-channel: #e9bad0;
			--pitch7-secondary-note: #d06c9b;
			--pitch7-primary-note: #e9bad0;
			--pitch8-secondary-channel: #cc3878;
			--pitch8-primary-channel: #e18bb0;
			--pitch8-secondary-note: #cc3878;
			--pitch8-primary-note: #e18bb0;
			--pitch9-secondary-channel: #aa275e;
			--pitch9-primary-channel: #da5d91;
			--pitch9-secondary-note: #aa275e;
			--pitch9-primary-note: #da5d91;
			--pitch10-secondary-channel: #7e1b43;
			--pitch10-primary-channel: #d32e71;
			--pitch10-secondary-note: #7e1b43;
			--pitch10-primary-note: #d32e71;
			--noise1-secondary-channel: #683a37;
			--noise1-primary-channel: #A85F5A;
			--noise1-secondary-note: #683a37;
			--noise1-primary-note: #A85F5A;
			--noise2-secondary-channel: #7c4a41;
			--noise2-primary-channel: #B47A70;
			--noise2-secondary-note: #7c4a41;
			--noise2-primary-note: #B47A70;
			--noise3-secondary-channel: #935f4d;
			--noise3-primary-channel: #c09587;
			--noise3-secondary-note: #935f4d;
			--noise3-primary-note: #C09587;
			--noise4-secondary-channel: #aa795a;
			--noise4-primary-channel: #cdb09d;
			--noise4-secondary-note: #aa795a;
			--noise4-primary-note: #CDAF9D;
			--noise5-secondary-channel: #bb987c;
			--noise5-primary-channel: #decdbf;
			--noise5-secondary-note: #bb987c;
			--noise5-primary-note: #decdbf;
			--mod1-secondary-channel: #6ca784;
			--mod1-primary-channel: #accdb9;
			--mod1-secondary-note: #6ca784;
			--mod1-primary-note: #accdb9;
			--mod2-secondary-channel: #7daa9f;
			--mod2-primary-channel: #bbd3cd;
			--mod2-secondary-note: #7daa9f;
			--mod2-primary-note: #bbd3cd;
			--mod3-secondary-channel: #70a3a9;
			--mod3-primary-channel: #afcccf;
			--mod3-secondary-note: #70a3a9;
			--mod3-primary-note: #afcccf;
			--mod4-secondary-channel: #5698b8;
			--mod4-primary-channel: #9ec3d6;
			--mod4-secondary-note: #5698b8;
			--mod4-primary-note: #9ec3d6;
			--mod-label-primary: #24160f;
			--mod-label-secondary-text: #E5AFC2;
			--mod-label-primary-text: #decdbf;
			--disabled-note-primary: #bababa;
			--disabled-note-secondary: #878787;
		}`,
        "poly":
			`:root {
			--page-margin: #000;
			--editor-background: #000;
			--hover-preview: #808080;
			--playhead: #808080;
			--secondary-text: #cccccc;
			--text-selection: #696969;
			--box-selection-fill: #cccccc40;
			--loop-accent: #808080;
			--link-accent: white;
			--ui-widget-background: #232323;
			--ui-widget-focus: #303030;
			--pitch-background: #1a1a1a;
			--tonic: #262626;
			--fifth-note: #0d0d0d;
			--white-piano-key: #808080;
			--black-piano-key: #232323;
			--use-color-formula: true;
			--track-editor-bg-pitch: #262626;
			--track-editor-bg-pitch-dim: #1a1a1a;
			--track-editor-bg-noise: #262626;
			--track-editor-bg-noise-dim: #1a1a1a;
			--track-editor-bg-mod: #262626;
			--track-editor-bg-mod-dim: #1a1a1a;
			--multiplicative-mod-slider: #808080;
			--overwriting-mod-slider: #808080;
			--indicator-primary: #808080;
			--indicator-secondary: #333333;
			--select2-opt-group: #232323;
			--input-box-outline: #222;
			--mute-button-normal: #808080;
			--mute-button-mod: #808080;
			--mod-label-primary: #232323;
			--mod-label-secondary-text: #696969;
			--mod-label-primary-text: #cdcdcd;
			--pitch-secondary-channel-hue: 208;
			--pitch-secondary-channel-hue-scale: 10;
			--pitch-secondary-channel-sat: 100;
			--pitch-secondary-channel-sat-scale: 0;
			--pitch-secondary-channel-lum: 88;
			--pitch-secondary-channel-lum-scale: 0;
			--pitch-primary-channel-hue: 207;
			--pitch-primary-channel-hue-scale: 10;
			--pitch-primary-channel-sat: 100;
			--pitch-primary-channel-sat-scale: 0;
			--pitch-primary-channel-lum: 910;
			--pitch-primary-channel-lum-scale: 0;
			--pitch-secondary-note-hue: 208;
			--pitch-secondary-note-hue-scale: 10;
			--pitch-secondary-note-sat: 100;
			--pitch-secondary-note-sat-scale: 0;
			--pitch-secondary-note-lum: 88;
			--pitch-secondary-note-lum-scale: 0;
			--pitch-primary-note-hue: 208;
			--pitch-primary-note-hue-scale: 10;
			--pitch-primary-note-sat: 100;
			--pitch-primary-note-sat-scale: 0;
			--pitch-primary-note-lum: 910;
			--pitch-primary-note-lum-scale: 0;
			--noise-secondary-channel-hue: 328;
			--noise-secondary-channel-hue-scale: 10;
			--noise-secondary-channel-sat: 100;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 88;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 327;
			--noise-primary-channel-hue-scale: 10;
			--noise-primary-channel-sat: 100;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 910;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 328;
			--noise-secondary-note-hue-scale: 10;
			--noise-secondary-note-sat: 100;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 88;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 327;
			--noise-primary-note-hue-scale: 10;
			--noise-primary-note-sat: 100;
			--noise-primary-note-sat-scale: 0;
			--noise-primary-note-lum: 910;
			--noise-primary-note-lum-scale: 0;
			--mod-secondary-channel-hue: 87;
			--mod-secondary-channel-hue-scale: 10;
			--mod-secondary-channel-sat: 100;
			--mod-secondary-channel-sat-scale: 0;
			--mod-secondary-channel-lum: 88;
			--mod-secondary-channel-lum-scale: 0;
			--mod-primary-channel-hue: 88;
			--mod-primary-channel-hue-scale: 10;
			--mod-primary-channel-sat: 100;
			--mod-primary-channel-sat-scale: 0;
			--mod-primary-channel-lum: 910;
			--mod-primary-channel-lum-scale: 0;
			--mod-secondary-note-hue: 87;
			--mod-secondary-note-hue-scale: 10;
			--mod-secondary-note-sat: 100;
			--mod-secondary-note-sat-scale: 0;
			--mod-secondary-note-lum: 88;
			--mod-secondary-note-lum-scale: 0;
			--mod-primary-note-hue: 88;
			--mod-primary-note-hue-scale: 10;
			--mod-primary-note-sat: 100;
			--mod-primary-note-sat-scale: 0;
			--mod-primary-note-lum: 910;
			--mod-primary-note-lum-scale: 0;
			--disabled-note-primary: #c6c6c6;
			--disabled-note-secondary: #8c8c8c;
		}`,
		"blutonium":
			`:root {
			--page-margin: #02070D;
			--editor-background: #02070D;
			--primary-text: #9bd1ee;
			--secondary-text: #5a6da8;
			--text-selection: rgb(68 68 255 / 99%);
			--box-selection-fill: rgb(0 0 255 / 30%);
			--loop-accent: #024aca;
			--link-accent: #024aca;
			--ui-widget-background: #161c2e;
			--ui-widget-focus: #262c3e;
			--pitch-background: #22272D;
			--tonic: #1b3056;
			--fifth-note: #344051;
			--white-piano-key: #a6c6ed;
			--black-piano-key: #2f4687;
			--track-editor-bg-pitch: #25284c;
			--track-editor-bg-pitch-dim: #211c26;
			--track-editor-bg-noise: #261f42;
			--track-editor-bg-noise-dim: #1a152d;
			--track-editor-bg-mod: #183049;
			--track-editor-bg-mod-dim: #102132;
			--multiplicative-mod-slider: #344a7f;
			--overwriting-mod-slider: #344a7f;
			--indicator-primary: #024aca;
			--indicator-secondary: #00177d;
			--select2-opt-group: #141e34;
			--input-box-outline: #141e34;
			--mute-button-normal: #273b9d;
			--mute-button-mod: #27989d;
			--pitch1-secondary-channel: hsl(200, 100%, 40%);
			--pitch1-primary-channel: #99ddff;
			--pitch1-secondary-note: hsl(200, 100%, 40%);
			--pitch1-primary-note: #99ddff;
			--pitch2-secondary-channel: 	hsl(212, 100%, 34%);
			--pitch2-primary-channel: #5BA8FF;
			--pitch2-secondary-note: hsl(212, 100%, 34%);
			--pitch2-primary-note: #5BA8FF;
			--pitch3-secondary-channel: #024ACA;
			--pitch3-primary-channel: #0A89FF;
			--pitch3-secondary-note: #024ACA;
			--pitch3-primary-note: #0A89FF;
			--pitch4-secondary-channel: #00177D;
			--pitch4-primary-channel: #024ACA;
			--pitch4-secondary-note: #00177D;
			--pitch4-primary-note: #024ACA;
			--pitch5-secondary-channel: #000e4e;
			--pitch5-primary-channel: #0023bf;
			--pitch5-secondary-note: #000e4e;
			--pitch5-primary-note: #0023bf;
			--pitch6-secondary-channel: #8990FE;
			--pitch6-primary-channel: #C2C6FF;
			--pitch6-secondary-note: #8990FE;
			--pitch6-primary-note: #C2C6FF;
			--pitch7-secondary-channel: #5E65D3;
			--pitch7-primary-channel: #8990FE;
			--pitch7-secondary-note: #5E65D3;
			--pitch7-primary-note: #8990FE;
			--pitch8-secondary-channel: #3138A6;
			--pitch8-primary-channel: #5E65D3;
			--pitch8-secondary-note: #3138A6;
			--pitch8-primary-note: #5E65D3;
			--pitch9-secondary-channel: #1B0B7F;
			--pitch9-primary-channel: #3138A6;
			--pitch9-secondary-note: #1B0B7F;
			--pitch9-primary-note: #3138A6;
			--pitch10-secondary-channel: #13015D;
			--pitch10-primary-channel: #1c02bd;
			--pitch10-secondary-note: #13015D;
			--pitch10-primary-note: #1c02bd;
			--noise1-secondary-channel: #A675FE;
			--noise1-primary-channel: #E2C9FF;
			--noise1-secondary-note: #A675FE;
			--noise1-primary-note: #E2C9FF;
			--noise2-secondary-channel: #6A31CA;
			--noise2-primary-channel: #A675FE;
			--noise2-secondary-note: #6A31CA;
			--noise2-primary-note: #A675FE;
			--noise3-secondary-channel: #5A1991;
			--noise3-primary-channel: #6A31CA;
			--noise3-secondary-note: #5A1991;
			--noise3-primary-note: #6A31CA;
			--noise4-secondary-channel: #2f1a68;
			--noise4-primary-channel: #5A1991;
			--noise4-secondary-note: #2f1a68;
			--noise4-primary-note: #5A1991;
			--noise5-secondary-channel: #211640;
			--noise5-primary-channel: #391b8d;
			--noise5-secondary-note: #211640;
			--noise5-primary-note: #391b8d;
			--mod1-secondary-channel: #25E2CD;
			--mod1-primary-channel: #BDFFCA;
			--mod1-secondary-note: #25E2CD;
			--mod1-primary-note: #BDFFCA;
			--mod2-secondary-channel: #0A98AC;
			--mod2-primary-channel: #25E2CD;
			--mod2-secondary-note: #0A98AC;
			--mod2-primary-note: #25E2CC;
			--mod3-secondary-channel: #005280;
			--mod3-primary-channel: #0A98AC;
			--mod3-secondary-note: #005280;
			--mod3-primary-note: #0A98AC;
			--mod4-secondary-channel: #0f3670;
			--mod4-primary-channel: #1369c1;
			--mod4-secondary-note: #0f3670;
			--mod4-primary-note: #1369c1;
			--mod-label-primary: #191d26;
			--mod-label-secondary-text: #024aca;
			--mod-label-primary-text: #ffffffa6;
			--disabled-note-primary: #c9c9c9;
			--disabled-note-secondary: #616161;
	}`,
"slushie": `
	:root {
		--page-margin: #040814;
		--editor-background: #040814;
		--hover-preview: #c6f7ff;
		--primary-text: #d3f3ff;
		--secondary-text: #6f72b5;
		--inverted-text: black;
		--box-selection-fill: rgb(43 70 171 / 62%);
		--loop-accent: #573ebb;
		--ui-widget-background: #2e2f44;
		--ui-widget-focus: #2b2c46;
		--pitch-background: #353654;
		--tonic: #716fe3;
		--fifth-note: #76469b;
		--white-piano-key: #abbce3;
		--black-piano-key: #2f235e;
		--track-editor-bg-pitch: #3a3b5c;
		--track-editor-bg-pitch-dim: #1f2036;
		--track-editor-bg-noise: #3c3554;
		--track-editor-bg-noise-dim: #1e1834;
		--track-editor-bg-mod: #30335e;
		--track-editor-bg-mod-dim: #161938;
		--multiplicative-mod-slider: #e29cff;
		--overwriting-mod-slider: #495789;
		--indicator-primary: #e1a6ff;
		--indicator-secondary: #415187;
		--select2-opt-group: #22223a;
		--input-box-outline: #2d2648;
		--mute-button-normal: #7aceff;
		--pitch1-secondary-channel: #5f3ea5;
		--pitch1-primary-channel: #c1a4ff;
		--pitch1-secondary-note: #794fd3;
		--pitch1-primary-note: #d8c6ff;
		--pitch2-secondary-channel: #4f44bf;
		--pitch2-primary-channel: #9287ff;
		--pitch2-secondary-note: #5e51d9;
		--pitch2-primary-note: #b6afff;
		--pitch3-secondary-channel: #374eb9;
		--pitch3-primary-channel: #8097ff;
		--pitch3-secondary-note: #445cc9;
		--pitch3-primary-note: #a0b2ff;
		--pitch4-secondary-channel: #2867cf;
		--pitch4-primary-channel: #6fa5ff;
		--pitch4-secondary-note: #2e6ed7;
		--pitch4-primary-note: #a6c7ff;
		--pitch5-secondary-channel: #3175a7;
		--pitch5-primary-channel: #7ec9ff;
		--pitch5-secondary-note: #367eb3;
		--pitch5-primary-note: #9fd7ff;
		--pitch6-secondary-channel: #3993a9;
		--pitch6-primary-channel: #8ce9ff;
		--pitch6-secondary-note: #386da3;
		--pitch6-primary-note: #9eecff;
		--pitch7-secondary-channel: #369d8a;
		--pitch7-primary-channel: #8bfce7;
		--pitch7-secondary-note: #1c93a7;
		--pitch7-primary-note: #abffef;
		--pitch8-secondary-channel: #00A170;
		--pitch8-primary-channel: #50FFC9;
		--pitch8-secondary-note: #00C78A;
		--pitch8-primary-note: #83FFD9;
		--pitch9-secondary-channel: #49b374;
		--pitch9-primary-channel: #8affa9;
		--pitch9-secondary-note: #26815f;
		--pitch9-primary-note: #c8ffde;
		--pitch10-secondary-channel: #58a747;
		--pitch10-primary-channel: #bbffaa;
		--pitch10-secondary-note: #1d7c48;
		--pitch10-primary-note: #c7ffbc;
		--noise1-secondary-channel: #42829b;
		--noise1-primary-channel: #97d3fc;
		--noise1-secondary-note: #3f53b3;
		--noise1-primary-note: #97d3fc;
		--noise2-secondary-channel: #6354bb;
		--noise2-primary-channel: #9a89ff;
		--noise2-secondary-note: #5f4dcd;
		--noise2-primary-note: #c6bcff;
		--noise3-secondary-channel: #704a95;
		--noise3-primary-channel: #c285ff;
		--noise3-secondary-note: #ad5aff;
		--noise3-primary-note: #d3a6ff;
		--noise4-secondary-channel: #a53c65;
		--noise4-primary-channel: #f794bb;
		--noise4-secondary-note: #cb5080;
		--noise4-primary-note: #f794bb;
		--noise5-secondary-channel: #9b2d2d;
		--noise5-primary-channel: #ff7676;
		--noise5-secondary-note: #cb4444;
		--noise5-primary-note: #ff9999;
		--mod1-secondary-channel: #b7613c;
		--mod1-primary-channel: #ff9f76;
		--mod1-secondary-note: #e77e52;
		--mod1-primary-note: #ffb99b;
		--mod2-secondary-channel: #916d34;
		--mod2-primary-channel: #fece80;
		--mod2-secondary-note: #c58b35;
		--mod2-primary-note: #ffdda5;
		--mod3-secondary-channel: #83761a;
		--mod3-primary-channel: #fdf68c;
		--mod3-secondary-note: #c18e00;
		--mod3-primary-note: #fdf68c;
		--mod4-secondary-channel: #a86436;
		--mod4-primary-channel: #c8a825;
		--mod4-secondary-note: #e8ba46;
		--mod4-primary-note: #c8a825;
		--mod-label-primary: #37325e;
		--mod-label-secondary-text: #6e8aa7;
		--mod-label-primary-text: #c1ffff;
}`,
"ultrabox dark": `
:root {
/*--mod-title: #CCCCCC;*/
--loop-accent: #CCCCCC;
--playhead: #CCCCCC;
/*--primary-text: #CCCCCC;
--hover-preview: #CCCCCC;*/
--link-accent: #FF8EC5;
--indicator-primary: #FF8EC5;
/*--indicator-primary: #CCCCCC;*/
/*--indicator-secondary: #E856B2;*/
--white-piano-key: #CCCCCC;
/*--black-piano-key: #444;*/
--text-selection: #932253;
--oscilloscope-line-L: #CCCCCC;
--oscilloscope-line-R: #932253;
--pitch-channel-limit: 8;
--pitch1-secondary-channel: #A83030;
--pitch1-primary-channel:   #FF7C7C;
--pitch1-secondary-note:    #B51532;
--pitch1-primary-note:      #FFA3A3;

--pitch2-secondary-channel: #C75000;
--pitch2-primary-channel:   #FF9752;
--pitch2-secondary-note:    #FF771C;
--pitch2-primary-note:      #FFCDAB;

--pitch3-secondary-channel: #A1A100;
--pitch3-primary-channel: #FFFF25;
--pitch3-secondary-note: #C7C700;
--pitch3-primary-note: #FFFF92;

--pitch4-secondary-channel: #139620;
--pitch4-primary-channel:   #25ff3a;
--pitch4-secondary-note:    #21FF33;
--pitch4-primary-note:      #C0FFB5;

--pitch5-secondary-channel: #0099A1;
--pitch5-primary-channel:   #25F3FF;
--pitch5-secondary-note:    #00BDC7;
--pitch5-primary-note:      #92F9FF;

--pitch6-secondary-channel: #58599E;
--pitch6-primary-channel:   #5EA3FF;
--pitch6-secondary-note:    #183AC7;
--pitch6-primary-note:      #9EC8FF;

--pitch7-secondary-channel: #6038a5;
--pitch7-primary-channel:   #C760FF;
--pitch7-secondary-note:    #5433A0;
--pitch7-primary-note:      #D99EFF;

--pitch8-secondary-channel: #932253;
--pitch8-primary-channel:   #FF60A5;
--pitch8-secondary-note:    #8E1C4E;
--pitch8-primary-note:      #FF8EC5;

/*--track-editor-bg-mod: #632D45;
--track-editor-bg-mod-dim: #3F1D2C;*/
}`,
		"modbox classic": `
			:root {
				--loop-accent: #9900cc;
					--pitch-channel-limit: 6;
					--noise-channel-limit: 4;
				--pitch1-secondary-note:    #0099a1;
				--pitch1-primary-note:      #25f3ff;
				--pitch2-secondary-channel: #439143;
				--pitch2-primary-channel:   #44ff44;
				--pitch2-secondary-note:    #439143;
				--pitch2-primary-note:      #44ff44;
				--pitch3-secondary-channel: #a1a100;
				--pitch3-primary-channel:   #ffff25;
				--pitch3-secondary-note:    #a1a100;
				--pitch3-primary-note:      #ffff25;
				--pitch4-secondary-channel: #c75000;
				--pitch4-primary-channel:   #ff9752;
				--pitch4-secondary-note:    #c75000;
				--pitch4-primary-note:      #ff9752;
				--pitch5-secondary-note:    #d020d0;
				--pitch5-primary-note:      #ff90ff;
				--pitch6-secondary-channel: #552377;
				--pitch6-primary-channel:   #9f31ea;
				--pitch6-secondary-note:    #552377;
				--pitch6-primary-note:      #9f31ea;
				--pitch7-secondary-channel: #221b89;
				--pitch7-primary-channel:   #2b6aff;
				--pitch7-secondary-note:    #221b89;
				--pitch7-primary-note:      #2b6aff;
				--pitch8-secondary-channel: #00995f;
				--pitch8-primary-channel:   #00ff9f;
				--pitch8-secondary-note:    #00995f;
				--pitch8-primary-note:      #00ff9f;
				--pitch9-secondary-channel: #d6b03e;
				--pitch9-primary-channel:   #ffbf00;
				--pitch9-secondary-note:    #d6b03e;
				--pitch9-primary-note:      #ffbf00;
				--pitch10-secondary-channel:#b25915;
				--pitch10-primary-channel:  #d85d00;
				--pitch10-secondary-note:   #b25915;
				--pitch10-primary-note:     #d85d00;
				--noise1-secondary-channel: #991010;
				--noise1-primary-channel:   #ff1616;
				--noise1-secondary-note:    #991010;
				--noise1-primary-note:      #ff1616;
				--noise2-secondary-channel: #aaaaaa;
				--noise2-primary-channel:   #ffffff;
				--noise2-secondary-note:    #aaaaaa;
				--noise2-primary-note:      #ffffff;
				--noise3-secondary-channel: #5869BD;
				--noise3-primary-channel:   #768dfc;
				--noise3-secondary-note:    #5869BD;
				--noise3-primary-note:      #768dfc;
				--noise4-secondary-channel: #7c9b42;
				--noise4-primary-channel:   #a5ff00;
				--noise4-secondary-note:    #7c9b42;
				--noise4-primary-note:      #a5ff00;
				--noise5-secondary-channel: #7c9b42;
         --mod1-secondary-channel: #0099a1;
				--mod1-primary-channel:   #25f3ff;
				--mod1-secondary-note:    #0099a1;
				--mod1-primary-note:      #25f3ff;
				--mod2-secondary-channel: #439143;
				--mod2-primary-channel:   #44ff44;
				--mod2-secondary-note:    #439143;
				--mod2-primary-note:      #44ff44;
				--mod3-secondary-channel: #a1a100;
				--mod3-primary-channel:   #ffff25;
				--mod3-secondary-note:    #a1a100;
				--mod3-primary-note:      #ffff25;
				--mod4-secondary-channel: #c75000;
				--mod4-primary-channel:   #ff9752;
				--mod4-secondary-note:    #c75000;
				--mod4-primary-note:      #ff9752;
					--text-disabled-icon: ✗ ;
				}
			`,
			"zefbox": `
			:root {
				--loop-accent: #C3593D;
				--pitch1-secondary-channel: #06c400;
				--pitch1-primary-channel:   #08ff00;
				--pitch1-secondary-note:    #06c400;
				--pitch1-primary-note:      #06e000;
				--pitch2-secondary-channel: #00bf97;
				--pitch2-primary-channel:   #00ffcb;
				--pitch2-secondary-note:    #00bf97;
				--pitch2-primary-note:      #00edbc;
				--pitch3-secondary-channel: #b5b000;
				--pitch3-primary-channel:   #fffa00;
				--pitch3-secondary-note:    #b5b000;
				--pitch3-primary-note:      #e0db00;
				--pitch4-secondary-channel: #c90000;
				--pitch4-primary-channel:   #e20000;
				--pitch4-secondary-note:    #c90000;
				--pitch4-primary-note:      #e20000;
				--pitch5-secondary-channel: #d17d12;
				--pitch5-primary-channel:   #ff9e21;
				--pitch5-secondary-note:    #d17d12;
				--pitch5-primary-note:      #ef9017;
				--pitch6-secondary-channel: #d35bc8;
				--pitch6-primary-channel:   #ffa5f7;
				--pitch6-secondary-note:    #d35bc8;
				--pitch6-primary-note:      #fc64ee;
				--pitch7-secondary-channel: #D00000;
				--pitch7-primary-channel:   #FF4444;
				--pitch7-secondary-note:    #D00000;
				--pitch7-primary-note:      #FF4444;
				--pitch8-secondary-channel: #00C700;
				--pitch8-primary-channel:   #A0FFA0;
				--pitch8-secondary-note:    #00C700;
				--pitch8-primary-note:      #A0FFA0;
				--pitch9-secondary-channel: #A88981;
				--pitch9-primary-channel:   #F1C3B7;
				--pitch9-secondary-note:    #A88981;
				--pitch9-primary-note:      #F1C3B7;
				--pitch10-secondary-channel:#0C0A99;
				--pitch10-primary-channel:  #0000EE;
				--pitch10-secondary-note:   #0C0A99;
				--pitch10-primary-note:     #0000EE;
				--noise1-secondary-channel: #ABABAB;
				--noise1-primary-channel:   #D6D6D6;
				--noise1-secondary-note:    #ABABAB;
				--noise1-primary-note:      #D6D6D6;
				--noise2-secondary-channel: #A18F51;
				--noise2-primary-channel:   #F6BB6A;
				--noise2-secondary-note:    #A18F51;
				--noise2-primary-note:      #F6BB6A;
				--noise3-secondary-channel: #5869BD;
				--noise3-primary-channel:   #768DFC;
				--noise3-secondary-note:    #5869BD;
				--noise3-primary-note:      #768DFC;
				--noise4-secondary-channel: #8888D0;
				--noise4-primary-channel:   #D0D0FF;
				--noise4-secondary-note:    #8888D0;
				--noise4-primary-note:      #D0D0FF;
				--noise5-secondary-channel: #B7148E;
				--noise5-primary-channel:   #E819B4;
				--noise5-secondary-note:    #B7148E;
				--noise5-primary-note:      #E819B4;
       --mod1-secondary-channel: #06c400;
				--mod1-primary-channel:   #08ff00;
				--mod1-secondary-note:    #06c400;
				--mod1-primary-note:      #06e000;
				--mod2-secondary-channel: #00bf97;
				--mod2-primary-channel:   #00ffcb;
				--mod2-secondary-note:    #00bf97;
				--mod2-primary-note:      #00edbc;
				--mod3-secondary-channel: #b5b000;
				--mod3-primary-channel:   #fffa00;
				--mod3-secondary-note:    #b5b000;
				--mod3-primary-note:      #e0db00;
				--mod4-secondary-channel: #c90000;
				--mod4-primary-channel:   #e20000;
				--mod4-secondary-note:    #c90000;
				--mod4-primary-note:      #e20000;
				}
			`,
			"sandbox classic": `
			:root {
				--loop-accent: #198195;
					--pitch-channel-limit: 6;
					--noise-channel-limit: 4;
				--pitch1-secondary-channel: #539999;
				--pitch1-primary-channel:   #5EB1B1;
				--pitch1-secondary-note:    #539999;
				--pitch1-primary-note:      #5EB1B1;
				--pitch2-secondary-channel: #95933C;
				--pitch2-primary-channel:   #B0AD44;
				--pitch2-secondary-note:    #95933C;
				--pitch2-primary-note:      #B0AD44;
				--pitch3-secondary-channel: #E75566;
				--pitch3-primary-channel:   #FF9AA6;
				--pitch3-secondary-note:    #E75566;
				--pitch3-primary-note:      #FF9AA6;
				--pitch4-secondary-channel: #8B4343;
				--pitch4-primary-channel:   #FF8844;
				--pitch4-secondary-note:    #8B4343;
				--pitch4-primary-note:      #FF8844;
				--pitch5-secondary-channel: #888888;
				--pitch5-primary-channel:   #BBBBBB;
				--pitch5-secondary-note:    #888888;
				--pitch5-primary-note:      #BBBBBB;
				--pitch6-secondary-channel: #BB6906;
				--pitch6-primary-channel:   #FE8D00;
				--pitch6-secondary-note:    #BB6906;
				--pitch6-primary-note:      #FE8D00;
				--pitch7-secondary-channel: #539999;
				--pitch7-primary-channel:   #5EB1B1;
				--pitch7-secondary-note:    #539999;
				--pitch7-primary-note:      #5EB1B1;
				--pitch8-secondary-channel: #95933C;
				--pitch8-primary-channel:   #B0AD44;
				--pitch8-secondary-note:    #95933C;
				--pitch8-primary-note:      #B0AD44;
				--pitch9-secondary-channel: #E75566;
				--pitch9-primary-channel:   #FF9AA6;
				--pitch9-secondary-note:    #E75566;
				--pitch9-primary-note:      #FF9AA6;
				--pitch10-secondary-channel: #8B4343;
				--pitch10-primary-channel:   #FF8844;
				--pitch10-secondary-note:    #8B4343;
				--pitch10-primary-note:      #FF8844;			
				--noise1-secondary-channel: #ABABAB;
				--noise1-primary-channel:   #D6D6D6;
				--noise1-secondary-note:    #ABABAB;
				--noise1-primary-note:      #D6D6D6;
				--noise2-secondary-channel: #A18F51;
				--noise2-primary-channel:   #F6BB6A;
				--noise2-secondary-note:    #A18F51;
				--noise2-primary-note:      #F6BB6A;
				--noise3-secondary-channel: #5869BD;
				--noise3-primary-channel:   #768DFC;
				--noise3-secondary-note:    #5869BD;
				--noise3-primary-note:      #768DFC;
				--noise4-secondary-channel: #8888D0;
				--noise4-primary-channel:   #D0D0FF;
				--noise4-secondary-note:    #8888D0;
				--noise4-primary-note:      #D0D0FF;
				--noise5-secondary-channel: #A18F51;
				--noise5-primary-channel:   #F6BB6A;
				--noise5-secondary-note:    #A18F51;
				--noise5-primary-note:      #F6BB6A;			
         	--mod1-secondary-channel: #539999;
				--mod1-primary-channel:   #5EB1B1;
				--mod1-secondary-note:    #539999;
				--mod1-primary-note:      #5EB1B1;
				--mod2-secondary-channel: #95933C;
				--mod2-primary-channel:   #B0AD44;
				--mod2-secondary-note:    #95933C;
				--mod2-primary-note:      #B0AD44;
				--mod3-secondary-channel: #E75566;
				--mod3-primary-channel:   #FF9AA6;
				--mod3-secondary-note:    #E75566;
				--mod3-primary-note:      #FF9AA6;
				--mod4-secondary-channel: #8B4343;
				--mod4-primary-channel:   #FF8844;
				--mod4-secondary-note:    #8B4343;
				--mod4-primary-note:      #FF8844;
				}
			`,
			"harrybox": `
			:root {
				--loop-accent: #9900cc;
					--noise-channel-limit: 2;
				--pitch1-secondary-channel: #00ffff;
				--pitch1-primary-channel:   #00ffff;
				--pitch1-secondary-note:    #00ffff;
				--pitch1-primary-note:      #00ffff;
				--pitch2-secondary-channel: #00d8d8;
				--pitch2-primary-channel:   #00d8d8;
				--pitch2-secondary-note:    #00d8d8;
				--pitch2-primary-note:      #00d8d8;
				--pitch3-secondary-channel: #00adad;
				--pitch3-primary-channel:   #00adad;
				--pitch3-secondary-note:    #00adad;
				--pitch3-primary-note:      #00adad;
				-pitch4-secondary-channel: #008c8c;
				--pitch4-primary-channel:   #008c8c;
				--pitch4-secondary-note:    #008c8c;
				--pitch4-primary-note:      #008c8c;
				--pitch5-secondary-channel: #005b5b;
				--pitch5-primary-channel:   #005b5b;
				--pitch5-secondary-note:    #005b5b;
				--pitch5-primary-note:      #005b5b;
				--pitch6-secondary-channel: #003333;
				--pitch6-primary-channel:   #003333;
				--pitch6-secondary-note:    #003333;
				--pitch6-primary-note:      #003333;
				--pitch7-secondary-channel: #00ffff;
				--pitch7-primary-channel:   #00ffff;
				--pitch7-secondary-note:    #00ffff;
				--pitch7-primary-note:      #00ffff;
				--pitch8-secondary-channel: #00ffff;
				--pitch8-primary-channel:   #00ffff;
				--pitch8-secondary-note:    #00ffff;
				--pitch8-primary-note:      #00ffff;
				--pitch9-secondary-channel: #00ffff;
				--pitch9-primary-channel:   #00ffff;
				--pitch9-secondary-note:    #00ffff;
				--pitch9-primary-note:      #00ffff;
				--pitch10-secondary-channel:#00ffff;
				--pitch10-primary-channel:  #00ffff;
				--pitch10-secondary-note:   #00ffff;
				--pitch10-primary-note:     #00ffff;
				--noise1-secondary-channel: #991010;
				--noise1-primary-channel:   #ff1616;
				--noise1-secondary-note:    #991010;
				--noise1-primary-note:      #ff1616;
				--noise2-secondary-channel: #aaaaaa;
				--noise2-primary-channel:   #ffffff;
				--noise2-secondary-note:    #aaaaaa;
				--noise2-primary-note:      #ffffff;
				--noise3-secondary-channel: #991010;
				--noise3-primary-channel:   #ff1616;
				--noise3-secondary-note:    #991010;
				--noise3-primary-note:      #ff1616;
				--noise4-secondary-channel: #aaaaaa;
				--noise4-primary-channel:   #ffffff;
				--noise4-secondary-note:    #aaaaaa;
				--noise4-primary-note:      #ffffff;
				--noise5-secondary-channel: #991010;
				--noise5-primary-channel:   #ff1616;
				--noise5-secondary-note:    #991010;
				--noise5-primary-note:      #ff1616;
         	--mod1-secondary-channel: #00ffff;
				--mod1-primary-channel:   #00ffff;
				--mod1-secondary-note:    #00ffff;
				--mod1-primary-note:      #00ffff;
				--mod2-secondary-channel: #00d8d8;
				--mod2-primary-channel:   #00d8d8;
				--mod2-secondary-note:    #00d8d8;
				--mod2-primary-note:      #00d8d8;
				--mod3-secondary-channel: #00adad;
				--mod3-primary-channel:   #00adad;
				--mod3-secondary-note:    #00adad;
				--mod3-primary-note:      #00adad;
				-mod4-secondary-channel: #008c8c;
				--mod4-primary-channel:   #008c8c;
				--mod4-secondary-note:    #008c8c;
				--mod4-primary-note:      #008c8c;
				}
			`,
			"brucebox": `
		:root {
				font: 16px/2 cursive;
				--page-margin: #4667CE;
				--editor-background: #4667CE;
					--track-editor-bg-pitch-dim: #444;
					--track-editor-bg-noise-dim: #444;
					--pitch-channel-limit: 3;
					--noise-channel-limit: 1;
				--pitch1-secondary-channel: #bda822;
				--pitch1-primary-channel:   #fcdb00;
				--pitch1-secondary-note:    #bda822;
				--pitch1-primary-note:      #fcdb00;
				--pitch2-secondary-channel: #612278;
				--pitch2-primary-channel:   #bb00ff;
				--pitch2-secondary-note:    #612278;
				--pitch2-primary-note:      #bb00ff;
				--pitch3-secondary-channel: #8b4343;
				--pitch3-primary-channel:   #ff8844;
				--pitch3-secondary-note:    #8b4343;
				--pitch3-primary-note:      #ff8844;
				--pitch4-secondary-channel: #bda822;
				--pitch4-primary-channel:   #fcdb00;
				--pitch4-secondary-note:    #bda822;
				--pitch4-primary-note:      #fcdb00;
				--pitch5-secondary-channel: #612278;
				--pitch5-primary-channel:   #bb00ff;
				--pitch5-secondary-note:    #612278;
				--pitch5-primary-note:      #bb00ff;
				--pitch6-secondary-channel: #8b4343;
				--pitch6-primary-channel:   #ff8844;
				--pitch6-secondary-note:    #8b4343;
				--pitch6-primary-note:      #ff8844;
				--pitch7-secondary-channel: #bda822;
				--pitch7-primary-channel:   #fcdb00;
				--pitch7-secondary-note:    #bda822;
				--pitch7-primary-note:      #fcdb00;
				--pitch8-secondary-channel: #612278;
				--pitch8-primary-channel:   #bb00ff;
				--pitch8-secondary-note:    #612278;
				--pitch8-primary-note:      #bb00ff;
				--pitch9-secondary-channel: #8b4343;
				--pitch9-primary-channel:   #ff8844;
				--pitch9-secondary-note:    #8b4343;
				--pitch9-primary-note:      #ff8844;
				--pitch10-secondary-channel: #bda822;
				--pitch10-primary-channel:   #fcdb00;
				--pitch10-secondary-note:    #bda822;
				--pitch10-primary-note:      #fcdb00;
				--noise1-secondary-channel: #991010;
				}

				.trackContainer .noSelection {
				background: black !important;
				}

				span input, 
				div.harmonics svg,
				div.spectrum svg,
				div.filterEditor svg,
				div.fadeInOut svg,
				div.loopEditor svg,
				svg#firstImage,
				div.trackContainer div.noSelection
				{
					background: black !important;
				}

				input, textarea {
					background-color: black !important;
				}

				#text-content > section > h1 {
					color: white;
				}

			`,
			 "shitbox 2.0": `
			:root {
			--page-margin: maroon;
					--playhead: firebrick;
					--primary-text: silver;
				--text-selection: rgba(139,69,19,0.99);
					--box-selection-fill: rgba(220,20,60,0.2);
					--loop-accent: #841;
					--link-accent: #841;
					--ui-widget-background: #800;
					--ui-widget-focus: #a00;
					--pitch-background: #700;
					--tonic: #522;
					--fifth-note: #f75;
					--pitch-channel-limit: 6;
					--noise-channel-limit: 3;
				--pitch1-secondary-channel: #7e4a35;
					--pitch1-primary-channel:   #c27251;
					--pitch1-secondary-note:    #7e4a35;
					--pitch1-primary-note:      #f09571;
					--pitch2-secondary-channel: #998a5c;
					--pitch2-primary-channel:   #d9c27c;
					--pitch2-secondary-note:    #998a5c;
					--pitch2-primary-note:      #fae196;
					--pitch3-secondary-channel: #9c927c;
					--pitch3-primary-channel:   #dbceb0;
					--pitch3-secondary-note:    #9c927c;
					--pitch3-primary-note:      #eddebb;
					--pitch4-secondary-channel: #838060;
					--pitch4-primary-channel:   #ccc795;
					--pitch4-secondary-note:    #838060;
					--pitch4-primary-note:      #f2ecb1;
					--pitch5-secondary-channel: #8b6f47;
					--pitch5-primary-channel:   #d1a76b;
					--pitch5-secondary-note:    #8b6f47;
					--pitch5-primary-note:      #ffcc82;
					--pitch6-secondary-channel: #a96e5b;
					--pitch6-primary-channel:   #e3967d;
					--pitch6-secondary-note:    #a96e5b;
					--pitch6-primary-note:      #ffa68a;
						--pitch7-secondary-channel: #7e4a35;
					--pitch7-primary-channel:   #c27251;
					--pitch7-secondary-note:    #7e4a35;
					--pitch7-primary-note:      #f09571;
					--pitch8-secondary-channel: #998a5c;
					--pitch8-primary-channel:   #d9c27c;
					--pitch8-secondary-note:    #998a5c;
					--pitch8-primary-note:      #fae196;
					--pitch9-secondary-channel: #9c927c;
					--pitch9-primary-channel:   #dbceb0;
					--pitch9-secondary-note:    #9c927c;
					--pitch9-primary-note:      #eddebb;
					--pitch10-secondary-channel: #838060;
					--pitch10-primary-channel:   #ccc795;
					--pitch10-secondary-note:    #838060;
					--pitch10-primary-note:      #f2ecb1;
					--noise4-secondary-channel: #6f6f6f;
					--noise4-primary-channel:   #aaaaaa;
					--noise4-secondary-note:    #a7a7a7;
					--noise4-primary-note:      #e0e0e0;
					--noise5-secondary-channel: #996633;
					--noise5-primary-channel:   #ddaa77;
					--noise5-secondary-note:    #cc9966;
					--noise5-primary-note:      #f0d0bb;
         --mod1-secondary-channel: #7e4a35;
					--mod1-primary-channel:   #c27251;
					--mod1-secondary-note:    #7e4a35;
					--mod1-primary-note:      #f09571;
					--mod2-secondary-channel: #998a5c;
					--mod2-primary-channel:   #d9c27c;
					--mod2-secondary-note:    #998a5c;
					--mod2-primary-note:      #fae196;
					--mod3-secondary-channel: #9c927c;
					--mod3-primary-channel:   #dbceb0;
					--mod3-secondary-note:    #9c927c;
					--mod3-primary-note:      #eddebb;
					--mod4-secondary-channel: #838060;
					--mod4-primary-channel:   #ccc795;
					--mod4-secondary-note:    #838060;
					--mod4-primary-note:      #f2ecb1;
					--note-flash: firebrick;
  					--note-flash-secondary: firebrick;
				}
			`,
			 "shitbox 3.0": `
			
			:root {
				font: 20px/2 monospace;
				--page-margin: #252525;
				--editor-background: #252525;
				--primary-text: #C8C8C8;
				--link-accent: #945800;
					--track-editor-bg-pitch-dim: #444;
					--track-editor-bg-noise-dim: #444;
					--pitch-channel-limit: 6;
					--noise-channel-limit: 3;
					--text-disabled-icon: ✗ ;
				}

				.beepboxEditor input[type="range"]::-moz-range-thumb {
					width: 8px !important;
				  }

				button.playButton {
					width: 80px;
				}
				button.prevBarButton {
					width: 40px;
					left:-5px;
				}
				button.nextBarButton {
					width: 40px;
				}

				.trackContainer .noSelection {
				background: black !important;
				}

				span input, 
				div.harmonics svg,
				div.spectrum svg,
				div.filterEditor svg,
				div.fadeInOut svg,
				div.loopEditor svg,
				svg#firstImage 
				{
					background: black !important;
				}

				.beepboxEditor {
					line-height: 1.25;
				}

				#text-content {
					font-size: 32px;
					line-height: 40px;
				}

				#text-content > section > h1 {
					color: #C8C8C8;
					}
			`,
			"nerdbox": `
			:root {
					--pitch-channel-limit: 9;
					--noise-channel-limit: 3;
				--pitch1-secondary-channel: #139620;
				--pitch1-primary-channel:   #25ff3a;
				--pitch1-secondary-note:    #139620;
				--pitch1-primary-note:      #25ff3a;
				--pitch2-secondary-channel: #109986;
				--pitch2-primary-channel:   #1cffe0;
				--pitch2-secondary-note:    #109986;
				--pitch2-primary-note:      #1cffe0;
				--pitch3-secondary-channel: #127296;
				--pitch3-primary-channel:   #21c3ff;
				--pitch3-secondary-note:    #127296;
				--pitch3-primary-note:      #21c3ff;
				--pitch4-secondary-channel: #6038a5;
				--pitch4-primary-channel:   #9456ff;
				--pitch4-secondary-note:    #6038a5;
				--pitch4-primary-note:      #ff35e0;
				--pitch5-secondary-channel: #a52491;
				--pitch5-primary-channel:   #ff35e0;
				--pitch5-secondary-note:    #a52491;
				--pitch5-primary-note:      #af3221;
				--pitch6-secondary-channel: #af3221;
				--pitch6-primary-channel:   #ff4a32;
				--pitch6-secondary-note:    #af3221;
				--pitch6-primary-note:      #ff4a32;
				--pitch7-secondary-channel: #ad6e0f;
				--pitch7-primary-channel:   #ffa216;
				--pitch7-secondary-note:    #ad6e0f;
				--pitch7-primary-note:      #ffa216;
				--pitch8-secondary-channel: #ad6e0f;
				--pitch8-primary-channel:   #ffa216;
				--pitch8-secondary-note:    #ad6e0f;
				--pitch8-primary-note:      #ffa216;
				--pitch9-secondary-channel: #a7b512;
				--pitch9-primary-channel:   #ebff19;
				--pitch9-secondary-note:    #a7b512;
				--pitch9-primary-note:      #ebff19;
				--pitch10-secondary-channel:#70ad1b;
				--pitch10-primary-channel:  #a4ff26;
				--pitch10-secondary-note:   #70ad1b;
				--pitch10-primary-note:     #a4ff26;
				--noise1-secondary-channel: #68706f;
				--noise1-primary-channel:   #a6b2b1;
				--noise1-secondary-note:    #68706f;
				--noise1-primary-note:      #a6b2b1;
				--noise2-secondary-channel: #665c64;
				--noise2-primary-channel:   #a396a1;
				--noise2-secondary-note:    #665c64;
				--noise2-primary-note:      #a396a1;
				--noise3-secondary-channel: #60605a;
				--noise3-primary-channel:   #afaea3;
				--noise3-secondary-note:    #60605a;
				--noise3-primary-note:      #afaea3;
			--noise4-secondary-channel: #665c64;
			--noise4-primary-channel:   #a396a1;
				--noise4-secondary-note:    #665c64;
				--noise4-primary-note:      #a396a1;
				--noise5-secondary-channel: #60605a;
				--noise5-primary-channel:   #afaea3;
				--noise5-secondary-note:    #60605a;
				--noise5-primary-note:      #afaea3;
         --mod1-secondary-channel: #139620;
				--mod1-primary-channel:   #25ff3a;
				--mod1-secondary-note:    #139620;
				--mod1-primary-note:      #25ff3a;
				--mod2-secondary-channel: #109986;
				--mod2-primary-channel:   #1cffe0;
				--mod2-secondary-note:    #109986;
				--mod2-primary-note:      #1cffe0;
				--mod3-secondary-channel: #127296;
				--mod3-primary-channel:   #21c3ff;
				--mod3-secondary-note:    #127296;
				--mod3-primary-note:      #21c3ff;
				--mod4-secondary-channel: #6038a5;
				--mod4-primary-channel:   #9456ff;
				--mod4-secondary-note:    #6038a5;
				--mod4-primary-note:      #ff35e0;
				}
			`,
			"nepbox": `
			:root {
				--page-margin: #000;
				--editor-background: #060606;
				--hover-preview: #fff;
				--playhead: rgb(0, 242, 255);
				--primary-text: #00fff5;
				--secondary-text: #a82f2f;
				--inverted-text: #000;
				--text-selection: rgba(98, 46, 164, .99);
				--box-selection-fill: #b74a4a;
				--loop-accent: #7744FF;
				--link-accent: #ff00e1;
				--ui-widget-background: #484848;
				--ui-widget-focus: #3e3e3e;
				--pitch-background: #0a2d44;
				--tonic: #9150ff;
				--fifth-note: #900;
				--white-piano-key: #353535;
				--black-piano-key: #fff;
				--white-piano-key-text: #fff;
				--black-piano-key-text: #000;
				--track-editor-bg-pitch: #424242;
				--track-editor-bg-pitch-dim: #000;
				--track-editor-bg-noise: #424242;
				--track-editor-bg-noise-dim: #000;
				--track-editor-bg-mod: #3c3c3c;
				--track-editor-bg-mod-dim: #000;
				--multiplicative-mod-slider: #fff;
				--overwriting-mod-slider: #9d9d9d;
				--indicator-primary: #f00;
				--indicator-secondary: #919191;
				--select2-opt-group: #5d576f;
				--input-box-outline: #626262;
				--mute-button-normal: #9a00ff;
				--mute-button-mod: #00fff7;
				--mod-label-primary: #2b2b2b;
				--pitch-channel-limit: 4;
				--noise-channel-limit: 2;

				--pitch1-secondary-channel: #c13cbf;
				--pitch1-primary-channel: #f75dff;
				--pitch1-secondary-note: #b930a2;
				--pitch1-primary-note: #fca5ff;
				--pitch2-secondary-channel: #800000;
				--pitch2-primary-channel: #f00;
				--pitch2-secondary-note: #8c2121;
				--pitch2-primary-note: #ff5252;
				--pitch3-secondary-channel: #004bb3;
				--pitch3-primary-channel: #1792ff;
				--pitch3-secondary-note: #005cb3;
				--pitch3-primary-note: #00ffe9;
				--pitch4-secondary-channel: #a48800;
				--pitch4-primary-channel: #fb0;
				--pitch4-secondary-note: #9c4100;
				--pitch4-primary-note: #ffd84e;
				--noise1-secondary-channel: #868686;
				--noise1-primary-channel: #fff;
				--noise1-secondary-note: #868686;
				--noise1-primary-note: #fff;
				--noise2-secondary-channel: #805300;
				--noise2-primary-channel: #ff8c00;
				--noise2-secondary-note: #6a3500;
				--noise2-primary-note: #a85400;
				--mod1-secondary-channel: #6c0000;
				--mod1-primary-channel: #ff3e3e;
				--mod1-secondary-note: #6c0000;
				--mod1-primary-note: #ff3e3e;
				--mod2-secondary-channel: #d25a00;
				--mod2-primary-channel: #fdff00;
				--mod2-secondary-note: #d25a00;
				--mod2-primary-note: #fdff00;
				--mod3-secondary-channel: #046000;
				--mod3-primary-channel: #23ff1b;
				--mod3-secondary-note: #046000;
				--mod3-primary-note: #23ff1b;
				--mod4-secondary-channel: #3b2bae;
				--mod4-primary-channel: #0c79ff;
				--mod4-secondary-note: #3b2bae;
				--mod4-primary-note: #0c79ff;
				--disabled-note-secondary: #696969;
				}
			`,
			 "cardboardbox classic": `
				:root {
					--page-margin: #0f0700;
--editor-background: #0f0700;
--hover-preview: #75461d;
--playhead: #75461d;
--primary-text: #ddd;
--secondary-text: #8e695b;
--text-selection: #75461d;
--box-selection-fill: rgba(117, 70, 29,0.5);
--loop-accent: #75461d;
--link-accent: #75461d;
--ui-widget-background: #574a3e;
--ui-widget-focus: #756453;
--pitch-background: #361900;
--tonic: #fdba9a;
--fifth-note: #7f78d2;
--pitch1-secondary-channel: #798566;
--pitch1-primary-channel: #9dab86;
--pitch1-secondary-note: #798566;
--pitch1-primary-note: #9dab86;
--pitch2-secondary-channel: #a6733d;
--pitch2-primary-channel: #e6a157;
--pitch2-secondary-note: #a6733d;
--pitch2-primary-note: #e6a157;
--pitch3-secondary-channel: #874c27;
--pitch3-primary-channel: #eb8242;
--pitch3-secondary-note: #874c27;
--pitch3-primary-note: #eb8242;
--pitch4-secondary-channel: #395866;
--pitch4-primary-channel: #537d91;
--pitch4-secondary-note: #395866;
--pitch4-primary-note: #537d91;
--pitch5-secondary-channel: #779992;
--pitch5-primary-channel: #a4d1c8;
--pitch5-secondary-note: #779992;
--pitch5-primary-note: #a4d1c8;
--pitch7-secondary-channel: #300707;
--pitch7-primary-channel: #560d0d;
--pitch7-secondary-note: #300707;
--pitch7-primary-note: #560d0d;
--pitch8-secondary-channel: #486312;
--pitch8-primary-channel: #76a21e;
--pitch8-secondary-note: #486312;
--pitch8-primary-note: #76a21e;
--pitch9-secondary-channel: #4a1242;
--pitch9-primary-channel: #721b65;
--pitch9-secondary-note: #4a1242;
--pitch9-primary-note: #721b65;
--pitch10-secondary-channel: #7a312d;
--pitch10-primary-channel: #f8615a;
--pitch10-secondary-note: #7a312d;
--pitch10-primary-note: #f8615a;
--noise1-secondary-channel: #5f6582;
--noise1-primary-channel: #a6b1e1;
--noise1-secondary-note: #5f6582;
--noise1-primary-note: #a6b1e1;
--noise4-secondary-channel: #6B3E8E;
--noise5-secondary-channel: #996633;
--noise5-primary-channel: #ddaa77;
--noise5-secondary-note: #cc9966;
--noise5-primary-note: #f0d0bb;
--mod1-secondary-channel: #339955;
				}
			`,
			"blubox classic": `
			:root {
				--page-margin: #040410;
					--editor-background: #040410;
					--secondary-text: #84859a;
					--box-selection-fill: #044b94;
					--link-accent: #024ACA;
					--ui-widget-background: #393e4f;
					--ui-widget-focus: #6d6886;
					--pitch-background: #393e4f;
					--tonic: #725491;
					--fifth-note: #54547a;
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
					--mute-button-normal: #886eae;
					--pitch1-secondary-channel: #0A89FF;
					--pitch1-primary-channel:   #024ACA;
					--pitch1-secondary-note:    #0A89FF;
					--pitch1-primary-note:      #024ACA;
					--pitch2-secondary-channel: #0A89FF;
					--pitch2-primary-channel:   #024ACA;
					--pitch2-secondary-note:    #0A89FF;
					--pitch2-primary-note:      #024ACA;
					--pitch3-secondary-channel: #0A89FF;
					--pitch3-primary-channel:   #024ACA;
					--pitch3-secondary-note:    #0A89FF;
					--pitch3-primary-note:      #024ACA;
					--pitch4-secondary-channel: #0A89FF;
					--pitch4-primary-channel:   #024ACA;
					--pitch4-secondary-note:    #0A89FF;
					--pitch4-primary-note:      #024ACA;
					--pitch5-secondary-channel: #0A89FF;
					--pitch5-primary-channel:   #024ACA;
					--pitch5-secondary-note:    #0A89FF;
					--pitch5-primary-note:      #024ACA;
					--pitch6-secondary-channel: #0A89FF;
					--pitch6-primary-channel:   #024ACA;
					--pitch6-secondary-note:    #0A89FF;
					--pitch6-primary-note:      #024ACA;
					--pitch7-secondary-channel: #0A89FF;
					--pitch7-primary-channel:   #024ACA;
					--pitch7-secondary-note:	  #0A89FF;
					--pitch7-primary-note:			#024ACA;
					--pitch8-secondary-channel: #0A89FF;
					--pitch8-primary-channel:   #024ACA;
					--pitch8-secondary-note:    #0A89FF;
					--pitch8-primary-note:      #024ACA;
					--pitch9-secondary-channel: #0A89FF;
					--pitch9-primary-channel:   #024ACA;
					--pitch9-secondary-note:    #0A89FF;
					--pitch9-primary-note:			#024ACA;
					--pitch10-secondary-channel:#0A89FF;
					--pitch10-primary-channel:  #024ACA;
					--pitch10-secondary-note:   #0A89FF;
					--pitch10-primary-note:     #024ACA;
					--noise1-secondary-channel: #0A89FF;
					--noise1-primary-channel:   #024ACA;
					--noise1-secondary-note:    #0A89FF;
					--noise1-primary-note:      #024ACA;
					--noise2-secondary-channel: #0A89FF;
					--noise2-primary-channel:   #024ACA;
					--noise2-secondary-note:    #0A89FF;
					--noise2-primary-note:      #024ACA;
					--noise3-secondary-channel: #0A89FF;
					--noise3-primary-channel:   #024ACA;
					--noise3-secondary-note:    #0A89FF;
					--noise3-primary-note:      #024ACA;
					--noise4-secondary-channel: #0A89FF;
					--noise4-primary-channel:   #024ACA;
					--noise4-secondary-note:    #0A89FF;
					--noise4-primary-note:      #024ACA;
					--mod1-secondary-channel:   #0A89FF;
					--mod1-primary-channel:     #024ACA;
					--mod1-secondary-note:      #0A89FF;
					--mod1-primary-note:        #024ACA;
					--mod2-secondary-channel:   #0A89FF;
					--mod2-primary-channel:     #024ACA;
					--mod2-secondary-note:      #0A89FF;
					--mod2-primary-note:        #024ACA;
					--mod3-secondary-channel:   #0A89FF;
					--mod3-primary-channel:     #024ACA;
					--mod3-secondary-note:      #0A89FF;
					--mod3-primary-note:			  #024ACA;
					--mod4-secondary-channel:   #0A89FF;
					--mod4-primary-channel:     #024ACA;
					--mod4-secondary-note:      #0A89FF;
					--mod4-primary-note:        #024ACA;
					--mod-label-primary:        #282840;
					--mod-label-secondary-text: rgb(87, 86, 120);
					--mod-label-primary-text:   white;
				}
			`,
		"dogebox classic": `
				:root {
			--page-margin: #0d0063;
			--editor-background: #0D0063;
			--pitch-background: #322c59;
			--tonic: #1c1933;
			--fifth-note: #7b74ad;
			--pitch-channel-limit: 6;
			--noise-channel-limit: 3;
			--pitch1-secondary-channel: #c7ac00;
			--pitch1-primary-channel: #fcf403;
			--pitch1-secondary-note: #c7c700;
			--pitch1-primary-note: #fcf403;
			--pitch2-secondary-channel: #9400b5;
			--pitch2-primary-channel: #ff00ee;
			--pitch2-secondary-note: #9400b5;
			--pitch2-primary-note: #ff00ee;
			--pitch3-secondary-channel: #b37466;
			--pitch3-primary-channel: #ffc6a1;
			--pitch3-secondary-note: #b37466;
			--pitch3-primary-note: #ffc6a1;
			--pitch7-secondary-channel: #c7ac00;
			--pitch7-primary-channel: #fcf403;
			--pitch7-secondary-note: #c7c700;
			--pitch7-primary-note: #fcf403;
			--pitch8-secondary-channel: #9400b5;
			--pitch8-primary-channel: #ff00ee;
			--pitch8-secondary-note: #9400b5;
			--pitch8-primary-note: #ff00ee;
			--pitch9-secondary-channel: #b37466;
			--pitch9-primary-channel: #ffc6a1;
			--pitch9-secondary-note: #b37466;
			--pitch9-primary-note: #ffc6a1;
			--pitch10-secondary-channel: #00a100;
			--pitch10-primary-channel: #50ff50;
			--pitch10-secondary-note: #00c700;
			--pitch10-primary-note: #a0ffa0;
			--noise1-secondary-channel: #95acad;
			--noise1-primary-channel: #cee9eb;
			--noise1-secondary-note: #95acad;
			--noise1-primary-note: #cee9eb;
			--noise4-secondary-channel: #7c9b42;
			--noise4-primary-channel:   #a5ff00;
			--noise4-secondary-note:    #7c9b42;
			--noise4-primary-note:      #a5ff00;
			--noise5-secondary-channel: #7c9b42;
      	 	--mod1-secondary-channel: #c7ac00;
			--mod1-primary-channel: #fcf403;
			--mod1-secondary-note: #c7c700;
			--mod1-primary-note: #fcf403;
			--mod2-secondary-channel: #9400b5;
			--mod2-primary-channel: #ff00ee;
			--mod2-secondary-note: #9400b5;
			--mod2-primary-note: #ff00ee;
			--mod3-secondary-channel: #b37466;
			--mod3-primary-channel: #ffc6a1;
			--mod3-secondary-note: #b37466;
			--mod3-primary-note: #ffc6a1;
			--mod4-secondary-channel: #00a100;
			--mod4-primary-channel: #50ff50;
			--mod4-secondary-note: #00c700;
			--mod4-primary-note: #a0ffa0;
				}
			`,
		  "dogebox dark": `
				:root {
					--page-margin: #0d0063;
					--editor-background: #0D0063;
					--pitch-background: #322c59;
					--tonic: #1c1933;
					--fifth-note: #7b74ad;
					--pitch1-secondary-channel: #c7ac00;
					--pitch1-primary-channel:   #fcf403;
					--pitch1-secondary-note:    #c7c700;
					--pitch1-primary-note:      #fcf403;
					--pitch2-secondary-channel: #9400b5;
					--pitch2-primary-channel:   #ff00ee;
					--pitch2-secondary-note:    #9400b5;
					--pitch2-primary-note:      #ff00ee;
					--pitch3-secondary-channel: #b37466;
					--pitch3-primary-channel:   #ffc6a1;
					--pitch3-secondary-note:    #b37466;
					--pitch3-primary-note:      #ffc6a1;
					--noise1-secondary-channel: #95acad;
					--noise1-primary-channel:   #cee9eb;
					--noise1-secondary-note:    #95acad;
					--noise1-primary-note:      #cee9eb;
				}
			`,
		"todbox dark mode": `
			:root {
				-webkit-text-stroke-width: 0.5px;
					--hover-preview: #999999;
					--playhead: #999999;
					--primary-text: #999999;
					--secondary-text: #444444;
				--text-selection: #999999;
					--box-selection-fill: #999999;
					--loop-accent: #999999;
					--link-accent: #999999;
					--ui-widget-background: #222222;
					--ui-widget-focus: #444444;
				--pitch-background: #101010;
					--tonic: #404040;
					--fifth-note: #202020;
					--white-piano-key: #999999;
					--black-piano-key: #101010;
					--pitch-channel-limit: 6;
					--noise-channel-limit: 3;
					--pitch1-secondary-channel: #004444;
					--pitch1-primary-channel:   #009999;
					--pitch1-secondary-note:    #004444;
					--pitch1-primary-note:      #009999;
					--pitch2-secondary-channel: #444400;
					--pitch2-primary-channel:   #999900;
					--pitch2-secondary-note:    #444400;
					--pitch2-primary-note:      #999900;
					--pitch3-secondary-channel: #443300;
					--pitch3-primary-channel:   #996600;
					--pitch3-secondary-note:    #443300;
					--pitch3-primary-note:      #996600;
					--pitch4-secondary-channel: #004400;
					--pitch4-primary-channel:   #009900;
					--pitch4-secondary-note:    #004400;
					--pitch4-primary-note:      #009900;
					--pitch5-secondary-channel: #440044;
					--pitch5-primary-channel:   #990099;
					--pitch5-secondary-note:    #440044;
					--pitch5-primary-note:      #990099;
					--pitch6-secondary-channel: #333344;
					--pitch6-primary-channel:   #666699;
					--pitch6-secondary-note:    #333344;
					--pitch6-primary-note:      #666699;
					--pitch7-secondary-channel: #444400;
					--pitch7-primary-channel:   #999900;
					--pitch7-secondary-note:    #444400;
					--pitch7-primary-note:      #999900;
					--pitch8-secondary-channel: #824E54;
					--pitch8-primary-channel:   #C4757E;
					--pitch8-secondary-note:    #824E54;
					--pitch8-primary-note:      #C4757E;
					--pitch9-secondary-channel: #006342;
					--pitch9-primary-channel:   #008E5F;
					--pitch9-secondary-note:    #006342;
					--pitch9-primary-note:      #008E5F;
					--pitch10-secondary-channel: #561291;
					--pitch10-primary-channel:   #7819C1;
					--pitch10-secondary-note:    #561291;
					--pitch10-primary-note:      #7819C1;
					--noise1-secondary-channel: #444444;
					--noise1-primary-channel:   #999999;
					--noise1-secondary-note:    #444444;
					--noise1-primary-note:      #999999;
					--noise2-secondary-channel: #443311;
					--noise2-primary-channel:   #996633;
					--noise2-secondary-note:    #443311;
					--noise2-primary-note:      #996633;
					--noise3-secondary-channel: #113344;
					--noise3-primary-channel:   #336699;
					--noise3-secondary-note:    #113344;
					--noise3-primary-note:      #336699;
					--noise4-secondary-channel: #444444;
					--noise4-primary-channel:   #999999;
					--noise4-secondary-note:    #444444;
					--noise4-primary-note:      #999999;
					--noise5-secondary-channel: #443311;
					--noise5-primary-channel:   #996633;
					--noise5-secondary-note:    #443311;
					--noise5-primary-note:      #996633;
          --mod1-secondary-channel: #004444;
					--mod1-primary-channel:   #009999;
					--mod1-secondary-note:    #004444;
					--mod1-primary-note:      #009999;
					--mod2-secondary-channel: #444400;
					--mod2-primary-channel:   #999900;
					--mod2-secondary-note:    #444400;
					--mod2-primary-note:      #999900;
					--mod3-secondary-channel: #443300;
					--mod3-primary-channel:   #996600;
					--mod3-secondary-note:    #443300;
					--mod3-primary-note:      #996600;
					--mod4-secondary-channel: #004400;
					--mod4-primary-channel:   #009900;
					--mod4-secondary-note:    #004400;
					--mod4-primary-note:      #009900;
				}
				.beepboxEditor button, .beepboxEditor select {
					box-shadow: inset 0 0 0 1px var(--secondary-text);
				}
			`,
			"mainbox 1.0": `
			:root {
				--loop-accent: #2F1C40;
				--link-accent: #543873;
				--ui-widget-background: #2F1C40;
				--ui-widget-focus: #543873;
				--pitch-background: #2F1C40;
				--tonic: #42286D;
				--fifth-note: #37416B;
				--white-piano-key: #156CB6;
				--black-piano-key: #130D14;
					--pitch-channel-limit: 6;
					--noise-channel-limit: 3;
					--pitch1-secondary-channel: #156C99;
					--pitch1-primary-channel:   #00CFDF;
					--pitch1-secondary-note:    #0080A8;
					--pitch1-primary-note:      #009FC6;
					--pitch2-secondary-channel: #AD923A;
					--pitch2-primary-channel:   #FFD552;
					--pitch2-secondary-note:    #C49736;
					--pitch2-primary-note:      #EFC742;
					--pitch3-secondary-channel: #7A401E;
					--pitch3-primary-channel:   #C14E30;
					--pitch3-secondary-note:    #89381B;
					--pitch3-primary-note:      #E15427;
					--pitch4-secondary-channel: #0B6030;
					--pitch4-primary-channel:   #00915C;
					--pitch4-secondary-note:    #004337;
					--pitch4-primary-note:      #00915E;
					--pitch5-secondary-channel: #543873;
					--pitch5-primary-channel:   #695B95;
					--pitch5-secondary-note:    #8188BE;
					--pitch5-primary-note:      #848ED8;
					--pitch6-secondary-channel: #585882;
					--pitch6-primary-channel:   #5A72DD;
					--pitch7-secondary-channel: #7D7C2E;
					--pitch7-primary-channel:   #B0C952;
					--pitch7-secondary-note:    #7D7C2E;
					--pitch7-primary-note:      #B0C952;
					--pitch8-secondary-channel: #7F426A;
					--pitch8-primary-channel:   #B75297;
					--pitch8-secondary-note:    #7F426A;
					--pitch8-primary-note:      #B75297;
					--pitch9-secondary-channel: #2A6B65;
					--pitch9-primary-channel:   #3BA590;
					--pitch9-secondary-note:    #2A6B65;
					--pitch9-primary-note:      #3BA590;
					--pitch10-secondary-channel: #713EA0;
					--pitch10-primary-channel:   #925EC9;
					--pitch10-secondary-note:    #713EA0;
					--pitch10-primary-note:      #925EC9;
					--noise1-secondary-channel: #6C6C8E;
					--noise1-primary-channel:   #8A7F96;
					--noise1-secondary-note:    #A1A3B7;
					--noise1-primary-note:      #DDBADD;
					--noise2-secondary-channel: #865E40;
					--noise2-secondary-note:    #C7B47A;
					--noise2-primary-note:      #CFC587;
					--noise3-secondary-channel: #7E7068;
					--noise3-primary-channel:   #B19998;
					--noise3-secondary-note:    #BAA6BC;
					--noise3-primary-note:      #EDDCEC;
          --mod1-secondary-channel: #156C99;
					--mod1-primary-channel:   #00CFDF;
					--mod1-secondary-note:    #0080A8;
					--mod1-primary-note:      #009FC6;
					--mod2-secondary-channel: #AD923A;
					--mod2-primary-channel:   #FFD552;
					--mod2-secondary-note:    #C49736;
					--mod2-primary-note:      #EFC742;
					--mod3-secondary-channel: #7A401E;
					--mod3-primary-channel:   #C14E30;
					--mod3-secondary-note:    #89381B;
					--mod3-primary-note:      #E15427;
					--mod4-secondary-channel: #0B6030;
					--mod4-primary-channel:   #00915C;
					--mod4-secondary-note:    #004337;
					--mod4-primary-note:      #00915E;
				}
			`,
			"foxbox": `
			:root {
				--page-margin: #ADD8E6;
				}
			`,
			 "wackybox": `
			
			:root {
				--page-margin: #050000;
				--editor-background: #050000;
					--pitch-channel-limit: 6;
					--noise-channel-limit: 3;
				}

				* {
					cursor: url("theme_resources/wackybox_cursor.png"), auto !important;
				}
				#Hotdog {
					display: inline !important;
					content: url("theme_resources/hotdog.png") !important;
				}

			`,
			 "microbox": `
				:root {
					--page-margin: #000000;
					--editor-background: #000000;
					--playhead: rgba(255, 255, 255, 0.9);
					--secondary-text: #93B6AD;
					--text-selection: rgba(47,255,250,0.99);
					--box-selection-fill: #03B068;
					--loop-accent: #FF0061;
					--link-accent: #FFC800;
					--ui-widget-background: #38554E;
					--ui-widget-focus: #2A7E69;
					--pitch-background: #281F23;
					--tonic: #004634;
					--fifth-note: #463400;
					--white-piano-key: #edc;
					--black-piano-key: #456;
					--use-color-formula: true;
					--track-editor-bg-pitch: #333333;
					--track-editor-bg-pitch-dim: #000000;
					--track-editor-bg-noise: #463400;
					--track-editor-bg-noise-dim: #000000;
					--track-editor-bg-mod: #004634;
					--track-editor-bg-mod-dim: #000000;
					--multiplicative-mod-slider: #FFC800;
					--overwriting-mod-slider: #00ffc0;
					--indicator-primary: #00ffc0;
					--indicator-secondary: #333333;
					--select2-opt-group: #2B2B2B;
					--input-box-outline: #69BFC6;
					--mute-button-normal: #00ffc0;
					--mute-button-mod: #FFC800;
					--mod-label-primary: #38554E;
					--mod-label-secondary-text: rgb(0, 43, 45);
					--mod-label-primary-text: white;
					--pitch-secondary-channel-hue: 0;
					--pitch-secondary-channel-hue-scale: 6.1;
					--pitch-secondary-channel-sat: 83.3;
					--pitch-secondary-channel-sat-scale: 0.1;
					--pitch-secondary-channel-lum: 40;
					--pitch-secondary-channel-lum-scale: 0.05;
					--pitch-primary-channel-hue: 0;
					--pitch-primary-channel-hue-scale: 6.1;
					--pitch-primary-channel-sat: 100;
					--pitch-primary-channel-sat-scale: 0.1;
					--pitch-primary-channel-lum: 67.5;
					--pitch-primary-channel-lum-scale: 0.05;
					--pitch-secondary-note-hue: 0;
					--pitch-secondary-note-hue-scale: 6.1;
					--pitch-secondary-note-sat: 93.9;
					--pitch-secondary-note-sat-scale: 0.1;
					--pitch-secondary-note-lum: 25;
					--pitch-secondary-note-lum-scale: 0.05;
					--pitch-primary-note-hue: 0;
					--pitch-primary-note-hue-scale: 6.1;
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
				}
			`,
			"paandorasbox": `
			:root {
			 --page-margin: #200000;
			  --editor-background: #200000;
			  --text-selection: #FF5100;
			  --loop-accent: #FF5100;
			  --link-accent: #0F0;
			  --ui-widget-background: #562334;
			  --ui-widget-focus: #6D1B36;
			  --pitch-background: #6D1B36;
			  --tonic: #FF5100;
			  --fifth-note: #00B6FF;
			  --track-editor-bg-pitch: #380C14;
			  --track-editor-bg-pitch-dim: #200000;
			  --track-editor-bg-noise: #233323;
			  --track-editor-bg-noise-dim: #101A0F;
			  --track-editor-bg-mod: #234C82;
			  --track-editor-bg-mod-dim: #0D1D33;
			  --indicator-primary: #FF5100;
			  --pitch1-secondary-channel: #00B200;
			  --pitch1-primary-channel: #0F0;
			  --pitch1-secondary-note: #00B200;
			  --pitch1-primary-note: #0F0;
			  --pitch2-secondary-channel: #00B282;
			  --pitch2-primary-channel: #00FFBF;
			  --pitch2-secondary-note: #00B282;
			  --pitch2-primary-note: #00FFBF;
			  --pitch3-secondary-channel: #00B2B2;
			  --pitch3-primary-channel: #0FF;
			  --pitch3-secondary-note: #00B2B2;
			  --pitch3-primary-note: #0FF;
			  --pitch4-secondary-channel: #2623B2;
			  --pitch4-primary-channel: #3631FF;
			  --pitch4-secondary-note: #2623B2;
			  --pitch4-primary-note: #3631FF;
			  --pitch5-secondary-channel: #7700B2;
			  --pitch5-primary-channel: #A0F;
			  --pitch5-secondary-note: #7700B2;
			  --pitch5-primary-note: #A0F;
			  --pitch6-secondary-channel: #B200B2;
			  --pitch6-primary-channel: #F0F;
			  --pitch6-secondary-note: #B200B2;
			  --pitch6-primary-note: #F0F;
			  --pitch7-secondary-channel: #B20000;
			  --pitch7-primary-channel: #F00;
			  --pitch7-secondary-note: #B20000;
			  --pitch7-primary-note: #F00;
			  --pitch8-secondary-channel: #00B200;
			  --pitch8-primary-channel: #0F0;
			  --pitch8-secondary-note: #00B200;
			  --pitch8-primary-note: #0F0;
			  --pitch9-secondary-channel: #00B282;
			  --pitch9-primary-channel: #0FF;
			  --pitch9-secondary-note: #00B282;
			  --pitch9-primary-note: #0FF;
			  --pitch10-secondary-channel: #0071B2;
			  --pitch10-primary-channel: #009EFF;
			  --pitch10-secondary-note: #0071B2;
			  --pitch10-primary-note: #009EFF;
			  --noise1-secondary-channel: #32B221;
			  --noise1-primary-channel: #44FF2F;
			  --noise1-secondary-note: #32B221;
			  --noise1-primary-note: #44FF2F;
			  --noise2-secondary-channel: #216FB2;
			  --noise2-primary-channel: #2F9DFF;
			  --noise2-secondary-note: #216FB2;
			  --noise2-primary-note: #2F9DFF;
			  --noise3-secondary-channel: #2623B2;
			  --noise3-primary-channel: #3631FF;
			  --noise3-secondary-note: #2623B2;
			  --noise3-primary-note: #3631FF;
			  --noise4-secondary-channel: #7223B2;
			  --noise4-primary-channel: #A531FF;
			  --noise4-secondary-note: #7223B2;
			  --noise4-primary-note: #A531FF;
			  --noise5-secondary-channel: #B2235A;
			  --noise5-primary-channel: #FF317E;
			  --noise5-secondary-note: #B2235A;
			  --noise5-primary-note: #FF317E;
			  --mod1-secondary-channel: #17B274;
			  --mod1-primary-channel: #21FFA8;
			  --mod1-secondary-note: #17B274;
			  --mod1-primary-note: #21FFA8;
			  --mod2-secondary-channel: #1783B2;
			  --mod2-primary-channel: #1FBAFF;
			  --mod2-secondary-note: #1783B2;
			  --mod2-primary-note: #1FBAFF;
			  --mod4-secondary-channel: #B20E6B;
			  --mod4-primary-channel: #FF1291;
			  --mod4-secondary-note: #B20E6B;
			  --mod4-primary-note: #FF1291;
			  --mod-label-primary: #994038;
			  --mod-label-secondary-text: #331512;
			  --mod-label-primary-text: #331512;
			  --disabled-note-primary: #994038;
			  --disabled-note-secondary: #331512;
			}
			`,
			"midbox":
			`:root {
			--page-margin: #010a1e;
			--editor-background: #010a1e;
			--hover-preview: #dfe9fe;
			--playhead: #e7f5f6;
			--primary-text: #f0fdff;
			--secondary-text: #c4c7d7;
			--inverted-text: #0f0623;
			--text-selection: #3f0ab4;
			--box-selection-fill: #32afb3;
			--loop-accent: #1719ff;
			--link-accent: #83a6ed;
			--ui-widget-background: #222856;
			--ui-widget-focus: #21417c;
			--pitch-background: #10264a;
			--tonic: #0797ce;
			--fifth-note: #3e2fb5;
			--white-piano-key: #ebf3f4;
			--black-piano-key: #253353;
			--white-piano-key-text: black;
			--black-piano-key-text: white;
			--oscilloscope-line-L: #72dcfc;
			--oscilloscope-line-R: #304eff;
			--mod-title: #1b2fff;
			--use-color-formula: true;
			--track-editor-bg-pitch: #183b65; 
			--track-editor-bg-pitch-dim: #1f2c3d;
			--track-editor-bg-noise: #2e196d;
			--track-editor-bg-noise-dim: #212038;
			--track-editor-bg-mod: #066433;
			--track-editor-bg-mod-dim: #152b1f;
			--multiplicative-mod-slider: #1242a4;
			--overwriting-mod-slider: #2218db;
			--indicator-primary: #1698d3;
			--indicator-secondary: #1b478e;
			--select2-opt-group: #312f6d;
			--input-box-outline: #788b96;
			--mute-button-normal: #1d34f2;
			--mute-button-mod: #06bad6;
			--mod-label-primary: #14383f;
			--mod-label-secondary-text: #1d7080;
			--mod-label-primary-text: #b7e9f2;
			--pitch-secondary-channel-hue: 190;
			--pitch-secondary-channel-hue-scale: 2.5;
			--pitch-secondary-channel-sat: 80;
			--pitch-secondary-channel-sat-scale: 0.1;
			--pitch-secondary-channel-lum: 50;
			--pitch-secondary-channel-lum-scale: 0.05;
			--pitch-primary-channel-hue: 190;
			--pitch-primary-channel-hue-scale: 2.5;
			--pitch-primary-channel-sat: 100;
			--pitch-primary-channel-sat-scale: 0.1;
			--pitch-primary-channel-lum: 76.5;
			--pitch-primary-channel-lum-scale: 0.05;
			--pitch-secondary-note-hue: 190;
			--pitch-secondary-note-hue-scale: 2.5;
			--pitch-secondary-note-sat: 90;
			--pitch-secondary-note-sat-scale: 0.1;
			--pitch-secondary-note-lum: 30;
			--pitch-secondary-note-lum-scale: 0.05;
			--pitch-primary-note-hue: 190;
			--pitch-primary-note-hue-scale: 2.5;
			--pitch-primary-note-sat: 100;
			--pitch-primary-note-sat-scale: 0.05;
			--pitch-primary-note-lum: 85;
			--pitch-primary-note-lum-scale: 0.025;
			--noise-secondary-channel-hue: 200;
			--noise-secondary-channel-hue-scale: 2.5;
			--noise-secondary-channel-sat: 25;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 42;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 200;
			--noise-primary-channel-hue-scale: 2.5;
			--noise-primary-channel-sat: 33;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 63.5;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 200;
			--noise-secondary-note-hue-scale: 2.5;
			--noise-secondary-note-sat: 33.5;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 55;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 200;
			--noise-primary-note-hue-scale: 2.5;
			--noise-primary-note-sat: 46.5;
			--noise-primary-note-sat-scale: 0;
			--noise-primary-note-lum: 74;
			--noise-primary-note-lum-scale: 0;
			--mod-secondary-channel-hue: 140;
			--mod-secondary-channel-hue-scale: 1.5;
			--mod-secondary-channel-sat: 90;
			--mod-secondary-channel-sat-scale: 0;
			--mod-secondary-channel-lum: 55;
			--mod-secondary-channel-lum-scale: 0;
			--mod-primary-channel-hue: 140;
			--mod-primary-channel-hue-scale: 1.5;
			--mod-primary-channel-sat: 100;
			--mod-primary-channel-sat-scale: 0;
			--mod-primary-channel-lum: 85;
			--mod-primary-channel-lum-scale: 0;
			--mod-secondary-note-hue: 140;
			--mod-secondary-note-hue-scale: 1.5;
			--mod-secondary-note-sat: 95;
			--mod-secondary-note-sat-scale: 0;
			--mod-secondary-note-lum: 50;
			--mod-secondary-note-lum-scale: 0;
			--mod-primary-note-hue: 140;
			--mod-primary-note-hue-scale: 1.5;
			--mod-primary-note-sat: 100;
			--mod-primary-note-sat-scale: 0;
			--mod-primary-note-lum: 90;
			--mod-primary-note-lum-scale: 0;
			--disabled-note-primary:    #53527b;
			--disabled-note-secondary:  #1c1b30;
		}
		`,
		"dogebox2": `
			:root {
				--page-margin: #000015;
				--editor-background: #000015;
				--hover-preview: #00ffff;
				--playhead: #00ffff;
				--text-selection: rgba(255, 127, 80, 0.99);
				--box-selection-fill: rgba(255, 255, 255, 0.2);
				--loop-accent: #ff00ff;
				--link-accent: #00ffff;
				--ui-widget-background: #222222;
				--ui-widget-focus: #444444;
				--pitch-background: #222222;
				--tonic: #ab382c;
				--fifth-note: #2a76a8;
				--white-piano-key: #ffffff;
				--black-piano-key: #222222;
				--white-piano-key-text: #000000;
				--track-editor-bg-pitch: #222222;
				--track-editor-bg-pitch-dim: #111111;
				--track-editor-bg-noise: #222222;
				--track-editor-bg-noise-dim: #111111;
				--track-editor-bg-mod: #333333;
				--track-editor-bg-mod-dim: #111111;
				--multiplicative-mod-slider: #666666;
				--overwriting-mod-slider: #666666;
				--indicator-primary: #ff00ff;
				--indicator-secondary: #00ffff;
				--select2-opt-group: #333333;
				--input-box-outline: #444444;
				--mute-button-normal: #ff00ff;
				--mute-button-mod: #00ffff;
				--mod-label-primary: #282840;
				--mod-label-secondary-text: rgb(87, 86, 120);
				--mod-label-primary-text: white;
				--pitch1-secondary-channel: #bd9909;
				--pitch1-primary-channel: #fbff8e;
				--pitch1-secondary-note: #c79d3a;
				--pitch1-primary-note: #fdffb2;
				--pitch2-secondary-channel: #b86e0d;
				--pitch2-primary-channel: #ffb28e;
				--pitch2-secondary-note: #ba643a;
				--pitch2-primary-note: #fbac92;
				--pitch3-secondary-channel: #a81b08;
				--pitch3-primary-channel: #f56c67;
				--pitch3-secondary-note: #94352b;
				--pitch3-primary-note: #f56147;
				--pitch4-secondary-channel: #2a7722;
				--pitch4-primary-channel: #6ebf5e;
				--pitch4-secondary-note: #1c5c18;
				--pitch4-primary-note: #88cf82;
				--pitch5-secondary-channel: #8c8b3c;
				--pitch5-primary-channel: #c3c168;
				--pitch5-secondary-note: #747330;
				--pitch5-primary-note: #d4d394;
				--pitch6-secondary-channel: #3f9577;
				--pitch6-primary-channel: #6fc4b4;
				--pitch6-secondary-note: #2c6a5c;
				--pitch6-primary-note: #8fdad0;
				--pitch7-secondary-channel: #204a80;
				--pitch7-primary-channel: #6d9fc2;
				--pitch7-secondary-note: #132f5a;
				--pitch7-primary-note: #9dbed8;
				--pitch8-secondary-channel: #a531ad;
				--pitch8-primary-channel: #db68e3;
				--pitch8-secondary-note: #8d2f94;
				--pitch8-primary-note: #e66cbf;
				--pitch9-secondary-channel: #03a1a1;
				--pitch9-primary-channel: #52fffb;
				--pitch9-secondary-note: #34baba;
				--pitch9-primary-note: #60fbfb;
				--pitch10-secondary-channel: #4208a1;
				--pitch10-primary-channel: #9282ff;
				--pitch10-secondary-note: #5735b5;
				--pitch10-primary-note: #ab52fb;
				--noise1-secondary-channel: #2a5555;
				--noise1-primary-channel: #4c7878;
				--noise1-secondary-note: #6e9a9a;
				--noise1-primary-note: #90bcbc;
				--noise2-secondary-channel: #553355;
				--noise2-primary-channel: #775577;
				--noise2-secondary-note: #997799;
				--noise2-primary-note: #bbaa99;
				--noise3-secondary-channel: #2a6622;
				--noise3-primary-channel: #4c8844;
				--noise3-secondary-note: #6eaa66;
				--noise3-primary-note: #90cc88;
				--noise4-secondary-channel: #664400;
				--noise4-primary-channel: #886600;
				--noise4-secondary-note: #aa8800;
				--noise4-primary-note: #cccc00;
				--noise5-secondary-channel: #006633;
				--noise5-primary-channel: #008855;
				--noise5-secondary-note: #00aa77;
				--noise5-primary-note: #00cc99;
				--mod1-secondary-channel: #fe00ff;
				--mod1-primary-channel: #ff72ff;
				--mod1-secondary-note: #ff92ff;
				--mod1-primary-note: #ffb2fb;
				--mod2-secondary-channel: #00fe00;
				--mod2-primary-channel: #8eff8e;
				--mod2-secondary-note: #92ff92;
				--mod2-primary-note: #b2ffb2;
				--mod3-secondary-channel: #feff00;
				--mod3-primary-channel: #fffb8e;
				--mod3-secondary-note: #fffd92;
				--mod3-primary-note: #fffe92;
				--mod4-secondary-channel: #00fffe;
				--mod4-primary-channel: #82fffb;
				--mod4-secondary-note: #92ffff;
				--mod4-primary-note: #b2fffb;
				--disabled-note-primary: #c6c6c6;
				--disabled-note-secondary: #8c8c8c;
				--note-flash: #ffffff;
				--note-flash-secondary: #ffffff77;
				}`,
				"abyssbox classic": `
				:root {		
				--page-margin: #1e0915; 		
				--editor-background: #1e0915; 		
				--playhead: rgba(255, 255, 255, 0.9); 		
				--secondary-text: #ffcedd; 		
				--box-selection-fill: #1e0915; 		
				--loop-accent: #873a51; 		
				--link-accent: #df88ff; 		
				--ui-widget-background: #581b3e; 		
				--ui-widget-focus: #762b4c; 		
				--pitch-background: #381d24; 		
				--tonic: #873a51; 		
				--fifth-note: #75001e; 		
				--white-piano-key: #cca5c7; 		
				--black-piano-key: #402f2f;
				--use-color-formula: true; 		
				--track-editor-bg-pitch: #571c40; 		
				--track-editor-bg-pitch-dim: #290d0d; 		
				--track-editor-bg-noise: #571131; 		
				--track-editor-bg-noise-dim: #330a28; 		
				--track-editor-bg-mod: #54083c; 		
				--track-editor-bg-mod-dim: #360426; 		
				--multiplicative-mod-slider: #9f6082; 		
				--overwriting-mod-slider: #9e3470; 		
				--indicator-primary: #b3498f; 		
				--indicator-secondary: #541d40; 		
				--select2-opt-group: #4f191e; 		
				--input-box-outline: #18041a; 		
				--mute-button-normal: #dd5d94;	 		
				--mute-button-mod: #ba364c; 		
				--mod-label-primary: #541625; 		
				--mod-label-secondary-text: rgb(120, 87, 86); 
				--mod-label-primary-text: gray; 
			
				--pitch-secondary-channel-hue: -80; 		
				--pitch-secondary-channel-hue-scale 0; 		
				--pitch-secondary-channel-sat: 43; 		
				--pitch-secondary-channel-sat-scale: 0.1; 		
				--pitch-secondary-channel-lum: 40; 		
				--pitch-secondary-channel-lum-scale: 0.05; 
			
				--pitch-primary-channel-hue: -53; 		
				--pitch-primary-channel-hue-scale: 6.1; 		
				--pitch-primary-channel-sat: 75; 		
				--pitch-primary-channel-sat-scale: 0.1; 		
				--pitch-primary-channel-lum: 67.5; 		
				--pitch-primary-channel-lum-scale: 0.05; 	
		
				--pitch-secondary-note-hue: -34; 		
				--pitch-secondary-note-hue-scale: 6.1; 		
				--pitch-secondary-note-sat: 93.9; 		
				--pitch-secondary-note-sat-scale: 0.1; 		
				--pitch-secondary-note-lum: 25; 		
				--pitch-secondary-note-lum-scale: 0.05; 
			
				--pitch-primary-note-hue: -53; 		
				--pitch-primary-note-hue-scale: 6.1; 		
				--pitch-primary-note-sat: 100; 		
				--pitch-primary-note-sat-scale: 0.05; 		
				--pitch-primary-note-lum: 85.6; 		
				--pitch-primary-note-lum-scale: 0.025; 
			
				--noise-secondary-channel-hue: 0; 		
				--noise-secondary-channel-hue-scale: 2; 		
				--noise-secondary-channel-sat: 65; 		
				--noise-secondary-channel-sat-scale: 0; 		
				--noise-secondary-channel-lum: 42; 		
				--noise-secondary-channel-lum-scale: 0; 
			
				--noise-primary-channel-hue: 0; 		
				--noise-primary-channel-hue-scale: 1; 		
				--noise-primary-channel-sat: 100; 		
				--noise-primary-channel-sat-scale: 1; 		
				--noise-primary-channel-lum: 63.5; 		
				--noise-primary-channel-lum-scale: 0; 
			
				--noise-secondary-note-hue: 24; 		
				--noise-secondary-note-hue-scale: 2; 		
				--noise-secondary-note-sat: 100; 		
				--noise-secondary-note-sat-scale: 0; 		
				--noise-secondary-note-lum: 35; 		
				--noise-secondary-note-lum-scale: 0; 	
		
				--noise-primary-note-hue: 24; 		
				--noise-primary-note-hue-scale: 2; 		
				--noise-primary-note-sat: 100; 		
				--noise-primary-note-sat-scale: 1; 		
				--noise-primary-note-lum: 60; 		
				--noise-primary-note-lum-scale: 1; 	
		
				--mod-secondary-channel-hue: 55; 		
				--mod-secondary-channel-hue-scale: 1.5; 		
				--mod-secondary-channel-sat: 100; 		
				--mod-secondary-channel-sat-scale: 0; 		
				--mod-secondary-channel-lum: 20; 		
				--mod-secondary-channel-lum-scale: 0; 
			
				--mod-primary-channel-hue: 55; 		
				--mod-primary-channel-hue-scale: 1.5; 		
				--mod-primary-channel-sat: 96; 		
				--mod-primary-channel-sat-scale: 0; 		
				--mod-primary-channel-lum: 50; 		
				--mod-primary-channel-lum-scale: 0; 
			
				--mod-secondary-note-hue: 55; 		
				--mod-secondary-note-hue-scale: 1.5; 		
				--mod-secondary-note-sat: 92; 		
				--mod-secondary-note-sat-scale: 0; 		
				--mod-secondary-note-lum: 45; 		
				--mod-secondary-note-lum-scale: 0; 
			
				--mod-primary-note-hue: 55; 		
				--mod-primary-note-hue-scale: 1.5; 		
				--mod-primary-note-sat: 96; 		
				--mod-primary-note-sat-scale: 0; 		
				--mod-primary-note-lum: 85; 		
				--mod-primary-note-lum-scale: 0; 	
	
				--note-flash: #ffffff;
				--note-flash-secondary: #ffffff77;
				
				--oscilloscope-line-R: var(--ui-widget-background);
				--oscilloscope-line-L: var(--secondary-text);
				--text-spacing-icon: > ;
				--scrollbar-color: #bf2c5d;
				
				--file-page-symbol: url("theme_resources/icon-file.png");
				--edit-pencil-symbol: url("theme_resources/icon-edit.png");
				--preferences-gear-symbol: url("theme_resources/icon-preferences.png");
				--instrument-copy-symbol: url("theme_resources/icon-copy.png");
				--instrument-paste-symbol: url("theme_resources/icon-paste.png");
				--play-symbol: url("theme_resources/icon-play.png");
				--pause-symbol: url("theme_resources/icon-pause.png");
				--record-symbol: url("theme_resources/icon-record.png");
				--stop-symbol: url("theme_resources/icon-stop.png");
				--prev-bar-symbol: url("theme_resources/icon-prev.png");
				--next-bar-symbol: url("theme_resources/icon-next.png");
				--muted-symbol: url("theme_resources/icon-speakerMuted.png");
				--unmuted-symbol: url("theme_resources/icon-speaker.png");
				--volume-symbol: url("theme_resources/icon-speaker.png");
				--zoom-in-symbol: url("theme_resources/icon-zoomIn.png");
				--zoom-out-symbol: url("theme_resources/icon-zoomOut.png");
				--export-symbol: url("theme_resources/icon-export.png");
					}
			* {
			cursor: url("theme_resources/abyssbox_cursor.png"), auto;
			}
			#Hotdog {
				display: inline !important;
				content: url("theme_resources/hotdog.png") !important;
			}
			
				@font-face {
			   font-family: "AbyssType";
			   src:
				url("theme_resources/abysstype.otf") format("opentype") tech(color-COLRv1),
				}
	
				/* sets background image */
				body {
				background-image: url("theme_resources/stripesbg.gif") !important;
				background-position: center;
				background-repeat: repeat;
	
				image-rendering: -moz-crisp-edges !important;         /* Firefox */
				image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
				image-rendering: -o-crisp-edges !important;            /* Opera */
				image-rendering: pixelated !important;                 /* Future browsers */
				image-rendering: optimizeSpeed !important;             /* IE */
					}
	
				#text-content {
						border-image-source: url("theme_resources/abyssbox_border.png");
						border-image-slice: 4 fill; 
					   border-image-width: 8px; 
					border-image-repeat: stretch; 
						padding: 12px; 
	
						image-rendering: -moz-crisp-edges !important;         /* Firefox */
						image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
						image-rendering: -o-crisp-edges !important;            /* Opera */
						image-rendering: pixelated !important;                 /* Future browsers */
						image-rendering: optimizeSpeed !important;             /* IE */
					}
				#beepboxEditorContainer {
						border-image-source: url("theme_resources/abyssbox_border.png");
						border-image-slice: 4 fill; 
					   	border-image-width: 8px; 
						border-image-repeat: stretch;
						padding: 12px;
	
						image-rendering: -moz-crisp-edges !important;         /* Firefox */
						image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
						image-rendering: -o-crisp-edges !important;            /* Opera */
						image-rendering: pixelated !important;                 /* Future browsers */
						image-rendering: optimizeSpeed !important;             /* IE */ 
					}
				.beepboxEditor button,
				button.playButton,
				button.pauseButton, 
				button.recordButton, 
				button.stopButton,
				button.nextBarButton, 
				button.prevBarButton, 
				button.copyButton, 
				button.pasteButton, 
				button.exportInstrumentButton, 
				button.importInstrumentButton, 
				.beepboxEditor select, 
				.beepboxEditor .select2-selection__rendered {
						border-image-source: url("theme_resources/abyssbox_border.png") !important;
						border-image-slice: 4 fill !important; 
					   border-image-width: 4px !important; 
					border-image-repeat: stretch !important;
						padding: 4px !important; 
	
						image-rendering: -moz-crisp-edges !important;         /* Firefox */
						image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
						image-rendering: -o-crisp-edges !important;            /* Opera */
						image-rendering: pixelated !important;                 /* Future browsers */
						image-rendering: optimizeSpeed !important;             /* IE */
	
						cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
					}
	
				div.selectRow button:not(.copyButton,.pasteButton,.exportInstrumentButton,.importInstrumentButton) {
					--ui-widget-background: #1e0915 !important;
					border-image-source:none !important;
				}
	
					select.trackSelectBox {
						border-image: none !important;
					}
					
				@font-face {
			   font-family: "AbyssType_small";
			   src:
				url("theme_resources/abysstype_small.otf") format("opentype") tech(color-COLRv1),
				}
	
				html {
					font-family: 'AbyssType';
				}
	
				div.channelBoxLabel {
					font-family: 'AbyssType_small' !important;
				}
	
				.beepboxEditor input[type="range"]::-webkit-slider-thumb
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-webkit-slider-runnable-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]:focus::-webkit-slider-runnable-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-ms-thumb
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-ms-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]:focus::-ms-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-moz-range-thumb
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-moz-range-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]:focus::-moz-range-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="text"],
				.beepboxEditor input[type="number"]
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="checkbox"]
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="checkbox"]:checked
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="checkbox"]:checked:after
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
	
				div.selectRow span {
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
	
				`,
		"abyssbox light": `
			:root { 		
				--page-margin: #e0adbc; 		
				--editor-background: #e0adbc; 		
				--playhead: rgba(255, 255, 255, 0.9); 		
				--primary-text: #6110d9; 		
				--secondary-text: #cc1338;	
				--inverted-text:  #e8bcc9;	 		
				--box-selection-fill: #bf2c5d; 		
				--loop-accent: #8c346a; 		
				--link-accent: #8c346a; 		
				--ui-widget-background: #f5e9f0;		
				--ui-widget-focus: #f5e9f0; 		
				--pitch-background: #eddadf; 		
				--tonic: #f5f0f1; 		
				--fifth-note: #ffb5c9; 		
				--white-piano-key: #cca5c7; 		
				--black-piano-key: #402f2f;
				--use-color-formula: true; 		
				--track-editor-bg-pitch: #edbecc; 		
				--track-editor-bg-pitch-dim: #e0adbc; 		
				--track-editor-bg-noise: #edbecc; 		
				--track-editor-bg-noise-dim: #e0adbc; 		
				--track-editor-bg-mod: #edbecc; 		
				--track-editor-bg-mod-dim: #e0adbc; 		
				--multiplicative-mod-slider: #9f6082; 		
				--overwriting-mod-slider: #9e3470; 		
				--indicator-primary: #b3498f; 		
				--indicator-secondary: #541d40; 		
				--select2-opt-group: #4f191e; 		
				--input-box-outline: #18041a; 		
				--mute-button-normal: #dd5d94;	 		
				--mute-button-mod: #ba364c; 		
				--mod-label-primary: #541625; 		
				--mod-label-secondary-text: rgb(120, 87, 86); 
				--mod-label-primary-text: gray;
				--mod-title: #cc1338; 
			
				--pitch-secondary-channel-hue: -80; 		
				--pitch-secondary-channel-hue-scale 0; 		
				--pitch-secondary-channel-sat: 255; 		
				--pitch-secondary-channel-sat-scale: 0.1; 		
				--pitch-secondary-channel-lum: 30; 		
				--pitch-secondary-channel-lum-scale: 0.05; 
			
				--pitch-primary-channel-hue: -53; 		
				--pitch-primary-channel-hue-scale: 6.1; 		
				--pitch-primary-channel-sat: 255; 		
				--pitch-primary-channel-sat-scale: 0.1; 		
				--pitch-primary-channel-lum: 60; 		
				--pitch-primary-channel-lum-scale: 0.05; 	
		
				--pitch-secondary-note-hue: -34; 		
				--pitch-secondary-note-hue-scale: 6.1; 		
				--pitch-secondary-note-sat: 255; 		
				--pitch-secondary-note-sat-scale: 0.1; 		
				--pitch-secondary-note-lum: 30; 		
				--pitch-secondary-note-lum-scale: 0.05; 
			
				--pitch-primary-note-hue: -53; 		
				--pitch-primary-note-hue-scale: 6.1; 		
				--pitch-primary-note-sat: 255; 		
				--pitch-primary-note-sat-scale: 0.05; 		
				--pitch-primary-note-lum: 60; 		
				--pitch-primary-note-lum-scale: 0.025; 
			
				--noise-secondary-channel-hue: 0; 		
				--noise-secondary-channel-hue-scale: 2; 		
				--noise-secondary-channel-sat: 255; 		
				--noise-secondary-channel-sat-scale: 0; 		
				--noise-secondary-channel-lum: 30; 		
				--noise-secondary-channel-lum-scale: 0; 
			
				--noise-primary-channel-hue: 0; 		
				--noise-primary-channel-hue-scale: 1; 		
				--noise-primary-channel-sat: 255; 		
				--noise-primary-channel-sat-scale: 1; 		
				--noise-primary-channel-lum: 60; 		
				--noise-primary-channel-lum-scale: 0; 
			
				--noise-secondary-note-hue: 24; 		
				--noise-secondary-note-hue-scale: 2; 		
				--noise-secondary-note-sat: 255; 		
				--noise-secondary-note-sat-scale: 0; 		
				--noise-secondary-note-lum: 30; 		
				--noise-secondary-note-lum-scale: 0; 	
		
				--noise-primary-note-hue: 24; 		
				--noise-primary-note-hue-scale: 2; 		
				--noise-primary-note-sat: 255; 		
				--noise-primary-note-sat-scale: 1; 		
				--noise-primary-note-lum: 60; 		
				--noise-primary-note-lum-scale: 1; 	
		
				--mod-secondary-channel-hue: 55; 		
				--mod-secondary-channel-hue-scale: 1.5; 		
				--mod-secondary-channel-sat: 255; 		
				--mod-secondary-channel-sat-scale: 0; 		
				--mod-secondary-channel-lum: 30; 		
				--mod-secondary-channel-lum-scale: 0; 
			
				--mod-primary-channel-hue: 55; 		
				--mod-primary-channel-hue-scale: 1.5; 		
				--mod-primary-channel-sat: 255; 		
				--mod-primary-channel-sat-scale: 0; 		
				--mod-primary-channel-lum: 60; 		
				--mod-primary-channel-lum-scale: 0; 
			
				--mod-secondary-note-hue: 55; 		
				--mod-secondary-note-hue-scale: 1.5; 		
				--mod-secondary-note-sat: 255; 		
				--mod-secondary-note-sat-scale: 0; 		
				--mod-secondary-note-lum: 30; 		
				--mod-secondary-note-lum-scale: 0; 
			
				--mod-primary-note-hue: 55; 		
				--mod-primary-note-hue-scale: 1.5; 		
				--mod-primary-note-sat: 255; 		
				--mod-primary-note-sat-scale: 0; 		
				--mod-primary-note-lum: 60; 		
				--mod-primary-note-lum-scale: 0; 

				--note-flash: #ffffff;
				--note-flash-secondary: #ffffff77;

				--oscilloscope-line-R: var(--ui-widget-background);
				--oscilloscope-line-L: var(--secondary-text);
				--text-spacing-icon: > ;
				--scrollbar-color: #bf2c5d;

				--file-page-symbol: url("theme_resources/icon-file.png");
				--edit-pencil-symbol: url("theme_resources/icon-edit.png");
				--preferences-gear-symbol: url("theme_resources/icon-preferences.png");
				--instrument-copy-symbol: url("theme_resources/icon-copy.png");
				--instrument-paste-symbol: url("theme_resources/icon-paste.png");
				--play-symbol: url("theme_resources/icon-play.png");
				--pause-symbol: url("theme_resources/icon-pause.png");
				--record-symbol: url("theme_resources/icon-record.png");
				--stop-symbol: url("theme_resources/icon-stop.png");
				--prev-bar-symbol: url("theme_resources/icon-prev.png");
				--next-bar-symbol: url("theme_resources/icon-next.png");
				--muted-symbol: url("theme_resources/icon-speakerMuted.png");
				--unmuted-symbol: url("theme_resources/icon-speaker.png");
				--volume-symbol: url("theme_resources/icon-speaker.png");
				--zoom-in-symbol: url("theme_resources/icon-zoomIn.png");
				--zoom-out-symbol: url("theme_resources/icon-zoomOut.png");
				--export-symbol: url("theme_resources/icon-export.png");
			}
					/* sets background image */
					body {
					background-image: url("theme_resources/stripesbg_light.gif") !important;
					background-position: center;
					background-repeat: repeat;
		
					image-rendering: -moz-crisp-edges !important;         /* Firefox */
					image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
					image-rendering: -o-crisp-edges !important;            /* Opera */
					image-rendering: pixelated !important;                 /* Future browsers */
					image-rendering: optimizeSpeed !important;             /* IE */
						}		
				#text-content {
						border-image-source: url("theme_resources/abyssbox_border_light.png");
						border-image-slice: 4 fill; 
					   border-image-width: 8px; 
					border-image-repeat: stretch; 
						padding: 12px; 
	
						image-rendering: -moz-crisp-edges !important;         /* Firefox */
						image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
						image-rendering: -o-crisp-edges !important;            /* Opera */
						image-rendering: pixelated !important;                 /* Future browsers */
						image-rendering: optimizeSpeed !important;             /* IE */
					}
				#beepboxEditorContainer {
						border-image-source: url("theme_resources/abyssbox_border_light.png");
						border-image-slice: 4 fill; 
					   border-image-width: 8px; 
					border-image-repeat: stretch;
						padding: 12px;
	
						image-rendering: -moz-crisp-edges !important;         /* Firefox */
						image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
						image-rendering: -o-crisp-edges !important;            /* Opera */
						image-rendering: pixelated !important;                 /* Future browsers */
						image-rendering: optimizeSpeed !important;             /* IE */ 
					}
					.beepboxEditor button,
					button.playButton,
					button.pauseButton, 
					button.recordButton, 
					button.stopButton,
					button.nextBarButton, 
					button.prevBarButton, 
					button.copyButton, 
					button.pasteButton, 
					button.exportInstrumentButton, 
					button.importInstrumentButton, 
					.beepboxEditor select, 
					.beepboxEditor .select2-selection__rendered {
							border-image-source: url("theme_resources/abyssbox_border_light.png") !important;
							border-image-slice: 4 fill !important; 
						   border-image-width: 4px !important; 
						border-image-repeat: stretch !important;
							padding: 4px !important; 
		
							image-rendering: -moz-crisp-edges !important;         /* Firefox */
							image-rendering: -webkit-optimize-contrast !important; /* Webkit (Chrome/Safari) */
							image-rendering: -o-crisp-edges !important;            /* Opera */
							image-rendering: pixelated !important;                 /* Future browsers */
							image-rendering: optimizeSpeed !important;             /* IE */
		
							cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
						}
		
					div.selectRow button:not(.copyButton,.pasteButton,.exportInstrumentButton,.importInstrumentButton) {
						--ui-widget-background: var(--editor-background) !important;
						border-image-source:none !important;
					}
	
					select.trackSelectBox {
						border-image: none !important;
					}
	
			/* sets cursor */ 
			* {
			cursor: url("theme_resources/abyssbox_cursor.png"), auto !important;
			}
			#Hotdog {
				display: inline !important;
				content: url("theme_resources/hotdog.png") !important;
			}
				@font-face {
			   font-family: "AbyssType";
			   src:
				url("theme_resources/abysstype.otf") format("opentype") tech(color-COLRv1),
				}
	
				@font-face {
			   font-family: "AbyssType_small";
			   src:
				url("theme_resources/abysstype_small.otf") format("opentype") tech(color-COLRv1),
				}
	
				html {
				font-family: 'AbyssType';
				}
				div.channelBoxLabel {
					font-family: 'AbyssType_small' !important;
				}
	
				.beepboxEditor input[type="range"]::-webkit-slider-thumb
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-webkit-slider-runnable-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]:focus::-webkit-slider-runnable-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-ms-thumb
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-ms-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]:focus::-ms-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-moz-range-thumb
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]::-moz-range-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="range"]:focus::-moz-range-track
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="text"],
				.beepboxEditor input[type="number"]
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="checkbox"]
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="checkbox"]:checked
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
				 
				.beepboxEditor input[type="checkbox"]:checked:after
				{
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
	
				div.selectRow span {
					cursor: url("theme_resources/abyssbox_cursor_hand.png"), pointer !important;
				}
	
				`,
	"slarmoosbox": `
		:root {
			--page-margin: #14051a;
			--editor-background: #14051a;
			--playhead: rgba(255, 255, 255, 0.9);
			--primary-text: #71eee5;
			--secondary-text: #3abbb2;
			--inverted-text: #13695e;
			--box-selection-fill: #36c71c;
			--loop-accent: #36c71c;
			--link-accent: white;
			--ui-widget-background: #183d05;
			--ui-widget-focus: #247d0d;
			--pitch-background: #2e0e51;
			--tonic: #247d0d;
			--fifth-note: #3abbb2;
			--white-piano-key: #ffffff;
			--black-piano-key: #061705;
			--white-piano-key-text: #061705;
			--use-color-formula: true;
			--track-editor-bg-pitch: #09382b;
			--track-editor-bg-pitch-dim: #14051a;
			--track-editor-bg-noise: #40400b;
			--track-editor-bg-noise-dim: #14051a;
			--track-editor-bg-mod: #0a2c08;
			--track-editor-bg-mod-dim: #14051a;
			--multiplicative-mod-slider: #3abb22;
			--overwriting-mod-slider: #71eee5;
			--indicator-primary: #a773e5;
			--indicator-secondary: #4c1c89;
			--select2-opt-group: #183d05;
			--input-box-outline: #18040a;
			--mute-button-normal: #36c71c;
			--mute-button-mod: #a773e5;
			--mod-label-primary: #a773e5;
			--mod-label-secondary-text: #6b29bf;
			--mod-label-primary-text: #14051a;
			--mod-title: #247d1d;
			--pitch-secondary-channel-hue: 100;
			--pitch-secondary-channel-hue-scale: 6.1;
			--pitch-secondary-channel-sat: 100.0;
			--pitch-secondary-channel-sat-scale: 0.15;
			--pitch-secondary-channel-lum: 60.0;
			--pitch-secondary-channel-lum-scale: 0.05;
			--pitch-primary-channel-hue: 100;
			--pitch-primary-channel-hue-scale: 6.1;
			--pitch-primary-channel-sat: 100;
			--pitch-primary-channel-sat-scale: 0.15;
			--pitch-primary-channel-lum: 75.0;
			--pitch-primary-channel-lum-scale: 0.05;
			--pitch-secondary-note-hue: 100;
			--pitch-secondary-note-hue-scale: 6.1;
			--pitch-secondary-note-sat: 95.0;
			--pitch-secondary-note-sat-scale: 0.15;
			--pitch-secondary-note-lum: 40;
			--pitch-secondary-note-lum-scale: 0.05;
			--pitch-primary-note-hue: 100;
			--pitch-primary-note-hue-scale: 6.1;
			--pitch-primary-note-sat: 100;
			--pitch-primary-note-sat-scale: 0.15;
			--pitch-primary-note-lum: 85.6;
			--pitch-primary-note-lum-scale: 0.025;
			--noise-secondary-channel-hue: 65;
			--noise-secondary-channel-hue-scale: 2;
			--noise-secondary-channel-sat: 55;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 42;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 65;
			--noise-primary-channel-hue-scale: 2;
			--noise-primary-channel-sat: 66;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 63.5;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 65;
			--noise-secondary-note-hue-scale: 2;
			--noise-secondary-note-sat: 66;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 55;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 65;
			--noise-primary-note-hue-scale: 2;
			--noise-primary-note-sat: 70;
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
			--oscilloscope-line-R: white;
			--oscilloscope-line-L: var(--secondary-text);
		}`,
	"axobox": `
		:root {
			--page-margin: #000e1c;
			--editor-background: #000e1c;
			--playhead: rgba(255, 255, 255, 0.9);
			--secondary-text: #84859a;
			--box-selection-fill: #044b94;
			--ui-widget-background: #2a3045;
			--ui-widget-focus: #4f4a68;
			--pitch-background: #3c5773;
			--tonic: #453e80;
			--fifth-note: #545498;
			--white-piano-key: #eee;
			--black-piano-key: #666;
			--use-color-formula: true;
			--track-editor-bg-pitch: #393e4f;
			--track-editor-bg-pitch-dim: #1c1d28;
			--track-editor-bg-noise: #3d3535;
			--track-editor-bg-noise-dim: #161313;
			--track-editor-bg-mod: #283560;
			--track-editor-bg-mod-dim: #0a101f;
			--multiplicative-mod-slider: #606c9f;
			--overwriting-mod-slider: #6850b5;
			--indicator-primary: #1E90FF;
			--indicator-secondary: #1560BD;
			--select2-opt-group: #3f3951;
			--input-box-outline: #222;
			--mute-button-normal: #dda85d;
			--mute-button-mod: #886eae;
			--mod-label-primary: #282840;
			--mod-label-secondary-text: rgb(87, 86, 120);
			--mod-label-primary-text: white;
			--pitch-secondary-channel-hue: 210;
			--pitch-secondary-channel-hue-scale: 6.5;
			--pitch-secondary-channel-sat: 100;
			--pitch-secondary-channel-sat-scale: 0.1;
			--pitch-secondary-channel-lum: 50;
			--pitch-secondary-channel-lum-scale: 0.05;
			--pitch-primary-channel-hue: 205;
			--pitch-primary-channel-hue-scale: 6.5;
			--pitch-primary-channel-sat: 39;
			--pitch-primary-channel-sat-scale: 0.1;
			--pitch-primary-channel-lum: 60;
			--pitch-primary-channel-lum-scale: 0.05;
			--pitch-secondary-note-hue: 225;
			--pitch-secondary-note-hue-scale: 6.5;
			--pitch-secondary-note-sat: 55;
			--pitch-secondary-note-sat-scale: 0.1;
			--pitch-secondary-note-lum: 37;
			--pitch-secondary-note-lum-scale: 0.05;
			--pitch-primary-note-hue: 204;
			--pitch-primary-note-hue-scale: 6.5;
			--pitch-primary-note-sat: 100;
			--pitch-primary-note-sat-scale: 0.05;
			--pitch-primary-note-lum: 37;
			--pitch-primary-note-lum-scale: 0.025;
			--noise-secondary-channel-hue: 138;
			--noise-secondary-channel-hue-scale: 2;
			--noise-secondary-channel-sat: 97;
			--noise-secondary-channel-sat-scale: 0;
			--noise-secondary-channel-lum: 38;
			--noise-secondary-channel-lum-scale: 0;
			--noise-primary-channel-hue: 74;
			--noise-primary-channel-hue-scale: 2;
			--noise-primary-channel-sat: 100;
			--noise-primary-channel-sat-scale: 0;
			--noise-primary-channel-lum: 36;
			--noise-primary-channel-lum-scale: 0;
			--noise-secondary-note-hue: 175;
			--noise-secondary-note-hue-scale: 2;
			--noise-secondary-note-sat: 98;
			--noise-secondary-note-sat-scale: 0;
			--noise-secondary-note-lum: 24;
			--noise-secondary-note-lum-scale: 0;
			--noise-primary-note-hue: 149;
			--noise-primary-note-hue-scale: 2;
			--noise-primary-note-sat: 100;
			--noise-primary-note-sat-scale: 0;
			--noise-primary-note-lum: 32;
			--noise-primary-note-lum-scale: 0;
			--mod-secondary-channel-hue: 44;
			--mod-secondary-channel-hue-scale: 1.5;
			--mod-secondary-channel-sat: 100;
			--mod-secondary-channel-sat-scale: 0;
			--mod-secondary-channel-lum: 50;
			--mod-secondary-channel-lum-scale: 0;
			--mod-primary-channel-hue: 45;
			--mod-primary-channel-hue-scale: 1.5;
			--mod-primary-channel-sat: 90;
			--mod-primary-channel-sat-scale: 0;
			--mod-primary-channel-lum: 57;
			--mod-primary-channel-lum-scale: 0;
			--mod-secondary-note-hue: 33;
			--mod-secondary-note-hue-scale: 1.5;
			--mod-secondary-note-sat: 100;
			--mod-secondary-note-sat-scale: 0;
			--mod-secondary-note-lum: 47;
			--mod-secondary-note-lum-scale: 0;
			--mod-primary-note-hue: 45;
			--mod-primary-note-hue-scale: 1.5;
			--mod-primary-note-sat: 100;
			--mod-primary-note-sat-scale: 0;
			--mod-primary-note-lum: 60;
			--mod-primary-note-lum-scale: 0;
			--disabled-note-primary:    #9187d1;
			--disabled-note-secondary:  #6a67ac;
		}`,
	"lemmbox dark": `
		:root {
			--page-margin: #020009;
			--editor-background: #020009;
			--secondary-text: white;
			--text-selection: #c2a855;
			--loop-accent: #fff570;
			--link-accent: #fff570;
			--ui-widget-background: #191721;
			--ui-widget-focus: #2d293b;
			--pitch-background: #44444A;
			--tonic: #c2a855;
			--white-piano-key-text: #131200;
			--black-piano-key-text: #fff;
			--pitch-channel-limit: 10;
			--indicator-primary: #6a38ff;
			--input-box-outline: #403b4f;
			--mute-button-mod: #8066cc;
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
		}`,
	"azur lane":`
		:root {
			--page-margin: #19337e;
			--editor-background: #000333cf;
			--playhead: rgba(255, 255, 255, 0.9);
			--primary-text: #9af9ff;
			--secondary-text: #4072dd;
			--box-selection-fill: #044b94;
			--loop-accent: #950d0d;
			--link-accent: #0072ff;
			--ui-widget-background: #255bb3;
			--ui-widget-focus: #757575;
			--pitch-background: #20468b73;
			--tonic: #c9c9c9;
			--fifth-note: #731d1d;
			--white-piano-key: #eee;
			--black-piano-key: #000;
			--track-editor-bg-pitch: #535a73;
			--track-editor-bg-pitch-dim: #353643;
			--track-editor-bg-noise: #770000;
			--track-editor-bg-noise-dim: #430000;
			--track-editor-bg-mod: #5d1d06;
			--track-editor-bg-mod-dim: #270000;
			--multiplicative-mod-slider: #bb0000;
			--overwriting-mod-slider: #ad0000;
			--indicator-primary: #9c64f7;
			--indicator-secondary: #393e4f;
			--select2-opt-group: #5d576f;
			--input-box-outline: #002957;
			--mute-button-normal: #ffffff;
			--mute-button-mod: #4f4f4f;
			--mod-label-primary: #531313;
			--pitch1-secondary-channel: #80858d;
		  --pitch1-primary-channel: #f2f7ff;
		  --pitch1-secondary-note: #80858d;
		  --pitch1-primary-note: #f2f7ff;
		  --pitch2-secondary-channel: #7392ad;
		  --pitch2-primary-channel: #a8d6ff;
		  --pitch2-secondary-note: #7392ad;
		  --pitch2-primary-note: #a8d6ff;
		  --pitch3-secondary-channel: #4b7eaa;
		  --pitch3-primary-channel: #71bdff;
		  --pitch3-secondary-note: #4b7eaa;
		  --pitch3-primary-note: #71bdff;
		  --pitch4-secondary-channel: #3594b1;
		  --pitch4-primary-channel: #48d4ff;
		  --pitch4-secondary-note: #3594b1;
		  --pitch4-primary-note: #48d4ff;
		  --pitch5-secondary-channel: #1b98b1;
		  --pitch5-primary-channel: #30f1ff;
		  --pitch5-secondary-note: #1b98b1;
		  --pitch5-primary-note: #30f1ff;
		  --pitch6-secondary-channel: #9e0000;
		  --pitch6-primary-channel: #db0000;
		  --pitch6-secondary-note: #9e0000;
		  --pitch6-primary-note: #db0000;
		  --pitch7-secondary-channel: #7c1717;
		  --pitch7-primary-channel: #9e0000;
		  --pitch7-secondary-note: #7c1717;
		  --pitch7-primary-note: #9e0000;
		  --pitch8-secondary-channel: #5c1f1f;
		  --pitch8-primary-channel: #7c1717;
		  --pitch8-secondary-note: #5c1f1f;
		  --pitch8-primary-note: #7c1717;
		  --pitch9-secondary-channel: #3e2020;
		  --pitch9-primary-channel: #5c1f1f;
		  --pitch9-secondary-note: #3e2020;
		  --pitch9-primary-note: #5c1f1f;
		  --pitch10-secondary-channel: #2f1c1c;
		  --pitch10-primary-channel: #5c1f1f;
		  --pitch10-secondary-note: #2f1c1c;
		  --pitch10-primary-note: #5c1f1f;
		  --noise1-secondary-channel: #828282;
		  --noise1-primary-channel: #cacaca;
		  --noise1-secondary-note: #828282;
		  --noise1-primary-note: #cacaca;
		  --noise2-secondary-channel: #2f8baf;
		  --noise2-primary-channel: #3de2ff;
		  --noise2-secondary-note: #2f8baf;
		  --noise2-primary-note: #3de2ff;
		  --noise3-secondary-channel: #6f50b1;
		  --noise3-primary-channel: #8567ff;
		  --noise3-secondary-note: #6f50b1;
		  --noise3-primary-note: #8567ff;
		  --noise4-secondary-channel: #d38900;
		  --noise4-primary-channel: #ffb500;
		  --noise4-secondary-note: #d38900;
		  --noise4-primary-note: #ffb500;
		  --noise5-secondary-channel: #af0008;
		  --noise5-primary-channel: #00d70e;
		  --noise5-secondary-note: #29b700;
		  --noise5-primary-note: #00f7ff;
		  --mod1-secondary-channel: #9d5bb9;
		  --mod1-primary-channel: #e16bff;
		  --mod1-secondary-note: #3a3ea4;
		  --mod1-primary-note: #fff;
		  --mod2-secondary-channel: #3a8d58;
		  --mod2-primary-channel: #42ffff;
		  --mod2-secondary-note: #3a8d58;
		  --mod2-primary-note: #42ffff;
		  --mod3-secondary-channel: #af6c00;
		  --mod3-primary-channel: #fa0;
		  --mod3-secondary-note: #0001a2;
		  --mod3-primary-note: #970000;
		  --mod4-secondary-channel: #d3d3d3;
		  --mod4-primary-channel: #759bff;
		  --mod4-secondary-note: #a00000;
		  --mod4-primary-note: #fff;
		  --disabled-note-primary: #3a3a3a;
		  --disabled-note-secondary: #000;
			}
		/* replaces hotdog with an image of the girls using the same scratch sprites from the 404 page*/
		#Hotdog {
			display: inline !important;
			content: url("theme_resources/AzurLaneThemeStarterSquad.png") !important;
			width: 75%;
			height: 75%;
			text-align: center;
			margin-top: 25px;
		}
		/* sets cursor */
		* {
		cursor: url("theme_resources/AzurLaneThemeMouse.png"), auto !important;
		}
		/* sets background image */
		body {
		background-image: url("theme_resources/AzurLaneThemeMemoryTaskBackground.png") !important;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
			}
			/* make editor background transparent */
		#beepboxEditorContainer, .beepboxEditor, #text-content {
		background: #0400257d !important;
		}
			#text-content > section > h1 > font {
		display: none;
		}
		#text-content > section > h1 {
		margin: auto;
		content: url("theme_resources/AzurLaneThemeLogo.png");
		}
		.promptContainerBG::before {
			box-shadow: inset 0 0 2000px rgba(255, 255, 255, .5);
		}
		}`,
	"custom": `${localStorage.getItem("customColors") || `:root {  }`}`,
    };

    public static readonly pageMargin: string = "var(--page-margin, black)";
    public static readonly editorBackground: string = "var(--editor-background, black)";
    public static readonly hoverPreview: string = "var(--hover-preview, white)";
    public static readonly playhead: string = "var(--playhead, white)";
    public static readonly primaryText: string = "var(--primary-text, white)";
    public static readonly secondaryText: string = "var(--secondary-text, #999)";
    public static readonly invertedText: string = "var(--inverted-text, black)";
    public static readonly textSelection: string = "var(--text-selection, rgba(119,68,255,0.99))";
    public static readonly boxSelectionFill: string = "var(--box-selection-fill, rgba(255,255,255,0.2))";
    public static readonly loopAccent: string = "var(--loop-accent, #74f)";
    public static readonly linkAccent: string = "var(--link-accent, #98f)";
    public static readonly uiWidgetBackground: string = "var(--ui-widget-background, #444)";
    public static readonly uiWidgetFocus: string = "var(--ui-widget-focus, #777)";
    public static readonly pitchBackground: string = "var(--pitch-background, #444)";
    public static readonly tonic: string = "var(--tonic, #864)";
    public static readonly fifthNote: string = "var(--fifth-note, #468)";
    public static readonly whitePianoKey: string = "var(--white-piano-key, #bbb)";
    public static readonly blackPianoKey: string = "var(--black-piano-key, #444)";
    public static readonly whitePianoKeyText: string = "var(--white-piano-key-text, #131200)";
    public static readonly blackPianoKeyText: string = "var(--black-piano-key-text, #fff)";
	//public static readonly oscilloscopeLineL: string = "var(--oscilloscope-line-L, var(--primary-text, white))";
	//public static readonly oscilloscopeLineR: string = "var(--oscilloscope-line-R, var(--text-selection, rgba(119,68,255,0.99)))";
	// modTitle can stay uncommented until it's used somwhere that's not index.html
	// public static readonly modTitle: string = "var(--mod-title)";
    public static readonly useColorFormula: string = "var(--use-color-formula, false)";
	// public static readonly pitchLimit: string = "var(--pitch-channel-limit)";
	// public static readonly noiseLimit: string = "var(--noise-channel-limit)";
	// public static readonly modLimit: string = "var(--mod-channel-limit)";
	// public static readonly colorFormulaPitchLimit: string = "var(--formula-pitch-channel-limit)";
	// public static readonly colorFormulaNoiseLimit: string = "var(--formula-noise-channel-limit)";
	// public static readonly colorFormulaModLimit: string = "var(--formula-mod-channel-limit)";
    public static readonly pitchSecondaryChannelHue: string = "var(--pitch-secondary-channel-hue)";
    public static readonly pitchSecondaryChannelHueScale: string = "var(--pitch-secondary-channel-hue-scale)";
    public static readonly pitchSecondaryChannelSat: string = "var(--pitch-secondary-channel-sat)";
    public static readonly pitchSecondaryChannelSatScale: string = "var(--pitch-secondary-channel-sat-scale)";
    public static readonly pitchSecondaryChannelLum: string = "var(--pitch-secondary-channel-lum)";
    public static readonly pitchSecondaryChannelLumScale: string = "var(--pitch-secondary-channel-lum-scale)";
    public static readonly pitchPrimaryChannelHue: string = "var(--pitch-primary-channel-hue)";
    public static readonly pitchPrimaryChannelHueScale: string = "var(--pitch-primary-channel-hue-scale)";
    public static readonly pitchPrimaryChannelSat: string = "var(--pitch-primary-channel-sat)";
    public static readonly pitchPrimaryChannelSatScale: string = "var(--pitch-primary-channel-sat-scale)";
    public static readonly pitchPrimaryChannelLum: string = "var(--pitch-primary-channel-lum)";
    public static readonly pitchPrimaryChannelLumScale: string = "var(--pitch-primary-channel-lum-scale)";
    public static readonly pitchSecondaryNoteHue: string = "var(--pitch-secondary-note-hue)";
    public static readonly pitchSecondaryNoteHueScale: string = "var(--pitch-secondary-note-hue-scale)";
    public static readonly pitchSecondaryNoteSat: string = "var(--pitch-secondary-note-sat)";
    public static readonly pitchSecondaryNoteSatScale: string = "var(--pitch-secondary-note-sat-scale)";
    public static readonly pitchSecondaryNoteLum: string = "var(--pitch-secondary-note-lum)";
    public static readonly pitchSecondaryNoteLumScale: string = "var(--pitch-secondary-note-lum-scale)";
    public static readonly pitchPrimaryNoteHue: string = "var(--pitch-primary-note-hue)";
    public static readonly pitchPrimaryNoteHueScale: string = "var(--pitch-primary-note-hue-scale)";
    public static readonly pitchPrimaryNoteSat: string = "var(--pitch-primary-note-sat)";
    public static readonly pitchPrimaryNoteSatScale: string = "var(--pitch-primary-note-sat-scale)";
    public static readonly pitchPrimaryNoteLum: string = "var(--pitch-primary-note-lum)";
    public static readonly pitchPrimaryNoteLumScale: string = "var(--pitch-primary-note-lum-scale)";
    public static readonly modSecondaryChannelHue: string = "var(--mod-secondary-channel-hue)";
    public static readonly modSecondaryChannelHueScale: string = "var(--mod-secondary-channel-hue-scale)";
    public static readonly modSecondaryChannelSat: string = "var(--mod-secondary-channel-sat)";
    public static readonly modSecondaryChannelSatScale: string = "var(--mod-secondary-channel-sat-scale)";
    public static readonly modSecondaryChannelLum: string = "var(--mod-secondary-channel-lum)";
    public static readonly modSecondaryChannelLumScale: string = "var(--mod-secondary-channel-lum-scale)";
    public static readonly modPrimaryChannelHue: string = "var(--mod-primary-channel-hue)";
    public static readonly modPrimaryChannelHueScale: string = "var(--mod-primary-channel-hue-scale)";
    public static readonly modPrimaryChannelSat: string = "var(--mod-primary-channel-sat)";
    public static readonly modPrimaryChannelSatScale: string = "var(--mod-primary-channel-sat-scale)";
    public static readonly modPrimaryChannelLum: string = "var(--mod-primary-channel-lum)";
    public static readonly modPrimaryChannelLumScale: string = "var(--mod-primary-channel-lum-scale)";
    public static readonly modSecondaryNoteHue: string = "var(--mod-secondary-note-hue)";
    public static readonly modSecondaryNoteHueScale: string = "var(--mod-secondary-note-hue-scale)";
    public static readonly modSecondaryNoteSat: string = "var(--mod-secondary-note-sat)";
    public static readonly modSecondaryNoteSatScale: string = "var(--mod-secondary-note-sat-scale)";
    public static readonly modSecondaryNoteLum: string = "var(--mod-secondary-note-lum)";
    public static readonly modSecondaryNoteLumScale: string = "var(--mod-secondary-note-lum-scale)";
    public static readonly modPrimaryNoteHue: string = "var(--mod-primary-note-hue)";
    public static readonly modPrimaryNoteHueScale: string = "var(--mod-primary-note-hue-scale)";
    public static readonly modPrimaryNoteSat: string = "var(--mod-primary-note-sat)";
    public static readonly modPrimaryNoteSatScale: string = "var(--mod-primary-note-sat-scale)";
    public static readonly modPrimaryNoteLum: string = "var(--mod-primary-note-lum)";
    public static readonly modPrimaryNoteLumScale: string = "var(--mod-primary-note-lum-scale)";
    public static readonly noiseSecondaryChannelHue: string = "var(--noise-secondary-channel-hue)";
    public static readonly noiseSecondaryChannelHueScale: string = "var(--noise-secondary-channel-hue-scale)";
    public static readonly noiseSecondaryChannelSat: string = "var(--noise-secondary-channel-sat)";
    public static readonly noiseSecondaryChannelSatScale: string = "var(--noise-secondary-channel-sat-scale)";
    public static readonly noiseSecondaryChannelLum: string = "var(--noise-secondary-channel-lum)";
    public static readonly noiseSecondaryChannelLumScale: string = "var(--noise-secondary-channel-lum-scale)";
    public static readonly noisePrimaryChannelHue: string = "var(--noise-primary-channel-hue)";
    public static readonly noisePrimaryChannelHueScale: string = "var(--noise-primary-channel-hue-scale)";
    public static readonly noisePrimaryChannelSat: string = "var(--noise-primary-channel-sat)";
    public static readonly noisePrimaryChannelSatScale: string = "var(--noise-primary-channel-sat-scale)";
    public static readonly noisePrimaryChannelLum: string = "var(--noise-primary-channel-lum)";
    public static readonly noisePrimaryChannelLumScale: string = "var(--noise-primary-channel-lum-scale)";
    public static readonly noiseSecondaryNoteHue: string = "var(--noise-secondary-note-hue)";
    public static readonly noiseSecondaryNoteHueScale: string = "var(--noise-secondary-note-hue-scale)";
    public static readonly noiseSecondaryNoteSat: string = "var(--noise-secondary-note-sat)";
    public static readonly noiseSecondaryNoteSatScale: string = "var(--noise-secondary-note-sat-scale)";
    public static readonly noiseSecondaryNoteLum: string = "var(--noise-secondary-note-lum)";
    public static readonly noiseSecondaryNoteLumScale: string = "var(--noise-secondary-note-lum-scale)";
    public static readonly noisePrimaryNoteHue: string = "var(--noise-primary-note-hue)";
    public static readonly noisePrimaryNoteHueScale: string = "var(--noise-primary-note-hue-scale)";
    public static readonly noisePrimaryNoteSat: string = "var(--noise-primary-note-sat)";
    public static readonly noisePrimaryNoteSatScale: string = "var(--noise-primary-note-sat-scale)";
    public static readonly noisePrimaryNoteLum: string = "var(--noise-primary-note-lum)";
    public static readonly noisePrimaryNoteLumScale: string = "var(--noise-primary-note-lum-scale)";
    public static readonly trackEditorBgPitch: string = "var(--track-editor-bg-pitch, #444)";
    public static readonly trackEditorBgPitchDim: string = "var(--track-editor-bg-pitch-dim, #333)";
    public static readonly trackEditorBgNoise: string = "var(--track-editor-bg-noise, #444)";
    public static readonly trackEditorBgNoiseDim: string = "var(--track-editor-bg-noise-dim, #333)";
    public static readonly trackEditorBgMod: string = "var(--track-editor-bg-mod, #234)";
    public static readonly trackEditorBgModDim: string = "var(--track-editor-bg-mod-dim, #123)";
    public static readonly multiplicativeModSlider: string = "var(--multiplicative-mod-slider, #456;)";
    public static readonly overwritingModSlider: string = "var(--overwriting-mod-slider, #654)";
    public static readonly indicatorPrimary: string = "var(--indicator-primary, #74f)";
    public static readonly indicatorSecondary: string = "var(--indicator-secondary, #444)";
    public static readonly select2OptGroup: string = "var(--select2-opt-group, #585858)";
    public static readonly inputBoxOutline: string = "var(--input-box-outline, #333)";
    public static readonly muteButtonNormal: string = "var(--mute-button-normal, #ffa033)";
    public static readonly muteButtonMod: string = "var(--mute-button-mod, #9a6bff)";
    public static readonly modLabelPrimary: string = "var(--mod-label-primary, #999)";
    public static readonly modLabelSecondaryText: string = "var(--mod-label-secondary-text, #333)";
    public static readonly modLabelPrimaryText: string = "var(--mod-label-primary-text, black)";
    public static readonly disabledNotePrimary: string = "var(--disabled-note-primary, #999)";
    public static readonly disabledNoteSecondary: string = "var(--disabled-note-secondary, #666)";

	public static c_pitchSecondaryChannelHue: number = 0;
	public static c_pitchSecondaryChannelHueScale: number = 0;
	public static c_pitchSecondaryChannelSat: number = 0;
	public static c_pitchSecondaryChannelSatScale: number = 0;
	public static c_pitchSecondaryChannelLum: number = 0;
	public static c_pitchSecondaryChannelLumScale: number = 0;
	public static c_pitchPrimaryChannelHue: number = 0;
	public static c_pitchPrimaryChannelHueScale: number = 0;
	public static c_pitchPrimaryChannelSat: number = 0;
	public static c_pitchPrimaryChannelSatScale: number = 0;
	public static c_pitchPrimaryChannelLum: number = 0;
	public static c_pitchPrimaryChannelLumScale: number = 0;
	public static c_pitchSecondaryNoteHue: number = 0;
	public static c_pitchSecondaryNoteHueScale: number = 0;
	public static c_pitchSecondaryNoteSat: number = 0;
	public static c_pitchSecondaryNoteSatScale: number = 0;
	public static c_pitchSecondaryNoteLum: number = 0;
	public static c_pitchSecondaryNoteLumScale: number = 0;
	public static c_pitchPrimaryNoteHue: number = 0;
	public static c_pitchPrimaryNoteHueScale: number = 0;
	public static c_pitchPrimaryNoteSat: number = 0;
	public static c_pitchPrimaryNoteSatScale: number = 0;
	public static c_pitchPrimaryNoteLum: number = 0;
	public static c_pitchPrimaryNoteLumScale: number = 0;
	public static c_modSecondaryChannelHue: number = 0;
	public static c_modSecondaryChannelHueScale: number = 0;
	public static c_modSecondaryChannelSat: number = 0;
	public static c_modSecondaryChannelSatScale: number = 0;
	public static c_modSecondaryChannelLum: number = 0;
	public static c_modSecondaryChannelLumScale: number = 0;
	public static c_modPrimaryChannelHue: number = 0;
	public static c_modPrimaryChannelHueScale: number = 0;
	public static c_modPrimaryChannelSat: number = 0;
	public static c_modPrimaryChannelSatScale: number = 0;
	public static c_modPrimaryChannelLum: number = 0;
	public static c_modPrimaryChannelLumScale: number = 0;
	public static c_modSecondaryNoteHue: number = 0;
	public static c_modSecondaryNoteHueScale: number = 0;
	public static c_modSecondaryNoteSat: number = 0;
	public static c_modSecondaryNoteSatScale: number = 0;
	public static c_modSecondaryNoteLum: number = 0;
	public static c_modSecondaryNoteLumScale: number = 0;
	public static c_modPrimaryNoteHue: number = 0;
	public static c_modPrimaryNoteHueScale: number = 0;
	public static c_modPrimaryNoteSat: number = 0;
	public static c_modPrimaryNoteSatScale: number = 0;
	public static c_modPrimaryNoteLum: number = 0;
	public static c_modPrimaryNoteLumScale: number = 0;
	public static c_noiseSecondaryChannelHue: number = 0;
	public static c_noiseSecondaryChannelHueScale: number = 0;
	public static c_noiseSecondaryChannelSat: number = 0;
	public static c_noiseSecondaryChannelSatScale: number = 0;
	public static c_noiseSecondaryChannelLum: number = 0;
	public static c_noiseSecondaryChannelLumScale: number = 0;
	public static c_noisePrimaryChannelHue: number = 0;
	public static c_noisePrimaryChannelHueScale: number = 0;
	public static c_noisePrimaryChannelSat: number = 0;
	public static c_noisePrimaryChannelSatScale: number = 0;
	public static c_noisePrimaryChannelLum: number = 0;
	public static c_noisePrimaryChannelLumScale: number = 0;
	public static c_noiseSecondaryNoteHue: number = 0;
	public static c_noiseSecondaryNoteHueScale: number = 0;
	public static c_noiseSecondaryNoteSat: number = 0;
	public static c_noiseSecondaryNoteSatScale: number = 0;
	public static c_noiseSecondaryNoteLum: number = 0;
	public static c_noiseSecondaryNoteLumScale: number = 0;
	public static c_noisePrimaryNoteHue: number = 0;
	public static c_noisePrimaryNoteHueScale: number = 0;
	public static c_noisePrimaryNoteSat: number = 0;
	public static c_noisePrimaryNoteSatScale: number = 0;
	public static c_noisePrimaryNoteLum: number = 0;
	public static c_noisePrimaryNoteLumScale: number = 0;

	public static c_pitchChannelCountOverride: number = 40;
	public static c_noiseChannelCountOverride: number = 16;
	public static c_modChannelCountOverride: number = 12;

	public static c_pitchLimit: number = 1;
	public static c_noiseLimit: number = 1;
	public static c_modLimit: number = 1;
	public static c_colorFormulaPitchLimit: number = 1;
	public static c_colorFormulaNoiseLimit: number = 1;
	public static c_colorFormulaModLimit: number = 1;

	public static c_invertedText: string = "";
	public static c_trackEditorBgNoiseDim: string = "";
	public static c_trackEditorBgNoise: string = "";
	public static c_trackEditorBgModDim: string = "";
	public static c_trackEditorBgMod: string = "";
	public static c_trackEditorBgPitchDim: string = "";
	public static c_trackEditorBgPitch: string = "";

    public static readonly pitchChannels: DictionaryArray<ChannelColors> = toNameMap([
        {
            name: "pitch1", // cyan
            secondaryChannel: "var(--pitch1-secondary-channel, #0099A1)",
            primaryChannel: "var(--pitch1-primary-channel, #25F3FF)",
            secondaryNote: "var(--pitch1-secondary-note, #00BDC7)",
            primaryNote: "var(--pitch1-primary-note, #92F9FF)",
        }, {
            name: "pitch2", // yellow
            secondaryChannel: "var(--pitch2-secondary-channel, #A1A100)",
            primaryChannel: "var(--pitch2-primary-channel, #FFFF25)",
            secondaryNote: "var(--pitch2-secondary-note, #C7C700)",
            primaryNote: "var(--pitch2-primary-note, #FFFF92)",
        }, {
            name: "pitch3", // orange
            secondaryChannel: "var(--pitch3-secondary-channel, #C75000)",
            primaryChannel: "var(--pitch3-primary-channel, #FF9752)",
            secondaryNote: "var(--pitch3-secondary-note, #FF771C)",
            primaryNote: "var(--pitch3-primary-note, #FFCDAB)",
        }, {
            name: "pitch4", // green
            secondaryChannel: "var(--pitch4-secondary-channel, #00A100)",
            primaryChannel: "var(--pitch4-primary-channel, #50FF50)",
            secondaryNote: "var(--pitch4-secondary-note, #00C700)",
            primaryNote: "var(--pitch4-primary-note, #A0FFA0)",
        }, {
            name: "pitch5", // magenta
            secondaryChannel: "var(--pitch5-secondary-channel, #D020D0)",
            primaryChannel: "var(--pitch5-primary-channel, #FF90FF)",
            secondaryNote: "var(--pitch5-secondary-note, #E040E0)",
            primaryNote: "var(--pitch5-primary-note, #FFC0FF)",
        }, {
            name: "pitch6", // blue
            secondaryChannel: "var(--pitch6-secondary-channel, #7777B0)",
            primaryChannel: "var(--pitch6-primary-channel, #A0A0FF)",
            secondaryNote: "var(--pitch6-secondary-note, #8888D0)",
            primaryNote: "var(--pitch6-primary-note, #D0D0FF)",
        }, {
            name: "pitch7", // olive
            secondaryChannel: "var(--pitch7-secondary-channel, #8AA100)",
            primaryChannel: "var(--pitch7-primary-channel, #DEFF25)",
            secondaryNote: "var(--pitch7-secondary-note, #AAC700)",
            primaryNote: "var(--pitch7-primary-note, #E6FF92)",
        }, {
            name: "pitch8", // red
            secondaryChannel: "var(--pitch8-secondary-channel, #DF0019)",
            primaryChannel: "var(--pitch8-primary-channel, #FF98A4)",
            secondaryNote: "var(--pitch8-secondary-note, #FF4E63)",
            primaryNote: "var(--pitch8-primary-note, #FFB2BB)",
        }, {
            name: "pitch9", // teal
            secondaryChannel: "var(--pitch9-secondary-channel, #00A170)",
            primaryChannel: "var(--pitch9-primary-channel, #50FFC9)",
            secondaryNote: "var(--pitch9-secondary-note, #00C78A)",
            primaryNote: "var(--pitch9-primary-note, #83FFD9)",
        }, {
            name: "pitch10", // purple
            secondaryChannel: "var(--pitch10-secondary-channel, #A11FFF)",
            primaryChannel: "var(--pitch10-primary-channel, #CE8BFF)",
            secondaryNote: "var(--pitch10-secondary-note, #B757FF)",
            primaryNote: "var(--pitch10-primary-note, #DFACFF)",
        },
    ]);
    public static readonly noiseChannels: DictionaryArray<ChannelColors> = toNameMap([
        {
            name: "noise1", // gray
            secondaryChannel: "var(--noise1-secondary-channel, #6F6F6F)",
            primaryChannel: "var(--noise1-primary-channel, #AAAAAA)",
            secondaryNote: "var(--noise1-secondary-note, #A7A7A7)",
            primaryNote: "var(--noise1-primary-note, #E0E0E0)",
        }, {
            name: "noise2", // brown
            secondaryChannel: "var(--noise2-secondary-channel, #996633)",
            primaryChannel: "var(--noise2-primary-channel, #DDAA77)",
            secondaryNote: "var(--noise2-secondary-note, #CC9966)",
            primaryNote: "var(--noise2-primary-note, #F0D0BB)",
        }, {
            name: "noise3", // azure
            secondaryChannel: "var(--noise3-secondary-channel, #4A6D8F)",
            primaryChannel: "var(--noise3-primary-channel, #77AADD)",
            secondaryNote: "var(--noise3-secondary-note, #6F9FCF)",
            primaryNote: "var(--noise3-primary-note, #BBD7FF)",
        }, {
            name: "noise4", // purple
            secondaryChannel: "var(--noise4-secondary-channel, #7A4F9A)",
            primaryChannel: "var(--noise4-primary-channel, #AF82D2)",
            secondaryNote: "var(--noise4-secondary-note, #9E71C1)",
            primaryNote: "var(--noise4-primary-note, #D4C1EA)",
        }, {
            name: "noise5", // sage
            secondaryChannel: "var(--noise5-secondary-channel, #607837)",
            primaryChannel: "var(--noise5-primary-channel, #A2BB77)",
            secondaryNote: "var(--noise5-secondary-note, #91AA66)",
            primaryNote: "var(--noise5-primary-note, #C5E2B2)",
        },
    ]);
    public static readonly modChannels: DictionaryArray<ChannelColors> = toNameMap([
        {
            name: "mod1",
            secondaryChannel: "var(--mod1-secondary-channel, #339955)",
            primaryChannel: "var(--mod1-primary-channel, #77fc55)",
            secondaryNote: "var(--mod1-secondary-note, #77ff8a)",
            primaryNote: "var(--mod1-primary-note, #cdffee)",
        }, {
            name: "mod2",
            secondaryChannel: "var(--mod2-secondary-channel, #993355)",
            primaryChannel: "var(--mod2-primary-channel, #f04960)",
            secondaryNote: "var(--mod2-secondary-note, #f057a0)",
            primaryNote: "var(--mod2-primary-note, #ffb8de)",
        }, {
            name: "mod3",
            secondaryChannel: "var(--mod3-secondary-channel, #553399)",
            primaryChannel: "var(--mod3-primary-channel, #8855fc)",
            secondaryNote: "var(--mod3-secondary-note, #aa64ff)",
            primaryNote: "var(--mod3-primary-note, #f8ddff)",
        }, {
            name: "mod4",
            secondaryChannel: "var(--mod4-secondary-channel, #a86436)",
            primaryChannel: "var(--mod4-primary-channel, #c8a825)",
            secondaryNote: "var(--mod4-secondary-note, #e8ba46)",
            primaryNote: "var(--mod4-primary-note, #fff6d3)",
        },
    ]);

    public static resetColors() {
        this.colorLookup.clear();
    }

	public static getArbitaryChannelColor(type: string, channel: number): ChannelColors {

        if (!this.usesColorFormula) {
            let base: ChannelColors;
            switch (type) {
                case ("noise"): {
                    base = ColorConfig.noiseChannels[(channel % this.c_noiseLimit) % ColorConfig.noiseChannels.length];
                    break;
                }
                case ("mod"): {
                    base = ColorConfig.modChannels[(channel % this.c_modLimit) % ColorConfig.modChannels.length];
                    break;
                }
                case ("pitch"):
                default: {
                    base = ColorConfig.pitchChannels[(channel % this.c_pitchLimit) % ColorConfig.pitchChannels.length];
                    break;
                }
            }
            var regex = /\(([^\,)]+)/;
            let newChannelSecondary: string = ColorConfig.getComputed((regex.exec(base.secondaryChannel) as RegExpExecArray)[1] as string);
            let newChannelPrimary: string = ColorConfig.getComputed((regex.exec(base.primaryChannel) as RegExpExecArray)[1] as string);
            let newNoteSecondary: string = ColorConfig.getComputed((regex.exec(base.secondaryNote) as RegExpExecArray)[1] as string);
            let newNotePrimary: string = ColorConfig.getComputed((regex.exec(base.primaryNote) as RegExpExecArray)[1] as string);
            return <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
        }
		let colorFormulaPitchLimit: number = this.c_colorFormulaPitchLimit;
		let colorFormulaNoiseLimit: number = this.c_colorFormulaNoiseLimit;
		let colorFormulaModLimit: number = this.c_colorFormulaModLimit;
        switch (type) {
            case ("noise"): {
				// Noise formula

                let newChannelSecondary: string = "hsl(" + ((this.c_noiseSecondaryChannelHue + ((channel * this.c_noiseSecondaryChannelHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
                    + (this.c_noiseSecondaryChannelSat + channel * this.c_noiseSecondaryChannelSatScale) + "%,"
                    + (this.c_noiseSecondaryChannelLum + channel * this.c_noiseSecondaryChannelLumScale) + "%)";
                let newChannelPrimary: string = "hsl(" + ((this.c_noisePrimaryChannelHue + ((channel * this.c_noisePrimaryChannelHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
                    + (this.c_noisePrimaryChannelSat + channel * this.c_noisePrimaryChannelSatScale) + "%,"
                    + (this.c_noisePrimaryChannelLum + channel * this.c_noisePrimaryChannelLumScale) + "%)";
                let newNoteSecondary: string = "hsl(" + ((this.c_noiseSecondaryNoteHue + ((channel * this.c_noiseSecondaryNoteHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
                    + (this.c_noiseSecondaryNoteSat + channel * this.c_noiseSecondaryNoteSatScale) + "%,"
                    + (this.c_noiseSecondaryNoteLum + channel * this.c_noiseSecondaryNoteLumScale) + "%)";
                let newNotePrimary: string = "hsl(" + ((this.c_noisePrimaryNoteHue + ((channel * this.c_noisePrimaryNoteHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
                    + (this.c_noisePrimaryNoteSat + channel * this.c_noisePrimaryNoteSatScale) + "%,"
                    + (this.c_noisePrimaryNoteLum + channel * this.c_noisePrimaryNoteLumScale) + "%)";

                let newChannelColors = <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                return newChannelColors;
            } case ("mod"): {
                // Mod formula

                let newChannelSecondary: string = "hsl(" + ((this.c_modSecondaryChannelHue + ((channel * this.c_modSecondaryChannelHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
                    + (this.c_modSecondaryChannelSat + channel * this.c_modSecondaryChannelSatScale) + "%,"
                    + (this.c_modSecondaryChannelLum + channel * this.c_modSecondaryChannelLumScale) + "%)";
                let newChannelPrimary: string = "hsl(" + ((this.c_modPrimaryChannelHue + ((channel * this.c_modPrimaryChannelHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
                    + (this.c_modPrimaryChannelSat + channel * this.c_modPrimaryChannelSatScale) + "%,"
                    + (this.c_modPrimaryChannelLum + channel * this.c_modPrimaryChannelLumScale) + "%)";
                let newNoteSecondary: string = "hsl(" + ((this.c_modSecondaryNoteHue + ((channel * this.c_modSecondaryNoteHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
                    + (this.c_modSecondaryNoteSat + channel * this.c_modSecondaryNoteSatScale) + "%,"
                    + (this.c_modSecondaryNoteLum + channel * this.c_modSecondaryNoteLumScale) + "%)";
                let newNotePrimary: string = "hsl(" + ((this.c_modPrimaryNoteHue + ((channel * this.c_modPrimaryNoteHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
                    + (this.c_modPrimaryNoteSat + channel * this.c_modPrimaryNoteSatScale) + "%,"
                    + (this.c_modPrimaryNoteLum + channel * this.c_modPrimaryNoteLumScale) + "%)";

                let newChannelColors = <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                return newChannelColors;
            }
            case ("pitch"):
            default: {
				// Pitch formula

                let newChannelSecondary: string = "hsl(" + ((this.c_pitchSecondaryChannelHue + (channel * this.c_pitchSecondaryChannelHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
                    + (this.c_pitchSecondaryChannelSat * (1 - (this.c_pitchSecondaryChannelSatScale * Math.floor(channel / 7)))) + "%,"
                    + (this.c_pitchSecondaryChannelLum * (1 - (this.c_pitchSecondaryChannelLumScale * Math.floor(channel / 7)))) + "%)";
                let newChannelPrimary: string = "hsl(" + ((this.c_pitchPrimaryChannelHue + (channel * this.c_pitchPrimaryChannelHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
                    + (this.c_pitchPrimaryChannelSat * (1 - (this.c_pitchPrimaryChannelSatScale * Math.floor(channel / 7)))) + "%,"
                    + (this.c_pitchPrimaryChannelLum * (1 - (this.c_pitchPrimaryChannelLumScale * Math.floor(channel / 7)))) + "%)";
                let newNoteSecondary: string = "hsl(" + ((this.c_pitchSecondaryNoteHue + (channel * this.c_pitchSecondaryNoteHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
                    + (this.c_pitchSecondaryNoteSat * (1 - (this.c_pitchSecondaryNoteSatScale * Math.floor(channel / 7)))) + "%,"
                    + (this.c_pitchSecondaryNoteLum * (1 - (this.c_pitchSecondaryNoteLumScale * Math.floor(channel / 7)))) + "%)";
                let newNotePrimary: string = "hsl(" + ((this.c_pitchPrimaryNoteHue + (channel * this.c_pitchPrimaryNoteHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
                    + (this.c_pitchPrimaryNoteSat * (1 - (this.c_pitchPrimaryNoteSatScale * Math.floor(channel / 7)))) + "%,"
                    + (this.c_pitchPrimaryNoteLum * (1 - (this.c_pitchPrimaryNoteLumScale * Math.floor(channel / 7)))) + "%)";

                let newChannelColors = <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                return newChannelColors;
            }
        }
    }

    // Same as below, but won't return var colors
    public static getComputedChannelColor(song: Song, channel: number): ChannelColors {
		if (!this.usesColorFormula) {
            let base: ChannelColors = ColorConfig.getChannelColor(song, channel);
            // Trim away "var(...)"
            var regex = /\(([^\,)]+)/;
            let newChannelSecondary: string = ColorConfig.getComputed((regex.exec(base.secondaryChannel) as RegExpExecArray)[1] as string);
            let newChannelPrimary: string = ColorConfig.getComputed((regex.exec(base.primaryChannel) as RegExpExecArray)[1] as string);
            let newNoteSecondary: string = ColorConfig.getComputed((regex.exec(base.secondaryNote) as RegExpExecArray)[1] as string);
            let newNotePrimary: string = ColorConfig.getComputed((regex.exec(base.primaryNote) as RegExpExecArray)[1] as string);
            return <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
        }
        else {
            return ColorConfig.getChannelColor(song, channel);
        }
    };

    public static getChannelColor(song: Song, channel: number): ChannelColors {
		if (!this.usesColorFormula) {
            // Set colors, not defined by formula
            if (channel < song.pitchChannelCount) {
				return ColorConfig.pitchChannels[(channel % this.c_pitchLimit) % ColorConfig.pitchChannels.length];
            } else if (channel < song.pitchChannelCount + song.noiseChannelCount) {
				return ColorConfig.noiseChannels[((channel - song.pitchChannelCount) % this.c_noiseLimit) % ColorConfig.noiseChannels.length];
            } else {
				return ColorConfig.modChannels[((channel - song.pitchChannelCount - song.noiseChannelCount) % this.c_modLimit) % ColorConfig.modChannels.length];
            }
        }
        else {
            // Determine if color is cached
			if (ColorConfig.colorLookup.has(channel)) {
                return ColorConfig.colorLookup.get(channel) as ChannelColors;
            }
            else {
                // Formulaic color definition
				let colorFormulaPitchLimit: number = this.c_colorFormulaPitchLimit;
				let colorFormulaNoiseLimit: number = this.c_colorFormulaNoiseLimit;
				let colorFormulaModLimit: number = this.c_colorFormulaModLimit;
                if (channel < song.pitchChannelCount) {
                    // Pitch formula

				let newChannelSecondary: string = "hsl(" + ((this.c_pitchSecondaryChannelHue + (channel * this.c_pitchSecondaryChannelHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
					+ (this.c_pitchSecondaryChannelSat * (1 - (this.c_pitchSecondaryChannelSatScale * Math.floor(channel / 9)))) + "%,"
					+ (this.c_pitchSecondaryChannelLum * (1 - (this.c_pitchSecondaryChannelLumScale * Math.floor(channel / 9)))) + "%)";
				let newChannelPrimary: string = "hsl(" + ((this.c_pitchPrimaryChannelHue + (channel * this.c_pitchPrimaryChannelHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
					+ (this.c_pitchPrimaryChannelSat * (1 - (this.c_pitchPrimaryChannelSatScale * Math.floor(channel / 9)))) + "%,"
					+ (this.c_pitchPrimaryChannelLum * (1 - (this.c_pitchPrimaryChannelLumScale * Math.floor(channel / 9)))) + "%)";
				let newNoteSecondary: string = "hsl(" + ((this.c_pitchSecondaryNoteHue + (channel * this.c_pitchSecondaryNoteHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
					+ (this.c_pitchSecondaryNoteSat * (1 - (this.c_pitchSecondaryNoteSatScale * Math.floor(channel / 9)))) + "%,"
					+ (this.c_pitchSecondaryNoteLum * (1 - (this.c_pitchSecondaryNoteLumScale * Math.floor(channel / 9)))) + "%)";
				let newNotePrimary: string = "hsl(" + ((this.c_pitchPrimaryNoteHue + (channel * this.c_pitchPrimaryNoteHueScale / this.c_pitchChannelCountOverride) * 256) % colorFormulaPitchLimit) + ","
					+ (this.c_pitchPrimaryNoteSat * (1 - (this.c_pitchPrimaryNoteSatScale * Math.floor(channel / 9)))) + "%,"
					+ (this.c_pitchPrimaryNoteLum * (1 - (this.c_pitchPrimaryNoteLumScale * Math.floor(channel / 9)))) + "%)";

                    let newChannelColors = <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                    ColorConfig.colorLookup.set(channel, newChannelColors);
                    return newChannelColors;

                }
                else if (channel < song.pitchChannelCount + song.noiseChannelCount) {
                    // Noise formula
					
				let newChannelSecondary: string = "hsl(" + ((this.c_noiseSecondaryChannelHue + (((channel - song.pitchChannelCount) * this.c_noiseSecondaryChannelHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
					+ (this.c_noiseSecondaryChannelSat + channel * this.c_noiseSecondaryChannelSatScale) + "%,"
					+ (this.c_noiseSecondaryChannelLum + channel * this.c_noiseSecondaryChannelLumScale) + "%)";
				let newChannelPrimary: string = "hsl(" + ((this.c_noisePrimaryChannelHue + (((channel - song.pitchChannelCount) * this.c_noisePrimaryChannelHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
					+ (this.c_noisePrimaryChannelSat + channel * this.c_noisePrimaryChannelSatScale) + "%,"
					+ (this.c_noisePrimaryChannelLum + channel * this.c_noisePrimaryChannelLumScale) + "%)";
				let newNoteSecondary: string = "hsl(" + ((this.c_noiseSecondaryNoteHue + (((channel - song.pitchChannelCount) * this.c_noiseSecondaryNoteHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
					+ (this.c_noiseSecondaryNoteSat + channel * this.c_noiseSecondaryNoteSatScale) + "%,"
					+ (this.c_noiseSecondaryNoteLum + channel * this.c_noiseSecondaryNoteLumScale) + "%)";
				let newNotePrimary: string = "hsl(" + ((this.c_noisePrimaryNoteHue + (((channel - song.pitchChannelCount) * this.c_noisePrimaryNoteHueScale) / this.c_noiseChannelCountOverride) * 256) % colorFormulaNoiseLimit) + ","
					+ (this.c_noisePrimaryNoteSat + channel * this.c_noisePrimaryNoteSatScale) + "%,"
					+ (this.c_noisePrimaryNoteLum + channel * this.c_noisePrimaryNoteLumScale) + "%)";

                    let newChannelColors = <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                    ColorConfig.colorLookup.set(channel, newChannelColors);
                    return newChannelColors;
                }
                else {
                    // Mod formula

					let newChannelSecondary: string = "hsl(" + ((this.c_modSecondaryChannelHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * this.c_modSecondaryChannelHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
						+ (this.c_modSecondaryChannelSat + channel * this.c_modSecondaryChannelSatScale) + "%,"
						+ (this.c_modSecondaryChannelLum + channel * this.c_modSecondaryChannelLumScale) + "%)";
					let newChannelPrimary: string = "hsl(" + ((this.c_modPrimaryChannelHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * this.c_modPrimaryChannelHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
						+ (this.c_modPrimaryChannelSat + channel * this.c_modPrimaryChannelSatScale) + "%,"
						+ (this.c_modPrimaryChannelLum + channel * this.c_modPrimaryChannelLumScale) + "%)";
					let newNoteSecondary: string = "hsl(" + ((this.c_modSecondaryNoteHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * this.c_modSecondaryNoteHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
						+ (this.c_modSecondaryNoteSat + channel * this.c_modSecondaryNoteSatScale) + "%,"
						+ (this.c_modSecondaryNoteLum + channel * this.c_modSecondaryNoteLumScale) + "%)";
					let newNotePrimary: string = "hsl(" + ((this.c_modPrimaryNoteHue + (((channel - song.pitchChannelCount - song.noiseChannelCount) * this.c_modPrimaryNoteHueScale) / this.c_modChannelCountOverride) * 256) % colorFormulaModLimit) + ","
						+ (this.c_modPrimaryNoteSat + channel * this.c_modPrimaryNoteSatScale) + "%,"
						+ (this.c_modPrimaryNoteLum + channel * this.c_modPrimaryNoteLumScale) + "%)";

                    let newChannelColors = <ChannelColors>{ secondaryChannel: newChannelSecondary, primaryChannel: newChannelPrimary, secondaryNote: newNoteSecondary, primaryNote: newNotePrimary };
                    ColorConfig.colorLookup.set(channel, newChannelColors);
                    return newChannelColors;
                }
            }
        }
    }

    private static readonly _styleElement: HTMLStyleElement = document.head.appendChild(HTML.style({ type: "text/css" }));

    public static setTheme(name: string): void {
		let theme: string = this.themes[name];
		if (theme == undefined) theme = ColorConfig.defaultTheme;
		this._styleElement.textContent = theme;

		// for getComputed
		let valuesToAdd: string = ":root{";

		if (getComputedStyle(this._styleElement).getPropertyValue("--oscilloscope-line-L") == "") valuesToAdd += "--oscilloscope-line-L:var(--primary-text,white);";
		if (getComputedStyle(this._styleElement).getPropertyValue("--oscilloscope-line-R") == "") valuesToAdd += "--oscilloscope-line-R:var(--text-selection,rgba(119,68,255,0.99));";
		if (getComputedStyle(this._styleElement).getPropertyValue("--text-enabled-icon") == "") valuesToAdd += "--text-enabled-icon:✓ ;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--text-disabled-icon") == "") valuesToAdd += "--text-disabled-icon:　;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--text-spacing-icon") == "") valuesToAdd += "--text-spacing-icon:　;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--note-flash") == "") valuesToAdd += "--note-flash:#ffffff;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--note-flash-secondary") == "") valuesToAdd += "--note-flash-secondary:#ffffff77;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch-channel-limit") == "") valuesToAdd += "--pitch-channel-limit:" + Config.pitchChannelCountMax + ";";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise-channel-limit") == "") valuesToAdd += "--noise-channel-limit:" + Config.noiseChannelCountMax + ";";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod-channel-limit") == "") valuesToAdd += "--mod-channel-limit:" + Config.modChannelCountMax + ";";
		if (getComputedStyle(this._styleElement).getPropertyValue("--formula-pitch-channel-limit") == "") valuesToAdd += "--formula-pitch-channel-limit:360;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--formula-noise-channel-limit") == "") valuesToAdd += "--formula-noise-channel-limit:360;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--formula-mod-channel-limit") == "") valuesToAdd += "--formula-mod-channel-limit:360;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--editor-background") == "") valuesToAdd += "--editor-background:black;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--ui-widget-background") == "") valuesToAdd += "--ui-widget-background:#444;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--loop-accent") == "") valuesToAdd += "--loop-accent:#74f;";
		// if (getComputedStyle(this._styleElement).getPropertyValue("--link-accent") == "") valuesToAdd += "--link-accent:#9c64f7;";
		// if (getComputedStyle(this._styleElement).getPropertyValue("--mod-title") == "") valuesToAdd += "--mod-title:var(--link-accent);";
		if (getComputedStyle(this._styleElement).getPropertyValue("--box-selection-fill") == "") valuesToAdd += "--box-selection-fill:rgba(255,255,255,0.2);";
		if (getComputedStyle(this._styleElement).getPropertyValue("--primary-text") == "") valuesToAdd += "--primary-text:white;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--inverted-text") == "") valuesToAdd += "--inverted-text:black;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-pitch") == "") valuesToAdd += "--track-editor-bg-pitch:#444;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-pitch-dim") == "") valuesToAdd += "--track-editor-bg-pitch-dim:#333;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-noise") == "") valuesToAdd += "--track-editor-bg-noise:#444;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-noise-dim") == "") valuesToAdd += "--track-editor-bg-noise-dim:#333;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-mod") == "") valuesToAdd += "--track-editor-bg-mod:#234;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-mod-dim") == "") valuesToAdd += "--track-editor-bg-mod-dim:#123;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mute-button-normal") == "") valuesToAdd += "--mute-button-normal:#ffa033;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mute-button-mod") == "") valuesToAdd += "--mute-button-mod:#9a6bff;";

		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch1-secondary-channel") == "") valuesToAdd += "--pitch1-secondary-channel:#0099A1;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch1-primary-channel") == "") valuesToAdd += "--pitch1-primary-channel:#25F3FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch1-secondary-note") == "") valuesToAdd += "--pitch1-secondary-note:#00BDC7;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch1-primary-note") == "") valuesToAdd += "--pitch1-primary-note:#92F9FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch2-secondary-channel") == "") valuesToAdd += "--pitch2-secondary-channel:#A1A100;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch2-primary-channel") == "") valuesToAdd += "--pitch2-primary-channel:#FFFF25;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch2-secondary-note") == "") valuesToAdd += "--pitch2-secondary-note:#C7C700;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch2-primary-note") == "") valuesToAdd += "--pitch2-primary-note:#FFFF92;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch3-secondary-channel") == "") valuesToAdd += "--pitch3-secondary-channel:#C75000;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch3-primary-channel") == "") valuesToAdd += "--pitch3-primary-channel:#FF9752;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch3-secondary-note") == "") valuesToAdd += "--pitch3-secondary-note:#FF771C;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch3-primary-note") == "") valuesToAdd += "--pitch3-primary-note:#FFCDAB;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch4-secondary-channel") == "") valuesToAdd += "--pitch4-secondary-channel:#00A100;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch4-primary-channel") == "") valuesToAdd += "--pitch4-primary-channel:#50FF50;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch4-secondary-note") == "") valuesToAdd += "--pitch4-secondary-note:#00C700;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch4-primary-note") == "") valuesToAdd += "--pitch4-primary-note:#A0FFA0;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch5-secondary-channel") == "") valuesToAdd += "--pitch5-secondary-channel:#D020D0;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch5-primary-channel") == "") valuesToAdd += "--pitch5-primary-channel:#FF90FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch5-secondary-note") == "") valuesToAdd += "--pitch5-secondary-note:#E040E0;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch5-primary-note") == "") valuesToAdd += "--pitch5-primary-note:#FFC0FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch6-secondary-channel") == "") valuesToAdd += "--pitch6-secondary-channel:#7777B0;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch6-primary-channel") == "") valuesToAdd += "--pitch6-primary-channel:#A0A0FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch6-secondary-note") == "") valuesToAdd += "--pitch6-secondary-note:#8888D0;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch6-primary-note") == "") valuesToAdd += "--pitch6-primary-note:#D0D0FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch7-secondary-channel") == "") valuesToAdd += "--pitch7-secondary-channel:#8AA100;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch7-primary-channel") == "") valuesToAdd += "--pitch7-primary-channel:#DEFF25;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch7-secondary-note") == "") valuesToAdd += "--pitch7-secondary-note:#AAC700;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch7-primary-note") == "") valuesToAdd += "--pitch7-primary-note:#E6FF92;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch8-secondary-channel") == "") valuesToAdd += "--pitch8-secondary-channel:#DF0019;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch8-primary-channel") == "") valuesToAdd += "--pitch8-primary-channel:#FF98A4;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch8-secondary-note") == "") valuesToAdd += "--pitch8-secondary-note:#FF4E63;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch8-primary-note") == "") valuesToAdd += "--pitch8-primary-note:#FFB2BB;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch9-secondary-channel") == "") valuesToAdd += "--pitch9-secondary-channel:#00A170;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch9-primary-channel") == "") valuesToAdd += "--pitch9-primary-channel:#50FFC9;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch9-secondary-note") == "") valuesToAdd += "--pitch9-secondary-note:#00C78A;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch9-primary-note") == "") valuesToAdd += "--pitch9-primary-note:#83FFD9;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch10-secondary-channel") == "") valuesToAdd += "--pitch10-secondary-channel:#A11FFF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch10-primary-channel") == "") valuesToAdd += "--pitch10-primary-channel:#CE8BFF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch10-secondary-note") == "") valuesToAdd += "--pitch10-secondary-note:#B757FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--pitch10-primary-note") == "") valuesToAdd += "--pitch10-primary-note:#DFACFF;";

		if (getComputedStyle(this._styleElement).getPropertyValue("--noise1-secondary-channel") == "") valuesToAdd += "--noise1-secondary-channel:#6F6F6F;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise1-primary-channel") == "") valuesToAdd += "--noise1-primary-channel:#AAAAAA;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise1-secondary-note") == "") valuesToAdd += "--noise1-secondary-note:#A7A7A7;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise1-primary-note") == "") valuesToAdd += "--noise1-primary-note:#E0E0E0;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise2-secondary-channel") == "") valuesToAdd += "--noise2-secondary-channel:#996633;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise2-primary-channel") == "") valuesToAdd += "--noise2-primary-channel:#DDAA77;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise2-secondary-note") == "") valuesToAdd += "--noise2-secondary-note:#CC9966;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise2-primary-note") == "") valuesToAdd += "--noise2-primary-note:#F0D0BB;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise3-secondary-channel") == "") valuesToAdd += "--noise3-secondary-channel:#4A6D8F;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise3-primary-channel") == "") valuesToAdd += "--noise3-primary-channel:#77AADD;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise3-secondary-note") == "") valuesToAdd += "--noise3-secondary-note:#6F9FCF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise3-primary-note") == "") valuesToAdd += "--noise3-primary-note:#BBD7FF;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise4-secondary-channel") == "") valuesToAdd += "--noise4-secondary-channel:#7A4F9A;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise4-primary-channel") == "") valuesToAdd += "--noise4-primary-channel:#AF82D2;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise4-secondary-note") == "") valuesToAdd += "--noise4-secondary-note:#9E71C1;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise4-primary-note") == "") valuesToAdd += "--noise4-primary-note:#D4C1EA;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise5-secondary-channel") == "") valuesToAdd += "--noise5-secondary-channel:#607837;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise5-primary-channel") == "") valuesToAdd += "--noise5-primary-channel:#A2BB77;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise5-secondary-note") == "") valuesToAdd += "--noise5-secondary-note:#91AA66;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--noise5-primary-note") == "") valuesToAdd += "--noise5-primary-note:#C5E2B2;";

		if (getComputedStyle(this._styleElement).getPropertyValue("--mod1-secondary-channel") == "") valuesToAdd += "--mod1-secondary-channel:#339955;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod1-primary-channel") == "") valuesToAdd += "--mod1-primary-channel:#77fc55;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod1-secondary-note") == "") valuesToAdd += "--mod1-secondary-note:#77ff8a;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod1-primary-note") == "") valuesToAdd += "--mod1-primary-note:#cdffee;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod2-secondary-channel") == "") valuesToAdd += "--mod2-secondary-channel:#993355;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod2-primary-channel") == "") valuesToAdd += "--mod2-primary-channel:#f04960;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod2-secondary-note") == "") valuesToAdd += "--mod2-secondary-note:#f057a0;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod2-primary-note") == "") valuesToAdd += "--mod2-primary-note:#ffb8de;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod3-secondary-channel") == "") valuesToAdd += "--mod3-secondary-channel:#553399;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod3-primary-channel") == "") valuesToAdd += "--mod3-primary-channel:#8855fc;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod3-secondary-note") == "") valuesToAdd += "--mod3-secondary-note:#aa64ff;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod3-primary-note") == "") valuesToAdd += "--mod3-primary-note:#f8ddff;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod4-secondary-channel") == "") valuesToAdd += "--mod4-secondary-channel:#a86436;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod4-primary-channel") == "") valuesToAdd += "--mod4-primary-channel:#c8a825;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod4-secondary-note") == "") valuesToAdd += "--mod4-secondary-note:#e8ba46;";
		if (getComputedStyle(this._styleElement).getPropertyValue("--mod4-primary-note") == "") valuesToAdd += "--mod4-primary-note:#fff6d3;";

		valuesToAdd += "}";
		this._styleElement.textContent = valuesToAdd + this._styleElement.textContent;

        const themeColor = <HTMLMetaElement>document.querySelector("meta[name='theme-color']");
        if (themeColor != null) {
            themeColor.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue('--ui-widget-background'));
        }

        this.resetColors();

		this.usesColorFormula = (getComputedStyle(this._styleElement).getPropertyValue("--use-color-formula").trim() == "true");

		this.c_pitchLimit = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-channel-limit");
		this.c_noiseLimit = +getComputedStyle(this._styleElement).getPropertyValue("--noise-channel-limit");
		this.c_modLimit = +getComputedStyle(this._styleElement).getPropertyValue("--mod-channel-limit");
		this.c_colorFormulaPitchLimit = +getComputedStyle(this._styleElement).getPropertyValue("--formula-pitch-channel-limit");
		this.c_colorFormulaNoiseLimit = +getComputedStyle(this._styleElement).getPropertyValue("--formula-noise-channel-limit");
		this.c_colorFormulaModLimit = +getComputedStyle(this._styleElement).getPropertyValue("--formula-mod-channel-limit");

		this.c_invertedText = getComputedStyle(this._styleElement).getPropertyValue("--inverted-text");
		this.c_trackEditorBgNoiseDim = getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-noise-dim");
		this.c_trackEditorBgNoise = getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-noise");
		this.c_trackEditorBgModDim = getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-mod-dim");
		this.c_trackEditorBgMod = getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-mod");
		this.c_trackEditorBgPitchDim = getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-pitch-dim");
		this.c_trackEditorBgPitch = getComputedStyle(this._styleElement).getPropertyValue("--track-editor-bg-pitch");

		if (this.usesColorFormula) {
			this.c_pitchSecondaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-hue");
			this.c_pitchSecondaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-hue-scale");
			this.c_pitchSecondaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-sat");
			this.c_pitchSecondaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-sat-scale");
			this.c_pitchSecondaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-lum");
			this.c_pitchSecondaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-channel-lum-scale");
			this.c_pitchPrimaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-hue");
			this.c_pitchPrimaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-hue-scale");
			this.c_pitchPrimaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-sat");
			this.c_pitchPrimaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-sat-scale");
			this.c_pitchPrimaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-lum");
			this.c_pitchPrimaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-channel-lum-scale");
			this.c_pitchSecondaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-hue");
			this.c_pitchSecondaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-hue-scale");
			this.c_pitchSecondaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-sat");
			this.c_pitchSecondaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-sat-scale");
			this.c_pitchSecondaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-lum");
			this.c_pitchSecondaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-secondary-note-lum-scale");
			this.c_pitchPrimaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-hue");
			this.c_pitchPrimaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-hue-scale");
			this.c_pitchPrimaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-sat");
			this.c_pitchPrimaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-sat-scale");
			this.c_pitchPrimaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-lum");
			this.c_pitchPrimaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--pitch-primary-note-lum-scale");

			this.c_noiseSecondaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-hue");
			this.c_noiseSecondaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-hue-scale");
			this.c_noiseSecondaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-sat");
			this.c_noiseSecondaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-sat-scale");
			this.c_noiseSecondaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-lum");
			this.c_noiseSecondaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-channel-lum-scale");
			this.c_noisePrimaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-hue");
			this.c_noisePrimaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-hue-scale");
			this.c_noisePrimaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-sat");
			this.c_noisePrimaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-sat-scale");
			this.c_noisePrimaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-lum");
			this.c_noisePrimaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-channel-lum-scale");
			this.c_noiseSecondaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-hue");
			this.c_noiseSecondaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-hue-scale");
			this.c_noiseSecondaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-sat");
			this.c_noiseSecondaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-sat-scale");
			this.c_noiseSecondaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-lum");
			this.c_noiseSecondaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-secondary-note-lum-scale");
			this.c_noisePrimaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-hue");
			this.c_noisePrimaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-hue-scale");
			this.c_noisePrimaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-sat");
			this.c_noisePrimaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-sat-scale");
			this.c_noisePrimaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-lum");
			this.c_noisePrimaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--noise-primary-note-lum-scale");

			this.c_modSecondaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-hue");
			this.c_modSecondaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-hue-scale");
			this.c_modSecondaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-sat");
			this.c_modSecondaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-sat-scale");
			this.c_modSecondaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-lum");
			this.c_modSecondaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-channel-lum-scale");
			this.c_modPrimaryChannelHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-hue");
			this.c_modPrimaryChannelHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-hue-scale");
			this.c_modPrimaryChannelSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-sat");
			this.c_modPrimaryChannelSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-sat-scale");
			this.c_modPrimaryChannelLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-lum");
			this.c_modPrimaryChannelLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-channel-lum-scale");
			this.c_modSecondaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-hue");
			this.c_modSecondaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-hue-scale");
			this.c_modSecondaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-sat");
			this.c_modSecondaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-sat-scale");
			this.c_modSecondaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-lum");
			this.c_modSecondaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-secondary-note-lum-scale");
			this.c_modPrimaryNoteHue = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-hue");
			this.c_modPrimaryNoteHueScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-hue-scale");
			this.c_modPrimaryNoteSat = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-sat");
			this.c_modPrimaryNoteSatScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-sat-scale");
			this.c_modPrimaryNoteLum = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-lum");
			this.c_modPrimaryNoteLumScale = +getComputedStyle(this._styleElement).getPropertyValue("--mod-primary-note-lum-scale");

			if (getComputedStyle(this._styleElement).getPropertyValue("--formula-pitch-channel-count-override") != "") this.c_pitchChannelCountOverride = +getComputedStyle(this._styleElement).getPropertyValue("--formula-pitch-channel-count-override");
			if (getComputedStyle(this._styleElement).getPropertyValue("--formula-noise-channel-count-override") != "") this.c_noiseChannelCountOverride = +getComputedStyle(this._styleElement).getPropertyValue("--formula-noise-channel-count-override");
			if (getComputedStyle(this._styleElement).getPropertyValue("--formula-mod-channel-count-override") != "") this.c_modChannelCountOverride = +getComputedStyle(this._styleElement).getPropertyValue("--formula-mod-channel-count-override");
        }

    }

    public static getComputed(name: string): string {
        return getComputedStyle(this._styleElement).getPropertyValue(name);
    }
}

