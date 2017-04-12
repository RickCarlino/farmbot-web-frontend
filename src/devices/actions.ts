import { Farmbot } from "farmbot";
import { devices } from "../device";
import { error, success, warning } from "../ui";
import { Everything, Log } from "../interfaces";
import {
  GithubRelease, ChangeSettingsBuffer, MoveRelProps
} from "./interfaces";
import { ReduxAction, Thunk, GetState } from "../redux/interfaces";
import { get } from "axios";
import {
  DeviceAccountSettings,
  BotState
} from "../devices/interfaces";
import { t } from "i18next";
import { McuParams, Configuration, BotStateTree, ALLOWED_PACKAGES } from "farmbot";
import { Sequence } from "../sequences/interfaces";
import * as _ from "lodash";
import { HardwareState } from "../devices/interfaces";
import { API } from "../api/index";
import { User } from "../auth/interfaces";
import * as Axios from "axios";
import { init, edit } from "../api/crud";
import { getDeviceAccountSettings } from "../resources/selectors";
import { TaggedDevice } from "../resources/tagged_resources";
import { versionOK } from "./reducer";
import { oneOf } from "../util";

const ON = 1, OFF = 0;
type configKey = keyof McuParams;

function incomingStatus(statusMessage: HardwareState) {
  return { type: "BOT_CHANGE", payload: statusMessage };
}

function isLog(x: any): x is Log {
  return _.isObject(x) && _.isString(x.message);
}

export function updateConfig(config: Configuration) {
  let noun = "Update Config";
  devices
    .current
    .updateConfig(config)
    .then(() => { commandOK(noun); })
    .catch(() => { commandErr(noun); });
}

export function checkControllerUpdates() {
  let noun = "Check for Updates";
  devices
    .current
    .checkUpdates()
    .then(commandOK(noun), commandErr(noun));
}

export function powerOff() {
  let noun = "Power Off Bot";
  devices
    .current
    .powerOff()
    .then(commandOK(noun), commandErr(noun));
}

export function factoryReset() {
  if (!confirm("WAIT! This will erase EVERYTHING stored on your device SD card. Are you sure?")) {
    return;
  }
  let noun = "Factory reset";
  devices
    .current
    .factoryReset()
    .then(commandOK(noun), commandErr(noun));
}

export function reboot() {
  let noun = "Reboot Bot";
  devices
    .current
    .reboot()
    .then(commandOK(noun), commandErr(noun));
}

export function checkArduinoUpdates() {
  let noun = "Check Firmware Updates";
  devices
    .current
    .checkArduinoUpdates()
    .then(commandOK(noun), commandErr(noun));
}

export function emergencyLock() {
  let noun = "Emergency stop";
  devices
    .current
    .emergencyLock()
    .then(commandOK(noun), commandErr(noun));
}

export function emergencyUnlock() {
  let noun = "Emergency unlock";
  if (confirm("Are you sure you want to unlock the device?")) {
    devices
      .current
      .reboot()
      .then(commandOK(noun), commandErr(noun));
  }
}

export function sync(): Thunk {
  let noun = "Sync";
  return function (dispatch, getState) {
    devices
      .current
      .sync()
      .then(() => {
        commandOK(noun);
        dispatch({ type: "BOT_SYNC_OK", payload: {} });
      }).catch(() => {
        commandErr(noun);
      });
  };
}

export function execSequence(sequence: Sequence) {
  const noun = "Sequence execution";
  if (sequence.id) {
    return devices
      .current
      .execSequence(sequence.id)
      .then(commandOK(noun), commandErr(noun));
  } else {
    throw new Error("Can't execute unsaved sequences");
  }
}

export let saveAccountChanges: Thunk = function (dispatch, getState) {
  return save(getDeviceAccountSettings(getState().resources.index));
};

let commandErr = (noun = "Command") => () => {
  let msg = noun + " request failed.";
  error(msg, t("Farmbot Didn't Get That!"));
};

let commandOK = (noun = "Command") => () => {
  let msg = noun + " request sent to device.";
  success(msg, t("Request sent"));
};

export function fetchOSUpdateInfo(url: string): Thunk {
  return (dispatch: Function, getState: Function) => {
    get<GithubRelease>(url)
      .then((resp) => {
        let version = resp.data.tag_name;
        let versionWithoutV = version.slice(1, version.length);
        dispatch({
          type: "FETCH_OS_UPDATE_INFO_OK",
          payload: versionWithoutV
        });
      })
      .catch((ferror) => {
        error(t("Could not download OS update information."));
        dispatch({
          type: "FETCH_OS_UPDATE_INFO_ERROR",
          payload: ferror
        });
      });
  };
}

export function fetchFWUpdateInfo(url: string) {
  return (dispatch: Function, getState: Function) => {
    get<GithubRelease>(url)
      .then((resp) => {
        let version = resp.data.tag_name;
        let versionWithoutV = version.slice(1, version.length);
        dispatch({
          type: "FETCH_FW_UPDATE_INFO_OK",
          payload: versionWithoutV
        });
      })
      .catch((ferror) => {
        error(t("Could not download firmware update information."));
        dispatch({
          type: "FETCH_FW_UPDATE_INFO_ERROR",
          payload: ferror
        });
      });
  };
}

export function save(input: Partial<DeviceAccountSettings>) {
  return function (dispatch: Function, getState: GetState) {
    return Axios
      .put<User>(API.current.devicePath, input)
      .then(resp => dispatch({ type: "SAVE_DEVICE_OK", payload: resp.data }))
      .catch(resp => error("Error saving device settings."))
  }
}

export function changeDevice(device: TaggedDevice,
  update: Partial<DeviceAccountSettings>) {
  return edit(device, update);
}
export function botIsOnline() {
  return !(devices && devices.current && devices.current.client);
}
export function MCUFactoryReset(pkg: ALLOWED_PACKAGES = "arduino_firmware") {
  const noun = "MCU Factory Reset";
  return devices
    .current
    .factoryReset(pkg)
    .then(commandOK(noun), commandErr(noun));
}

export function botConfigChange(key: configKey, value: number) {
  const noun = "Setting toggle";
  return devices
    .current
    .updateMcu({ [key]: value })
    .then(commandOK(noun), commandErr(noun));
};

export function settingToggle(name: configKey, bot: BotState) {
  const noun = "Setting toggle";
  return devices
    .current
    .updateMcu({
      [name]: ((bot.hardware.mcu_params)[name] === 0) ? ON : OFF
    })
    .then(commandOK(noun), commandErr(noun));
};

export function moveRelative(props: MoveRelProps) {
  const noun = "Relative movement";
  return devices
    .current
    .moveRelative(props)
    .then(commandOK(noun), commandErr(noun));
}

export function moveAbs(props: MoveRelProps) {
  const noun = "Absolute movement";
  return devices
    .current
    .moveAbsolute(props)
    .then(commandOK(noun), commandErr(noun));
}

export function pinToggle(pin_number: number) {
  const noun = "Setting toggle";
  return devices
    .current
    .togglePin({ pin_number })
    .then(commandOK(noun), commandErr(noun));
}

export function homeAll(speed: number) {
  let noun = "'Home All' command";
  devices
    .current
    .home({ axis: "all", speed })
    .then(commandOK(noun), commandErr(noun));
}

function readStatus() {
  let noun = "'Read Status' command";
  return devices
    .current
    .readStatus()
    .then(() => {
      commandOK(noun);
    })
    .catch(function () {
      warning(t("Could not fetch bot status. Is FarmBot online?"));
    });
}

let NEED_VERSION_CHECK = true;
// Already filtering messages in FarmBot OS and the API- this is just for
// an additional layer of safety. If sensitive data ever hits a client, it will
// be reported to ROllbar for investigation.
const BAD_WORDS = ["WPA", "PSK", "PASSWORD", "NERVES"];
export function connectDevice(token: string): {} | ((dispatch: Function) => any) {
  return (dispatch: Function, getState: GetState) => {
    let bot = new Farmbot({ token });
    return bot
      .connect()
      .then(() => {
        devices.online = true;
        devices.current = bot;
        (window as any)["current_bot"] = bot;
        bot.setUserEnv({ "LAST_CLIENT_CONNECTED": JSON.stringify(new Date()) });
        readStatus();
        bot.on("logs", function (msg: Log) {
          if (isLog(msg) && !oneOf(BAD_WORDS, msg.message.toUpperCase())) {
            dispatch(init({ kind: "logs", uuid: "MUST_CHANGE", body: msg }));
          } else {
            throw new Error("Refusing to display log: " + JSON.stringify(msg));
          }
        });
        bot.on("status", function (msg: BotStateTree) {
          dispatch(incomingStatus(msg));
          if (NEED_VERSION_CHECK) {
            let IS_OK = versionOK(getState().bot.hardware.informational_settings.controller_version, 3, 1);
            if (!IS_OK) {
              error("You are running an old version of FarmBot OS. Please update.")
            }
            NEED_VERSION_CHECK = false;
          }

        });

        let alreadyToldYou = false;
        bot.on("malformed", function () {
          if (!alreadyToldYou) {
            warning(t("FarmBot sent a malformed message. " +
              "You may need to upgrade FarmBot OS. " +
              "Please upgrade FarmBot OS and log back in."));
            alreadyToldYou = true;
          }
        });
      }, (err) => dispatch(fetchDeviceErr(err)));
  };
};

function fetchDeviceErr(err: Error) {
  return {
    type: "FETCH_DEVICE_ERR",
    payload: err
  };
}

export function changeSettingsBuffer(key: configKey, val: string):
  ReduxAction<ChangeSettingsBuffer> {
  return {
    type: "CHANGE_SETTINGS_BUFFER",
    payload: { key, val: parseInt(val, 10) }
  };
}

export function changeConfigBuffer(config: Configuration):
  ReduxAction<Configuration> {
  return {
    type: "CHANGE_CONFIG_BUFFER",
    payload: config
  };
}

export function changeStepSize(integer: number) {
  return {
    type: "CHANGE_STEP_SIZE",
    payload: integer
  };
}

export function commitSettingsChanges() {
  return function (dispatch: Function,
    getState: () => Everything) {
    let { settingsBuffer, configBuffer, hardware } = getState().bot;
    let mcuPacket = _({})
      .assign(hardware.mcu_params)
      .assign(settingsBuffer)
      .value();
    let configPacket = _({})
      .assign(hardware.configuration)
      .assign(configBuffer)
      .value();
    Promise.all([
      devices.current.updateMcu(mcuPacket),
      devices.current.updateConfig(configPacket)
    ]).then(() => {
      dispatch(commitSettingsChangesOk());
    }).catch(() => {
      commandErr("Commit Settings Change");
    });
  };
}

function commitSettingsChangesOk() {
  return {
    type: "COMMIT_SETTINGS_OK",
    payload: {}
  };
}
