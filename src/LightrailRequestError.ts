import * as superagent from "superagent";

export class LightrailRequestError extends Error {

    readonly isLightrailRequestError = true;
    readonly status: number;
    readonly body: any;
    readonly method: string;
    readonly path: string;

    constructor(response: superagent.Response) {
        super((response.body && response.body.message) || response.text);
        this.status = response.status;
        this.body = response.body;
        this.method = response.error.method;
        this.path = response.error.path;
    }
}
