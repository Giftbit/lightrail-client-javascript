import {Currency} from "../../model/Currency";
import {LightrailResponse} from "../LightrailResponse";

export interface UpdateCurrencyParams extends Partial<Currency> {
}

export interface UpdateCurrencyResponse extends LightrailResponse<Currency> {
}