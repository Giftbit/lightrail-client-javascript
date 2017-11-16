import * as chai from "chai";
import {v4 as uuid} from "uuid";
import * as Lightrail from "./";
import * as contacts from "./contacts";
import {CreateAccountCardParams} from "./params/CreateAccountCardParams";

const sampleContactId: string = process.env.CONTACT_ID;
const sampleShopperId: string = process.env.SHOPPER_ID;
const currency: string = "USD";
const accountCreationParams: CreateAccountCardParams = {
    currency: currency,
    cardType: "ACCOUNT_CARD",
    userSuppliedId: uuid(),
};


describe("account methods", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        chai.assert.isString(process.env.CARD_ID, "env var CARD_ID must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    describe("createAccount", () => {
        it("creates an account - using contact id", async () => {
            const res = await contacts.accounts.createAccount({contactId: sampleContactId}, accountCreationParams);
            chai.assert.equal(res.contactId, sampleContactId);
        });
        it.only("creates an account - using shopperId", async () => {
            const res = await contacts.accounts.createAccount({shopperId: sampleShopperId}, accountCreationParams);
            console.log(res);
            const contact = await contacts.getContactById(res.contactId);
            chai.assert.equal(contact.userSuppliedId, sampleShopperId);
        });
    });
});
