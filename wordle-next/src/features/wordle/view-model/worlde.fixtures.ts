import { WordleState } from "./worlde.abstract";
import { generateInitialChoices } from "./worlde.utils";

export const START_COL_INDEX = 0;
export const END_COL_INDEX = 4;
export const WORDS_LIST_URL =
	"https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";

export const WORLDE_STATE_SEED: WordleState = {
	words: [],
	userChoices: generateInitialChoices(),
	randomWord: "",
	focusCell: { rowIdx: 0, colIdx: 0 },
};
