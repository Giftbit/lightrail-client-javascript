import {Links} from "parse-link-header";

export interface PaginationHeaders {
    maxLimit?: number;
    limit?: number;
    link?: Links;
}