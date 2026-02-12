export type ChoicePosition = { rowIdx: number; colIdx: number };

export type FocusAction = "next" | "prev";

export type Row = {
	id: number;
	choices: Array<string>;
	submitted: boolean;
	errors: Array<string>;
};

export type WordleState = {
	words: string[];
	rows: Array<Row>;
	randomWord: string;
	focusCell: { rowIdx: number; colIdx: number };
};

export type WorldeMutations = {
	changeRow: {
		indexes: { rowIdx: number; colIdx: number };
		letter: string;
	};
	changeFocus: { action: FocusAction };

	setWords: { words: string[] };
	setRandomWord: { randomWord: string };
	submitRow: { rowIdx: number };
};
