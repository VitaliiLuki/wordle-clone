import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  FC,
  useMemo,
  useCallback,
} from "react";
import { fetchWords, generateInitialChoices } from "./utils";
import {
  ChoicePosition,
  FocusAction,
  WordleContextType,
  WorldeReducers,
} from "./abstract";
import {
  END_COL_INDEX,
  START_COL_INDEX,
  WORDLE_REDUCERS_SEED,
  WORLDE_STATE_SEED,
} from "./fixtures";

export const WordleContext = createContext<WordleContextType>({
  ...WORLDE_STATE_SEED,
  ...WORDLE_REDUCERS_SEED,
  randomWord: "",
});

type WordleContextProviderProps = { children: ReactNode };

export const WordleContextProvider: FC<WordleContextProviderProps> = ({
  children,
}) => {
  const [words, setWords] = useState<Array<string> | undefined>(undefined);
  const [userChoices, setUserChoices] = useState<
    Array<Array<string | undefined>>
  >(generateInitialChoices());
  const [focusCell, setFocusCell] = useState<ChoicePosition>(
    WORLDE_STATE_SEED.focusCell
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchWords(controller, setWords);

    return () => controller.abort();
  }, []);

  const randomWord = useMemo(() => {
    if (!words || words.length === 0) return "";

    // eslint-disable-next-line react-hooks/purity
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }, [words]);

  const writeUserChoice = useCallback(
    (...args: Parameters<WorldeReducers["writeUserChoice"]>) => {
      setUserChoices((prevChoices) => {
        const [{ rowIdx, colIdx }, letter] = args;
        const newChoices = prevChoices.map((row) => [...row]);
        newChoices[rowIdx][colIdx] = letter;
        return newChoices;
      });
    },
    []
  );

  const changeFocus = useCallback((action: FocusAction, rowNum?: number) => {
    setFocusCell((prevFocus) => {
      const { rowIdx, colIdx } = prevFocus;

      if (rowNum) {
        return { rowIdx: rowNum + 1, colIdx: START_COL_INDEX };
      }

      if (action === "prev" && colIdx > START_COL_INDEX) {
        return { rowIdx, colIdx: colIdx - 1 };
      }

      if (action === "next" && colIdx < END_COL_INDEX) {
        return { rowIdx, colIdx: colIdx + 1 };
      }

      return prevFocus;
    });
  }, []);

  return (
    <WordleContext.Provider
      value={{
        words: words ?? [],
        randomWord,
        userChoices,
        focusCell,
        writeUserChoice,
        changeFocus,
      }}
    >
      {children}
    </WordleContext.Provider>
  );
};
