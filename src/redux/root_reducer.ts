import { authReducer as auth } from "../auth/reducer";
import { sequenceReducer as sequences } from "../sequences/reducer";
import { botReducer as bot } from "../devices/reducer";
import {
  peripheralReducer as
    peripherals
} from "../controls/peripherals/reducer";
import { configReducer as config } from "../config/reducer";
import { regimensReducer as regimens } from "../regimens/reducer";
import { draggableReducer as draggable } from "../draggable/reducer";
import { toolsReducer as tools } from "../tools/reducer";
import { syncReducer as sync } from "../sync/reducer";
import { designer } from "../farm_designer/reducer";
import {
  BulkSchedulerReducer as bulkScheduler
} from "../regimens/bulk_scheduler/reducer";
import { combineReducers } from "redux";
import { ReduxAction } from "./interfaces";
import { Session } from "../session";
import { resourceReducer as resources } from "../resource_reducer"

let reducers = combineReducers({
  auth,
  bot,
  sequences,
  regimens,
  bulkScheduler,
  config,
  designer,
  draggable,
  peripherals,
  tools,
  resources,
  sync
});

/** This is the topmost reducer in the application. If you need to preempt a
 * "normal" reducer this is the place to do it */
export function rootReducer(
  /** Sorry for the `any` here. */
  state: {} | any,
  action: ReduxAction<{}>) {
  if (action.type === "LOGOUT") { Session.clear(true); }
  return reducers(state, action);
};
