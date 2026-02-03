export type MutationsForState<
	TState extends Record<string, any>,
	TReducers extends Record<string, any>,
> = {
	[K in keyof TReducers]: (state: TState, payload: TReducers[K]) => TState;
};

export type StateActions<
	TState extends Record<string, any>,
	TReducers extends Record<string, any>,
> = {
	[K in keyof TReducers]: (state: TState, payload: TReducers[K]) => void;
};

export type StateEffects<TState extends Record<string, any>> = Array<{
	name: string;
	project: (state: TState) => TState;
}>;
