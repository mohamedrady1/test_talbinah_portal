import { IApiResponse, IGlobalDoctorContactInfoModel } from "../../../common";
import { IAppointmentTypeSelectionsResponseDto, IDoctorsFitrationParametersResponseDto, IDoctorsListingResponseDto, IToggleFavoriteDoctorResponseDto } from "../dtos";

export const mockDoctorList: IDoctorsListingResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "data": [
      {
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
        ],
        "is_recommended": true,
        "reviews_count": 1
      },
      {
        "id": 43,
        "full_name": "د.عبدالمجيد الخميس",
        "phone_no": "555139570",
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
        "birth_date": "2023-09-12",
        "bio": "أستاذ الطب النفسي ، طبيب استشاري حاصل على زمالتي الطب النفسي الجسدي والعلاج النفسي بالكلام (السيكوديناميكي) من الولايات المتحدة الأمريكية\r\n متخصص بعلاج حالات:\r\n •القلق الاجتماعي وضعف تقدير النفس\r\n •رهاب الساح والأماكن المفتوحة\r\n •القلق العام\r\n •نوبات العلع\r\n •الوسواس القهري\r\n •القلق من الأمراض وتوهم المرض\r\n •حالات الأكتئاب والتأقلم\r\n •الفصام والأمراض الذهانية\r\n •ثنائي القطب والاضطرابات الوجدانية\r\n •الإدمان\r\n •اضطرابات الشخصية والسلوكيات الإنتحارية\r\n •متخصص بالعلاج الكلامي",
        "license_number": "1806543",
        "license_image": null,
        "license_expiry_date": null,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/JPEG%20image-C9B8EFE69106-1_1694708488.jpg",
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
          "id": 176,
          "doctor_id": 43,
          "day_id": 3,
          "date": "2024-08-19",
          "start_time": "21:00:00",
          "end_time": "21:30:00",
          "created_at": "2024-05-12T21:10:03.000000Z",
          "updated_at": "2024-08-19T17:02:04.000000Z"
        },
        "years_experience": 12,
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
        "created_at": "2023-09-13T03:04:38.000000Z",
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
        ],
        "is_recommended": true,
        "reviews_count": 6
      },
      {
        "id": 144,
        "full_name": "نوره الزبن",
        "phone_no": "509271924",
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
        "nick_name": "الزبن",
        "email": null,
        "original_gender": "أنثى",
        "gender": 1,
        "birth_date": "1992-03-30",
        "bio": "اخصائي نفسي، ماجستير في علم النفس الاكلينكي، كلية الطب، جامعة الإمام عبدالرحمن بن فيصل.",
        "license_number": "13RA0056421",
        "license_image": null,
        "license_expiry_date": null,
        "image": null,
        "specialties": [
          {
            "id": 2,
            "name": "أخصائي نفسي",
            "description": "وصف أخصائي نفسي",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/mt866VhJm6XwhMvROgIg3Mb7tNH6XgxmQpJ5zNVR.png",
            "color": "#d6f6ff",
            "is_report": 0,
            "active": 1,
            "original_active": "فعال"
          }
        ],
        "price_half_hour": 100,
        "iban": null,
        "next_availability": {
          "id": 177,
          "doctor_id": 144,
          "day_id": 3,
          "date": "2024-08-20",
          "start_time": "14:00:00",
          "end_time": "14:30:00",
          "created_at": "2024-05-12T21:10:03.000000Z",
          "updated_at": "2024-08-19T17:02:04.000000Z"
        },
        "years_experience": 9,
        "coupons": [],
        "services": [
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
            "id": 21,
            "title": "الخوف من الموت"
          },
          {
            "id": 23,
            "title": "الوسواس القهري"
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
        "reviews_avg": 4.684,
        "is_fav": false,
        "active": 1,
        "preferred_msg_channel": "both",
        "device_type": null,
        "device_name": null,
        "version_name": null,
        "version_code": null,
        "created_at": "2023-10-04T18:58:50.000000Z",
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
        ],
        "is_recommended": true,
        "reviews_count": 38
      },
      {
        "id": 165,
        "full_name": "ميسون البهيجي",
        "phone_no": "563031416",
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
        "nick_name": "البهيجي",
        "email": null,
        "original_gender": "أنثى",
        "gender": 1,
        "birth_date": "1995-11-25",
        "bio": "أخصائي نفسي ممارس في التقييم النفسي ، القياس النفسي ، الدعم النفسي للأطفال والمراهقين والكبار",
        "license_number": "19002159",
        "license_image": null,
        "license_expiry_date": null,
        "image": null,
        "specialties": [
          {
            "id": 2,
            "name": "أخصائي نفسي",
            "description": "وصف أخصائي نفسي",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/mt866VhJm6XwhMvROgIg3Mb7tNH6XgxmQpJ5zNVR.png",
            "color": "#d6f6ff",
            "is_report": 0,
            "active": 1,
            "original_active": "فعال"
          }
        ],
        "price_half_hour": 75,
        "iban": null,
        "next_availability": {
          "id": 178,
          "doctor_id": 165,
          "day_id": 3,
          "date": "2024-08-20",
          "start_time": "09:00:00",
          "end_time": "09:30:00",
          "created_at": "2024-05-12T21:10:03.000000Z",
          "updated_at": "2024-08-19T17:02:04.000000Z"
        },
        "years_experience": 3,
        "coupons": [],
        "services": [
          {
            "id": 8,
            "title": "الضغوط النفسية"
          },
          {
            "id": 13,
            "title": "القلق والتوتر"
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
            "id": 28,
            "title": "الهلع"
          }
        ],
        "association": null,
        "reviews_avg": 0,
        "is_fav": false,
        "active": 1,
        "preferred_msg_channel": "both",
        "device_type": null,
        "device_name": null,
        "version_name": null,
        "version_code": null,
        "created_at": "2023-10-06T23:16:07.000000Z",
        "national_id": null,
        "bank_name": null,
        "badges": [
          {
            "id": 5,
            "name": "+5 جلسات",
            "description": null,
            "type": "reservations",
            "display_type": "reservations",
            "condition_type": "greeter",
            "display_condition_type": "أكبر من",
            "condition_value": 5,
            "doctor_percentage": null,
            "color": "#14c2b6",
            "icon": "https://redesign.talbinah.net/dashboard_assets/media/svg/icons/General/Star.svg",
            "is_active": 1,
            "created_at": "2025-02-08T21:21:36.000000Z"
          }
        ],
        "is_recommended": true,
        "reviews_count": 0
      },
      {
        "id": 264,
        "full_name": "محمد السلطان",
        "phone_no": "560684666",
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
        "nick_name": "د/محمد",
        "email": null,
        "original_gender": "ذكر",
        "gender": 0,
        "birth_date": "1982-09-03",
        "bio": "طبيب نفسي .. مصنف ومتعمد من الهيئة السعودية للتخصصات الصحية .. مهتم بنشر السعادة والايجابية .. أخصائي سعادة وايجابية وجودة حياة معتمد من مركز HDTC بدبي كأخصائي سعادة .. مهتم بالعلاج السلوكي .. الدعم النفسي والتحفيز .. مهتم بالطب النفسي للأطفال والمراهقين والاستشارات الزواجية.",
        "license_number": "13LM0014136",
        "license_image": null,
        "license_expiry_date": null,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/Capture_1699705012.PNG",
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
        "price_half_hour": 175,
        "iban": null,
        "next_availability": {
          "id": 179,
          "doctor_id": 264,
          "day_id": 3,
          "date": "2024-08-22",
          "start_time": "13:00:00",
          "end_time": "13:30:00",
          "created_at": "2024-05-12T21:10:03.000000Z",
          "updated_at": "2024-08-19T17:02:04.000000Z"
        },
        "years_experience": 14,
        "coupons": [],
        "services": [
          {
            "id": 4,
            "title": "الشخصية النرجسية"
          }
        ],
        "association": null,
        "reviews_avg": 0,
        "is_fav": false,
        "active": 1,
        "preferred_msg_channel": "both",
        "device_type": null,
        "device_name": null,
        "version_name": null,
        "version_code": null,
        "created_at": "2023-11-05T23:15:26.000000Z",
        "national_id": null,
        "bank_name": null,
        "badges": [],
        "is_recommended": true,
        "reviews_count": 0
      }
    ],
    "links": {
      "first": "/?page=1",
      "last": "/?page=18",
      "prev": null,
      "next": "/?page=2"
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 18,
      "links": [
        {
          "url": null,
          "label": "pagination.previous",
          "active": false
        },
        {
          "url": "/?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": "/?page=2",
          "label": "2",
          "active": false
        },
        {
          "url": "/?page=3",
          "label": "3",
          "active": false
        },
        {
          "url": "/?page=4",
          "label": "4",
          "active": false
        },
        {
          "url": "/?page=5",
          "label": "5",
          "active": false
        },
        {
          "url": "/?page=6",
          "label": "6",
          "active": false
        },
        {
          "url": "/?page=7",
          "label": "7",
          "active": false
        },
        {
          "url": "/?page=8",
          "label": "8",
          "active": false
        },
        {
          "url": "/?page=9",
          "label": "9",
          "active": false
        },
        {
          "url": "/?page=10",
          "label": "10",
          "active": false
        },
        {
          "url": null,
          "label": "...",
          "active": false
        },
        {
          "url": "/?page=17",
          "label": "17",
          "active": false
        },
        {
          "url": "/?page=18",
          "label": "18",
          "active": false
        },
        {
          "url": "/?page=2",
          "label": "pagination.next",
          "active": false
        }
      ],
      "path": "/",
      "per_page": 5,
      "to": 5,
      "total": 86
    }
  }
};

export const mockDoctorItem: IApiResponse<IGlobalDoctorContactInfoModel> = {
  "status": true,
  "message": null,
  "data": {
    "id": 43,
    "full_name": "د.عبدالمجيد الخميس",
    "nick_name": "دكتور",
    "phone_no": "555139570",
    "fcm_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9",
    "email": null,
    "email_verified_at": null,
    "bio": "أستاذ الطب النفسي ، طبيب استشاري حاصل على زمالتي الطب النفسي الجسدي والعلاج النفسي بالكلام (السيكوديناميكي) من الولايات المتحدة الأمريكية\r\n متخصص بعلاج حالات:\r\n •القلق الاجتماعي وضعف تقدير النفس\r\n •رهاب الساح والأماكن المفتوحة\r\n •القلق العام\r\n •نوبات العلع\r\n •الوسواس القهري\r\n •القلق من الأمراض وتوهم المرض\r\n •حالات الأكتئاب والتأقلم\r\n •الفصام والأمراض الذهانية\r\n •ثنائي القطب والاضطرابات الوجدانية\r\n •الإدمان\r\n •اضطرابات الشخصية والسلوكيات الإنتحارية\r\n •متخصص بالعلاج الكلامي",
    "original_gender": "ذكر",
    "gender": 0,
    "birth_date": "2023-09-12",
    "country": null,
    "next_availability": {
      "id": 176,
      "doctor_id": 43,
      "day_id": 3,
      "date": "2024-08-19",
      "start_time": "21:00:00",
      "end_time": "21:30:00",
      "created_at": "2024-05-12T21:10:03.000000Z",
      "updated_at": "2024-08-19T17:02:04.000000Z"
    },
    "days": [
      {
        "id": 1,
        "main_lang": "ar",
        "translate_id": null,
        "name": "السبت",
        "day_id": 6,
        "active": 1,
        "original_active": "فعال",
        "created_at": "2023-09-06T21:55:13.000000Z"
      },
      {
        "id": 2,
        "main_lang": "ar",
        "translate_id": null,
        "name": "الأحد",
        "day_id": 7,
        "active": 1,
        "original_active": "فعال",
        "created_at": "2023-09-06T21:55:13.000000Z"
      },
      {
        "id": 3,
        "main_lang": "ar",
        "translate_id": null,
        "name": "الاثنين",
        "day_id": 1,
        "active": 1,
        "original_active": "فعال",
        "created_at": "2023-09-06T21:55:13.000000Z"
      },
      {
        "id": 4,
        "main_lang": "ar",
        "translate_id": null,
        "name": "الثلاثاء",
        "day_id": 2,
        "active": 1,
        "original_active": "فعال",
        "created_at": "2023-09-06T21:55:13.000000Z"
      },
      {
        "id": 5,
        "main_lang": "ar",
        "translate_id": null,
        "name": "الأربعاء",
        "day_id": 3,
        "active": 1,
        "original_active": "فعال",
        "created_at": "2023-09-06T21:55:13.000000Z"
      },
      {
        "id": 6,
        "main_lang": "ar",
        "translate_id": null,
        "name": "الخميس",
        "day_id": 4,
        "active": 1,
        "original_active": "فعال",
        "created_at": "2023-09-06T21:55:13.000000Z"
      },
      {
        "id": 7,
        "main_lang": "ar",
        "translate_id": null,
        "name": "الجمعة",
        "day_id": 5,
        "active": 1,
        "original_active": "فعال",
        "created_at": "2023-09-06T21:55:13.000000Z"
      }
    ],
    "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/JPEG%20image-C9B8EFE69106-1_1694708488.jpg",
    "reviews_avg": 5,
    "price_half_hour": 250,
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
    "years_experience": 12,
    "license_number": "1806543",
    "license_image": null,
    "license_expiry_date": null,
    "reservations_count": 57,
    "last_services": [
      {
        "id": 28,
        "title": "الهلع"
      },
      {
        "id": 27,
        "title": "الوسواس"
      },
      {
        "id": 26,
        "title": "الرهاب الاجتماعي"
      }
    ],
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
    "packages": [
      {
        "id": 53,
        "package_id": 1,
        "price": 300,
        "number_of_reservations": 2,
        "usage_reservations": 1,
        "reminder_reservation": 1,
        "max_reservation_price": null,
        "package_period": null,
        "end_in_days": 30,
        "discount": 200,
        "end_at": "2025-08-01",
        "type": "doctor",
        "duration": 30
      }
    ],
    "programme": [
      {
        "id": 209,
        "price": 165,
        "discount": 15,
        "original_price": 180,
        "title": "برنامج لعلاج العبث الكلوي",
        "description": "ﻓﻌﺎﻟﻴﺔ ﺑﺮﻧﺎﻣﺞ ﺇﺭﺷﺎﺩﻱ ﻗﺎﺋﻢ ﻋﻠﻰ ﻓﻨﻴﺎﺕ ﺍﻟﻌﻼﺝ ﺍﻟﻨﻔﺴﻲ. ﺍﻹﻳﺠﺎﺑﻲ ﻓﻲ ﺧﻔﺾ ﺍﻟﻨﻬﻚ ﺍﻟﻨﻔﺴﻲ ﻟﺪﻯ ﻋﻴﻨﺔ ﻣﻦ ﻣﻌﻠﻤﻲ. ﺍﻟﻮﺍﺩﻱ ﺍﻟﺠﺪﻳﺪ. ﺍﻟﻤﺼﺪﺭ: ﺍﻟﻤﺠﻠﺔ ﺍﻟﻌﻠﻤﻴﺔ ﻟﻜﻠﻴﺔ ﺍﻟﺘﺮﺑﻴﺔ. ﺍﻟﻨﺎﺷﺮ ﻓﻌﺎﻟﻴﺔ ﺑﺮﻧﺎﻣﺞ ﺇﺭﺷﺎﺩﻱ ﻗﺎﺋﻢ ﻋﻠﻰ ﻓﻨﻴﺎﺕ ﺍﻟﻌﻼﺝ ﺍﻟﻨﻔﺴﻲ. ﺍﻹﻳﺠﺎﺑﻲ ﻓﻲ ﺧﻔﺾ ﺍﻟﻨﻬﻚ ﺍﻟﻨﻔﺴﻲ ﻟﺪﻯ ﻋﻴﻨﺔ ﻣﻦ ﻣﻌﻠﻤﻲ.",
        "programme_period": 60,
        "active": 1,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/programmes/AVkxiu4QaMVSNuNxwlfnNJluBWiMbAWvbPkZjRO9.jpg",
        "url": null,
        "usage_number": 27,
        "reminder_seats": 0,
        "phases_count": 5,
        "sessions_count": 1,
        "is_purchased": true,
        "phases": null,
        "doctor": null,
        "programme_id": 76,
        "progress": 0
      },
      {
        "id": 209,
        "price": 165,
        "discount": 15,
        "original_price": 180,
        "title": "برنامج لعلاج العبث الكلوي",
        "description": "ﻓﻌﺎﻟﻴﺔ ﺑﺮﻧﺎﻣﺞ ﺇﺭﺷﺎﺩﻱ ﻗﺎﺋﻢ ﻋﻠﻰ ﻓﻨﻴﺎﺕ ﺍﻟﻌﻼﺝ ﺍﻟﻨﻔﺴﻲ. ﺍﻹﻳﺠﺎﺑﻲ ﻓﻲ ﺧﻔﺾ ﺍﻟﻨﻬﻚ ﺍﻟﻨﻔﺴﻲ ﻟﺪﻯ ﻋﻴﻨﺔ ﻣﻦ ﻣﻌﻠﻤﻲ. ﺍﻟﻮﺍﺩﻱ ﺍﻟﺠﺪﻳﺪ. ﺍﻟﻤﺼﺪﺭ: ﺍﻟﻤﺠﻠﺔ ﺍﻟﻌﻠﻤﻴﺔ ﻟﻜﻠﻴﺔ ﺍﻟﺘﺮﺑﻴﺔ. ﺍﻟﻨﺎﺷﺮ ﻓﻌﺎﻟﻴﺔ ﺑﺮﻧﺎﻣﺞ ﺇﺭﺷﺎﺩﻱ ﻗﺎﺋﻢ ﻋﻠﻰ ﻓﻨﻴﺎﺕ ﺍﻟﻌﻼﺝ ﺍﻟﻨﻔﺴﻲ. ﺍﻹﻳﺠﺎﺑﻲ ﻓﻲ ﺧﻔﺾ ﺍﻟﻨﻬﻚ ﺍﻟﻨﻔﺴﻲ ﻟﺪﻯ ﻋﻴﻨﺔ ﻣﻦ ﻣﻌﻠﻤﻲ.",
        "programme_period": 60,
        "active": 1,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/programmes/AVkxiu4QaMVSNuNxwlfnNJluBWiMbAWvbPkZjRO9.jpg",
        "url": null,
        "usage_number": 27,
        "reminder_seats": 0,
        "phases_count": 5,
        "sessions_count": 1,
        "is_purchased": false,
        "phases": null,
        "doctor": null,
        "programme_id": 76,
        "progress": 0
      }
    ],
    "coupons": [
      {
        "id": 141,
        "coupon": "Bvu5M",
        "discount": 15,
        "discount_type": "percentage",
        "type": "doctor",
        "doctor_id": 2182,
        "durations": [
          {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 15,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 3,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 45,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 4,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 60,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 5,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 5,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2024-06-13T07:58:13.000000Z"
          }
        ],
        "user_limit_count": 2,
        "users_limit_count": 4,
        "usage_count": 0,
        "start_date": "2025-06-25",
        "end_date": "2025-07-08",
        "status": 1,
        "is_appear": 1,
        "created_at": "2025-06-25T12:00:14.000000Z",
        "updated_at": "2025-06-25T13:29:50.000000Z"
      },
      {
        "id": 141,
        "coupon": "Bvu5M",
        "discount": 15,
        "discount_type": "percentage",
        "type": "doctor",
        "doctor_id": 2182,
        "durations": [
          {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 15,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 3,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 45,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 4,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 60,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          {
            "id": 5,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 5,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2024-06-13T07:58:13.000000Z"
          }
        ],
        "user_limit_count": 2,
        "users_limit_count": 4,
        "usage_count": 0,
        "start_date": "2025-06-25",
        "end_date": "2025-07-08",
        "status": 1,
        "is_appear": 1,
        "created_at": "2025-06-25T12:00:14.000000Z",
        "updated_at": "2025-06-25T13:29:50.000000Z"
      }
    ],
    "is_fav": false,
    "association": null,
    "active": 1,
    "patients_count": 200,
    "reviews_count": 5,
    "reviews": [
      {
        "id": 28,
        "rating": 5,
        "description": "دكتور ممتاز ومستمعً جيد جزاه الله كل خير",
        "user": {
          "id": 129,
          "main_lang": "ar",
          "translate_id": null,
          "full_name": "طارق محمد مسلم",
          "nick_name": "طارق محمد مسلم",
          "phone_no": "1150585593",
          "bio": null,
          "original_gender": "ذكر",
          "gender": 0,
          "birth_date": "2005-10-02",
          "national_id": null,
          "verify_national_id": 0,
          "country": {
            "id": 63,
            "main_lang": "ar",
            "translate_id": null,
            "name": "مصر",
            "flag": "https://ipdata.co/flags/eg.png",
            "code": "EG",
            "code2": "EGY",
            "numcode": "818",
            "phone_code": "+20",
            "active": 1,
            "deleted_at": null,
            "created_at": null,
            "updated_at": null,
            "original_active": "فعال"
          },
          "fcm_token": null,
          "email": "ohhmer@gmail.com",
          "email_verified_at": null,
          "work_email": null,
          "work_email_verified_at": null,
          "original_active": "فعال",
          "active": 1,
          "referral_code": "TALBINAH-129",
          "referral_code_points": 200,
          "device_type": null,
          "device_name": null,
          "version_name": null,
          "version_code": null,
          "preferred_msg_channel": "both",
          "created_at": "2023-09-29T01:36:43.000000Z",
          "image": null,
          "points_count": 0
        },
        "doctor": null,
        "reservation": null,
        "date": "2023-12-05T03:53:59.000000Z"
      },
      {
        "id": 2,
        "rating": 5,
        "description": "شكرادكتور علي وقتك وعلمك",
        "user": {
          "id": 129,
          "main_lang": "ar",
          "translate_id": null,
          "full_name": "طارق محمد مسلم",
          "nick_name": "طارق محمد مسلم",
          "phone_no": "1150585593",
          "bio": null,
          "original_gender": "ذكر",
          "gender": 0,
          "birth_date": "2005-10-02",
          "national_id": null,
          "verify_national_id": 0,
          "country": {
            "id": 63,
            "main_lang": "ar",
            "translate_id": null,
            "name": "مصر",
            "flag": "https://ipdata.co/flags/eg.png",
            "code": "EG",
            "code2": "EGY",
            "numcode": "818",
            "phone_code": "+20",
            "active": 1,
            "deleted_at": null,
            "created_at": null,
            "updated_at": null,
            "original_active": "فعال"
          },
          "fcm_token": null,
          "email": "ohhmer@gmail.com",
          "email_verified_at": null,
          "work_email": null,
          "work_email_verified_at": null,
          "original_active": "فعال",
          "active": 1,
          "referral_code": "TALBINAH-129",
          "referral_code_points": 200,
          "device_type": null,
          "device_name": null,
          "version_name": null,
          "version_code": null,
          "preferred_msg_channel": "both",
          "created_at": "2023-09-29T01:36:43.000000Z",
          "image": null,
          "points_count": 0
        },
        "doctor": null,
        "reservation": null,
        "date": "2023-10-07T19:33:12.000000Z"
      },
      {
        "id": 61,
        "rating": 5,
        "description": "شكراا",
        "user": {
          "id": 143,
          "main_lang": "ar",
          "translate_id": null,
          "full_name": "hello",
          "nick_name": "hello",
          "phone_no": "546669007",
          "bio": null,
          "original_gender": "أنثى",
          "gender": 1,
          "birth_date": "1991-05-25",
          "national_id": "1071825200",
          "verify_national_id": 1,
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
          "fcm_token": null,
          "email": "raawwaan1411@gmail.com",
          "email_verified_at": null,
          "work_email": null,
          "work_email_verified_at": null,
          "original_active": "فعال",
          "active": 1,
          "referral_code": "TALBINAH-143",
          "referral_code_points": 200,
          "device_type": null,
          "device_name": null,
          "version_name": null,
          "version_code": null,
          "preferred_msg_channel": "both",
          "created_at": "2023-10-04T18:03:05.000000Z",
          "image": null,
          "points_count": 0
        },
        "doctor": null,
        "reservation": null,
        "date": "2024-01-09T19:46:27.000000Z"
      },
      {
        "id": 678,
        "rating": 5,
        "description": "thank you",
        "user": {
          "id": 143,
          "main_lang": "ar",
          "translate_id": null,
          "full_name": "hello",
          "nick_name": "hello",
          "phone_no": "546669007",
          "bio": null,
          "original_gender": "أنثى",
          "gender": 1,
          "birth_date": "1991-05-25",
          "national_id": "1071825200",
          "verify_national_id": 1,
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
          "fcm_token": null,
          "email": "raawwaan1411@gmail.com",
          "email_verified_at": null,
          "work_email": null,
          "work_email_verified_at": null,
          "original_active": "فعال",
          "active": 1,
          "referral_code": "TALBINAH-143",
          "referral_code_points": 200,
          "device_type": null,
          "device_name": null,
          "version_name": null,
          "version_code": null,
          "preferred_msg_channel": "both",
          "created_at": "2023-10-04T18:03:05.000000Z",
          "image": null,
          "points_count": 0
        },
        "doctor": null,
        "reservation": null,
        "date": "2024-06-12T16:08:30.000000Z"
      },
      {
        "id": 19,
        "rating": 5,
        "description": "شكرا",
        "user": {
          "id": 143,
          "main_lang": "ar",
          "translate_id": null,
          "full_name": "hello",
          "nick_name": "hello",
          "phone_no": "546669007",
          "bio": null,
          "original_gender": "أنثى",
          "gender": 1,
          "birth_date": "1991-05-25",
          "national_id": "1071825200",
          "verify_national_id": 1,
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
          "fcm_token": null,
          "email": "raawwaan1411@gmail.com",
          "email_verified_at": null,
          "work_email": null,
          "work_email_verified_at": null,
          "original_active": "فعال",
          "active": 1,
          "referral_code": "TALBINAH-143",
          "referral_code_points": 200,
          "device_type": null,
          "device_name": null,
          "version_name": null,
          "version_code": null,
          "preferred_msg_channel": "both",
          "created_at": "2023-10-04T18:03:05.000000Z",
          "image": null,
          "points_count": 0
        },
        "doctor": null,
        "reservation": null,
        "date": "2023-11-24T07:23:33.000000Z"
      }
    ],
    "preferred_msg_channel": "both",
    "created_by": "user",
    "created_at": "2023-09-13T03:04:38.000000Z",
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
    ],
    "is_classified": true
  }
};

export const mockFitrationParameters: IDoctorsFitrationParametersResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "specialties": {
      "key": "specialties_ids",
      "data": [
        {
          "id": 1,
          "name": "طبيب نفسي",
          "description": "وصف طبيب نفسي",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/JAjviULnGIvkv2hKjYkabA5123RcTXOHsR5KO8i5.png",
          "color": "#f2e3e9",
          "is_report": 1,
          "active": 1,
          "original_active": "فعال"
        },
        {
          "id": 2,
          "name": "أخصائي نفسي",
          "description": "وصف أخصائي نفسي",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/mt866VhJm6XwhMvROgIg3Mb7tNH6XgxmQpJ5zNVR.png",
          "color": "#d6f6ff",
          "is_report": 0,
          "active": 1,
          "original_active": "فعال"
        },
        {
          "id": 3,
          "name": "أخصائي إجتماعي",
          "description": "وصف أخصائي إجتماعي وأسري",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/rHsFIP4nwTE5YueAZLPwluq5JcmzSl2OBtQmXdGV.png",
          "color": "#faf0db",
          "is_report": 0,
          "active": 1,
          "original_active": "فعال"
        },
        {
          "id": 4,
          "name": "طبيب أسرة",
          "description": "وصف طبيب أسرة",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/S9rdRP0MCiz0YkmhXRfHjrjFaTjYbj7Hy9mTpclI.png",
          "color": "#dcedf9",
          "is_report": 1,
          "active": 1,
          "original_active": "فعال"
        },
        {
          "id": 8,
          "name": "اخصائي نطق وتخاطب",
          "description": "اخصائي نطق وتخاطب",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/S9rdRP0MCiz0YkmhXRfHjrjFaTjYbj7Hy9mTpclI.png",
          "color": "#dcedf9",
          "is_report": 1,
          "active": 1,
          "original_active": "فعال"
        },
        {
          "id": 9,
          "name": "علاج وظيفي",
          "description": "علاج وظيفي",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/b3oTccZJHa67pu8Qbt5fAOu3extj5urQteb4hdtB.png",
          "color": "#dcedf9",
          "is_report": 1,
          "active": 1,
          "original_active": "فعال"
        }
      ]
    },
    "min_price": {
      "key": "min_price",
      "data": 1
    },
    "max_price": {
      "key": "max_price",
      "data": 400
    },
    "languages": {
      "key": "languages_ids",
      "data": [
        {
          "id": 1,
          "title": "عربي"
        },
        {
          "id": 2,
          "title": "انجليزي"
        }
      ]
    },
    "services": {
      "key": "services_ids",
      "data": [
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
      ]
    },
    "gender": {
      "key": "gender",
      "data": [
        {
          "male": "male"
        },
        {
          "female": "female"
        }
      ]
    }
  }
};

export const mockToggleFavoriteDoctor: IToggleFavoriteDoctorResponseDto = {
  "status": true,
  "message": null,
  "data": null
};

export const mockAppointmentTypeSelections: IAppointmentTypeSelectionsResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 10,
      "name": "🏥 عيادة تلبينة",
      "description": "رعاية نفسية تخصصية مع نخبة من الأطباء والأخصائيين.",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/iO0bQJUAbiPelWFvc55MjB9txU9wh0ryqzEJM0jX.png",
      "color": "#006a81",
      "is_report": 1,
      "active": 1,
      "original_active": "فعال",
      "action_text": "احجز جلستك العلاجية",
      "first_color": "#b8efe9",
      "second_color": "#aecee7",
      "begin": "topCenter",
      "end": "bottomCenter",
      "action_color": "#e7ebf7"
    },
    {
      "id": 11,
      "name": "🌿 تلبينة رفاه",
      "description": "كوتشنج ورفاه شامل لحياه أكثر توازنًا وصفاء.",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/specialties-images/MlMZIHBKJWSfx7paQbUTVJullnjka5GIhOwdSwXI.png",
      "color": "#cc4c00",
      "is_report": 1,
      "active": 1,
      "original_active": "فعال",
      "action_text": "ابدأ رحلتك مع الرفاه",
      "first_color": "#baf0e8",
      "second_color": "#f5dab8",
      "begin": "centerRight",
      "end": "centerLeft",
      "action_color": "#e7ebf7"
    }
  ]
};

