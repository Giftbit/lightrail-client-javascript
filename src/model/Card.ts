export interface Card {

    cardId: string;
    userSuppliedId: string;
    cardType: Card.CardType;
    currency: string;
    contactId: string;
    dateCreated: string;
    categories: {categoryId: string, key: string, value: string}[];

}

export namespace Card {
    export type CardType = "GIFT_CARD" | "ACCOUNT_CARD";
    export namespace CardType {
        export const GIFT_CARD: CardType = "GIFT_CARD";
        export const ACCOUNT_CARD: CardType = "ACCOUNT_CARD";
    }
}
