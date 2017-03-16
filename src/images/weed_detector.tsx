import * as React from "react";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { DetectorState } from "./interfaces";
import { WeedDetectorBody } from "./weed_detector_body";
import { TitleBar } from "./weed_detector_title";
import { devices } from "../device";
import { success, error } from "../ui/index";
import { t } from "i18next";
import { resetWeedDetection } from "./actions";
import { Progress } from "../util";
import { Pair } from "farmbot/dist";
import { HSV } from "./index";

@connect((state: Everything) => state)
export class WeedDetector extends React.Component<Everything, Partial<DetectorState>> {
  constructor() {
    super();
    this.state = { remoteFarmwareSettings: {} };
  }

  get farmwareSettings() { return this.state.remoteFarmwareSettings || {}; }

  componentDidMount() {
    const IS_ONLINE = !!this
      .props
      .bot
      .hardware
      .user_env["LAST_CLIENT_CONNECTED"];
    const NEEDS_SETUP = !!this
      .props
      .bot
      .hardware
      .user_env["PLANT_DETECTION_options"];
    let remoteFarmwareSettings = this.farmwareSettings;
    (IS_ONLINE && NEEDS_SETUP) ?
      this.saveSettings() : this.setState({ remoteFarmwareSettings });
  }

  takePhoto = () => {
    let ok = () => success(t("Processing now. Refresh page to see result."));
    let no = () => error("Error taking photo");
    devices.current.takePhoto().then(ok, no);
  }

  clearWeeds = () => {
    let progress = (p: Readonly<Progress>) => {
      let percentage = `${Math.round((p.completed / p.total) * 100)} %`;
      this.setState({ deletionProgress: p.isDone ? "" : percentage });
    };
    this.props.dispatch(resetWeedDetection(progress));
    this.setState({ deletionProgress: "Deleting..." });
  }

  saveSettings = () => {
    let nextEnv = {
      "PLANT_DETECTION_options": JSON.stringify(this.farmwareSettings)
    };
    devices.current.setUserEnv(nextEnv);
  }

  toggleSettingsMenu = () => {
    this.setState({ settingsMenuOpen: !this.state.settingsMenuOpen });
  }

  sliderChange = (key: keyof HSV<"">, values: [number, number]) => {
    let oldSettings = this.farmwareSettings;
    let newSettings = { [key]: values };
    let remoteFarmwareSettings = { ...oldSettings, ...newSettings };
    this.setState({ remoteFarmwareSettings });
  }

  test = () => {
    let that = this;
    let settings = this.farmwareSettings;
    let pairs = Object
      .keys(settings)
      .map<Pair>(function (value: keyof typeof settings, index) {
        let label = JSON.stringify(settings[value]) || "null";
        return { kind: "pair", args: { value, label } };
      });
    devices.current.execScript("plant-detection", pairs);
  }

  render() {
    return <div>
      <div className="widget-wrapper weed-detector-widget">
        <div className="row">
          <div className="col-sm-12">
            <TitleBar onDeletionClick={this.clearWeeds}
              deletionProgress={this.state.deletionProgress}
              onPhotoClick={this.takePhoto}
              onSave={this.saveSettings}
              onSettingToggle={this.toggleSettingsMenu}
              onTest={this.test}
              settingsMenuOpen={!!this.state.settingsMenuOpen} />
            <div className="row">
              <div className="col-sm-12">
                <WeedDetectorBody images={this.props.sync.images}
                  onSliderChange={this.sliderChange}
                  H={this.farmwareSettings.H}
                  S={this.farmwareSettings.S}
                  V={this.farmwareSettings.V} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
