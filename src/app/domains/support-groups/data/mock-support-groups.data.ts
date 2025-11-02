import { IMySeminarsResponseDto, ISeminarItemResponseDto, ISeminarsListingResponseDto, IStoreSeminarResponseDto } from "../dtos";

export const mockSeminarsListing: ISeminarsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 21,
      "url": null,
      "title": "تيست سيمنار جديد",
      "doctor_name": "د.عبدالمجيد الخميس",
      "doctor_gender": 0,
      "description": "تيست سيمنار جديد",
      "price": 220,
      "discount": 20,
      "image": null,
      "duration": 30,
      "date": "2025-07-29",
      "time": "00:53:00",
      "max_users_count": 5,
      "users_attend_count": 2,
      "users_remaining_count": 3,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2025-05-18T05:49:39.000000Z"
    },
    {
      "id": 20,
      "url": null,
      "title": "zfsfasa",
      "doctor_name": "د.محمد الغصن",
      "doctor_gender": 0,
      "description": "aefaf",
      "price": 70,
      "discount": 20,
      "image": null,
      "duration": 50,
      "date": "2025-07-30",
      "time": "22:20:00",
      "max_users_count": 20,
      "users_attend_count": 2,
      "users_remaining_count": 18,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2025-05-15T14:20:59.000000Z"
    },
    {
      "id": 19,
      "url": null,
      "title": "asdadSSD",
      "doctor_name": "نوره الزبن",
      "doctor_gender": 1,
      "description": "asdgag",
      "price": 70,
      "discount": 20,
      "image": null,
      "duration": 20,
      "date": "2025-06-18",
      "time": "17:35:00",
      "max_users_count": 20,
      "users_attend_count": 2,
      "users_remaining_count": 18,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2025-05-15T10:31:47.000000Z"
    },
    {
      "id": 18,
      "url": null,
      "title": "Eu quae aut voluptas",
      "doctor_name": "doctordev",
      "doctor_gender": 0,
      "description": "Consequat Aspernatu",
      "price": 58,
      "discount": 34,
      "image": null,
      "duration": 70,
      "date": "2025-06-18",
      "time": "07:07:00",
      "max_users_count": 35,
      "users_attend_count": 4,
      "users_remaining_count": 31,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2025-05-13T18:43:20.000000Z"
    },
    {
      "id": 17,
      "url": null,
      "title": "test",
      "doctor_name": "doctordev",
      "doctor_gender": 0,
      "description": "test test test",
      "price": 100,
      "discount": 50,
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/seminars/y70pTrzVqcpZ7j5ZDvjAGUVpv8z0UrN4BjzxvMFP.png",
      "duration": 30,
      "date": "2025-06-26",
      "time": "14:30:00",
      "max_users_count": 8,
      "users_attend_count": 6,
      "users_remaining_count": 2,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2025-05-13T18:38:15.000000Z"
    },
    {
      "id": 16,
      "url": null,
      "title": "تيست مجموعات دعم",
      "doctor_name": "د.محمد الغصن",
      "doctor_gender": 0,
      "description": "تيست الدعم",
      "price": 100,
      "discount": 0,
      "image": null,
      "duration": 60,
      "date": "2025-07-31",
      "time": "19:44:00",
      "max_users_count": 10,
      "users_attend_count": 2,
      "users_remaining_count": 8,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2025-05-04T11:42:40.000000Z"
    },
    {
      "id": 15,
      "url": null,
      "title": "ندوة  للمستشارين",
      "doctor_name": "doctestdev",
      "doctor_gender": 1,
      "description": "تيست تيست تيست تيست         تيست تيست تيست تيست         تيست تيست تيست تيست        تيست تيست تيست تيست        تيست تيست تيست تيست        تيست تيست تيست تيست        تيست تيست تيست تيستر        تيست تيست تيست تيست",
      "price": 0,
      "discount": 0,
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/seminars/DbUEuLXmta1RSRGBwuMFjjDv81Qw3HcRZLGWTu2l.png",
      "duration": 30,
      "date": "2025-06-23",
      "time": "16:00:00",
      "max_users_count": 10,
      "users_attend_count": 9,
      "users_remaining_count": 1,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2024-12-31T13:11:35.000000Z"
    },
    {
      "id": 14,
      "url": null,
      "title": "ندوة عن الاكتئاب",
      "doctor_name": "doctordev",
      "doctor_gender": 0,
      "description": "تيست  تيست  تيست  تيست  تيست  تيست             تيست  تيست  تيست  تيست  تيست  تيست              تيست  تيست  تيست  تيست  تيست  تيست",
      "price": 50,
      "discount": 50,
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/seminars/Yn4gQobrBg2OkUrTyuFIwqgC9OqtI6h1d5gruMQU.png",
      "duration": 30,
      "date": "2025-07-31",
      "time": "13:00:00",
      "max_users_count": 6,
      "users_attend_count": 3,
      "users_remaining_count": 3,
      "is_purchased": false,
      "ended": 0,
      "created_at": "2024-12-31T00:41:28.000000Z"
    }
  ]
};

export const mockMySeminarsListing: IMySeminarsResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 21,
      "url": null,
      "title": "تيست سيمنار جديد",
      "doctor_name": "د.عبدالمجيد الخميس",
      "doctor_gender": 0,
      "description": "تيست سيمنار جديد",
      "price": 220,
      "discount": 20,
      "image": null,
      "duration": 30,
      "date": "2025-07-29",
      "time": "00:53:00",
      "max_users_count": 5,
      "users_attend_count": 3,
      "users_remaining_count": 2,
      "is_purchased": true,
      "ended": 0,
      "created_at": "2025-05-18T05:49:39.000000Z"
    },
    {
      "id": 18,
      "url": null,
      "title": "Eu quae aut voluptas",
      "doctor_name": "doctordev",
      "doctor_gender": 0,
      "description": "Consequat Aspernatu",
      "price": 58,
      "discount": 34,
      "image": null,
      "duration": 70,
      "date": "2025-06-18",
      "time": "07:07:00",
      "max_users_count": 35,
      "users_attend_count": 5,
      "users_remaining_count": 30,
      "is_purchased": true,
      "ended": 0,
      "created_at": "2025-05-13T18:43:20.000000Z"
    },
    {
      "id": 16,
      "url": null,
      "title": "تيست مجموعات دعم",
      "doctor_name": "د.محمد الغصن",
      "doctor_gender": 0,
      "description": "تيست الدعم",
      "price": 100,
      "discount": 0,
      "image": null,
      "duration": 60,
      "date": "2025-07-31",
      "time": "19:44:00",
      "max_users_count": 10,
      "users_attend_count": 3,
      "users_remaining_count": 7,
      "is_purchased": true,
      "ended": 0,
      "created_at": "2025-05-04T11:42:40.000000Z"
    }
  ]
};

export const mockSeminarItem: ISeminarItemResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 20,
    "title": "zfsfasa",
    "description": "aefaf",
    "doctor": {
      "id": 42,
      "full_name": "د.محمد الغصن",
      "phone_no": "506128940",
      "country": {
        "id": 187,
        "main_lang": "ar",
        "translate_id": null,
        "name": "المملكة العربية السعودية",
        "flag": "https://ipdata.co/flags/sa.png",
        "code": "SA",
        "code2": "SAU",
        "numcode": "682",
        "phone_code": "+966",
        "active": 1,
        "deleted_at": null,
        "created_at": null,
        "updated_at": null,
        "original_active": "فعال"
      },
      "nick_name": "دكتور",
      "email": null,
      "original_gender": "ذكر",
      "gender": 0,
      "birth_date": "1988-08-03",
      "bio": "استشاري الطب النفسي \nشهادة الاختصاص السعودية في الطب النفسي \nخبرة في عدد من مستشفيات المملكة العربية السعودية ومملكة البحرين \nتشخيص وعلاج:\nالقلق بأنواعه\nالوسواس القهري\nالرهاب والخوف وتوهم المرض\nاضطرابات الشخصية \nاختلالات الوظيفة الجنسية\nالافكار الانتحارية وايذاء النفس\nاضطرابات التغذية والأكل \nالاكتئاب\nاضطرابات المزاج\nاضطرابات النوم \nالفصام\nالاضطرابات النمائية",
      "license_number": "14RM0026457",
      "license_image": null,
      "license_expiry_date": null,
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_E5FA67C1-DACD-49FC-98DB-EA3079DAE7F0-44981-000007FB3D18112F_1698824700.jpg",
      "specialties": [
        {
          "id": 1,
          "name": "طبيب نفسي",
          "description": "وصف طبيب نفسي",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/JAjviULnGIvkv2hKjYkabA5123RcTXOHsR5KO8i5.png",
          "color": "#f2e3e9",
          "is_report": 1,
          "active": 1,
          "original_active": "فعال"
        }
      ],
      "price_half_hour": 250,
      "iban": null,
      "next_availability": {
        "id": 175,
        "doctor_id": 42,
        "day_id": 3,
        "date": "2024-08-19",
        "start_time": "20:45:00",
        "end_time": "21:15:00",
        "created_at": "2024-05-12T21:10:03.000000Z",
        "updated_at": "2024-08-19T17:02:04.000000Z"
      },
      "years_experience": 10,
      "coupons": [],
      "services": [
        {
          "id": 1,
          "title": "اضطرابات الأكل"
        },
        {
          "id": 2,
          "title": "الشخصية التجنبية"
        },
        {
          "id": 3,
          "title": "الشخصية الحدية"
        },
        {
          "id": 4,
          "title": "الشخصية النرجسية"
        },
        {
          "id": 5,
          "title": "اضطرابات الشخصية"
        },
        {
          "id": 6,
          "title": "اضطراب ما بعد الصدمة"
        },
        {
          "id": 7,
          "title": "الأرق ومشاكل النوم"
        },
        {
          "id": 8,
          "title": "الضغوط النفسية"
        },
        {
          "id": 9,
          "title": "التعامل مع لوم الذات"
        },
        {
          "id": 10,
          "title": "التعامل مع تأنيب الضمير"
        },
        {
          "id": 11,
          "title": "التعامل مع الغضب"
        },
        {
          "id": 12,
          "title": "اضطراب ثنائي القطب"
        },
        {
          "id": 13,
          "title": "القلق والتوتر"
        },
        {
          "id": 14,
          "title": "الاكتئاب"
        },
        {
          "id": 15,
          "title": "التفكير بالانتحار"
        },
        {
          "id": 16,
          "title": "توهم المرض"
        },
        {
          "id": 17,
          "title": "اضطراب الهوية الجنسية"
        },
        {
          "id": 18,
          "title": "الصحة الجنسية"
        },
        {
          "id": 19,
          "title": "اضطرابات النوم"
        },
        {
          "id": 20,
          "title": "الخوف من الظلام"
        },
        {
          "id": 21,
          "title": "الخوف من الموت"
        },
        {
          "id": 22,
          "title": "نتف الشعر"
        },
        {
          "id": 23,
          "title": "الوسواس القهري"
        },
        {
          "id": 24,
          "title": "اضطراب النزاج"
        },
        {
          "id": 25,
          "title": "الفصام"
        },
        {
          "id": 26,
          "title": "الرهاب الاجتماعي"
        },
        {
          "id": 27,
          "title": "الوسواس"
        },
        {
          "id": 28,
          "title": "الهلع"
        }
      ],
      "association": null,
      "reviews_avg": 5,
      "is_fav": false,
      "active": 1,
      "preferred_msg_channel": "both",
      "device_type": null,
      "device_name": null,
      "version_name": null,
      "version_code": null,
      "created_at": "2023-09-13T03:00:06.000000Z",
      "national_id": null,
      "bank_name": null,
      "badges": [
        {
          "id": 1,
          "name": "+50 جلسات",
          "description": null,
          "type": "reservations",
          "display_type": "reservations",
          "condition_type": "greeter",
          "display_condition_type": "أكبر من",
          "condition_value": 50,
          "doctor_percentage": null,
          "color": "#28f7fb",
          "icon": "https://redesign.talbinah.net/dashboard_assets/media/svg/icons/General/Star.svg",
          "is_active": 1,
          "created_at": "2025-01-26T10:32:20.000000Z"
        },
        {
          "id": 3,
          "name": "+1 استشارات",
          "description": null,
          "type": "consultations",
          "display_type": "consultations",
          "condition_type": "greeter",
          "display_condition_type": "أكبر من",
          "condition_value": 1,
          "doctor_percentage": null,
          "color": "#00d7ff",
          "icon": "https://redesign.talbinah.net/dashboard_assets/media/svg/icons/General/Thunder.svg",
          "is_active": 1,
          "created_at": "2025-02-08T21:18:50.000000Z"
        }
      ]
    },
    "link": null,
    "price": 70,
    "discount": 20,
    "image": null,
    "duration": 50,
    "date": "2025-07-30",
    "time": "22:20:00",
    "max_users_count": 20,
    "users_attend_count": 2,
    "users_remaining_count": 18,
    "is_purchased": false,
    "ended": 0,
    "created_at": "2025-05-15T14:20:59.000000Z"
  }
};

export const mockStoreSeminar: IStoreSeminarResponseDto = {
  "status": true,
  "message": null,
  "data": null
};
