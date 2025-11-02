// --- Specific Data DTOs (for the 'data' field of IApiResponse) ---

import { IDoctorItem } from "../../../../shared";
import { IPodcast } from "../../../podcasts";
import { TalbinahItemType } from "../../enums";
import { IArticle, IDoctor } from "../../models";

export interface ITalbinahBotDataDto {
  // This could be a general data structure for simple bot interactions
  // Or it might be more specific for certain endpoints if the 'data' payload varies widely.
  // For now, let's assume a simple message response.
  response_message: string;
  // ... other general bot response fields
}

export interface IChatHistoryItemDataDto {
  id: number;
  name: string; // Name of the chat
  created_at?: string; // ISO date string
  selected?: boolean;
  highlightedTitle?: string; // For highlighted search results
  // ... other history-related fields
}

export interface IChatMessageDataDto extends IChatConversationDataDto {

}

export interface IChatConversationDataDto {
  id?: string | number; // Added this property
  message: string | null;
  message_timestamp?: string | null;
  replay_timestamp?: string | null;
  replay: string | null;
  list: IRecommendationListDto | null;
  chat?: IChatHistoryItemDataDto;
  chat_history_id?: number; // Made optional
  user_id?: number; // Made optional
  isDraft?: boolean;
}

export interface IRecommendationListDto {
  type?: TalbinahItemType.DOCTOR | TalbinahItemType.PODCAST | TalbinahItemType.ARTICLE | TalbinahItemType.IMAGES | TalbinahItemType.VIDEO | TalbinahItemType.FILE | TalbinahItemType.QUIZ;
  items?: IDoctor[] | IDoctorItem[] | IPodcast[] | IArticle[] | [] | null; // This array will contain items of the specific 'type'
}
