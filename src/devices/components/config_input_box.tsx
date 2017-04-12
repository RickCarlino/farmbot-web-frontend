import * as React from "react";
import { safeStringFetch } from "../../util";
import { changeConfigBuffer } from "../actions";
import { ConfigInputBoxProps } from "../interfaces";

export class ConfigInputBox extends React.Component<ConfigInputBoxProps, {}> {
  primary() {
    let { bot, setting } = this.props;
    return safeStringFetch(bot.configBuffer, setting);
  }

  secondary() {
    let { bot, setting } = this.props;
    return safeStringFetch(bot.hardware.configuration, setting);
  }

  style() {
    return {
      border: (this.primary()) ? "1px solid red" : ""
    };
  }

  change(key: string, dispatch: Function) {
    return function (event: React.FormEvent<HTMLInputElement>) {
      let formInput = event.currentTarget.value;
      dispatch(changeConfigBuffer({ [key]: Number(formInput) }));
    };
  }

  render() {

    return <td>
      <input type="text"
        style={this.style()}
        onChange={this.change(this.props.setting, this.props.dispatch)}
        value={this.primary() || this.secondary() || "---"} />
    </td>;
  }
}
