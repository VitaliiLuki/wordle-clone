import { Observable, Subscription } from "rxjs";
import { createSubjectHandler } from "../rxjs.utils";
import { MutationsForState } from "./abstract";

type ActionPayloadMap = Record<string, any>;

export type VMDispatch<TPayloads extends ActionPayloadMap> = <
	K extends keyof TPayloads
>(
	type: K,
	payload: TPayloads[K]
) => void;

export type StateActions<TPayloads extends ActionPayloadMap> = {
	[K in keyof TPayloads]: (payload: TPayloads[K]) => void;
};

export abstract class ViewModelBase<
	TState extends Record<string, unknown>,
	TPayloads extends ActionPayloadMap
> {
	protected abstract reducers: MutationsForState<TState, TPayloads>;
	protected abstract initialState: TState;

	// Можно оставить Subject, но тогда currentState обязателен
	stateHandler = createSubjectHandler<TState>();

	private currentState!: TState;

	private mainSubscriptions = new Subscription();
	private loaded = false;

	private _actions?: StateActions<TPayloads>;

	init() {
		this.currentState = this.initialState;
		this.stateHandler.handle(this.currentState);
	}

	/** VM lifecycle */
	load() {
		if (this.loaded) return;
		this.loaded = true;
		this.onLoad(this.mainSubscriptions);
	}

	unload() {
		if (!this.loaded) return;
		this.loaded = false;

		this.mainSubscriptions.unsubscribe();
		this.mainSubscriptions = new Subscription();

		this.onUnload();
	}

	protected onLoad(_subs: Subscription) {}
	protected onUnload() {}

	get state$(): Observable<TState> {
		return this.stateHandler.value$;
	}

	getState(): TState {
		return this.currentState;
	}

	protected setState(next: TState) {
		this.currentState = next;
		this.stateHandler.handle(next);
	}

	/** core dispatch */
	dispatch: VMDispatch<TPayloads> = (type, payload) => {
		const reducer = this.reducers[type];
		const next = reducer(this.getState(), payload);
		this.setState(next);
	};

	/** actions(payload) facade */
	get actions(): StateActions<TPayloads> {
		if (this._actions) return this._actions;

		const wrapped = {} as StateActions<TPayloads>;
		(Object.keys(this.reducers) as Array<keyof TPayloads>).forEach((k) => {
			wrapped[k] = (payload: TPayloads[typeof k]) =>
				this.dispatch(k, payload);
		});

		this._actions = wrapped;
		return wrapped;
	}

	/** helper: track AbortController in subscriptions */
	protected trackAbort(controller: AbortController) {
		this.mainSubscriptions.add(() => controller.abort());
	}
}
