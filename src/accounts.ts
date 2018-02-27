import * as contacts from "./contacts";
import * as cards from "./cards";
import {
    CapturePendingTransactionParams, CreateAccountCardParams, CreateTransactionParams, SimulateTransactionParams,
    VoidPendingTransactionParams
} from "./params";
import {Card, ContactIdentifier, Transaction} from "./model";

/**
 * Creates a contact first if contact doesn't exist (if userSuppliedId or shopperId provided)
 * but throws error if contactId provided and contact not found (can't create a contact 'by contactId')
 */
export async function createAccount(contact: ContactIdentifier, params: CreateAccountCardParams): Promise<Card> {
    let contactId = await getContactId(contact);
    if (!contactId) {
        if (contact.contactId) {
            throw new Error(`could not find contact with contactId ${contact.contactId}`);
        } else if (contact.userSuppliedId || contact.shopperId) {
            const contactForAccountCreation = await contacts.createContact({userSuppliedId: contact.userSuppliedId || contact.shopperId});
            contactId = contactForAccountCreation.contactId;
        }
    }

    const accountCard = await cards.getAccountCardByContactAndCurrency(contactId, params.currency);
    if (!accountCard) {
        if (params.contactId && (params.contactId !== contactId)) {
            throw new Error("Account creation error: you've specified two different contacts to attach this account to.");
        }
        return cards.createCard({
            ...params,
            contactId: contactId,
            cardType: Card.CardType.ACCOUNT_CARD
        });
    }
    return accountCard;
}

export async function createTransaction(contact: ContactIdentifier, params: CreateTransactionParams): Promise<Transaction> {
    const contactId = await getContactId(contact);
    if (!contactId) {
        throw new Error("could not find contact to transact against");
    }

    const accountCard = await cards.getAccountCardByContactAndCurrency(contactId, params.currency);
    if (!accountCard) {
        throw new Error("could not find account to transact against");
    }
    return cards.transactions.createTransaction(accountCard, params);
}

export async function capturePendingTransaction(contact: ContactIdentifier, transaction: Transaction, params: CapturePendingTransactionParams): Promise<Transaction> {
    const contactId = await getContactId(contact);
    if (!contactId) {
        throw new Error("could not find contact to transact against");
    }

    const accountCard = await cards.getAccountCardByContactAndCurrency(contactId, transaction.currency);
    if (!accountCard) {
        throw new Error("could not find account to transact against");
    }
    return cards.transactions.capturePending(accountCard, transaction, params);
}

export async function voidPendingTransaction(contact: ContactIdentifier, transaction: Transaction, params: VoidPendingTransactionParams): Promise<Transaction> {
    const contactId = await getContactId(contact);
    if (!contactId) {
        throw new Error("could not find contact to transact against");
    }

    const accountCard = await cards.getAccountCardByContactAndCurrency(contactId, transaction.currency);
    if (!accountCard) {
        throw new Error("could not find account to transact against");
    }
    return cards.transactions.voidPending(accountCard, transaction, params);
}

export async function simulateTransaction(contact: ContactIdentifier, params: SimulateTransactionParams): Promise<Transaction> {
    const contactId = await getContactId(contact);
    if (!contactId) {
        throw new Error("could not find contact to transact against");
    }

    const accountCard = await cards.getAccountCardByContactAndCurrency(contactId, params.currency);
    if (!accountCard) {
        throw new Error("could not find account to simulate transacting against");
    }
    return cards.transactions.simulateTransaction(accountCard, params);
}

async function getContactId(contact: ContactIdentifier): Promise<string> {
    if (contact.contactId) {
        return contact.contactId;
    }
    const contactObject = await contacts.getContactByAnyIdentifier(contact);
    return contactObject ? contactObject.contactId : null;
}
