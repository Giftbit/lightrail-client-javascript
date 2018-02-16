import {Card} from "../model";

export interface CreateCardParams {

    userSuppliedId: string;
    cardType: Card.CardType;
    programId?: string;
    currency?: string;
    initialValue?: number;
    categories?: {[key: string]: string};
    contactId?: string;
    expires?: string;
    startDate?: string | Date;
    inactive?: boolean;
    metadata?: {[key: string]: any};

}
