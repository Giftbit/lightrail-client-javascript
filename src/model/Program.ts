import {ValueStore} from "./ValueStore";
import {Card} from "./Card";

export interface Program {

    programId: string;
    userSuppliedId: string;
    name: string;
    active: boolean;
    currency: string;
    dateCreated: string;
    programExpiresDate: string | null;
    programStartDate: string;
    codeActivePeriodInDays: number;
    codeValueMin: number;
    codeValueMax: number;
    fixedCodeValues: number[] | null;
    codeEngine: Program.CodeEngine;
    codeConfig: Program.CodeConfig;
    valueStoreType: ValueStore.ValueStoreType;
    metadata: {[key: string]: any} | null;
    timeZone: string;
    cardType: Card.CardType;

}

export namespace Program {
    export type CodeEngine = "SIMPLE_STORED_VALUE";
    export namespace CodeEngine {
        const SIMPLE_STORED_VALUE: CodeEngine = "SIMPLE_STORED_VALUE";
    }

    export type CodeConfig = "DEFAULT";
    export namespace CodeConfig {
        const DEFAULT: CodeConfig = "DEFAULT";
    }
}
