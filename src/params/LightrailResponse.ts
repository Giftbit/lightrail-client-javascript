import {PaginationHeaders} from "./PaginatedResponse";
import {Links} from "parse-link-header";

export interface LightrailResponse<T> {
    body: T;
    links?: Links;
}

export interface PaginatedLightrailResponse<T> extends LightrailResponse<T>, PaginationHeaders {
}