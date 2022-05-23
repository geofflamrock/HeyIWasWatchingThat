import classNames from "classnames";
import React from "react";

export function Container({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={classNames("container mx-auto", className)}>{children}</div>;
}
