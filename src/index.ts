import * as superagent from "superagent";
import * as superagentLogger from "superagent-logger";
import * as cards from "./cards";
import * as contacts from "./contacts";
import * as model from "./model";
import * as params from "./params";
import * as programs from "./programs";
import {LightrailOptions} from "./LightrailOptions";
import {LightrailRequestError} from "./LightrailRequestError";

// These values are all configurable from configure().
export let apiKey: string = null;
export let restRoot: string = "https://api.lightrail.com/v1/";
export let logRequests: boolean = false;

export function configure(options: LightrailOptions): void {
    if (!options) {
        return;
    }
    if (options.hasOwnProperty("apiKey")) {
        apiKey = options.apiKey;
    }
    if (options.hasOwnProperty("restRoot")) {
        restRoot = options.restRoot;
        if (!restRoot.endsWith("/")) {
            restRoot = restRoot + "/";
        }
    }
    if (options.hasOwnProperty("logRequests")) {
        logRequests = options.logRequests;
    }
}

export function request(method: string, path: string): superagent.Request {
    // We can do some fancy things with superagent here like request rate
    // throttling or automatic retry on particular codes.
    let r = superagent(method, restRoot + path)
        .set("Authorization", `Bearer ${apiKey}`)
        .ok(() => true);
    if (logRequests) {
        if (superagentLogger) {
            r = r.use(superagentLogger);
        } else {
            console.error("logRequests is set to true but optional dependency superagent-logger was not found");
        }
    }
    return r;
}

export {LightrailOptions, LightrailRequestError, cards, contacts, model, params, programs};
