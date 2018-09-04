/**
 * Options to configure the Lightrail client.
 */
export interface LightrailOptions {
    /**
     * The Lightrail API key as retrieved from the web app.
     */
    apiKey: string;

    /**
     * Is this code running in the browser?
     *
     */
    isBrowser: boolean;

    /**
     * The REST root URL.  Usually this is only set for testing.
     */
    restRoot: string;

    /**
     * The shared secret as available from the web app.
     */
    sharedSecret: string;

    /**
     * Whether to log requests using superagent-logger.  If `true` then
     * superagent-logger must be available.
     */
    logRequests: boolean;

    /**
     * Optional parameter that can be used to set additional headers in requests to Lightrail.
     */
    additionalHeaders: { [key: string]: string; };
}
