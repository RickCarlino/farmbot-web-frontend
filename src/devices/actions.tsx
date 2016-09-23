import { Farmbot } from "farmbot";
import { store } from "../store";
import { devices } from "../device";
import { error, warning } from "../logger";
import { Sequence } from "../sequences/interfaces";
import { catchMessage, RPCError } from "./message_catcher";
import { Thunk } from "../interfaces";
import { put } from "axios";
import { DeviceAccountSettings } from "../devices/interfaces";

const ON = 1, OFF = 0, DIGITAL = 0;

export function settingToggle(name: string, bot): Function {
    return function(dispatch: Function): Thenable<void> {
        let currentValue = bot.hardware[name];
        return devices
            .current
            .updateCalibration({ [name]: (currentValue === 0) ? ON : OFF })
            .then(res => { dispatch(settingToggleOk(res)); },
            err => { dispatch(settingToggleErr(err)); });
    };
}

export function settingToggleOk(res) {
    return {
        type: "SETTING_TOGGLE_OK",
        payload: res.result
    };
}

export function settingToggleErr(err) {
    error(__("Refresh browser or restart devices."), __("Error while toggling setting"));
    return {
        type: "SETTING_TOGGLE_ERR",
        payload: {}
    };
}


export function pinToggle(num: number): Function {
    return function(dispatch) {
        let currentValue = store.getState().bot.hardware[`pin${num}`];
        let newPinValue = (currentValue === "on") ? OFF : ON;
        return devices
            .current
            .pinWrite({ pin: num, value1: newPinValue, mode: DIGITAL })
            .then(res => dispatch(pinToggleOk(res)),
            err => dispatch(pinToggleErr(err)));
    };
}

export function pinToggleOk(res) {
    return {
        type: "PIN_TOGGLE_OK",
        payload: res.result
    };
}

export function pinToggleErr(err) {
    error(__("Refresh browser or restart devices."), __("Error while toggling pin"));
}

export function changeStepSize(integer) {
    return {
        type: "CHANGE_STEP_SIZE",
        payload: integer
    };
}

export function changeAxisBuffer(key, val) {
    return {
        type: "CHANGE_AXIS_BUFFER",
        payload: { key, val }
    };
}

export function changeSettingsBuffer(key, val) {
    return {
        type: "CHANGE_SETTINGS_BUFFER",
        payload: { key, val }
    };
}

export function commitSettingsChanges() {
    let { settingsBuffer, hardware } = store.getState().bot;
    let packet = _({})
        .assign(hardware)
        .assign(settingsBuffer)
        .value();
    let promise = devices.current.updateCalibration(packet);
    return function(dispatch): Thenable<void> {
        return promise.then(
            (resp) => dispatch(commitSettingsChangesOk(resp)),
            (err) => dispatch(commitSettingsChangesErr(err)));
    };
}

function commitSettingsChangesOk(resp) {
    return {
        type: "COMMIT_SETTINGS_OK",
        payload: {}
    };
}

function commitSettingsChangesErr(err) {
    error(__("Unable to commit settings changes."));
}

export function commitAxisChanges() {
    let {axisBuffer, hardware} = store.getState().bot;
    let packet = _({})
        .assign(hardware)
        .assign(axisBuffer)
        .assign({ speed: devices.current.getState("speed") })
        .pick("x", "y", "z", "speed")
        .transform((a, b, c: string) => a[c] = Number(b), {})
        .value();
    return function (dispatch) {
        return devices
            .current
            .moveAbsolute(packet)
            .then((resp) => dispatch(commitAxisChangesOk(resp)),
            (err) => dispatch(commitAxisChangesErr(err)));
    };
}

function commitAxisChangesErr(err) {
    return {
        type: "COMMIT_AXIS_CHANGE_ERR",
        payload: err
    };
}

function commitAxisChangesOk(resp) {
    return {
        type: "COMMIT_AXIS_CHANGE_OK",
        payload: resp.result
    };
}

export function readStatus() {
    return function (dispatch) {
        return devices
            .current
            .readStatus()
            .then((resp) => dispatch(readStatusOk(resp)),
            (errr) => dispatch(readStatusErr(errr)));
    };
}

function readStatusOk(status) {
    return {
        type: "READ_STATUS_OK",
        payload: status.result
    };
}

function readStatusErr(msg) {
    error(__("Did you configure your bot? Is it online?"), __("Can't read status"));
    return {
        type: "READ_STATUS_ERR",
        payload: msg
    };
}

// I wish TS had subset types.
export function changeDevice(newAttrs: any) {
    return {
        type: "CHANGE_DEVICE",
        payload: newAttrs
    };
}

export function connectDevice(token: string): {} | ((dispatch: any) => any) {
    return (dispatch) => {
        let bot = new Farmbot({ token });
        return bot
            .connect()
            .then(() => {
                devices.current = bot;
                dispatch(readStatus());
                bot.on("*", function (message: any) {
                    let when = catchMessage(message);
                    when({
                        response: (r) => dispatch(botChange(r.result)),
                        error: (r) => dispatch(botError(r.error)),
                        notification: (r) => dispatch(botNotification(r.result)),
                        _: (r) => dispatch(unknownMessage(r))
                    });
                });
            }, (err) => dispatch(fetchDeviceErr(err)));
    };
};

export function sendCommand(payload) {
    let method = devices.current[payload.name];
    let result = method.call(devices.current, payload);
    return (dispatch) => {
        return result.then((res) => sendCommandOk(res, payload, dispatch),
            (e) => sendCommandErr(e, payload, dispatch));
    };
}

function sendCommandOk(res, payload, dispatch) {
    dispatch({ type: "COMMAND_OK", payload: res });
}

function sendCommandErr(e, payload, dispatch) {
    let msg = (payload.name || "Command") + " request failed.";
    error(msg, "Farmbot Didn't Get That!");
}

export function addDevice(deviceAttrs): Thunk {

    return (dispatch, getState) => {
        updateDevice(getState().auth.iss, deviceAttrs, dispatch);
    };
}

function botChange(statusMessage) {
    return {
        type: "BOT_CHANGE",
        payload: statusMessage
    };
}

function botError(statusMessage: RPCError) {
    error(statusMessage.error);
    return {
        type: "BOT_ERROR",
        payload: statusMessage
    };
}

function botNotification(statusMessage) {
    return {
        type: "BOT_NOTIFICATION",
        payload: statusMessage
    };
}

function unknownMessage(statusMessage: any) {
    warning("FarmBot sent an unknown message. See log for details.",
        "Malformed Message");
    console.dir(statusMessage);
    return {
        type: "UNKNOWN_MESSAGE",
        payload: statusMessage
    };
}

function fetchDeviceErr(err: Error) {
    return {
        type: "FETCH_DEVICE_ERR",
        payload: err
    };
}

export function execSequence(sequence: Sequence) {
    return (dispatch: Function) => {
        dispatch({ type: "EXEC_SEQUENCE_START", payload: sequence });
        return devices
            .current
            .execSequence(sequence)
            .then(
            (payload) => { dispatch({ type: "EXEC_SEQUENCE_OK", payload }); },
            (e: string) => {
                // This needs to be fixed. FarmbotJS timer deferred promises
                // should be returning type Error, never string!
                console.dir(e);
                dispatch(botError({
                    error: "Unable to execute sequence. See log for details.",
                    method: "TODO: Fix Farmbotjs timer defer rejection"
                }));
            });
    };
};

export let saveAccountChanges: Thunk = function(dispatch, getState) {
    let state = getState();
    let bot = getState().bot.account;
    let url = state.auth.iss;
    return updateDevice(url, bot, dispatch);
};

interface UpdateDeviceParams {
  id?: number;
  name?: string;
  uuid?: string;
  webcam_url?: string;
}

export function updateDevice(apiUrl, optns, dispatch) {
    return put<DeviceAccountSettings>(apiUrl + "/api/device", optns)
             .then(res => dispatch({ type: "REPLACE_DEVICE_ACCOUNT_INFO", payload: res.data }))
             .catch((payload) => dispatch({ type: "DEVICE_ACCOUNT_ERR", payload }));
;
}
