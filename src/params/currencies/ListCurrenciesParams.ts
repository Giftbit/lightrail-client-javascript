import {LightrailResponse} from "../LightrailResponse";
import {Currency} from "../../model/Currency";
import {PaginationParams} from "../PaginationParams";
import {ContentTypeParams} from "../ContentTypeParams";

export interface ListCurrenciesParams extends PaginationParams, ContentTypeParams {
}

export interface ListCurreniesResponse extends LightrailResponse<Currency[]> {
}