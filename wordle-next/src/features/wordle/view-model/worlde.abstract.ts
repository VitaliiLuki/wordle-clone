export type ChoicePosition = { rowIdx: number; colIdx: number };

export type FocusAction = "next" | "prev";

export type Choice = {
	value: string;
	status?: "correct" | "present" | "absent";
};

export type Row = {
	id: number;
	choices: Array<Choice>;
	submitted: boolean;
	errors: Array<string>;
};

export type WordleState = {
	words: string[];
	rows: Array<Row>;
	randomWord: string;
	providedWord: string | undefined;
	focusCell: { rowIdx: number; colIdx: number };
};

export type WorldeMutations = {
	changeRow: {
		indexes: { rowIdx: number; colIdx: number };
		letter: string;
	};
	changeFocus: { action: FocusAction };

	setWords: { words: string[] };
	submitRow: { rowIdx: number };
	refresh: void;
};
