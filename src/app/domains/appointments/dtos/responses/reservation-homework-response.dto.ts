import { IGlobalArticleItemModel, IGlobalMentalHealthScaleModel, IGlobalPodcastItemModel } from "../../../../common";

export interface IReservationHomeworkResponseDto {
  status: boolean;
  message: string | null;
  data: {
    mental_health: IReservationHomeworkMentalHealthItem[];
    article: IReservationHomeworkArticleItem[];
    podcast: IReservationHomeworkPodcastItem[];
  };
}

export interface IReservationHomeworkMentalHealthItem {
  id: number;
  reservation_id: number;
  user_id: number;
  assignment_type: string;
  assignment_id: number;
  review: number;
  result: string;
  created_at: string;
  updated_at: string;
  assignment: IGlobalMentalHealthScaleModel;
  type: 'mental_health';
}

export interface IReservationHomeworkArticleItem {
  id: number;
  reservation_id: number;
  user_id: number;
  assignment_type: string;
  assignment_id: number;
  review: number;
  result: string | null;
  created_at: string;
  updated_at: string;
  assignment: IGlobalArticleItemModel;
  type: 'article';
}

export interface IReservationHomeworkPodcastItem {
  id: number;
  reservation_id: number;
  user_id: number;
  assignment_type: string;
  assignment_id: number;
  review: number;
  result: string | null;
  created_at: string;
  updated_at: string;
  assignment: IGlobalPodcastItemModel | null;
  type: 'podcast';
}
