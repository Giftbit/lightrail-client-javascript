import {Card} from "../model/Card";
import {Program} from "../model/Program";
import {ValueStore} from "../model/ValueStore";

export interface GetProgramParams {

    name?: string;
    currency?: string;
    codeEngine?: Program.CodeEngine;
    codeConfig?: Program.CodeConfig;
    valueStoreType?: ValueStore.ValueStoreType;
    cardType?: Card.CardType;

}
