export interface AppointmentType {
  id: string;
  icon: string;
  titleKey: string;
  subtitleKey: string;
  bgColor: string;
  titleColor: string;
  borderColor: string;
}

export const appointmentTypesConfig: AppointmentType[] = [
  {
    id: 'talbinah',
    icon: 'images/appointment/talbinah-clinic-icon.png',
    titleKey: 'SelectAppointmentType.TalbinahClinicTitle',
    subtitleKey: 'SelectAppointmentType.TalbinahClinicSubtitle',
    bgColor: 'linear-gradient(180deg, #B8EFE9 0%, #AECEE7 100%), #FFF',
    titleColor: '#006A82',
    borderColor: '#FFF'
  },
  {
    id: 'mentalWellBeing',
    icon: 'images/appointment/mental-well-being.png',
    titleKey: 'SelectAppointmentType.mentalWellBeingTitle',
    subtitleKey: 'SelectAppointmentType.mentalWellBeingSubtitle',
    bgColor: 'linear-gradient(270deg, #BAF0E8 0%, #F5DAB8 100%), linear-gradient(180deg, #B8EFE9 0%, #AECEE7 100%), #FFF',
    titleColor: '#CC4400',
    borderColor: '#EEE'
  }
];
