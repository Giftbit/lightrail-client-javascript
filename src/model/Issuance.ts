import {RedemptionRule} from "./RedemptionRule";
import {ValueRule} from "./ValueRule";

export interface Issuance {
    id: string;
    name: string;
    programId: string;
    count: number;
    balance: number;
    redemptionRule: RedemptionRule;
    valueRule: ValueRule;
    uses: number;
    startDate: string;
    endDate: string;
    metadata: object;
    createdDate: string;
    updatedDate: string;
}