import {LightrailResponse} from "../LightrailResponse";
import {Currency} from "../../model/Currency";

export interface ListCurrenciesResponse extends LightrailResponse<Currency[]> {
}
