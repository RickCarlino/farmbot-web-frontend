import { error, warning } from "../logger";
import * as _ from "lodash";
import { BotState, DeviceAccountSettings, HardwareState } from "./interfaces";
import { generateReducer } from "../generate_reducer";
import { isBotLog } from "./is_bot_log";
import { ReduxAction } from "../interfaces";

let status = {
  NOT_READY: "never connected to device",
  CONNECTING: "initiating connection",
  AWAITING_API: "downloading device credentials",
  API_ERROR: "Unable to download device credentials",
  AWAITING_WEBSOCKET: "calling FarmBot with credentials",
  WEBSOCKET_ERR: "Error establishing socket connection",
  CONNECTED: "Socket Connection Established",
  READY: "Bot ready"
};

let initialState: BotState = {
  account: { id: 0, uuid: "loading...", name: "loading..." },
  logQueueSize: 10,
  logQueue: [],
  status: status.NOT_READY,
  stepSize: 1000,
  hardware: {},
  axisBuffer: {},
  settingsBuffer: {}
};

function READ_STATUS_OK(state: BotState, action: ReduxAction<HardwareState>) {
    let hardware = action.payload;
    delete hardware.method;
    return _.assign<{}, BotState>({},
      state, {
        hardware: hardware
      }, {
        status: status.READY
      });
  };

export let botReducer = generateReducer<BotState>(initialState)
  .add<HardwareState>("SETTING_TOGGLE_OK", function(state, action) {
    return READ_STATUS_OK(state, action);
  })
  .add<any>("COMMIT_SETTINGS_OK", function(state, action) {
    let nextState = _.assign<any, BotState>({}, state, {
      settingsBuffer: {}
    });
    return nextState;
  })
  .add<any>("COMMIT_AXIS_CHANGE_OK", function(oldState, action) {
    let hardware = _.assign({}, oldState.hardware, action.payload);
    let state = _.assign<any, BotState>({}, oldState);

    return _.assign<any, BotState>({}, state, {
      axisBuffer: {},
      hardware
    });
  })
  .add<any>("CHANGE_AXIS_BUFFER", function(state, action) {
    // let axisBuffer: any = _.assign({}, state.axisBuffer);
    state.axisBuffer[action.payload.key] = action.payload.val;

    return _.assign<any, BotState>({}, state, {
      axisBuffer: state.axisBuffer
    });
  })
  .add<any>("CHANGE_SETTINGS_BUFFER", function(state, action) {
    let newVal = Number(action.payload.val);
    if (newVal) {
      state.settingsBuffer[action.payload.key] = action.payload.val;
    } else {
      delete state.settingsBuffer[action.payload.key];
    }
    return _.assign<any, BotState>({}, state, {
      settingsBuffer: state.settingsBuffer
    });
  })
  .add<any>("CHANGE_STEP_SIZE", function(state, action) {
    return _.assign<any, BotState>({}, state, {
      stepSize: action.payload
    });
  })
  .add<HardwareState>("READ_STATUS_OK", READ_STATUS_OK)
  .add<any>("BOT_CHANGE", function(state, action) {
    let statuses: any = _.assign({}, action.payload);
    let newState: any = _.assign({}, state);
    newState.hardware = _.assign({}, state.hardware, statuses);
    return _.assign<any, BotState>({}, newState);
  })
  .add<any>("CONNECT_OK", function(state, action) {
    return _.assign<any, BotState>({},
      state,
      action.payload, {
        status: status.CONNECTED,
        connected: true
      });
  })
  .add<any>("CONNECT_ERR", function(state, action) {
    return _.assign<any, BotState>({},
      state, {
        status: status.WEBSOCKET_ERR
      });
  })
  .add<any>("CHANGE_DEVICE", function(s, a) {
    _.assign(s.account, a.payload, {dirty: true});
    return s;
  })
  .add<any>("FETCH_DEVICE", function(state, action) {
    return state;
  })
  .add<any>("FETCH_DEVICE_OK", function(state, { payload }) {
    return _.assign<any, BotState>({},
      state,
      payload, {
        status: status.AWAITING_WEBSOCKET
      });
  })
  .add<any>("FETCH_DEVICE_ERR", function(state, action) {
    // TODO: Toast messages do not belong in a reducer.
    if (action.payload.status === 404) {
      warning("You need to add a device to your account.",
        "No device found!");
    } else {
      error(__("Unable to download device data from server.") +
        __("Check your internet connection."));
    };
    return _.assign<any, BotState>({},
      state, {
        status: status.API_ERROR
      });
  })
  .add<any>("SAVE_DEVICE_ERR", function(state, action) {
    switch (action.payload.status) {
      case 422:
        let errors = _.map(action.payload.responseJSON, v => v)
          .join(". ");
        error(errors, __("Couldn\'t save device."));
        break;
      default:
        error(__("Error while saving device."));
        break;
    }
    return state;
  })
  .add<any>("SAVE_DEVICE_OK", function(state, action) {
    return _.assign<any, BotState>({}, state, action.payload, {
      dirty: false
    });
  })
  .add<any>("BOT_NOTIFICATION", function(state, { payload }) {
    if (isBotLog(payload)) {
      state.logQueue.unshift(payload);
      state.logQueue = _.take(state.logQueue, state.logQueueSize);
      console.groupCollapsed("Bot Message");
      console.log(payload.data);
      console.groupEnd();
    } else {
      console.warn("Unexpected log message?");
    }
    return state;
  })
  .add<DeviceAccountSettings>("REPLACE_DEVICE_ACCOUNT_INFO", function(s, a) {
    s.account = a.payload;
    return s;
  })
  .add<string>("CHANGE_WEBCAM_URL", function(s, a) {
    s.account.dirty = true;
    s.account.webcam_url = a.payload;
    return s;
  });
