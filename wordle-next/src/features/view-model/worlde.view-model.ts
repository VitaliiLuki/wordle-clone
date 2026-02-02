import { ViewModelBase } from "@/src/utils/vm/vm.base";
import { WordleState, WorldeMutations } from "./abstract";
import {
	WORLDE_STATE_SEED,
	WORDLE_REDUCERS_SEED,
	WORDS_LIST_URL,
} from "./fixtures";

export class WorldeViewModel extends ViewModelBase<
	WordleState,
	WorldeMutations
> {
	protected initialState = WORLDE_STATE_SEED;
	protected reducers = WORDLE_REDUCERS_SEED;

	override onLoad() {
		const controller = new AbortController();
		this.trackAbort(controller);

		this.fetchWords(controller);
	}

	async fetchWords(controller: AbortController) {
		const res = await fetch(WORDS_LIST_URL, { signal: controller.signal });
		if (!res.ok) throw new Error(`Failed to fetch words: ${res.status}`);

		const text = await res.text();
		const words = text
			.split("\n")
			.map((w) => w.trim())
			.filter(Boolean);

		this.actions.setWords({ words });

		const randomWord = this.pickRandomWord(words);
		this.actions.setRandomWord({ randomWord });
	}

	private pickRandomWord(words: string[]) {
		if (words.length === 0) return "";
		const idx = Math.floor(Math.random() * words.length);
		return words[idx];
	}
}
