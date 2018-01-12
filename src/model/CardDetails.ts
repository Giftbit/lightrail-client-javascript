import {Card} from "./Card";
import {ValueStore} from "./ValueStore";

export interface CardDetails {
    currency: string;
    cardtype: Card.CardType;
    asAtDate: string;
    cardId: string;
    valueStores: CardDetails.ValueStore[];
}

export namespace CardDetails {
    export interface ValueStore {
        valueStoreType: ValueStore.ValueStoreType;
        value: number;
        state: BalanceState;
        expires: string;
        startDate: string;
        programId: string;
        valueStoreId: string;
        restrictions: string[];
    }

    export type BalanceState = "ACTIVE" | "INACTIVE" | "FROZEN" | "CANCELLED" | "EXPIRED" | "NOT_STARTED";
    export namespace BalanceState {
        export const ACTIVE: BalanceState = "ACTIVE";
        export const INACTIVE: BalanceState = "INACTIVE";
        export const FROZEN: BalanceState = "FROZEN";
        export const CANCELLED: BalanceState = "CANCELLED";
        export const EXPIRED: BalanceState = "EXPIRED";
        export const NOT_STARTED: BalanceState = "NOT_STARTED";
    }
}
