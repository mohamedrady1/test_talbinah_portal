import { IActionDropdownMenuItem, ILayoutGridHeaderConfig } from "../../../shared";

export const SESSION_WITH_DOCTOR_SEO_CONFIG = {
  title: {
    en: 'Session with Doctor',
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

export const SessionWithDoctorHeaderConfig: ILayoutGridHeaderConfig = {
  image: 'images/home/icons/date.png',
  title: 'appointments_list_page_title',
  subtitle: 'appointments_list_page_subtitle'
};

export const ChatActionsMenuItemsConfig: IActionDropdownMenuItem[] = [
  {
    action: 'session-tasks',
    text: 'session_tasks',
    icon: 'images/icons/session-tasks.png',
    isOpenModal: true
  },
  {
    action: 'leave-rating',
    text: 'leave_a_review',
    icon: 'images/icons/rating.png',
    isOpenModal: true
  },
  {
    action: 'block-doctor',
    text: 'block_doctor',
    icon: 'images/icons/block.png',
    isOpenModal: true
  },
  // {
  //   action: 'report-issue',
  //   text: 'chatActions.reportIssue',
  //   icon: 'images/icons/report.png',
  //   isOpenModal: true
  // },
  {
    action: 'session-details',
    text: 'session_details',
    icon: 'images/icons/details.png',
    isOpenModal: true
  }
];


