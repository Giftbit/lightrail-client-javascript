import * as chai from "chai";
import * as superagent from "superagent";
import {LightrailRequestError} from "./LightrailRequestError";

describe("LightrailRequestError", () => {
    it("fills in status, message and messageCode", () => {
        const body = {
            status: 404,
            message: "Card with id 'card-2e6eaf65592545c6a699410d10893412' does not exist.",
            messageCode: "CardNotFound"
        };
        const responseError = new Error() as superagent.ResponseError;
        responseError.status = body.status;
        responseError.text = "";
        responseError.method = "GET";
        responseError.path = "/v1/cards/card-2e6eaf65592545c6a699410d10893412a";

        // This is partial because I'm lazy and we don't need most of these properties.
        const response: Partial<superagent.Response> = {
            body,
            error: responseError,
            status: body.status,
            text: JSON.stringify(body)
        };

        const error = new LightrailRequestError(response as any);

        chai.assert.equal(error.status, body.status);
        chai.assert.equal(error.message, body.message);
        chai.assert.equal(error.messageCode, body.messageCode);
    });
});
