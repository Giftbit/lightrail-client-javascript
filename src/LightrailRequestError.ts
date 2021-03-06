import * as superagent from "superagent";

export class LightrailRequestError extends Error {

    readonly isLightrailRequestError = true;
    readonly status: number;
    readonly messageCode: string;
    readonly body: any;
    readonly method: string;
    readonly path: string;

    constructor(response: superagent.Response) {
        super((response.body && response.body.message) || response.text);
        this.status = response.status;
        this.messageCode = (response.body && response.body.messageCode) || null;
        this.body = response.body;
        this.method = (response.error as superagent.HTTPError).method;
        this.path = (response.error as superagent.HTTPError).path;
    }
}
