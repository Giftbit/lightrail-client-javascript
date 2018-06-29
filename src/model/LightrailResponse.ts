import {PaginatedResponse} from "./PaginatedResponse";

export interface LightrailResponse<T> extends PaginatedResponse {
    body: T;
}