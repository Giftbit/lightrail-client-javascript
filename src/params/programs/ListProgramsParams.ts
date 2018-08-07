import {Program} from "../../model/index";
import {PaginatedLightrailResponse} from "../LightrailResponse";
import {FilterableString} from "../FilterableParams";
import {PaginationParams} from "../PaginationParams";

export interface ListProgramsParams extends PaginationParams {
    id?: FilterableString;
    currency?: FilterableString;
    tags?: FilterableString;
    startDate?: FilterableString;
    endDate?: FilterableString;
    createdDate?: FilterableString;
    updatedDate?: FilterableString;
}

export interface ListProgramsResponse extends PaginatedLightrailResponse<Program[]> {
}
