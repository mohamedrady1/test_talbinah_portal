import { IQuickAccessCardConfig, IGlobalStorySliderConfig, CardLayoutType } from "../models";
import { TherapeuticProgramsRoutesEnum } from "../../therapeutic-programs";
import { MentalHealthScalesRoutesEnum } from "../../mental-health-scales";
import { TalbinahCommunityRoutesEnum } from "../../talbinah-community";
import { UrgentAppointmentRoutesEnum } from "../../urgent-appointment";
import { BookAppointmentRoutesEnum } from "../../book-appointment";
import { SupportGroupsRoutesEnum } from "../../support-groups";
import { AppointmentsRoutesEnum } from "../../appointments";
import { KhawiikBotRoutesEnum } from "../../talbinah-bot";
import { ArticlesRoutesEnum } from "../../articles";
import { PodcastRoutesEnum } from "../../podcasts";

export const HOME_PAGE_CARD_CONFIGS: IQuickAccessCardConfig[] = [
  {
    id: 1,
    moduleName: 'BookAppointment',
    title: 'home_card_book_appointment_title',
    description: 'home_card_book_appointment_description',
    img: 'images/home/icons/calender.png',
    gap: 'gap-12',
    titleColor: '#00C2AF',
    link: BookAppointmentRoutesEnum.BOOK_APPOINTMENT_MAIN_PAGE,
    isCommingSoon: false,
    uploadApps: false,
    isModal: true,
    isPinned: true
  },
  {
    id: 2,
    moduleName: 'Podcast',
    title: 'home_card_podcast_title',
    description: 'home_card_podcast_description',
    img: 'images/home/icons/microphone.png',
    gap: 'gap-12',
    titleColor: '#CC4400',
    link: PodcastRoutesEnum.PODCASTSMAINPAGE,
    isCommingSoon: false,
    isModal: false,
    isPinned: true
  },
  {
    id: 3,
    moduleName: 'SupportGroups',
    title: 'home_card_support_groups_title',
    // description: 'home_card_support_groups_description',
    img: 'images/home/icons/seminars.png',
    type: CardLayoutType.COLUMN,
    titleColor: '#783700',
    link: SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES,
    isCommingSoon: false,
    isModal: false,
    isPinned: true
  },
  {
    id: 4,
    moduleName: 'TalbinahCommunity',
    title: 'home_card_talbinah_community_title',
    description: 'home_card_talbinah_community_description',
    img: 'images/home/icons/group.png',
    gap: 'gap-12',
    type: CardLayoutType.COLUMN,
    titleColor: '#00C2AF',
    link: TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE,
    isCommingSoon: false,
    isModal: false,
    isPinned: true
  },
  {
    id: 5,
    moduleName: 'MentalHealthScale',
    title: 'home_card_mental_health_scale_title',
    description: 'home_card_mental_health_scale_description',
    img: 'images/home/icons/gauge.png',
    gap: 'gap-24',
    titleColor: '#0700CC',
    link: MentalHealthScalesRoutesEnum.MENTALHEALTSCALESMAINPAGE,
    isCommingSoon: false,
    isModal: false,
    isPinned: true
  },
  {
    id: 6,
    moduleName: 'khawiik',
    title: 'home_card_khawiik_title',
    description: 'home_card_khawiik_description',
    img: 'images/home/icons/khawiik.png',
    type: CardLayoutType.COLUMN,
    gap: 'gap-12',
    titleColor: '#006A82',
    link: KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE,
    isCommingSoon: false,
    isModal: false,
    isPinned: true
  },
  {
    id: 7,
    moduleName: 'Appointments',
    title: 'home_card_appointments_title',
    description: 'home_card_appointments_description',
    img: 'images/home/icons/date.png',
    gap: 'gap-12',
    titleColor: '#006A82',
    link: AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
    uploadApps: false,
    isCommingSoon: false,
    isModal: true,
    isPinned: true
  },
  {
    id: 8,
    moduleName: 'TherapeuticPrograms',
    title: 'home_card_therapeutic_programs_title',
    description: 'home_card_therapeutic_programs_description',
    img: 'images/home/icons/book.png',
    gap: 'gap-12',
    titleColor: '#CC4400',
    link: TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE,
    isCommingSoon: false,
    isModal: false,
    isPinned: true
  },
  {
    id: 9,
    moduleName: 'UrgentAppointment',
    title: 'home_card_urgent_appointment_title',
    description: 'home_card_urgent_appointment_description',
    img: 'images/home/icons/urgent-appointment.png',
    gap: 'gap-12',
    titleColor: '#CC4400',
    link: UrgentAppointmentRoutesEnum.URGENT_APPOINTMENT_MAIN_PAGE,
    uploadApps: false,
    isCommingSoon: false,
    isModal: true,
    isPinned: true
  },
  {
    id: 10,
    moduleName: 'Articles',
    title: 'home_card_articles_title',
    description: 'home_card_articles_description',
    img: 'images/home/icons/articles.png',
    gap: 'gap-12',
    titleColor: '#006A82',
    link: ArticlesRoutesEnum.ARTICLES_MAIN_PAGE,
    isCommingSoon: false,
    isModal: false,
    isPinned: true
  }
];

export const GLOBAL_STORY_SLIDER_CONFIG: IGlobalStorySliderConfig = {
  isButtonsVisible: false,
  autoScroll: {
    isEnabled: true,
    interval: 3000,
  },
};

// Base path for images to make it easier to manage
export const HOME_IMAGES_BASE_PATH = '../../../../../../public/images/home';
