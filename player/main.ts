// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Dictionary, DictionaryArray, EnvelopeType, InstrumentType, Transition, Chord, Envelope, Config } from "../synth/SynthConfig";
import { ColorConfig } from "../editor/ColorConfig";
import { NotePin, Note, Pattern, Instrument, Channel, Synth, Song } from "../synth/synth";
import "./style";
import { oscilascopeCanvas } from "../global/Oscilascope";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { SongPlayerLayout } from "./Layout";

const {a, button, div, h1, input, canvas, form, label, h2} = HTML;
const {svg, circle, rect, path} = SVG;

const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|android|ipad|playbook|silk/i.test(navigator.userAgent);

const colorTheme: string | null = getLocalStorage("colorTheme");
const setSpLayout: string | null = getLocalStorage("spLayout");
ColorConfig.setTheme(colorTheme === null ? "dark classic" : colorTheme);
SongPlayerLayout.setLayout(setSpLayout === null ? "classic" : setSpLayout);

let prevHash: string | null = null;
let id: string = ((Math.random() * 0xffffffff) >>> 0).toString(16);
let pauseButtonDisplayed: boolean = false;
let animationRequest: number | null;
let zoomEnabled: boolean = false;
let timelineWidth: number = 1;
let outVolumeHistoricTimer: number = 0;
let outVolumeHistoricCap: number = 0;

const synth: Synth = new Synth();
const oscilascope: oscilascopeCanvas = new oscilascopeCanvas(canvas({ width: isMobile? 144:288, height: isMobile?32:64, style: `border:2px solid ${ColorConfig.uiWidgetBackground}; overflow: hidden;` , id: "oscilascopeAll" }), isMobile?1:2);
const showOscilloscope: boolean = getLocalStorage("showOscilloscope") != "false";
if (!showOscilloscope) {
	oscilascope.canvas.style.display = "none";
	synth.oscEnabled = false;
}

const closePrompt: HTMLButtonElement = button({class: "closePrompt",style: "width: 32px; height: 32px; float: right; position: absolute; top: 8px; right: 8px;"});
const _okayButton: HTMLButtonElement = button({class: "okayButton", style: "width: 45%; height: 32px;"}, "Okay");

const _form: HTMLFormElement = form({style: "display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;"},
		label({class: "layout-option",style:"width:90px; color: var(--secondary-text)"},
			input({type: "radio", name: "spLayout", value: "classic", style:"display:none;"}),
			SVG(`\
				<svg viewBox="-1 -1 28 22">
				<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
				<rect x="2" y="3" width="22" height="1" fill="currentColor"/>
				<rect x="2" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="23" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="2" y="11" width="22" height="1" fill="currentColor"/>

				<rect x="2" y="5" width="22" height="1" fill="currentColor"/>
				<rect x="2" y="7" width="22" height="1" fill="currentColor"/>
				<rect x="2" y="9" width="22" height="1" fill="currentColor"/>

				<rect x="2" y="15" width="22" height="3" fill="currentColor"/>
				</svg>
			`),
			div("Classic"),
		),
		label({class: "layout-option",style:"width:90px; color: var(--secondary-text)"},
			input({type: "radio", name: "spLayout", value: "top",style:"display:none;"}),
			SVG(`\
				<svg viewBox="-1 -1 28 22">
					<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
					<rect x="2" y="2" width="22" height="3" fill="currentColor"/>

					<rect x="2" y="8" width="22" height="1" fill="currentColor"/>
					<rect x="2" y="9" width="1" height="7" fill="currentColor"/>
					<rect x="23" y="9" width="1" height="7" fill="currentColor"/>
					<rect x="2" y="16" width="22" height="1" fill="currentColor"/>

					<rect x="2" y="10" width="22" height="1" fill="currentColor"/>
					<rect x="2" y="12" width="22" height="1" fill="currentColor"/>
					<rect x="2" y="14" width="22" height="1" fill="currentColor"/>
				</svg>
			`),
			div("Top"),
		),
		label({class: "layout-option",style:"width:90px; color: var(--secondary-text)"},
			input({type: "radio", name: "spLayout", value: "shitbox4", style:"display:none;"}),
			SVG(`\
				<svg viewBox="-1 -1 28 22">
					<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
					<rect x="2" y="15" width="22" height="3" fill="currentColor"/>

					<rect x="2" y="2"  width="22" height="1" fill="currentColor" style="transform: skew(0.1deg,10deg);"/>
					<rect x="2" y="3"  width="1"  height="5" fill="currentColor" style="transform: skew(0.1deg,10deg);"/>
					<rect x="23" y="3" width="1" height="5" fill="currentColor" style="transform: skew(0.1deg,10deg);"/>
					<rect x="2" y="8"  width="22" height="1" fill="currentColor" style="transform: skew(0.1deg,10deg);"/>

					<rect x="2" y="6" width="22" height="1" fill="currentColor" style="transform: skew(0.1deg,10deg);"/>
					<rect x="2" y="4" width="22" height="1" fill="currentColor" style="transform: skew(0.1deg,10deg);"/>
				</svg>
			`),
			div("shitBox4"),
		),
		label({class: "layout-option",style:"width:90px; color: var(--secondary-text)"},
			input({type: "radio", name: "spLayout", value: "boxbeep", style:"display:none;"}),
			SVG(`\
			<svg viewBox="-1 -1 28 22">
			<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
				<rect x="2" y="3" width="22" height="1" fill="currentColor"/>
				<rect x="2" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="23" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="2" y="11" width="22" height="1" fill="currentColor"/>

				<rect x="2" y="5" width="18" height="1" fill="currentColor"/>
				<rect x="2" y="7" width="18" height="1" fill="currentColor"/>
				<rect x="2" y="9" width="18" height="1" fill="currentColor"/>

				<rect x="21" y="5" width="1" height="5" fill="currentColor"/>

				<rect x="2" y="15" width="22" height="3" fill="currentColor"/>
			</svg>
			`),
			div("BoxBeep"),
		),
		label({class: "layout-option",style:"width:90px; color: var(--secondary-text)"},
			input({type: "radio", name: "spLayout", value: "piano", style:"display:none;"}),
			SVG(`\
			<svg viewBox="-1 -1 28 22">
				<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
				<rect x="4" y="3" width="20" height="1" fill="currentColor"/>
				<rect x="2" y="3" width="1" height="9" fill="currentColor"/>
				<rect x="23" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="4" y="11" width="20" height="1" fill="currentColor"/>

				<rect x="4" y="5" width="20" height="1" fill="currentColor"/>
				<rect x="4" y="7" width="20" height="1" fill="currentColor"/>
				<rect x="4" y="9" width="20" height="1" fill="currentColor"/>

				<rect x="2" y="15" width="22" height="3" fill="currentColor"/>
				</svg>
			`),
			div("Music Box"),
		),
		label({class: "layout-option",style:"width:90px; color: var(--secondary-text)"},
			input({type: "radio", name: "spLayout", value: "vertical", style:"display:none;"}),
			SVG(`\
			<svg viewBox="-1 -1 28 22">
				<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
				<rect x="2" y="3" width="22" height="1" fill="currentColor"/>
				<rect x="2" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="23" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="2" y="11" width="22" height="1" fill="currentColor"/>

				<rect x="5" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="8" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="12" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="16" y="4" width="1" height="7" fill="currentColor"/>
				<rect x="20" y="4" width="1" height="7" fill="currentColor"/>

				<rect x="2" y="15" width="22" height="3" fill="currentColor"/>
				</svg>
			`),
			div("Vertical"),
		),
		label({class: "layout-option",style:"width:90px; color: var(--secondary-text)"},
			input({type: "radio", name: "spLayout", value: "middle", style:"display:none;"}),
			SVG(`\
			<svg viewBox="-1 -1 28 22">
			<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
			<rect x="4" y="3" width="8" height="1" fill="currentColor"/>

			<rect x="2" y="3" width="1" height="9" fill="currentColor"/>

			<rect x="13" y="3" width="1" height="9" fill="currentColor"/>

			<rect x="23" y="3" width="1" height="9" fill="currentColor"/>

			<rect x="4" y="11" width="8" height="1" fill="currentColor"/>
			<rect x="4" y="5" width="8" height="1" fill="currentColor"/>
			<rect x="4" y="7" width="8" height="1" fill="currentColor"/>
			<rect x="4" y="9" width="8" height="1" fill="currentColor"/>

			<rect x="15" y="3" width="7" height="1" fill="currentColor"/>
			<rect x="15" y="11" width="7" height="1" fill="currentColor"/>
			<rect x="15" y="5" width="7" height="1" fill="currentColor"/>
			<rect x="15" y="7" width="7" height="1" fill="currentColor"/>
			<rect x="15" y="9" width="7" height="1" fill="currentColor"/>

			<rect x="2" y="15" width="22" height="3" fill="currentColor"/>
				</svg>
			`),
			div("Middle"),
		),
	);

	const layoutContainer: HTMLDivElement = div({class: "prompt noSelection", style: "width: 300px; margin: auto;text-align: center;background: var(--editor-background); border-radius: 15px; border: 4px solid var(--ui-widget-background); color: var(--primary-text); padding: 20px; display: flex; flex-direction: column; position: relative; box-shadow: 5px 5px 20px 10px rgba(0,0,0,0.5);"},
		div({class:"promptTitle"}, h2({class:"layoutExt",style:"text-align: inherit;"}, ""), h2({class:"layoutTitle"}, "Layout")),
			_form,
			div({style: "margin-top: 1em;"},
			_okayButton,
			),
			closePrompt,
	);

	let titleText: HTMLHeadingElement = h1({ style: "flex-grow: 1; margin: 0 1px; margin-left: 10px; overflow: hidden;" }, "");
	let layoutStuffs: HTMLButtonElement = button({class:"songPlayerLayoutsButton", style: "margin: 0 4px; height: 42px; width: 90px;"}, "Layouts");
	let editLink: HTMLAnchorElement = a({target: "_top", style: "margin: 0 4px;"}, "✎ Edit");
	let copyLink: HTMLAnchorElement = a({href: "javascript:void(0)", style: "margin: 0 4px;"}, "⎘ Copy URL");
	let shareLink: HTMLAnchorElement = a({href: "javascript:void(0)", style: "margin: 0 4px;"}, "⤳ Share");
	let fullscreenLink: HTMLAnchorElement = a({target: "_top", style: "margin: 0 4px;"}, "⇱ Fullscreen");
	let shortenSongLink: HTMLAnchorElement = a({ href:"javascript:void(0)", target: "_top", style: "margin: 0 4px;"}, "… Shorten URL");
	//let hideUrlButton: HTMLAnchorElement = a({ href:"javascript:void(0)", target: "_top", style: "margin: 0 4px;"}, "Hide URL");

let draggingPlayhead: boolean = false;
	const playButton: HTMLButtonElement = button({style: "width: 100%; height: 100%; max-height: 50px;"});
	const playButtonContainer: HTMLDivElement = div({class: "playButtonContainer",style: "flex-shrink: 0; display: flex; padding: 2px; width: 80px; height: 100%; box-sizing: border-box; align-items: center;"},
	playButton,
);
	const loopIcon: SVGPathElement = path({d: "M 4 2 L 4 0 L 7 3 L 4 6 L 4 4 Q 2 4 2 6 Q 2 8 4 8 L 4 10 Q 0 10 0 6 Q 0 2 4 2 M 8 10 L 8 12 L 5 9 L 8 6 L 8 8 Q 10 8 10 6 Q 10 4 8 4 L 8 2 Q 12 2 12 6 Q 12 10 8 10 z"});
	const loopButton: HTMLButtonElement = button({title: "loop", style: "background: none; flex: 0 0 12px; margin: 0 3px; width: 12px; height: 12px; display: flex;"}, svg({width: 12, height: 12, viewBox: "0 0 12 12"},
	loopIcon,
));


const volumeIcon: SVGSVGElement = svg({style: "flex: 0 0 12px; margin: 0 1px; width: 12px; height: 12px;", viewBox: "0 0 12 12"},
	path({fill: ColorConfig.uiWidgetBackground, d: "M 1 9 L 1 3 L 4 3 L 7 0 L 7 12 L 4 9 L 1 9 M 9 3 Q 12 6 9 9 L 8 8 Q 10.5 6 8 4 L 9 3 z"}),
);
	
const volumeSlider: HTMLInputElement = input({ title: "volume", type: "range", value: 75, min: 0, max: 75, step: 1, style: "width: 12vw; max-width: 100px; margin: 0 1px;" });

const zoomIcon: SVGSVGElement = svg({width: 12, height: 12, viewBox: "0 0 12 12"},
	circle({cx: "5", cy: "5", r: "4.5", "stroke-width": "1", stroke: "currentColor", fill: "none"}),
	path({stroke: "currentColor", "stroke-width": "2", d: "M 8 8 L 11 11 M 5 2 L 5 8 M 2 5 L 8 5", fill: "none"}),
);
	const zoomButton2: HTMLButtonElement = button({title: "zoom", style: "background: #581b3e; width: 100%; height: 100%; display: none;"}, "Zoom");
	const zoomButton: HTMLButtonElement = button({title: "zoom", style: "background: none; flex: 0 0 12px; margin: 0 3px; width: 12px; height: 12px; display: flex;"},
	zoomIcon,
	zoomButton2,
);

	const timeline: SVGSVGElement = svg({class: "timeline",style: "min-width: 0; min-height: 0; touch-action: pan-y pinch-zoom;"});
	const playhead: HTMLDivElement = div({class: "playhead",style: `position: absolute; left: 0; top: 0; width: 2px; height: 100%; background: ${ColorConfig.playhead}; pointer-events: none;`});
	const piano = svg({ style: "pointer-events: none; display: block; margin: 0 auto;" });
	const pianoContainer = div({ class: "piano", style: "grid-area: piano;" }, piano);
	const timelineContainer: HTMLDivElement = div({class: "timelineContainer",style: "display: flex; flex-grow: 1; flex-shrink: 1; position: relative;"}, timeline, playhead);
	const visualizationContainer: HTMLDivElement = div({class: "visualizer",style: "display: flex; flex-grow: 1; flex-shrink: 1; position: relative; align-items: center; overflow: hidden; grid-area: visualizer;"}, timelineContainer);
	let noteFlashElementsPerBar: (SVGPathElement[])[];
	let currentNoteFlashElements: SVGPathElement[] = [];
	let currentNoteFlashBar: number = -1;
	const notesFlashWhenPlayed: boolean = getLocalStorage("notesFlashWhenPlayed") == "true";

const outVolumeBarBg: SVGRectElement = SVG.rect({ "pointer-events": "none", width: "90%", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetBackground });
const outVolumeBar: SVGRectElement = SVG.rect({ "pointer-events": "none", height: "50%", width: "0%", x: "5%", y: "25%", fill: "url('#volumeGrad2')" });
const outVolumeCap: SVGRectElement = SVG.rect({ "pointer-events": "none", width: "2px", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetFocus });
const stop1: SVGStopElement = SVG.stop({ "stop-color": "lime", offset: "60%" });
const stop2: SVGStopElement = SVG.stop({ "stop-color": "orange", offset: "90%" });
const stop3: SVGStopElement = SVG.stop({ "stop-color": "red", offset: "100%" });
const gradient: SVGGradientElement = SVG.linearGradient({ id: "volumeGrad2", gradientUnits: "userSpaceOnUse" }, stop1, stop2, stop3);
const defs: SVGDefsElement = SVG.defs({}, gradient);
const volumeBarContainer: SVGSVGElement = SVG.svg({ style: `touch-action: none; overflow: hidden; margin: auto;`, width: "160px", height: "10px", preserveAspectRatio: "none" },
	defs,
	outVolumeBarBg,
	outVolumeBar,
	outVolumeCap,
);
const timelineBarProgress: HTMLDivElement = div({ class:`timeline-bar-progress`, style: `pointer-events: none; overflow: hidden; width: 5%; height: 100%; z-index: 5;`});
const timelineBar: HTMLDivElement = div({ style:  `pointer-events: none; overflow: hidden; margin: auto; width: 90%; height: 50%; background: var(--ui-widget-background);`}, timelineBarProgress);
const timelineBarContainer: HTMLDivElement = div({ style: `pointer-events: none; overflow: hidden; margin: auto; width: 160px; height: 10px; `}, timelineBar);
const volumeBarContainerDiv: HTMLDivElement = div({style:"display:flex; flex-direction:column;"}, volumeBarContainer, timelineBarContainer);
const promptContainer: HTMLDivElement = div({class:"promptContainer",style:"display:none; backdrop-filter: saturate(1.5) blur(4px); width: 100%; height: 100%; position: fixed; z-index: 999; display: flex; justify-content: center; align-items: center;"});
promptContainer.style.display = "none";
const songPlayerContainer: HTMLDivElement = div({class:"songPlayerContainer"});
songPlayerContainer.appendChild(visualizationContainer);
songPlayerContainer.appendChild(pianoContainer);
songPlayerContainer.appendChild(
div({class: "control-center",id: "control-center",style: `flex-shrink: 0; height: 20vh; min-height: 22px; max-height: 70px; display: flex; align-items: center; grid-area: control-center;`},
	div({class: "control-center row",id:"row1",style: `display: flex; align-items: center;`},
		playButtonContainer,
		loopButton,
		volumeIcon,
		volumeSlider,
		zoomButton,
		volumeBarContainerDiv,
		oscilascope.canvas, //make it auto remove itself later
		),
		div({class: "control-center row",id:"row2",style: `display: flex; align-items: center;`},
		titleText,
		layoutStuffs,
		editLink,
		copyLink,
		shareLink,
		shortenSongLink,
	),
		div({class: "control-center row",id:"row3",style: `display: flex; align-items: center;`},
		),
),
);
document.body.appendChild(songPlayerContainer);
songPlayerContainer.appendChild(promptContainer);
promptContainer.appendChild(layoutContainer);

// Some browsers have an option to "block third-party cookies" (it's enabled by
// default in icognito Chrome windows) that throws an error on trying to access
// localStorage from cross-domain iframe such as this song player, so wrap the
// access in a try-catch block to ignore the error instead of interrupting
// execution.
function setLocalStorage(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
		// Ignore the error since we can't fix it.
	}
}
function getLocalStorage(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		// Ignore the error since we can't fix it.
		return null;
	}
}

function removeFromUnorderedArray<T>(array: T[], index: number): void {
	if (array.length < 1) {
		// Don't need to do anything when `array` is empty.
		return;
	}
	if (index === array.length - 1) {
		// Trivial case.
		array.pop();
	} else if (index >= 0 && index < array.length - 1) {
		// The idea here is that we want to remove an element from the array
		// quickly, and the fastest way to do that is to use `array.pop()`. As
		// the name of this function says, we assume `array` to be unordered,
		// so this trick is okay to do.
		const lastElement: T = array.pop()!;
		array[index] = lastElement;
	}
}

function loadSong(songString: string, reuseParams: boolean): void {
	synth.setSong(songString);
	synth.snapToStart();
	const updatedSongString: string = synth.song!.toBase64String();
	editLink.href = "../index.html#" + updatedSongString;
	//@jummbus - these lines convert old url vers loaded into the player to the new url ver. The problem is, if special chars are included,
	// they appear to get double-encoded (e.g. the '%' in %20 is encoded again), which breaks the link. Disabled for now until I have a chance
	// to look into it more.
	//const hashQueryParams = new URLSearchParams(reuseParams ? location.hash.slice(1) : "");
	//hashQueryParams.set("song", updatedSongString);
	//location.hash = hashQueryParams.toString();
}
	
function hashUpdatedExternally(): void {
	let myHash: string = location.hash;
	if (prevHash == myHash || myHash == "") return;
		
	prevHash = myHash;
		
	if (myHash.charAt(0) == "#") {
		myHash = myHash.substring(1);
	}
		
	
	fullscreenLink.href = location.href;

	// @TODO: This can be moved back into splitting merely on & once samples
	// are reworked so that the URLs don't clash with the overall URL syntax
	// that's assumed to be respected here (and probably elsewhere...)
	for (const parameter of myHash.split(/&(?=[a-z]+=)/g)) {
		let equalsIndex: number = parameter.indexOf("=");
		if (equalsIndex != -1) {
			let paramName: string = parameter.substring(0, equalsIndex);
			let value: string = parameter.substring(equalsIndex + 1);
			switch (paramName) {
				case "song":
					loadSong(value, true);
					if (synth.song) {
						titleText.textContent = synth.song.title;
					}
					break;
				//case "title":
				//	titleText.textContent = decodeURIComponent(value);
				//	break;
				case "loop":
					synth.loopRepeatCount = (value != "1") ? 0 : -1;
					renderLoopIcon();
					break;
			}
		} else {
			loadSong(myHash, false);
		}
	}
		
	renderTimeline();
}

if (isMobile) {
	const controlCenterId = document.getElementById('control-center');
	const controlCenterRow3 = document.getElementById('row3');
	oscilascope.canvas.style.display = 'none';
	copyLink.style.display = "none";
	controlCenterId!.style.flexDirection = "column";
	layoutStuffs.style.height = "24px";
	zoomButton2.style.display = "unset";
	zoomIcon.style.display = "none";
	zoomButton.style.width = "48px";
	zoomButton.style.height = "19px";
	zoomButton.style.flex = "unset";
	controlCenterRow3?.appendChild(titleText);
} else {
	const controlCenterId = document.getElementById('control-center');
	const controlCenterRow1 = document.getElementById('row1');
	const controlCenterRow3 = document.getElementById('row3');
	controlCenterId!.style.alignItems = "unset";
	controlCenterId!.style.justifyContent = "space-between";
	controlCenterRow1?.appendChild(titleText);
	controlCenterRow3!.style.display = "none";
}

function onWindowResize(): void {
	piano.style.width = "0";
	renderTimeline();
}

function shortenSongPlayerUrl(): void {
	let shortenerStrategy: string = "https://tinyurl.com/api-create.php?url=";
	const localShortenerStrategy: string | null = window.localStorage.getItem("shortenerStrategySelect");

	// if (localShortenerStrategy == "beepboxnet") shortenerStrategy = "https://www.beepbox.net/api-create.php?url=";
	if (localShortenerStrategy == "isgd") shortenerStrategy = "https://is.gd/create.php?format=simple&url=";

	window.open(shortenerStrategy + encodeURIComponent(new URL("#" + synth.song!.toBase64String(), location.href).href));
}

let pauseIfAnotherPlayerStartsHandle: ReturnType<typeof setInterval> | null = null;
function pauseIfAnotherPlayerStarts(): void {
	if (!synth.playing) {
		clearInterval(pauseIfAnotherPlayerStartsHandle!);
		return;
	}

	const storedPlayerId: string | null = getLocalStorage("playerId");
	if (storedPlayerId != null && storedPlayerId != id) {
		onTogglePlay();
		renderPlayhead();
		clearInterval(pauseIfAnotherPlayerStartsHandle!);
	}
}

function animate(): void {
	if (synth.playing) {
		animationRequest = requestAnimationFrame(animate);
		renderPlayhead();

		volumeUpdate();
	}
	if (pauseButtonDisplayed != synth.playing) {
		renderPlayButton();
	}

}

function volumeUpdate(): void {
	if (synth.song == null) {
		outVolumeCap.setAttribute("x", "5%");
		outVolumeBar.setAttribute("width", "0%");
		return;
}
	outVolumeHistoricTimer--;
	if (outVolumeHistoricTimer <= 0) {
		outVolumeHistoricCap -= 0.03;
	}
	if (synth.song.outVolumeCap > outVolumeHistoricCap) {
		outVolumeHistoricCap = synth.song.outVolumeCap;
		outVolumeHistoricTimer = 50;
	}

	animateVolume(synth.song.outVolumeCap, outVolumeHistoricCap);

	if (!synth.playing) {
		outVolumeCap.setAttribute("x", "5%");
		outVolumeBar.setAttribute("width", "0%");
	}
}
	
function animateVolume(useOutVolumeCap: number, historicOutCap: number): void {
	outVolumeBar.setAttribute("width", "" + Math.min(144, useOutVolumeCap * 144));
	outVolumeCap.setAttribute("x", "" + (8 + Math.min(144, historicOutCap * 144)));
}

function onTogglePlay(): void {
	if (synth.song != null) {
		if (animationRequest != null) cancelAnimationFrame(animationRequest);
		animationRequest = null;
		if (synth.playing) {
			synth.pause();
			volumeUpdate();
		} else {
			synth.play();
			setLocalStorage("playerId", id);
			animate();
			clearInterval(pauseIfAnotherPlayerStartsHandle!);
			pauseIfAnotherPlayerStartsHandle = setInterval(pauseIfAnotherPlayerStarts, 100);
		}
	}
	renderPlayButton();
}

function onLayoutButton(): void {
	promptContainer.style.display = "flex";
}

function onExitButton(): void {
	promptContainer.style.display = "none";
}

function onLayoutPicked(): void {
	SongPlayerLayout.setLayout((<any> _form.elements)["spLayout"].value);
	promptContainer.style.display = "none";
	window.localStorage.setItem("spLayout", (<any> _form.elements)["spLayout"].value);
	renderTimeline();
}

// The end of the layout event code.

function onToggleLoop(): void {
	if (synth.loopRepeatCount == -1) {
		synth.loopRepeatCount = 0;
	} else {
		synth.loopRepeatCount = -1;
	}
	renderLoopIcon();
}

function onVolumeChange(): void {
	setLocalStorage("volume", volumeSlider.value);
	setSynthVolume();
}

function onToggleZoom(): void {
	zoomEnabled = !zoomEnabled;
	renderZoomIcon();
	renderTimeline();
}

function onTimelineMouseDown(event: MouseEvent): void {
	draggingPlayhead = true;
	onTimelineMouseMove(event);
}

function onTimelineMouseMove(event: MouseEvent): void {
	if (!draggingPlayhead) return;
	event.preventDefault();
	const useVertical = ((<any> _form.elements)["spLayout"].value == "vertical") || (window.localStorage.getItem("spLayout") == "vertical");
	if (useVertical) {
	onTimelineCursorMove(event.clientY || event.pageY); 
	} else {
	onTimelineCursorMove(event.clientX || event.pageX);	
	}
}

function onTimelineTouchDown(event: TouchEvent): void {
	draggingPlayhead = true;
	onTimelineTouchMove(event);
}

function onTimelineTouchMove(event: TouchEvent): void {
	const useVertical = ((<any> _form.elements)["spLayout"].value == "vertical") || (window.localStorage.getItem("spLayout") == "vertical");
	if (useVertical) {
	onTimelineCursorMove(event.touches[0].clientY); }
	else {
	onTimelineCursorMove(event.touches[0].clientX); }
}

function onTimelineCursorMove(mouseX: number): void {
	if (draggingPlayhead && synth.song != null) {
		
		const boundingRect: DOMRect = visualizationContainer.getBoundingClientRect();
		const useVertical = ((<any> _form.elements)["spLayout"].value == "vertical") || (window.localStorage.getItem("spLayout") == "vertical");
		const useBoxBeep = ((<any> _form.elements)["spLayout"].value == "boxbeep") || (window.localStorage.getItem("spLayout") == "boxbeep");
		if (!useVertical && !useBoxBeep) {
			synth.playhead = synth.song.barCount * (mouseX - boundingRect.left) / (boundingRect.right - boundingRect.left); 
		} else if (useVertical) {
			synth.playhead = synth.song.barCount * (mouseX - boundingRect.bottom) / (boundingRect.top - boundingRect.bottom);	
		} else if (useBoxBeep) {
			synth.playhead = synth.song.barCount * (mouseX - boundingRect.right) / (boundingRect.left - boundingRect.right);	
		}
		synth.computeLatestModValues();
		renderPlayhead();
	}
}

function onTimelineCursorUp(): void {
	draggingPlayhead = false;
}

function setSynthVolume(): void {
	const volume: number = +volumeSlider.value;
	synth.volume = Math.min(1.0, Math.pow(volume / 50.0, 0.5)) * Math.pow(2.0, (volume - 75.0) / 25.0);
}

function renderPlayhead(): void {

	const maxPer = 144;

	if (synth.song != null) {
		let pos: number = synth.playhead / synth.song.barCount;

		timelineBarProgress.style.width = Math.round((maxPer*pos/maxPer)*100)+"%";

		const usePiano = ((<any> _form.elements)["spLayout"].value == "piano") || (window.localStorage.getItem("spLayout") == "piano");
		const useMiddle = ((<any> _form.elements)["spLayout"].value == "middle") || (window.localStorage.getItem("spLayout") == "middle");
		const useVertical = ((<any> _form.elements)["spLayout"].value == "vertical") || (window.localStorage.getItem("spLayout") == "vertical");
		if (usePiano) {
			playhead.style.left = (timelineWidth * pos) + "px"; 
			timelineContainer.style.left = "-"+(timelineWidth * pos) + "px"; 
			timelineContainer.style.bottom = "0";
			timelineContainer.style.top = "0";
		} else if (useMiddle) {
			playhead.style.left = (timelineWidth * pos) + "px"; 
			timelineContainer.style.left = "-"+(timelineWidth * pos) + "px"; 
			timelineContainer.style.bottom = "0";
			timelineContainer.style.top = "0";
		} else if (useVertical) {
			const boundingRect = visualizationContainer.getBoundingClientRect();
			const o = boundingRect.height / 2;
			playhead.style.left = (timelineWidth * pos) + "px";
			timelineContainer.style.bottom = "-" + (timelineWidth * pos) + "px";
			timelineContainer.style.top = (timelineWidth * pos + o) + "px";
		} else {
			playhead.style.left = (timelineWidth * pos) + "px"; 
			timelineContainer.style.left = "0";
			timelineContainer.style.bottom = "0";
			timelineContainer.style.top = "0";

			const boundingRect: DOMRect = visualizationContainer.getBoundingClientRect();
				visualizationContainer.scrollLeft = pos * (timelineWidth - boundingRect.width); 
		}


		if (notesFlashWhenPlayed) {
			const playheadBar: number = Math.floor(synth.playhead);
			const modPlayhead: number = synth.playhead - playheadBar;
			const partsPerBar: number = synth.song.beatsPerBar * Config.partsPerBeat;
			const noteFlashElementsForThisBar: SVGPathElement[] = noteFlashElementsPerBar[playheadBar];

			if (noteFlashElementsForThisBar != null && playheadBar !== currentNoteFlashBar) {
				for (var i = currentNoteFlashElements.length - 1; i >= 0; i--) {
					var element: SVGPathElement = currentNoteFlashElements[i];
					const outsideOfCurrentBar = Number(element.getAttribute("note-bar")) !== playheadBar;
					const isInvisible: boolean = element.style.opacity === "0";
					if (outsideOfCurrentBar && isInvisible) {
						removeFromUnorderedArray(currentNoteFlashElements, i);
					}
				}
				for (var i = 0; i < noteFlashElementsForThisBar.length; i++) {
					var element: SVGPathElement = noteFlashElementsForThisBar[i];
					currentNoteFlashElements.push(element);
				}
			}
			const kc = piano.children.length;
				for (let i = 0; i < kc; i++) {
					const k = piano.children[i];
					const kf = k.getAttribute("original-fill");
					k.setAttribute("fill", kf!);
				}
			if (currentNoteFlashElements != null) {
				for (var i = 0; i < currentNoteFlashElements.length; i++) {
					var element: SVGPathElement = currentNoteFlashElements[i];
					const noteStart: number = Number(element.getAttribute("note-start")) / partsPerBar;
					const noteEnd: number = Number(element.getAttribute("note-end")) / partsPerBar;
					const noteBar: number = Number(element.getAttribute("note-bar"));
					const p = Number(element.getAttribute("note-pitch"));
					const isNoise = element.getAttribute("note-noise") === "true";
					const k = piano.children[p];
					//const kf = k?.getAttribute("original-fill");
					const kf2 = element.getAttribute("note-color")
					if ((modPlayhead >= noteStart) && (noteBar == playheadBar)) {
						const dist: number = noteEnd - noteStart;
						const opacity = (1 - (((modPlayhead - noteStart) - (dist / 2)) / (dist / 2)));
						element.style.opacity = String(opacity);
					if (!isNoise) if (opacity > 0.05) k?.setAttribute("fill", kf2!);
					} else {
						element.style.opacity = "0";
					}
				}
			}
			currentNoteFlashBar = playheadBar;
		}
	}
}

function renderTimeline(): void {
	timeline.innerHTML = "";
	if (synth.song == null) return;

	const boundingRect: DOMRect = visualizationContainer.getBoundingClientRect();
		
	let timelineHeight: number;
	let windowOctaves: number;
	let windowPitchCount: number;

	const useVertical = ((<any> _form.elements)["spLayout"].value == "vertical") || (window.localStorage.getItem("spLayout") == "vertical");
	if (zoomEnabled) {
		timelineHeight = useVertical ? boundingRect.width : boundingRect.height;
		windowOctaves = Math.max(1, Math.min(Config.pitchOctaves, Math.round(timelineHeight / (12 * 2))));
		windowPitchCount = windowOctaves * 12 + 1;
		const semitoneHeight: number = (timelineHeight - 1) / windowPitchCount;
		const targetBeatWidth: number = Math.max(8, semitoneHeight * 4);
		timelineWidth = Math.max(boundingRect.width, targetBeatWidth * synth.song.barCount * synth.song.beatsPerBar);
		if (useVertical) {
			timelineContainer.style.transform = `translateX(-${timelineWidth / 2}px) rotate(-90deg) translateX(${timelineWidth / 2}px) translateY(${timelineHeight / 2}px) scaleY(-1)`; 
			pianoContainer.style.display = "unset";
			if (!isMobile) {
				songPlayerContainer.style.gridTemplateRows = ""; }
			else {
				songPlayerContainer.style.gridTemplateRows = "78vh 0vh 7.4vh";
			}
			} else {
			timelineContainer.style.transform = '';
			pianoContainer.style.display = "none";
			songPlayerContainer.style.gridTemplateRows = "";
			}
	} else {
		pianoContainer.style.display = "none";
		timelineWidth = boundingRect.width;
		const targetSemitoneHeight: number = Math.max(1, timelineWidth / (synth.song.barCount * synth.song.beatsPerBar) / 6.0);
		timelineHeight = Math.min(boundingRect.height, targetSemitoneHeight * (Config.maxPitch + 1) + 1);
		windowOctaves = Math.max(3, Math.min(Config.pitchOctaves, Math.round(timelineHeight / (12 * targetSemitoneHeight))));
		windowPitchCount = windowOctaves * 12 + 1;
		if (useVertical) {
			timelineContainer.style.transform = `translateX(-${timelineWidth / 2}px) rotate(-90deg) translateX(${timelineWidth / 2}px) translateY(${timelineWidth / 2}px) scaleY(-1)`;
			if (isMobile) {
				songPlayerContainer.style.gridTemplateRows = "78vh 0vh 7.4vh"; }
			else {
				songPlayerContainer.style.gridTemplateRows = "92.6vh 0vh 7.4vh";
			}
			} else {
			timelineContainer.style.transform = '';
			songPlayerContainer.style.gridTemplateRows = "";
			}
		
	}

	timelineContainer.style.width = timelineWidth + "px";
	timelineContainer.style.height = timelineHeight + "px";
	timeline.style.width = timelineWidth + "px";
	timeline.style.height = timelineHeight + "px";
		
	const barWidth: number = timelineWidth / synth.song.barCount;
	const partWidth: number = barWidth / (synth.song.beatsPerBar * Config.partsPerBeat);

		const wavePitchHeight: number = (timelineHeight-1) / windowPitchCount;
		const drumPitchHeight: number =  (timelineHeight-1) / Config.drumCount;

	for (let bar: number = 0; bar < synth.song.barCount + 1; bar++) {
		const color: string = (bar == synth.song.loopStart || bar == synth.song.loopStart + synth.song.loopLength) ? ColorConfig.loopAccent : ColorConfig.uiWidgetBackground;
			timeline.appendChild(rect({x: bar * barWidth - 1, y: 0, width: 2, height: timelineHeight, fill: color}));
	}
		
	for (let octave: number = 0; octave <= windowOctaves; octave++) {
		timeline.appendChild(rect({x: 0, y: octave * 12 * wavePitchHeight, width: timelineWidth, height: wavePitchHeight + 1, fill: ColorConfig.tonic, opacity: 0.75}));
	} 
	// note flash colors
	let noteFlashColor: string = "#ffffff";
	let noteFlashColorSecondary: string = "#ffffff77";
	if (notesFlashWhenPlayed) {
		noteFlashColor = ColorConfig.getComputed("--note-flash") !== "" ? "var(--note-flash)" : "#ffffff";
		noteFlashColorSecondary = ColorConfig.getComputed("--note-flash-secondary") !== "" ? "var(--note-flash-secondary)" : "#ffffff77";
	}

	if (notesFlashWhenPlayed) {
		noteFlashElementsPerBar = [];
		for (let bar: number = 0; bar < synth.song.barCount; bar++) {
			noteFlashElementsPerBar.push([]);
		}
		currentNoteFlashBar = -1;
	}

	for (let channel: number = synth.song.channels.length - 1 - synth.song.modChannelCount; channel >= 0; channel--) {

		const isNoise: boolean = synth.song.getChannelIsNoise(channel);
		const pitchHeight: number = isNoise ? drumPitchHeight : wavePitchHeight;
			
		const configuredOctaveScroll: number = synth.song.channels[channel].octave;
		const newOctaveScroll: number = Math.max(0, Math.min(Config.pitchOctaves - windowOctaves, Math.ceil(configuredOctaveScroll - windowOctaves * 0.5)));
			
		const offsetY: number = newOctaveScroll * pitchHeight * 12 + timelineHeight - pitchHeight * 0.5 - 0.5;
		
		for (let bar: number = 0; bar < synth.song.barCount; bar++) {
			const pattern: Pattern | null = synth.song.getPattern(channel, bar);
			if (pattern == null) continue;
			const offsetX: number = bar * barWidth;
				
			for (let i: number = 0; i < pattern.notes.length; i++) {
				const note: Note = pattern.notes[i];
					
				for (const pitch of note.pitches) {
					const d: string = drawNote(pitch, note.start, note.pins, (pitchHeight + 1) / 2, offsetX, offsetY, partWidth, pitchHeight);
						const noteElement: SVGPathElement = path({d: d, fill: ColorConfig.getChannelColor(synth.song, channel).primaryChannel});
					if (isNoise) noteElement.style.opacity = String(0.6);
					timeline.appendChild(noteElement);

						if (notesFlashWhenPlayed) {
						const dflash: string = drawNote(pitch, note.start, note.pins, (pitchHeight + 1) / 2, offsetX, offsetY, partWidth, pitchHeight);
						//const noteFlashColorSecondary = ColorConfig.getComputed("--note-flash-secondary") !== "" ? "var(--note-flash-secondary)" : "#ffffff77";
						//const noteFlashColor = ColorConfig.getComputed("--note-flash") !== "" ? "var(--note-flash)" : "#ffffff77";
						const noteFlashElement: SVGPathElement = path({d: dflash, fill: (isNoise ? noteFlashColorSecondary : noteFlashColor)});
						noteFlashElement.style.opacity = "0";
						noteFlashElement.setAttribute('note-start', String(note.start));
						noteFlashElement.setAttribute('note-end', String(
							note.end
							));
						noteFlashElement.setAttribute('note-pitch', String(pitch));
						noteFlashElement.setAttribute('note-noise', String(isNoise));
						noteFlashElement.setAttribute('note-bar', String(bar));
						noteFlashElement.setAttribute('note-color', String(noteElement.getAttribute("fill")));
						timeline.appendChild(noteFlashElement);
						const noteFlashElementsForThisBar: SVGPathElement[] = noteFlashElementsPerBar[bar];
						noteFlashElementsForThisBar.push(noteFlashElement);
					}
				}
			}
		}

		const useClassic = ((<any> _form.elements)["spLayout"].value == "classic") || (window.localStorage.getItem("spLayout") == "classic");
		const useTop = ((<any> _form.elements)["spLayout"].value == "top") || (window.localStorage.getItem("spLayout") == "top");
		const useShitbox4 = ((<any> _form.elements)["spLayout"].value == "shitbox4") || (window.localStorage.getItem("spLayout") == "shitbox4");
		const useBoxBeep = ((<any> _form.elements)["spLayout"].value == "boxbeep") || (window.localStorage.getItem("spLayout") == "boxbeep");
		const useMusicbox = ((<any> _form.elements)["spLayout"].value == "piano") || (window.localStorage.getItem("spLayout") == "piano");
		const useVertical = ((<any> _form.elements)["spLayout"].value == "vertical") || (window.localStorage.getItem("spLayout") == "vertical");
		const useMiddle = ((<any> _form.elements)["spLayout"].value == "middle") || (window.localStorage.getItem("spLayout") == "middle");
	
		if (isMobile) { 
			if (useClassic || useBoxBeep || useShitbox4 || useMusicbox || useMiddle) {
				songPlayerContainer.style.gridTemplateRows = "78vh 7.4vh";
			} else if (useTop) {
				songPlayerContainer.style.gridTemplateRows = "7.4vh 78vh";
			} else if (!useClassic && !useBoxBeep && !useShitbox4 && !useMusicbox && !useMiddle && !useVertical) {
				songPlayerContainer.style.gridTemplateRows = "78vh 7.4vh";
			}
		}

}

	renderPlayhead();
	const pianoContainerBoundingRect = pianoContainer.getBoundingClientRect();
	renderPiano(piano, timelineHeight, pianoContainerBoundingRect.height, windowOctaves, synth.song);
}
	
function drawNote(pitch: number, start: number, pins: NotePin[], radius: number, offsetX: number, offsetY: number, partWidth: number, pitchHeight: number): string {
	let d: string = `M ${offsetX + partWidth * (start + pins[0].time)} ${offsetY - pitch * pitchHeight + radius * (pins[0].size / Config.noteSizeMax)} `; 
	for (let i: number = 0; i < pins.length; i++) {
		const pin: NotePin = pins[i];
			const x:   number = offsetX + partWidth * (start + pin.time);
		const y: number = offsetY - pitchHeight * (pitch + pin.interval);
		const expression: number = pin.size / Config.noteSizeMax;
		d += `L ${x} ${y - radius * expression} `;
	}
	for (let i: number = pins.length - 1; i >= 0; i--) {
		const pin: NotePin = pins[i];
			const x:   number = offsetX + partWidth * (start + pin.time);
		const y: number = offsetY - pitchHeight * (pitch + pin.interval);
		const expression: number = pin.size / Config.noteSizeMax;
		d += `L ${x} ${y + radius * expression} `;
	}
	return d;
}
	
function renderPiano(element: SVGSVGElement, width: number, height: number, octaves: number, song: Song): void {
	if (song == null) return;
	element.innerHTML = "";
	element.style.width = width + "px";
	element.style.height = height + "px";
	const kc = octaves * 12 + 1;
	const kw = width / kc;
	const kh = height;
	for (let i = 0; i < kc; i++) {
		const pitchNameIndex = (i + Config.keys[song.key].basePitch) % Config.pitchesPerOctave;
		const isWhiteKey = Config.keys[pitchNameIndex].isWhiteKey;
		const color = isWhiteKey ? "white" : "black";
		element.appendChild(rect({
			x: i / kc * width,
			y: 0,
			width: kw,
			height: kh,
			stroke: "rgba(0, 0, 0, 0.5)",
			"stroke-width": 2,
			"original-fill": color,
			fill: color,
		}));
	}
}

function renderPlayButton(): void {
	if (synth.playing) {
		playButton.classList.remove("playButton");
		playButton.classList.add("pauseButton");
		playButton.title = "Pause (Space)";
		playButton.textContent = "Pause";
	} else {
		playButton.classList.remove("pauseButton");
		playButton.classList.add("playButton");
		playButton.title = "Play (Space)";
		playButton.textContent = "Play";
	}
	pauseButtonDisplayed = synth.playing;
}

function renderLoopIcon(): void {
	loopIcon.setAttribute("fill", (synth.loopRepeatCount == -1) ? ColorConfig.linkAccent : ColorConfig.uiWidgetBackground);
}

function renderZoomIcon(): void {
	zoomIcon.style.color = zoomEnabled ? ColorConfig.linkAccent : ColorConfig.uiWidgetBackground;
}

function onKeyPressed(event: KeyboardEvent): void {
	switch (event.keyCode) {
		case 70: // first bar
			synth.playhead = 0;
			synth.computeLatestModValues();
			event.preventDefault();
			break;
		case 32: // space
			onTogglePlay();
			synth.computeLatestModValues();
			event.preventDefault();
			break;
		case 219: // left brace
			synth.goToPrevBar();
			synth.computeLatestModValues();
			renderPlayhead();
			event.preventDefault();
			break;
		case 221: // right brace
			synth.goToNextBar();
			synth.computeLatestModValues();
			renderPlayhead();
			event.preventDefault();
			break;
	}
}

function onCopyClicked(): void {
	// Set as any to allow compilation without clipboard types (since, uh, I didn't write this bit and don't know the proper types library) -jummbus
	let nav: any;
	nav = navigator;

	if (nav.clipboard && nav.clipboard.writeText) {
		nav.clipboard.writeText(location.href).catch(() => {
			window.prompt("Copy to clipboard:", location.href);
		});
		return;
	}
	const textField: HTMLTextAreaElement = document.createElement("textarea");
	textField.textContent = location.href;
	document.body.appendChild(textField);
	textField.select();
	const succeeded: boolean = document.execCommand("copy");
	textField.remove();
	if (!succeeded) window.prompt("Copy this:", location.href);
}

function onShareClicked(): void {
	(<any>navigator).share({ url: location.href });
}

	if ( top !== self ) {
	// In an iframe.
	copyLink.style.display = "none";
	shareLink.style.display = "none";
} else {
	// Fullscreen.
	fullscreenLink.style.display = "none";
	if (!("share" in navigator)) shareLink.style.display = "none";
}

if (getLocalStorage("volume") != null) {
	volumeSlider.value = getLocalStorage("volume")!;
}
setSynthVolume();

window.addEventListener("resize", onWindowResize);
window.addEventListener("keydown", onKeyPressed);

timeline.addEventListener("mousedown", onTimelineMouseDown);
window.addEventListener("mousemove", onTimelineMouseMove);
window.addEventListener("mouseup", onTimelineCursorUp);
timeline.addEventListener("touchstart", onTimelineTouchDown);
timeline.addEventListener("touchmove", onTimelineTouchMove);
timeline.addEventListener("touchend", onTimelineCursorUp);
timeline.addEventListener("touchcancel", onTimelineCursorUp);

document.addEventListener('visibilitychange', e=>{
	if (document.visibilityState === 'visible') {
		if (getLocalStorage("spLayout") != (<any> _form.elements)["spLayout"].value) {
			(<any> _form.elements)["spLayout"].value = getLocalStorage("spLayout");
			SongPlayerLayout.setLayout((<any> _form.elements)["spLayout"].value);
			renderTimeline();
		}
   }
})

layoutStuffs.addEventListener("click", onLayoutButton);
closePrompt.addEventListener("click", onExitButton);
_okayButton.addEventListener("click", onLayoutPicked);
playButton.addEventListener("click", onTogglePlay);
loopButton.addEventListener("click", onToggleLoop);
volumeSlider.addEventListener("input", onVolumeChange);
zoomButton.addEventListener("click", onToggleZoom);
copyLink.addEventListener("click", onCopyClicked);
shareLink.addEventListener("click", onShareClicked);
window.addEventListener("hashchange", hashUpdatedExternally);
shortenSongLink.addEventListener("click", shortenSongPlayerUrl);

hashUpdatedExternally();
renderLoopIcon();
renderZoomIcon();
renderPlayButton();

// When compiling synth.ts as a standalone module named "beepbox", expose these classes as members to JavaScript:
	export {Dictionary, DictionaryArray, EnvelopeType, InstrumentType, Transition, Chord, Envelope, Config, NotePin, Note, Pattern, Instrument, Channel, Synth};