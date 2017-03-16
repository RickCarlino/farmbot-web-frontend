import { AuthState, User } from "./auth/interfaces";
import { ConfigState } from "./config/interfaces";
import { BotState, DeviceAccountSettings } from "./devices/interfaces";
import { BulkSchedulerState } from "./regimens/bulk_scheduler/interfaces";
import {
  RegimensState,
  RegimenItem
} from "./regimens/interfaces";
import { SequenceReducerState, Sequence } from "./sequences/interfaces";
import {
  DesignerState,
  Plant,
  Point,
  FarmEvent
} from "./farm_designer/interfaces";
import { Color as FarmBotJsColor } from "farmbot";
import { DragableState } from "./draggable/interfaces";
import { PeripheralState, Peripheral } from "./controls/peripherals/interfaces";
import { ToolsState, ToolBay, Tool, ToolSlot } from "./tools/interfaces";
import { ImageState, Image } from "./images";
import { Regimen } from "./regimens/interfaces";

/** Regimens and sequences may have a "color" which determines how it looks
    in the UI. Only certain colors are valid. */
export type Color = FarmBotJsColor;

export interface SelectOptionsParams {
  label: string;
  value: string | number | undefined;
  disabled?: boolean;
  field?: string;
  type?: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface Log {
  id: number;
  message: string;
  meta: { type: string; };
  channels: string;
  device_id: number;
  created_at: string;
  updated_at: string;
}

interface Location {
  /** EX: /app/designer */
  pathname: string;
  /** EX: ?id=twowing-silverbell&p1=SpeciesInfo */
  search: string;
  hash: string;
  // /** ¯\_(ツ)_/¯ */
  // state: void;
  /** EX: "PUSH" */
  action: string;
  /** EX:  jhedoi */
  key: string;
  /** URL ?Query=string, converted to JS object. */
  query: { [name: string]: string };
};

export interface Everything {
  config: ConfigState;
  auth: AuthState | undefined;
  designer: DesignerState;
  dispatch: Function;
  bot: BotState;
  sequences: SequenceReducerState;
  regimens: RegimensState;
  bulkScheduler: BulkSchedulerState;
  location: Location;
  draggable: DragableState;
  peripherals: PeripheralState;
  tools: ToolsState;
  sync: Sync;
  images: ImageState;
  router: {
    push(url?: string): void;
  };
};

/** A sync object, as returned by a GET request to `/api/sync` */
export interface Sync {
  /** Tells the ui when the sync object has completed. */
  loaded: boolean;
  /** Git commit hash of the revision that the server is running. */
  api_version: string;
  /** A number that, when incremented, alerts the bot that
   * its software is out of date */
  compat_num: number;
  device: DeviceAccountSettings;
  farm_events: FarmEvent[];
  users: User[];
  sequences: Sequence[];
  regimens: Regimen[];
  peripherals: Peripheral[];
  regimen_items: RegimenItem[];
  plants: Plant[];
  tool_bays: ToolBay[];
  tool_slots: ToolSlot[];
  tools: Tool[];
  logs: Log[];
  images: Image[];
  points: Point[];
}

/** React-select does not provide an interface for their CustomOption
 * component. Since they share similarities, we can go with this one as a base.
 */
export interface CustomOptionProps {
  onSelect: Function;
  onFocus: Function;
  isFocused: Function;
  option: {
    // I will have to refactor this. On the TODO list. -CV
    value?: string;
    x?: number;
    y?: number;
    z?: number;
  };
  className: string;
  children: JSX.Element;
}

/** There were a few cases where we handle errors that are legitimately unknown.
 *  In those cases, we can use the `UnsafeError` type instead of `any`, just to
 *  quiet down the linter and to let others know it is inherently unsafe.
 */
export type UnsafeError = any;
