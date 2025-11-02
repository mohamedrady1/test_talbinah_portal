import { IGlobalStorySliderConfig, IStoryCard } from '../models/story-slider.models';

// Base path for images to make it easier to manage
export const SLIDER_IMAGES_BASE_PATH: string = 'images/trash'; // Adjust if images are in different sub-folders

export const MOCK_STORY_CARDS: IStoryCard[] = [
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "استشارة طبية عامة",
    doctorName: "د. أحمد مصطفى",
    id: 1,
    link: "/consultation/1"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "جراحة العظام",
    doctorName: "د. سامي علي",
    id: 2,
    link: "/consultation/2"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب الأطفال",
    doctorName: "د. محمد زكريا",
    id: 3,
    link: "/consultation/3"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب الأسنان",
    doctorName: "د. محمود حسين",
    id: 4,
    link: "/consultation/4"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "الطب الباطني",
    doctorName: "د. علي عبد الله",
    id: 5,
    link: "/consultation/5"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب العيون",
    doctorName: "د. يوسف أحمد",
    id: 6,
    link: "/consultation/6"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب النساء والتوليد", // Corrected title
    doctorName: "د. عبد الله جمال",
    id: 7,
    link: "/consultation/7"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "جراحة القلب",
    doctorName: "د. كريم عبد الفتاح",
    id: 8,
    link: "/consultation/8"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "الطب النفسي",
    doctorName: "د. عماد محمد",
    id: 9,
    link: "/consultation/9"
  },
  // Duplicated entries from original for length, but with unique IDs/links
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب النساء والتوليد",
    doctorName: "د. عبد الله جمال",
    id: 10,
    link: "/consultation/10"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "جراحة القلب",
    doctorName: "د. كريم عبد الفتاح",
    id: 11,
    link: "/consultation/11"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "الطب النفسي",
    doctorName: "د. عماد محمد",
    id: 12,
    link: "/consultation/12"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب العيون",
    doctorName: "د. يوسف أحمد",
    id: 13,
    link: "/consultation/13"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب النساء والتوليد",
    doctorName: "د. عبد الله جمال",
    id: 14,
    link: "/consultation/14"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "جراحة القلب",
    doctorName: "د. كريم عبد الفتاح",
    id: 15,
    link: "/consultation/15"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "الطب النفسي",
    doctorName: "د. عماد محمد",
    id: 16,
    link: "/consultation/16"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "طب النساء والتوليد",
    doctorName: "د. عبد الله جمال",
    id: 17,
    link: "/consultation/17"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "جراحة القلب",
    doctorName: "د. كريم عبد الفتاح",
    id: 18,
    link: "/consultation/18"
  },
  {
    image: `${SLIDER_IMAGES_BASE_PATH}/doctor.png`,
    title: "الطب النفسي",
    doctorName: "د. عماد محمد",
    id: 19,
    link: "/consultation/19"
  }
];

// Default configuration for the slider
export const DEFAULT_SLIDER_CONFIG: IGlobalStorySliderConfig = {
  isButtonsVisible: false,
  autoScroll: {
    isEnabled: true,
    interval: 3000 // milliseconds
  }
};

// Assuming this constant for card width is universally applied or calculated
export const DEFAULT_CARD_WIDTH_PX: number = 117.66853332519531;
