import * as React from "react";
import { t } from "i18next";
import { devices } from "../../device";
import { CalibrationButtonProps, Axis, Xyz } from "../interfaces";
import { Farmbot, McuParams } from "farmbot/dist";
import { LockableButton } from "./lockable_button";

const speed = Farmbot.defaults.speed;
let home = (axis: Axis) => devices.current.home({ speed, axis });

export function HomingButton({ axis }: CalibrationButtonProps) {
  return <button className="yellow" onClick={() => home(axis)}>
    {t("HOME {{axis}}", { axis })}
  </button>;
};

interface HomingRowProps {
  hardware: McuParams;
}

export function HomingRow({ hardware }: HomingRowProps) {
  let h = hardware
    , rows: [Xyz, boolean][] = [
      ["x", !(h.encoder_enabled_x || h.movement_enable_endpoints_x)],
      ["y", !(h.encoder_enabled_y || h.movement_enable_endpoints_y)],
      ["z", !(h.encoder_enabled_z || h.movement_enable_endpoints_z)]
    ];
  return <tr>
    <td>
      <label>{t("HOMING")}</label>
    </td>
    {rows.map((row) => {
      let [axis, disable] = row;
      return <td key={axis}>
        <LockableButton disabled={disable} onClick={() => home(axis)}>
          {t("HOME {{axis}}", { axis })}
        </LockableButton>
      </td>
    })}
  </tr>;
}
