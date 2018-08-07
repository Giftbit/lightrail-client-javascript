import {LightrailResponse} from "../LightrailResponse";
import {Currency} from "../../model/Currency";

export interface ListCurreniesResponse extends LightrailResponse<Currency[]> {
}