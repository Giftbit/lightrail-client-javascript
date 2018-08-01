import {LightrailResponse} from "../LightrailResponse";
import {Currency} from "../../model/Currency";

export interface GetCurreniesResponse extends LightrailResponse<Currency[]> {
}