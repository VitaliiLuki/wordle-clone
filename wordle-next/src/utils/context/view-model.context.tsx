import React, { createContext, useEffect, useRef } from "react";
import { ViewModelBase } from "../vm/vm.base";

export const ViewModelContext = createContext<ViewModelBase<any, any> | null>(
	null
);

export const ViewModelContextProvider = <T extends ViewModelBase<any, any>>({
	children,
	vm,
}: {
	children: React.ReactNode;
	vm: new () => T;
}) => {
	const vmRef = useRef<T | null>(null);

	if (!vmRef.current) {
		vmRef.current = new vm();
	}

	useEffect(() => {
		const inst = vmRef.current!;
		inst.init();
		inst.load();

		return () => inst.unload();
	}, []);

	return (
		<ViewModelContext.Provider value={vmRef.current}>
			{children}
		</ViewModelContext.Provider>
	);
};
