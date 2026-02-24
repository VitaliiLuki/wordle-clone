import { FC, useContext } from "react";
import { WordleBoard } from "./components/wordle-board/wordle-board.component";
import styles from "./wordle.module.scss";
import { ViewModelContext } from "@/src/utils/context/view-model.context";
import { WorldeViewModel } from "./view-model/worlde.view-model";
import { useObservable } from "@/src/utils/rxjs.utils";
import { WORLDE_STATE_SEED } from "./view-model/worlde.fixtures";

export const WordleContainer: FC = () => {
	const ctx = useContext(ViewModelContext);

	const { state$ } = ctx as WorldeViewModel;

	const state = useObservable(state$, WORLDE_STATE_SEED);
	const { rows, focusCell } = state;

	return (
		<>
			<header className={styles.pageHeader}>Wordle Game</header>
			<main className={styles.mainSection}>
				<WordleBoard rows={rows} focusCell={focusCell} />
			</main>
			<footer>General Info...</footer>
		</>
	);
};
