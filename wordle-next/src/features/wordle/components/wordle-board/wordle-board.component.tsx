import { FC, useCallback, useEffect, useRef } from "react";
import styles from "./wordle-board.module.scss";
import { isVerifiedKeyDown } from "@/src/context/utils";
import { ChoicePosition, FocusAction } from "@/src/context/abstract";
import { constVoid } from "@/src/utils/function.utils";

const hotKeyActionMapper: Record<string, FocusAction> = {
  Tab: "next",
  ArrowLeft: "prev",
  ArrowRight: "next",
};

const BoardCell: FC<{
  letter: string | undefined;
  isFocused?: boolean;
  handleChoice: (letter: string | undefined) => void;
  handleChangeFocus: (action: FocusAction) => void;
}> = ({ letter, isFocused = false, handleChoice, handleChangeFocus }) => {
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused) {
      cellRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <div
      ref={cellRef}
      onKeyDown={(event) => {
        event.preventDefault();

        if (isVerifiedKeyDown(event.key)) {
          handleChoice(event.key);
          handleChangeFocus("next");
        }

        if (event.key === "Backspace") {
          handleChoice(undefined);
        }

        if (hotKeyActionMapper[event.key]) {
          handleChangeFocus(hotKeyActionMapper[event.key]);
        }
      }}
      tabIndex={0}
      className={styles.cell}
    >
      {letter}
    </div>
  );
};

type WordleBoardProps = {
  userChoices: (string | undefined)[][];
  focusCell: ChoicePosition;
  choiceSetter: (indexes: ChoicePosition, letter: string | undefined) => void;
  changeFocus: (action: FocusAction, rowNum?: number) => void;
};

export const WordleBoard: FC<WordleBoardProps> = ({
  userChoices,
  focusCell,
  choiceSetter,
  changeFocus,
}) => {
  const handleChoice = useCallback(
    (rowIdx: number, colIdx: number) => (letter: string | undefined) => {
      choiceSetter({ rowIdx, colIdx }, letter);
    },
    [choiceSetter]
  );
  return (
    <div className={styles.boardContainer}>
      {userChoices.map((row, rowIdx) => (
        <div key={rowIdx} className={styles.row}>
          {row.map((letter, colIdx) => (
            <BoardCell
              key={colIdx}
              letter={letter}
              isFocused={
                focusCell.rowIdx === rowIdx && focusCell.colIdx === colIdx
              }
              handleChoice={handleChoice(rowIdx, colIdx)}
              handleChangeFocus={changeFocus}
            />
          ))}
          <div
            className={styles.buttonContainer}
            style={{
              display: userChoices[rowIdx].every((letter) => letter)
                ? "block"
                : "none",
            }}
          >
            <button className={styles.submitButton} onClick={constVoid}>
              enter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
