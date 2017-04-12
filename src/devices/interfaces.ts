import {
  BotStateTree,
  Configuration,
  McuParams
} from "farmbot";
import { ALLOWED_MESSAGE_TYPES } from "farmbot";
import { AuthState } from "../auth/interfaces";
import { TaggedImage, TaggedPeripheral, TaggedDevice } from "../resources/tagged_resources";
import { RestResources } from "../resources/interfaces";

export interface Props {
  auth: AuthState | undefined;
  bot: BotState;
  deviceAccount: TaggedDevice;
  images: TaggedImage[];
  dispatch: Function;
}

/** How the device is stored in the API side.
 * This is what comes back from the API as JSON.
 */
export interface DeviceAccountSettings {
  id: number;
  name: string;
  webcam_url?: string;
};

/** Meta information about a log message. */
interface Meta {
  type: ALLOWED_MESSAGE_TYPES;
  /** Bot Position X */
  x: number | undefined;
  /** Bot Position Y */
  y: number | undefined;
  /** Bot Position Z */
  z: number | undefined;
}

/** Typescript does not have partial types yet.
 *  When it does, we can pull this out*/
export interface DeviceAccountSettingsUpdate {
  id?: number;
  name?: string;
  uuid?: string;
  webcam_url?: string;
};

export interface BotState {
  /** How many steps to move when the user presses a manual movement arrow */
  stepSize: number;
  /** The current os version on the github release api */
  currentOSVersion?: string;
  /** The current fw version on the github release api */
  currentFWVersion?: string;
  /** Is the bot in sync with the api */
  dirty: boolean;
  /** Holds settings that the user is currently editing, but has not sent */
  settingsBuffer: {
    movement_max_spd_x?: string;
    movement_max_spd_y?: string;
    movement_max_spd_z?: string;
    movement_steps_acc_dec_x?: string;
    movement_steps_acc_dec_y?: string;
    movement_steps_acc_dec_z?: string;
    movement_timeout_x?: string;
    movement_timeout_y?: string;
    movement_timeout_z?: string;
    [name: string]: string | undefined;
  };
  configBuffer: Configuration;
  hardware: HardwareState;
}
export interface BotProp {
  bot: BotState;
}

/** Status registers for the bot's status */
export type HardwareState = BotStateTree;

export interface MqttMessage {
  error?: string | undefined;
  id?: string | undefined;
  result: HardwareState;
}

export interface GithubRelease {
  tag_name: string;
}

export interface ChangeSettingsBuffer {
  key: keyof McuParams;
  val: number;
}

export interface MoveRelProps {
  x: number;
  y: number;
  z: number;
  speed?: number | undefined;
}

export type Xyz = "x" | "y" | "z";
export type Axis = Xyz | "all";

export interface CalibrationButtonProps {
  disabled: boolean;
  axis: Axis;
}

export interface FarmbotOsProps {
  bot: BotState;
  account: TaggedDevice;
  auth: AuthState;
  dispatch: Function;
}

export interface FarmbotOsState {
  cameraStatus: "" | "sending" | "done" | "error";
}

export interface ConfigInputBoxProps {
  bot: BotState;
  setting: string;
  dispatch: Function;
}

export interface McuInputBoxProps {
  bot: BotState;
  setting: string;
  dispatch: Function;
}

export interface EStopButtonProps {
  bot: BotState;
  auth: AuthState | undefined;
}

export interface PeripheralsProps {
  resources: RestResources;
  bot: BotState;
  peripherals: TaggedPeripheral[];
  dispatch: Function;
}

export interface WeedDetectorProps {
  bot: BotState;
  dispatch: Function;
  images: TaggedImage[];
}

export interface HardwareSettingsProps {
  dispatch: Function;
  bot: BotState;
}
