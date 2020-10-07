import * as lightrail from "./";
import {formatFilterParams, formatResponse, isSuccessStatus} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import {
    AttachContactToValueParams,
    AttachContactToValueResponse,
    CreateContactParams,
    CreateContactResponse,
    DeleteContactResponse,
    GetContactResponse,
    ListContactsParams,
    ListContactsResponse,
    ListContactsValuesParams,
    ListContactsValuesResponse,
    UpdateContactParams,
    UpdateContactResponse
} from "./params";
import {Contact} from "./model";
import {
    DetachContactFromValueParams,
    DetachContactFromValueResponse
} from "./params/contacts/DetachContactFromValueParams";

/**
 * See: https://apidocs.lightrail.com/#operation/CreateContact
 *
 * Example:
 * ```js
 * const contact = await Lightrail.contacts.createContact({
 *     id: "abcdefg",
 *     email: "ex@example.com"
 * });
 * ```
 */
export async function createContact(params: CreateContactParams): Promise<CreateContactResponse> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.id) {
        throw new Error("params.id not set");
    }

    const resp = await lightrail.request("POST", "contacts").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/GetaContact
 *
 * Example:
 * ```js
 * const contact = await Lightrail.contacts.getContact("abcdefg");
 * ```
 */
export async function getContact(contact: string | Contact): Promise<GetContactResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("GET", `contacts/${encodeURIComponent(contactId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/ListContacts
 *
 * Example:
 * ```js
 * const contacts = await Lightrail.contacts.listContacts({limit: 5});
 * const contactsLimited = await Lightrail.contacts.listContacts({limit: 5});
 * ```
 */
export async function listContacts(params?: ListContactsParams): Promise<ListContactsResponse> {
    const resp = await lightrail.request("GET", "contacts").query(formatFilterParams(params));
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/ListaContactsValues
 *
 * Example:
 * ```js
 * const values = await Lightrail.contacts.listContactsValues("abcdefg");
 * const valuesLimited = await Lightrail.contacts.listContactsValues("abcdefg", {limit: 5});
 * ```
 */
export async function listContactsValues(contact: string | Contact, params?: ListContactsValuesParams): Promise<ListContactsValuesResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("GET", `contacts/${encodeURIComponent(contactId)}/values`).query(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/UpdateContact
 *
 * Example:
 * ```js
 * const updatedContact = await Lightrail.contacts.updateContact("abcdefg", {email: "new.ex@example.com"});
 * ```
 */
export async function updateContact(contact: string | Contact, params: UpdateContactParams): Promise<UpdateContactResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("PATCH", `contacts/${encodeURIComponent(contactId)}`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/AttachContactToValue
 *
 * Example:
 * ```js
 * const valueAttachedById = await Lightrail.contacts.attachContactToValue("abcdefg", {valueId: "hijklmnop"});
 * const valueAttachedByCode = await Lightrail.contacts.attachContactToValue("abcdefg", {code: "PROMOCODE"});
 * ```
 */
export async function attachContactToValue(contact: string | Contact, params: AttachContactToValueParams): Promise<AttachContactToValueResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("POST", `contacts/${encodeURIComponent(contactId)}/values/attach`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/DetachContactFromValue
 *
 * Example:
 * ```js
 * const valueDetached = await Lightrail.contacts.detachContactFromValue("abcdefg", {valueId: "hijklmnop"});
 * ```
 */
export async function detachContactFromValue(contact: string | Contact, params: DetachContactFromValueParams): Promise<DetachContactFromValueResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("POST", `contacts/${encodeURIComponent(contactId)}/values/detach`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/DeleteContact
 *
 * Example:
 * ```js
 * await Lightrail.contacts.deleteContact("abcdefg"});
 * ```
 */
export async function deleteContact(contact: string | Contact): Promise<DeleteContactResponse> {
    const contactId = getContactId(contact);

    const resp = await lightrail.request("DELETE", `contacts/${encodeURIComponent(contactId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * @internal
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
