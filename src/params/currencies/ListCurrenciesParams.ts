import {LightrailResponse} from "../LightrailResponse";
import {Currency} from "../../model/Currency";
import {PaginationParams} from "../PaginationParams";

export interface ListCurrenciesParams extends PaginationParams {
}

export interface ListCurreniesResponse extends LightrailResponse<Currency[]> {
}