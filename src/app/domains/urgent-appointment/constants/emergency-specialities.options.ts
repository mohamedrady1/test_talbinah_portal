import { ISpecialityItemDto } from "../../lookups";

export const emergencySpecialties: ISpecialityItemDto[] = [
  {
    id: 1,
    name: 'طبيب - يصرف وصفة طبية',
    // Removed: main_lang, translate_id, duration, created_at
    // Added (with placeholder values):
    description: 'طبيب عام يمكنه صرف وصفات طبية',
    image: 'images/default/doctor-icon.png', // Placeholder image path
    color: '#F0F8FF', // A default or placeholder color
    is_report: 1, // Assuming this doctor type can generate reports
    active: 1,
    original_active: 'فعال',
  },
  {
    id: 2,
    name: 'أخصائي - لا يصرف وصفه طبيه',
    // Removed: main_lang, translate_id, duration, created_at
    // Added (with placeholder values):
    description: 'أخصائي لا يمكنه صرف وصفات طبية',
    image: 'images/default/specialist-icon.png', // Placeholder image path
    color: '#E0FFFF', // A default or placeholder color
    is_report: 0, // Assuming this specialist type does not generate reports
    active: 1,
    original_active: 'فعال',
  },
];
