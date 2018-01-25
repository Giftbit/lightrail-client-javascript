export interface CreateAccountCardParams {

    userSuppliedId: string;
    currency: string;
    initialValue?: number;
    categories?: { [key: string]: string };
    contactId?: string;
    expires?: string;
    startDate?: string | Date;
    inactive?: boolean;
    metadata?: { [key: string]: any };
    programId?: string;

}
