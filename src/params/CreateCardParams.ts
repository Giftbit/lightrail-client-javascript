import {Card} from "../model/Card";

export interface CreateCardParams {

    userSuppliedId: string;
    cardType: Card.CardType;
    currency?: string;
    initialValue?: number;
    categories?: {[key: string]: string};
    contactId?: string;
    expires?: string;
    startDate?: string | Date;
    inactive?: boolean;
    metadata?: object;

}
