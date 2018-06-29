import {PaginationHeaders} from "./PaginatedResponse";

export interface LightrailResponse<T> {
    body: T;
}

export interface PaginatedLightrailResponse<T> extends LightrailResponse<T>, PaginationHeaders {
}