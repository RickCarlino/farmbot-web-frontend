import * as React from "react";

interface Props {
  onClick: Function;
  disabled: boolean;
  children?: JSX.Element;
}

export function LockableButton({ onClick, disabled, children }: Props) {
  let className = disabled ? "gray" : "yellow";
  return <button className={className}
    disabled={disabled}
    onClick={() => disabled ? "" : onClick()}>
    {children}
  </button>;
};
