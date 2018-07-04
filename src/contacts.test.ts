import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import {CreateContactParams} from "./params";

describe("contacts", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
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
            const contacts = await Lightrail.contacts.getContacts();

            chai.assert.isNotNull(contacts.body);
            chai.assert.isArray(contacts.body);
            chai.assert.equal(contacts.body.filter(c => (c.id === id)).length, 1);
        });

        it("filters for lastName using eq", async () => {
            const contacts = await Lightrail.contacts.getContacts({
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
            const contact = await Lightrail.contacts.getContactById(id);

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
        //TODO
    });
});