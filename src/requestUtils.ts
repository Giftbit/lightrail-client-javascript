import {LightrailResponse, PaginatedLightrailResponse} from "./model/LightrailResponse";
import {Response} from "superagent";
import * as parseLinkHeader from "parse-link-header";

export const validateRequiredParams = (keys: string[], params: Object): boolean => keys.every(key => {
    if (!params[key]) {
        throw new Error("params." + key + " not set");
    }

    return !!params[key];
});

/**
 * Flattens one level deep and formats as key.subkey ie: {key:{subkey:4}} => {key.subkey:4}
 * @param {Object} params
 * @returns {Object}
 */
export const formatFilterParams = (params?: Object): Object => {
    const formattedParams: Object = {};
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


/**
 * Formats a response object into a standardized/predictable response, should be used to format all responses
 * @param {request.Response} response
 * @returns {LightrailResponse<T> | PaginatedLightrailResponse<T>}
 */
export function formatResponse<T>(response: Response): LightrailResponse<T> | PaginatedLightrailResponse<T> {
    const lr: any = {
        body: response.body
    };

    if (response.header) {
        if (response.header.hasOwnProperty("max-limit")) {
            lr.maxLimit = response.header["max-limit"];
        }

        if (response.header.hasOwnProperty("limit")) {
            lr.limit = response.header.limit;
        }

        if (response.header.hasOwnProperty("link")) {
            lr.links = parseLinkHeader(response.header.link);
        }
    }

    return lr;
}