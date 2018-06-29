import {Links} from "parse-link-header";

export interface PaginatedResponse {
    "max-limit"?: number;
    limit?: number;
    link?: Links;
}