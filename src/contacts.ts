import * as lightrail from "./";
import {formatFilterParams, formatResponse} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import {
    CreateContactParams,
    CreateContactResponse,
    GetContactsParams,
    GetContactsResponse,
    UpdateContactParams
} from "./params";
import {Contact} from "./model";
import {LightrailResponse} from "./model/LightrailResponse";
import {DeleteContactResponse} from "./params/contacts/DeleteContactParams";
import {UpdateContactResponse} from "./params/contacts/UpdateContactParams";

export async function getContacts(params?: GetContactsParams): Promise<GetContactsResponse> {
    const resp = await lightrail.request("GET", "contacts").query(formatFilterParams(params));
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    }
    throw new LightrailRequestError(resp);
}

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

export async function getContactById(contactId: string): Promise<LightrailResponse<Contact>> {
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

export async function updateContact(contact: string | Contact, params: UpdateContactParams): Promise<UpdateContactResponse> {
    const contactId = getContactId(contact);
    const resp = await lightrail.request("PATCH", `contacts/${encodeURIComponent(contactId)}`).send(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

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

// export async function getContactByAnyIdentifier(contact: ContactIdentifier) {
//     if (contact.contactId) {
//         return getContactById(contact.contactId);
//     } else if (contact.userSuppliedId) {
//         return getContactByUserSuppliedId(contact.userSuppliedId);
//     } else if (contact.shopperId) {
//         return getContactByUserSuppliedId(contact.shopperId);
//     } else {
//         throw new Error("one of contact.contactId, contact.userSuppliedId or contact.shopperId must be set");
//     }
// }
//
//


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