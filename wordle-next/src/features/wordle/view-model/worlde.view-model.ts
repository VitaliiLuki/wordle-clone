import { ActionCall, guard, ViewModelBase } from "@/src/utils/vm/vm.base";
import { WordleState, WorldeMutations } from "./worlde.abstract";
import { WORLDE_STATE_SEED } from "./worlde.fixtures";
import { fetchWords } from "./worlde.utils";
import { WORDLE_REDUCERS_SEED, WORDLE_STATE_EFFECTS } from "./worlde.state";
import { UnaryFunction, Observable, tap } from "rxjs";
import { showNotification } from "@/src/components/notification/notification";

export class WorldeViewModel extends ViewModelBase<
	WordleState,
	WorldeMutations
> {
	protected initialState = WORLDE_STATE_SEED;
	protected reducers = WORDLE_REDUCERS_SEED;
	protected stateEffects = WORDLE_STATE_EFFECTS;

	effects = [
		this.actionCalls$.pipe(
			guard("submitRow"),
			tap(({ currentState, payload }) => {
				const row = currentState.rows[payload.rowIdx];

				if (row.errors.length) {
					showNotification(row.errors[0], { type: "error" });
				}
			}),
		),
	];

	override onLoad() {
		const controller = new AbortController();

		fetchWords(controller, this.actions.setWords);
	}
}
