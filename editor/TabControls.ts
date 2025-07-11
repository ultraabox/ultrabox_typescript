// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

export enum TabSettingType {
	EditInstrument = 0,
	EditSelection = 1
}

export type TabControl = {
	icon: string,
	type: TabSettingType
}

export const TabControls: { [key: number]: TabControl } = {
	[TabSettingType.EditInstrument]: { type: TabSettingType.EditInstrument, icon: '🎺' },
	[TabSettingType.EditSelection]: { type: TabSettingType.EditSelection, icon: '⬚' }
}