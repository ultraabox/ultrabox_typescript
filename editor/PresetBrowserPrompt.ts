// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";

const {button, div, h2, input } = HTML;

export class PresetBrowserPrompt implements Prompt {
		private readonly _cancelButton: HTMLButtonElement = button({class: "cancelButton"});
		//test

		private readonly _searchBar: HTMLInputElement = input({type: "search", autocorrect:"off", autocomplete:"off", autocapitalize:"none", spellcheck:"false", role:"textbox", placeholder:"Search..."});
		private readonly _addCategoryButton: HTMLButtonElement = button({}, "+ Category");
		private readonly _presetsContainer: HTMLDivElement = div({style: "padding: 0.6em; margin: 0.4em; border: 1px solid var(--ui-widget-background); border-radius: 4px;"});
		private readonly _importButton: HTMLButtonElement = button({}, "Import");
		private readonly _renameButton: HTMLButtonElement = button({}, "Rename");
		private readonly _deleteButton: HTMLButtonElement = button({}, "Delete");
		private readonly _useButton: HTMLButtonElement = button({}, "Use");
		private readonly _operatorButtonsContainer: HTMLDivElement = div({}, this._importButton, this._renameButton, this._deleteButton, this._addCategoryButton, this._useButton);

		public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 600px;" },
		    h2("Custom Presets"),
			this._searchBar,
			this._presetsContainer,
			this._operatorButtonsContainer,
		this._cancelButton,

	);

	constructor(private _doc: SongDocument) {
		this._cancelButton.addEventListener("click", this._close);
		this._render();
	}

		private _render = (): void => {
		
	}

		private _close = (): void => {
		this._doc.undo();
	}

		public cleanUp = (): void => {
		this._cancelButton.removeEventListener("click", this._close);
	}

}
