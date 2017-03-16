import { generateReducer } from "./redux/generate_reducer";
import { Dictionary } from "farmbot/dist";
import { Sequence } from "./sequences/interfaces";
import { Regimen } from "./regimens/interfaces";
import { Sync } from "./interfaces";

interface IndexedResource<Resource> {
  all: number[];
  byId: Dictionary<Resource | undefined>;
}

export interface RestResources {
  sequences: IndexedResource<Sequence>;
  regimens: IndexedResource<Regimen>;
};

let initialState: RestResources = {
  sequences: { all: [], byId: {} },
  regimens: { all: [], byId: {} }
  /** Tells the ui when the sync object has completed. */
}

/** Responsible for all RESTful resources. */
export let resourceReducer = generateReducer<RestResources>(initialState)
  .add<Sync>("FETCH_SYNC_OK", function (state, action) {
    let { sequences } = action.payload;

    state.sequences = {
      all: _.pluck(sequences, "id"),
      byId: _.indexBy(sequences, "id")
    }

    return state;
  });
