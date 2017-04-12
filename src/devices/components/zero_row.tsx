import * as React from "react";
import { t } from "i18next";
import { devices } from "../../device";
import { Axis } from "../interfaces";
import { McuParams } from "farmbot/dist";

const zero = (axis: Axis) => devices.current.setZero(axis);
const AXISES: Axis[] = ["x", "y", "z"];

export function ZeroButton({ axis }: { axis: Axis }) {
  return <button className="yellow" onClick={() => zero(axis)}>
    {t("zero {{axis}}", { axis })}
  </button>;
};

export function ZeroRow() {
  return <tr>
    <td>
      <label>{t("SET ZERO POSITION")}</label>
    </td>
    {AXISES.map((axis) => {
      return <td key={axis}>
        <ZeroButton axis={axis} />
      </td>
    })}
  </tr>;
}
