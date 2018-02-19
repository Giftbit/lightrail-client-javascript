import * as lightrail from "./";
import * as accounts from "./accounts";
import {LightrailRequestError} from "./LightrailRequestError";
import {CreateContactParams, GetContactsParams, PaginationParams, UpdateContactParams} from "./params";
import {Contact, ContactIdentifier, Pagination} from "./model";

export {accounts};

export async function createContact(params: CreateContactParams): Promise<Contact> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const resp = await lightrail.request("POST", "contacts").send(params);
    if (resp.status === 200) {
        return resp.body.contact;
    }
    throw new LightrailRequestError(resp);
}

export async function getContactByAnyIdentifier(contact: ContactIdentifier) {
    if (contact.contactId) {
        return getContactById(contact.contactId);
    } else if (contact.userSuppliedId) {
        return getContactByUserSuppliedId(contact.userSuppliedId);
    } else if (contact.shopperId) {
        return getContactByUserSuppliedId(contact.shopperId);
    } else {
        throw new Error("one of contact.contactId, contact.userSuppliedId or contact.shopperId must be set");
    }
}

export async function getContacts(params?: GetContactsParams | PaginationParams): Promise<{ contacts: Contact[], pagination: Pagination }> {
    const resp = await lightrail.request("GET", "contacts").query(params);
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}

export async function getContactById(contactId: string): Promise<Contact> {
    const resp = await lightrail.request("GET", `contacts/${encodeURIComponent(contactId)}`);
    if (resp.status === 200) {
        return resp.body.contact;
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

export async function getContactByUserSuppliedId(userSuppliedId: string): Promise<Contact> {
    const resp = await getContacts({userSuppliedId});
    if (resp.contacts.length > 0) {
        return resp.contacts[0];
    }
    return null;
}

export async function updateContact(contact: string | Contact, params: UpdateContactParams): Promise<Contact> {
    const contactId = getContactId(contact);
    const resp = await lightrail.request("PATCH", `contacts/${encodeURIComponent(contactId)}`).send(params);
    if (resp.status === 200) {
        return resp.body.contact;
    }
    throw new LightrailRequestError(resp);
}

/**
 * Get contactId from the string (as the ID itself) or Contact object.
 */
export function getContactId(contact: string | Contact): string {
    if (!contact) {
        throw new Error("contact not set");
    } else if (typeof contact === "string") {
        return contact;
    } else if (contact.contactId) {
        return contact.contactId;
    } else {
        throw new Error("contact must be a string for contactId or a Contact object");
    }
}
