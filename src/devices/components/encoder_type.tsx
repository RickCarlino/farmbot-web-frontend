import * as React from "react";
import { McuParams, Encoder, McuParamName } from "farmbot/dist";
import { t } from "i18next";
import { NewFBSelect } from "../../ui/new_fb_select";
import { DropDownItem } from "../../ui/fb_select";

interface EncoderTypeProps {
  hardware: McuParams;
  onChange(key: McuParamName, value: Encoder): void;
}

const LOOKUP: { [name: string]: DropDownItem } = {
  [Encoder.differential]: { label: "differential", value: Encoder.differential },
  [Encoder.quadrature]: { label: "quadrature", value: Encoder.quadrature },
  DEFAULT: { label: "---", value: Encoder.unknown }
}

const OPTIONS = [LOOKUP[Encoder.differential], LOOKUP[Encoder.quadrature]];

const KEYS: McuParamName[] = [
  "encoder_type_x",
  "encoder_type_y",
  "encoder_type_z"
];

function isEncoderValue(x: any): x is Encoder { return !!Encoder[x]; }

function findByType(input: number | string | undefined) {
  return LOOKUP[input || "DEFAULT"] || LOOKUP.DEFAULT;
}

export function EncoderType(props: EncoderTypeProps) {
  let { hardware } = props;
  let handleChange = (key: McuParamName) => (d: DropDownItem) => {
    let val = d.value;
    if (isEncoderValue(val)) {
      props.onChange(key, val);
    } else {
      throw new Error("Got bad encoder type in device panel.");
    }
  }
  return <tr>
    <td>
      <label>{t("DIFFERENTIAL ENCODERS*")}</label>
    </td>
    {KEYS.map(function (key, inx) {
      return <td key={inx}>
        <NewFBSelect selectedItem={findByType(hardware.encoder_type_z)}
          list={OPTIONS}
          onChange={handleChange(key)} />
      </td>;
    })}
  </tr>;
}
