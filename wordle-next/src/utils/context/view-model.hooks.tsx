// import { Observable } from "rxjs";
// import { ViewModelBase } from "../vm/vm.base";
// import { useContext, useState } from "react";
// import { ViewModelContext } from "./view-model.context";

// /**
//  * Hook to Use state from view model
//  * @param ctx view model context
//  * @param stateSelection list of state props
//  * @returns updatable object with specified props
//  */
// export const useViewModel = <
// 	TState extends Record<string, any>,
// 	TStateSubset extends Array<keyof TState>,
// >(
// 	vm: new (...args: any) => {
// 		state$: Observable<TState>;
// 		// seed: TState;
// 		// eq: StructEq<TState>;
// 	},
// 	...stateSelection: TStateSubset
// ): Pick<TState, TStateSubset[number]> => {
// 	const ctx = useContext(ViewModelContext);
// 	const { state$ } = ctx;
// 	const [value, setValue] =
// 		useState<Pick<TState, TStateSubset[number]>>(seed);

// 	useEffect(() => {
// 		const subscription = state$
// 			.pipe(
// 				map(
// 					(state) =>
// 						stateSelection.reduce(
// 							(acc, cur) => ({ ...acc, [cur]: state[cur] }),
// 							{},
// 						) as Pick<TState, TStateSubset[number]>,
// 				),
// 				duc(stateEq),
// 			)
// 			.subscribe((state) => setValue(state));
// 		return () => subscription.unsubscribe();
// 	}, []);

// 	return value;
// };
