import { ICancelEmergencyAppointmentResponseDto, ICheckEmergencyAppointmentReservationResponseDto, IEmergencyDurationsPriceResponseDto, IStoreEmergencyAppointmentResponseDto, IUrgentAppointmentResponseDto } from "../dtos";

export const mockEmergencyDurationsPrice: IEmergencyDurationsPriceResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "duration_prices": [
      {
        "id": 6,
        "specialist_id": 2,
        "duration": 30,
        "price": 85,
        "created_at": "2024-01-28 21:31:27",
        "updated_at": "2024-01-28 21:31:27"
      },
      {
        "id": 7,
        "specialist_id": 2,
        "duration": 45,
        "price": 100,
        "created_at": "2024-01-28 21:31:27",
        "updated_at": "2024-01-28 21:31:27"
      }
    ],
    "problems": [
      "استشارة نفسية",
      "استشارة اسرية",
      "افكار انتحارية",
      "متابعة وصرف علاج",
      "اخري"
    ]
  }
};

export const mockStoreEmergencyAppointment: IStoreEmergencyAppointmentResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 421,
    "url": null,
    "remaining_time": 299,
    "full_name": "Eslam Afify",
    "specialist_id": "1",
    "reservation": null,
    "payment_id": "2",
    "problem": "اخري",
    "duration": 30,
    "price": 140,
    "payment_status": 0,
    "original_payment_status": "قيد الانتظار",
    "status": null,
    "original_status": null,
    "created_at": "2025-06-23T08:01:49.000000Z",
    "updated_at": "2025-06-23T08:01:49.000000Z"
  }
};

export const mockEmergencyAppointmentReservation: ICheckEmergencyAppointmentReservationResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 456,
    "url": null,
    "remaining_time": 1,
    "full_name": "Eslam Afify",
    "specialist_id": 1,

    // "reservation": {
    //   "id": 3478,
    //   "url": null,
    //   "price": 140,
    //   "user": {
    //     "id": 2266,
    //     "main_lang": "ar",
    //     "translate_id": null,
    //     "association_id": null,
    //     "fcm_token": null,
    //     "device_type": "web",
    //     "device_name": null,
    //     "version_name": null,
    //     "version_code": null,
    //     "full_name": "Eslam Afify",
    //     "nick_name": null,
    //     "country_id": 63,
    //     "phone_no": "1016221599",
    //     "phone_verified_at": null,
    //     "email": "eslamafifybarakat@gmail.com",
    //     "email_verified_at": null,
    //     "activation_date": null,
    //     "work_email": null,
    //     "work_email_verified_at": null,
    //     "remember_token": null,
    //     "owned_code": null,
    //     "referral_code": null,
    //     "role": "user",
    //     "active": 1,
    //     "visible": 1,
    //     "created_by": "website",
    //     "last_seen": "2025-06-01 12:02:47",
    //     "coupon_notify": 0,
    //     "preferred_msg_channel": "both",
    //     "created_at": "2025-03-13T01:05:57.000000Z",
    //     "updated_at": "2025-06-01T09:02:47.000000Z",
    //     "original_active": "فعال"
    //   },
    //   "doctor": {
    //     "id": 2232,
    //     "full_name": "عمر 402",
    //     "nick_name": "عمر",
    //     "phone_no": "1126075402",
    //     "fcm_token": "c4C05_tbTm6Fz0nmS5ugOr:APA91bHYadkSSNZL6oQVxOWe1lmu3aFwObNPbXCUK_md6pFDc-rDbrydVQ0bhAyZQmdAQ01jsVDbJflRAbnwMNyHjk774DOL1X7hPzGwFOL9Hu_IwCN6rzQ",
    //     "email": null,
    //     "email_verified_at": null,
    //     "bio": "تتاالللاا",
    //     "original_gender": "ذكر",
    //     "gender": 0,
    //     "birth_date": "2006-12-02",
    //     "country": null,
    //     "next_availability": null,
    //     "nextAvailability": null,
    //     "days": [
    //       {
    //         "id": 1,
    //         "main_lang": "ar",
    //         "translate_id": null,
    //         "name": "السبت",
    //         "day_id": 6,
    //         "active": 1,
    //         "original_active": "فعال",
    //         "created_at": "2023-09-06T21:55:13.000000Z"
    //       },
    //       {
    //         "id": 2,
    //         "main_lang": "ar",
    //         "translate_id": null,
    //         "name": "الأحد",
    //         "day_id": 7,
    //         "active": 1,
    //         "original_active": "فعال",
    //         "created_at": "2023-09-06T21:55:13.000000Z"
    //       },
    //       {
    //         "id": 3,
    //         "main_lang": "ar",
    //         "translate_id": null,
    //         "name": "الاثنين",
    //         "day_id": 1,
    //         "active": 1,
    //         "original_active": "فعال",
    //         "created_at": "2023-09-06T21:55:13.000000Z"
    //       },
    //       {
    //         "id": 4,
    //         "main_lang": "ar",
    //         "translate_id": null,
    //         "name": "الثلاثاء",
    //         "day_id": 2,
    //         "active": 1,
    //         "original_active": "فعال",
    //         "created_at": "2023-09-06T21:55:13.000000Z"
    //       },
    //       {
    //         "id": 5,
    //         "main_lang": "ar",
    //         "translate_id": null,
    //         "name": "الأربعاء",
    //         "day_id": 3,
    //         "active": 1,
    //         "original_active": "فعال",
    //         "created_at": "2023-09-06T21:55:13.000000Z"
    //       },
    //       {
    //         "id": 6,
    //         "main_lang": "ar",
    //         "translate_id": null,
    //         "name": "الخميس",
    //         "day_id": 4,
    //         "active": 1,
    //         "original_active": "فعال",
    //         "created_at": "2023-09-06T21:55:13.000000Z"
    //       },
    //       {
    //         "id": 7,
    //         "main_lang": "ar",
    //         "translate_id": null,
    //         "name": "الجمعة",
    //         "day_id": 5,
    //         "active": 1,
    //         "original_active": "فعال",
    //         "created_at": "2023-09-06T21:55:13.000000Z"
    //       }
    //     ],
    //     "image": null,
    //     "reviews_avg": 5,
    //     "price_half_hour": 200,
    //     "last_services": [
    //       {
    //         "id": 5,
    //         "title": "اضطرابات الشخصية"
    //       }
    //     ],
    //     "specialties": [
    //       {
    //         "id": 1,
    //         "name": "طبيب نفسي",
    //         "description": "وصف طبيب نفسي",
    //         "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/JAjviULnGIvkv2hKjYkabA5123RcTXOHsR5KO8i5.png",
    //         "color": "#f2e3e9",
    //         "is_report": 1,
    //         "active": 1,
    //         "original_active": "فعال"
    //       }
    //     ],
    //     "years_experience": 3,
    //     "license_number": "123456789",
    //     "reservations_count": 7,
    //     "is_fav": false,
    //     "created_by": null,
    //     "active": 1,
    //     "created_at": "2024-11-27T07:44:06.000000Z",
    //     "services": [
    //       {
    //         "id": 5,
    //         "title": "اضطرابات الشخصية"
    //       }
    //     ],
    //     "copouns": [],
    //     "packages": [],
    //     "programme": [],
    //     "badges": [
    //       {
    //         "id": 5,
    //         "name": "+5 جلسات",
    //         "description": null,
    //         "type": "reservations",
    //         "display_type": "reservations",
    //         "condition_type": "greeter",
    //         "display_condition_type": "أكبر من",
    //         "condition_value": 5,
    //         "doctor_percentage": null,
    //         "color": "#14c2b6",
    //         "icon": "https://redesign.talbinah.net/dashboard_assets/media/svg/icons/General/Star.svg",
    //         "is_active": 1,
    //         "created_at": "2025-02-08T21:21:36.000000Z"
    //       }
    //     ],
    //     "is_recommended": true,
    //     "is_classified": true
    //   },
    //   "is_start": 1,
    //   "is_end": 0,
    //   "original_is_start": "attributes.Started",
    //   "original_is_end": "لم تنتهي",
    //   "visit_chat_time_user": null,
    //   "visit_chat_time_doctor": "2025-06-25 11:58:51",
    //   "visit_call_time_user": null,
    //   "visit_call_time_doctor": null,
    //   "day": "الأربعاء",
    //   "start_time": "11:58:50",
    //   "end_time": "12:28:50",
    //   "date": "2025-06-25",
    //   "duration": {
    //     "id": 2,
    //     "main_lang": "ar",
    //     "translate_id": null,
    //     "duration": 30,
    //     "active": 1,
    //     "original_active": "فعال",
    //     "created_at": "2023-09-06T21:55:13.000000Z"
    //   },
    //   "review": null,
    //   "communication": {
    //     "id": 2,
    //     "main_lang": "ar",
    //     "translate_id": null,
    //     "name": "مكالمة اتصال",
    //     "description": "مكالمة اتصال مع الدكتور",
    //     "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/phone.svg",
    //     "price": 20,
    //     "color": "#E5E5FF",
    //     "hard_color": "#4C5DF4",
    //     "active": 1,
    //     "original_active": "فعال",
    //     "created_at": "2023-09-06T21:55:13.000000Z"
    //   },
    //   "payment": {
    //     "id": 1,
    //     "main_lang": "ar",
    //     "translate_id": null,
    //     "name": "دفع من خلال المحفظة",
    //     "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/payments-images/wallet.png",
    //     "active": 1,
    //     "original_active": "فعال",
    //     "created_at": "2023-09-06T21:55:13.000000Z",
    //     "package": null,
    //     "payment_id": 1,
    //     "balance": 7880
    //   },
    //   "problem": "hgggfgfgfgfgf",
    //   "message": null,
    //   "description": null,
    //   "notes": null,
    //   "report": null,
    //   "filename": null,
    //   "link": null,
    //   "report_file": "https://redesign.talbinah.net/prescription?link=",
    //   "full_name": "dsdsdsddsds",
    //   "gender": 0,
    //   "age": 35,
    //   "reason": null,
    //   "active": 1,
    //   "status": 1,
    //   "is_blocked": false,
    //   "original_active": "فعال",
    //   "original_status": "قادم",
    //   "reservation_type": "emergency",
    //   "original_type": "عاجله",
    //   "created_at": "2025-06-25T08:58:49.000000Z"
    // },

    "reservation": null,
    "payment_id": 1,
    "problem": "hgggfgfgfgfgf",
    "duration": 30,
    "price": 140,
    "payment_status": 1,
    "original_payment_status": "مدفوع",
    "status": "1",
    "original_status": null,
    "created_at": "2025-06-25T08:58:04.000000Z",
    "updated_at": "2025-06-25T08:58:49.000000Z"
  },
  // data: null
};

export const mockCancelEmergencyAppointment: ICancelEmergencyAppointmentResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 455,
    "user_id": 2266,
    "doctor_id": null,
    "specialist_id": 1,
    "payment_id": 1,
    "reservation_id": null,
    "duration": 30,
    "problem": "sssssssss",
    "full_name": "sssssss",
    "age": 325,
    "gender": "0",
    "price": 140,
    "tax_amount": 0,
    "payment_status": 1,
    "status": "0",
    "created_at": "2025-06-25T08:45:21.000000Z",
    "updated_at": "2025-06-25T08:47:54.000000Z",
    "original_status": "ملغي",
    "original_payment_status": "مدفوع"
  }
};
