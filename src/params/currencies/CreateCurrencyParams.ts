import {LightrailResponse} from "../LightrailResponse";
import {Currency} from "../../model/Currency";

export interface CreateCurrencyParams {
    code: string;
    name: string;
    symbol: string;
    decimalPlaces: number;
}

export interface CreateCurrencyResponse extends LightrailResponse<Currency> {
}