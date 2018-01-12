import * as lightrail from "./";
import * as cards from "./cards";
import {Card} from "./model/Card";
import {CreateValueStoreParams} from "./params/CreateValueStoreParams";
import {ValueStore} from "./model/ValueStore";
import {LightrailRequestError} from "./LightrailRequestError";
import {GetValueStoresParams} from "./params/GetValueStoresParams";
import {PaginationParams} from "./params/PaginationParams";
import {Pagination} from "./model/Pagination";

export async function createValueStore(card: string | Card, params: CreateValueStoreParams): Promise<ValueStore> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const cardId = cards.getCardId(card);
    const resp = await lightrail.request("POST", `cards/${encodeURIComponent(cardId)}/valueStores`).send(params);
    if (resp.status === 200) {
        return resp.body.valueStore;
    }
    throw new LightrailRequestError(resp);
}

export async function getValueStores(card: string | Card, params: GetValueStoresParams | PaginationParams): Promise<{ valueStores: ValueStore[], pagination: Pagination }> {
    const cardId = cards.getCardId(card);
    const resp = await lightrail.request("GET", `cards/${encodeURIComponent(cardId)}/valueStores`).query(params);
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}

export async function getValueStoreById(card: string | Card, valueStoreId: string): Promise<ValueStore> {
    const cardId = cards.getCardId(card);
    const resp = await lightrail.request("GET", `cards/${encodeURIComponent(cardId)}/valueStores/${encodeURIComponent(valueStoreId)}`);
    if (resp.status === 200) {
        return resp.body.valueStore;
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}
