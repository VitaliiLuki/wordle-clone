import { constVoid } from "../utils/function.utils";
import { WordleState, WorldeReducers } from "./abstract";

export const WORLDE_STATE_SEED: WordleState = {
  words: [],
  userChoices: [[]],
  focusCell: { rowIdx: 0, colIdx: 0 },
};

export const WORDLE_REDUCERS_SEED: WorldeReducers = {
  writeUserChoice: constVoid,
  changeFocus: constVoid,
};

export const START_COL_INDEX = 0;
export const END_COL_INDEX = 4;
