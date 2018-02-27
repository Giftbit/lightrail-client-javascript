/**
 * Options to the generateShopperToken function.
 */
export interface GenerateShopperTokenOptions {
    /**
     * The number of seconds the shopper token will be valid for.
     */
    validityInSeconds?: number;

    /**
     * Additional data that can be signed in the shopper token.
     */
    metadata?: {[name: string]: any};
}
