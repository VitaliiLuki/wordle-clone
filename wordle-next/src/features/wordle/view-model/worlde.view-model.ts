import { ViewModelBase } from "@/src/utils/vm/vm.base";
import { WordleState, WorldeMutations } from "./worlde.abstract";
import { WORLDE_STATE_SEED } from "./worlde.fixtures";
import { fetchWords } from "./worlde.utils";
import { WORDLE_REDUCERS_SEED, WORDLE_STATE_EFFECTS } from "./worlde.state";

export class WorldeViewModel extends ViewModelBase<
	WordleState,
	WorldeMutations
> {
	protected initialState = WORLDE_STATE_SEED;
	protected reducers = WORDLE_REDUCERS_SEED;
	protected stateEffects = WORDLE_STATE_EFFECTS;

	override onLoad() {
		const controller = new AbortController();
		this.trackAbort(controller);

		fetchWords(controller, this.actions.setWords);
	}
}
