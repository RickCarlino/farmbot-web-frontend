import * as React from "react";
import { t } from "i18next";
import { devices } from "../../device";
import { Axis, Xyz } from "../interfaces";
import { McuParams } from "farmbot/dist";
import { LockableButton } from "./lockable_button";

function calibrate(axis: Axis) {
  devices
    .current
    .calibrate({ axis });
}


interface CalibrationRowProps {
  hardware: McuParams;
}

export function CalibrationRow(input: CalibrationRowProps) {
  let h = input.hardware
    , rows: [Xyz, boolean][] = [
      ["x", !(h.encoder_enabled_x || h.movement_enable_endpoints_x)],
      ["y", !(h.encoder_enabled_y || h.movement_enable_endpoints_y)],
      ["z", !(h.encoder_enabled_z || h.movement_enable_endpoints_z)]
    ];
  return <tr>
    <td>
      <label>{t("CALIBRATION")}</label>
    </td>
    {rows.map((row) => {
      let [axis, disable] = row;
      return <td key={axis}>
        <LockableButton disabled={disable} onClick={() => calibrate(axis)}>
          {t("CALIBRATE {{axis}}", { axis })}
        </LockableButton>
      </td>
    })}
  </tr>;
}
