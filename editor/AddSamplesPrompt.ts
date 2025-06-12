import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { Dictionary, Config } from "../synth/SynthConfig";
import { clamp, parseFloatWithDefault, parseIntWithDefault } from "../synth/synth";
import { ColorConfig } from "./ColorConfig";
import { EditorConfig } from "./EditorConfig";
import { SongDocument } from "./SongDocument";

const { div, input, button, a, code, textarea, details, summary, span, ul, li, select, option, h2, p } = HTML;

interface SampleEntry {
    url: string;
    sampleRate: number;
    rootKey: number;
    percussion: boolean;
    chipWaveLoopStart: number | null;
    chipWaveLoopEnd: number | null;
    chipWaveStartOffset: number | null;
    chipWaveLoopMode: number | null;
    chipWavePlayBackwards: boolean;
}

interface ParsedEntries {
    entries: SampleEntry[];
}

// @TODO:
// - Check for duplicate sample URLs and names.
// - Maybe the Backwards checkbox should be a select as well? Right now though,
//   assuming that false is the same as if it wasn't actually set should work
//   fine.
// - Use constants or an enum for the key-value pairs.

export class AddSamplesPrompt {
    private readonly _maxSamples: number = 64;

    private _doc: SongDocument;
    private readonly _entries: SampleEntry[] = [];
    private readonly _entryOptionsDisplayStates: Dictionary<boolean> = {};
    private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
    private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width: 45%;" }, "Okay");
    private readonly _addSampleButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size);" }, "Add sample");
    private readonly _entryContainer: HTMLDivElement = div();
    private readonly _addMultipleSamplesButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size); margin-left: 0.5em;" }, "Add multiple samples");
    private readonly _addSamplesAreaBottom: HTMLDivElement = div({ style: "margin-top: 0.5em;" },
        this._addSampleButton,
        this._addMultipleSamplesButton
    );
    private readonly _instructionsLink: HTMLAnchorElement = a({ href: "#", style:"color:red;font-weight:bold;"}, "> Click Here for instructions on adding samples <");
    private readonly _description: HTMLDivElement = div(
        div({ style: "margin-bottom: 0.5em; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; cursor: text;" },
            "In order to use the old UltraBox samples, you should add ",
            code("legacySamples"),
            " for the PaandorasBox Samples.",
            p({}),
            "You can also use ",
            code("nintariboxSamples"),
            " and ",
            code("marioPaintboxSamples"),
            " for more built-in sample packs."
        ),
        div({ style: "margin-bottom: 0.5em;" },
            "The order of these samples is important - if you change their order or remove them you'll break your song!"
        ),
        div({ style: "margin-bottom: 0.5em; font-size: 17px;" },
            this._instructionsLink,
        )
    );
    private readonly _closeInstructionsButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size); width: 100%;" }, "Close instructions");
    private readonly _instructionsArea: HTMLDivElement = div(
        { style: "display: none; margin-top: 0; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; cursor: text; overflow-y: auto;" },
        h2("Add Samples"),
        div({ style: "margin-top: 0.5em; margin-bottom: 0.5em;" },
            "In UltraBox, custom samples are loaded from arbitrary URLs.",
        ),
        div({ style: `margin-top: 0.5em; margin-bottom: 0.5em; color: ${ColorConfig.secondaryText};` },
            "(Technically, the web server behind the URL needs to support ",
              a({ href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", target: "_blank", }, "CORS"),
              ", but you don't need to know about that: ",
              " the sample just won't load if that's not the case)",
        ),
        div({ style: "margin-top: 0.5em; margin-bottom: 0.5em;" },
            details(
                summary("Why arbitrary URLs?"),
                a({ href: "https://pandoras-box-archive.neptendo.repl.co/" }, "A certain BeepBox mod"),
                " did this with one central server, but it went down, taking down",
                " the samples with it, though thankfully it got archived.",
                " This is always an issue with servers: it may run out of space,",
                " stop working, and so on. With arbitrary URLs, you can always ",
                " change them to different ones if they stop working."
            ),
            p({}),
            "Simply go and upload your samples to a website we suggest down below, once you do that you can copy that URL and paste it into the text input you can find after pressing the 'Add Sample' button.",
            "You know the sample works once you see the name of the sample appear above the text input! Then just press 'Okay' and your sample will appear! To use samples just change your instrument to a chip wave instrument type and scroll down until you find the samples.",
        ),
        div({ style: "margin-top: 0.5em; margin-bottom: 0.5em;" },
            "As for where to upload your samples, here are some suggestions:",
            ul({ style: "text-align: left;" },
                li(a({ href: "https://filegarden.com" }, "File Garden")),

                // there's no guarantee this will continue to work; dropbox has changed their URL formatting at least once in the past
                li(a({ href: "https://www.dropbox.com" }, "Dropbox"), " (domain needs to be ", code("https://dl.dropboxusercontent.com"), ")"),

                // discord is not a file storage site. files expire after a month if shared outside of discord
                //li(a({ href: "https://discord.com" }, "Discord"), " (domain needs to be ", code("https://media.discordapp.net"), ")")
            )
        ),
        div({ style: "margin-top: 0.5em; margin-bottom: 0.5em;" },
            "Static website hosting services may also work (such as ", a({ href: "https://pages.github.com" }, "GitHub Pages"), ")",
            " but those require a bit more setup."
        ),
        div({ style: "margin-top: 0.5em; margin-bottom: 1em;" },
            "Finally, if have a soundfont you'd like to get samples from, consider using this ",
            a({ href: "./sample_extractor.html", target: "_blank" }, "sample extractor"),
            "."
        ),
        div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between; margin-top: 0.5em;" }, this._closeInstructionsButton)
    );
    private readonly _addSamplesArea: HTMLDivElement = div({ style: "overflow-y: auto;" },
        h2("Add Samples"),
        div({ style: "display: flex; flex-direction: column; align-items: center; margin-bottom: 0.5em;" },
            this._description,
            div({ style: "width: 100%; max-height: 450px; overflow-y: scroll;" }, this._entryContainer),
            this._addSamplesAreaBottom
        ),
        div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton)
    );
    private readonly _bulkAddTextarea: HTMLTextAreaElement = textarea({
        style: "width: 100%; height: 100%; resize: none; box-sizing: border-box;",
    });
    private readonly _bulkAddConfirmButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size); width: 100%;" }, "Add");
    private readonly _bulkAddArea: HTMLDivElement = div(
        { style: "display: none; overflow-y: auto;" },
        h2({ style: "margin-bottom: 0.5em;" }, "Add Multiple Samples"),
        div({ style: "display: flex; flex-direction: column; align-items: center;" },
            div(`Add one URL per line. Remember that you can only have ${this._maxSamples} samples!`),
            div({ style: `color: ${ColorConfig.secondaryText}` }, "(This supports the syntax used to store samples in the song URLs as well)"),
            div({ style: "width: 100%; height: 250px; margin-top: 0.5em; margin-bottom: 0.5em;" }, this._bulkAddTextarea),
        ),
        div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._bulkAddConfirmButton),
    );
    public container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 450px; max-height: calc(100% - 100px);" },
        this._addSamplesArea,
        this._bulkAddArea,
        this._instructionsArea,
        this._cancelButton
    );

    constructor(_doc: SongDocument) {
        this._doc = _doc;
        if (EditorConfig.customSamples != null) {
            // In this case, `EditorConfig.customSamples` should have the URLs
            // with the new syntax, as we only use that when saving, and we
            // also force the new syntax on load, in `Song._parseAndConfigureCustomSample`.
            const parsed = this._parseURLs(EditorConfig.customSamples, false);
            this._entries = parsed.entries;
        }
        this._addSampleButton.addEventListener("click", this._whenAddSampleClicked);
        this._addMultipleSamplesButton.addEventListener("click", this._whenAddMultipleSamplesClicked);
        this._bulkAddConfirmButton.addEventListener("click", this._whenBulkAddConfirmClicked);
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
        this._instructionsLink.addEventListener("click", this._whenInstructionsLinkClicked);
        this._closeInstructionsButton.addEventListener("click", this._whenCloseInstructionsButtonClicked);
        this._reconfigureAddSampleButton();
        this._render(false);
    }

    public cleanUp = (): void => {
        while (this._entryContainer.firstChild !== null) {
            this._entryContainer.removeChild(this._entryContainer.firstChild);
        }
        this._addSampleButton.removeEventListener("click", this._whenAddSampleClicked);
        this._addMultipleSamplesButton.removeEventListener("click", this._whenAddMultipleSamplesClicked);
        this._bulkAddConfirmButton.removeEventListener("click", this._whenBulkAddConfirmClicked);
        this._okayButton.removeEventListener("click", this._saveChanges);
        this._cancelButton.removeEventListener("click", this._close);
        this._instructionsLink.removeEventListener("click", this._whenInstructionsLinkClicked);
        this._closeInstructionsButton.removeEventListener("click", this._whenCloseInstructionsButtonClicked);
    }

    private _close = (): void => {
        this._doc.prompt = null;
        this._doc.undo();
        this._saveChanges();
    }

    private _saveChanges = (): void => {
        const urlData: string = this._generateURLData();
        EditorConfig.customSamples = urlData.split("|").filter(x => x !== "");
        Config.willReloadForCustomSamples = true;
        window.location.hash = this._doc.song.toBase64String();
        // The prompt seems to get stuck if reloading is done too quickly.
        setTimeout(() => { location.reload(); }, 50);
    }

    private _whenAddSampleClicked = (event: Event): void => {
        const entryIndex: number = this._entries.length;
        this._entries.push({
            url: "",
            sampleRate: 44100,
            rootKey: 60,
            percussion: false,
            chipWaveLoopStart: null,
            chipWaveLoopEnd: null,
            chipWaveStartOffset: null,
            chipWaveLoopMode: null,
            chipWavePlayBackwards: false,
        });
        this._entryOptionsDisplayStates[entryIndex] = false;
        this._reconfigureAddSampleButton();
        this._render(true);
    }

    private _whenAddMultipleSamplesClicked = (event: Event): void => {
        this._addSamplesArea.style.display = "none";
        this._bulkAddArea.style.display = "";
        this._bulkAddTextarea.value = "";
    }

    private _whenInstructionsLinkClicked = (event: Event): void => {
        event.preventDefault();
        this._addSamplesArea.style.display = "none";
        this._instructionsArea.style.display = "";
    }

    private _whenCloseInstructionsButtonClicked = (event: Event): void => {
        this._addSamplesArea.style.display = "";
        this._instructionsArea.style.display = "none";
    }

    private _whenBulkAddConfirmClicked = (event: Event): void => {
        this._addSamplesArea.style.display = "";
        this._bulkAddArea.style.display = "none";
        // In this case, we shouldn't really bother supporting the old syntax,
        // as people are only really sharing URLs with the new one.
        const parsed: ParsedEntries = this._parseURLs(
            this._bulkAddTextarea.value
                .replace(/\n/g, "|")
                .split("|")
                // .map((x: string) => decodeURIComponent(x.trim()))
                .filter((x: string) => x !== ""),
            false
        );
        const seen: Map<string, boolean> = new Map();
        for (const entry of this._entries) {
            seen.set(entry.url, true);
        }
        for (const entry of parsed.entries) {
            if (this._entries.length >= this._maxSamples) break;
            if (seen.has(entry.url)) continue;
            seen.set(entry.url, true);
            const entryIndex: number = this._entries.length;
            this._entries.push(entry);
            this._entryOptionsDisplayStates[entryIndex] = false;
        }
        this._reconfigureAddSampleButton();
        this._render(false);
    }

    private _whenOptionsAreToggled = (event: Event): void => {
        const element: HTMLDetailsElement = <HTMLDetailsElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        if (element.open) {
            this._entryOptionsDisplayStates[entryIndex] = true;
        } else {
            this._entryOptionsDisplayStates[entryIndex] = false;
        }
    }

    private _whenURLChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        this._entries[entryIndex].url = element.value;
        const sampleNameElement: HTMLDivElement | null | undefined = element.parentNode?.parentNode?.querySelector(".add-sample-prompt-sample-name");
        if (sampleNameElement != null) {
            const sampleName: string = this._getSampleName(this._entries[entryIndex]);
            sampleNameElement.innerText = sampleName;
            sampleNameElement.title = sampleName;
        }
    }

    private _whenSampleRateChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const value: number = clamp(8000, 96000 + 1, parseFloatWithDefault(element.value, 44100));
        this._entries[entryIndex].sampleRate = value;
    }

    private _whenRootKeyChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const value: number = parseFloatWithDefault(element.value, 60);
        this._entries[entryIndex].rootKey = value;
        const rootKeyDisplay: HTMLSpanElement | null | undefined = element.parentNode?.parentNode?.querySelector(".add-sample-prompt-root-key-display");
        if (rootKeyDisplay != null) {
            const noteName: string = this._noteNameFromPitchNumber(this._entries[entryIndex].rootKey);
            if (noteName !== "") {
                rootKeyDisplay.innerText = `(${noteName})`;
            }
        }
    }

    private _whenPercussionChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        this._entries[entryIndex].percussion = element.checked ? true : false;
    }

    private _whenChipWaveLoopStartChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const value: number | null = parseIntWithDefault(element.value, null);
        this._entries[entryIndex].chipWaveLoopStart = value;
    }

    private _whenChipWaveLoopEndChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const value: number | null = parseIntWithDefault(element.value, null);
        this._entries[entryIndex].chipWaveLoopEnd = value;
    }

    private _whenChipWaveStartOffsetChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const value: number | null = parseIntWithDefault(element.value, null);
        this._entries[entryIndex].chipWaveStartOffset = value;
    }

    private _whenChipWaveLoopModeChanges = (event: Event): void => {
        const element: HTMLSelectElement = <HTMLSelectElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const newValue: number = +element.value;
        if (newValue === -1) {
            this._entries[entryIndex].chipWaveLoopMode = null;
        } else {
            this._entries[entryIndex].chipWaveLoopMode = newValue;
        }
    }

    private _whenChipWavePlayBackwardsChanges = (event: Event): void => {
        const element: HTMLInputElement = <HTMLInputElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const newValue: boolean = element.checked;
        this._entries[entryIndex].chipWavePlayBackwards = newValue;
    }

    // @TODO: This is copy pasted from SongEditor, should probably be moved to
    //        somewhere else that can be imported from both places.
    private _copyTextToClipboard(text: string): void {
        // Set as any to allow compilation without clipboard types (since, uh, I didn't write this bit and don't know the proper types library) -jummbus
        let nav: any;
        nav = navigator;

        if (nav.clipboard && nav.clipboard.writeText) {
            nav.clipboard.writeText(text).catch(() => {
                window.prompt("Copy to clipboard:", text);
            });
            return;
        }
        const textField: HTMLTextAreaElement = document.createElement("textarea");
        textField.textContent = text;
        document.body.appendChild(textField);
        textField.select();
        const succeeded: boolean = document.execCommand("copy");
        textField.remove();
        this.container.focus({ preventScroll: true });
        if (!succeeded) window.prompt("Copy this:", text);
    }

    private _whenCopyLinkPresetClicked = (event: Event): void => {
        const element: HTMLButtonElement = <HTMLButtonElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        this._copyTextToClipboard(this._generateURLDataForEntry(this._entries[entryIndex]));
    }

    private _whenRemoveSampleClicked = (event: Event): void => {
        const element: HTMLButtonElement = <HTMLButtonElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        this._entryOptionsDisplayStates[entryIndex] = false;
        this._entries.splice(entryIndex, 1);
        this._reconfigureAddSampleButton();
        this._render(false);
    }

    private _whenMoveSampleUpClicked = (event: Event): void => {
        const element: HTMLButtonElement = <HTMLButtonElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const upEntryIndex: number = entryIndex - 1;
        if (this._entries.length >= 2 && upEntryIndex >= 0) {
            const upEntry: SampleEntry = this._entries[upEntryIndex];
            const entry: SampleEntry = this._entries[entryIndex];
            const upEntryOptionsVisibility: boolean = this._entryOptionsDisplayStates[upEntryIndex];
            const entryOptionsVisibility: boolean = this._entryOptionsDisplayStates[entryIndex];
            this._entries[upEntryIndex] = entry;
            this._entries[entryIndex] = upEntry;
            this._entryOptionsDisplayStates[upEntryIndex] = entryOptionsVisibility;
            this._entryOptionsDisplayStates[entryIndex] = upEntryOptionsVisibility;
            this._render(false);
        }
    }

    private _whenMoveSampleDownClicked = (event: Event): void => {
        const element: HTMLButtonElement = <HTMLButtonElement>event.target;
        const entryIndex: number = +(element.dataset.index!);
        const downEntryIndex: number = entryIndex + 1;
        if (this._entries.length >= 2 && downEntryIndex < this._entries.length) {
            const downEntry: SampleEntry = this._entries[downEntryIndex];
            const entry: SampleEntry = this._entries[entryIndex];
            const downEntryOptionsVisibility: boolean = this._entryOptionsDisplayStates[downEntryIndex];
            const entryOptionsVisibility: boolean = this._entryOptionsDisplayStates[entryIndex];
            this._entries[downEntryIndex] = entry;
            this._entries[entryIndex] = downEntry;
            this._entryOptionsDisplayStates[downEntryIndex] = entryOptionsVisibility;
            this._entryOptionsDisplayStates[entryIndex] = downEntryOptionsVisibility;
            this._render(false);
        }
    }

    private _reconfigureAddSampleButton = (): void => {
        if (this._entries.length >= this._maxSamples) {
            this._addSampleButton.style.display = "none";
        } else {
            this._addSampleButton.style.display = "";
        }
    }

    private _parseURLs = (urls: string[], parseOldSyntax: boolean): ParsedEntries => {
        // @TODO: Duplicated code like this isn't great (in this case coming from Song.fromBase64String).
        function sliceForSampleRate(url: string): [string, number] {
            const newUrl = url.slice(0, url.indexOf(","));
            const sampleRate = clamp(8000, 96000 + 1, parseFloatWithDefault(url.slice(url.indexOf(",") + 1), 44100));
            return [newUrl, sampleRate];
        }
        function sliceForRootKey(url: string): [string, number] {
            const newUrl = url.slice(0, url.indexOf("!"));
            const rootKey = parseFloatWithDefault(url.slice(url.indexOf("!") + 1), 60);
            return [newUrl, rootKey];
        }
        let useLegacySamples: boolean = false;
        let useNintariboxSamples: boolean = false;
        let useMarioPaintboxSamples: boolean = false;
        const parsedEntries: SampleEntry[] = [];
        for (const url of urls) {
            if (url === "") continue;
            if (url.toLowerCase() === "legacysamples") {
                if (!useLegacySamples) {
                    parsedEntries.push({
                        url: "legacySamples",
                        sampleRate: 44100,
                        rootKey: 60,
                        percussion: false,
                        chipWaveLoopStart: null,
                        chipWaveLoopEnd: null,
                        chipWaveStartOffset: null,
                        chipWaveLoopMode: null,
                        chipWavePlayBackwards: false,
                    });
                }
                useLegacySamples = true;
            } else if (url.toLowerCase() === "nintariboxsamples") {
                if (!useNintariboxSamples) {
                    parsedEntries.push({
                        url: "nintariboxSamples",
                        sampleRate: 44100,
                        rootKey: 60,
                        percussion: false,
                        chipWaveLoopStart: null,
                        chipWaveLoopEnd: null,
                        chipWaveStartOffset: null,
                        chipWaveLoopMode: null,
                        chipWavePlayBackwards: false,
                    });
                }
                useNintariboxSamples = true;
            } else if (url.toLowerCase() === "mariopaintboxsamples") {
                if (!useMarioPaintboxSamples) {
                    parsedEntries.push({
                        url: "marioPaintboxSamples",
                        sampleRate: 44100,
                        rootKey: 60,
                        percussion: false,
                        chipWaveLoopStart: null,
                        chipWaveLoopEnd: null,
                        chipWaveStartOffset: null,
                        chipWaveLoopMode: null,
                        chipWavePlayBackwards: false,
                    });
                }
                useMarioPaintboxSamples = true;
            } else {
                let urlSliced: string = url;
                let sampleRate: number = 44100;
                let rootKey: number = 60;
                let percussion: boolean = false;
                let chipWaveLoopStart: number | null = null;
                let chipWaveLoopEnd: number | null = null;
                let chipWaveStartOffset: number | null = null;
                let chipWaveLoopMode: number | null = null;
                let chipWavePlayBackwards: boolean = false;
                let optionsStartIndex: number = url.indexOf("!");
                let optionsEndIndex: number = -1;
                let parsedSampleOptions: boolean = false;
                if (optionsStartIndex === 0) {
                    optionsEndIndex = url.indexOf("!", optionsStartIndex + 1);
                    if (optionsEndIndex !== -1) {
                        const rawOptions: string[] = url.slice(optionsStartIndex + 1, optionsEndIndex).split(",");
                        for (const rawOption of rawOptions) {
                            const optionCode: string = rawOption.charAt(0);
                            const optionData: string = rawOption.slice(1, rawOption.length);
                            if (optionCode === "s") {
                                sampleRate = clamp(8000, 96000 + 1, parseFloatWithDefault(optionData, 44100));
                            } else if (optionCode === "r") {
                                rootKey = parseFloatWithDefault(optionData, 60);
                            } else if (optionCode === "p") {
                                percussion = true;
                            } else if (optionCode === "a") {
                                chipWaveLoopStart = parseIntWithDefault(optionData, null);
                            } else if (optionCode === "b") {
                                chipWaveLoopEnd = parseIntWithDefault(optionData, null);
                            } else if (optionCode === "c") {
                                chipWaveStartOffset = parseIntWithDefault(optionData, null);
                            } else if (optionCode === "d") {
                                chipWaveLoopMode = parseIntWithDefault(optionData, null);
                                if (chipWaveLoopMode != null) {
                                    // @TODO: Error-prone. This should be
                                    // automatically derived from the list of
                                    // available loop modes.
                                    chipWaveLoopMode = clamp(0, 3 + 1, chipWaveLoopMode);
                                }
                            } else if (optionCode === "e") {
                                chipWavePlayBackwards = true;
                            }
                        }
                        urlSliced = url.slice(optionsEndIndex + 1, url.length);
                        parsedSampleOptions = true;
                    }
                }
                if (parseOldSyntax) {
                    if (!parsedSampleOptions) {
                        if (url.indexOf("@") != -1) {
                            urlSliced = url.replaceAll("@", "");
                            percussion = true;
                        }
                        if (url.indexOf(",") != -1 && url.indexOf("!") != -1) {
                            if (url.indexOf(",") < url.indexOf("!")) {
                                [urlSliced, rootKey] = sliceForRootKey(urlSliced);
                                [urlSliced, sampleRate] = sliceForSampleRate(urlSliced);
                            }
                            else {
                                [urlSliced, sampleRate] = sliceForSampleRate(urlSliced);
                                [urlSliced, rootKey] = sliceForRootKey(urlSliced);
                            }
                        }
                        else {
                            if (url.indexOf(",") != -1) {
                                [urlSliced, sampleRate] = sliceForSampleRate(urlSliced);
                            }
                            if (url.indexOf("!") != -1) {
                                [urlSliced, rootKey] = sliceForRootKey(urlSliced);
                            }
                        }
                    }
                }
                parsedEntries.push({
                    url: urlSliced,
                    sampleRate: sampleRate,
                    rootKey: rootKey,
                    percussion: percussion,
                    chipWaveLoopStart: chipWaveLoopStart,
                    chipWaveLoopEnd: chipWaveLoopEnd,
                    chipWaveStartOffset: chipWaveStartOffset,
                    chipWaveLoopMode: chipWaveLoopMode,
                    chipWavePlayBackwards: chipWavePlayBackwards,
                });
            }
        }
        return { entries: parsedEntries };
    }

    private _generateURLDataForEntry = (entry: SampleEntry): string => {
        const url: string = entry.url.trim();
        const sampleRate: number = entry.sampleRate;
        const rootKey: number = entry.rootKey;
        const percussion: boolean = entry.percussion;
        const chipWaveLoopStart: number | null = entry.chipWaveLoopStart;
        const chipWaveLoopEnd: number | null = entry.chipWaveLoopEnd;
        const chipWaveStartOffset: number | null = entry.chipWaveStartOffset;
        const chipWaveLoopMode: number | null = entry.chipWaveLoopMode;
        const chipWavePlayBackwards: boolean = entry.chipWavePlayBackwards;
        const urlInLowerCase: string = url.toLowerCase();
        const isBundledSamplePack: boolean = (
            urlInLowerCase === "legacysamples"
            || urlInLowerCase === "nintariboxsamples"
            || urlInLowerCase === "mariopaintboxsamples"
        );
        const options: string[] = [];
        if (sampleRate !== 44100) options.push("s" + sampleRate);
        if (rootKey !== 60) options.push("r" + rootKey);
        if (percussion) options.push("p");
        if (chipWaveLoopStart != null) options.push("a" + chipWaveLoopStart);
        if (chipWaveLoopEnd != null) options.push("b" + chipWaveLoopEnd);
        if (chipWaveStartOffset != null) options.push("c" + chipWaveStartOffset);
        if (chipWaveLoopMode != null) options.push("d" + chipWaveLoopMode);
        if (chipWavePlayBackwards) options.push("e");
        if (isBundledSamplePack || options.length <= 0) {
            return url;
        } else {
            return "!" + options.join(",") + "!" + url;
        }
    }

    private _generateURLData = (): string => {
        let output = "";
        for (const entry of this._entries) {
            const url: string = entry.url.trim();
            if (url === "") continue;
            output += "|" + this._generateURLDataForEntry(entry);
        }
        return output;
    }

    private _getSampleName = (entry: SampleEntry): string => {
        try {
            const parsedUrl: URL = new URL(entry.url);
            return decodeURIComponent(parsedUrl.pathname.replace(/^([^\/]*\/)+/, ""));
        } catch (error) {
            return entry.url;
        }
    }

    private _noteNameFromPitchNumber = (n: number): string => {
        function wrap(x: number, b: number): number {
            return (x % b + b) % b;
        }
        n = Math.floor(n) - 12;
        const pitchNameIndex: number = wrap(n + Config.keys[this._doc.song.key].basePitch, Config.pitchesPerOctave);
        let pitch: string = "";
        if (Config.keys[pitchNameIndex].isWhiteKey) {
            pitch = Config.keys[pitchNameIndex].name;
        }
        else {
            const shiftDir: number = Config.blackKeyNameParents[wrap(n, Config.pitchesPerOctave)];
            pitch = Config.keys[wrap(pitchNameIndex + Config.pitchesPerOctave + shiftDir, Config.pitchesPerOctave)].name;
            if (shiftDir == 1) {
                pitch += "♭";
            }
            else if (shiftDir == -1) {
                pitch += "♯";
            }
        }
        pitch += Math.floor(n / Config.pitchesPerOctave);
        return pitch;
    }

    private _render = (scrollToBottom: boolean): void => {
        // @TODO: This is very much not efficient. The slowness here
        // isn't harmless if more samples are to be allowed.
        while (this._entryContainer.firstChild !== null) {
            this._entryContainer.removeChild(this._entryContainer.firstChild);
        }
        for (let entryIndex: number = 0; entryIndex < this._entries.length; entryIndex++) {
            const canMoveUp: boolean = this._entries.length >= 2 && entryIndex > 0;
            const canMoveDown: boolean = this._entries.length >= 2 && entryIndex < this._entries.length - 1;
            const entry: SampleEntry = this._entries[entryIndex];
            const optionsVisible: boolean = Boolean(this._entryOptionsDisplayStates[entryIndex]);
            const urlInput: HTMLInputElement = input({ style: "flex-grow: 1; margin-left: 1em; width: 100%;", value: entry.url });
            const sampleRateStepper: HTMLInputElement = input({ style: "flex-grow: 1; margin-left: 1em; width: 100%;", type: "number", value: "" + entry.sampleRate, min: "8000", max: "96000", step: "1" });
            const rootKeyStepper: HTMLInputElement = input({ style: "flex-grow: 1; margin-left: 1em; width: 100%;", type: "number", value: "" + entry.rootKey, min: "0", max: Config.maxPitch + Config.pitchesPerOctave, step: "1" });
            const rootKeyDisplay: HTMLSpanElement = span({ class: "add-sample-prompt-root-key-display", style: "margin-left: 0.4em; width: 3em; text-align: left; text-overflow: ellipsis; overflow: hidden; flex-shrink: 0;" }, `(${this._noteNameFromPitchNumber(entry.rootKey)})`);
            const percussionBox: HTMLInputElement = input({ style: "width: 1em; margin-left: 1em;", type: "checkbox" });
            const chipWaveLoopStartStepper: HTMLInputElement = input({ style: "flex-grow: 1; margin-left: 1em; width: 100%;", type: "number", value: "" + (entry.chipWaveLoopStart != null ? entry.chipWaveLoopStart : ""), min: "0", step: "1" });
            const chipWaveLoopEndStepper: HTMLInputElement = input({ style: "flex-grow: 1; margin-left: 1em; width: 100%;", type: "number", value: "" + (entry.chipWaveLoopEnd != null ? entry.chipWaveLoopEnd : ""), min: "0", step: "1" });
            const chipWaveStartOffsetStepper: HTMLInputElement = input({ style: "flex-grow: 1; margin-left: 1em; width: 100%;", type: "number", value: "" + (entry.chipWaveStartOffset != null ? entry.chipWaveStartOffset : ""), min: "0", step: "1" });
            const chipWaveLoopModeSelect: HTMLSelectElement = select({ style: "width: 100%; flex-grow: 1; margin-left: 0.5em;" },
                option({ value: -1 }, ""),
                option({ value: 0 }, "Loop"),
                option({ value: 1 }, "Ping-Pong"),
                option({ value: 2 }, "Play Once"),
                option({ value: 3 }, "Play Loop Once"),
            );
            if (entry.chipWaveLoopMode != null) {
                chipWaveLoopModeSelect.value = "" + entry.chipWaveLoopMode;
            }
            const chipWavePlayBackwardsBox: HTMLInputElement = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-left: auto; margin-right: auto;" });
            chipWavePlayBackwardsBox.checked = entry.chipWavePlayBackwards;
            const sampleName: string = this._getSampleName(entry);
            percussionBox.checked = entry.percussion;
            const copyLinkPresetButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size);", title: "For use with \"Add multiple samples\"" }, "Copy link preset");
            const removeButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size); margin-left: 0.5em;" }, "Remove");
            const moveUpButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size); margin-left: 0.5em;" }, SVG.svg({ width: "16", height: "16", viewBox: "-13 -14 26 26", "pointer-events": "none", style: "width: 100%; height: 100%;" }, SVG.path({ d: "M -6 6 L 0 -6 L 6 6 z", fill: ColorConfig.primaryText })));
            const moveDownButton: HTMLButtonElement = button({ style: "height: auto; min-height: var(--button-size); margin-left: 0.5em;" }, SVG.svg({ width: "16", height: "16", viewBox: "-13 -14 26 26", "pointer-events": "none", style: "width: 100%; height: 100%;" }, SVG.path({ d: "M -6 -6 L 6 -6 L 0 6 z", fill: ColorConfig.primaryText })));
            const optionsContainer: HTMLDetailsElement = details(
                { open: optionsVisible, style: "margin-bottom: 2em; margin-top: 1em;" },
                summary({ style: "margin-bottom: 1em;" }, "Options"),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `flex-shrink: 0; :text-align: right; color: ${ColorConfig.primaryText};` }, span({ title: "What rate to resample to" }, "Sample rate")),
                    sampleRateStepper
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `text-align: right; color: ${ColorConfig.primaryText}; flex-shrink: 0;` }, span({ title: "Pitch where the sample is played as-is" }, "Root key")),
                    rootKeyDisplay,
                    rootKeyStepper
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: 0.5em;" },
                    div({ style: `text-align: right; color: ${ColorConfig.primaryText};` }, "Percussion (pitch doesn't change with key)"),
                    percussionBox
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `flex-shrink: 0; text-align: right; color: ${ColorConfig.primaryText};` }, span({ title: "Applies to the \"Loop Start\" loop control option of the preset created for this sample" }, "Loop Start")),
                    chipWaveLoopStartStepper
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `flex-shrink: 0; text-align: right; color: ${ColorConfig.primaryText};` }, span({ title: "Applies to the \"Loop End\" loop control option of the preset created for this sample" }, "Loop End")),
                    chipWaveLoopEndStepper
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `flex-shrink: 0; text-align: right; color: ${ColorConfig.primaryText};` }, span({ title: "Applies to the \"Offset\" loop control option of the preset created for this sample" }, "Sample Start Offset")),
                    chipWaveStartOffsetStepper
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `flex-shrink: 0; text-align: right; color: ${ColorConfig.primaryText};` }, span({ title: "Applies to the \"Loop Mode\" loop control option of the preset created for this sample" }, "Loop Mode")),
                    chipWaveLoopModeSelect
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `flex-shrink: 0; text-align: right; color: ${ColorConfig.primaryText};` }, span({ title: "Applies to the \"Backwards\" loop control option of the preset created for this sample" }, "Backwards")),
                    chipWavePlayBackwardsBox
                ),
            );
            urlInput.dataset.index = "" + entryIndex;
            sampleRateStepper.dataset.index = "" + entryIndex;
            rootKeyStepper.dataset.index = "" + entryIndex;
            percussionBox.dataset.index = "" + entryIndex;
            chipWaveLoopStartStepper.dataset.index = "" + entryIndex;
            chipWaveLoopEndStepper.dataset.index = "" + entryIndex;
            chipWaveStartOffsetStepper.dataset.index = "" + entryIndex;
            chipWaveLoopModeSelect.dataset.index = "" + entryIndex;
            chipWavePlayBackwardsBox.dataset.index = "" + entryIndex;
            copyLinkPresetButton.dataset.index = "" + entryIndex;
            removeButton.dataset.index = "" + entryIndex;
            moveUpButton.dataset.index = "" + entryIndex;
            moveDownButton.dataset.index = "" + entryIndex;
            optionsContainer.dataset.index = "" + entryIndex;
            const bottomButtons: HTMLDivElement = div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end;" }, copyLinkPresetButton, removeButton);
            if (canMoveUp) {
                bottomButtons.appendChild(moveUpButton);
            }
            if (canMoveDown) {
                bottomButtons.appendChild(moveDownButton);
            }
            const entryElement: HTMLDivElement = div({ style: `padding: 0.6em; margin: 0.4em; border: 1px solid ${ColorConfig.uiWidgetBackground}; border-radius: 4px;` },
                div({
                    class: "add-sample-prompt-sample-name",
                    style: `margin-bottom: 0.5em; color: ${ColorConfig.secondaryText}; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`,
                    title: sampleName,
                },
                    sampleName
                ),
                div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-bottom: 0.5em;" },
                    div({ style: `text-align: right; color: ${ColorConfig.primaryText};` }, "URL"),
                    urlInput
                ),
                optionsContainer,
                bottomButtons
            );
            optionsContainer.addEventListener("toggle", this._whenOptionsAreToggled);
            urlInput.addEventListener("change", this._whenURLChanges);
            sampleRateStepper.addEventListener("change", this._whenSampleRateChanges);
            rootKeyStepper.addEventListener("change", this._whenRootKeyChanges);
            percussionBox.addEventListener("change", this._whenPercussionChanges);
            chipWaveLoopStartStepper.addEventListener("change", this._whenChipWaveLoopStartChanges);
            chipWaveLoopEndStepper.addEventListener("change", this._whenChipWaveLoopEndChanges);
            chipWaveStartOffsetStepper.addEventListener("change", this._whenChipWaveStartOffsetChanges);
            chipWaveLoopModeSelect.addEventListener("change", this._whenChipWaveLoopModeChanges);
            chipWavePlayBackwardsBox.addEventListener("change", this._whenChipWavePlayBackwardsChanges);
            copyLinkPresetButton.addEventListener("click", this._whenCopyLinkPresetClicked);
            removeButton.addEventListener("click", this._whenRemoveSampleClicked);
            if (canMoveUp) {
                moveUpButton.addEventListener("click", this._whenMoveSampleUpClicked);
            }
            if (canMoveDown) {
                moveDownButton.addEventListener("click", this._whenMoveSampleDownClicked);
            }
            this._entryContainer.appendChild(entryElement);
            const thisIsTheLastElement: boolean = entryIndex === this._entries.length - 1;
            if (scrollToBottom && thisIsTheLastElement) {
                entryElement.scrollIntoView({ "block": "nearest", "inline": "nearest" });
            }
        }
    }
}
