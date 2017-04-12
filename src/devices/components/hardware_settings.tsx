import * as React from "react";
import { CalibrationRow } from "./calibration_button";
import { t } from "i18next";
import { McuInputBox } from "./mcu_input_box";
import { ConfigInputBox } from "./config_input_box";
import { settingToggle, commitSettingsChanges, botConfigChange, MCUFactoryReset } from "../actions";
import { ToggleButton } from "../../controls/toggle_button";
import { Widget, WidgetHeader, WidgetBody } from "../../ui/index";
import { HardwareSettingsProps } from "../interfaces";
import { HomingRow } from "./homing_row";
import { EncoderType } from "./encoder_type";
import { MustBeOnline } from "../must_be_online";
import { ZeroRow } from "./zero_row";

export class HardwareSettings extends React.Component<HardwareSettingsProps, {}> {
  render() {
    let { bot, dispatch } = this.props;
    let { mcu_params } = bot.hardware;
    return <Widget className="hardware-widget">
      <WidgetHeader title="Hardware"
        helpText={`Change settings
                  of your FarmBot hardware with the fields below.
                  Caution: Changing these settings to extreme
                  values can cause hardware malfunction. Make
                  sure to test any new settings before letting
                  your FarmBot use them unsupervised. Tip: Recalibrate
                  FarmBot after changing settings and test a few sequences
                  to verify that everything works as expected. Note:
                  Currently not all settings can be changed.`}>
        <button className="green"
          onClick={() => dispatch(commitSettingsChanges())} >
          {t("SAVE")}
          {Object.keys(bot.settingsBuffer).length ? "*" : ""}
        </button>
      </WidgetHeader>
      <WidgetBody>
        <MustBeOnline fallback="Device is offline.">
          <table className="plain">
            <thead>
              <tr>
                <th width="32%" />
                <th width="22%">
                  <label>{t("X AXIS")}</label>
                </th>
                <th width="22%">
                  <label>{t("Y AXIS")}</label>
                </th>
                <th width="22%">
                  <label>{t("Z AXIS")}</label>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label>{t("Steps per MM")}</label>
                </td>
                <ConfigInputBox setting="steps_per_mm_x"
                  bot={bot}
                  dispatch={dispatch} />
                <ConfigInputBox setting="steps_per_mm_y"
                  bot={bot}
                  dispatch={dispatch} />
                <ConfigInputBox setting="steps_per_mm_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("MAX SPEED (mm/s)")}</label>
                </td>
                <McuInputBox setting="movement_max_spd_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_max_spd_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_max_spd_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("ACCELERATE FOR (steps)")}</label>
                </td>
                <McuInputBox setting="movement_steps_acc_dec_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_steps_acc_dec_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_steps_acc_dec_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("TIMEOUT AFTER (seconds)")}</label>
                </td>
                <McuInputBox setting="movement_timeout_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_timeout_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_timeout_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("LENGTH (m)")}</label>
                </td>
                <McuInputBox setting="movement_axis_nr_steps_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_axis_nr_steps_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_axis_nr_steps_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <CalibrationRow hardware={mcu_params} />
              <HomingRow hardware={mcu_params} />
              <ZeroRow />
              <tr>
                <td>
                  <label>{t("INVERT ENDPOINTS")}</label>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_endpoints_x}
                    toggleAction={() =>
                      settingToggle("movement_invert_endpoints_x",
                        bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_endpoints_y}
                    toggleAction={() =>
                      settingToggle("movement_invert_endpoints_y",
                        bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_endpoints_z}
                    toggleAction={() =>
                      settingToggle("movement_invert_endpoints_z",
                        bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("INVERT MOTORS")}</label>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_motor_x}
                    toggleAction={() => settingToggle("movement_invert_motor_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_motor_y}
                    toggleAction={() => settingToggle("movement_invert_motor_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_motor_z}
                    toggleAction={() => settingToggle("movement_invert_motor_z", bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("ONLY ALLOW NEGATIVES COORDINATES")}</label>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_home_up_x}
                    toggleAction={() => settingToggle("movement_home_up_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_home_up_y}
                    toggleAction={() => settingToggle("movement_home_up_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_home_up_z}
                    toggleAction={() => settingToggle("movement_home_up_z", bot)} />
                </td>
              </tr>

              <tr>
                <td>
                  <label>{t("ENABLE ENDSTOPS")}</label>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_enable_endpoints_x}
                    toggleAction={() => settingToggle("movement_enable_endpoints_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_enable_endpoints_y}
                    toggleAction={() => settingToggle("movement_enable_endpoints_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_enable_endpoints_z}
                    toggleAction={() => settingToggle("movement_enable_endpoints_z", bot)} />
                </td>
              </tr>
              <tr>
                <td colSpan={100}>
                  <small>
                    Firmware level support for rotary encoders is still under development
                </small>
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("ENABLE ENCODERS")}</label>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.encoder_enabled_x}
                    toggleAction={() => settingToggle("encoder_enabled_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.encoder_enabled_y}
                    toggleAction={() => settingToggle("encoder_enabled_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.encoder_enabled_z}
                    toggleAction={() => settingToggle("encoder_enabled_z", bot)} />
                </td>
              </tr>

              <EncoderType hardware={mcu_params}
                onChange={(x, y) => { botConfigChange(x, y) }} />

              <tr>
                <td>
                  <label>{t("ENCODER SCALING*")}</label>
                </td>
                <ConfigInputBox setting={(mcu_params.encoder_scaling_x || 0).toString()}
                  bot={bot}
                  dispatch={dispatch} />
                <ConfigInputBox setting={(mcu_params.encoder_scaling_y || 0).toString()}
                  bot={bot}
                  dispatch={dispatch} />
                <ConfigInputBox setting={(mcu_params.encoder_scaling_z || 0).toString()}
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td colSpan={100}>
                  <small>
                    Second X Motor
                </small>
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("ENABLE MOTOR*")}</label>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_secondary_motor_x}
                    toggleAction={() => settingToggle("movement_secondary_motor_x", bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("INVERT MOTOR*")}</label>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_secondary_motor_invert_x}
                    toggleAction={() => settingToggle("movement_secondary_motor_invert_x",
                      bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>RESET HARDWARE PARAMETER DEFAULTS*</label>
                </td>
                <td>
                  <p>
                    Restoring hardware parameter defaults will destroy the
                  current settings, resetting them to default values.
                  <b>Will reboot device.</b>
                  </p>
                </td>
                <td>
                  <button className="red" onClick={() => MCUFactoryReset()}>
                    {t("RESET")}
                  </button>
                </td>
              </tr>


            </tbody>
          </table>
        </MustBeOnline>
      </WidgetBody>
    </Widget>;
  }
}
