import React, { FC } from "react";
import { toast, ToastOptions, TypeOptions } from "react-toastify";

export const showNotification = (
	content: string | React.JSX.Element,
	options?: ToastOptions,
) => {
	toast(content, options);
};
