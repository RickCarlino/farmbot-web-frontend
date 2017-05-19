import * as React from "react";
import { McuInputBoxProps } from "../interfaces";
import { updateMCU } from "../actions";
import { BlurableInput } from "../../ui/index";
import { Dictionary } from "farmbot";

let maxValues: Readonly<Dictionary<number>> = {
  "x": 141,
  "y": 142,
  "z": 143
};

export class McuInputBox extends React.Component<McuInputBoxProps, {}> {

  get key() {
    return this.props.setting;
  }

  baseString = (name: string) => {
    return "movement_axis_nr_steps_";
  }

  hasMax = (e: React.SyntheticEvent<HTMLInputElement>) => {
    /** Not a fan of this at all, but right now this is the only input that
    requires a condition. */
    let n = e.currentTarget.name;
    let condition = this.props.setting.includes(this.baseString(n));
    if (condition) { return maxValues[n]; }
  }

  get value() {
    let v = this.props.bot.hardware.mcu_params[this.key];
    return _.isUndefined(v) ? "" : (v || 0).toString();
  }

  commit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.hasMax(e);
    if (this.value !== e.currentTarget.value) {
      this.props.dispatch(updateMCU(this.key, e.currentTarget.value));
    }
  }

  render() {
    return <td>
      <BlurableInput
        type="number"
        value={this.value}
        onCommit={e => this.commit(e)}
      />
    </td>;
  }
}
