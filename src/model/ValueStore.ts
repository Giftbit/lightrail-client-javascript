export interface ValueStore {

    cardId: string;
    valueStoreId: string;
    valueStoreType: ValueStore.ValueStoreType;
    currency: string;
    dateCreated: string;
    programId: string;
    expires?: string;
    startDate: string;

}

export namespace ValueStore {
    export type ValueStoreType = "PRINCIPAL" | "ATTACHED";
    export namespace ValueStoreType {
        export const PRINCIPAL: ValueStoreType = "PRINCIPAL";
        export const ATTACHED: ValueStoreType = "ATTACHED";
    }
}
