import * as React from "react";

interface RowProps {
  children?: JSX.Element | undefined;
  className?: string;
}

export function Row(props: RowProps) {
  let className = props.className ? props.className += " row" : "row";
  return <div className={className}>
    {props.children}
  </div>;
}
