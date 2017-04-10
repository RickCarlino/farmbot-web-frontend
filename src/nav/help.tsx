import { CowardlyDictionary } from "../util";

const DOC_URLS: CowardlyDictionary<string> = {
  "DEFAULT": "https://software.farmbot.io/docs/the-farmbot-web-app",
  "DESIGNER": "https://software.farmbot.io/docs/farm-designer",
  "EVENTS": "https://software.farmbot.io/docs/farm-events",
  "CONTROLS": "https://software.farmbot.io/docs/controls",
  "DEVICE": "https://software.farmbot.io/docs/device",
  "SEQUENCES": "https://software.farmbot.io/docs/device",
  "REGIMENS": "https://software.farmbot.io/docs/regimens",
  "TOOLS": "https://software.farmbot.io/docs/tools"
}

export function mapUrlToDocumentation(urlInApp: string) {
  return DOC_URLS[urlInApp] || DOC_URLS["DEFAULT"];
}
