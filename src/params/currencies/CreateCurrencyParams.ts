import {LightrailResponse} from "../../model/LightrailResponse";
import {Currency} from "../../model/Currency";

export interface CreateCurrencyParams extends Currency {
}

export interface CreateCurrencyResponse extends LightrailResponse<Currency> {
}