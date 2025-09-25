/*!
Copyright (c) 2012-2022 John Nesky and contributing authors

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/

export interface Dictionary<T> {
    [K: string]: T;
}

// @TODO: Not ideal to make this writable like this.
// export interface DictionaryArray<T> extends ReadonlyArray<T> {
export interface DictionaryArray<T> extends Array<T> {
    dictionary: Dictionary<T>;
}

export const enum FilterType {
    lowPass,
    highPass,
    peak,
    length,
}

export const enum SustainType {
	bright,
	acoustic,
	length,
}

export const enum EnvelopeType {
	noteSize,
    none,
	punch,
	flare,
	twang,
	swell,
	tremolo,
	tremolo2,
    decay,
    wibble,
    hard,
    linear,
    rise,
    blip
}

export const enum InstrumentType {
    chip,
    fm,
    noise,
    spectrum,
    drumset,
    harmonics,
    pwm,
    pickedString,
    supersaw,
    customChipWave,
    mod,
	fm6op,
    length,
}

export const TypePresets: ReadonlyArray<string> = ["chip", "FM", "noise", "spectrum", "drumset", "harmonics", "pulse width", "picked string", "supersaw", "chip (custom)", "mod", "FM (6-op)"];

export const enum DropdownID {
    Vibrato = 0,
    Pan = 1,
    Chord = 2,
    Transition = 3,
    FM = 4,
    PulseWidth = 5,
    Unison = 6,
    Envelope = 7,

}

export const enum EffectType {
    reverb,
    chorus,
    panning,
    distortion,
    bitcrusher,
    noteFilter,
    echo,
    pitchShift,
    detune,
    vibrato,
    transition,
    chord,
    // If you add more, you'll also have to extend the bitfield used in Base64 which currently uses two six-bit characters.
    length,
}

export const enum EnvelopeComputeIndex {
    noteVolume,
    noteFilterAllFreqs,
    pulseWidth,
    stringSustain,
    unison,
    operatorFrequency0, operatorFrequency1, operatorFrequency2, operatorFrequency3, operatorFrequency4, operatorFrequency5,
    operatorAmplitude0, operatorAmplitude1, operatorAmplitude2, operatorAmplitude3, operatorAmplitude4, operatorAmplitude5,
    feedbackAmplitude,
    pitchShift,
    detune,
    vibratoDepth,
    noteFilterFreq0, noteFilterFreq1, noteFilterFreq2, noteFilterFreq3, noteFilterFreq4, noteFilterFreq5, noteFilterFreq6, noteFilterFreq7,
    noteFilterGain0, noteFilterGain1, noteFilterGain2, noteFilterGain3, noteFilterGain4, noteFilterGain5, noteFilterGain6, noteFilterGain7,
    decimalOffset,
    supersawDynamism,
	supersawSpread,
	supersawShape,
    length,
}

/*
export const enum InstrumentAutomationIndex {
    mixVolume,
    eqFilterAllFreqs,
    eqFilterFreq0, eqFilterFreq1, eqFilterFreq2, eqFilterFreq3, eqFilterFreq4, eqFilterFreq5, eqFilterFreq6, eqFilterFreq7,
    eqFilterGain0, eqFilterGain1, eqFilterGain2, eqFilterGain3, eqFilterGain4, eqFilterGain5, eqFilterGain6, eqFilterGain7,
    distortion,
    bitcrusherQuantization,
    bitcrusherFrequency,
    panning,
    chorus,
    echoSustain,
    //echoDelay, // Wait until tick settings can be computed once for multiple run lengths.
    reverb,
    length,
}
*/

export interface BeepBoxOption {
    readonly index: number;
    readonly name: string;
}

export interface Scale extends BeepBoxOption {
    readonly flags: ReadonlyArray<boolean>;
    readonly realName: string;
}

export interface Key extends BeepBoxOption {
    readonly isWhiteKey: boolean;
    readonly basePitch: number;
}

export interface Rhythm extends BeepBoxOption {
    readonly stepsPerBeat: number;
    readonly roundUpThresholds: number[] | null;
}

export interface ChipWave extends BeepBoxOption {
    readonly expression: number;
    samples: Float32Array;
    isPercussion?: boolean;
    isCustomSampled?: boolean;
    isSampled?: boolean;
    extraSampleDetune?: number;
    rootKey?: number;
    sampleRate?: number;
}

export interface OperatorWave extends BeepBoxOption {
    samples: Float32Array;
}

export interface ChipNoise extends BeepBoxOption {
    readonly expression: number;
    readonly basePitch: number;
    readonly pitchFilterMult: number;
    readonly isSoft: boolean;
    samples: Float32Array | null;
}

export interface Transition extends BeepBoxOption {
    readonly isSeamless: boolean;
    readonly continues: boolean;
    readonly slides: boolean;
    readonly slideTicks: number;
    readonly includeAdjacentPatterns: boolean;
}

export interface Vibrato extends BeepBoxOption {
    readonly amplitude: number;
    readonly type: number;
    readonly delayTicks: number;
}

export interface VibratoType extends BeepBoxOption {
    readonly periodsSeconds: number[];
    readonly period: number;
}

export interface Unison extends BeepBoxOption {
    readonly voices: number;
    readonly spread: number;
    readonly offset: number;
    readonly expression: number;
    readonly sign: number;
}

export interface Modulator extends BeepBoxOption {
    readonly name: string; // name that shows up in song editor UI
    readonly pianoName: string; // short name that shows up in mod piano UI
    readonly maxRawVol: number; // raw
    readonly newNoteVol: number; // raw
    readonly forSong: boolean; // true - setting is song scope
    convertRealFactor: number; // offset that needs to be applied to get a "real" number display of value, for UI purposes
    readonly associatedEffect: EffectType; // effect that should be enabled for this modulator to work properly. If unused, set to EffectType.length.
    readonly promptName: string; // long-as-needed name that shows up in tip prompt
    readonly promptDesc: string[]; // paragraph(s) describing how to use this mod
    invertSliderIndicator?: boolean; // for whether or not you want to invert the slider indicator

}

export interface Chord extends BeepBoxOption {
    readonly customInterval: boolean;
    readonly arpeggiates: boolean;
    readonly strumParts: number;
    readonly singleTone: boolean;
}

export interface Algorithm extends BeepBoxOption {
    readonly carrierCount: number;
    readonly associatedCarrier: ReadonlyArray<number>;
    readonly modulatedBy: ReadonlyArray<ReadonlyArray<number>>;
}

export interface OperatorFrequency extends BeepBoxOption {
    readonly mult: number;
    readonly hzOffset: number;
    readonly amplitudeSign: number;
}

export interface Feedback extends BeepBoxOption {
    readonly indices: ReadonlyArray<ReadonlyArray<number>>;
}

export interface Envelope extends BeepBoxOption {
    readonly type: EnvelopeType;
    readonly speed: number;
}

export interface AutomationTarget extends BeepBoxOption {
    readonly computeIndex: EnvelopeComputeIndex /*| InstrumentAutomationIndex*/ | null;
    readonly displayName: string;
    //readonly perNote: boolean; // Whether to compute envelopes on a per-note basis.
    readonly interleave: boolean; // Whether to interleave this target with the next one in the menu (e.g. filter frequency and gain).
	readonly isFilter: boolean; // Filters are special because the maxCount depends on other instrument settings.
	//readonly range: number | null; // set if automation is allowed.
    readonly maxCount: number;
    readonly effect: EffectType | null;
    readonly compatibleInstruments: InstrumentType[] | null;
}

export const enum SampleLoadingStatus {
    loading,
    loaded,
    error,
}

export function getSampleLoadingStatusName(status: SampleLoadingStatus): string {
    switch (status) {
	case SampleLoadingStatus.loading: return "loading";
	case SampleLoadingStatus.loaded: return "loaded";
	case SampleLoadingStatus.error: return "error";
    }
}

export class SampleLoadingState {
    public statusTable: Dictionary<SampleLoadingStatus>;
    public urlTable: Dictionary<string>;
    public totalSamples: number;
    public samplesLoaded: number;

    constructor() {
	this.statusTable = {};
	this.urlTable = {};
	this.totalSamples = 0;
	this.samplesLoaded = 0;
    }
}

export const sampleLoadingState: SampleLoadingState = new SampleLoadingState();

export class SampleLoadedEvent extends Event {
    public readonly totalSamples: number;
    public readonly samplesLoaded: number;

    constructor(totalSamples: number, samplesLoaded: number) {
	super("sampleloaded");
	this.totalSamples = totalSamples;
	this.samplesLoaded = samplesLoaded;
    }
}

export interface SampleLoadEventMap {
    "sampleloaded": SampleLoadedEvent;
}

export class SampleLoadEvents extends EventTarget {
    constructor() {
	super();
    }
}

export const sampleLoadEvents: SampleLoadEvents = new SampleLoadEvents();

export async function startLoadingSample(url: string, chipWaveIndex: number, presetSettings: Dictionary<any>, rawLoopOptions: any, customSampleRate: number): Promise<void> {
    // @TODO: Make parts of the code that expect everything to already be
    // in memory work correctly.
    // It would be easy to only instantiate `SongEditor` and company after
    // everything is loaded, but if dynamic sample loading without a reload
    // is deemed necessary, anything that involves chip waves has to be
    // revisited so as to be able to work with a changing list of chip
    // waves that may or may not be ready to be used.
    const sampleLoaderAudioContext = new AudioContext({ sampleRate: customSampleRate });
    let closedSampleLoaderAudioContext: boolean = false;
    const chipWave = Config.chipWaves[chipWaveIndex];
    const rawChipWave = Config.rawChipWaves[chipWaveIndex];
    const rawRawChipWave = Config.rawRawChipWaves[chipWaveIndex];
    if (OFFLINE) {
        if (url.slice(0, 5) === "file:") {
            const dirname = await getDirname();
            const joined = await pathJoin(dirname, url.slice(5));
            url = joined;
        }
    }
    fetch(url).then((response) => {
	if (!response.ok) {
	    // @TODO: Be specific with the error handling.
	    sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.error;
	    return Promise.reject(new Error("Couldn't load sample"));
	}
	return response.arrayBuffer();
    }).then((arrayBuffer) => {
	return sampleLoaderAudioContext.decodeAudioData(arrayBuffer);
    }).then((audioBuffer) => {
	// @TODO: Downmix.
	const samples = centerWave(Array.from(audioBuffer.getChannelData(0)));
	const integratedSamples = performIntegral(samples);
	chipWave.samples = integratedSamples;
	rawChipWave.samples = samples;
	rawRawChipWave.samples = samples;
	if (rawLoopOptions["isUsingAdvancedLoopControls"]) {
	    presetSettings["chipWaveLoopStart"] = rawLoopOptions["chipWaveLoopStart"] != null ? rawLoopOptions["chipWaveLoopStart"] : 0;
	    presetSettings["chipWaveLoopEnd"] = rawLoopOptions["chipWaveLoopEnd"] != null ? rawLoopOptions["chipWaveLoopEnd"] : samples.length - 1;
	    presetSettings["chipWaveLoopMode"] = rawLoopOptions["chipWaveLoopMode"] != null ? rawLoopOptions["chipWaveLoopMode"] : 0;
	    presetSettings["chipWavePlayBackwards"] = rawLoopOptions["chipWavePlayBackwards"];
	    presetSettings["chipWaveStartOffset"] = rawLoopOptions["chipWaveStartOffset"] != null ? rawLoopOptions["chipWaveStartOffset"] : 0;
	}
	sampleLoadingState.samplesLoaded++;
	sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.loaded;
	sampleLoadEvents.dispatchEvent(new SampleLoadedEvent(
	    sampleLoadingState.totalSamples,
	    sampleLoadingState.samplesLoaded
	));
	if (!closedSampleLoaderAudioContext) {
	    closedSampleLoaderAudioContext = true;
	    sampleLoaderAudioContext.close();
	}
    }).catch((error) => {
	//console.error(error);
	sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.error;
	alert("Failed to load " + url + ":\n" + error);
	if (!closedSampleLoaderAudioContext) {
	    closedSampleLoaderAudioContext = true;
	    sampleLoaderAudioContext.close();
	}
    });
}

export function getLocalStorageItem<T>(key: string, defaultValue: T): T | string {
    let value: T | string | null = localStorage.getItem(key);
    if (value == null || value === "null" || value === "undefined") {
        value = defaultValue;
    }
    return value;
}

// @HACK: This just assumes these exist, regardless of whether they actually do
// or not.
declare global {
    const OFFLINE: boolean; // for UB offline
    const getDirname: () => Promise<string>; // for UB offline
    const pathJoin: (...parts: string[]) => Promise<string>; // for UB offline
    const kicksample: number[];
    const snaresample: number[];
    const pianosample: number[];
    const WOWsample: number[];
    const overdrivesample: number[];
    const trumpetsample: number[];
    const saxophonesample: number[];
    const orchhitsample: number[];
    const detatchedviolinsample: number[];
    const synthsample: number[];
    const sonic3snaresample: number[];
    const comeonsample: number[];
    const choirsample: number[];
    const overdrivensample: number[];
    const flutesample: number[];
    const legatoviolinsample: number[];
    const tremoloviolinsample: number[];
    const amenbreaksample: number[];
    const pizzicatoviolinsample: number[];
    const timallengruntsample: number[];
    const tubasample: number[];
    const loopingcymbalsample: number[];
    const kickdrumsample: number[];
    const snaredrumsample: number[];
    const closedhihatsample: number[];
    const foothihatsample: number[];
    const openhihatsample: number[];
    const crashsample: number[];
    const pianoC4sample: number[];
    const liverpadsample: number[];
    const marimbasample: number[];
    const susdotwavsample: number[];
    const wackyboxttssample: number[];
    const peppersteak1: number[];
    const peppersteak2: number[];
    const vinyl: number[];
    const slapbass: number[];
    const hdeboverdrive: number[];
    const sunsoftbass: number[];
    const masculinechoir: number[];
    const femininechoir: number[];
    const southtololoche: number[];
    const harp: number[];
    const panflute: number[];
    const krumhorn: number[];
    const timpani: number[];
    const crowdhey: number[];
    const warioland4brass: number[];
    const warioland4organ: number[];
    const warioland4daow: number[];
    const warioland4hourchime: number[];
    const warioland4tick: number[];
    const kirbykick: number[];
    const kirbysnare: number[];
    const kirbybongo: number[];
    const kirbyclick: number[];
    const funkkick: number[];
    const funksnare: number[];
    const funksnareleft: number[];
    const funksnareright: number[];
    const funktomhigh: number[];
    const funktomlow: number[];
    const funkhihatclosed: number[];
    const funkhihathalfopen: number[];
    const funkhihatopen: number[];
    const funkhihatopentip: number[];
    const funkhihatfoot: number[];
    const funkcrash: number[];
    const funkcrashtip: number[];
    const funkride: number[];
    const chronoperc1finalsample: number[];
    const synthkickfmsample: number[];
    const woodclicksample: number[];
    const acousticsnaresample: number[];
    const catpaintboxsample: number[];
    const gameboypaintboxsample: number[];
    const mariopaintboxsample: number[];
    const drumpaintboxsample: number[];
    const yoshipaintboxsample: number[];
    const starpaintboxsample: number[];
    const fireflowerpaintboxsample: number[];
    const dogpaintbox: number[];
    const oinkpaintbox: number[];
    const swanpaintboxsample: number[];
    const facepaintboxsample: number[];
}

function loadScript(url: string): Promise<void> {
    const result: Promise<void> = new Promise((resolve, reject) => {
	if (!Config.willReloadForCustomSamples) {
	    const script = document.createElement("script");
	    script.src = url;
	    document.head.appendChild(script);
	    script.addEventListener("load", (event) => {
		resolve();
	    });
	} else {
	    // There's not really any errors that show up if the loading for
	    // this script is stopped early, but it won't really do anything
	    // particularly useful either in that case.
	}
    });
    return result;
}

export function loadBuiltInSamples(set: number): void {
    const defaultIndex: number = 0;
    const defaultIntegratedSamples: Float32Array = Config.chipWaves[defaultIndex].samples;
    const defaultSamples: Float32Array = Config.rawRawChipWaves[defaultIndex].samples;

    if (set == 0) {
	// Create chip waves with the wrong sound.
	const chipWaves = [
	    { name: "paandorasbox kick", expression: 4.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 },
	    { name: "paandorasbox snare", expression: 3.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 },
	    { name: "paandorasbox piano1", expression: 3.0, isSampled: true, isPercussion: false, extraSampleDetune: 2 },
	    { name: "paandorasbox WOW", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: 0 },
	    { name: "paandorasbox overdrive", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -2 },
	    { name: "paandorasbox trumpet", expression: 3.0, isSampled: true, isPercussion: false, extraSampleDetune: 1.2 },
	    { name: "paandorasbox saxophone", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -5 },
	    { name: "paandorasbox orchestrahit", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: 4.2 },
	    { name: "paandorasbox detatched violin", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: 4.2 },
	    { name: "paandorasbox synth", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -0.8 },
	    { name: "paandorasbox sonic3snare", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 },
	    { name: "paandorasbox come on", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: 0 },
	    { name: "paandorasbox choir", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -3 },
	    { name: "paandorasbox overdriveguitar", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -6.2 },
	    { name: "paandorasbox flute", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -6 },
	    { name: "paandorasbox legato violin", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -28 },
	    { name: "paandorasbox tremolo violin", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -33 },
	    { name: "paandorasbox amen break", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -55 },
	    { name: "paandorasbox pizzicato violin", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -11 },
	    { name: "paandorasbox tim allen grunt", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -20 },
	    { name: "paandorasbox tuba", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: 44 },
	    { name: "paandorasbox loopingcymbal", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -17 },
	    { name: "paandorasbox standardkick", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: -7 },
	    { name: "paandorasbox standardsnare", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 },
	    { name: "paandorasbox closedhihat", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: 5 },
	    { name: "paandorasbox foothihat", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: 4 },
	    { name: "paandorasbox openhihat", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: -31 },
	    { name: "paandorasbox crashcymbal", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: -43 },
	    { name: "paandorasbox pianoC4", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -42.5 },
	    { name: "paandorasbox liver pad", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -22.5 },
	    { name: "paandorasbox marimba", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -15.5 },
	    { name: "paandorasbox susdotwav", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -24.5 },
	    { name: "paandorasbox wackyboxtts", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -17.5 },
	    { name: "paandorasbox peppersteak_1", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -42.2 },
	    { name: "paandorasbox peppersteak_2", expression: 2.0, isSampled: true, isPercussion: false, extraSampleDetune: -47 },
	    { name: "paandorasbox vinyl_noise", expression: 2.0, isSampled: true, isPercussion: true, extraSampleDetune: -50 },
	    { name: "paandorasbeta slap bass", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -56 },
	    { name: "paandorasbeta HD EB overdrive guitar", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -60 },
	    { name: "paandorasbeta sunsoft bass", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -18.5 },
	    { name: "paandorasbeta masculine choir", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -50 },
	    { name: "paandorasbeta feminine choir", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -60.5 },
	    { name: "paandorasbeta tololoche", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -29.5 },
	    { name: "paandorasbeta harp", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -54 },
	    { name: "paandorasbeta pan flute", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -58 },
	    { name: "paandorasbeta krumhorn", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -46 },
	    { name: "paandorasbeta timpani", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -50 },
	    { name: "paandorasbeta crowd hey", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -29 },
	    { name: "paandorasbeta wario land 4 brass", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -68 },
	    { name: "paandorasbeta wario land 4 rock organ", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -63 },
	    { name: "paandorasbeta wario land 4 DAOW", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -35 },
	    { name: "paandorasbeta wario land 4 hour chime", expression: 1.0, isSampled: true, isPercussion: false, extraSampleDetune: -47.5 },
	    { name: "paandorasbeta wario land 4 tick", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -12.5 },
	    { name: "paandorasbeta kirby kick", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -46.5 },
	    { name: "paandorasbeta kirby snare", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -46.5 },
	    { name: "paandorasbeta kirby bongo", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -46.5 },
	    { name: "paandorasbeta kirby click", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -46.5 },
	    { name: "paandorasbeta sonor kick", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -28.5 },
	    { name: "paandorasbeta sonor snare", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -28.5 },
	    { name: "paandorasbeta sonor snare (left hand)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -22.5 },
	    { name: "paandorasbeta sonor snare (right hand)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -22.5 },
	    { name: "paandorasbeta sonor high tom", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -41.5 },
	    { name: "paandorasbeta sonor low tom", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -41.5 },
	    { name: "paandorasbeta sonor hihat (closed)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -17 },
	    { name: "paandorasbeta sonor hihat (half opened)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -21 },
	    { name: "paandorasbeta sonor hihat (open)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -54.5 },
	    { name: "paandorasbeta sonor hihat (open tip)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -43.5 },
	    { name: "paandorasbeta sonor hihat (pedal)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -28 },
	    { name: "paandorasbeta sonor crash", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -51 },
	    { name: "paandorasbeta sonor crash (tip)", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -50.5 },
	    { name: "paandorasbeta sonor ride", expression: 1.0, isSampled: true, isPercussion: true, extraSampleDetune: -46 }
	];

	sampleLoadingState.totalSamples += chipWaves.length;

	// This assumes that Config.rawRawChipWaves and Config.chipWaves have
	// the same number of elements.
	const startIndex: number = Config.rawRawChipWaves.length;
	for (const chipWave of chipWaves) {
	    const chipWaveIndex: number = Config.rawRawChipWaves.length;
	    const rawChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultSamples };
	    const rawRawChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultSamples };
	    const integratedChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultIntegratedSamples };
	    Config.rawRawChipWaves[chipWaveIndex] = rawRawChipWave;
	    Config.rawRawChipWaves.dictionary[chipWave.name] = rawRawChipWave;
	    Config.rawChipWaves[chipWaveIndex] = rawChipWave;
	    Config.rawChipWaves.dictionary[chipWave.name] = rawChipWave;
	    Config.chipWaves[chipWaveIndex] = integratedChipWave;
	    Config.chipWaves.dictionary[chipWave.name] = rawChipWave;
	    sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.loading;
	    sampleLoadingState.urlTable[chipWaveIndex] = "legacySamples";
	}

	loadScript("samples.js")
	.then(() => loadScript("samples2.js"))
	.then(() => loadScript("samples3.js"))
	.then(() => loadScript("drumsamples.js"))
	.then(() => loadScript("wario_samples.js"))
	.then(() => loadScript("kirby_samples.js"))
	.then(() => {
	    // Now put the right sounds in there after everything
	    // got loaded.
	    const chipWaveSamples: Float32Array[] = [
		centerWave(kicksample),
		centerWave(snaresample),
		centerWave(pianosample),
		centerWave(WOWsample),
		centerWave(overdrivesample),
		centerWave(trumpetsample),
		centerWave(saxophonesample),
		centerWave(orchhitsample),
		centerWave(detatchedviolinsample),
		centerWave(synthsample),
		centerWave(sonic3snaresample),
		centerWave(comeonsample),
		centerWave(choirsample),
		centerWave(overdrivensample),
		centerWave(flutesample),
		centerWave(legatoviolinsample),
		centerWave(tremoloviolinsample),
		centerWave(amenbreaksample),
		centerWave(pizzicatoviolinsample),
		centerWave(timallengruntsample),
		centerWave(tubasample),
		centerWave(loopingcymbalsample),
		centerWave(kickdrumsample),
		centerWave(snaredrumsample),
		centerWave(closedhihatsample),
		centerWave(foothihatsample),
		centerWave(openhihatsample),
		centerWave(crashsample),
		centerWave(pianoC4sample),
		centerWave(liverpadsample),
		centerWave(marimbasample),
		centerWave(susdotwavsample),
		centerWave(wackyboxttssample),
		centerWave(peppersteak1),
		centerWave(peppersteak2),
		centerWave(vinyl),
		centerWave(slapbass),
		centerWave(hdeboverdrive),
		centerWave(sunsoftbass),
		centerWave(masculinechoir),
		centerWave(femininechoir),
		centerWave(southtololoche),
		centerWave(harp),
		centerWave(panflute),
		centerWave(krumhorn),
		centerWave(timpani),
		centerWave(crowdhey),
		centerWave(warioland4brass),
		centerWave(warioland4organ),
		centerWave(warioland4daow),
		centerWave(warioland4hourchime),
		centerWave(warioland4tick),
		centerWave(kirbykick),
		centerWave(kirbysnare),
		centerWave(kirbybongo),
		centerWave(kirbyclick),
		centerWave(funkkick),
		centerWave(funksnare),
		centerWave(funksnareleft),
		centerWave(funksnareright),
		centerWave(funktomhigh),
		centerWave(funktomlow),
		centerWave(funkhihatclosed),
		centerWave(funkhihathalfopen),
		centerWave(funkhihatopen),
		centerWave(funkhihatopentip),
		centerWave(funkhihatfoot),
		centerWave(funkcrash),
		centerWave(funkcrashtip),
		centerWave(funkride)
	    ];
	    let chipWaveIndexOffset: number = 0;
	    for (const chipWaveSample of chipWaveSamples) {
		const chipWaveIndex: number = startIndex + chipWaveIndexOffset;
		Config.rawChipWaves[chipWaveIndex].samples = chipWaveSample;
		Config.rawRawChipWaves[chipWaveIndex].samples = chipWaveSample;
		Config.chipWaves[chipWaveIndex].samples = performIntegral(chipWaveSample);
		sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.loaded;
		sampleLoadingState.samplesLoaded++;
		sampleLoadEvents.dispatchEvent(new SampleLoadedEvent(
		    sampleLoadingState.totalSamples,
		    sampleLoadingState.samplesLoaded
		));
		chipWaveIndexOffset++;
	    }
	});
	//EditorConfig.presetCategories[EditorConfig.presetCategories.length] = {name: "Legacy Sample Presets", presets:  { name: "Earthbound O. Guitar", midiProgram: 80, settings: { "type": "chip", "eqFilter": [], "effects": [], "transition": "normal", "fadeInSeconds": 0, "fadeOutTicks": -1, "chord": "arpeggio", "wave": "paandorasbox overdrive", "unison": "none", "envelopes": [] } }, index: EditorConfig.presetCategories.length,};
    }
    else if (set == 1) {
	// Create chip waves with the wrong sound.
	const chipWaves = [
	    { name: "chronoperc1final", expression: 4.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 },
	    { name: "synthkickfm", expression: 4.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 },
	    { name: "mcwoodclick1", expression: 4.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 },
	    { name: "acoustic snare", expression: 4.0, isSampled: true, isPercussion: true, extraSampleDetune: 0 }
	];

	sampleLoadingState.totalSamples += chipWaves.length;

	// This assumes that Config.rawRawChipWaves and Config.chipWaves have
	// the same number of elements.
	const startIndex: number = Config.rawRawChipWaves.length;
	for (const chipWave of chipWaves) {
	    const chipWaveIndex: number = Config.rawRawChipWaves.length;
	    const rawChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultSamples };
	    const rawRawChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultSamples };
	    const integratedChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultIntegratedSamples };
	    Config.rawRawChipWaves[chipWaveIndex] = rawRawChipWave;
	    Config.rawRawChipWaves.dictionary[chipWave.name] = rawRawChipWave;
	    Config.rawChipWaves[chipWaveIndex] = rawChipWave;
	    Config.rawChipWaves.dictionary[chipWave.name] = rawChipWave;
	    Config.chipWaves[chipWaveIndex] = integratedChipWave;
	    Config.chipWaves.dictionary[chipWave.name] = rawChipWave;
	    sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.loading;
	    sampleLoadingState.urlTable[chipWaveIndex] = "nintariboxSamples";
	}

	loadScript("nintaribox_samples.js")
	.then(() => {
	    // Now put the right sounds in there after everything
	    // got loaded.
	    const chipWaveSamples: Float32Array[] = [
		centerWave(chronoperc1finalsample),
		centerWave(synthkickfmsample),
		centerWave(woodclicksample),
		centerWave(acousticsnaresample)
	    ];
	    let chipWaveIndexOffset: number = 0;
	    for (const chipWaveSample of chipWaveSamples) {
		const chipWaveIndex: number = startIndex + chipWaveIndexOffset;
		Config.rawChipWaves[chipWaveIndex].samples = chipWaveSample;
		Config.rawRawChipWaves[chipWaveIndex].samples = chipWaveSample;
		Config.chipWaves[chipWaveIndex].samples = performIntegral(chipWaveSample);
		sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.loaded;
		sampleLoadingState.samplesLoaded++;
		sampleLoadEvents.dispatchEvent(new SampleLoadedEvent(
		    sampleLoadingState.totalSamples,
		    sampleLoadingState.samplesLoaded
		));
		chipWaveIndexOffset++;
	    }
	});
    }
    else if (set == 2) {
	// Create chip waves with the wrong sound.
	const chipWaves = [
	    { name: "cat", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: -3 },
	    { name: "gameboy", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: 7 },
	    { name: "mario", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: 0 },
	    { name: "drum", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: 4 },
	    { name: "yoshi", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: -16 },
	    { name: "star", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: -16 },
	    { name: "fire flower", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: -1 },
	    { name: "dog", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: -1 },
	    { name: "oink", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: 3 },
	    { name: "swan", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: 1 },
	    { name: "face", expression: 1, isSampled: true, isPercussion: false, extraSampleDetune: -12 }
	];

	sampleLoadingState.totalSamples += chipWaves.length;

	// This assumes that Config.rawRawChipWaves and Config.chipWaves have
	// the same number of elements.
	const startIndex: number = Config.rawRawChipWaves.length;
	for (const chipWave of chipWaves) {
	    const chipWaveIndex: number = Config.rawRawChipWaves.length;
	    const rawChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultSamples };
	    const rawRawChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultSamples };
	    const integratedChipWave = { index: chipWaveIndex, name: chipWave.name, expression: chipWave.expression, isSampled: chipWave.isSampled, isPercussion: chipWave.isPercussion, extraSampleDetune: chipWave.extraSampleDetune, samples: defaultIntegratedSamples };
	    Config.rawRawChipWaves[chipWaveIndex] = rawRawChipWave;
	    Config.rawRawChipWaves.dictionary[chipWave.name] = rawRawChipWave;
	    Config.rawChipWaves[chipWaveIndex] = rawChipWave;
	    Config.rawChipWaves.dictionary[chipWave.name] = rawChipWave;
	    Config.chipWaves[chipWaveIndex] = integratedChipWave;
	    Config.chipWaves.dictionary[chipWave.name] = rawChipWave;
	    sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.loading;
	    sampleLoadingState.urlTable[chipWaveIndex] = "marioPaintboxSamples";
	}

	loadScript("mario_paintbox_samples.js")
	.then(() => {
	    // Now put the right sounds in there after everything
	    // got loaded.
	    const chipWaveSamples: Float32Array[] = [
		centerWave(catpaintboxsample),
		centerWave(gameboypaintboxsample),
		centerWave(mariopaintboxsample),
		centerWave(drumpaintboxsample),
		centerWave(yoshipaintboxsample),
		centerWave(starpaintboxsample),
		centerWave(fireflowerpaintboxsample),
		centerWave(dogpaintbox),
		centerWave(oinkpaintbox),
		centerWave(swanpaintboxsample),
		centerWave(facepaintboxsample)
	    ];
	    let chipWaveIndexOffset: number = 0;
	    for (const chipWaveSample of chipWaveSamples) {
		const chipWaveIndex: number = startIndex + chipWaveIndexOffset;
		Config.rawChipWaves[chipWaveIndex].samples = chipWaveSample;
		Config.rawRawChipWaves[chipWaveIndex].samples = chipWaveSample;
		Config.chipWaves[chipWaveIndex].samples = performIntegral(chipWaveSample);
		sampleLoadingState.statusTable[chipWaveIndex] = SampleLoadingStatus.loaded;
		sampleLoadingState.samplesLoaded++;
		sampleLoadEvents.dispatchEvent(new SampleLoadedEvent(
		    sampleLoadingState.totalSamples,
		    sampleLoadingState.samplesLoaded
		));
		chipWaveIndexOffset++;
	    }
	});
    }
    else {
        console.log("invalid set of built-in samples");
    }
}

export class Config {
    // Params for post-processing compressor
    public static thresholdVal: number = -10;
    public static kneeVal: number = 40;
    public static ratioVal: number = 12;
    public static attackVal: number = 0;
    public static releaseVal: number = 0.25;

    public static willReloadForCustomSamples: boolean = false;

    public static jsonFormat: string = "UltraBox";
    // public static thurmboxImportUrl: string = "https://file.garden/ZMQ0Om5nmTe-x2hq/PandoraArchive%20Samples/";

    public static readonly scales: DictionaryArray<Scale> = toNameMap([

		//   C     Db      D     Eb      E      F     F#      G     Ab      A     Bb      B      C
		{ name: "Free", realName: "chromatic", flags: [true, true, true, true, true, true, true, true, true, true, true, true] }, // Free
        { name: "Major", realName: "ionian", flags: [true, false, true, false, true, true, false, true, false, true, false, true] }, // Major
        { name: "Minor", realName: "aeolian", flags: [true, false, true, true, false, true, false, true, true, false, true, false] }, // Minor
        { name: "Mixolydian", realName: "mixolydian", flags: [true, false, true, false, true, true, false, true, false, true, true, false] }, // Mixolydian
        { name: "Lydian", realName: "lydian", flags: [true, false, true, false, true, false, true, true, false, true, false, true] }, // Lydian
        { name: "Dorian", realName: "dorian", flags: [true, false, true, true, false, true, false, true, false, true, true, false] }, // Dorian
        { name: "Phrygian", realName: "phrygian", flags: [true, true, false, true, false, true, false, true, true, false, true, false] }, // Phrygian
        { name: "Locrian", realName: "locrian", flags: [true, true, false, true, false, true, true, false, true, false, true, false] }, // Locrian
        { name: "Lydian Dominant", realName: "lydian dominant", flags: [true, false, true, false, true, false, true, true, false, true, true, false] }, // Lydian Dominant
        { name: "Phrygian Dominant", realName: "phrygian dominant", flags: [true, true, false, false, true, true, false, true, true, false, true, false] }, // Phrygian Dominant
        { name: "Harmonic Major", realName: "harmonic major", flags: [true, false, true, false, true, true, false, true, true, false, false, true] }, // Harmonic Major
        { name: "Harmonic Minor", realName: "harmonic minor", flags: [true, false, true, true, false, true, false, true, true, false, false, true] }, // Harmonic Minor
        { name: "Melodic Minor", realName: "melodic minor", flags: [true, false, true, true, false, true, false, true, false, true, false, true] }, // Melodic Minor
        { name: "Blues Major", realName: "blues major", flags: [true, false, true, true, true,false, false, true, false, true, false, false] }, // Blues Major
        { name: "Blues", realName: "blues", flags: [true, false, false, true, false, true, true, true, false, false, true, false] }, // Blues
        { name: "Altered", realName: "altered", flags: [true, true, false, true, true, false, true, false, true, false, true, false] }, // Altered
        { name: "Major Pentatonic", realName: "major pentatonic", flags: [true, false, true, false, true, false, false, true, false, true, false, false] }, // Major Pentatonic
        { name: "Minor Pentatonic", realName: "minor pentatonic", flags: [true, false, false, true, false, true, false, true, false, false, true, false] }, // Minor Pentatonic
        { name: "Whole Tone", realName: "whole tone", flags: [true, false, true, false, true, false, true, false, true, false, true, false] }, // Whole Tone
        { name: "Octatonic", realName: "octatonic", flags: [true, false, true, true, false, true, true, false, true, true, false, true] }, // Octatonic
        { name: "Hexatonic", realName: "hexatonic", flags: [true, false, false, true, true, false, false, true, true, false, false, true] }, // Hexatonic
        // TODO: remove these with 2.3
        // modbox
        { name: "No Dabbing (MB)", realName: "no dabbing", flags:[true, true, false, true, true, true, true, true, true, false, true, false] },
        // todbox
        { name: "Jacked Toad (TB)", realName: "jacked toad", flags: [true, false, true, true, false, true, true, true, true, false, true, true] },
        { name: "Test Scale (TB)", realName: "**t", flags: [true, true, false, false, false, true, true, false, false, true, true, false] },
        { name: "Custom", realName: "custom", flags: [true, false, true, true, false, false, false, true, true, false, true, true] }, // Custom? considering allowing this one to be be completely configurable
	]);
	public static readonly keys: DictionaryArray<Key> = toNameMap([
		{ name: "C", isWhiteKey: true, basePitch: 12 }, // C0 has index 12 on the MIDI scale. C7 is 96, and C9 is 120. C10 is barely in the audible range.
		{ name: "C♯", isWhiteKey: false, basePitch: 13 },
		{ name: "D", isWhiteKey: true, basePitch: 14 },
		{ name: "D♯", isWhiteKey: false, basePitch: 15 },
		{ name: "E", isWhiteKey: true, basePitch: 16 },
		{ name: "F", isWhiteKey: true, basePitch: 17 },
		{ name: "F♯", isWhiteKey: false, basePitch: 18 },
		{ name: "G", isWhiteKey: true, basePitch: 19 },
		{ name: "G♯", isWhiteKey: false, basePitch: 20 },
		{ name: "A", isWhiteKey: true, basePitch: 21 },
		{ name: "A♯", isWhiteKey: false, basePitch: 22 },
        { name: "B", isWhiteKey: true, basePitch: 23 },
				// { name: "C+", isWhiteKey: false, basePitch: 24 },
		//taken from todbox, called "B#" for some reason lol
		// { name: "G- (actually F#-)", isWhiteKey: false, basePitch: 6 },
        // { name: "C-", isWhiteKey: true, basePitch: 0 },
	    //brucebox
		//g- isn't actually g-???
		// { name: "oh no (F-)", isWhiteKey: true, basePitch: 5 },
		//shitbox
	]);
	public static readonly blackKeyNameParents: ReadonlyArray<number> = [-1, 1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1];
	public static readonly tempoMin: number = 1;
	public static readonly tempoMax: number = 500;
	public static readonly octaveMin: number = -2;
	public static readonly octaveMax: number = 2;
    public static readonly echoDelayRange: number = 24;
    public static readonly echoDelayStepTicks: number = 4;
    public static readonly echoSustainRange: number = 8;
    public static readonly echoShelfHz: number = 4000.0; // The cutoff freq of the shelf filter that is used to decay echoes.
    public static readonly echoShelfGain: number = Math.pow(2.0, -0.5);
    public static readonly reverbShelfHz: number = 8000.0; // The cutoff freq of the shelf filter that is used to decay reverb.
    public static readonly reverbShelfGain: number = Math.pow(2.0, -1.5);
	public static readonly reverbRange: number = 32;
    public static readonly reverbDelayBufferSize: number = 16384; // TODO: Compute a buffer size based on sample rate.
    public static readonly reverbDelayBufferMask: number = Config.reverbDelayBufferSize - 1; // TODO: Compute a buffer size based on sample rate.
    public static readonly beatsPerBarMin: number = 1;
	public static readonly beatsPerBarMax: number = 64;
	public static readonly barCountMin: number = 1;
	public static readonly barCountMax: number = 1024;
    public static readonly instrumentCountMin: number = 1;
    public static readonly layeredInstrumentCountMax: number = 10;
    public static readonly patternInstrumentCountMax: number = 10;
	public static readonly partsPerBeat: number = 24;
	public static readonly ticksPerPart: number = 2;
	public static readonly ticksPerArpeggio: number = 3;
	public static readonly arpeggioPatterns: ReadonlyArray<ReadonlyArray<number>> = [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6, 7] ];
	public static readonly rhythms: DictionaryArray<Rhythm> = toNameMap([
		{ name: "÷3 (triplets)", stepsPerBeat: 3, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 5, /*8*/ 12, /*16*/ 18 /*24*/] },
		{ name: "÷4 (standard)", stepsPerBeat: 4, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 3, /*6*/ 9, /*12*/ 17, /*18*/ 21 /*24*/] },
		{ name: "÷6", stepsPerBeat: 6, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
		{ name: "÷8", stepsPerBeat: 8, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
        { name: "÷12", stepsPerBeat: 12, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1]]*/ roundUpThresholds: null },
		{ name: "freehand", stepsPerBeat: 24, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
	]);

    public static readonly instrumentTypeNames: ReadonlyArray<string> = ["chip", "FM", "noise", "spectrum", "drumset", "harmonics", "PWM", "Picked String", "supersaw", "custom chip", "mod", "FM6op"];
	public static readonly instrumentTypeHasSpecialInterval: ReadonlyArray<boolean> = [true, true, false, false, false, true, false, false, false, false, false];
    public static readonly chipBaseExpression: number = 0.03375; // Doubled by unison feature, but affected by expression adjustments per unison setting and wave shape.
    public static readonly fmBaseExpression: number = 0.03;
    public static readonly noiseBaseExpression: number = 0.19;
    public static readonly spectrumBaseExpression: number = 0.3; // Spectrum can be in pitch or noise channels, the expression is doubled for noise.
    public static readonly drumsetBaseExpression: number = 0.45; // Drums tend to be loud but brief!
    public static readonly harmonicsBaseExpression: number = 0.025;
    public static readonly pwmBaseExpression: number = 0.04725; // It's actually closer to half of this, the synthesized pulse amplitude range is only .5 to -.5, but also note that the fundamental sine partial amplitude of a square wave is 4/π times the measured square wave amplitude.
    public static readonly supersawBaseExpression:  number = 0.061425; // It's actually closer to half of this, the synthesized sawtooth amplitude range is only .5 to -.5.
    public static readonly pickedStringBaseExpression: number = 0.025; // Same as harmonics.
    public static readonly distortionBaseVolume: number = 0.011; // Distortion is not affected by pitchDamping, which otherwise approximately halves expression for notes around the middle of the range.
    public static readonly bitcrusherBaseVolume: number = 0.010; // Also not affected by pitchDamping, used when bit crushing is maxed out (aka "1-bit" output).
	public static rawChipWaves: DictionaryArray<ChipWave> = toNameMap([
        { name: "rounded", expression: 0.94, samples: centerWave([0.0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2, 0.0, -0.2, -0.4, -0.5, -0.6, -0.7, -0.8, -0.85, -0.9, -0.95, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -0.95, -0.9, -0.85, -0.8, -0.7, -0.6, -0.5, -0.4, -0.2]) },
        { name: "triangle", expression: 1.0, samples: centerWave([1.0 / 15.0, 3.0 / 15.0, 5.0 / 15.0, 7.0 / 15.0, 9.0 / 15.0, 11.0 / 15.0, 13.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 13.0 / 15.0, 11.0 / 15.0, 9.0 / 15.0, 7.0 / 15.0, 5.0 / 15.0, 3.0 / 15.0, 1.0 / 15.0, -1.0 / 15.0, -3.0 / 15.0, -5.0 / 15.0, -7.0 / 15.0, -9.0 / 15.0, -11.0 / 15.0, -13.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -13.0 / 15.0, -11.0 / 15.0, -9.0 / 15.0, -7.0 / 15.0, -5.0 / 15.0, -3.0 / 15.0, -1.0 / 15.0]) },
        { name: "square", expression: 0.5, samples: centerWave([1.0, -1.0]) },
        { name: "1/4 pulse", expression: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0]) },
        { name: "1/8 pulse", expression: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "sawtooth", expression: 0.65, samples: centerWave([1.0 / 31.0, 3.0 / 31.0, 5.0 / 31.0, 7.0 / 31.0, 9.0 / 31.0, 11.0 / 31.0, 13.0 / 31.0, 15.0 / 31.0, 17.0 / 31.0, 19.0 / 31.0, 21.0 / 31.0, 23.0 / 31.0, 25.0 / 31.0, 27.0 / 31.0, 29.0 / 31.0, 31.0 / 31.0, -31.0 / 31.0, -29.0 / 31.0, -27.0 / 31.0, -25.0 / 31.0, -23.0 / 31.0, -21.0 / 31.0, -19.0 / 31.0, -17.0 / 31.0, -15.0 / 31.0, -13.0 / 31.0, -11.0 / 31.0, -9.0 / 31.0, -7.0 / 31.0, -5.0 / 31.0, -3.0 / 31.0, -1.0 / 31.0]) },
        { name: "double saw", expression: 0.5, samples: centerWave([0.0, -0.2, -0.4, -0.6, -0.8, -1.0, 1.0, -0.8, -0.6, -0.4, -0.2, 1.0, 0.8, 0.6, 0.4, 0.2]) },
        { name: "double pulse", expression: 0.4, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "spiky", expression: 0.4, samples: centerWave([1.0, -1.0, 1.0, -1.0, 1.0, 0.0]) },
        { name: "sine", expression: 0.88, samples: centerAndNormalizeWave([8.0, 9.0, 11.0, 12.0, 13.0, 14.0, 15.0, 15.0, 15.0, 15.0, 14.0, 14.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 2.0, 4.0, 5.0, 6.0]) },
        { name: "flute", expression: 0.8, samples: centerAndNormalizeWave([3.0, 4.0, 6.0, 8.0, 10.0, 11.0, 13.0, 14.0, 15.0, 15.0, 14.0, 13.0, 11.0, 8.0, 5.0, 3.0]) },
        { name: "harp", expression: 0.8, samples: centerAndNormalizeWave([0.0, 3.0, 3.0, 3.0, 4.0, 5.0, 5.0, 6.0, 7.0, 8.0, 9.0, 11.0, 11.0, 13.0, 13.0, 15.0, 15.0, 14.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 7.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0]) },
        { name: "sharp clarinet", expression: 0.38, samples: centerAndNormalizeWave([0.0, 0.0, 0.0, 1.0, 1.0, 8.0, 8.0, 9.0, 9.0, 9.0, 8.0, 8.0, 8.0, 8.0, 8.0, 9.0, 9.0, 7.0, 9.0, 9.0, 10.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]) },
        { name: "soft clarinet", expression: 0.45, samples: centerAndNormalizeWave([0.0, 1.0, 5.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 11.0, 11.0, 12.0, 13.0, 12.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 3.0, 3.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]) },
        { name: "alto sax", expression: 0.3, samples: centerAndNormalizeWave([5.0, 5.0, 6.0, 4.0, 3.0, 6.0, 8.0, 7.0, 2.0, 1.0, 5.0, 6.0, 5.0, 4.0, 5.0, 7.0, 9.0, 11.0, 13.0, 14.0, 14.0, 14.0, 14.0, 13.0, 10.0, 8.0, 7.0, 7.0, 4.0, 3.0, 4.0, 2.0]) },
        { name: "bassoon", expression: 0.35, samples: centerAndNormalizeWave([9.0, 9.0, 7.0, 6.0, 5.0, 4.0, 4.0, 4.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0, 11.0, 13.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 2.0, 1.0, 1.0, 1.0, 2.0, 2.0, 5.0, 11.0, 14.0]) },
        { name: "trumpet", expression: 0.22, samples: centerAndNormalizeWave([10.0, 11.0, 8.0, 6.0, 5.0, 5.0, 5.0, 6.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 7.0, 8.0, 9.0, 11.0, 14.0]) },
        { name: "electric guitar", expression: 0.2, samples: centerAndNormalizeWave([11.0, 12.0, 12.0, 10.0, 6.0, 6.0, 8.0, 0.0, 2.0, 4.0, 8.0, 10.0, 9.0, 10.0, 1.0, 7.0, 11.0, 3.0, 6.0, 6.0, 8.0, 13.0, 14.0, 2.0, 0.0, 12.0, 8.0, 4.0, 13.0, 11.0, 10.0, 13.0]) },
        { name: "organ", expression: 0.2, samples: centerAndNormalizeWave([11.0, 10.0, 12.0, 11.0, 14.0, 7.0, 5.0, 5.0, 12.0, 10.0, 10.0, 9.0, 12.0, 6.0, 4.0, 5.0, 13.0, 12.0, 12.0, 10.0, 12.0, 5.0, 2.0, 2.0, 8.0, 6.0, 6.0, 5.0, 8.0, 3.0, 2.0, 1.0]) },
        { name: "pan flute", expression: 0.35, samples: centerAndNormalizeWave([1.0, 4.0, 7.0, 6.0, 7.0, 9.0, 7.0, 7.0, 11.0, 12.0, 13.0, 15.0, 13.0, 11.0, 11.0, 12.0, 13.0, 10.0, 7.0, 5.0, 3.0, 6.0, 10.0, 7.0, 3.0, 3.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0]) },
        { name: "glitch", expression: 0.5, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0]) },
        { name: "trapezoid", expression: 1.0, samples: centerWave([1.0 / 15.0, 6.0 / 15.0, 10.0 / 15.0, 14.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 14.0 / 15.0, 10.0 / 15.0, 6.0 / 15.0, 1.0 / 15.0, -1.0 / 15.0, -6.0 / 15.0, -10.0 / 15.0, -14.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -14.0 / 15.0, -10.0 / 15.0, -6.0 / 15.0, -1.0 / 15.0,])},
        // modbox
        { name: "modbox 10% pulse", expression: 0.5, samples: centerAndNormalizeWave([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "modbox sunsoft bass", expression: 1.0, samples: centerAndNormalizeWave([0.0, 0.1875, 0.3125, 0.5625, 0.5, 0.75, 0.875, 1.0, 1.0, 0.6875, 0.5, 0.625, 0.625, 0.5, 0.375, 0.5625, 0.4375, 0.5625, 0.4375, 0.4375, 0.3125, 0.1875, 0.1875, 0.375, 0.5625, 0.5625, 0.5625, 0.5625, 0.5625, 0.4375, 0.25, 0.0]) },
        { name: "modbox loud pulse", expression: 0.5, samples: centerAndNormalizeWave([1.0, 0.7, 0.1, 0.1, 0, 0, 0, 0, 0, 0.1, 0.2, 0.15, 0.25, 0.125, 0.215, 0.345, 4.0]) },
        { name: "modbox sax", expression: 0.5, samples: centerAndNormalizeWave([1.0 / 15.0, 3.0 / 15.0, 5.0 / 15.0, 9.0, 0.06]) },
        { name: "modbox guitar", expression: 0.5, samples: centerAndNormalizeWave([-0.5, 3.5, 3.0, -0.5, -0.25, -1.0]) },
        { name: "modbox sine", expression: 0.5, samples: centerAndNormalizeWave([0.0, 0.05, 0.125, 0.2, 0.25, 0.3, 0.425, 0.475, 0.525, 0.625, 0.675, 0.725, 0.775, 0.8, 0.825, 0.875, 0.9, 0.925, 0.95, 0.975, 0.98, 0.99, 0.995, 1, 0.995, 0.99, 0.98, 0.975, 0.95, 0.925, 0.9, 0.875, 0.825, 0.8, 0.775, 0.725, 0.675, 0.625, 0.525, 0.475, 0.425, 0.3, 0.25, 0.2, 0.125, 0.05, 0.0, -0.05, -0.125, -0.2, -0.25, -0.3, -0.425, -0.475, -0.525, -0.625, -0.675, -0.725, -0.775, -0.8, -0.825, -0.875, -0.9, -0.925, -0.95, -0.975, -0.98, -0.99, -0.995, -1, -0.995, -0.99, -0.98, -0.975, -0.95, -0.925, -0.9, -0.875, -0.825, -0.8, -0.775, -0.725, -0.675, -0.625, -0.525, -0.475, -0.425, -0.3, -0.25, -0.2, -0.125, -0.05]) },
        { name: "modbox atari bass", expression: 0.5, samples: centerAndNormalizeWave([1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0]) },
        { name: "modbox atari pulse", expression: 0.5, samples: centerAndNormalizeWave([1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]) },
        { name: "modbox 1% pulse", expression: 0.5, samples: centerAndNormalizeWave([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "modbox curved sawtooth", expression: 0.5, samples: centerAndNormalizeWave([1.0, 1.0 / 2.0, 1.0 / 3.0, 1.0 / 4.0]) },
        { name: "modbox viola", expression: 0.45, samples: centerAndNormalizeWave([-0.9, -1.0, -0.85, -0.775, -0.7, -0.6, -0.5, -0.4, -0.325, -0.225, -0.2, -0.125, -0.1, -0.11, -0.125, -0.15, -0.175, -0.18, -0.2, -0.21, -0.22, -0.21, -0.2, -0.175, -0.15, -0.1, -0.5, 0.75, 0.11, 0.175, 0.2, 0.25, 0.26, 0.275, 0.26, 0.25, 0.225, 0.2, 0.19, 0.18, 0.19, 0.2, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.275, 0.28, 0.29, 0.3, 0.29, 0.28, 0.27, 0.26, 0.25, 0.225, 0.2, 0.175, 0.15, 0.1, 0.075, 0.0, -0.01, -0.025, 0.025, 0.075, 0.2, 0.3, 0.475, 0.6, 0.75, 0.85, 0.85, 1.0, 0.99, 0.95, 0.8, 0.675, 0.475, 0.275, 0.01, -0.15, -0.3, -0.475, -0.5, -0.6, -0.71, -0.81, -0.9, -1.0, -0.9]) },
        { name: "modbox brass", expression: 0.45, samples: centerAndNormalizeWave([-1.0, -0.95, -0.975, -0.9, -0.85, -0.8, -0.775, -0.65, -0.6, -0.5, -0.475, -0.35, -0.275, -0.2, -0.125, -0.05, 0.0, 0.075, 0.125, 0.15, 0.20, 0.21, 0.225, 0.25, 0.225, 0.21, 0.20, 0.19, 0.175, 0.125, 0.10, 0.075, 0.06, 0.05, 0.04, 0.025, 0.04, 0.05, 0.10, 0.15, 0.225, 0.325, 0.425, 0.575, 0.70, 0.85, 0.95, 1.0, 0.9, 0.675, 0.375, 0.2, 0.275, 0.4, 0.5, 0.55, 0.6, 0.625, 0.65, 0.65, 0.65, 0.65, 0.64, 0.6, 0.55, 0.5, 0.4, 0.325, 0.25, 0.15, 0.05, -0.05, -0.15, -0.275, -0.35, -0.45, -0.55, -0.65, -0.7, -0.78, -0.825, -0.9, -0.925, -0.95, -0.975]) },
        { name: "modbox acoustic bass", expression: 0.5, samples: centerAndNormalizeWave([1.0, 0.0, 0.1, -0.1, -0.2, -0.4, -0.3, -1.0]) },
        { name: "modbox lyre", expression: 0.45, samples: centerAndNormalizeWave([1.0, -1.0, 4.0, 2.15, 4.13, 5.15, 0.0, -0.05, 1.0]) },
        { name: "modbox ramp pulse", expression: 0.5, samples: centerAndNormalizeWave([6.1, -2.9, 1.4, -2.9]) },  
        { name: "modbox piccolo", expression: 0.5, samples: centerAndNormalizeWave([1, 4, 2, 1, -0.1, -1, -0.12]) },
        { name: "modbox squaretooth", expression: 0.5, samples: centerAndNormalizeWave([0.2, 1.0, 2.6, 1.0, 0.0, -2.4]) },
        { name: "modbox flatline", expression: 1.0, samples: centerAndNormalizeWave([1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) },
        { name: "modbox pnryshk a (u5)", expression: 0.4, samples: centerAndNormalizeWave([1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0]) },
        { name: "modbox pnryshk b (riff)", expression: 0.5, samples: centerAndNormalizeWave([1.0, -0.9, 0.8, -0.7, 0.6, -0.5, 0.4, -0.3, 0.2, -0.1, 0.0, -0.1, 0.2, -0.3, 0.4, -0.5, 0.6, -0.7, 0.8, -0.9, 1.0]) },
        // sandbox
        { name: "sandbox shrill lute", expression: 0.94, samples: centerAndNormalizeWave([1.0, 1.5, 1.25, 1.2, 1.3, 1.5]) },
        { name: "sandbox bassoon", expression: 0.5, samples: centerAndNormalizeWave([1.0, -1.0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]) },
        { name: "sandbox shrill bass", expression: 0.5, samples: centerAndNormalizeWave([0, 1, 0, 0, 1, 0, 1, 0, 0, 0]) },
        { name: "sandbox nes pulse", expression: 0.4, samples: centerAndNormalizeWave([2.1, -2.2, 1.2, 3]) },
        { name: "sandbox saw bass", expression: 0.25, samples: centerAndNormalizeWave([1, 1, 1, 1, 0, 2, 1, 2, 3, 1, -2, 1, 4, 1, 4, 2, 1, 6, -3, 4, 2, 1, 5, 1, 4, 1, 5, 6, 7, 1, 6, 1, 4, 1, 9]) },
        { name: "sandbox euphonium", expression: 0.3, samples: centerAndNormalizeWave([0, 1, 2, 1, 2, 1, 4, 2, 5, 0, -2, 1, 5, 1, 2, 1, 2, 4, 5, 1, 5, -2, 5, 10, 1]) },
        { name: "sandbox shrill pulse", expression: 0.3, samples: centerAndNormalizeWave([4 -2, 0, 4, 1, 4, 6, 7, 3]) },
        { name: "sandbox r-sawtooth", expression: 0.2, samples: centerAndNormalizeWave([6.1, -2.9, 1.4, -2.9]) },
        { name: "sandbox recorder", expression: 0.2, samples: centerAndNormalizeWave([5.0, -5.1, 4.0, -4.1, 3.0, -3.1, 2.0, -2.1, 1.0, -1.1, 6.0]) },
        { name: "sandbox narrow saw", expression: 1.2, samples: centerAndNormalizeWave([0.1, 0.13 / -0.1 ,0.13 / -0.3 ,0.13 / -0.5 ,0.13 / -0.7 ,0.13 / -0.9 ,0.13 / -0.11 ,0.13 / -0.31 ,0.13 / -0.51 ,0.13 / -0.71 ,0.13 / -0.91 ,0.13 / -0.12 ,0.13 / -0.32 ,0.13 / -0.52 ,0.13 / -0.72 ,0.13 / -0.92 ,0.13 / -0.13 ,0.13 / 0.13 ,0.13 / 0.92 ,0.13 / 0.72 ,0.13 / 0.52 ,0.13 / 0.32 ,0.13 / 0.12 ,0.13 / 0.91 ,0.13 / 0.71 ,0.13 / 0.51 ,0.13 / 0.31 ,0.13 / 0.11 ,0.13 / 0.9 ,0.13 / 0.7 ,0.13 / 0.5 ,0.13 / 0.3 ,0.13]) },
        { name: "sandbox deep square", expression: 1.0, samples: centerAndNormalizeWave([1.0, 2.25, 1.0, -1.0, -2.25, -1.0]) },
        { name: "sandbox ring pulse", expression: 1.0, samples: centerAndNormalizeWave([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "sandbox double sine", expression: 1.0, samples: centerAndNormalizeWave([1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.0, -1.0, -1.1, -1.2, -1.3, -1.4, -1.5, -1.6, -1.7, -1.8, -1.9, -1.8, -1.7, -1.6, -1.5, -1.4, -1.3, -1.2, -1.1, -1.0]) },
        { name: "sandbox contrabass", expression: 0.5, samples: centerAndNormalizeWave([4.20, 6.9, 1.337, 6.66]) },
        { name: "sandbox double bass", expression: 0.4, samples: centerAndNormalizeWave([0.0, 0.1875, 0.3125, 0.5625, 0.5, 0.75, 0.875, 1.0, -1.0, -0.6875, -0.5, -0.625, -0.625, -0.5, -0.375, -0.5625, -0.4375, -0.5625, -0.4375, -0.4375, -0.3125, -0.1875, 0.1875, 0.375, 0.5625, -0.5625, 0.5625, 0.5625, 0.5625, 0.4375, 0.25, 0.0]) },
        // haileybox
        { name: "haileybox test1", expression: 0.5, samples: centerAndNormalizeWave([1.0, 0.5, -1.0]) },
        //brucebox
        { name: "brucebox pokey 4bit lfsr", expression: 0.5, samples: centerAndNormalizeWave([1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0]) },
        { name: "brucebox pokey 5step bass", expression: 0.5,samples: centerAndNormalizeWave([1.0, -1.0, 1.0, -1.0, 1.0]) },
        { name: "brucebox isolated spiky", expression: 0.5, samples: centerAndNormalizeWave([1.0, -1.0, 1.0, -1.0, 1.0, -1.0]) },
        // nerdbox
        { name: "nerdbox unnamed 1", expression: 0.5, samples: centerAndNormalizeWave([0.2 , 0.8 / 0.2, 0.7, -0.4, -1.0, 0.5, -0.5 / 0.6]) },
        { name: "nerdbox unnamed 2", expression: 0.5, samples: centerAndNormalizeWave([2.0 , 5.0 / 55.0 , -9.0 , 6.5 / 6.5 , -55.0, 18.5 / -26.0]) },
        // zefbox
        { name: "zefbox semi-square", expression: 1.0, samples: centerAndNormalizeWave([1.0, 1.5, 2.0, 2.5, 2.5, 2.5, 2.0, 1.5, 1.0]) },
        { name: "zefbox deep square", expression: 1.0, samples: centerAndNormalizeWave([1.0, 2.25, 1.0, -1.0, -2.25, -1.0]) },
        { name: "zefbox squaretal", expression: 0.7, samples: centerAndNormalizeWave([1.5, 1.0, 1.5, -1.5, -1.0, -1.5]) },
        { name: "zefbox saw wide", expression: 0.65, samples: centerAndNormalizeWave([0.0, -0.4, -0.8, -1.2, -1.6 , -2.0, 0.0, -0.4, -0.8, -1.2, -1.6]) },
        { name: "zefbox saw narrow", expression: 0.65,samples: centerAndNormalizeWave([1, 0.5, 1, 0.5, 1, 0.5, 1, 2, 1, 2 ,1]) },
        { name: "zefbox deep sawtooth", expression: 0.5, samples: centerAndNormalizeWave([0, 2, 3, 4, 4.5, 5, 5.5, 6, 6.25, 6.5, 6.75, 7, 6.75, 6.5, 6.25, 6, 5.5, 5, 4.5, 4, 3, 2, 1]) },
        { name: "zefbox sawtal", expression: 0.3, samples: centerAndNormalizeWave([1.5, 1.0, 1.25, -0.5, 1.5, -0.5, 0.0, -1.5, 1.5, 0.0, 0.5, -1.5, 0.5, 1.25, -1.0, -1.5]) },
        { name: "zefbox deep sawtal", expression: 0.7, samples: centerAndNormalizeWave([0.75, 0.25, 0.5, -0.5, 0.5, -0.5, -0.25, -0.75]) },
        { name: "zefbox pulse", expression: 0.5, samples: centerAndNormalizeWave([1.0, -2.0, -2.0, -1.5, -1.5, -1.25, -1.25, -1.0, -1.0]) },
        { name: "zefbox triple pulse", expression: 0.4, samples: centerAndNormalizeWave([1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.5, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.5]) },
        { name: "zefbox high pulse", expression: 0.2, samples: centerAndNormalizeWave([1, -2, 2, -3, 3, -4, 5, -4, 3, -3, 2, -2, 1]) },
        { name: "zefbox deep pulse", expression: 0.2, samples: centerAndNormalizeWave([1, 2, 2, -2, -2, -3, -4, -4, -5, -5, -5, -5, 0, -1, -2]) },
        // wackybox
        { name: "wackybox guitar string", expression: 0.6, samples: centerAndNormalizeWave([0, 63, 63, 63, 63, 19, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 11, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 27, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 34, 63, 63, 63, 63]) },
        { name: "wackybox intense", expression: 0.6, samples: centerAndNormalizeWave([36, 25, 33, 35, 18, 51, 22, 40, 27, 37, 31, 33, 25, 29, 41, 23, 31, 31, 45, 20, 37, 23, 29, 26, 42, 29, 33, 26, 31, 27, 40, 25, 40, 26, 37, 24, 41, 32, 0, 32, 33, 29, 32, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31]) },
        { name: "wackybox buzz wave", expression: 0.6, samples: centerAndNormalizeWave([0, 1, 1, 2, 4, 4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 8, 8, 9, 9, 9, 9, 9, 9, 8, 8, 8, 11, 15, 23, 62, 61, 60, 58, 56, 56, 54, 53, 52, 50, 49, 48, 47, 47, 45, 45, 45, 44, 44, 43, 43, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 43, 43, 53]) },
        // todbox
        { name: "todbox 1/3 pulse", expression: 0.5, samples: centerWave([1.0, -1.0, -1.0]) },
        { name: "todbox 1/5 pulse", expression: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "todbox slap bass", expression: 0.5, samples: centerAndNormalizeWave([1, 0.5, 0, 0.5, 1.25, 0.5, -0.25, 0.1, -0.1, 0.1, 1.1, 2.1, 3, 3.5, 2.9, 3.3, 2.7, 2.9, 2.3, 2, 1.9, 1.8, 1, 0.7, 0.9, 0.8, 0.4, 0.1, 0.0, 0.2, 0.4, 0.6, 0.5, 0.8]) },
        { name: "todbox harsh wave", expression: 0.45, samples: centerAndNormalizeWave([1.0, -1.0, -1.0, -1.0, 0.5, 0.5, 0.5, 0.7, 0.39, 1.3, 0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "todbox accordian", expression: 0.5, samples: centerAndNormalizeWave([0, 1, 1, 2, 2, 1.5, 1.5, 0.8, 0, -2, -3.25, -4, -4.5, -5.5, -6, -5.75, -5.5, -5, -5, -5, -6, -6, -6, -5, -4, -3, -2, -1, 0.75, 1, 2, 3, 4, 5, 6, 6.5, 7.5, 8, 7.75, 6, 5.25, 5, 5, 5, 5, 5, 4.25, 3.75, 3.25, 2.75, 1.25, -0.75, -2, -0.75, 1.25, 1.25, 2, 2, 2, 2, 1.5, -1, -2, -1, 1.5, 2,  2.75, 2.75, 2.75, 3, 2.75, -1, -2, -2.5, -2, -1, -2.25, -2.75, -2, -3, -1.75, 1, 2, 3.5, 4, 5.25, 6, 8, 9.75, 10, 9.5, 9, 8.5, 7.5, 6.5, 5.25, 5, 4.5, 4, 4, 4, 3.25, 2.5, 2, 1, -0.5, -2, -3.5, -4, -4, -4, -3.75, -3, -2, -1]) },
        // todbox beta
        { name: "todbox beta banana wave", expression: 0.8, samples: centerAndNormalizeWave([0.0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2, 0.0]) },
        { name: "todbox beta test wave", expression: 0.5, samples: centerAndNormalizeWave([56, 0, -52, 16, 3, 3, 2, -35, 20, 147, -53, 0, 0, 5, -6]) },
        { name: "todbox beta real snare", expression: 1.0, samples: centerAndNormalizeWave([0.00000,-0.01208,-0.02997,-0.04382,-0.06042,-0.07529,-0.09116,-0.10654,-0.12189,-0.13751,-0.15289,-0.16849,-0.18387,-0.19974,-0.21484,-0.23071,-0.24557,-0.26144,-0.27731,-0.29141,-0.30350,-0.32416,-0.34406,-0.32947,-0.31158,-0.33725,-0.37579,-0.39746,-0.40201,-0.40906,-0.44180,-0.47229,-0.47379,-0.47733,-0.45239,-0.33954,-0.22894,-0.22443,-0.32138,-0.46371,-0.57178,-0.61081,-0.59998,-0.61459,-0.62189,-0.43979,-0.19217,-0.12643,-0.17252,-0.20956,-0.20981,-0.19217,-0.22845,-0.34332,-0.50629,-0.64307,-0.72922,-0.81384,-0.87857,-0.90149,-0.88687,-0.86169,-0.87781,-0.80478,-0.52493,-0.31308,-0.33249,-0.39395,-0.39017,-0.30301,-0.19949,-0.13071,-0.02493,0.14307,0.34961,0.52542,0.63223,0.68613,0.74710,0.87305,0.98184,0.98889,0.97052,0.99066,0.99747,0.99344,0.99469,0.99393,0.99570,0.99393,0.99521,0.99469,0.99420,0.99521,0.99420,0.99521,0.99469,0.99469,0.99521,0.99420,0.99545,0.99445,0.99469,0.99493,0.99420,0.99521,0.99393,0.99493,0.99469,0.99445,0.99570,0.99445,0.99521,0.99469,0.99469,0.99521,0.99420,0.99545,0.99445,0.99445,0.99493,0.99420,0.99545,0.99420,0.99493,0.99493,0.99420,0.99545,0.99445,0.99521,0.99469,0.99445,0.99545,0.99368,0.99393,0.99445,0.99268,0.97983,0.97229,0.95944,0.88486,0.76773,0.64481,0.53098,0.39847,0.19318,-0.03827,-0.20325,-0.39319,-0.68765,-0.88461,-0.93448,-0.96069,-0.97681,-0.98715,-0.99042,-0.99142,-0.99091,-0.99142,-0.99219,-0.99091,-0.99219,-0.99066,-0.99142,-0.99142,-0.99118,-0.99191,-0.99066,-0.99191,-0.99142,-0.99142,-0.99191,-0.99091,-0.99219,-0.99118,-0.99142,-0.99167,-0.99091,-0.99219,-0.99091,-0.99167,-0.99142,-0.99091,-0.99191,-0.99091,-0.99191,-0.99142,-0.99118,-0.99191,-0.99066,-0.99191,-0.99118,-0.99142,-0.99191,-0.99066,-0.99191,-0.99091,-0.99167,-0.99191,-0.99118,-0.99219,-0.99091,-0.99191,-0.99142,-0.99142,-0.99243,-0.98865,-0.98764,-0.99219,-0.98083,-0.92517,-0.92770,-0.91486,-0.59042,-0.15189,0.02945,0.05667,0.06195,0.00629,-0.18008,-0.56497,-0.88010,-0.92770,-0.92871,-0.97705,-0.99167,-0.98663,-0.99118,-0.99042,-0.99219,-0.99142,-0.99118,-0.98941,-0.99219,-1.00000,-0.97580,-0.95993,-0.99948,-0.98236,-0.84659,-0.74860,-0.70679,-0.59747,-0.48035,-0.41687,-0.36826,-0.29745,-0.18185,-0.06219,0.02164,0.07907,0.13123,0.18033,0.19620,0.15692,0.14053,0.20251,0.27530,0.30905,0.29092,0.27252,0.30402,0.32416,0.32214,0.35239,0.39670,0.43198,0.49420,0.58487,0.64154,0.65967,0.67050,0.67026,0.66522,0.65540,0.66119,0.70627,0.75842,0.78738,0.78940,0.78763,0.80402,0.85944,0.94559,0.98990,0.98160,0.98007,0.99368,0.99393,0.98538,0.97580,0.97101,0.93802,0.81812,0.64633,0.46649,0.28613,0.14685,0.08966,0.12543,0.20325,0.24557,0.18866,0.02795,-0.20175,-0.44205,-0.58713,-0.57629,-0.41385,-0.14255,0.18033,0.47882,0.68311,0.72314,0.62064,0.48309,0.43073,0.53577,0.72794,0.90250,0.97354,0.97000,0.98083,0.99191,0.99319,0.99493,0.99393,0.99521,0.99393,0.99545,0.99420,0.99493,0.99493,0.99445,0.99545,0.99420,0.99545,0.99243,0.98917,0.98386,0.97781,0.95844,0.89066,0.81561,0.78134,0.77277,0.75995,0.73022,0.67126,0.57178,0.47000,0.38361,0.29419,0.20703,0.14734,0.15866,0.25162,0.35818,0.45062,0.56750,0.69748,0.81232,0.89697,0.95062,0.97656,0.98615,0.99191,0.99219,0.99243,0.99368,0.99368,0.97028,0.95566,0.94559,0.82617,0.59973,0.38361,0.23901,0.15338,0.12921,0.11206,0.04382,-0.12946,-0.43552,-0.72644,-0.89847,-0.95465,-0.95541,-0.97229,-0.99268,-0.99319,-0.98840,-0.99142,-0.99167,-0.99091,-0.98840,-0.98965,-0.99368,-0.97455,-0.95010,-0.94684,-0.96219,-0.98514,-0.99243,-0.98889,-0.98917,-0.99142,-0.99219,-0.99091,-0.99191,-0.99142,-0.99142,-0.99191,-0.99066,-0.99167,-0.99091,-0.99142,-0.99191,-0.99091,-0.99191,-0.99091,-0.99167,-0.99167,-0.99091,-0.99219,-0.99091,-0.99191,-0.99142,-0.99118,-0.99191,-0.99066,-0.99191,-0.99091,-0.99118,-0.99243,-0.98941,-0.98462,-0.96976,-0.96320,-0.96194,-0.87305,-0.66196,-0.44809,-0.29495,-0.18085,-0.11813,-0.11334,-0.18564,-0.34885,-0.58237,-0.80450,-0.93726,-0.97806,-0.97354,-0.97531,-0.98990,-0.99368,-0.98941,-0.99219,-0.99091,-0.99142,-0.99167,-0.99091,-0.99191,-0.99118,-0.99219,-0.98236,-0.97781,-0.97656,-0.95135,-0.87204,-0.71335,-0.52139,-0.34232,-0.17783,-0.00906,0.14886,0.30450,0.48889,0.67404,0.84030,0.94128,0.97681,0.98462,0.98337,0.99142,0.99521,0.99493,0.99420,0.99445,0.99521,0.99393,0.99545,0.99445,0.99521,0.99521,0.99445,0.99570,0.99445,0.99521,0.99469,0.99445,0.99521,0.99420,0.99521,0.99445,0.99445,0.99521,0.99445,0.99545,0.99445,0.99469,0.99493,0.99393,0.99493,0.99445,0.99393,0.98285,0.97781,0.97479,0.92844,0.82114,0.66095,0.52417,0.46826,0.46722,0.47934,0.47379,0.47076,0.48209,0.42014,0.25439,0.10074,-0.00302,-0.08966,-0.16068,-0.21436,-0.22040,-0.15137,-0.00476,0.18536,0.37631,0.52292,0.62164,0.70425,0.74835,0.72366,0.63928,0.52567,0.40805,0.35666,0.42896,0.60175,0.80200,0.92743,0.96548,0.97632,0.98337,0.99066,0.99521,0.99420,0.99368,0.99292,0.98840,0.98083,0.96774,0.93323,0.85440,0.69470,0.47202,0.20425,-0.08890,-0.36423,-0.60025,-0.77481,-0.90173,-0.96017,-0.97028,-0.98108,-0.98840,-0.99219,-0.98990,-0.99219,-0.99142,-0.99142,-0.99219,-0.99091,-0.99243,-0.99066,-0.99142,-0.99142,-0.99118,-0.99191,-0.99066,-0.99167,-0.99142,-0.99142,-0.99219,-0.99091,-0.99191,-0.99118,-0.99142,-0.99191,-0.99091,-0.99191,-0.99091,-0.99167,-0.99191,-0.99118,-0.99219,-0.99091,-0.99167,-0.99142,-0.99142,-0.99219,-0.99091,-0.99191,-0.99142,-0.99118,-0.98917,-0.99042,-0.99445,-0.97330,-0.95590,-0.96219,-0.89670,-0.72241,-0.55112,-0.44809,-0.39319,-0.37833,-0.35641,-0.26270,-0.14230,-0.11282,-0.13525,-0.11536,-0.09671,-0.11511,-0.18060,-0.26874,-0.33374,-0.42215,-0.51358,-0.44785,-0.30450,-0.28613,-0.30527,-0.25037,-0.15390,-0.08286,-0.11157,-0.12592,-0.00327,0.13803,0.19141,0.12820,0.01788,-0.03952,-0.12592,-0.26773,-0.34634,-0.31384,-0.18060,-0.01080,0.13574,0.26120,0.36975,0.46573,0.55087,0.63626,0.73022,0.83072,0.92014,0.97177,0.98587,0.98413,0.99167,0.99445,0.99292,0.99219,0.98740,0.98007,0.96472,0.92239,0.82166,0.69067,0.57959,0.54962,0.59695,0.64255,0.64633,0.60629,0.55942,0.54910,0.58966,0.61887,0.56952,0.54181,0.59518,0.63248,0.63876,0.65463,0.73398,0.88312,0.96927,0.97101,0.97958,0.99344,0.99420,0.99268,0.99493,0.99469,0.99445,0.99521,0.99445,0.99545,0.99420,0.99493,0.99493,0.99420,0.99545,0.99420,0.99493,0.99420,0.99393,0.99420,0.98840,0.98309,0.98309,0.96069,0.88461,0.79370,0.72064,0.65765,0.59998,0.53247,0.49268,0.48615,0.44205,0.38034,0.36447,0.38715,0.39294,0.32645,0.19595,0.07782,-0.05893,-0.27832,-0.48309,-0.62619,-0.72995,-0.79999,-0.84583,-0.82166,-0.73575,-0.67227,-0.65491,-0.64960,-0.66397,-0.70175,-0.72894,-0.74658,-0.76724,-0.79520,-0.82846,-0.86523,-0.90527,-0.94382,-0.89948,-0.69849,-0.47479,-0.31662,-0.15414,-0.00729,0.07077,0.08237,0.04431,-0.02292,-0.11761,-0.24307,-0.36926,-0.45087,-0.46170,-0.40250,-0.30679,-0.17529,0.00000,0.14331,0.24179,0.36774,0.49545,0.56522,0.57907,0.56775,0.53851,0.51132,0.48688,0.41913,0.26044,0.00955,-0.26297,-0.46396,-0.62341,-0.82214,-0.94684,-0.96774,-0.97531,-0.98413,-0.99017,-0.98990,-0.99219,-0.99066,-0.99142,-0.99167,-0.99118,-0.99219,-0.98990,-0.99118,-0.99368,-0.99142,-0.97757,-0.97403,-0.98007,-0.96170,-0.86826,-0.67783,-0.52719,-0.48788,-0.45490,-0.43146,-0.47681,-0.54105,-0.57983,-0.60904,-0.62317,-0.59949,-0.55566,-0.52063,-0.52115,-0.55112,-0.56244,-0.58337,-0.65540,-0.73373,-0.77228,-0.74759,-0.68890,-0.64609,-0.61887,-0.58060,-0.50351,-0.40729,-0.33929,-0.35110,-0.42944,-0.47028,-0.42267,-0.32718,-0.20224,-0.05640,0.04556,0.10529,0.17630,0.26169,0.33197,0.32138,0.23776,0.20956,0.23148,0.20352,0.23325,0.39267,0.52719,0.58438,0.62289,0.66345,0.70023,0.66296,0.54330,0.42618,0.33475,0.24533,0.14105,0.03851,0.01358,0.09143,0.22845,0.34961,0.41711,0.48740,0.58914,0.69519,0.78186,0.84357,0.89822,0.95389,0.98135,0.98615,0.99167,0.99243,0.99445,0.99420,0.99469,0.99493,0.99393,0.99545,0.99445,0.99521,0.99469,0.99445,0.99521,0.99420,0.99469,0.98965,0.98715,0.98563,0.96295,0.91736,0.86624,0.82367,0.77554,0.68411,0.53549,0.38916,0.26120,0.11435,-0.04053,-0.18161,-0.23172,-0.19394,-0.15237,-0.10730,-0.02997,0.08588,0.22620,0.34305,0.44104,0.55740,0.65765,0.71259,0.69217,0.65363,0.69748,0.79572,0.89368,0.95514,0.97733,0.98413,0.98816,0.99243,0.99445,0.99243,0.97302,0.96674,0.97983,0.90378,0.71005,0.51056,0.40451,0.40982,0.41559,0.32996,0.24356,0.18866,0.11411,0.05365,0.01157,-0.03247,-0.09216,-0.16095,-0.23248,-0.31662,-0.39771,-0.48663,-0.59647,-0.71536,-0.82013,-0.85287,-0.82947,-0.84937,-0.92215,-0.97177,-0.98663,-0.98816,-0.98438,-0.99091,-0.99219,-0.99091,-0.99191,-0.99042,-0.99191,-0.99091,-0.99142,-0.99191,-0.99091,-0.99191,-0.99091,-0.99167,-0.99142]) },
        // based off an old mp3 in #modded-beepbox where someone tried to shorten the overdrive guitar into the size of other chip waves 
        // search "normie alert" in beepcord
        { name: "ultrabox shortened od guitar", expression: 0.5, samples: centerAndNormalizeWave([-0.82785,-0.67621,-0.40268,-0.43817,-0.45468,-0.22531,-0.18329,0.24750,0.71246,0.52155,0.56082,0.48395,0.33990,0.46957,0.27744,0.42313,0.47104,0.18796,0.12930,-0.13901,-0.07431,-0.16348,-0.74857,-0.73206,-0.35181,-0.26227,-0.41882,-0.27786,-0.19806,-0.19867,0.18643,0.24808,0.08847,-0.06964,0.06912,0.20474,-0.05304,0.29416,0.31967,0.14243,0.27521,-0.23932,-0.14752,0.12360,-0.26123,-0.26111,0.06616,0.26520,0.08090,0.15240,0.16254,-0.12061,0.04562,0.00131,0.04050,0.08182,-0.21729,-0.17041,-0.16312,-0.08563,0.06390,0.05099,0.05627,0.02728,0.00726,-0.13028,-0.05673,-0.14969,-0.17645,0.35492,0.16766,-0.00897,0.24326,-0.00461,-0.04456,0.01776,-0.04950,-0.01221,0.02039,0.07684,0.13397,0.39850,0.35962,0.13754,0.42310,0.27161,-0.17609,0.03659,0.10635,-0.21909,-0.22046,-0.20258,-0.40973,-0.40280,-0.40521,-0.66284]) },
]);
	public static chipWaves: DictionaryArray<ChipWave> = rawChipToIntegrated(Config.rawChipWaves);
	public static rawRawChipWaves: DictionaryArray<ChipWave> = Config.rawChipWaves;

	public static firstIndexForSamplesInChipWaveList: number = Config.chipWaves.length;
  
	// Noise waves have too many samples to write by hand, they're generated on-demand by getDrumWave instead.
	public static readonly chipNoises: DictionaryArray<ChipNoise> = toNameMap([
		{ name: "retro", expression: 0.25, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "white", expression: 1.0, basePitch: 69, pitchFilterMult: 8.0, isSoft: true, samples: null },
		// The "clang" and "buzz" noises are based on similar noises in the modded beepbox! :D
		{ name: "clang", expression: 0.4, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "buzz", expression: 0.3, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "hollow", expression: 1.5, basePitch: 96, pitchFilterMult: 1.0, isSoft: true, samples: null },
		{ name: "shine", expression: 1.0, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null }, // Identical to buzz but louder. For now we're keeping it...
		{ name: "deep", expression: 1.5, basePitch: 120, pitchFilterMult: 1024.0, isSoft: true, samples: null },
		{ name: "cutter", expression: 0.005, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "metallic", expression: 1.0, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "static", expression: 1.0, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		// technically these are from the pandorasbox beta but whatever
		{ name: "1-bit white", expression: 0.5, basePitch: 74.41, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "1-bit metallic", expression: 0.5, basePitch: 86.41, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		// ultrabox noises
		{ name: "crackling", expression: 0.9, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "pink", expression: 1.0, basePitch: 69, pitchFilterMult: 8.0, isSoft: true, samples: null },
		{ name: "brownian", expression: 1.0, basePitch: 69, pitchFilterMult: 8.0, isSoft: true, samples: null },
	]);
	
    public static readonly filterFreqStep: number = 1.0 / 4.0;
    public static readonly filterFreqRange: number = 34;
    public static readonly filterFreqReferenceSetting: number = 28;
    public static readonly filterFreqReferenceHz: number = 8000.0;
    public static readonly filterFreqMaxHz: number = Config.filterFreqReferenceHz * Math.pow(2.0, Config.filterFreqStep * (Config.filterFreqRange - 1 - Config.filterFreqReferenceSetting)); // ~19khz
    public static readonly filterFreqMinHz: number = 8.0;
    public static readonly filterGainRange: number = 15;
    public static readonly filterGainCenter: number = 7;
    public static readonly filterGainStep: number = 1.0 / 2.0;
    public static readonly filterMaxPoints: number = 8;
    public static readonly filterTypeNames: ReadonlyArray<string> = ["low-pass", "high-pass", "peak"]; // See FilterType enum above.
    public static readonly filterMorphCount: number = 10; // Number of filter shapes allowed for modulating between. Counts the 0/default position.

    public static readonly filterSimpleCutRange: number = 11;
    public static readonly filterSimplePeakRange: number = 8;

    public static readonly fadeInRange: number = 10;
    public static readonly fadeOutTicks: ReadonlyArray<number> = [-24, -12, -6, -3, -1, 6, 12, 24, 48, 72, 96];
    public static readonly fadeOutNeutral: number = 4;
    public static readonly drumsetFadeOutTicks: number = 48;
	public static readonly transitions: DictionaryArray<Transition> = toNameMap([
        { name: "normal", isSeamless: false, continues: false, slides: false, slideTicks: 3, includeAdjacentPatterns: false },
        { name: "interrupt", isSeamless: true, continues: false, slides: false, slideTicks: 3, includeAdjacentPatterns: true },
        { name: "continue", isSeamless: true, continues: true, slides: false, slideTicks: 3, includeAdjacentPatterns: true },
        { name: "slide", isSeamless: true, continues: false, slides: true, slideTicks: 3, includeAdjacentPatterns: true },
        { name: "slide in pattern", isSeamless: true, continues: false, slides: true, slideTicks: 3, includeAdjacentPatterns: false }
	]);
	public static readonly vibratos: DictionaryArray<Vibrato> = toNameMap([
        { name: "none", amplitude: 0.0, type: 0, delayTicks: 0 },
        { name: "light", amplitude: 0.15, type: 0, delayTicks: 0 },
        { name: "delayed", amplitude: 0.3, type: 0, delayTicks: 37 }, // It will fade in over the previous two ticks.
        { name: "heavy", amplitude: 0.45, type: 0, delayTicks: 0 },
        { name: "shaky", amplitude: 0.1, type: 1, delayTicks: 0 },
			//    { name: "very shaky", amplitude: 1, type: 0, delayTicks: 0 },
	//{ name: "insane", amplitude: 10, type: 1, delayTicks: 0 },
	    //todbox vibratos
	//	{ name: "super insane", amplitude: 30, type: 1, delayTicks: 1 },
		//wackybox
	//	 { name: "quiver", amplitude: 0.001, type: 0, delayTicks: 0 },
      //  { name: "wub-wub", amplitude: 10.0, type: 0, delayTicks: 0 },
   //     { name: "quiver delayed", amplitude: 0.001, type: 0, delayTicks: 18 },
      //  { name: "vibrate", amplitude: 0.08, type: 0, delayTicks: 0 },
    //    { name: "too much wub", amplitude: 30.0, type: 0, delayTicks: 18 },
	 //too much wub breaks things just a little bit at it's original amplitude
		//sandbox
	]);
	public static readonly vibratoTypes: DictionaryArray<VibratoType> = toNameMap([
		{ name: "normal", periodsSeconds: [0.14], period: 0.14 },
		{ name: "shaky", periodsSeconds: [0.11, 1.618 * 0.11, 3 * 0.11], period: 266.97 }, // LCM of all periods
	]);
	// This array is more or less a linear step by 0.1 but there's a bit of range added at the start to hit specific ratios, and the end starts to grow faster.
	//                                                             0       1      2    3     4      5    6    7      8     9   10   11 12   13   14   15   16   17   18   19   20   21 22   23   24   25   26   27   28   29   30   31 32   33   34   35   36   37   38    39  40   41 42    43   44   45   46 47   48 49 50
	public static readonly arpSpeedScale: ReadonlyArray<number> = [0, 0.0625, 0.125, 0.2, 0.25, 1 / 3, 0.4, 0.5, 2 / 3, 0.75, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.15, 4.3, 4.5, 4.8, 5, 5.5, 6, 8];
	public static readonly unisons: DictionaryArray<Unison> = toNameMap([
        { name: "none", voices: 1, spread: 0.0, offset: 0.0, expression: 1.4, sign: 1.0 },
        { name: "shimmer", voices: 2, spread: 0.018, offset: 0.0, expression: 0.8, sign: 1.0 },
        { name: "hum", voices: 2, spread: 0.045, offset: 0.0, expression: 1.0, sign: 1.0 },
        { name: "honky tonk", voices: 2, spread: 0.09, offset: 0.0, expression: 1.0, sign: 1.0 },
        { name: "dissonant", voices: 2, spread: 0.25, offset: 0.0, expression: 0.9, sign: 1.0 },
        { name: "fifth", voices: 2, spread: 3.5, offset: 3.5, expression: 0.9, sign: 1.0 },
        { name: "octave", voices: 2, spread: 6.0, offset: 6.0, expression: 0.8, sign: 1.0 },
        { name: "bowed", voices: 2, spread: 0.02, offset: 0.0, expression: 1.0, sign: -1.0 },
        { name: "piano", voices: 2, spread: 0.01, offset: 0.0, expression: 1.0, sign: 0.7 },
        { name: "warbled", voices: 2, spread: 0.25, offset: 0.05, expression: 0.9, sign: -0.8 },
        { name: "hecking gosh", voices: 2, spread: 6.25, offset: -6.0, expression: 0.8, sign: -0.7 },
		{ name: "spinner", voices: 2, spread: 0.02, offset: 0.0, expression: 1.0, sign: 1.0 },
		{ name: "detune", voices: 1, spread: 0.0, offset: 0.25, expression: 1.0, sign: 1.0 },
		{ name: "rising", voices: 2, spread: 1.0, offset: 0.7, expression: 0.95, sign: 1.0 },
		{ name: "vibrate", voices: 2, spread: 3.5, offset: 7, expression: 0.975, sign: 1.0 },
		{ name: "fourths", voices: 2, spread: 4, offset: 4, expression: 0.95, sign: 1.0 },
		{ name: "bass", voices: 1, spread: 0, offset: -7, expression: 1.0, sign: 1.0 },
		{ name: "dirty", voices: 2, spread: 0, offset: 0.1, expression: 0.975, sign: 1.0 },
		{ name: "stationary", voices: 2, spread: 3.5, offset: 0.0, expression: 0.9, sign: 1.0 },
		{ name: "recurve", voices: 2, spread: 0.005, offset: 0.0, expression: 1.0, sign: 1.0 },
		{ name: "voiced", voices: 2, spread: 9.5, offset: 0.0, expression: 1.0, sign: 1.0 },
		{ name: "fluctuate", voices: 2, spread: 12, offset: 0.0, expression: 1.0, sign: 1.0 },
		{ name: "thin", voices: 1, spread: 0.0, offset: 50.0, expression: 1.0, sign: 1.0 },
		{ name: "inject", voices: 2, spread: 6.0, offset: 0.4, expression: 1.0, sign: 1.0 },
	    { name: "askewed", voices: 2, spread: 0.0, offset: 0.42, expression: 0.7, sign: 1.0 },
        { name: "resonance", voices: 2, spread: 0.0025, offset: 0.1, expression: 0.8, sign: -1.5 },
		{ name: "FART", voices: 2, spread: 13, offset: -5, expression: 1.0, sign: -3 },
		
	 //for modbox; voices = riffapp, spread = intervals, offset = offsets, expression = volume, and sign = signs
	]);
    public static readonly effectNames: ReadonlyArray<string> = ["reverb", "chorus", "panning", "distortion", "bitcrusher", "note filter", "echo", "pitch shift", "detune", "vibrato", "transition type", "chord type"];
    public static readonly effectOrder: ReadonlyArray<EffectType> = [EffectType.panning, EffectType.transition, EffectType.chord, EffectType.pitchShift, EffectType.detune, EffectType.vibrato, EffectType.noteFilter, EffectType.distortion, EffectType.bitcrusher, EffectType.chorus, EffectType.echo, EffectType.reverb];
    public static readonly noteSizeMax: number = 6;
	public static readonly volumeRange: number = 50;
	// Beepbox's old volume scale used factor -0.5 and was [0~7] had roughly value 6 = 0.125 power. This new value is chosen to have -21 be the same,
	// given that the new scale is [-25~25]. This is such that conversion between the scales is roughly equivalent by satisfying (0.5*6 = 0.1428*21)
	public static readonly volumeLogScale: number = 0.1428;
	public static readonly panCenter: number = 50;
	public static readonly panMax: number = Config.panCenter * 2;
	public static readonly panDelaySecondsMax: number = 0.001;
    public static readonly chorusRange: number = 8;
    public static readonly chorusPeriodSeconds: number = 2.0;
    public static readonly chorusDelayRange: number = 0.0034;
    public static readonly chorusDelayOffsets: ReadonlyArray<ReadonlyArray<number>> = [[1.51, 2.10, 3.35], [1.47, 2.15, 3.25]];
    public static readonly chorusPhaseOffsets: ReadonlyArray<ReadonlyArray<number>> = [[0.0, 2.1, 4.2], [3.2, 5.3, 1.0]];
    public static readonly chorusMaxDelay: number = Config.chorusDelayRange * (1.0 + Config.chorusDelayOffsets[0].concat(Config.chorusDelayOffsets[1]).reduce((x, y) => Math.max(x, y)));
	public static readonly chords: DictionaryArray<Chord> = toNameMap([
        { name: "simultaneous", customInterval: false, arpeggiates: false, strumParts: 0, singleTone: false },
        { name: "strum", customInterval: false, arpeggiates: false, strumParts: 1, singleTone: false },
        { name: "arpeggio", customInterval: false, arpeggiates: true, strumParts: 0, singleTone: true },
        { name: "custom interval", customInterval: true, arpeggiates: false, strumParts: 0, singleTone: true },
    ]);
    public static readonly maxChordSize: number = 9;
    public static readonly operatorCount: number = 4;
	public static readonly maxPitchOrOperatorCount: number = Math.max(Config.maxChordSize, Config.operatorCount+2);
    public static readonly algorithms: DictionaryArray<Algorithm> = toNameMap([
        { name: "1←(2 3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3, 4], [], [], []] },
        { name: "1←(2 3←4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [], [4], []] },
        { name: "1←2←(3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3, 4], [], []] },
        { name: "1←(2 3)←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [4], [4], []] },
        { name: "1←2←3←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3], [4], []] },
        { name: "1←3 2←4", carrierCount: 2, associatedCarrier: [1, 2, 1, 2], modulatedBy: [[3], [4], [], []] },
        { name: "1 2←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3, 4], [], []] },
        { name: "1 2←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3], [4], []] },
        { name: "(1 2)←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3], [3], [4], []] },
        { name: "(1 2)←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3, 4], [3, 4], [], []] },
        { name: "1 2 3←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[], [], [4], []] },
        { name: "(1 2 3)←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[4], [4], [4], []] },
        { name: "1 2 3 4", carrierCount: 4, associatedCarrier: [1, 2, 3, 4], modulatedBy: [[], [], [], []] },
        { name: "1←(2 3) 2←4", carrierCount: 2, associatedCarrier: [1, 2, 1, 2], modulatedBy: [[2, 3], [4], [], []] },
        { name: "1←(2 (3 (4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[2, 3, 4], [3, 4], [4], []] },
    ]);
    public static readonly algorithms6Op: DictionaryArray<Algorithm> = toNameMap([
        //placeholder makes life easier for later
        { name: "Custom", carrierCount: 1, associatedCarrier: [1, 1, 1, 1, 1, 1], modulatedBy: [[2, 3, 4, 5, 6], [], [], [], [], []] },
        //yoinked from SynthBox
        //algortihm Section 1
        { name: "1←2←3←4←5←6", carrierCount: 1, associatedCarrier: [1, 1, 1, 1, 1, 1], modulatedBy: [[2], [3], [4], [5], [6], []] },
        { name: "1←3 2←4←5←6", carrierCount: 2, associatedCarrier: [1, 2, 2, 2, 2, 2], modulatedBy: [[3], [4], [], [5], [6], []] },
        { name: "1←3←4 2←5←6", carrierCount: 2, associatedCarrier: [1, 1, 1, 2, 2, 2], modulatedBy: [[3], [5], [4], [], [6], []] },
        { name: "1←4 2←5 3←6", carrierCount: 3, associatedCarrier: [1, 2, 3, 1, 2, 3], modulatedBy: [[4], [5], [6], [], [], []] },
        //Algorithm Section 2
        { name: "1←3 2←(4 5←6)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2, 2, 2], modulatedBy: [[3], [4, 5], [], [], [6], []] },
        { name: "1←(3 4) 2←5←6", carrierCount: 2, associatedCarrier: [1, 2, 2, 2, 2, 2], modulatedBy: [[3, 4], [5], [], [], [6], []] },
        { name: "1←3 2←(4 5 6)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2, 2, 2], modulatedBy: [[3], [4, 5, 6], [], [], [], []] },
        { name: "1←3 2←(4 5)←6", carrierCount: 2, associatedCarrier: [1, 2, 2, 2, 2, 2], modulatedBy: [[3], [4, 5], [], [6], [6], []] },
        { name: "1←3 2←4←(5 6)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2, 2, 2], modulatedBy: [[3], [4], [], [5, 6], [], []] },
        { name: "1←(2 3 4 5 6)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1, 1, 1], modulatedBy: [[2, 3, 4, 5, 6], [], [], [], [], []] },
        { name: "1←(2 3←5 4←6)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1, 1, 1], modulatedBy: [[2, 3, 4], [], [5], [6], [], []] },
        { name: "1←(2 3 4←5←6)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1, 1, 1], modulatedBy: [[2, 3, 4], [], [], [5], [6], []] },
        //Algorithm Section 3
        { name: "1←4←5 (2 3)←6", carrierCount: 3, associatedCarrier: [1, 2, 3, 1, 2, 3], modulatedBy: [[4], [6], [6], [5], [], []] },
        { name: "1←(3 4)←5 2←6", carrierCount: 2, associatedCarrier: [1, 2, 2, 2, 2, 2], modulatedBy: [[3, 4], [6], [5], [5], [], []] },
        { name: "(1 2)←4 3←(5 6)", carrierCount: 3, associatedCarrier: [1, 2, 3, 1, 2, 3], modulatedBy: [[4], [4], [5, 6], [], [], []] },
        { name: "(1 2)←5 (3 4)←6", carrierCount: 4, associatedCarrier: [1, 2, 3, 4, 4, 4], modulatedBy: [[5], [5], [6], [6], [], []] },
        { name: "(1 2 3)←(4 5 6)", carrierCount: 3, associatedCarrier: [1, 2, 3, 1, 2, 3], modulatedBy: [[4, 5, 6], [4, 5, 6], [4, 5, 6], [], [], []] },
        { name: "1←5 (2 3 4)←6", carrierCount: 4, associatedCarrier: [1, 2, 3, 4, 4, 4], modulatedBy: [[5], [6], [6], [6], [], []] },
        { name: "1 2←5 (3 4)←6", carrierCount: 4, associatedCarrier: [1, 2, 3, 4, 4, 4], modulatedBy: [[], [5], [6], [6], [], []] },
        { name: "1 2 (3 4 5)←6", carrierCount: 5, associatedCarrier: [1, 2, 3, 4, 5, 5], modulatedBy: [[], [], [6], [6], [6], []] },
        { name: "1 2 3 (4 5)←6", carrierCount: 5, associatedCarrier: [1, 2, 3, 4, 5, 5], modulatedBy: [[], [], [], [6], [6], []] },
        //Algorithm Section 3
        { name: "1 2←4 3←(5 6)", carrierCount: 3, associatedCarrier: [1, 2, 3, 3, 3, 3], modulatedBy: [[], [4], [5, 6], [], [], []] },
        { name: "1←4 2←(5 6) 3", carrierCount: 3, associatedCarrier: [1, 2, 3, 3, 3, 3,], modulatedBy: [[4], [5, 6], [], [], [], []] },
        { name: "1 2 3←5 4←6", carrierCount: 4, associatedCarrier: [1, 2, 3, 4, 4, 4], modulatedBy: [[], [], [5], [6], [], []] },
        { name: "1 (2 3)←5←6 4", carrierCount: 4, associatedCarrier: [1, 2, 3, 4, 4, 4,], modulatedBy: [[], [5], [5], [], [6], []] },
        { name: "1 2 3←5←6 4", carrierCount: 4, associatedCarrier: [1, 2, 3, 4, 4, 4], modulatedBy: [[], [], [5, 6], [], [], []] },
        { name: "(1 2 3 4 5)←6", carrierCount: 5, associatedCarrier: [1, 2, 3, 4, 5, 5], modulatedBy: [[6], [6], [6], [6], [6], []] },
        { name: "1 2 3 4 5←6", carrierCount: 5, associatedCarrier: [1, 2, 3, 4, 5, 5], modulatedBy: [[], [], [], [], [6], []] },
        { name: "1 2 3 4 5 6", carrierCount: 6, associatedCarrier: [1, 2, 3, 4, 5, 6], modulatedBy: [[], [], [], [], [], []] },
        //Section 4 where we take our own previous ones for 4op and it gets weird
        { name: "1←(2 (3 (4 (5 (6", carrierCount: 5, associatedCarrier: [1, 2, 3, 4, 5, 5], modulatedBy: [[2, 3, 4, 5, 6], [3, 4, 5, 6], [4, 5, 6], [5, 6], [6], []] },
        { name: "1←(2(3(4(5(6", carrierCount: 1, associatedCarrier: [1, 1, 1, 1, 1, 1], modulatedBy: [[2, 3, 4, 5, 6], [3, 4, 5, 6], [4, 5, 6], [5, 6], [6], []] },
        { name: "1←4(2←5(3←6", carrierCount: 3, associatedCarrier: [1, 2, 3, 1, 2, 3], modulatedBy: [[2, 3, 4], [3, 5], [6], [], [], []] },
        { name: "1←4(2←5 3←6", carrierCount: 3, associatedCarrier: [1, 2, 3, 1, 2, 3], modulatedBy: [[2, 3, 4], [5], [6], [], [], []] },
    ]);
    public static readonly operatorCarrierInterval: ReadonlyArray<number> = [0.0, 0.04, -0.073, 0.091, 0.061, 0.024];
	public static readonly operatorAmplitudeMax: number = 15;
    public static readonly operatorFrequencies: DictionaryArray<OperatorFrequency> = toNameMap([
        { name: "0.12×", mult: 0.125, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "0.25×", mult: 0.25, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "0.5×", mult: 0.5, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "0.75×", mult: 0.75, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "1×", mult: 1.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "~1×", mult: 1.0, hzOffset: 1.5, amplitudeSign: -1.0 },
        { name: "2×", mult: 2.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "~2×", mult: 2.0, hzOffset: -1.3, amplitudeSign: -1.0 },
        { name: "3×", mult: 3.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "3.5×", mult: 3.5, hzOffset: -0.05, amplitudeSign: 1.0 },
        { name: "4×", mult: 4.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "~4×", mult: 4.0, hzOffset: -2.4, amplitudeSign: -1.0 },
        { name: "5×", mult: 5.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "6×", mult: 6.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "7×", mult: 7.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "8×", mult: 8.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "9×", mult: 9.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "10×", mult: 10.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "11×", mult: 11.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "12×", mult: 12.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "13×", mult: 13.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "14×", mult: 14.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	    		{ name: "15×", mult: 15.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		//ultrabox
        { name: "16×", mult: 16.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	    		{ name: "17×", mult: 17.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		//ultrabox
        { name: "18×", mult: 18.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	    		{ name: "19×", mult: 19.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		//ultrabox
        { name: "20×", mult: 20.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	    	{ name: "~20×", mult: 20.0, hzOffset: -5.0, amplitudeSign: -1.0 },
	    // dogebox (maybe another mod also adds this? I got it from dogebox)
		{ name: "25×", mult: 25.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	{ name: "50×", mult: 50.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	{ name: "75×", mult: 75.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	{ name: "100×", mult: 100.0, hzOffset: 0.0, amplitudeSign: 1.0 }
	    //50 and 100 are from dogebox
    ]);

    public static readonly envelopes: DictionaryArray<Envelope> = toNameMap([
        { name: "none", type: EnvelopeType.none, speed: 0.0 },
        { name: "note size", type: EnvelopeType.noteSize, speed: 0.0 },
        { name: "punch", type: EnvelopeType.punch, speed: 0.0 },
        { name: "flare -1", type: EnvelopeType.flare, speed: 128.0 },
        { name: "flare 1", type: EnvelopeType.flare, speed: 32.0 },
        { name: "flare 2", type: EnvelopeType.flare, speed: 8.0 },
        { name: "flare 3", type: EnvelopeType.flare, speed: 2.0 },
        { name: "twang -1", type: EnvelopeType.twang, speed: 128.0 },
        { name: "twang 1", type: EnvelopeType.twang, speed: 32.0 },
        { name: "twang 2", type: EnvelopeType.twang, speed: 8.0 },
        { name: "twang 3", type: EnvelopeType.twang, speed: 2.0 },
        { name: "swell -1", type: EnvelopeType.swell, speed: 128.0 },
        { name: "swell 1", type: EnvelopeType.swell, speed: 32.0 },
        { name: "swell 2", type: EnvelopeType.swell, speed: 8.0 },
        { name: "swell 3", type: EnvelopeType.swell, speed: 2.0 },
        { name: "tremolo0", type: EnvelopeType.tremolo, speed: 8.0 },
        { name: "tremolo1", type: EnvelopeType.tremolo, speed: 4.0 },
        { name: "tremolo2", type: EnvelopeType.tremolo, speed: 2.0 },
        { name: "tremolo3", type: EnvelopeType.tremolo, speed: 1.0 },
        { name: "tremolo4", type: EnvelopeType.tremolo2, speed: 4.0 },
        { name: "tremolo5", type: EnvelopeType.tremolo2, speed: 2.0 },
        { name: "tremolo6", type: EnvelopeType.tremolo2, speed: 1.0 },
        { name: "decay -1", type: EnvelopeType.decay, speed: 40.0 },
        { name: "decay 1", type: EnvelopeType.decay, speed: 10.0 },
        { name: "decay 2", type: EnvelopeType.decay, speed: 7.0 },
        { name: "decay 3", type: EnvelopeType.decay, speed: 4.0 },
        { name: "wibble-1", type: EnvelopeType.wibble, speed: 96.0 },
        { name: "wibble 1", type: EnvelopeType.wibble, speed: 24.0 },
        { name: "wibble 2", type: EnvelopeType.wibble, speed: 12.0 },
        { name: "wibble 3", type: EnvelopeType.wibble, speed: 4.0 },
        { name: "linear-2", type: EnvelopeType.linear, speed: 256.0 },
        { name: "linear-1", type: EnvelopeType.linear, speed: 128.0 },
        { name: "linear 1", type: EnvelopeType.linear, speed: 32.0 },
        { name: "linear 2", type: EnvelopeType.linear, speed: 8.0 },
        { name: "linear 3", type: EnvelopeType.linear, speed: 2.0 },
        { name: "rise -2", type: EnvelopeType.rise, speed: 256.0 },
        { name: "rise -1", type: EnvelopeType.rise, speed: 128.0 },
        { name: "rise 1", type: EnvelopeType.rise, speed: 32.0 },
        { name: "rise 2", type: EnvelopeType.rise, speed: 8.0 },
        { name: "rise 3", type: EnvelopeType.rise, speed: 2.0 },
	    		//modbox
        { name: "flute 1", type: 9, speed: 16.0 },
		{ name: "flute 2", type: 9, speed: 8.0 },
		{ name: "flute 3", type: 9, speed: 4.0 },
        // sandbox
		{ name: "tripolo1", type: 6, speed: 9.0 },
        { name: "tripolo2", type: 6, speed: 6.0 },
        { name: "tripolo3", type: 6, speed: 3.0 },
        { name: "tripolo4", type: 7, speed: 9.0 },
        { name: "tripolo5", type: 7, speed: 6.0 },
        { name: "tripolo6", type: 7, speed: 3.0 },
        { name: "pentolo1", type: 6, speed: 10.0 },
        { name: "pentolo2", type: 6, speed: 5.0 },
        { name: "pentolo3", type: 6, speed: 2.5 },
        { name: "pentolo4", type: 7, speed: 10.0 },
        { name: "pentolo5", type: 7, speed: 5.0 },
        { name: "pentolo6", type: 7, speed: 2.5 },	
        // todbox
	    { name: "flutter 1", type: 6, speed: 14.0 },
        { name: "flutter 2", type: 7, speed: 11.0 },
        { name: "water-y flutter", type: 6, speed: 9.0 },
	    // new jummbox
        { name: "blip 1", type: EnvelopeType.blip, speed: 6.0 },
        { name: "blip 2", type: EnvelopeType.blip, speed: 16.0 },
        { name: "blip 3", type: EnvelopeType.blip, speed: 32.0 },
    ]);
	public static readonly feedbacks: DictionaryArray<Feedback> = toNameMap([
		{ name: "1⟲", indices: [[1], [], [], []] },
		{ name: "2⟲", indices: [[], [2], [], []] },
		{ name: "3⟲", indices: [[], [], [3], []] },
		{ name: "4⟲", indices: [[], [], [], [4]] },
		{ name: "1⟲ 2⟲", indices: [[1], [2], [], []] },
		{ name: "3⟲ 4⟲", indices: [[], [], [3], [4]] },
		{ name: "1⟲ 2⟲ 3⟲", indices: [[1], [2], [3], []] },
		{ name: "2⟲ 3⟲ 4⟲", indices: [[], [2], [3], [4]] },
		{ name: "1⟲ 2⟲ 3⟲ 4⟲", indices: [[1], [2], [3], [4]] },
		{ name: "1→2", indices: [[], [1], [], []] },
		{ name: "1→3", indices: [[], [], [1], []] },
		{ name: "1→4", indices: [[], [], [], [1]] },
		{ name: "2→3", indices: [[], [], [2], []] },
		{ name: "2→4", indices: [[], [], [], [2]] },
		{ name: "3→4", indices: [[], [], [], [3]] },
		{ name: "1→3 2→4", indices: [[], [], [1], [2]] },
		{ name: "1→4 2→3", indices: [[], [], [2], [1]] },
        { name: "1→2→3→4", indices: [[], [1], [2], [3]] },
        { name: "1↔2 3↔4", indices: [[2], [1], [4], [3]] },
        { name: "1↔4 2↔3", indices: [[4], [3], [2], [1]] },
        { name: "2→1→4→3→2", indices: [[2], [3], [4], [1]] },
        { name: "1→2→3→4→1", indices: [[4], [1], [2], [3]] },
        { name: "(1 2 3)→4", indices: [[], [], [], [1, 2, 3]] },
        { name: "ALL", indices: [[1,2,3,4], [1,2,3,4], [1,2,3,4], [1, 2, 3,4]] },
    ]);
    public static readonly feedbacks6Op: DictionaryArray<Feedback> = toNameMap([
        //placeholder makes life easier for later
        { name: "Custom", indices: [[2, 3, 4, 5, 6], [], [], [], [], []] },

        { name: "1⟲", indices: [[1], [], [], [], [], []] },
        { name: "2⟲", indices: [[], [2], [], [], [], []] },
        { name: "3⟲", indices: [[], [], [3], [], [], []] },
        { name: "4⟲", indices: [[], [], [], [4], [], []] },
        { name: "5⟲", indices: [[], [], [], [], [5], []] },
        { name: "6⟲", indices: [[], [], [], [], [], [6]] },
        { name: "1⟲ 2⟲", indices: [[1], [2], [], [], [], []] },
        { name: "3⟲ 4⟲", indices: [[], [], [3], [4], [], []] },
        { name: "1⟲ 2⟲ 3⟲", indices: [[1], [2], [3], [], [], []] },
        { name: "2⟲ 3⟲ 4⟲", indices: [[], [2], [3], [4], [], []] },
        { name: "1⟲ 2⟲ 3⟲ 4⟲", indices: [[1], [2], [3], [4], [], []] },
        { name: "1⟲ 2⟲ 3⟲ 4⟲ 5⟲", indices: [[1], [2], [3], [4], [5], []] },
        { name: "1⟲ 2⟲ 3⟲ 4⟲ 5⟲ 6⟲", indices: [[1], [2], [3], [4], [5], [6]] },
        { name: "1→2", indices: [[], [1], [], [], [], []] },
        { name: "1→3", indices: [[], [], [1], [], [], []] },
        { name: "1→4", indices: [[], [], [], [1], [], []] },
        { name: "1→5", indices: [[], [], [], [], [1], []] },
        { name: "1→6", indices: [[], [], [], [], [], [1]] },
        { name: "2→3", indices: [[], [], [2], [], [], []] },
        { name: "2→4", indices: [[], [], [], [2], [], []] },
        { name: "3→4", indices: [[], [], [], [3], [], []] },
        { name: "4→5", indices: [[], [], [], [], [4], []] },
        { name: "1→4 2→5 3→6", indices: [[], [], [], [1], [2], [3]] },
        { name: "1→5 2→6 3→4", indices: [[], [], [], [3], [1], [2]] },
        { name: "1→2→3→4→5→6", indices: [[], [1], [2], [3], [4], [5]] },
        { name: "2→1→6→5→4→3→2", indices: [[2], [3], [4], [5], [6], [1]] },
        { name: "1→2→3→4→5→6→1", indices: [[6], [1], [2], [3], [4], [5]] },
        { name: "1↔2 3↔4 5↔6", indices: [[2], [1], [4], [3], [6], [5]] },
        { name: "1↔4 2↔5 3↔6", indices: [[4], [5], [6], [1], [2], [3]] },
        { name: "(1,2,3,4,5)→6", indices: [[], [], [], [], [], [1, 2, 3, 4, 5]] },
        { name: "ALL", indices: [[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6]] },
    ]);
    public static readonly chipNoiseLength: number = 1 << 15; // 32768
    public static readonly spectrumNoiseLength: number = 1 << 15; // 32768
    public static readonly spectrumBasePitch: number = 24;
    public static readonly spectrumControlPoints: number = 30;
    public static readonly spectrumControlPointsPerOctave: number = 7;
    public static readonly spectrumControlPointBits: number = 3;
    public static readonly spectrumMax: number = (1 << Config.spectrumControlPointBits) - 1;
    public static readonly harmonicsControlPoints: number = 28;
    public static readonly harmonicsRendered: number = 64;
    public static readonly harmonicsRenderedForPickedString: number = 1 << 8; // 256
    public static readonly harmonicsControlPointBits: number = 3;
    public static readonly harmonicsMax: number = (1 << Config.harmonicsControlPointBits) - 1;
    public static readonly harmonicsWavelength: number = 1 << 11; // 2048
    public static readonly pulseWidthRange: number = 50;
    public static readonly pulseWidthStepPower: number = 0.5;
    public static readonly supersawVoiceCount: number = 7;
	public static readonly supersawDynamismMax: number = 6;
	public static readonly supersawSpreadMax: number = 12;
	public static readonly supersawShapeMax: number = 6;
    public static readonly pitchChannelCountMin: number = 1;
    public static readonly pitchChannelCountMax: number = 60;
    public static readonly noiseChannelCountMin: number = 0;
    public static readonly noiseChannelCountMax: number = 60;
    public static readonly modChannelCountMin: number = 0;
    public static readonly modChannelCountMax: number = 60;
    public static readonly noiseInterval: number = 6;
    public static readonly pitchesPerOctave: number = 12; // TODO: Use this for converting pitch to frequency.
    public static readonly drumCount: number = 12;
    public static readonly pitchOctaves: number = 8;
    public static readonly modCount: number = 6;
    public static readonly maxPitch: number = Config.pitchOctaves * Config.pitchesPerOctave;
    public static readonly maximumTonesPerChannel: number = Config.maxChordSize * 2;
    public static readonly justIntonationSemitones: number[] = [1.0 / 2.0, 8.0 / 15.0, 9.0 / 16.0, 3.0 / 5.0, 5.0 / 8.0, 2.0 / 3.0, 32.0 / 45.0, 3.0 / 4.0, 4.0 / 5.0, 5.0 / 6.0, 8.0 / 9.0, 15.0 / 16.0, 1.0, 16.0 / 15.0, 9.0 / 8.0, 6.0 / 5.0, 5.0 / 4.0, 4.0 / 3.0, 45.0 / 32.0, 3.0 / 2.0, 8.0 / 5.0, 5.0 / 3.0, 16.0 / 9.0, 15.0 / 8.0, 2.0].map(x => Math.log2(x) * Config.pitchesPerOctave);
    public static readonly pitchShiftRange: number = Config.justIntonationSemitones.length;
    public static readonly pitchShiftCenter: number = Config.pitchShiftRange >> 1;
    public static readonly detuneCenter: number = 200;
    public static readonly detuneMax: number = 400;
    public static readonly detuneMin: number = 0;
    public static readonly songDetuneMin: number = 0;
    public static readonly songDetuneMax: number = 500;
    public static readonly unisonVoicesMin: number = 1;
    public static readonly unisonVoicesMax: number = 2;
    public static readonly unisonSpreadMin: number = -96;
    public static readonly unisonSpreadMax: number = 96; 
    public static readonly unisonOffsetMin: number = -96;
    public static readonly unisonOffsetMax: number = 96; 
    public static readonly unisonExpressionMin: number = -2;
    public static readonly unisonExpressionMax: number = 2; 
    public static readonly unisonSignMin: number = -2;
    public static readonly unisonSignMax: number = 2; 
    public static readonly sineWaveLength: number = 1 << 8; // 256
    public static readonly sineWaveMask: number = Config.sineWaveLength - 1;
    public static readonly sineWave: Float32Array = generateSineWave();

    // Picked strings have an all-pass filter with a corner frequency based on the tone fundamental frequency, in order to add a slight inharmonicity. (Which is important for distortion.)
    public static readonly pickedStringDispersionCenterFreq: number = 6000.0; // The tone fundamental freq is pulled toward this freq for computing the all-pass corner freq.
    public static readonly pickedStringDispersionFreqScale: number = 0.3; // The tone fundamental freq freq moves this much toward the center freq for computing the all-pass corner freq.
    public static readonly pickedStringDispersionFreqMult: number = 4.0; // The all-pass corner freq is based on this times the adjusted tone fundamental freq.
    public static readonly pickedStringShelfHz: number = 4000.0; // The cutoff freq of the shelf filter that is used to decay the high frequency energy in the picked string.

    public static readonly distortionRange: number = 8;
    public static readonly stringSustainRange: number = 15;
    public static readonly stringDecayRate: number = 0.12;
    public static readonly enableAcousticSustain: boolean = false;
	public static readonly sustainTypeNames: ReadonlyArray<string> = ["bright", "acoustic"]; // See SustainType enum above.

    public static readonly bitcrusherFreqRange: number = 14;
    public static readonly bitcrusherOctaveStep: number = 0.5;
    public static readonly bitcrusherQuantizationRange: number = 8;

    public static readonly maxEnvelopeCount: number = 12;
    public static readonly defaultAutomationRange: number = 13;
    public static readonly instrumentAutomationTargets: DictionaryArray<AutomationTarget> = toNameMap([
        { name: "none", computeIndex: null, displayName: "none",             /*perNote: false,*/ interleave: false, isFilter: false, /*range: 0,                              */    maxCount: 1, effect: null, compatibleInstruments: null },
        { name: "noteVolume", computeIndex: EnvelopeComputeIndex.noteVolume, displayName: "note volume",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.volumeRange,             */    maxCount: 1, effect: null, compatibleInstruments: null },
        { name: "pulseWidth", computeIndex: EnvelopeComputeIndex.pulseWidth, displayName: "pulse width",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.pulseWidthRange,         */    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.pwm, InstrumentType.supersaw] },
        { name: "stringSustain", computeIndex: EnvelopeComputeIndex.stringSustain, displayName: "sustain",          /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.stringSustainRange,      */    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.pickedString] },
        { name: "unison", computeIndex: EnvelopeComputeIndex.unison, displayName: "unison",           /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.defaultAutomationRange,  */    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.chip, InstrumentType.harmonics, InstrumentType.pickedString, InstrumentType.customChipWave, InstrumentType.pwm, InstrumentType.noise, InstrumentType.spectrum] },
        { name: "operatorFrequency", computeIndex: EnvelopeComputeIndex.operatorFrequency0, displayName: "fm# freq",         /*perNote:  true,*/ interleave: true, isFilter: false, /*range: Config.defaultAutomationRange,  */    maxCount: Config.operatorCount+2, effect: null, compatibleInstruments: [InstrumentType.fm, InstrumentType.fm6op] },
        { name: "operatorAmplitude", computeIndex: EnvelopeComputeIndex.operatorAmplitude0, displayName: "fm# volume",       /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.operatorAmplitudeMax + 1,*/    maxCount: Config.operatorCount+2, effect: null, compatibleInstruments: [InstrumentType.fm, InstrumentType.fm6op] },
        { name: "feedbackAmplitude", computeIndex: EnvelopeComputeIndex.feedbackAmplitude, displayName: "fm feedback",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.operatorAmplitudeMax + 1,*/    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.fm, InstrumentType.fm6op] },
        { name: "pitchShift", computeIndex: EnvelopeComputeIndex.pitchShift, displayName: "pitch shift",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.pitchShiftRange,         */    maxCount: 1, effect: EffectType.pitchShift, compatibleInstruments: null },
        { name: "detune", computeIndex: EnvelopeComputeIndex.detune, displayName: "detune",           /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.detuneMax + 1,           */    maxCount: 1, effect: EffectType.detune, compatibleInstruments: null },
        { name: "vibratoDepth", computeIndex: EnvelopeComputeIndex.vibratoDepth, displayName: "vibrato range",    /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.defaultAutomationRange,  */    maxCount: 1, effect: EffectType.vibrato, compatibleInstruments: null },
        { name: "noteFilterAllFreqs", computeIndex: EnvelopeComputeIndex.noteFilterAllFreqs, displayName: "n. filter freqs",  /*perNote:  true,*/ interleave: false, isFilter: true, /*range: null,                           */    maxCount: 1, effect: EffectType.noteFilter, compatibleInstruments: null },
        { name: "noteFilterFreq", computeIndex: EnvelopeComputeIndex.noteFilterFreq0, displayName: "n. filter # freq", /*perNote:  true,*/ interleave: false/*true*/, isFilter: true, /*range: Config.filterFreqRange,     */        maxCount: Config.filterMaxPoints, effect: EffectType.noteFilter, compatibleInstruments: null },
        { name: "decimalOffset", computeIndex: EnvelopeComputeIndex.decimalOffset, displayName: "decimal offset",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.pulseWidthRange,         */    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.pwm, InstrumentType.supersaw] },
        { name: "supersawDynamism",       computeIndex:       EnvelopeComputeIndex.supersawDynamism,       displayName: "dynamism",         /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.supersawDynamismMax + 1, */    maxCount: 1,    effect: null,                    compatibleInstruments: [InstrumentType.supersaw]},
		{ name: "supersawSpread",         computeIndex:       EnvelopeComputeIndex.supersawSpread,         displayName: "spread",           /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.supersawSpreadMax + 1,   */    maxCount: 1,    effect: null,                    compatibleInstruments: [InstrumentType.supersaw]},
		{ name: "supersawShape",          computeIndex:       EnvelopeComputeIndex.supersawShape,          displayName: "saw↔pulse",        /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.supersawShapeMax + 1,    */    maxCount: 1,    effect: null,                    compatibleInstruments: [InstrumentType.supersaw]},    
        // Controlling filter gain is less obvious and intuitive than controlling filter freq, so to avoid confusion I've disabled it for now...
        //{name: "noteFilterGain",         computeIndex:       EnvelopeComputeIndex.noteFilterGain0,        displayName: "n. filter # vol",  /*perNote:  true,*/ interleave: false, isFilter:  true, range: Config.filterGainRange,             maxCount: Config.filterMaxPoints, effect: EffectType.noteFilter, compatibleInstruments: null},
        /*
        {name: "distortion",             computeIndex: InstrumentAutomationIndex.distortion,             displayName: "distortion",       perNote: false, interleave: false, isFilter: false, range: Config.distortionRange,             maxCount: 1,    effect: EffectType.distortion,   compatibleInstruments: null},
        {name: "bitcrusherQuantization", computeIndex: InstrumentAutomationIndex.bitcrusherQuantization, displayName: "bit crush",        perNote: false, interleave: false, isFilter: false, range: Config.bitcrusherQuantizationRange, maxCount: 1,    effect: EffectType.bitcrusher,   compatibleInstruments: null},
        {name: "bitcrusherFrequency",    computeIndex: InstrumentAutomationIndex.bitcrusherFrequency,    displayName: "freq crush",       perNote: false, interleave: false, isFilter: false, range: Config.bitcrusherFreqRange,         maxCount: 1,    effect: EffectType.bitcrusher,   compatibleInstruments: null},
        {name: "eqFilterAllFreqs",       computeIndex: InstrumentAutomationIndex.eqFilterAllFreqs,       displayName: "eq filter freqs",  perNote: false, interleave: false, isFilter:  true, range: null,                               maxCount: 1,    effect: null,                    compatibleInstruments: null},
        {name: "eqFilterFreq",           computeIndex: InstrumentAutomationIndex.eqFilterFreq0,          displayName: "eq filter # freq", perNote: false, interleave:  true, isFilter:  true, range: Config.filterFreqRange,             maxCount: Config.filterMaxPoints, effect: null,  compatibleInstruments: null},
        {name: "eqFilterGain",           computeIndex: InstrumentAutomationIndex.eqFilterGain0,          displayName: "eq filter # vol",  perNote: false, interleave: false, isFilter:  true, range: Config.filterGainRange,             maxCount: Config.filterMaxPoints, effect: null,  compatibleInstruments: null},
        {name: "panning",                computeIndex: InstrumentAutomationIndex.panning,                displayName: "panning",          perNote: false, interleave: false, isFilter: false, range: Config.panMax + 1,                  maxCount: 1,    effect: EffectType.panning,      compatibleInstruments: null},
        {name: "chorus",                 computeIndex: InstrumentAutomationIndex.chorus,                 displayName: "chorus",           perNote: false, interleave: false, isFilter: false, range: Config.chorusRange,                 maxCount: 1,    effect: EffectType.chorus,       compatibleInstruments: null},
        {name: "echoSustain",            computeIndex: InstrumentAutomationIndex.echoSustain,            displayName: "echo",             perNote: false, interleave: false, isFilter: false, range: Config.echoSustainRange,            maxCount: 1,    effect: EffectType.echo,         compatibleInstruments: null},
        {name: "echoDelay",              computeIndex: InstrumentAutomationIndex.echoDelay,              displayName: "echo delay",       perNote: false, interleave: false, isFilter: false, range: Config.echoDelayRange,              maxCount: 1,    effect: EffectType.echo,         compatibleInstruments: null}, // wait until after we're computing a tick's settings for multiple run lengths.
        {name: "reverb",                 computeIndex: InstrumentAutomationIndex.reverb,                 displayName: "reverb",           perNote: false, interleave: false, isFilter: false, range: Config.reverbRange,                 maxCount: 1,    effect: EffectType.reverb,       compatibleInstruments: null},
        {name: "mixVolume",              computeIndex: InstrumentAutomationIndex.mixVolume,              displayName: "mix volume",       perNote: false, interleave: false, isFilter: false, range: Config.volumeRange,                 maxCount: 1,    effect: null,                    compatibleInstruments: null},
        {name: "envelope#",              computeIndex: null,                                             displayName: "envelope",         perNote: false, interleave: false, isFilter: false, range: Config.defaultAutomationRange,      maxCount: Config.maxEnvelopeCount, effect: null, compatibleInstruments: null}, // maxCount special case for envelopes to be allowed to target earlier ones.
        */
    ]);
    public static readonly operatorWaves: DictionaryArray<OperatorWave> = toNameMap([
		{ name: "sine", samples: Config.sineWave },
		{ name: "triangle", samples: generateTriWave() },
		{ name: "pulse width", samples: generateSquareWave() },
		{ name: "sawtooth", samples: generateSawWave() },
		{ name: "ramp", samples: generateSawWave(true) },
		{ name: "trapezoid", samples: generateTrapezoidWave(2) },
	    { name: "quasi-sine", samples: generateQuasiSineWave() },
		//{ name: "white noise", samples: generateWhiteNoiseFmWave() },
		//{ name: "1-bit white noise", samples: generateOneBitWhiteNoiseFmWave() },
    ]);
    public static readonly pwmOperatorWaves: DictionaryArray<OperatorWave> = toNameMap([
        { name: "1%", samples: generateSquareWave(0.01) },
        { name: "5%", samples: generateSquareWave(0.05) },
        { name: "12.5%", samples: generateSquareWave(0.125) },
        { name: "25%", samples: generateSquareWave(0.25) },
        { name: "33%", samples: generateSquareWave(1 / 3) },
        { name: "50%", samples: generateSquareWave(0.5) },
        { name: "66%", samples: generateSquareWave(2 / 3) },
        { name: "75%", samples: generateSquareWave(0.75) },
        { name: "87.5%", samples: generateSquareWave(0.875) },
        { name: "95%", samples: generateSquareWave(0.95) },
        { name: "99%", samples: generateSquareWave(0.99) },
    ]);


    // Height of the small editor column for inserting/deleting rows, in pixels.
    public static readonly barEditorHeight: number = 10;

    // Careful about changing index ordering for this. Index is stored in URL/JSON etc.
    public static readonly modulators: DictionaryArray<Modulator> = toNameMap([
        { name: "none", pianoName: "None", maxRawVol: 6, newNoteVol: 6, forSong: true, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "No Mod Setting", promptDesc: [ "No setting has been chosen yet, so this modulator will have no effect. Try choosing a setting with the dropdown, then click this '?' again for more info.", "[$LO - $HI]" ] },
        { name: "song volume", pianoName: "Volume", maxRawVol: 100, newNoteVol: 100, forSong: true, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Song Volume", promptDesc: [ "This setting affects the overall volume of the song, just like the main volume slider.", "At $HI, the volume will be unchanged from default, and it will get gradually quieter down to $LO.", "[MULTIPLICATIVE] [$LO - $HI] [%]" ] },
        { name: "tempo", pianoName: "Tempo", maxRawVol: Config.tempoMax - Config.tempoMin, newNoteVol: Math.ceil((Config.tempoMax - Config.tempoMin) / 2), forSong: true, convertRealFactor: Config.tempoMin, associatedEffect: EffectType.length,
            promptName: "Song Tempo", promptDesc: [ "This setting controls the speed your song plays at, just like the tempo slider.", "When you first make a note for this setting, it will default to your current tempo. Raising it speeds up the song, up to $HI BPM, and lowering it slows it down, to a minimum of $LO BPM.", "Note that you can make a 'swing' effect by rapidly changing between two tempo values.", "[OVERWRITING] [$LO - $HI] [BPM]" ] },
        { name: "song reverb", pianoName: "Reverb", maxRawVol: Config.reverbRange * 2, newNoteVol: Config.reverbRange, forSong: true, convertRealFactor: -Config.reverbRange, associatedEffect: EffectType.length,
            promptName: "Song Reverb", promptDesc: [ "This setting affects the overall reverb of your song. It works by multiplying existing reverb for instruments, so those with no reverb set will be unaffected.", "At $MID, all instruments' reverb will be unchanged from default. This increases up to double the reverb value at $HI, or down to no reverb at $LO.", "[MULTIPLICATIVE] [$LO - $HI]" ] },
        { name: "next bar", pianoName: "Next Bar", maxRawVol: 1, newNoteVol: 1, forSong: true, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Go To Next Bar", promptDesc: [ "This setting functions a little different from most. Wherever a note is placed, the song will jump immediately to the next bar when it is encountered.", "This jump happens at the very start of the note, so the length of a next-bar note is irrelevant. Also, the note can be value 0 or 1, but the value is also irrelevant - wherever you place a note, the song will jump.", "You can make mixed-meter songs or intro sections by cutting off unneeded beats with a next-bar modulator.", "[$LO - $HI]" ] },
        { name: "note volume", pianoName: "Note Vol.", maxRawVol: Config.volumeRange, newNoteVol: Math.ceil(Config.volumeRange / 2), forSong: false, convertRealFactor: Math.ceil(-Config.volumeRange / 2.0), associatedEffect: EffectType.length,
            promptName: "Note Volume", promptDesc: [ "This setting affects the volume of your instrument as if its note size had been scaled.", "At $MID, an instrument's volume will be unchanged from default. This means you can still use the volume sliders to mix the base volume of instruments. The volume gradually increases up to $HI, or decreases down to mute at $LO.", "This setting was the default for volume modulation in JummBox for a long time. Due to some new effects like distortion and bitcrush, note volume doesn't always allow fine volume control. Also, this modulator affects the value of FM modulator waves instead of just carriers. This can distort the sound which may be useful, but also may be undesirable. In those cases, use the 'mix volume' modulator instead, which will always just scale the volume with no added effects.", "For display purposes, this mod will show up on the instrument volume slider, as long as there is not also an active 'mix volume' modulator anyhow. However, as mentioned, it works more like changing note volume.", "[MULTIPLICATIVE] [$LO - $HI]" ] },
        { name: "pan", pianoName: "Pan", maxRawVol: Config.panMax, newNoteVol: Math.ceil(Config.panMax / 2), forSong: false, convertRealFactor: 0, associatedEffect: EffectType.panning,
            promptName: "Instrument Panning", promptDesc: [ "This setting controls the panning of your instrument, just like the panning slider.", "At $LO, your instrument will sound like it is coming fully from the left-ear side. At $MID it will be right in the middle, and at $HI, it will sound like it's on the right.", "[OVERWRITING] [$LO - $HI] [L-R]" ] },
        { name: "reverb", pianoName: "Reverb", maxRawVol: Config.reverbRange, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.reverb,
            promptName: "Instrument Reverb", promptDesc: [ "This setting controls the reverb of your insturment, just like the reverb slider.", "At $LO, your instrument will have no reverb. At $HI, it will be at maximum.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "distortion", pianoName: "Distortion", maxRawVol: Config.distortionRange-1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.distortion,
            promptName: "Instrument Distortion", promptDesc: [ "This setting controls the amount of distortion for your instrument, just like the distortion slider.", "At $LO, your instrument will have no distortion. At $HI, it will be at maximum.", "[OVERWRITING] [$LO - $HI]" ] },
        { name: "fm slider 1", pianoName: "FM 1", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 1", promptDesc: [ "This setting affects the strength of the first FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "fm slider 2", pianoName: "FM 2", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 2", promptDesc: ["This setting affects the strength of the second FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]" ] },
        { name: "fm slider 3", pianoName: "FM 3", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 3", promptDesc: ["This setting affects the strength of the third FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]" ] },
        { name: "fm slider 4", pianoName: "FM 4", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 4", promptDesc: ["This setting affects the strength of the fourth FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "fm feedback", pianoName: "FM Feedback", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Feedback", promptDesc: ["This setting affects the strength of the FM feedback slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "pulse width", pianoName: "Pulse Width", maxRawVol: Config.pulseWidthRange, newNoteVol: Config.pulseWidthRange, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Pulse Width", promptDesc: ["This setting controls the width of this instrument's pulse wave, just like the pulse width slider.", "At $HI, your instrument will sound like a pure square wave (on 50% of the time). It will gradually sound narrower down to $LO, where it will be inaudible (as it is on 0% of the time).", "Changing pulse width randomly between a few values is a common strategy in chiptune music to lend some personality to a lead instrument.", "[OVERWRITING] [$LO - $HI] [%Duty]"] },
        { name: "detune", pianoName: "Detune", maxRawVol: Config.detuneMax - Config.detuneMin, newNoteVol: Config.detuneCenter, forSong: false, convertRealFactor: -Config.detuneCenter, associatedEffect: EffectType.detune,
            promptName: "Instrument Detune", promptDesc: ["This setting controls the detune for this instrument, just like the detune slider.", "At $MID, your instrument will have no detune applied. Each tick corresponds to one cent, or one-hundredth of a pitch. Thus, each change of 100 ticks corresponds to one half-step of detune, up to two half-steps up at $HI, or two half-steps down at $LO.", "[OVERWRITING] [$LO - $HI] [cents]"] },
        { name: "vibrato depth", pianoName: "Vibrato Depth", maxRawVol: 50, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.vibrato,
            promptName: "Vibrato Depth", promptDesc: ["This setting controls the amount that your pitch moves up and down by during vibrato, just like the vibrato depth slider.", "At $LO, your instrument will have no vibrato depth so its vibrato would be inaudible. This increases up to $HI, where an extreme pitch change will be noticeable.", "[OVERWRITING] [$LO - $HI] [pitch ÷25]"] },
        { name: "song detune", pianoName: "Detune", maxRawVol: Config.songDetuneMax - Config.songDetuneMin, newNoteVol: Math.ceil((Config.songDetuneMax - Config.songDetuneMin) / 2), forSong: true, convertRealFactor: -250, associatedEffect: EffectType.length,
            promptName: "Song Detune", promptDesc: ["This setting controls the overall detune of the entire song. There is no associated slider.", "At $MID, your song will have no extra detune applied and sound unchanged from default. Each tick corresponds to four cents, or four hundredths of a pitch. Thus, each change of 25 ticks corresponds to one half-step of detune, up to 10 half-steps up at $HI, or 10 half-steps down at $LO.", "[MULTIPLICATIVE] [$LO - $HI] [cents x4]"] },
        { name: "vibrato speed", pianoName: "Vibrato Speed", maxRawVol: 30, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.vibrato,
            promptName: "Vibrato Speed", promptDesc: ["This setting controls the speed your instrument will vibrato at, just like the slider.", "A setting of $LO means there will be no oscillation, and vibrato will be disabled. Higher settings will increase the speed, up to a dramatic trill at the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "vibrato delay", pianoName: "Vibrato Delay", maxRawVol: 50, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.vibrato,
            promptName: "Vibrato Delay", promptDesc: ["This setting controls the amount of time vibrato will be held off for before triggering for every new note, just like the slider.", "A setting of $LO means there will be no delay. A setting of 24 corresponds to one full beat of delay. As a sole exception to this scale, setting delay to $HI will completely disable vibrato (as if it had infinite delay).", "[OVERWRITING] [$LO - $HI] [beats ÷24]"] },
        { name: "arp speed", pianoName: "Arp Speed", maxRawVol: 50, newNoteVol: 12, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.chord,
            promptName: "Arpeggio Speed", promptDesc: ["This setting controls the speed at which your instrument's chords arpeggiate, just like the arpeggio speed slider.", "Each setting corresponds to a different speed, from the slowest to the fastest. The speeds are listed below.",
                "[0-4]: x0, x1/16, x⅛, x⅕, x¼,", "[5-9]: x⅓, x⅖, x½, x⅔, x¾,", "[10-14]: x⅘, x0.9, x1, x1.1, x1.2,", "[15-19]: x1.3, x1.4, x1.5, x1.6, x1.7,", "[20-24]: x1.8, x1.9, x2, x2.1, x2.2,", "[25-29]: x2.3, x2.4, x2.5, x2.6, x2.7,", "[30-34]: x2.8, x2.9, x3, x3.1, x3.2,", "[35-39]: x3.3, x3.4, x3.5, x3.6, x3.7," ,"[40-44]: x3.8, x3.9, x4, x4.15, x4.3,", "[45-50]: x4.5, x4.8, x5, x5.5, x6, x8", "[OVERWRITING] [$LO - $HI]"] },
        { name: "pan delay", pianoName: "Pan Delay", maxRawVol: 20, newNoteVol: 10, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.panning,
            promptName: "Panning Delay", promptDesc: ["This setting controls the delay applied to panning for your instrument, just like the pan delay slider.", "With more delay, the panning effect will generally be more pronounced. $MID is the default value, whereas $LO will remove any delay at all. No delay can be desirable for chiptune songs.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "reset arp", pianoName: "Reset Arp", maxRawVol: 1, newNoteVol: 1, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.chord,
            promptName: "Reset Arpeggio", promptDesc: ["This setting functions a little different from most. Wherever a note is placed, the arpeggio of this instrument will reset at the very start of that note. This is most noticeable with lower arpeggio speeds. The lengths and values of notes for this setting don't matter, just the note start times.", "This mod can be used to sync up your apreggios so that they always sound the same, even if you are using an odd-ratio arpeggio speed or modulating arpeggio speed.", "[$LO - $HI]"] },
        { name: "eq filter", pianoName: "EQFlt", maxRawVol: 10, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "EQ Filter", promptDesc: ["This setting controls a few separate things for your instrument's EQ filter.", "When the option 'morph' is selected, your modulator values will indicate a sub-filter index of your EQ filter to 'morph' to over time. For example, a change from 0 to 1 means your main filter (default) will morph to sub-filter 1 over the specified duration. You can shape the main filter and sub-filters in the large filter editor ('+' button). If your two filters' number, type, and order of filter dots all match up, the morph will happen smoothly and you'll be able to hear them changing. If they do not match up, the filters will simply jump between each other.", "Note that filters will morph based on endpoints in the pattern editor. So, if you specify a morph from sub-filter 1 to 4 but do not specifically drag in new endpoints for 2 and 3, it will morph directly between 1 and 4 without going through the others.", "If you target Dot X or Dot Y, you can finely tune the coordinates of a single dot for your filter. The number of available dots to choose is dependent on your main filter's dot count.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "note filter", pianoName: "N.Flt", maxRawVol: 10, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.noteFilter,
            promptName: "Note Filter", promptDesc: ["This setting controls a few separate things for your instrument's note filter.", "When the option 'morph' is selected, your modulator values will indicate a sub-filter index of your note filter to 'morph' to over time. For example, a change from 0 to 1 means your main filter (default) will morph to sub-filter 1 over the specified duration. You can shape the main filter and sub-filters in the large filter editor ('+' button). If your two filters' number, type, and order of filter dots all match up, the morph will happen smoothly and you'll be able to hear them changing. If they do not match up, the filters will simply jump between each other.", "Note that filters will morph based on endpoints in the pattern editor. So, if you specify a morph from sub-filter 1 to 4 but do not specifically drag in new endpoints for 2 and 3, it will morph directly between 1 and 4 without going through the others.", "If you target Dot X or Dot Y, you can finely tune the coordinates of a single dot for your filter. The number of available dots to choose is dependent on your main filter's dot count.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "bit crush", pianoName: "Bitcrush", maxRawVol: Config.bitcrusherQuantizationRange-1, newNoteVol: Math.round(Config.bitcrusherQuantizationRange / 2), forSong: false, convertRealFactor: 0, associatedEffect: EffectType.bitcrusher,
            promptName: "Instrument Bit Crush", promptDesc: ["This setting controls the bit crush of your instrument, just like the bit crush slider.", "At a value of $LO, no bit crush will be applied. This increases and the bit crush effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "freq crush", pianoName: "Freq Crush", maxRawVol: Config.bitcrusherFreqRange-1, newNoteVol: Math.round(Config.bitcrusherFreqRange / 2), forSong: false, convertRealFactor: 0, associatedEffect: EffectType.bitcrusher,
            promptName: "Instrument Frequency Crush", promptDesc: ["This setting controls the frequency crush of your instrument, just like the freq crush slider.", "At a value of $LO, no frequency crush will be applied. This increases and the frequency crush effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "echo", pianoName: "Echo", maxRawVol: Config.echoSustainRange-1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.echo,
            promptName: "Instrument Echo Sustain", promptDesc: ["This setting controls the echo sustain (echo loudness) of your instrument, just like the echo slider.", "At $LO, your instrument will have no echo sustain and echo will not be audible. Echo sustain increases and the echo effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "echo delay", pianoName: "Echo Delay", maxRawVol: Config.echoDelayRange, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Instrument Echo Delay", promptDesc: ["This setting controls the echo delay of your instrument, just like the echo delay slider.", "At $LO, your instrument will have very little echo delay, and this increases up to 2 beats of delay at $HI.", "[OVERWRITING] [$LO - $HI] [~beats ÷12]" ]
        }, // Disabled via associatedEffect and manually in list build in SongEditor, enable and set back to echo after fixing bugginess!
        { name: "chorus", pianoName: "Chorus", maxRawVol: Config.chorusRange - 1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.chorus,
            promptName: "Instrument Chorus", promptDesc: ["This setting controls the chorus strength of your instrument, just like the chorus slider.", "At $LO, the chorus effect will be disabled. The strength of the chorus effect increases up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "eq filt cut", pianoName: "EQFlt Cut", maxRawVol: Config.filterSimpleCutRange - 1, newNoteVol: Config.filterSimpleCutRange - 1, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "EQ Filter Cutoff Frequency", promptDesc: ["This setting controls the filter cut position of your instrument, just like the filter cut slider.", "This setting is roughly analagous to the horizontal position of a single low-pass dot on the advanced filter editor. At lower values, a wider range of frequencies is cut off.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "eq filt peak", pianoName: "EQFlt Peak", maxRawVol: Config.filterSimplePeakRange - 1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "EQ Filter Peak Gain", promptDesc: ["This setting controls the filter peak position of your instrument, just like the filter peak slider.", "This setting is roughly analagous to the vertical position of a single low-pass dot on the advanced filter editor. At lower values, the cutoff frequency will not be emphasized, and at higher values you will hear emphasis on the cutoff frequency.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "note filt cut", pianoName: "N.Flt Cut", maxRawVol: Config.filterSimpleCutRange - 1, newNoteVol: Config.filterSimpleCutRange - 1, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.noteFilter,
            promptName: "Note Filter Cutoff Frequency", promptDesc: ["This setting controls the filter cut position of your instrument, just like the filter cut slider.", "This setting is roughly analagous to the horizontal position of a single low-pass dot on the advanced filter editor. At lower values, a wider range of frequencies is cut off.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "note filt peak", pianoName: "N.Flt Peak", maxRawVol: Config.filterSimplePeakRange - 1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.noteFilter,
            promptName: "Note Filter Peak Gain", promptDesc: ["This setting controls the filter peak position of your instrument, just like the filter peak slider.", "This setting is roughly analagous to the vertical position of a single low-pass dot on the advanced filter editor. At lower values, the cutoff frequency will not be emphasized, and at higher values you will hear emphasis on the cutoff frequency.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "pitch shift", pianoName: "Pitch Shift", maxRawVol: Config.pitchShiftRange - 1, newNoteVol: Config.pitchShiftCenter, forSong: false, convertRealFactor: -Config.pitchShiftCenter, associatedEffect: EffectType.pitchShift,
            promptName: "Pitch Shift", promptDesc: ["This setting controls the pitch offset of your instrument, just like the pitch shift slider.", "At $MID your instrument will have no pitch shift. This increases as you decrease toward $LO pitches (half-steps) at the low end, or increases towards +$HI pitches at the high end.", "[OVERWRITING] [$LO - $HI] [pitch]"] },
        { name: "sustain", pianoName: "Sustain", maxRawVol: Config.stringSustainRange - 1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Picked String Sustain", promptDesc: ["This setting controls the sustain of your picked string instrument, just like the sustain slider.", "At $LO, your instrument will have minimum sustain and sound 'plucky'. This increases to a more held sound as your modulator approaches the maximum, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "mix volume", pianoName: "Mix Vol.", maxRawVol: Config.volumeRange, newNoteVol: Math.ceil(Config.volumeRange / 2), forSong: false, convertRealFactor: Math.ceil(-Config.volumeRange / 2.0), associatedEffect: EffectType.length,
            promptName: "Mix Volume", promptDesc: ["This setting affects the volume of your instrument as if its volume slider had been moved.", "At $MID, an instrument's volume will be unchanged from default. This means you can still use the volume sliders to mix the base volume of instruments, since this setting and the default value work multiplicatively. The volume gradually increases up to $HI, or decreases down to mute at $LO.", "Unlike the 'note volume' setting, mix volume is very straightforward and simply affects the resultant instrument volume after all effects are applied.", "[MULTIPLICATIVE] [$LO - $HI]"] },
        { name: "fm slider 5", pianoName: "FM 5", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 5", promptDesc: ["This setting affects the strength of the fifth FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "fm slider 6", pianoName: "FM 6", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 6", promptDesc: ["This setting affects the strength of the sixth FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "decimal offset", pianoName: "Decimal Offset", maxRawVol: 99, newNoteVol: 0, forSong: false, convertRealFactor: 0, invertSliderIndicator: true, associatedEffect: EffectType.length,
            promptName: "Decimal Offset", promptDesc: ["This setting controls the decimal offset that is subtracted from the pulse width; use this for creating values like 12.5 or 6.25.", "[$LO - $HI]"] },
        { name: "envelope speed", pianoName: "EnvelopeSpd", maxRawVol: 50, newNoteVol: 12, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Envelope Speed", promptDesc: ["This setting controls how fast all of the envelopes for the instrument play.", "At $LO, your instrument's envelopes will be frozen, and at values near there they will change very slowly. At 12, the envelopes will work as usual, performing at normal speed. This increases up to $HI, where the envelopes will change very quickly. The speeds are given below:",
                "[0-4]: x0, x1/16, x⅛, x⅕, x¼,", "[5-9]: x⅓, x⅖, x½, x⅔, x¾,", "[10-14]: x⅘, x0.9, x1, x1.1, x1.2,", "[15-19]: x1.3, x1.4, x1.5, x1.6, x1.7,", "[20-24]: x1.8, x1.9, x2, x2.1, x2.2,", "[25-29]: x2.3, x2.4, x2.5, x2.6, x2.7,", "[30-34]: x2.8, x2.9, x3, x3.1, x3.2,", "[35-39]: x3.3, x3.4, x3.5, x3.6, x3.7," ,"[40-44]: x3.8, x3.9, x4, x4.15, x4.3,", "[45-50]: x4.5, x4.8, x5, x5.5, x6, x8", "[OVERWRITING] [$LO - $HI]"] },
        { name: "dynamism", pianoName: "Dynamism", maxRawVol: Config.supersawDynamismMax, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Supersaw Dynamism", promptDesc: ["This setting controls the supersaw dynamism of your instrument, just like the dynamism slider.", "At $LO, your instrument will have only a single pulse contributing. Increasing this will raise the contribution of other waves which is similar to a chorus effect. The effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "spread", pianoName: "Spread", maxRawVol: Config.supersawSpreadMax, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Supersaw Spread", promptDesc: ["This setting controls the supersaw spread of your instrument, just like the spread slider.", "At $LO, all the pulses in your supersaw will be at the same frequency. Increasing this value raises the frequency spread of the contributing waves, up to a dissonant spread at the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "saw shape", pianoName: "Saw Shape", maxRawVol: Config.supersawShapeMax, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Supersaw Shape", promptDesc: ["This setting controls the supersaw shape of your instrument, just like the Saw↔Pulse slider.", "As the slider's name implies, this effect will give you a sawtooth wave at $LO, and a full pulse width wave at $HI. Values in between will be a blend of the two.", "[OVERWRITING] [$LO - $HI] [%]"] },
        ]);
}

function centerWave(wave: Array<number>): Float32Array {
    let sum: number = 0.0;
    for (let i: number = 0; i < wave.length; i++) sum += wave[i];
    const average: number = sum / wave.length;
    for (let i: number = 0; i < wave.length; i++) wave[i] -= average;
    performIntegral(wave);
    // The first sample should be zero, and we'll duplicate it at the end for easier interpolation.
    wave.push(0);
    return new Float32Array(wave);
}
function centerAndNormalizeWave(wave: Array<number>): Float32Array {
    let magn: number = 0.0;

    centerWave(wave);

    // Going to length-1 because an extra 0 sample is added on the end as part of centerWave, which shouldn't impact magnitude calculation.
    for (let i: number = 0; i < wave.length - 1; i++) {
        magn += Math.abs(wave[i]);
    }
    const magnAvg: number = magn / (wave.length - 1);

    for (let i: number = 0; i < wave.length - 1; i++) {
        wave[i] = wave[i] / magnAvg;
    }

    return new Float32Array(wave);

}
export function performIntegral(wave: { length: number, [index: number]: number }): Float32Array {
    // Perform the integral on the wave. The synth function will perform the derivative to get the original wave back but with antialiasing.
    let cumulative: number = 0.0;
    let newWave: Float32Array = new Float32Array(wave.length);
    for (let i: number = 0; i < wave.length; i++) {
        newWave[i] = cumulative;
        cumulative += wave[i];
    }

    return newWave;
}
export function performIntegralOld(wave: { length: number, [index: number]: number }): void {
	// Old ver used in harmonics/picked string instruments, manipulates wave in place.
	let cumulative: number = 0.0;
	for (let i: number = 0; i < wave.length; i++) {
		const temp = wave[i];
		wave[i] = cumulative;
		cumulative += temp;
	}
}

export function getPulseWidthRatio(pulseWidth: number): number {
    // BeepBox formula for reference
    //return Math.pow(0.5, (Config.pulseWidthRange - 1 - pulseWidth) * Config.pulseWidthStepPower) * 0.5;

    return pulseWidth / (Config.pulseWidthRange * 2);
}


// The function arguments will be defined in FFT.ts, but I want
// SynthConfig.ts to be at the top of the compiled JS so I won't directly
// depend on FFT here. synth.ts will take care of importing FFT.ts.
//function inverseRealFourierTransform(array: {length: number, [index: number]: number}, fullArrayLength: number): void;
//function scaleElementsByFactor(array: {length: number, [index: number]: number}, factor: number): void;
export function getDrumWave(index: number, inverseRealFourierTransform: Function | null, scaleElementsByFactor: Function | null): Float32Array {
    let wave: Float32Array | null = Config.chipNoises[index].samples;
    if (wave == null) {
        wave = new Float32Array(Config.chipNoiseLength + 1);
        Config.chipNoises[index].samples = wave;

		if (index == 0) {
			// The "retro" drum uses a "Linear Feedback Shift Register" similar to the NES noise channel.
			let drumBuffer: number = 1;
			for (let i: number = 0; i < Config.chipNoiseLength; i++) {
				wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
				let newBuffer: number = drumBuffer >> 1;
				if (((drumBuffer + newBuffer) & 1) == 1) {
					newBuffer += 1 << 14;
				}
				drumBuffer = newBuffer;
			}
		} else if (index == 1) {
			// White noise is just random values for each sample.
			for (let i: number = 0; i < Config.chipNoiseLength; i++) {
				wave[i] = Math.random() * 2.0 - 1.0;
			}
		} else if (index == 2) {
			// The "clang" noise wave is based on a similar noise wave in the modded beepbox made by DAzombieRE.
			let drumBuffer: number = 1;
			for (let i: number = 0; i < Config.chipNoiseLength; i++) {
				wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
				let newBuffer: number = drumBuffer >> 1;
				if (((drumBuffer + newBuffer) & 1) == 1) {
					newBuffer += 2 << 14;
				}
				drumBuffer = newBuffer;
			}
		} else if (index == 3) {
			// The "buzz" noise wave is based on a similar noise wave in the modded beepbox made by DAzombieRE.
			let drumBuffer: number = 1;
			for (let i: number = 0; i < Config.chipNoiseLength; i++) {
				wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
				let newBuffer: number = drumBuffer >> 1;
				if (((drumBuffer + newBuffer) & 1) == 1) {
					newBuffer += 10 << 2;
				}
				drumBuffer = newBuffer;
			}
		} else if (index == 4) {
			// "hollow" drums, designed in frequency space and then converted via FFT:
			drawNoiseSpectrum(wave, Config.chipNoiseLength, 10, 11, 1, 1, 0);
			drawNoiseSpectrum(wave, Config.chipNoiseLength, 11, 14, .6578, .6578, 0);
			inverseRealFourierTransform!(wave, Config.chipNoiseLength);
			scaleElementsByFactor!(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
		} else if (index == 5) {
			// "Shine" drums from modbox!
			var drumBuffer = 1;
			for (var i = 0; i < Config.chipNoiseLength; i++) {
				wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
				var newBuffer = drumBuffer >> 1;
				if (((drumBuffer + newBuffer) & 1) == 1) {
					newBuffer += 10 << 2;
				}
				drumBuffer = newBuffer;
			}
		} else if (index == 6) {
			// "Deep" drums from modbox!
			drawNoiseSpectrum(wave, Config.chipNoiseLength, 1, 10, 1, 1, 0);
			drawNoiseSpectrum(wave, Config.chipNoiseLength, 20, 14, -2, -2, 0);
			inverseRealFourierTransform!(wave, Config.chipNoiseLength);
			scaleElementsByFactor!(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
		} else if (index == 7) {
			// "Cutter" drums from modbox!
			var drumBuffer = 1;
			for (var i = 0; i < Config.chipNoiseLength; i++) {
				wave[i] = (drumBuffer & 1) * 4.0 * (Math.random() * 14 + 1) - 8.0;
				var newBuffer = drumBuffer >> 1;
				if (((drumBuffer + newBuffer) & 1) == 1) {
					newBuffer += 15 << 2;
				}
				drumBuffer = newBuffer;
			}
		} else if (index == 8) {
			// "Metallic" drums from modbox!
			var drumBuffer = 1;
			for (var i = 0; i < Config.chipNoiseLength; i++) {
				wave[i] = (drumBuffer & 1) / 2.0 - 0.5;
				var newBuffer = drumBuffer >> 1;
				if (((drumBuffer + newBuffer) & 1) == 1) {
					newBuffer -= 10 << 2;
				}
				drumBuffer = newBuffer;
            }
        } else if (index == 9) {
            // a noise more like old static than white noise
            let drumBuffer: number = 1;
            for (let i: number = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.1;
                let newBuffer: number = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 8 ^ 2 << 16;
                }
                drumBuffer = newBuffer;
            }
		}
        else if (index == 10) {
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = Math.round(Math.random());
            }
        }
        else if (index == 11) {
            var drumBuffer = 1;
            for (var i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = Math.round((drumBuffer & 1));
                var newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer -= 10 << 2;
                }
                drumBuffer = newBuffer;
            }
        }
        else if (index == 12) {
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                var ultraboxnewchipnoiserand = Math.random();
                wave[i] = Math.pow(ultraboxnewchipnoiserand, Math.clz32(ultraboxnewchipnoiserand));
            }
        }
        else if (index == 13) {
            // https://noisehack.com/generate-noise-web-audio-api/
            var b0 = 0, b1 = 0, b2 = 0, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                var white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                wave[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                wave[i] *= 0.44;
                b6 = white * 0.115926;
            }
        }
        else if (index == 14) {
            var lastOut = 0.0;
            
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                var white = Math.random() * 2 - 1;
                wave[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = wave[i];
                wave[i] *= 14;
            }
        }
		
		else {
			throw new Error("Unrecognized drum index: " + index);
		}

        wave[Config.chipNoiseLength] = wave[0];
    }

    return wave;
}

export function drawNoiseSpectrum(wave: Float32Array, waveLength: number, lowOctave: number, highOctave: number, lowPower: number, highPower: number, overallSlope: number): number {
    const referenceOctave: number = 11;
    const referenceIndex: number = 1 << referenceOctave;
    const lowIndex: number = Math.pow(2, lowOctave) | 0;
    const highIndex: number = Math.min(waveLength >> 1, Math.pow(2, highOctave) | 0);
    const retroWave: Float32Array = getDrumWave(0, null, null);
    let combinedAmplitude: number = 0.0;
    for (let i: number = lowIndex; i < highIndex; i++) {

        let lerped: number = lowPower + (highPower - lowPower) * (Math.log2(i) - lowOctave) / (highOctave - lowOctave);
        let amplitude: number = Math.pow(2, (lerped - 1) * 7 + 1) * lerped;

        amplitude *= Math.pow(i / referenceIndex, overallSlope);

        combinedAmplitude += amplitude;

        // Add two different sources of psuedo-randomness to the noise
        // (individually they aren't random enough) but in a deterministic
        // way so that live spectrum editing doesn't result in audible pops.
        // Multiply all the sine wave amplitudes by 1 or -1 based on the
        // LFSR retro wave (effectively random), and also rotate the phase
        // of each sine wave based on the golden angle to disrupt the symmetry.
        amplitude *= retroWave[i];
        const radians: number = 0.61803398875 * i * i * Math.PI * 2.0;

        wave[i] = Math.cos(radians) * amplitude;
        wave[waveLength - i] = Math.sin(radians) * amplitude;
    }

    return combinedAmplitude;
}

function generateSineWave(): Float32Array {
    const wave: Float32Array = new Float32Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength);
    }
    return wave;
}

function generateTriWave(): Float32Array {
    const wave: Float32Array = new Float32Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.asin(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength)) / (Math.PI / 2);
    }
    return wave;
}

function generateTrapezoidWave(drive: number = 2): Float32Array {
    const wave: Float32Array = new Float32Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.max(-1.0, Math.min(1.0, Math.asin(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength)) * drive));
    }
    return wave;
}

function generateSquareWave(phaseWidth: number = 0): Float32Array {
    const wave: Float32Array = new Float32Array(Config.sineWaveLength + 1);
    const centerPoint: number = Config.sineWaveLength / 4;
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = +((Math.abs(i - centerPoint) < phaseWidth * Config.sineWaveLength / 2)
            || ((Math.abs(i - Config.sineWaveLength - centerPoint) < phaseWidth * Config.sineWaveLength / 2))) * 2 - 1;
    }
    return wave;
}

function generateSawWave(inverse: boolean = false): Float32Array {
    const wave: Float32Array = new Float32Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = ((i + (Config.sineWaveLength / 4.0)) * 2.0 / Config.sineWaveLength) % 2 - 1;
        wave[i] = inverse ? -wave[i] : wave[i];
    }
    return wave;
}

	// function generateWhiteNoiseFmWave() {
        // const wave = new Float32Array(Config.sineWaveLength + 1);
        // for (let i = 0; i < Config.sineWaveLength + 1; i++) {
            // wave[i] = Math.random() * 2.0 - 1.0;
        // }
        // return wave;
    // }
	// function generateOneBitWhiteNoiseFmWave() {
        // const wave = new Float32Array(Config.sineWaveLength + 1);
        // for (let i = 0; i < Config.sineWaveLength + 1; i++) {
            // wave[i] = Math.round(Math.random());
        // }
        // return wave;
    // }
	function generateQuasiSineWave() {
        const wave = new Float32Array(Config.sineWaveLength + 1);
        for (let i = 0; i < Config.sineWaveLength + 1; i++) {
            wave[i] = Math.round(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength));
        }
        return wave;
	}

export function getArpeggioPitchIndex(pitchCount: number, useFastTwoNoteArp: boolean, arpeggio: number): number {
    let arpeggioPattern: ReadonlyArray<number> = Config.arpeggioPatterns[pitchCount - 1];
    if (arpeggioPattern != null) {
        if (pitchCount == 2 && useFastTwoNoteArp == false) {
            arpeggioPattern = [0, 0, 1, 1];
        }
        return arpeggioPattern[arpeggio % arpeggioPattern.length];
    } else {
        return arpeggio % pitchCount;
    }
}

// Pardon the messy type casting. This allows accessing array members by numerical index or string name.
export function toNameMap<T extends BeepBoxOption>(array: Array<Pick<T, Exclude<keyof T, "index">>>): DictionaryArray<T> {
    const dictionary: Dictionary<T> = {};
    for (let i: number = 0; i < array.length; i++) {
        const value: any = array[i];
        value.index = i;
        dictionary[value.name] = <T>value;
    }
    const result: DictionaryArray<T> = <DictionaryArray<T>><any>array;
    result.dictionary = dictionary;
    return result;
}

export function effectsIncludeTransition(effects: number): boolean {
    return (effects & (1 << EffectType.transition)) != 0;
}
export function effectsIncludeChord(effects: number): boolean {
    return (effects & (1 << EffectType.chord)) != 0;
}
export function effectsIncludePitchShift(effects: number): boolean {
    return (effects & (1 << EffectType.pitchShift)) != 0;
}
export function effectsIncludeDetune(effects: number): boolean {
    return (effects & (1 << EffectType.detune)) != 0;
}
export function effectsIncludeVibrato(effects: number): boolean {
    return (effects & (1 << EffectType.vibrato)) != 0;
}
export function effectsIncludeNoteFilter(effects: number): boolean {
    return (effects & (1 << EffectType.noteFilter)) != 0;
}
export function effectsIncludeDistortion(effects: number): boolean {
    return (effects & (1 << EffectType.distortion)) != 0;
}
export function effectsIncludeBitcrusher(effects: number): boolean {
    return (effects & (1 << EffectType.bitcrusher)) != 0;
}
export function effectsIncludePanning(effects: number): boolean {
    return (effects & (1 << EffectType.panning)) != 0;
}
export function effectsIncludeChorus(effects: number): boolean {
    return (effects & (1 << EffectType.chorus)) != 0;
}
export function effectsIncludeEcho(effects: number): boolean {
    return (effects & (1 << EffectType.echo)) != 0;
}
export function effectsIncludeReverb(effects: number): boolean {
    return (effects & (1 << EffectType.reverb)) != 0;
}
export function rawChipToIntegrated(raw: DictionaryArray<ChipWave>): DictionaryArray<ChipWave> {
    const newArray: Array<ChipWave> = new Array<ChipWave>(raw.length);
    const dictionary: Dictionary<ChipWave> = {};
    for (let i: number = 0; i < newArray.length; i++) {
        newArray[i] = Object.assign([], raw[i]);
        const value: any = newArray[i];
        value.index = i;
        dictionary[value.name] = <ChipWave>value;
    }
    for (let key in dictionary) {
        dictionary[key].samples = performIntegral(dictionary[key].samples);
    }
    const result: DictionaryArray<ChipWave> = <DictionaryArray<ChipWave>><any>newArray;
    result.dictionary = dictionary;
    return result;
}
