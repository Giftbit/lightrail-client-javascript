import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import {CreateContactParams} from "./params";

describe("contacts", () => {
    before(() => {
        Lightrail.configure({
            restRoot: process.env.LIGHTRAIL_API_PATH || "",
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    const id = uuid.v4().substring(0, 20);
    const testContact: CreateContactParams = {
        id,
        firstName: "TesterFace",
        lastName: "Mctesty Face",
        email: "tester@face.com",
        // tags: ["tag1", "tag2", "tag3", "tag4", "tag5"], // Tagging not Ready yet?
        metadata: {
            "deepestFear": "spiders"
        }
    };

    describe("createContact()", () => {
        it("creates a contact", async () => {
            const contact = await Lightrail.contacts.createContact(testContact);

            chai.assert.isNotNull(contact.body);
            chai.assert.isString(contact.body.id);
            chai.assert.equal(contact.body.id, id);
            chai.assert.equal(contact.body.firstName, testContact.firstName);
            chai.assert.equal(contact.body.lastName, testContact.lastName);
            chai.assert.equal(contact.body.email, testContact.email);
            chai.assert.equal(contact.body.metadata["deepestFear"], testContact.metadata["deepestFear"]);
        });
    });

    describe("listContacts()", () => {
        it("lists contacts", async () => {
            const contacts = await Lightrail.contacts.listContacts();

            chai.assert.isNotNull(contacts.body);
            chai.assert.isArray(contacts.body);
            chai.assert.equal(contacts.body.filter(c => (c.id === id)).length, 1);
        });

        it("filters for lastName using eq", async () => {
            const contacts = await Lightrail.contacts.listContacts({
                lastName: {
                    eq: "Mctesty Face"
                }
            });

            chai.assert.isNotNull(contacts);
            chai.assert.isArray(contacts.body);
            chai.assert.equal(contacts.body.filter(p => p.lastName === "Mctesty Face").length, contacts.body.length);
            chai.assert.equal(contacts.body.filter(c => (c.id === id)).length, 1);
        });
    });

    describe("getContact(id)", () => {
        it("gets the expected contact", async () => {
            const contact = await Lightrail.contacts.getContact(id);

            chai.assert.isNotNull(contact);
            chai.assert.isString(contact.body.id);
            chai.assert.equal(contact.body.id, id);
            chai.assert.equal(contact.body.firstName, testContact.firstName);
            chai.assert.equal(contact.body.lastName, testContact.lastName);
            chai.assert.equal(contact.body.email, testContact.email);
            chai.assert.equal(contact.body.metadata["deepestFear"], testContact.metadata["deepestFear"]);
        });
    });

    describe("updateContact(id, params)", () => {
        it("changes contact name, email and metadata properties using contactId", async () => {
            const params = {
                firstName: "Johnny",
                lastName: "Test Face",
                email: "jtestface@tester.com",
                metadata: {deepestFear: "sharks"}
            };

            const updatedContact = await Lightrail.contacts.updateContact(id, params);

            chai.assert.isNotNull(updatedContact);
            chai.assert.isString(updatedContact.body.id);
            chai.assert.equal(updatedContact.body.id, id);
            chai.assert.equal(updatedContact.body.firstName, params.firstName);
            chai.assert.equal(updatedContact.body.lastName, params.lastName);
            chai.assert.equal(updatedContact.body.email, params.email);
            chai.assert.equal(updatedContact.body.metadata["deepestFear"], params.metadata["deepestFear"]);
        });
    });

    describe("deleteContact()", () => {
        it("deletes our contact using the id", async () => {
            const deleted = await Lightrail.contacts.deleteContact(id);
            chai.assert.isNotNull(deleted);
            chai.assert.isTrue(deleted.body.success);

            const contact = await Lightrail.contacts.getContact(id);
            chai.assert.isNull(contact.body);
            chai.assert.equal(contact.status, 404);
        });
    });


    // TEST ADDITIONAL ACTIONS USING PERSISTENT CONTACT
    const attachValueID = uuid.v4().substring(0, 20);
    const attachToContactID = "TESTS_ATTACH_TO";

    describe("attachContactToValue", () => {
        it("attaches a new Value to the Contact", async () => {
            // Create Value
            const value = await Lightrail.values.createValue({
                id: attachValueID,
                currency: "USD",
                balance: 33
            });

            // Create Contact and Attach Value
            const contact = await Lightrail.contacts.getContact(attachToContactID);
            if (!contact.body) {
                await Lightrail.contacts.createContact({
                    ...testContact,
                    id: attachToContactID,
                    email: "testAttach@fake.com"
                });
            }
            const attachedValue = await Lightrail.contacts.attachContactToValue(attachToContactID, {valueId: attachValueID});

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(attachedValue);
            chai.assert.isNull(value.body.contactId);
            chai.assert.equal(value.body.id, attachedValue.body.id);
            chai.assert.notEqual(value.body.contactId, attachedValue.body.contactId);
            chai.assert.equal(attachedValue.body.contactId, attachToContactID);
        });
    });

    const attachGenericCodeValueID = uuid.v4().substring(0, 20);
    describe("attachContactToGenericCodeValue", () => {
        it("attaches a new Generic Code to the Contact", async () => {
            // Create Value
            const value = await Lightrail.values.createValue({
                id: attachGenericCodeValueID,
                currency: "USD",
                balanceRule: {
                    rule: "currentLineItem.lineTotal.subtotal * 0.5",
                    explanation: "50% off"
                },
                isGenericCode: true,
                code: `SEASONAL_${uuid.v4().substring(0, 4)}`,
                genericCodeOptions: {
                    perContact: {
                        usesRemaining: 1
                    }
                }
            });

            // Create Contact and Attach Generic Code Value
            const contact = await Lightrail.contacts.getContact(attachToContactID);
            if (!contact.body) {
                await Lightrail.contacts.createContact({
                    ...testContact,
                    id: attachToContactID,
                    email: "testAttach@fake.com"
                });
            }
            const attachedValue = await Lightrail.contacts.attachContactToValue(attachToContactID, {valueId: attachGenericCodeValueID});

            chai.assert.isNull(value.body.contactId);
            chai.assert.notEqual(value.body.id, attachedValue.body.id);
            chai.assert.equal(value.body.id, attachedValue.body.attachedFromValueId);
            chai.assert.equal(attachToContactID, attachedValue.body.contactId);
        });
    });

    describe("detachContactFromValue", () => {
        it("detaches an attached value", async () => {

            // Ensure we have a Value
            let value = await Lightrail.values.getValue(attachValueID);
            if (!value.body) {
                value = await Lightrail.values.createValue({
                    id: attachValueID,
                    currency: "USD",
                    balance: 33
                });
            }
            chai.assert.isNotNull(value);

            if (value.body.contactId !== attachToContactID) {
                // Ensure Contact Exists
                const contact = await Lightrail.contacts.getContact(attachToContactID);
                if (!contact.body) {
                    await Lightrail.contacts.createContact({
                        ...testContact,
                        id: attachToContactID,
                        email: "testAttach@fake.com"
                    });
                }
                chai.assert.isNotNull(contact);
            }

            const attachedValue = await Lightrail.contacts.attachContactToValue(attachToContactID, {valueId: attachValueID});
            chai.assert.isNotNull(attachedValue);
            chai.assert.equal(attachedValue.body.contactId, attachToContactID);

            const detachedValue = await Lightrail.contacts.detachContactFromValue(attachToContactID, {valueId: attachValueID});
            chai.assert.isNotNull(detachedValue);
            chai.assert.equal(detachedValue.body.id, attachedValue.body.id);
            chai.assert.notEqual(detachedValue.body.contactId, attachedValue.body.contactId);
            chai.assert.isNull(detachedValue.body.contactId);
        });
    });

    describe("listContactValues(id, params)", () => {
        it("should list the values", async () => {

            const value = await Lightrail.values.createValue({
                id: uuid.v4().substring(0, 20),
                currency: "USD",
                balance: 33
            });

            await Lightrail.contacts.attachContactToValue(attachToContactID, {valueId: value.body.id});

            const list = await Lightrail.contacts.listContactsValues(attachToContactID, {limit: 1});

            chai.assert.isNotNull(list);
            chai.assert.isArray(list.body);
            chai.assert.isAtLeast(list.body.length, 1);
        });
    });
});
