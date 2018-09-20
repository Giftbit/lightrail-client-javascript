import {RedemptionRule} from "../../../model/RedemptionRule";
import {BalanceRule} from "../../../model/index";
import {CodeGenerationParams} from "../CodeGenerationParams";
import {LightrailResponse} from "../../LightrailResponse";
import {Issuance} from "../../../model/Issuance";

export interface CreateIssuanceParams {
    id: string;
    name: string;
    count: number;
    generateCode: CodeGenerationParams;
    code?: string;
    isGenericCode?: boolean;
    balance?: number;
    usesRemaining?: number;
    startDate?: string;
    endDate?: string;
    redemptionRule?: RedemptionRule;
    balanceRule?: BalanceRule;
    metadata?: object;
    createdDate?: string;
    updateDate?: string;
}

export interface CreateIssuanceResponse extends LightrailResponse<Issuance> {
}