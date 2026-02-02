import { useEffect, useState } from "react";
import { BehaviorSubject, NEVER, Observable, Subject } from "rxjs";

/**
 * Allows you to use observable tin render cycle
 * @param fa stream
 * @param initial initial data
 * @returns lates value
 */
export const useObservable = <A>(
	fa: Observable<A> | undefined,
	initial: A,
): A => {
	const [value, setValue] = useState(() => initial);
	useEffect(() => {
		const subscription = (fa ?? NEVER).subscribe((a) => setValue(() => a));
		return () => subscription.unsubscribe();
	}, [fa]);
	return value;
};

interface HandlerValue<A> {
	readonly value$: Observable<A>;
	readonly handle: (a: A) => void;
}
interface CreateBehaviorHandler {
	<A>(defaultValue: A): HandlerValue<A>;
}

export const createBehaviorHandler: CreateBehaviorHandler = <A>(
	defaultValue: A,
) => {
	const value = new BehaviorSubject<A>(defaultValue);
	return {
		value$: value.asObservable(),
		handle: value.next.bind(value),
	};
};

interface CreateSubjectHandler {
	<A>(): HandlerValue<A>;
}

export const createSubjectHandler: CreateSubjectHandler = <A>() => {
	const value = new Subject<A>();
	return {
		value$: value.asObservable(),
		handle: value.next.bind(value),
	};
};
