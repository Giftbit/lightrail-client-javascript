export interface CreateValueStoreParams {

    userSuppliedId: string;
    currency: string;
    programId: string;
    expires?: string;
    startDate?: string | Date;
    initialValue?: number;

}
