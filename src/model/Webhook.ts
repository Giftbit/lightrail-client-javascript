export interface Webhook {
    id: string;
    url: string;
    events: string[];
    secrets: {
        id: string;
        secret: string;
        createdDate: string;
    }[];
    active: boolean;
    createdDate: string;
    updatedDate: string;
    createdBy: string;
}
