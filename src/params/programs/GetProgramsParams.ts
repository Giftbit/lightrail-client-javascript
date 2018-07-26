import {Program} from "../../model/index";
import {PaginatedLightrailResponse} from "../../model/LightrailResponse";
import {FilterableString} from "../FilterableParam";

export interface GetProgramsParams {
    limit?: number;
    id?: FilterableString;
    currency?: FilterableString;
    tags?: FilterableString;
    startDate?: FilterableString;
    endDate?: FilterableString;
    createdDate?: FilterableString;
    updatedDate?: FilterableString;
}

export interface GetProgramsResponse extends PaginatedLightrailResponse<Program[]> {
}
