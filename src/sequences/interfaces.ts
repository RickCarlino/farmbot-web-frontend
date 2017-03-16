import { Color } from "../interfaces";
import { SelectOptionsParams, Everything } from "../interfaces";
import { AuthState } from "../auth/interfaces";
import {
  Sequence as CeleryScriptSequence,
  SequenceBodyItem,
  MoveAbsolute,
  Vector3,
  CeleryNode,
  LegalArgString
} from "farmbot";
import { ToolsState } from "../tools/interfaces";
import { DropDownItem } from "../ui/index";
import { IStepInput } from "./step_tiles/index";
import { Tool } from "../tools/interfaces"
import { StepMoveDataXfer, StepSpliceDataXfer } from "../draggable/interfaces";

export type CHANNEL_NAME = "toast" | "ticker";

export const NUMERIC_FIELDS = ["x", "y", "z", "speed", "pin_number",
  "pin_value", "pin_mode", "milliseconds",
  "sequence_id", "rhs", "sequence_id"];

/** CeleryScript nodes allowed within a Sequence node's `body` attr. */
export type SequenceBodyMember = SequenceBodyItem;

export interface Sequence extends CeleryScriptSequence {
  color: Color;
  name: string;
  dirty?: boolean;
  id?: number;
}

export type SequenceOptions = {[P in keyof Sequence]?: Sequence[P]; };

export interface SequenceReducerState {
  all: Array<Sequence>;
  current: number;
};

export interface SequencesListProps {
  sequences: SequenceReducerState;
  dispatch: Function;
  auth: AuthState;
}

export interface NamedVector3 extends Vector3 {
  name: string;
}

export interface MobileSequencesNavProps {
  sequenceName: string;
}

/** Used when dispatching ADD_CHANNEL / REMOVE_CHANNEL actions. */
export interface ChanParams {
  channel_name: string;
  index: number;
};

// /** Used when dispatching an updated message type. */
export interface MessageParams {
  value: string | number;
  index: number;
};

export interface PickerProps {
  current: Color;
  onChange?: (color: Color) => any;
}

export interface PickerState {
  isOpen: boolean;
}

export interface MoveAbsState {
  isToolSelected: boolean;
}

export interface ChangeMoveAbsSelect {
  index: number;
  tool: DropDownItem;
  step: MoveAbsolute;
}

export interface ChangeMoveAbsInput {
  kind: string;
  index: number;
  value: string;
}

export type StatelessInput = (p: IStepInput) => JSX.Element;

export type InputChoiceDict = { [name: string]: (StatelessInput | undefined) };

export interface StepButtonParams {
  step: SequenceBodyItem;
  dispatch: Function;
  children?: JSX.Element | undefined;
  color: "blue"
  | "green"
  | "orange"
  | "yellow"
  | "brown"
  | "red"
  | "purple"
  | "pink"
  | "gray";
}

export interface CopyParams {
  dispatch: Function;
  step: SequenceBodyItem;
}

export interface RemoveParams {
  index: number;
  dispatch: Function;
}

export interface UpdateStepParams {
  dispatch: Function;
  step: CeleryNode;
  index: number;
  field: string;
}

export interface IStepInput {
  step: CeleryNode;
  field: LegalArgString;
  dispatch: Function;
  index: number;
}

export interface StepParams {
  dispatch: Function;
  step: SequenceBodyItem;
  index: number;
  current: Sequence;
  all: Sequence[];
  tools: ToolsState;
}

export type StepTile = (input: StepParams) => JSX.Element;

export interface StepDictionary {
  [stepName: string]: StepTile;
};

export interface StepTitleBarProps {
  step: SequenceBodyItem;
  index: number;
  dispatch: Function;
}

export interface EditCurrentSequence {
  name?: string;
  color?: Color;
};

export interface PushStep {
  type: "PUSH_STEP";
  payload: {
    step: CeleryNode;
  };
}

export interface SpliceStepPayl {
  insertBefore: number;
  step: CeleryNode;
}

export interface MoveStepPayl {
  step: CeleryNode;
  from: number;
  to: number;
}

export type CHANGE_STEP = "CHANGE_STEP";

export interface ChangeStep {
  type: CHANGE_STEP;
  payload: {
    step: CeleryNode;
    index: number;
  };
}

export type CHANGE_STEP_SELECT = "CHANGE_STEP_SELECT" | "UPDATE_SUB_SEQUENCE";

export interface ChangeStepSelect {
  type: CHANGE_STEP_SELECT;
  payload: {
    value: number | string;
    index: number;
    field: string;
    type?: string;
  };
}

export interface SelectPayl {
  value: number | string;
  index: number;
  field: string;
  type?: string;
}

export interface RemoveStep {
  type: "REMOVE_STEP";
  payload: {
    index: number;
  };
};

export interface SaveSequenceOk {
  type: string;
  payload: Sequence;
}

export interface SelectSequence {
  type: "SELECT_SEQUENCE";
  payload: number;
};

export interface SequenceApiResponse {
  sequence?: string;
}

export type DataXferObj = StepMoveDataXfer | StepSpliceDataXfer;

export type dispatcher = (a: Function | { type: string }) => DataXferObj;

export interface EditorProps {
  current: Sequence
  all: Sequence[];
  dispatch: Function;
  tools: Tool[];
}
