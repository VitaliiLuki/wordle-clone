import { FC, useCallback, useContext, useEffect, useRef } from "react";
import styles from "./wordle-board.module.scss";
import { isVerifiedKeyDown } from "@/src/context/utils";
import { ChoicePosition, FocusAction } from "@/src/context/abstract";
import { constVoid } from "@/src/utils/function.utils";
import { ViewModelContext } from "@/src/utils/context/view-model.context";
import { WorldeViewModel } from "@/src/features/wordle/view-model/worlde.view-model";
import { Row } from "../../view-model/worlde.abstract";
import classNames from "classnames";
import { showNotification } from "@/src/components/notification/notification";

const hotKeyActionMapper: Record<string, FocusAction> = {
	Tab: "next",
	ArrowLeft: "prev",
	ArrowRight: "next",
};

const BoardCell: FC<{
	letter: string;
	isFocused?: boolean;
	row: Row;
	handleChoice: (letter: string) => void;
	handleChangeFocus: (action: FocusAction) => void;
	handleSubmit: () => void;
}> = ({
	row,
	letter,
	isFocused = false,
	handleChoice,
	handleChangeFocus,
	handleSubmit,
}) => {
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

				if (event.key === "Enter") {
					handleSubmit();
				}

				if (event.key === "Backspace") {
					handleChoice("");
				}

				if (hotKeyActionMapper[event.key]) {
					handleChangeFocus(hotKeyActionMapper[event.key]);
				}
			}}
			tabIndex={0}
			className={classNames(styles.cell, {
				[styles.error]: row.errors.length,
			})}
		>
			{letter}
		</div>
	);
};

const BoardRow: FC<{ row: Row; rowIdx: number; focusCell: ChoicePosition }> = ({
	row,
	rowIdx,
	focusCell,
}) => {
	const ctx = useContext(ViewModelContext);

	const { actions } = ctx as WorldeViewModel;
	const { changeFocus, changeRow, submitRow } = actions;

	const handleChoice = useCallback(
		(rowIdx: number, colIdx: number) => (letter: string) => {
			changeRow({ indexes: { rowIdx, colIdx }, letter });
		},
		[changeRow],
	);

	const handleChangeFocus = useCallback(
		(action: FocusAction) => {
			changeFocus({ action });
		},
		[changeFocus],
	);

	const handleSubmit = useCallback(
		(rowIdx: number) => {
			submitRow({ rowIdx });
		},
		[submitRow, row],
	);

	return (
		<div key={rowIdx} className={styles.row}>
			{row.choices.map((letter, colIdx) => {
				return (
					<BoardCell
						key={colIdx}
						letter={letter}
						row={row}
						isFocused={
							focusCell.rowIdx === rowIdx &&
							focusCell.colIdx === colIdx
						}
						handleChoice={handleChoice(rowIdx, colIdx)}
						handleChangeFocus={handleChangeFocus}
						handleSubmit={() => handleSubmit(rowIdx)}
					/>
				);
			})}
		</div>
	);
};

type WordleBoardProps = {
	rows: Array<Row>;
	focusCell: ChoicePosition;
};

export const WordleBoard: FC<WordleBoardProps> = ({ rows, focusCell }) => {
	return (
		<div className={styles.boardContainer}>
			{rows.map((row, rowIdx) => (
				<BoardRow
					key={rowIdx}
					row={row}
					rowIdx={rowIdx}
					focusCell={focusCell}
				/>
			))}
		</div>
	);
};
