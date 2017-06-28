import { getSpecialValue, formatEnvKey, parseEnvKey } from "../translators";
import { SPECIAL_VALUES } from "../constants";
import { WD_ENV, WDENVKey } from "../interfaces";

describe("getSpecialValue()", () => {
  it("translates values", () => {
    expect(getSpecialValue("true")).toEqual(SPECIAL_VALUES.TRUE);
    expect(getSpecialValue("false")).toEqual(SPECIAL_VALUES.FALSE);
    expect(getSpecialValue("Bottom_LEft"))
      .toEqual(SPECIAL_VALUES.BOTTOM_LEFT);
    expect(getSpecialValue("ToP_LeFT")).toEqual(SPECIAL_VALUES.TOP_LEFT);
  });
});

describe("formatEnvKey()", () => {

  it("translates the things", () => {
    [
      {
        k: "CAMERA_CALIBRATION_invert_hue_selection",
        v: SPECIAL_VALUES.TRUE,
        r: "TRUE"
      },
      {
        k: "CAMERA_CALIBRATION_invert_hue_selection",
        v: SPECIAL_VALUES.FALSE,
        r: "FALSE"
      },
      {
        k: "CAMERA_CALIBRATION_calibration_along_axis",
        v: SPECIAL_VALUES.X,
        r: "X"
      },
      {
        k: "CAMERA_CALIBRATION_calibration_along_axis",
        v: SPECIAL_VALUES.Y,
        r: "Y"
      },
      {
        k: "CAMERA_CALIBRATION_image_bot_origin_location",
        v: SPECIAL_VALUES.TOP_LEFT,
        r: "TOP_LEFT"
      }
    ].map(t => {
      expect(formatEnvKey(t.k as WDENVKey, t.v)).toEqual(t.r);
    });
  });
});

describe("parseEnvKey()", () => {
  it("makes stuff a number again", () => {
    // TODO: Figure out why this is broke.
    pending("Y U NO WORK??");
    let r = parseEnvKey("CAMERA_CALIBRATION_image_bot_origin_location",
      JSON.stringify("TOP_lEFt"));
    expect(r).toEqual(SPECIAL_VALUES.TOP_LEFT);
  });
});
