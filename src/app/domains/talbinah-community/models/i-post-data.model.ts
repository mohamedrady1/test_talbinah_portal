import { ITab } from "./i-share-post-tab.model";

export interface PostData {
    mood: string;
    category: ITab | null;
    createdAt: Date;
}