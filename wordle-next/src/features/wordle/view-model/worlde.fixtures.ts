import { WordleState } from "./worlde.abstract";
import { generateInitialRows } from "./worlde.utils";

export const START_COL_INDEX = 0;
export const END_COL_INDEX = 4;
export const WORDS_LIST_URL =
	"https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";

export const NOT_IN_WORDS_LIST_ERROR = "Not in Words list!";

export const WORLDE_STATE_SEED: WordleState = {
	words: [],
	rows: generateInitialRows(),
	randomWord: "",
	focusCell: { rowIdx: 0, colIdx: 0 },
};
