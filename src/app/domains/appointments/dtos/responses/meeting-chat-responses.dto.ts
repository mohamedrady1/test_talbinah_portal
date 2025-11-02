
import { IGlobalDoctorCardModel, IGlobalDoctorCopounModel, IGlobalMentalHealthScaleModel } from "../../../../common";
import { IDoctorItem } from "../../../../shared";
import { IArticleCategory } from "../../../articles";
import { IArticleImage } from "../../../articles/models";
import { IMentalHealthQuestionDto, IMentalHealthResultDto } from "../../../mental-health-scales";
import { IPodcast } from "../../../podcasts";
import { IArticle, IDoctor } from "../../../talbinah-bot/models";

export interface IMeetingChatItemDataDto {
  id: number;
  name: string;
  created_at?: string;
  selected?: boolean;
  highlightedTitle?: string;
}

export interface IReservationChatResponseDto {
  message: string | null;
  message_timestamp?: string | null;
  replay_timestamp?: string | null;
  replay: string | null;
  list: IMeetingRecommendationListDto | null;
  chat?: IMeetingChatItemDataDto
}

export interface IMeetingRecommendationListDto {
  type?: string;
  items?: IDoctor[] | IDoctorItem[] | IPodcast[] | IArticle[] | [] | null; // This array will contain items of the specific 'type'
}


export interface ISendMeetingChatItem {
  id?: number | string | null,
  senderId: string; // required
  message: string | null
  | IGlobalDoctorCopounModel
  | IGlobalMentalHealthScaleModel
  | IGlobalDoctorCardModel
  | ICouponMessage
  | IPodcastMessage
  | IArticleMessage; // extended from server model

  msgType: string; // required
  msgTime?: number; // optional (auto-generated timestamp)
  timestamp?: any; // Firestore server timestamp

  is_read?: '0' | '1'; // default: '0' (as string for Firebase)
  isMessageOpened?: '0' | '1'; // default: '0' (as string for Firebase)

  fileName?: string | null;
  thumbnailVideoImage?: string | null;
  videoDuration?: string | null;
  recorderTimer?: string | null;

  mentalHealthResult?: unknown | null;
  homeworkId?: string | number | null;
  replyReference?: ISendMeetingChatItem | any | null;

  // Additional fields from backend model (marked optional)
  clientId?: number | string | null;
  fileSize?: number | null;
  is_transferred?: boolean | null;
  is_recommend?: boolean | null;
}

// NEW Interfaces
export interface IMeetingChatItem {
  id?: number;
  clientId?: number | string | null;
  senderId: number;
  message: string | null | IGlobalDoctorCopounModel | IGlobalMentalHealthScaleModel | IGlobalDoctorCardModel | ICouponMessage | IPodcastMessage | IArticleMessage;
  msgType: string;
  msgTime: number;
  is_read: number;
  fileName: string | null;
  fileSize?: number | null;
  thumbnailVideoImage: string | null;
  recorderTimer: string | null;
  isMessageOpened: number | null;
  is_transferred?: boolean | null;
  is_recommend?: boolean | null;
  mentalHealthResult: unknown | null;
  homeworkId: number | null;
  replyReference: IMeetingChatItem | null;
}

export interface ICouponMessage {
  id: number;
  coupon: string;
  discount: number;
  discount_type: string;
  type: string;
  doctor_id: number;
  duration_id: number | null;
  payment_id: number | null;
  user_limit_count: number;
  users_limit_count: number;
  usage_count: number;
  start_date: string;
  end_date: string;
  status: number;
  is_appear: number;
  created_at: string;
  updated_at: string;
}

export interface IPodcastMessage {
  id: number;
  podcast_category_id: number | null;
  title: string;
  description: string;
  thumbnail_image: string;
  background_color: string;
  file: string;
  file_type: string;
  duration: string;
  type: string;
  status: number;
  created_at: string;
  updated_at: string;
}


export interface IArticleMessage {
  id: number;
  main_lang?: string;
  translate_id?: number | null;
  article_category_id?: number | null; // Only in main article
  title?: string;
  description?: string; // HTML content
  trending?: number; // Only in main article
  reading_time?: number;
  type?: string; // Only in main article (e.g., "free")
  active?: number; // Only in main article
  deleted_at?: string | null; // Only in main article
  created_at: string;
  updated_at?: string;
  original_active?: string; // Only in main article
  image?: string | IArticleImage | null; // Only in main article
  original_trending?: string | null;
  article_category?: IArticleCategory | null; // Only in main article
  is_bookmark?: boolean;
  new?: boolean;
  keywords?: string[]; // Only in main article
  category?: string; // Only in related articles
}


export interface IQuizMessage {
  id: number;
  title: string;
  color?: string;
  icon?: string;
  question_number?: number;
  duration?: number;
  answer_type?: string;
  total_grade?: number;
  mental_category_name?: string;
  percentage?: number;
  sub_title?: string;
  reference?: string;
  brief?: string;
  usage_count?: number;
  created_at?: string; // Consider using Date if you parse it
  updated_at?: string; // Consider using Date if you parse it
  questions?: IMentalHealthQuestionDto[];
  results?: IMentalHealthResultDto[];
}
