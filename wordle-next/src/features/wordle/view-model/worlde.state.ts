import { MutationsForState, StateEffects } from "@/src/utils/vm/abstract";
import { WordleState, WorldeMutations } from "./worlde.abstract";
import {
	END_COL_INDEX,
	NOT_IN_WORDS_LIST_ERROR,
	START_COL_INDEX,
} from "./worlde.fixtures";

export const WORDLE_REDUCERS_SEED: MutationsForState<
	WordleState,
	WorldeMutations
> = {
	changeRow: (state, payload) => {
		const {
			indexes: { rowIdx, colIdx },
			letter,
		} = payload;

		const currentRows = state.rows.map((row) => ({ ...row }));
		currentRows[rowIdx].choices[colIdx] = letter;
		currentRows[rowIdx].errors = [];

		return { ...state, rows: currentRows };
	},
	changeFocus: (state, { action }) => {
		const { rowIdx, colIdx } = state.focusCell;

		if (action === "prev" && colIdx > START_COL_INDEX) {
			return { ...state, focusCell: { rowIdx, colIdx: colIdx - 1 } };
		}

		if (action === "next" && colIdx < END_COL_INDEX) {
			return { ...state, focusCell: { rowIdx, colIdx: colIdx + 1 } };
		}

		return state;
	},
	setWords: (state, { words }) => {
		return { ...state, words };
	},
	setRandomWord: (state, { randomWord }) => ({ ...state, randomWord }),
	submitRow: (state, { rowIdx }) => {
		const indexedRow = state.rows[rowIdx];
		const rowHasAllChoicesFilled = indexedRow.choices.every((choice) =>
			Boolean(choice),
		);

		if (!rowHasAllChoicesFilled) {
			return state;
		}

		const choice = indexedRow.choices.join("");
		const choiceInWords = state.words.includes(choice);

		const currentRows = state.rows.map((row) => ({ ...row }));

		if (!choiceInWords) {
			currentRows[rowIdx] = {
				...currentRows[rowIdx],
				submitted: true,
				errors: [NOT_IN_WORDS_LIST_ERROR],
			};
			return {
				...state,
				rows: currentRows,
			};
		}

		currentRows[rowIdx] = {
			...currentRows[rowIdx],
			submitted: true,
			errors: [],
		};

		return {
			...state,
			rows: currentRows,
			focusCell: { rowIdx: rowIdx + 1, colIdx: 0 },
		};
	},
};

export const WORDLE_STATE_EFFECTS: StateEffects<WordleState> = [
	{
		name: "Populate random word",
		project: (state) => {
			if (!state.randomWord && state.words.length > 0) {
				const idx = Math.floor(Math.random() * state.words.length);
				return { ...state, randomWord: state.words[idx] };
			}
			return state;
		},
	},
	// {
	// 	name: "debg",
	// 	project: (state) => {
	// 		console.log("XXX state", state);
	// 		return state;
	// 	},
	// },
];
