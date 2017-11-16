import * as contacts from "./contacts";
import * as cards from "./cards";
import {Card} from "./model/Card";
import {CreateAccountCardParams} from "./params/CreateAccountCardParams";

export async function createAccount(contact: { contactId?: string, userSuppliedId?: string, shopperId?: string }, params: CreateAccountCardParams): Promise<Card> {
    const contactForAccountCreation = await contacts.getContactByAnyIdentifier(contact);
    // if (!contactForAccountCreation) {
    //     // contactForAccountCreation = await    ... create contactForAccountCreation
    // }
    console.log("CONTACT", contactForAccountCreation);
    const accountCard = await cards.getAccountCardByContactAndCurrency(contactForAccountCreation, params.currency);
    console.log("ACCT CARD", accountCard);
    if (!accountCard) {
        if (params.contactId && (params.contactId !== contactForAccountCreation.contactId)) {
            throw new Error("Account creation error: params.contactId set to different value than contactForAccountCreation.contactId");
        } else {
            params.contactId = contactForAccountCreation.contactId;
        }
        return cards.createCard(params);
    } else {
        return accountCard;
    }
}
