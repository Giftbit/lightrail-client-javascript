import {Links} from "parse-link-header";

export interface PaginationParams {
    limit?: number;
    after?: string;
    next?: string;
    last?: string;
}

export interface PaginationHeaders {
    maxLimit?: number;
    limit?: number;
    link?: Links;
}