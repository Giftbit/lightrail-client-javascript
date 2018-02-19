/**
 * Identifies a Contact by contactId, userSuppliedId, or shopperId.
 */
export interface ContactIdentifier {
    contactId?: string;
    userSuppliedId?: string;
    shopperId?: string;
}
