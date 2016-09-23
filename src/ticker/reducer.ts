import { generateReducer } from "../generate_reducer";
import { TickerState } from "./interfaces";
import { ReduxAction } from "../interfaces";

let YELLOW = "#fd6",
    RED = "#e66",
    GREEN = "#6a4";

function change(color: string, message: string, show = true) {
    return (s: TickerState, a: ReduxAction<{}>) => ({ color, message, show });
}

export let tickerReducer = generateReducer<TickerState>({
    message: __("Please log in"),
    color: "gray",
    show: true
  })
.add<{}>("LOGIN_OK", change(YELLOW, __("Logged in")))
.add<{}>("LOGIN_ERR", change(RED, __("Bad login")))
.add<{}>("FETCH_PLANTS_START", change(YELLOW, __("Fetching plants")))
.add<{}>("FETCH_PLANTS_OK", change(GREEN, __("Done fetching plants")))
.add<{}>("FETCH_PLANTS_ERR", change(RED, __("Error fetching plants")))
.add<{}>("FETCH_SEQUENCES_OK", change(GREEN, __("Done fetching sequences")))
.add<{}>("READ_STATUS_OK", change(GREEN, __("Bot status OK")))
.add<{}>("FETCH_DEVICE_ERR", change(RED, __("Can't connect to MQTT broker")))
.add<{}>("READ_STATUS_ERR", change(RED, __("Can't connect to bot")))
.add<{}>("BOT_NOTIFICATION", change(GREEN, __("Message received")))
.add<{}>("COMMAND_OK", change(GREEN, __("Message delivered")));
