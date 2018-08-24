import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import {CreateContactParams} from "./params";

describe("contacts", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_PATH, "env var LIGHTRAIL_API_PATH must be set ot run the tests (for example set it in the .env file)");
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
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

    describe("getContacts()", () => {
        it("gets list", async () => {
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
            chai.assert.isNull(contact);
        });
    });


    // TEST ADDITIONAL ACTIONS USING PERSISTANT CONTACT
    const attachToContactID = "TESTS_ATTACH_TO";

    describe("attachContactToValue", () => {
        it("attaches a new Value to the Contact", async () => {
            // Create Value
            const valueID = uuid.v4().substring(0, 20);
            const value = await Lightrail.values.createValue({
                id: valueID,
                currency: "USD",
                balance: 33
            });

            // Create Contact and Attach Value
            let contact = await Lightrail.contacts.getContact(attachToContactID);
            if (!contact) {
                await Lightrail.contacts.createContact({
                    ...testContact,
                    id: attachToContactID,
                    email: "testAttach@fake.com"
                });
            }
            const attachedValue = await Lightrail.contacts.attachContactToValue(attachToContactID, {valueId: valueID});

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(attachedValue);
            chai.assert.isNull(value.body.contactId);
            chai.assert.equal(value.body.id, attachedValue.body.id);
            chai.assert.notEqual(value.body.contactId, attachedValue.body.contactId);
            chai.assert.equal(attachedValue.body.contactId, attachToContactID);
        });
    });

    describe("listContactValues(id, params)", () => {
        it("should list the values", async () => {
            const list = await Lightrail.contacts.listContactsValues(attachToContactID, {limit: 1});

            chai.assert.isNotNull(list);
            chai.assert.isArray(list.body);
            chai.assert.equal(list.body.length, 1);
        });
    });
});