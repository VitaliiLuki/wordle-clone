import { constVoid } from "@/src/utils/function.utils";
import { WordleState, WorldeMutations } from "./abstract";
import { MutationsForState } from "@/src/utils/vm/abstract";
import { generateInitialChoices } from "./utils";

export const START_COL_INDEX = 0;
export const END_COL_INDEX = 4;
export const WORDS_LIST_URL =
	"https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";

// need data fetch + state update with fetch data
// effect which checks and populates random word

export const WORLDE_STATE_SEED: WordleState = {
	words: [],
	userChoices: generateInitialChoices(),
	randomWord: "",
	focusCell: { rowIdx: 0, colIdx: 0 },
};

export const WORDLE_REDUCERS_SEED: MutationsForState<
	WordleState,
	WorldeMutations
> = {
	writeUserChoice: (state, payload) => {
		const {
			indexes: { rowIdx, colIdx },
			letter,
		} = payload;

		const newChoices = state.userChoices.map((row) => [...row]);
		newChoices[rowIdx][colIdx] = letter;
		return { ...state, userChoices: newChoices };
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
};
