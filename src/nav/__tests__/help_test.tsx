import { mapUrlToDocumentation } from "../help";

describe("mapUrlToDocumentation", () => {
  it("maps to correct URLS", () => {
    expect(mapUrlToDocumentation("Something else..."))
      .toBe("https://software.farmbot.io/docs/the-farmbot-web-app");
  });
});
