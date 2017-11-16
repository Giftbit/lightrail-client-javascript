import * as contacts from "./contacts";
import * as cards from "./cards";
import {Card} from "./model/Card";
import {CreateAccountCardParams} from "./params/CreateAccountCardParams";
import {CreateTransactionParams} from "./params/CreateTransactionParams";
import {Transaction} from "./model/Transaction";
import {SimulateTransactionParams} from "./params/SimulateTransactionParams";

export async function createAccount(contact: { contactId?: string, userSuppliedId?: string, shopperId?: string }, params: CreateAccountCardParams): Promise<Card> {
    let contactForAccountCreation = await contacts.getContactByAnyIdentifier(contact);
    if (!contactForAccountCreation) {
        contactForAccountCreation = await contacts.createContact({userSuppliedId: contact.userSuppliedId || contact.shopperId});
    }
    const accountCard = await cards.getAccountCardByContactAndCurrency(contactForAccountCreation, params.currency);
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

export async function createTransaction(contact: { contactId?: string, userSuppliedId?: string, shopperId?: string }, params: CreateTransactionParams): Promise<Transaction> {
    const contactForTransaction = await contacts.getContactByAnyIdentifier(contact);
    if (!contactForTransaction) {
        throw new Error("could not find contact to transact against");
    }
    const accountCard = await cards.getAccountCardByContactAndCurrency(contactForTransaction, params.currency);
    return cards.transactions.createTransaction(accountCard, params);
}

export async function simulateTransaction(contact: { contactId?: string, userSuppliedId?: string, shopperId?: string }, params: SimulateTransactionParams): Promise<Transaction> {
    const contactForTransaction = await contacts.getContactByAnyIdentifier(contact);
    if (!contactForTransaction) {
        throw new Error("could not find contact to simulate transacting against");
    }
    const accountCard = await cards.getAccountCardByContactAndCurrency(contactForTransaction, params.currency);
    return cards.transactions.simulateTransaction(accountCard, params);
}