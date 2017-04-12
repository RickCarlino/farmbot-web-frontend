import * as React from "react";
import { botIsOnline } from "./actions";

interface Props {
  fallback?: string | undefined;
  children?: React.ReactNode;
}

export function MustBeOnline(props: Props) {
  let FALLBACK = props.fallback || "";
  // let FORCE_OPEN = process.env.NODE_ENV === "development";
  let I_WILL_FIX_THIS_LATER = true;
  botIsOnline();
  return <div>
    {I_WILL_FIX_THIS_LATER ? props.children : FALLBACK}
  </div>
}

