import {LightrailResponse, PaginatedLightrailResponse} from "./params/LightrailResponse";
import {Response} from "superagent";
import * as parseLinkHeader from "parse-link-header";

export const validateRequiredParams = (keys: string[], params: object): boolean => keys.every(key => {
    if (params[key] === undefined || params[key] === null) {
        throw new Error("params." + key + " not set");
    }

    return !!params[key];
});

/**
 * Flattens one level deep and formats as key.subkey ie: {key:{subkey:4}} => {key.subkey:4}
 * @param {object} params
 * @returns {object}
 */
export const formatFilterParams = (params?: object): object => {
    const formattedParams: object = {};
    if (params) {
        for (let key in params) {
            if (typeof params[key] !== "object") {
                formattedParams[key] = params[key];
            } else {
                for (let filterKey in params[key]) {
                    if (params[key].hasOwnProperty(filterKey)) {
                        formattedParams[key + "." + filterKey] = params[key][filterKey];
                    }
                }
            }
        }
    }

    return formattedParams;
};

export function isSuccessStatus(status: number): boolean {
    return (status >= 200 && status < 300 || status === 404);
}

/**
 * Formats a response object into a standardized/predictable response, should be used to format all responses
 * @param {request.Response} response
 * @returns {LightrailResponse<T> | PaginatedLightrailResponse<T>}
 */
export function formatResponse<T>(response: Response): LightrailResponse<T> | PaginatedLightrailResponse<T> {
    const lr: any = {
        body: (response.status !== 404) ? response.body : null,
        text: response.text,
        status: response.status
    };

    if (response.header) {
        if (response.header.hasOwnProperty("max-limit")) {
            lr.maxLimit = parseInt(response.header["max-limit"]);
        }

        if (response.header.hasOwnProperty("limit")) {
            lr.limit = parseInt(response.header.limit);
        }

        if (response.header.hasOwnProperty("link")) {
            lr.links = parseLinkHeader(response.header.link);
        }
    }

    return lr;
}