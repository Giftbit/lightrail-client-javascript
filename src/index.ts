import * as jsonwebtoken from "jsonwebtoken";
import * as superagent from "superagent";
import * as superagentLogger from "superagent-logger";
import * as contacts from "./contacts";
import * as model from "./model";
import * as params from "./params";
import * as programs from "./programs";
import {LightrailOptions} from "./LightrailOptions";
import {LightrailRequestError} from "./LightrailRequestError";
import {GenerateShopperTokenOptions} from "./GenerateShopperTokenOptions";
import packageJson = require("../package.json");

export {LightrailOptions, LightrailRequestError, contacts, model, params, programs};

/**
 * These values are all configurable from configure().
 */
export const configuration: LightrailOptions = {
    apiKey: null,
    isBrowser: false,
    restRoot: "https://api.lightraildev.net/v2/",
    sharedSecret: null,
    logRequests: false,
    additionalHeaders: {}
};

/**
 * Configure the Lightrail client.
 */
export function configure(options: Partial<LightrailOptions>): void {
    if (!options) {
        return;
    }
    if (options.hasOwnProperty("apiKey")) {
        if (typeof options.apiKey !== "string") {
            throw new Error("apiKey must be a string");
        }
        configuration.apiKey = options.apiKey;
    }
    if (options.hasOwnProperty("isBrowser")) {
        configuration.isBrowser = options.isBrowser;
    }
    if (options.hasOwnProperty("restRoot")) {
        if (typeof options.restRoot !== "string") {
            throw new Error("restRoot must be a string");
        }
        configuration.restRoot = options.restRoot;
        if (!configuration.restRoot.endsWith("/")) {
            configuration.restRoot = configuration.restRoot + "/";
        }
    }
    if (options.hasOwnProperty("sharedSecret")) {
        if (typeof options.sharedSecret !== "string") {
            throw new Error("sharedSecret must be a string");
        }
        configuration.sharedSecret = options.sharedSecret;
    }
    if (options.hasOwnProperty("additionalHeaders")) {
        if (typeof options.additionalHeaders !== "object") {
            throw new Error("additionalHeaders must be an object");
        }
        configuration.additionalHeaders = options.additionalHeaders;
    }
    if (options.hasOwnProperty("logRequests")) {
        if (typeof options.logRequests !== "boolean") {
            throw new Error("logRequests must be a boolean");
        }
        if (options.logRequests && !superagentLogger) {
            throw new Error("logRequests is set to true but optional dependency superagent-logger was not found");
        }
        configuration.logRequests = options.logRequests;
    }
}

/**
 * Initiate a new request to the Lightrail server.
 */
export function request(method: string, path: string): superagent.Request {
    if (!configuration.apiKey && !configuration.isBrowser) {
        throw new Error("apiKey not set");
    }

    // We can do some fancy things with superagent here like request rate
    // throttling or automatic retry on particular codes.
    let r = superagent(method, configuration.restRoot + path)
        .ok(() => true);

    if (!!configuration.apiKey) {
        r.set("Authorization", `Bearer ${configuration.apiKey}`);
    }
    if (!configuration.isBrowser) {
        r.set("User-Agent", `Lightrail-JavaScript/${packageJson.version}`);
    }
    for (const key in configuration.additionalHeaders) {
        if (configuration.additionalHeaders.hasOwnProperty(key)) {
            r.set(key, configuration.additionalHeaders[key]);
        }
    }
    if (configuration.logRequests && superagentLogger) {
        r = r.use(superagentLogger);
    }
    return r;
}

/**
 * Generate a shopper token that can be used to make Lightrail calls
 * restricted to that particular shopper.  The shopper can be defined by the
 * contactId, userSuppliedId, or shopperId.
 *
 * eg: `generateShopperToken({shopperId: "user-12345"});`
 * eg: `generateShopperToken({shopperId: "user-12345"}, {validityInSeconds: 43200});`
 *
 * @param contact an object that defines one of: contactId, userSuppliedId or shopperId
 * @param options the number of seconds the shopper token will be valid for *OR* a GenerateShopperTokenOptions object
 * @returns the shopper token
 */
export function generateShopperToken(contact: model.ContactIdentifier, options?: number | GenerateShopperTokenOptions): string {
    if (!configuration.apiKey) {
        throw new Error("apiKey not set");
    }
    if (!configuration.sharedSecret) {
        throw new Error("sharedSecret not set");
    }
    if (!contact) {
        throw new Error("contact not set");
    }
    if (!contact.contactId && !contact.userSuppliedId && contact.shopperId == null) {
        throw new Error("one of contact.contactId, contact.userSuppliedId or contact.shopperId must be set");
    }

    let validityInSeconds = 43200;
    let metadata: {[name: string]: any};
    if (typeof options === "number") {
        validityInSeconds = options;
    } else if (options) {
        if (typeof options.validityInSeconds === "number") {
            validityInSeconds = options.validityInSeconds;
        }
        if (options.metadata) {
            metadata = options.metadata;
        }
    }
    if (validityInSeconds <= 0) {
        throw new Error("validityInSeconds must be > 0");
    }

    const merchantJwtPayload = jsonwebtoken.decode(configuration.apiKey) as any;
    if (!merchantJwtPayload || !merchantJwtPayload.g || !merchantJwtPayload.g.gui) {
        throw new Error("apiKey not valid");
    }

    const nowInSeconds = Date.now() / 1000;
    return jsonwebtoken.sign(
        {
            g: {
                gui: merchantJwtPayload.g.gui,
                gmi: merchantJwtPayload.g.gmi,
                coi: contact.contactId || undefined,
                cui: contact.userSuppliedId || undefined,
                shi: typeof(contact.shopperId) === "string" ? contact.shopperId : undefined
            },
            metadata: metadata || undefined,
            iss: "MERCHANT",
            iat: nowInSeconds,
            exp: nowInSeconds + validityInSeconds,
            roles: ["shopper"]
        },
        configuration.sharedSecret,
        {
            header: {
                alg: "HS256",
                typ: "JWT",
                ver: 3,
                vav: 1
            }
        }
    );
}
