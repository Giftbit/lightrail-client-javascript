import {RedemptionRule} from "../../../model/RedemptionRule";
import {ValueRule} from "../../../model/index";
import {CodeGenerationParams} from "../CodeGenerationParams";
import {LightrailResponse} from "../../LightrailResponse";
import {Issuance} from "../../../model/Issuance";

export interface CreateIssuanceParams {
    programId: string;
    params: {
        id: string;
        count: number;
        generateCode: CodeGenerationParams;
        code?: string;
        isGenericCode?: boolean;
        balance?: number;
        uses?: number;
        startDate?: string;
        endDate?: string;
        redemptionRule?: RedemptionRule;
        valueRule?: ValueRule;
        metadata?: object;
        createdDate?: string;
        updateDate?: string;
    };
}

export interface CreateIssuanceResponse extends LightrailResponse<Issuance> {
}