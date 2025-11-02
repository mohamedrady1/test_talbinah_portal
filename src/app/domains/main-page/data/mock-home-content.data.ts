import { IHomeContentData } from "../dtos";
import {
  ALL_BANNERS,
  FEATURED_HOME_BANNERS,
  PROMOTIONAL_BANNERS,
  ROUTE_BANNERS,
  POPUP_BANNERS,
  LINK_BANNERS,
  ID_BANNERS
} from "./mock-banners-all-types.data";

export const mockHomeData: IHomeContentData = {
  quickAccessCards: [
    { id: '1', title: 'Schedule', iconUrl: 'calendar', route: '/schedule' },
    { id: '2', title: 'Library', iconUrl: 'book', route: '/library' }
  ],
  podcastStories: [
    {
      id: '1',
      title: 'string',
      description: 'string',
      audioUrl: 'string',
      imageUrl: 'string',
      duration: 10 // in seconds
    },
    {
      id: '2',
      title: 'Second',
      description: 'Second',
      audioUrl: 'Second',
      imageUrl: 'Second',
      duration: 10 // in seconds
    }
  ],

  banners: ALL_BANNERS
};
