import { Everything } from "../interfaces";
import { EditorProps } from "./interfaces";

export function mapStateToProps(props: Everything): EditorProps {
  return {
    current: props.sequences.all[props.sequences.current],
    all: props.sequences.all,
    dispatch: props.dispatch,
    tools: props.tools.tools.all
  }
}
