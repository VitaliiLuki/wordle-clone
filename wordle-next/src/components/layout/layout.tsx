import { FC } from "react";

const Layout: FC<{ children?: React.ReactNode }> = (props) => {
  return <div>{props.children}</div>;
};

export default Layout;
