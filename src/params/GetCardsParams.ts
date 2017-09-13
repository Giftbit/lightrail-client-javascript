import {Card} from "../model/Card";

export interface GetCardsParams {

    contactId?: string;
    cardType?: Card.CardType;
    currency?: string;
    userSuppliedId?: string;

}
