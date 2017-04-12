import { ResourceIndex } from "./interfaces";
import { joinKindAndId } from "./reducer";
import {
  ResourceName,
  TaggedFarmEvent,
  TaggedResource,
  TaggedPoint,
  TaggedPlant,
  TaggedTool,
  TaggedToolSlot,
  TaggedImage,
  TaggedRegimen,
  TaggedSequence,
  isTaggedSequence,
  isTaggedRegimen,
  TaggedToolBay,
  isTaggedTool,
  isTaggedToolSlot,
  isTaggedResource,
  sanityCheck,
  isTaggedFarmEvent,
  TaggedPeripheral,
  isTaggedPlant,
  TaggedLog,
  TaggedCrop
} from "./tagged_resources";
import { CowardlyDictionary, betterCompact, sortResourcesById } from "../util";
import { error } from "../ui/logger";

export let findId = (index: ResourceIndex, kind: ResourceName, id: number) => {

  let uuid = index.byKindAndId[joinKindAndId(kind, id)];
  assertUuid(kind, uuid);
  if (uuid) {
    return uuid;
  } else {
    throw new Error("UUID not found for id " + id)
  }
}

export function findResourceById(index: ResourceIndex, kind: ResourceName,
  id: number) {
  return findId(index, kind, id);
}

export let isKind = (name: ResourceName) => (tr: TaggedResource) => tr.kind === name;

function findAll(index: ResourceIndex, name: ResourceName) {
  let results: TaggedResource[] = [];

  index.byKind[name].map(function (uuid) {
    let item = index.references[uuid];
    (item && isTaggedResource(item) && results.push(item));
  })
  return sortResourcesById(results);
}

export function selectAllFarmEvents(index: ResourceIndex) {
  return findAll(index, "farm_events") as TaggedFarmEvent[];
}

export function selectAllPoints(index: ResourceIndex) {
  return findAll(index, "points") as TaggedPoint[];
}

export function selectAllPlants(index: ResourceIndex) {
  return findAll(index, "plants") as TaggedPlant[];
}

export function selectAllTools(index: ResourceIndex) {
  return findAll(index, "tools") as TaggedTool[];
}

export function selectAllToolSlots(index: ResourceIndex) {
  return findAll(index, "tool_slots") as TaggedToolSlot[];
}

export function selectAllPeripherals(index: ResourceIndex) {
  return findAll(index, "peripherals") as TaggedPeripheral[];
}

export function selectAllLogs(index: ResourceIndex) {
  return findAll(index, "logs") as TaggedLog[];
}

interface Finder<T> {
  (i: ResourceIndex, u: string): T;
}
/** Generalized way to stamp out "finder" functions.
 * Pass in a `ResourceName` and it will add all the relevant checks.
 * WARNING: WILL THROW ERRORS IF RESOURCE NOT FOUND!
 */
let find = (r: ResourceName) =>
  function findResource(i: ResourceIndex, u: string) {
    assertUuid(r, u);
    let result = i.references[u];
    if (result && isTaggedResource(result) && sanityCheck(result)) {
      return result as TaggedResource;
    } else {
      error("Resource error");
      throw new Error(`Tagged resource ${r} was not found or malformed: ` +
        JSON.stringify(result));
    }

  }

export let findToolSlot = find("tool_slots") as Finder<TaggedToolSlot>;
export let findTool = find("tools") as Finder<TaggedTool>;
export let findSequence = find("sequences") as Finder<TaggedSequence>;
export let findRegimen = find("regimens") as Finder<TaggedRegimen>;
export let findFarmEvent = find("farm_events") as Finder<TaggedFarmEvent>;

export function selectCurrentToolSlot(index: ResourceIndex, uuid: string) {
  return index.references[uuid];
}

export function selectAllToolBays(index: ResourceIndex) {
  return findAll(index, "tool_bays") as TaggedToolBay[];
}

export function selectAllImages(index: ResourceIndex) {
  return findAll(index, "images") as TaggedImage[];
}

export function selectAllRegimens(index: ResourceIndex) {
  return findAll(index, "regimens") as TaggedRegimen[];
}

export function selectAllCrops(index: ResourceIndex) {
  return findAll(index, "crops") as TaggedCrop[];
}

export function getRegimenByUUID(index: ResourceIndex, uuid: string) {
  assertUuid("regimens", uuid);
  return index.references[uuid];
}
export function getSequenceByUUID(index: ResourceIndex,
  uuid: string): TaggedSequence {
  assertUuid("sequences", uuid);
  let result = index.references[uuid];
  if (result && isTaggedSequence(result)) {
    return result;
  } else {
    throw new Error("BAD Sequence UUID;");
  }
}

export function selectAllSequences(index: ResourceIndex) {
  return findAll(index, "sequences") as TaggedSequence[];
}

export function indexSequenceById(index: ResourceIndex) {
  let output: CowardlyDictionary<TaggedSequence> = {};
  let uuids = index.byKind.sequences;
  uuids.map(uuid => {
    assertUuid("sequences", uuid);
    let sequence = index.references[uuid];
    if (sequence && isTaggedSequence(sequence) && sequence.body.id) {
      output[sequence.body.id] = sequence;
    }
  });
  return output;
}

export function indexRegimenById(index: ResourceIndex) {
  let output: CowardlyDictionary<TaggedRegimen> = {};

  let uuids = index.byKind.regimens;
  uuids.map(uuid => {
    assertUuid("regimens", uuid);
    let regimen = index.references[uuid];
    if (regimen && isTaggedRegimen(regimen) && regimen.body.id) {
      output[regimen.body.id] = regimen;
    }
  });
  return output;
}

export function indexFarmEventById(index: ResourceIndex) {
  let output: CowardlyDictionary<TaggedFarmEvent> = {};

  let uuids = index.byKind.farm_events;
  uuids.map(uuid => {
    assertUuid("farm_events", uuid);
    let farmEvent = index.references[uuid];
    if (farmEvent && isTaggedFarmEvent(farmEvent) && farmEvent.body.id) {
      output[farmEvent.body.id] = farmEvent;
    }
  });
  return output;
}

export function indexByToolId(index: ResourceIndex) {
  let output: CowardlyDictionary<TaggedTool> = {};

  let uuids = index.byKind.tools;
  uuids.map(uuid => {
    assertUuid("tools", uuid);
    let Tool = index.references[uuid];
    if (Tool && isTaggedTool(Tool) && Tool.body.id) {
      output[Tool.body.id] = Tool;
    }
  });
  return output;
}

export function indexBySlotId(index: ResourceIndex) {
  let output: CowardlyDictionary<TaggedToolSlot> = {};

  let uuids = index.byKind.tool_slots;
  uuids.map(uuid => {
    assertUuid("tool_slots", uuid);
    let tool_slot = index.references[uuid];
    if (tool_slot && isTaggedToolSlot(tool_slot) && tool_slot.body.id) {
      output[tool_slot.body.id] = tool_slot;
    }
  });
  return output;
}

/** Concerned about all the run-time stuff going on.
 * Leaving this function here to aid in debugging as we make the switch to
 * tagged_resources
 *   -- RC, 21 MAR 17
 */
export function assertUuid(expected: ResourceName, actual: string | undefined) {
  if (actual && !actual.startsWith(expected)) {
    console.warn(`
    BAD NEWS!!! You thought this was a ${expected} UUID, but here's what it
    actually was:
      ${actual}
    `)
    return false;
  } else {
    return true;
  }
}

export function toArray(index: ResourceIndex) {
  return index.all.map(function (uuid) {
    let tr = index.references[uuid];
    if (tr) {
      return tr;
    } else {
      throw new Error("Fund bad index UUID: " + uuid);
    }
  });
}

/** Search for matching key/value pairs in the body of a resource. */
export function where(index: ResourceIndex,
  body: object): (TaggedResource | undefined)[] {
  return _.where(toArray(index), { body });
}

/** Search for matching key/value pairs in the body of a resource. */
export function findWhere(index: ResourceIndex,
  body: object): TaggedResource | undefined {
  /** TODO: Find a way to add type safety.
   *        currently, this method will accept any old object, which might be
   *        unsafe. */
  return _.findWhere(toArray(index), { body });
}

export function findSlotWhere(index: ResourceIndex, body: object):
  TaggedToolSlot | undefined {
  /** TODO: Find a way to add type safety.
   *        currently, this method will accept any old object, which might be
   *        unsafe. */
  let x = _.findWhere(toArray(index), { kind: "tool_slots", body });
  return (x && isTaggedToolSlot(x)) ? x : undefined;
}

/** GIVEN: a slot UUID.
 *  FINDS: Tool in that slot (if any) */
export let currentToolInSlot = (index: ResourceIndex) =>
  (toolSlotUUID: string): TaggedTool | undefined => {
    let currentSlot = selectCurrentToolSlot(index, toolSlotUUID);
    if (currentSlot && currentSlot.kind === "tool_slots") {
      let toolUUID = index
        .byKindAndId[joinKindAndId("tools", currentSlot.body.tool_id)];
      let tool = index.references[toolUUID || "NOPE!"];
      if (tool && isTaggedTool(tool)) {
        return tool;
      }
    }
  };

/** FINDS: all tagged resources with particular ID */
export function findAllById(i: ResourceIndex, ids: number[], k: ResourceName) {
  let output: TaggedResource[] = [];
  findAll(i, k).map(x => x.kind === k ? output.push(x) : "")
  return output;
}

/** FINDS: All tools that are in use. */
export function toolsInUse(index: ResourceIndex): TaggedTool[] {
  let ids = betterCompact(selectAllToolSlots(index).map(ts => ts.body.tool_id));
  return findAllById(index, ids, "tools") as TaggedTool[];
}

export let byId = <T extends TaggedResource>(name: ResourceName) =>
  (index: ResourceIndex, id: number): T | undefined => {
    let tools = findAll(index, name);
    let f = (x: TaggedResource) => (x.kind === name) && (x.body.id === id)
    // Maybe we should add a throw here?
    return tools.filter(f)[0] as T | undefined;
  }
export function hasId(ri: ResourceIndex, k: ResourceName, id: number): boolean {
  return !!ri.byKindAndId[joinKindAndId(k, id)];
}
export let findFarmEventById = (ri: ResourceIndex, fe_id: number) => {
  let fe = byId("farm_events")(ri, fe_id);
  if (fe && isTaggedFarmEvent(fe) && sanityCheck(fe)) {
    return fe;
  } else {
    let e = new Error(`Bad farm_event id: ${fe_id}`);
    throw e;
  }
};

export let findToolById = (ri: ResourceIndex, tool_id: number) => {
  let tool = byId("tools")(ri, tool_id);
  if (tool && isTaggedTool(tool) && sanityCheck(tool)) {
    return tool;
  } else {
    throw new Error("Bad tool id: " + tool_id);
  }
};

export let findSequenceById = (ri: ResourceIndex, sequence_id: number) => {
  let sequence = byId("sequences")(ri, sequence_id);
  if (sequence && isTaggedSequence(sequence) && sanityCheck(sequence)) {
    return sequence;
  } else {
    throw new Error("Bad sequence id: " + sequence_id);
  }
};


export let findRegimenById = (ri: ResourceIndex, regimen_id: number) => {
  let regimen = byId("regimens")(ri, regimen_id);
  if (regimen && isTaggedRegimen(regimen) && sanityCheck(regimen)) {
    return regimen;
  } else {
    throw new Error("Bad regimen id: " + regimen_id);
  }
};

export let findSlotById = byId<TaggedToolSlot>("tool_slots");
/** Find a Tool's corresponding Slot. */
export let findSlotByToolId = (index: ResourceIndex, tool_id: number) => {
  let tool = findToolById(index, tool_id);
  let filter = (x: TaggedResource) => {
    if (x && isTaggedToolSlot(x)) {
      return x.body.tool_id === tool_id;
    }
  }
  let tts = where(index, { tool_id: tool.body.id }).filter(filter)[0];
  if (tts && isTaggedToolSlot(tts) && sanityCheck(tts)) {
    return tts;
  } else {
    return undefined;
  }
}

export function maybeGetSequence(index: ResourceIndex,
  uuid: string | undefined): TaggedSequence | undefined {
  if (uuid) {
    return getSequenceByUUID(index, uuid);
  } else {
    return undefined;
  }
}

export function maybeGetRegimen(index: ResourceIndex,
  uuid: string | undefined): TaggedRegimen | undefined {
  let tr = uuid && getRegimenByUUID(index, uuid);
  if (tr && isTaggedRegimen(tr)) { return tr; };
}

/** Unlike other findById methods, this one allows undefined (missed) values */
export function maybeFindPlantById(index: ResourceIndex, id: number) {
  let uuid = index.byKindAndId[joinKindAndId("plants", id)];
  let resource = index.references[uuid || "nope"];
  if (resource && isTaggedPlant(resource)) { return resource; }
}

export function getDeviceAccountSettings(index: ResourceIndex) {
  let list = index.byKind.device;
  let uuid = list[0];
  let device = index.references[uuid || -1];
  if ((list.length === 1) && device && device.kind === "device") {
    sanityCheck(device);
    return device;
  } else {
    throw new Error(`
    PROBLEM: Expected getDeviceAccountSettings() to return exactly 1 device.
    We got some other number back, indicating a hazardous condition.`);
  }
}

export function all(index: ResourceIndex) {
  return betterCompact(index.all.map(uuid => index.references[uuid]));
}
