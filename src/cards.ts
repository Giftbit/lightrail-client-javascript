import * as lightrail from "./";
import * as contacts from "./contacts";
import * as valueStores from "./valueStores";
import {CreateCardParams} from "./params/CreateCardParams";
import {Card} from "./model/Card";
import {LightrailRequestError} from "./LightrailRequestError";
import {Fullcode} from "./model/Fullcode";
import {UpdateCardParams} from "./params/UpdateCardParams";
import {GetCardsParams} from "./params/GetCardsParams";
import {PaginationParams} from "./params/PaginationParams";
import {Pagination} from "./model/Pagination";
import {Contact} from "./model/Contact";
import {Transaction} from "./model/Transaction";
import {CreateTransactionParams} from "./params/CreateTransactionParams";

export {valueStores};

export async function createCard(params: CreateCardParams): Promise<Card> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const resp = await lightrail.request("POST", "cards").send(params);
    if (resp.status === 200) {
        return resp.body.card;
    }
    throw new LightrailRequestError(resp);
}

export async function getCards(params: GetCardsParams & PaginationParams): Promise<{ cards: Card[], pagination: Pagination }> {
    const resp = await lightrail.request("GET", "cards").query(params);
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}

export async function getAccountCardByContactAndCurrency(contact: string | Contact, currency: string): Promise<Card> {
    const contactId = contacts.getContactId(contact);
    const resp = await getCards({cardType: Card.CardType.ACCOUNT_CARD, contactId, currency});
    if (resp.cards.length > 0) {
        return resp.cards[0];
    }
    return null;
}

export async function getCardById(cardId: string): Promise<Card> {
    const resp = await lightrail.request("GET", `cards/${encodeURIComponent(cardId)}`);
    if (resp.status === 200) {
        return resp.body.card;
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

export async function getCardByUserSuppliedId(userSuppliedId: string): Promise<Card> {
    const resp = await getCards({userSuppliedId});
    if (resp.cards.length > 0) {
        return resp.cards[0];
    }
    return null;
}

export async function getFullcode(card: string | Card): Promise<Fullcode> {
    const cardId = getCardId(card);
    const resp = await lightrail.request("GET", `cards/${encodeURIComponent(cardId)}/fullcode`);
    if (resp.status === 200) {
        return resp.body.fullcode;
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

export async function updateCard(card: string | Card, params: UpdateCardParams): Promise<Card> {
    const cardId = getCardId(card);
    const resp = await lightrail.request("PATCH", `cards/${encodeURIComponent(cardId)}`).send(params);
    if (resp.status === 200) {
        return resp.body.card;
    }
    throw new LightrailRequestError(resp);
}

export async function createTransaction(card: string | Card, params: CreateTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const cardId = getCardId(card);
    const resp = await lightrail.request("POST", `cards/${encodeURIComponent(cardId)}/transactions`).send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export function getCardId(card: string | Card): string {
    if (!card) {
        throw new Error("card not set");
    } else if (typeof card === "string") {
        return card;
    } else if (card.cardId) {
        return card.cardId;
    } else {
        throw new Error("card must be a string for cardId or a Card object");
    }
}
