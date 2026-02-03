import { MutationsForState, StateEffects } from "@/src/utils/vm/abstract";
import { WordleState, WorldeMutations } from "./worlde.abstract";
import { END_COL_INDEX, START_COL_INDEX } from "./worlde.fixtures";

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
	{
		name: "debg",
		project: (state) => {
			console.log("XXX state", state);
			return state;
		},
	},
];
