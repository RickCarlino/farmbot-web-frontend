import { Sequence } from "../sequences/interfaces";
import { Tool, ToolSlot, ToolBay } from "../tools/interfaces";
import { Regimen } from "../regimens/interfaces";
import { Plant, FarmEvent, Point, Crop } from "../farm_designer/interfaces";
import { Image } from "../images/index";
import { Log } from "../interfaces";
import { Peripheral } from "../controls/peripherals/interfaces";
import { User } from "../auth/interfaces";
import { assertUuid } from "./selectors";
import { DeviceAccountSettings } from "../devices/interfaces";

export type ResourceName =
  | "device"
  | "farm_events"
  | "images"
  | "logs"
  | "peripherals"
  | "plants"
  | "crops"
  | "points"
  | "regimens"
  | "sequences"
  | "tool_bays"
  | "tool_slots"
  | "tools"
  | "users";

export interface TaggedResourceBase {
  kind: ResourceName;
  /** Unique identifier and index key.
   * We can't use the object's `id` attribute as a local index key because
   * unsaved objects don't have one.
   */
  uuid: string;
  body: object;
  dirty?: boolean | undefined;
  saving?: boolean | undefined;
}

export interface Resource<T extends ResourceName, U extends object>
  extends TaggedResourceBase {
  kind: T;
  body: U;
}

export type TaggedResource =
  | TaggedDevice
  | TaggedFarmEvent
  | TaggedImage
  | TaggedLog
  | TaggedPeripheral
  | TaggedPlant
  | TaggedCrop
  | TaggedPoint
  | TaggedRegimen
  | TaggedSequence
  | TaggedTool
  | TaggedToolBay
  | TaggedToolSlot
  | TaggedUser;

export type TaggedRegimen = Resource<"regimens", Regimen>;
export type TaggedTool = Resource<"tools", Tool>;
export type TaggedToolSlot = Resource<"tool_slots", ToolSlot>;
export type TaggedSequence = Resource<"sequences", Sequence>;
export type TaggedPlant = Resource<"plants", Plant>;
export type TaggedCrop = Resource<"crops", Crop>;
export type TaggedFarmEvent = Resource<"farm_events", FarmEvent>;
export type TaggedImage = Resource<"images", Image>;
export type TaggedLog = Resource<"logs", Log>;
export type TaggedPeripheral = Resource<"peripherals", Peripheral>;
export type TaggedPoint = Resource<"points", Point>;
export type TaggedToolBay = Resource<"tool_bays", ToolBay>;
export type TaggedUser = Resource<"users", User>;
export type TaggedDevice = Resource<"device", DeviceAccountSettings>;

/** Spot check to be certain a TaggedResource is what it says it is. */
export function sanityCheck(x: object) {
  if (isTaggedResource(x)) {
    assertUuid(x.kind, x.uuid);
    return true;
  } else {
    throw new Error("Bad kind, uuid, or body: " + JSON.stringify(x));
  }
}

export function isTaggedResource(x: object): x is TaggedResource {
  return (_.isObject(x)
    && _.isString(_.get(x, "kind"))
    && _.isString(_.get(x, "uuid"))
    && _.isObject(_.get(x, "body")))
}

let is = (r: ResourceName) => function isOfTag(x: object) {
  let safe = (sanityCheck(x) && isTaggedResource(x) && x.kind == r);
  if (!safe) {
    if (x) {
      throw new Error("Possible bad index");
    }
  }
  return safe;
};

export let isTaggedRegimen =
  (x: object): x is TaggedRegimen => is("regimens")(x);
export let isTaggedSequence =
  (x: object): x is TaggedSequence => is("sequences")(x);
export let isTaggedTool =
  (x: object): x is TaggedTool => is("tools")(x);
export let isTaggedToolSlot =
  (x: object): x is TaggedToolSlot => is("tool_slots")(x);
export let isTaggedToolBay =
  (x: object): x is TaggedToolBay => is("tool_bays")(x);
export let isTaggedPlant =
  (x: object): x is TaggedPlant => is("plants")(x);
export let isTaggedCrop =
  (x: object): x is TaggedCrop => is("crops")(x);
export let isTaggedPoint =
  (x: object): x is TaggedPoint => is("points")(x);
export let isTaggedFarmEvent =
  (x: object): x is TaggedFarmEvent => is("farm_events")(x);
export let isTaggedLog =
  (x: object): x is TaggedLog => is("logs")(x);
