import {Card} from "../model";

export interface GetCardsParams {

    contactId?: string;
    cardType?: Card.CardType;
    currency?: string;
    userSuppliedId?: string;

}
