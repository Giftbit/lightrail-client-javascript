import {RedemptionRule} from "./RedemptionRule";
import {BalanceRule} from "./BalanceRule";

export interface Issuance {
    id: string;
    name: string;
    programId: string;
    count: number;
    balance: number;
    balanceRule: BalanceRule;
    redemptionRule: RedemptionRule;
    usesRemaining: number;
    active: boolean;
    startDate: string;
    endDate: string;
    metadata: object;
    createdDate: string;
    updatedDate: string;
}