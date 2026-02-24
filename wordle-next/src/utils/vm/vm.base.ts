import { Observable, Subscription, Subject, pipe, filter } from "rxjs";
import { createSubjectHandler } from "../rxjs.utils";
import { MutationsForState, StateEffects } from "./abstract";

type ActionPayloadMap = Record<string, any>;

export type VMDispatch<TPayloads extends ActionPayloadMap> = <
	K extends keyof TPayloads,
>(
	type: K,
	payload: TPayloads[K],
) => void;

export type StateActions<TPayloads extends ActionPayloadMap> = {
	[K in keyof TPayloads]: (payload: TPayloads[K]) => void;
};

export type ActionCall<TState, TPayloads extends ActionPayloadMap> = {
	type: keyof TPayloads;
	payload: TPayloads[keyof TPayloads];
	previousState: TState;
	currentState: TState;
};

export const guard = <K extends keyof any>(actionType: K) =>
	pipe((call$: Observable<ActionCall<any, any>>) =>
		call$.pipe(filter((call) => call.type === actionType)),
	);

export abstract class ViewModelBase<
	TState extends Record<string, unknown>,
	TPayloads extends ActionPayloadMap,
> {
	protected abstract reducers: MutationsForState<TState, TPayloads>;
	protected abstract initialState: TState;
	protected abstract stateEffects: StateEffects<TState>;

	protected abstract effects: Observable<unknown>[];

	stateHandler = createSubjectHandler<TState>();

	private currentState!: TState;

	private mainSubscriptions = new Subscription();
	private vmLoaded = false;

	private _actions?: StateActions<TPayloads>;

	private actionCallsSubject = new Subject<ActionCall<TState, TPayloads>>();
	public actionCalls$ = this.actionCallsSubject.asObservable();

	init() {
		this.currentState = this.initialState;
		this.stateHandler.handle(this.currentState);
	}

	/** VM lifecycle */
	load() {
		if (this.vmLoaded) return;
		this.vmLoaded = true;

		this.effects.forEach((effect) => {
			const subscription = effect.subscribe();
			this.mainSubscriptions.add(subscription);
		});

		this.onLoad();
	}

	unload() {
		if (!this.vmLoaded) return;
		this.vmLoaded = false;

		this.mainSubscriptions.unsubscribe();
		this.mainSubscriptions = new Subscription();

		this.onUnload();
	}

	protected onLoad() {}
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
		const previousState = this.getState();

		const reducer = this.reducers[type];
		const updatedState = reducer(this.getState(), payload);

		const updatedStateAfterEffects = this.stateEffects.reduce(
			(prev, curr) => {
				return curr.project(prev);
			},
			updatedState,
		);

		this.setState(updatedStateAfterEffects);

		this.actionCallsSubject.next({
			type,
			payload,
			previousState,
			currentState: updatedStateAfterEffects,
		});
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
}
