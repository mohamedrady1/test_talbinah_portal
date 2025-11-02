import { EmojiCategory } from "../../common/core/data-access/pagination/enums/emoji-data";

export interface Emoji {
    unified: string; // e.g. "1F600"
    name: string;    // e.g. "grinning face"
    shortName: string; // e.g. "grinning"
    category: EmojiCategory;
}