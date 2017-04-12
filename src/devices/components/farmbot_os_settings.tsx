import * as React from "react";
import { t } from "i18next";
import { FarmbotOsProps, FarmbotOsState } from "../interfaces";
import {
  changeDevice,
  saveAccountChanges,
  reboot,
  powerOff,
  factoryReset
} from "../actions";
import { OsUpdateButton } from "./os_update_button";
import { devices } from "../../device";
import {
  DeprecatedFBSelect,
  DropDownItem,
  Widget,
  WidgetHeader,
  WidgetBody,
  Row,
  Col,
  SaveBtn
} from "../../ui/index";
import { save } from "../../api/crud";

const CAMERA_CHOICES = [
  { label: "USB Camera", value: "USB" },
  { label: "Raspberry Pi Camera", value: "RPI" }
];

export class FarmbotOsSettings extends React.Component<FarmbotOsProps,
  FarmbotOsState> {
  constructor() {
    super();
    this.state = { cameraStatus: "" };
  }

  changeBot = (e: React.MouseEvent<HTMLInputElement>) => {
    let action = changeDevice(this.props.account, { name: e.currentTarget.value });
    this.props.dispatch(action);
  }

  saveBot(e: React.MouseEvent<{}>) {
    e.preventDefault();
    this.props.dispatch(save(this.props.account.uuid));
  }

  updateBot = (e: React.MouseEvent<{}>) => {
    this.props.dispatch(saveAccountChanges);
  }

  sendOffConfig = (e: DropDownItem) => {
    let message = { "camera": JSON.stringify(e.value) };
    this.setState({ cameraStatus: "sending" });
    setTimeout(this.setState({ cameraStatus: "" }), 10000);
    devices
      .current
      .setUserEnv(message)
      .then(() => { this.setState({ cameraStatus: "done" }); })
      .catch(() => { this.setState({ cameraStatus: "error" }); });
  }

  render() {
    let { account } = this.props;
    let isSaving = account && account.saving;
    let isDirty = account && account.dirty;
    let isSaved = !isSaving && !isDirty;

    return <Widget className="device-widget">
      <form onSubmit={this.saveBot.bind(this)}>
        <WidgetHeader title="Device"
          helpText={`This widget shows device information.`}>
          <SaveBtn
            isDirty={isDirty}
            isSaving={isSaving}
            isSaved={isSaved}
            onClick={this.updateBot}
          />
        </WidgetHeader>
        <WidgetBody>
          <Row>
            <Col xs={2}>
              <label>
                {t("NAME")}
              </label>
            </Col>
            <Col xs={10}>
              <input name="name"
                onChange={this.changeBot}
                value={this.props.account.body.name} />
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <label>{t("NETWORK")}</label>
            </Col>
            <Col xs={10}>
              <p>{`mqtt://${this.props.auth.token.unencoded.mqtt}`}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <label>{t("FARMBOT OS")}</label>
            </Col>
            <Col xs={3}>
              <p>
                {t("Version")}
                {this
                  .props
                  .bot
                  .hardware
                  .informational_settings.controller_version
                  || t(" unknown (offline)")}
              </p>
            </Col>
            <Col xs={7}>
              <OsUpdateButton bot={this.props.bot} />
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <label>{t("RESTART FARMBOT")} </label>
            </Col>
            <Col xs={7}>
              <p>
                {t(`This will restart FarmBot's Raspberry
                    Pi and controller software.`)}
              </p>
            </Col>
            <Col xs={3}>
              <button className="yellow" onClick={reboot}>
                {t("RESTART")}
              </button>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <label>{t("SHUTDOWN FARMBOT")}</label>
            </Col>
            <Col xs={7}>
              <p>
                {t(`This will shutdown FarmBot's Raspberry Pi. To turn it
                    back on, unplug FarmBot and plug it back in.`)}
              </p>
            </Col>
            <Col xs={3}>
              <button className="red" onClick={powerOff}>
                {t("SHUTDOWN")}
              </button>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <label>{t("Factory Reset")}</label>
            </Col>
            <Col xs={7}>
              <p>
                {t(`Factory resetting your FarmBot will destroy all data on
                    the device, revoking your FarmBot's abilily to connect to
                    your web app account and your home wifi. Upon factory
                    resetting, your device will restart into Conflgurator
                    mode. Factory resetting your FarmBot will not affect any
                    data or settings from your web app account, allowing you
                    to do a complete restore to your device once it is back
                    online and paired with your web app account.`)}
              </p>
            </Col>
            <Col xs={3}>
              <button className="red" onClick={factoryReset} >
                {t("FACTORY RESET")}
              </button>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <label>{t("CAMERA")}</label>
            </Col>
            <Col xs={7}>
              <div>
                <DeprecatedFBSelect allowEmpty={true}
                  list={CAMERA_CHOICES}
                  placeholder="Select a camera..."
                  onChange={this.sendOffConfig} />
              </div>
            </Col>
            <Col xs={3}>
              {this.state.cameraStatus}
            </Col>
          </Row>
        </WidgetBody>
      </form>
    </Widget>;
  }
}
