import * as lightrail from "./";
import {Pagination} from "./model/Pagination";
import {LightrailRequestError} from "./LightrailRequestError";
import {GetContactsParams} from "./params/GetContactsParams";
import {PaginationParams} from "./params/PaginationParams";
import {Contact} from "./model/Contact";
import {UpdateContactParams} from "./params/UpdateContactParams";
import {CreateContactParams} from "./params/CreateContactParams";

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

export async function getContacts(params?: GetContactsParams & PaginationParams): Promise<{ contacts: Contact[], pagination: Pagination }> {
    const resp = await lightrail.request("GET", "contacts").query(params);
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}

/**
 * This assumes email is unique, which I think we're moving to.
 */
export async function getContactByEmail(email: string): Promise<Contact> {
    const resp = await this.getContacts({email});
    if (resp.contacts.length > 0) {
        return resp.contacts[0];
    }
    return null;
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
    const resp = await this.getContacts({userSuppliedId});
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
