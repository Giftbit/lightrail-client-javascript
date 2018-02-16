import {Card, Program, ValueStore} from "../model";

export interface GetProgramParams {

    name?: string;
    currency?: string;
    codeEngine?: Program.CodeEngine;
    codeConfig?: Program.CodeConfig;
    valueStoreType?: ValueStore.ValueStoreType;
    cardType?: Card.CardType;

}
