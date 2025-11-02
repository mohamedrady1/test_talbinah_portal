import { IActionDropdownMenuItem, ILayoutGridHeaderConfig } from "../../../shared";

export const RESERVATIONS_LIST_SEO_CONFIG = {
  title: {
    en: 'Reservations',
    ar: 'موعدك العلاجي | تلبينة'
  },
  description: {
    en: 'Connect with your doctor for a personalized session...',
    ar: 'تابع تفاصيل موعدك، وكن جاهز لجلسة تساعدك تهدّى وتفهم نفسك أكتر.'
  },
  defaults: {
    keywords: 'doctor session, mental health, talbinah',
    image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
    url: 'https://talbinah.com/session-with-doctor',
    robots: 'index, follow',
    canonical: 'https://talbinah.com/session-with-doctor'
  }
};

export const ReservationsListHeaderConfig: ILayoutGridHeaderConfig = {
  image: 'images/home/icons/date.png',
  title: 'appointments_list_page_title',
  subtitle: 'appointments_list_page_subtitle'
};

export const ChatAppointmentMenuItemActionsConfig: IActionDropdownMenuItem[] = [
  {
    action: 'schedule-appointment',
    text: 'schedule_appointment',
    icon: 'images/icons/calendar-edit.png',
    isOpenModal: true
  },
  {
    action: 'cancel-appointment',
    text: 'cancel_appointment',
    icon: 'images/icons/close-square.png',
    isOpenModal: true,
    type: 'cancel'
  }
];


