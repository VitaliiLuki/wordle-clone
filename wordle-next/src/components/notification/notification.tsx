import React, { FC } from "react";

export const Notification: FC<{ content: string | React.JSX.Element }> = ({
	content,
}) => {
	return <span>{content}</span>;
};
