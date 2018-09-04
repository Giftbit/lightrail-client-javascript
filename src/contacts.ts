import * as lightrail from "./";
import {formatFilterParams, formatResponse} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import {
    CreateContactParams,
    CreateContactResponse,
    ListContactsParams,
    ListContactsResponse,
    UpdateContactParams
} from "./params";
import {Contact} from "./model";
import {DeleteContactResponse} from "./params/contacts/DeleteContactParams";
import {UpdateContactResponse} from "./params/contacts/UpdateContactParams";
import {GetContactResponse} from "./params/contacts/GetContactParams";
import {ListContactsValuesParams, ListContactsValuesResponse} from "./params/contacts/ListContactsValuesParams";
import {AttachContactToValueParams, AttachContactToValueResponse} from "./params/contacts/AttachContactToValueParams";

// CREATE
export async function createContact(params: CreateContactParams): Promise<CreateContactResponse> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.id) {
        throw new Error("params.id not set");
    }

    const resp = await lightrail.request("POST", "contacts").send(params);
    if (resp.status === 200 || resp.status === 201) {
        return (
            formatResponse(resp)
        );
    }
    throw new LightrailRequestError(resp);
}

// READ
export async function getContact(contact: string | Contact): Promise<GetContactResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("GET", `contacts/${encodeURIComponent(contactId)}`);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

export async function listContacts(params?: ListContactsParams): Promise<ListContactsResponse> {
    const resp = await lightrail.request("GET", "contacts").query(formatFilterParams(params));
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    }
    throw new LightrailRequestError(resp);
}

export async function listContactsValues(contact: string | Contact, params?: ListContactsValuesParams): Promise<ListContactsValuesResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("GET", `contacts/${encodeURIComponent(contactId)}/values`).query(params);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

// UPDATE
export async function updateContact(contact: string | Contact, params: UpdateContactParams): Promise<UpdateContactResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("PATCH", `contacts/${encodeURIComponent(contactId)}`).send(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

export async function attachContactToValue(contact: string | Contact, params: AttachContactToValueParams): Promise<AttachContactToValueResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("POST", `contacts/${encodeURIComponent(contactId)}/values/attach`).send(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

// DELETE
export async function deleteContact(contact: string | Contact): Promise<DeleteContactResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("DELETE", `contacts/${encodeURIComponent(contactId)}`);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
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
    } else if (contact.id) {
        return contact.id;
    } else {
        throw new Error("contact must be a string for contactId or a Contact object");
    }
}