import { generateReducer } from "./redux/generate_reducer";
import { Dictionary } from "farmbot/dist";
import { Sequence } from "./sequences/interfaces";
import { Regimen } from "./regimens/interfaces";

interface Resource<T> {
  all: number[];
  byId: Dictionary<Readonly<T> | undefined>;
}

interface NormalizedRestResources {
  sequences: Resource<Sequence>;
  regimens: Resource<Regimen>;
};

type QuerySelector = <T>(input: Resource<T>, query: any) => Readonly<T>[];
let initialState = {
  sequences: { all: [], byId: {} },
  regimens: { all: [], byId: {} }
}
/**Reducer responsible for all RESTful resources. */
let resourceNormalizer = generateReducer<NormalizedRestResources>(initialState)
/** This is the topmost reducer in the application. If you need to preempt a
 * "normal" reducer this is the place to do it */
