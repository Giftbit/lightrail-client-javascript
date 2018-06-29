import {LightrailResponse} from "./model/LightrailResponse";
import {Response} from "superagent";
import * as parseLinkHeader from "parse-link-header";

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

export function formatResponse<T>(response: Response): LightrailResponse<T> {
    const lr: LightrailResponse<T> = {
        body: response.body
    };

    if (response.header) {
        if (response.header.hasOwnProperty("max-limit")) {
            lr["max-limit"] = response.header["max-limit"];
        }

        if (response.header.hasOwnProperty("limit")) {
            lr.limit = response.header.limit;
        }

        if (response.header.hasOwnProperty("link")) {
            lr.link = parseLinkHeader(response.header.link);
        }
    }

    return lr;
}