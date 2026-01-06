export type ChoicePosition = { rowIdx: number; colIdx: number };
export type FocusAction = "next" | "prev";
export type WordleState = {
  words: string[];
  userChoices: (string | undefined)[][];
  focusCell: { rowIdx: number; colIdx: number };
};

export type WorldeReducers = {
  writeUserChoice: (
    indexes: ChoicePosition,
    letter: string | undefined
  ) => void;
  changeFocus: (action: FocusAction, rowNum?: number) => void;
};

export type WordleContextType = WordleState &
  WorldeReducers & {
    randomWord: string;
  };
