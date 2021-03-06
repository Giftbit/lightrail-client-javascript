import * as jsonwebtoken from "jsonwebtoken";
import * as superagent from "superagent";
import * as superagentLogger from "superagent-logger";
import * as contacts from "./contacts";
import * as model from "./model";
import * as params from "./params";
import * as programs from "./programs";
import * as values from "./values";
import * as currencies from "./currencies";
import * as transactions from "./transactions";
import * as webhooks from "./webhooks";
import {LightrailOptions} from "./LightrailOptions";
import {LightrailRequestError} from "./LightrailRequestError";
import {GenerateShopperTokenOptions} from "./GenerateShopperTokenOptions";

export {
    LightrailOptions,
    LightrailRequestError,
    contacts,
    model,
    params,
    programs,
    values,
    currencies,
    transactions,
    webhooks
};

/**
 * These values are all configurable from configure().
 */
export const configuration: LightrailOptions = {
    apiKey: null,
    isBrowser: false,
    restRoot: "https://api.lightrail.com/v2/",
    sharedSecret: null,
    webhookSecret: null,
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
    if (options.apiKey !== undefined) {
        if (typeof options.apiKey !== "string") {
            throw new Error("apiKey must be a string");
        }
        configuration.apiKey = options.apiKey;
    }
    if (options.isBrowser !== undefined) {
        configuration.isBrowser = options.isBrowser;
    }
    if (options.restRoot !== undefined) {
        if (typeof options.restRoot !== "string") {
            throw new Error("restRoot must be a string");
        }
        configuration.restRoot = options.restRoot;
        if (!configuration.restRoot.endsWith("/")) {
            configuration.restRoot = configuration.restRoot + "/";
        }
    }
    if (options.sharedSecret !== undefined) {
        if (typeof options.sharedSecret !== "string") {
            throw new Error("sharedSecret must be a string");
        }
        configuration.sharedSecret = options.sharedSecret;
    }
    if (options.webhookSecret !== undefined) {
        if (typeof options.webhookSecret !== "string") {
            throw new Error("webhookSecret must be a string");
        }
        configuration.webhookSecret = options.webhookSecret;
    }
    if (options.additionalHeaders !== undefined) {
        if (options.additionalHeaders === null || typeof options.additionalHeaders !== "object") {
            throw new Error("additionalHeaders must be an object");
        }
        configuration.additionalHeaders = options.additionalHeaders;
    }
    if (options.logRequests !== undefined) {
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

    // We can do some fancy things with superagent here like request rate throttling.
    let r = superagent(method, configuration.restRoot + path)
        .ok(() => true)
        .retry();

    if (configuration.apiKey) {
        r.set("Authorization", `Bearer ${configuration.apiKey}`);
    }
    if (!configuration.isBrowser) {
        r.set("Lightrail-Client", `Lightrail-JavaScript/${process.env.npm_package_version}`);
    }
    if (configuration.isBrowser) {
        r.set("X-Requested-With", "XMLHttpRequest");
        r.set("Expires", "-1");
        r.set("Cache-Control", "no-cache,no-store,must-revalidate,max-age=-1,private");
    }
    if (configuration.additionalHeaders) {
        r.set(configuration.additionalHeaders);
    }
    if (configuration.logRequests && superagentLogger) {
        r = r.use(superagentLogger);
    }
    return r;
}

/**
 * Generate a shopper token that can be used to make Lightrail calls
 * restricted to that particular shopper.  The shopper can be defined by the
 * contactId, or an empty string for anonymous.
 *
 * eg: `generateShopperToken("user-12345");`
 * eg: `generateShopperToken("user-12345", {validityInSeconds: 43200});`
 *
 * @param contactId the ID of the contact
 * @param options the number of seconds the shopper token will be valid for *OR* a GenerateShopperTokenOptions object
 * @returns the shopper token
 */
export function generateShopperToken(contactId: string, options?: GenerateShopperTokenOptions): string {
    if (!configuration.apiKey) {
        throw new Error("apiKey not set");
    }
    if (!configuration.sharedSecret) {
        throw new Error("sharedSecret not set");
    }
    if (contactId == null) {
        throw new Error("contactId must be a string (can be empty)");
    }

    let validityInSeconds = 43200;
    let metadata: { [name: string]: any };
    if (options) {
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
    if (!merchantJwtPayload || !merchantJwtPayload.g || !merchantJwtPayload.g.gui || !merchantJwtPayload.g.tmi) {
        throw new Error("apiKey not valid");
    }

    const nowInSeconds = Date.now() / 1000;
    return jsonwebtoken.sign(
        {
            g: {
                gui: merchantJwtPayload.g.gui,
                gmi: merchantJwtPayload.g.gmi,
                tmi: merchantJwtPayload.g.tmi,
                coi: contactId
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
