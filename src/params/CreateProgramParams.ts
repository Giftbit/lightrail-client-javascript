import {Card, ValueStore} from "../model";

export interface CreateProgramParams {

    userSuppliedId: string;
    name: string;
    currency: string;
    valueStoreType: ValueStore.ValueStoreType;
    codeMinValue?: number;
    codeMaxValue?: number;
    fixedCodeValues?: number[];
    programStartDate?: Date;
    programExpiresDate?: Date;
    cardType?: Card.CardType;
    metadata?: {[key: string]: any};

}
