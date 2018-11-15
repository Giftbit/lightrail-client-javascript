import {PaginationHeaders} from "./PaginatedResponse";
import {Links} from "parse-link-header";

export interface LightrailResponse<T> {
    body: T;
    text: string;
    links?: Links;
    status: number;
}

export interface PaginatedLightrailResponse<T> extends LightrailResponse<T>, PaginationHeaders {
}