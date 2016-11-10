import { generateReducer } from "../redux/generate_reducer";
import { ChangeApiHost, ChangeApiPort, ConfigState } from "./interfaces";
import { API } from "../api";

/** Determines the most appropriate API port based on a number of environment
 *  factors such as hostname and protocol (HTTP vs. HTTPS). */
export function inferPort(): string {
  // Most devs running a server on localhost run the API on port 3000.
  if (location.hostname === "localhost") { return "3000"; }
  if (API.parseURL(location.origin).protocol === "https:") { return "443"; }
  // All others just use port 80.
  return "80";
}

let initialState: ConfigState = {
  host: location.hostname,
  // It gets annoying to manually change the port # in dev mode.
  // I automatically point to port 3000 on local.
  port: API.inferPort()
};

export let configReducer = generateReducer<ConfigState>(initialState)
  .add<ChangeApiPort>("CHANGE_API_PORT", function (s, a) {
    s.port = a.payload.port.replace(/\D/g, "");
    return s;
  })
  .add<ChangeApiHost>("CHANGE_API_HOST", function (s, a) {
    s.host = a.payload.host;
    return s;
  });

