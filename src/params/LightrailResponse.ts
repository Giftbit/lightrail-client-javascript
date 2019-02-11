import {PaginationHeaders} from "./PaginatedResponse";

export interface LightrailResponse<T> {
    body: T;
    text: string;
    links?: Links;
    status: number;
}

export interface Link {
    url: string;
    rel: string;
    [queryParam: string]: string;
}

export interface Links {
    [rel: string]: Link;
}

export interface PaginatedLightrailResponse<T> extends LightrailResponse<T>, PaginationHeaders {
}
