export interface IGlobalNotification {
    id: number;
    title: string;
    body: string;
    created_at: string;
    user?: {
        emoji?: {
            image?: string;
        };
    };
    action?: string | null;
    page?: string;
    pageID?: string;
    link?: string;
    received?: number;
    type?: string;
    icon?: string;
    is_read?: boolean | 0 | 1;
}
