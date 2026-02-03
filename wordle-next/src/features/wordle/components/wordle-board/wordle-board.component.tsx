import { FC, useCallback, useContext, useEffect, useRef } from "react";
import styles from "./wordle-board.module.scss";
import { isVerifiedKeyDown } from "@/src/context/utils";
import { ChoicePosition, FocusAction } from "@/src/context/abstract";
import { constVoid } from "@/src/utils/function.utils";
import { ViewModelContext } from "@/src/utils/context/view-model.context";
import { WorldeViewModel } from "@/src/features/wordle/view-model/worlde.view-model";

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
};

export const WordleBoard: FC<WordleBoardProps> = ({
	userChoices,
	focusCell,
}) => {
	const ctx = useContext(ViewModelContext);

	const { actions } = ctx as WorldeViewModel;
	const { changeFocus, writeUserChoice } = actions;

	const handleChoice = useCallback(
		(rowIdx: number, colIdx: number) => (letter: string | undefined) => {
			writeUserChoice({ indexes: { rowIdx, colIdx }, letter });
		},
		[writeUserChoice],
	);

	const handleChangeFocus = useCallback(
		(action: FocusAction) => {
			changeFocus({ action });
		},
		[changeFocus],
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
								focusCell.rowIdx === rowIdx &&
								focusCell.colIdx === colIdx
							}
							handleChoice={handleChoice(rowIdx, colIdx)}
							handleChangeFocus={handleChangeFocus}
						/>
					))}
					<div
						className={styles.buttonContainer}
						style={{
							display: userChoices[rowIdx].every(
								(letter) => letter,
							)
								? "block"
								: "none",
						}}
					>
						<button
							className={styles.submitButton}
							onClick={constVoid}
						>
							enter
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
