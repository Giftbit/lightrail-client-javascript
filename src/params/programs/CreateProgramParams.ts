import {Program} from "../../model";

export interface CreateProgramParams {
    id: string;
    name: string;
    currency: string;
}

export interface CreateProgramResponse extends Program{
}
