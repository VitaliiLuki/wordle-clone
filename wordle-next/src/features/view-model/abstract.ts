export type ChoicePosition = { rowIdx: number; colIdx: number };

export type FocusAction = "next" | "prev";

export type WordleState = {
	words: string[];
	userChoices: (string | undefined)[][];
	randomWord: string;
	focusCell: { rowIdx: number; colIdx: number };
};

export type WorldeMutations = {
	writeUserChoice: {
		indexes: { rowIdx: number; colIdx: number };
		letter: string | undefined;
	};
	changeFocus: { action: FocusAction };

	setWords: { words: string[] };
	setRandomWord: { randomWord: string };
};
