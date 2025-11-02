import { IReservationsListingResponseDto, ICalculateReservationPriceResponseDto, IPaymentMethodsListingResponseDto, IReservationResponseDto, IReservationChatResponseDto, ICancelReservationResponseDto, IScheduleReservationResponseDto, ICalcReservationCancelPriceResponseDto, IReasonsCancelationListingResponseDto, IDoctorDaysLookupsResponseDto, IDoctorSlotsTimesResponseDto, IReasonsSchedulingLookupsResponseDto, INormalPackagesReservationResponseDto, ICheckPackagesReservationResponseDto, IMeetingChatItem, ILeaveRatingResponseDto, IReservationHomeworkResponseDto, IBlockUserResponseDto } from "../dtos";
import { MeetingChatItemTypes } from '../enums';
import { IApiResponse } from "../../../common";
import { ICheckDoctorAtReservationResponseDto } from "../services";

export const mockPaymentsListing: IPaymentMethodsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "main_lang": "ar",
      "translate_id": null,
      "name": "دفع من خلال المحفظة",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/payments-images/wallet.png",
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z",
      "package": null,
      "payment_id": 1,
      "balance": 0
    },
    {
      "id": 2,
      "main_lang": "ar",
      "translate_id": null,
      "name": "الدفع من خلال البطاقة الائتمانية و أبل و تابي",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/payments-images/Group.png",
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z",
      "package": null,
      "payment_id": 2,
      "balance": null
    }
  ]
};
export const mockReservationPrice: ICalculateReservationPriceResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "payments": {
      "total": {
        "currency": "ر.س",
        "value": 379.5,
        "label": "الاجمالى"
      },
      "payments": [
        {
          "currency": "ر.س",
          "value": 330,
          "label": "سعر الجلسات"
        },
        {
          "currency": "ر.س",
          "value": 49.5,
          "label": "الضريبة المضافة"
        },
        {
          "currency": "ر.س",
          "value": 0,
          "label": "قيمة الخصم"
        }
      ]
    },
    "coupon_id": null,
    "couponErrorMessage": null
  }
};

export const mockReservationsListing: IReservationsListingResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "reservations": {
      "data": [
        {
          "id": 2815,
          "price": 300,
          "price_after": 300,
          "price_display": 300,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "payments": {
            "total": {
              "currency": "ر.س",
              "value": 379.5,
              "label": "الاجمالى"
            },
            "payments": [
              {
                "currency": "ر.س",
                "value": 330,
                "label": "سعر الجلسات"
              },
              {
                "currency": "ر.س",
                "value": 49.5,
                "label": "الضريبة المضافة"
              },
              {
                "currency": "ر.س",
                "value": 0,
                "label": "قيمة الخصم"
              }
            ]
          },
          "reason": {
            "id": 1,
            "reason": "أريد أن أتحول إلى طبيب آخر",
            "type": 0,
            "original_type": "مريض",
            "active": 1,
            "original_active": "فعال"
          },
          "is_start": 1,
          "is_end": 1,
          "original_is_start": "attributes.Started",
          "original_is_end": "attributes.Ended",
          "start_time": "11:06:57",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "11:36:57",
          "date": "2024-10-15",
          "age": 26,
          "problem": "ةةة",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 0,
          "link": "6fa2803e9e6431227d560d08e2eaf380",
          "report_file": "https://redesign.talbinah.net/prescription?link=6fa2803e9e6431227d560d08e2eaf380",
          "is_blocked": false,
          "reservation_type": "normal",
          "original_type": "تقليديه",
          "active": 1,
          "admin_locked": true,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 1,
          "original_status": "قادم",
          "created_at": "2024-09-19T08:10:51.000000Z",
          "updated_at": "2024-10-15T08:07:41.000000Z"
        },
        {
          "id": 2842,
          "price": 300,
          "price_after": 300,
          "price_display": 300,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 1,
          "is_end": 1,
          "original_is_start": "attributes.Started",
          "original_is_end": "attributes.Ended",
          "start_time": "11:59:54",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "12:29:54",
          "date": "2024-10-20",
          "age": 26,
          "problem": "hgfff",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 0,
          "link": "860876757e3d5105778e32370fdedab3",
          "report_file": "https://redesign.talbinah.net/prescription?link=860876757e3d5105778e32370fdedab3",
          "is_blocked": false,
          "reservation_type": "normal",
          "original_type": "تقليديه",
          "active": 1,
          "admin_locked": true,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 1,
          "original_status": "قادم",
          "created_at": "2024-10-15T09:28:52.000000Z",
          "updated_at": "2024-10-20T16:28:08.000000Z"
        },
        {
          "id": 2843,
          "price": 100,
          "price_after": 80,
          "price_display": 80,
          "doctor": {
            "id": 2165,
            "full_name": "doctordev",
            "phone_no": "575457547",
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
            "nick_name": "rdoctor",
            "email": "alaarsm@gmail.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-10-24",
            "bio": "bnnjjjhjh I’m yjh",
            "license_number": "4444",
            "license_image": null,
            "license_expiry_date": null,
            "image": null,
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
            "price_half_hour": 100,
            "iban": null,
            "next_availability": null,
            "years_experience": 5,
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
              }
            ],
            "association": null,
            "reviews_avg": 4.418,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone12,1",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-16T13:46:41.000000Z",
            "national_id": null,
            "bank_name": null,
            "badges": [
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
              },
              {
                "id": 4,
                "name": "+100 جلسات",
                "description": null,
                "type": "reservations",
                "display_type": "reservations",
                "condition_type": "greeter",
                "display_condition_type": "أكبر من",
                "condition_value": 100,
                "doctor_percentage": null,
                "color": "#0b678e",
                "icon": "https://redesign.talbinah.net/dashboard_assets/media/svg/icons/General/Star.svg",
                "is_active": 1,
                "created_at": "2025-02-08T21:19:55.000000Z"
              }
            ],
            "is_recommended": true,
            "reviews_count": 55
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "11:30:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "12:00:00",
          "date": "2024-10-18",
          "age": 26,
          "problem": "gfffg",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 0,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "package",
          "original_type": "باقة",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 0,
          "original_status": "تم الغائه",
          "created_at": "2024-10-15T09:39:26.000000Z",
          "updated_at": "2024-10-17T08:09:17.000000Z"
        },
        {
          "id": 2848,
          "price": 300,
          "price_after": 300,
          "price_display": 300,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "12:00:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "12:30:00",
          "date": "2024-10-17",
          "age": 26,
          "problem": "vvvv",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 0,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "normal",
          "original_type": "تقليديه",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 0,
          "original_status": "تم الغائه",
          "created_at": "2024-10-16T08:58:22.000000Z",
          "updated_at": "2024-10-17T07:49:08.000000Z"
        },
        {
          "id": 2851,
          "price": 300,
          "price_after": 300,
          "price_display": 300,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "12:00:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "12:30:00",
          "date": "2024-10-17",
          "age": 26,
          "problem": "vvv",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 0,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "normal",
          "original_type": "تقليديه",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 0,
          "original_status": "تم الغائه",
          "created_at": "2024-10-17T08:10:09.000000Z",
          "updated_at": "2024-10-17T08:11:35.000000Z"
        },
        {
          "id": 2852,
          "price": 300,
          "price_after": 300,
          "price_display": 300,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "09:30:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "10:00:00",
          "date": "2024-10-18",
          "age": 26,
          "problem": "bbb",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 0,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "normal",
          "original_type": "تقليديه",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 0,
          "original_status": "تم الغائه",
          "created_at": "2024-10-17T08:12:24.000000Z",
          "updated_at": "2024-10-20T14:25:50.000000Z"
        },
        {
          "id": 2853,
          "price": 300,
          "price_after": 300,
          "price_display": 300,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "09:00:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "09:30:00",
          "date": "2024-10-20",
          "age": 26,
          "problem": "ff",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 0,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "normal",
          "original_type": "تقليديه",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 0,
          "original_status": "تم الغائه",
          "created_at": "2024-10-17T08:13:04.000000Z",
          "updated_at": "2024-10-20T15:59:52.000000Z"
        },
        {
          "id": 2869,
          "price": 75,
          "price_after": 56,
          "price_display": 56,
          "doctor": {
            "id": 291,
            "full_name": "منال الغيداني",
            "phone_no": "543337718",
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
            "nick_name": "د/منال",
            "email": null,
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "1991-02-16",
            "bio": "أخصائي نفسي إكلينيكي.\nحاصلة على بكالوريوس علم نفس.\nحاصلة على التصنيف الصحي من هيئة التخصصات الصحية.\nطالبة ماجستير علم النفس.",
            "license_number": "19040011",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_2233E760-82C1-4B76-A331-43A084C50E53-4633-000001974A7F3E84_1703014951.png",
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
              "id": 183,
              "doctor_id": 291,
              "day_id": 3,
              "date": "2024-08-20",
              "start_time": "10:00:00",
              "end_time": "10:30:00",
              "created_at": "2024-05-12T21:10:03.000000Z",
              "updated_at": "2024-08-19T17:02:04.000000Z"
            },
            "years_experience": 3,
            "coupons": [],
            "services": [
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              },
              {
                "id": 6,
                "title": "اضطراب ما بعد الصدمة"
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
                "id": 16,
                "title": "توهم المرض"
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
            "created_at": "2023-11-15T01:10:21.000000Z",
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
              }
            ],
            "is_recommended": true,
            "reviews_count": 1
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "10:30:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "11:00:00",
          "date": "2024-10-21",
          "age": 27,
          "problem": "باقة التعافي",
          "duration": {
            "id": 2,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 30,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 1,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "programme",
          "original_type": "برنامج",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 1,
          "original_status": "قادم",
          "created_at": "2024-10-20T14:24:56.000000Z",
          "updated_at": "2024-10-21T07:00:02.000000Z"
        },
        {
          "id": 2870,
          "price": 195,
          "price_after": 150,
          "price_display": 150,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "09:15:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "09:30:00",
          "date": "2024-10-21",
          "age": 27,
          "problem": "gvg",
          "duration": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 15,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 1,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "package",
          "original_type": "باقة",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 0,
          "original_status": "تم الغائه",
          "created_at": "2024-10-20T16:38:51.000000Z",
          "updated_at": "2024-10-20T16:48:34.000000Z"
        },
        {
          "id": 2871,
          "price": 195,
          "price_after": 150,
          "price_display": 150,
          "doctor": {
            "id": 2182,
            "full_name": "عمر ديف",
            "phone_no": "1126075400",
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
            "nick_name": "عمررررر",
            "email": "ooo@g.com",
            "original_gender": "ذكر",
            "gender": 0,
            "birth_date": "2006-09-24",
            "bio": "اللاتلرررررراتت",
            "license_number": "2525588",
            "license_image": null,
            "license_expiry_date": null,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/ZO4Gpdai5W8bsjILW5XxPeNnTsYBzwNoU6edqlEO.jpg",
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
            "price_half_hour": 300,
            "iban": null,
            "next_availability": null,
            "years_experience": 3,
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
              }
            ],
            "services": [
              {
                "id": 3,
                "title": "الشخصية الحدية"
              },
              {
                "id": 5,
                "title": "اضطرابات الشخصية"
              }
            ],
            "association": {
              "id": 1,
              "name": "جمعية رسالة",
              "nickname": "رسالة",
              "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/associations/7cMdRVFSMf45CbZGgUv00T9HVlIl13DebeYflXXs.png",
              "doctor_percentage": 0.25,
              "color": "#ccd6f5",
              "created_at": "2025-01-12T15:33:56.000000Z",
              "updated_at": "2025-01-12T16:08:39.000000Z"
            },
            "reviews_avg": 4.354,
            "is_fav": false,
            "active": 1,
            "preferred_msg_channel": "both",
            "device_type": "IOS",
            "device_name": "iPhone13,3",
            "version_name": "2.3.30",
            "version_code": "160",
            "created_at": "2024-09-19T07:15:00.000000Z",
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
            "reviews_count": 48
          },
          "user": {
            "id": 949,
            "full_name": "عمر محمد",
            "nick_name": "عمر محمد",
            "original_gender": "أنثى",
            "gender": 1,
            "image": null,
            "active": 1,
            "preferred_msg_channel": "whatsapp",
            "created_at": "2024-03-19T08:33:19.000000Z"
          },
          "is_start": 0,
          "is_end": 0,
          "original_is_start": "لم تبدأ",
          "original_is_end": "لم تنتهي",
          "start_time": "10:15:00",
          "assignment_count": 0,
          "assignment_reviewed_count": 0,
          "end_time": "10:30:00",
          "date": "2024-10-21",
          "age": 27,
          "problem": "hbh",
          "duration": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "duration": 15,
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "communication": {
            "id": 1,
            "main_lang": "ar",
            "translate_id": null,
            "name": "رسائل",
            "description": "دردشة مع الدكتور",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
            "price": 10,
            "color": "#FFF7E2",
            "hard_color": "#FEBA0C",
            "active": 1,
            "original_active": "فعال",
            "created_at": "2023-09-06T21:55:13.000000Z"
          },
          "gender": 1,
          "link": null,
          "report_file": null,
          "is_blocked": false,
          "reservation_type": "package",
          "original_type": "باقة",
          "active": 1,
          "admin_locked": false,
          "doctor_locked": true,
          "original_active": "فعال",
          "status": 0,
          "original_status": "تم الغائه",
          "created_at": "2024-10-20T16:53:30.000000Z",
          "updated_at": "2024-10-20T17:02:45.000000Z"
        }
      ],
      "links": {
        "first": "https://redesign.talbinah.net/api/reservations?page=1",
        "last": "https://redesign.talbinah.net/api/reservations?page=9",
        "prev": null,
        "next": "https://redesign.talbinah.net/api/reservations?page=2"
      },
      "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 9,
        "links": [
          {
            "url": null,
            "label": "pagination.previous",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=1",
            "label": "1",
            "active": true
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=2",
            "label": "2",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=3",
            "label": "3",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=4",
            "label": "4",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=5",
            "label": "5",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=6",
            "label": "6",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=7",
            "label": "7",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=8",
            "label": "8",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=9",
            "label": "9",
            "active": false
          },
          {
            "url": "https://redesign.talbinah.net/api/reservations?page=2",
            "label": "pagination.next",
            "active": false
          }
        ],
        "path": "https://redesign.talbinah.net/api/reservations",
        "per_page": 10,
        "to": 10,
        "total": 89
      }
    },
    "upcoming_count": 25,
    "ending_count": 42,
    "current_count": 0,
    "canceled_count": 15
  }
};

export const mockCnacelReservationItem: ICancelReservationResponseDto = {
  "status": true,
  "message": null,
  "data": null
};
export const mockCalcPriceCnacelReservationItem: ICalcReservationCancelPriceResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "original_price": 15,
    "returned_value": 13.5,
    "returned_precentage": 90,
    "deducted_value": 1.5,
    "message": "سيتم خصم مبلغ 1.5 ر.س"
  }
};
export const mockReasonsCancelation: IReasonsCancelationListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "reason": "أريد أن أتحول إلى طبيب آخر",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 2,
      "reason": "اريد تغيير الحزمة",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 3,
      "reason": "لا اريد التشاور",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 4,
      "reason": "لقد تعافيت من المرض",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 5,
      "reason": "لقد وجدت الدواء المناسب",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 6,
      "reason": "أنا فقط أريد الإلغاء",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 7,
      "reason": "لا اريد ان اقول",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 8,
      "reason": "أخرى",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    }
  ]
};


export const mockReasonsScheduling: IReasonsSchedulingLookupsResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "reason": "أواجه تضارب في الجدول الزمني",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 2,
      "reason": "أنا لست متاحا في الموعد المحدد",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 3,
      "reason": "لدي نشاط لا يمكن تركه ورائي",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 4,
      "reason": "لا اريد ان اقول",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    },
    {
      "id": 5,
      "reason": "أخرى",
      "type": 0,
      "original_type": "مريض",
      "active": 1,
      "original_active": "فعال"
    }
  ]
};
export const mockDoctorDays: IDoctorDaysLookupsResponseDto = {
  "status": true,
  "message": null,
  "data": {
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
      }
    ],
    "vacations": []
  }
};
export const mockDoctorSlotsTimes: IDoctorSlotsTimesResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 422,
      "main_lang": "ar",
      "translate_id": null,
      "doctor_id": 165,
      "day_id": 2,
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "free": 0,
      "active": 1,
      "deleted_at": null,
      "created_at": "2023-10-06T23:16:07.000000Z",
      "updated_at": "2023-10-06T23:16:07.000000Z",
      "times": [
        {
          "start_time": "09:00",
          "end_time": "09:30"
        },
        {
          "start_time": "09:30",
          "end_time": "10:00"
        },
        {
          "start_time": "10:00",
          "end_time": "10:30"
        },
        {
          "start_time": "10:30",
          "end_time": "11:00"
        },
        {
          "start_time": "11:00",
          "end_time": "11:30"
        },
        {
          "start_time": "11:30",
          "end_time": "12:00"
        },
        {
          "start_time": "12:00",
          "end_time": "12:30"
        },
        {
          "start_time": "12:30",
          "end_time": "13:00"
        },
        {
          "start_time": "13:00",
          "end_time": "13:30"
        },
        {
          "start_time": "13:30",
          "end_time": "14:00"
        },
        {
          "start_time": "14:00",
          "end_time": "14:30"
        },
        {
          "start_time": "14:30",
          "end_time": "15:00"
        },
        {
          "start_time": "15:00",
          "end_time": "15:30"
        },
        {
          "start_time": "15:30",
          "end_time": "16:00"
        },
        {
          "start_time": "16:00",
          "end_time": "16:30"
        },
        {
          "start_time": "16:30",
          "end_time": "17:00"
        }
      ],
      "original_active": "فعال"
    }
  ]
};

export const mockscheduleReservationItem: IScheduleReservationResponseDto = {
  "status": true,
  "message": null,
  "data": null
};
export const mockCheckPackagesReservation: ICheckPackagesReservationResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "packages": [
      {
        "id": 1,
        "price": 300,
        "number_of_reservations": 2,
        "usage_number": 3,
        "max_reservation_price": null,
        "package_period": 30,
        "type": "doctor",
        "discount": 200,
        "active": 1,
        "reservations_count": 6,
        "durations": {
          "id": 2,
          "main_lang": "ar",
          "translate_id": null,
          "duration": 30,
          "active": 1,
          "original_active": "فعال",
          "created_at": "2023-09-06T21:55:13.000000Z"
        },
        "url": null
      },
      {
        "id": 20,
        "price": 450,
        "number_of_reservations": 2,
        "usage_number": 0,
        "max_reservation_price": null,
        "package_period": 30,
        "type": "doctor",
        "discount": 50,
        "active": 1,
        "reservations_count": 0,
        "durations": {
          "id": 2,
          "main_lang": "ar",
          "translate_id": null,
          "duration": 30,
          "active": 1,
          "original_active": "فعال",
          "created_at": "2023-09-06T21:55:13.000000Z"
        },
        "url": null
      },
      {
        "id": 105,
        "price": 960,
        "number_of_reservations": 4,
        "usage_number": 0,
        "max_reservation_price": null,
        "package_period": 90,
        "type": "doctor",
        "discount": 40,
        "active": 1,
        "reservations_count": 0,
        "durations": {
          "id": 2,
          "main_lang": "ar",
          "translate_id": null,
          "duration": 30,
          "active": 1,
          "original_active": "فعال",
          "created_at": "2023-09-06T21:55:13.000000Z"
        },
        "url": null
      }
    ],
    "has_package": 1
  }
};

export const mockNormalPackagesReservation: INormalPackagesReservationResponseDto = {
  "status": true,
  "message": null,
  "data": null
};

export const mockReservationItem: IReservationResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 3124,
    "url": null,
    "remaining_time": 1800,
    "current_time": "2025-06-28 15:30:08",
    "price": 200,
    "price_after": 200,
    "price_display": 200,
    "doctor": {
      "id": 2232,
      "full_name": "عمر 402",
      "phone_no": "1126075402",
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
      "nick_name": "عمر",
      "email": null,
      "original_gender": "ذكر",
      "gender": 0,
      "birth_date": "2006-12-02",
      "bio": "تتاالللاا",
      "license_number": "123456789",
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
      "price_half_hour": 200,
      "iban": null,
      "next_availability": null,
      "years_experience": 3,
      "coupons": [],
      "services": [
        {
          "id": 5,
          "title": "اضطرابات الشخصية"
        }
      ],
      "association": null,
      "reviews_avg": 5,
      "is_fav": false,
      "active": 1,
      "preferred_msg_channel": "both",
      "device_type": "IOS",
      "device_name": "iPhone15,3",
      "version_name": "2.3.31",
      "version_code": "162",
      "created_at": "2024-11-27T07:44:06.000000Z",
      "national_id": null,
      "bank_name": null,
      "badges": [
        {
          "id": 2,
          "name": "+10 جلسات",
          "description": null,
          "type": "reservations",
          "display_type": "reservations",
          "condition_type": "greeter",
          "display_condition_type": "أكبر من",
          "condition_value": 10,
          "doctor_percentage": null,
          "color": "#1fd2ff",
          "icon": "https://redesign.talbinah.net/dashboard_assets/media/svg/icons/General/Star.svg",
          "is_active": 1,
          "created_at": "2025-01-26T10:34:25.000000Z"
        }
      ],
      "is_recommended": true,
      "reviews_count": 1
    },
    "user": {
      "id": 949,
      "main_lang": "ar",
      "translate_id": null,
      "full_name": "عمر محمد",
      "nick_name": "عمر محمد",
      "phone_no": "1126075200",
      "bio": null,
      "original_gender": "أنثى",
      "gender": 1,
      "birth_date": "1999-04-14",
      "national_id": "1108207695",
      "verify_national_id": 1,
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
      "fcm_token": "cc070tDaSH6wDrvHZqNcWH:APA91bFKaaAJ4j0TkpkB6PToXnSHT8bVSpj1QxxHpCuaXY_O3bZ0W8G83pA7a3hauO1dxaFAmOn48ahmYcKkkhqVeHUFzJBaGMEix_6wTrxu2rgSNVoglI8",
      "email": null,
      "email_verified_at": null,
      "work_email": "omarali@talbinah.net",
      "work_email_verified_at": "2025-01-06 13:38:32",
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-949",
      "referral_code_points": 200,
      "device_type": "Android",
      "device_name": "CPH1911",
      "version_name": "2.2.51",
      "version_code": "241",
      "preferred_msg_channel": "whatsapp",
      "created_at": "2024-03-19T08:33:19.000000Z",
      "image": null,
      "points_count": 0
    },
    "coupon": {
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
    "follow_doctor": null,
    "transfer_doctor": null,
    "suggest_doctor": null,
    "tickets": [],
    "time_line": [
      {
        "id": 6091,
        "reservation_id": 3124,
        "description": "تم حجز موعد جديد يوم الثلاثاء 2025-03-04 بتوقيت من : 14:00 الى 14:30",
        "label": "حجز موعد",
        "status": "موعد جديد",
        "doctor": null,
        "created_at": "2025-03-04T14:13:16.000000Z"
      }
    ],
    "assignments": [],
    "prescriptions": [],
    "is_start": 0,
    "is_end": 0,
    "original_is_start": "لم تبدأ",
    "original_is_end": "لم تنتهي",
    "visit_chat_time_user": "2025-05-14 11:34:00",
    "visit_chat_time_doctor": null,
    "visit_call_time_user": null,
    "visit_call_time_doctor": null,
    "day": "الثلاثاء",
    "start_time": "14:00:00",
    "end_time": "14:30:00",
    "date": "2025-03-04",
    "duration": {
      "id": 2,
      "main_lang": "ar",
      "translate_id": null,
      "duration": 30,
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z"
    },
    "review": null,
    "communication": {
      "id": 1,
      "main_lang": "ar",
      "translate_id": null,
      "name": "رسائل",
      "description": "دردشة مع الدكتور",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/message.svg",
      "price": 10,
      "color": "#FFF7E2",
      "hard_color": "#FEBA0C",
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z"
    },
    "payment": {
      "id": 1,
      "main_lang": "ar",
      "translate_id": null,
      "name": "دفع من خلال المحفظة",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/payments-images/wallet.png",
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z",
      "package": null,
      "payment_id": 1,
      "balance": 3955.2
    },
    "problem": "hhhghhggggggghbbbnnn",
    "message": null,
    "description": null,
    "notes": null,
    "report": null,
    "filename": null,
    "link": null,
    "report_file": "https://redesign.talbinah.net/prescription?link=",
    "full_name": "عمر محمد",
    "gender": 1,
    "age": 27,
    "reason": null,
    "active": 1,
    "status": 1,
    "is_blocked": false,
    "admin_locked": false,
    "doctor_locked": true,
    "reservation_type": "normal",
    "original_active": "فعال",
    "original_status": "قادم",
    "original_type": "تقليديه",
    "created_at": "2025-03-04T11:13:16.000000Z"
  }
};
export const mockReservationChatItem: IApiResponse<IReservationChatResponseDto[]> = {
  "status": true,
  "message": null,
  "data": [
    {
      "message": null,
      "replay": "ياهلا فيك يا Fady Shehata! أنا هنا عشان أساعدك. قول لي وش مشكلتك أو أي شيء مضايقك، واكتب لي بالطريقة اللي تريحك.",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": null
    },
    {
      "message": "رشح ليا دكتور",
      "replay": "بناءً على إجاباتك، نرشح لك قائمة الصور التالية يمكنك اختيار أحد الأطباء وحجز موعد الآن",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": {
        "type": MeetingChatItemTypes.DOCTOR,
        "items": [
          {
            "id": 43,
            "full_name": "د.عبدالمجيد الخميس",
            "specialist": [
              "طبيب نفسي"
            ],
            "specialist_id": [
              1
            ],
            "bio": "أستاذ الطب النفسي ، طبيب استشاري حاصل على زمالتي الطب النفسي الجسدي والعلاج النفسي بالكلام (السيكوديناميكي) من الولايات المتحدة الأمريكية\r\n متخصص بعلاج حالات:\r\n •القلق الاجتماعي وضعف تقدير النفس\r\n •رهاب الساح والأماكن المفتوحة\r\n •القلق العام\r\n •نوبات العلع\r\n •الوسواس القهري\r\n •القلق من الأمراض وتوهم المرض\r\n •حالات الأكتئاب والتأقلم\r\n •الفصام والأمراض الذهانية\r\n •ثنائي القطب والاضطرابات الوجدانية\r\n •الإدمان\r\n •اضطرابات الشخصية والسلوكيات الإنتحارية\r\n •متخصص بالعلاج الكلامي",
            "gender": 0,
            "reservation_count": 82,
            "avg_rate": 5,
            "count_rate": 5,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/JPEG%20image-C9B8EFE69106-1_1694708488.jpg",
            "price_half_hour": 250,
            "years_experience": 12,
            "copouns": [],
            "nextAvailability": {
              "id": 176,
              "doctor_id": 43,
              "day_id": 3,
              "date": "2024-08-19",
              "start_time": "21:00:00",
              "end_time": "21:30:00",
              "created_at": "2024-05-12T21:10:03.000000Z",
              "updated_at": "2024-08-19T17:02:04.000000Z"
            }
          },
          {
            "id": 291,
            "full_name": "منال الغيداني",
            "specialist": [
              "أخصائي نفسي"
            ],
            "specialist_id": [
              2
            ],
            "bio": "أخصائي نفسي إكلينيكي.\nحاصلة على بكالوريوس علم نفس.\nحاصلة على التصنيف الصحي من هيئة التخصصات الصحية.\nطالبة ماجستير علم النفس.",
            "gender": 0,
            "reservation_count": 94,
            "avg_rate": 5,
            "count_rate": 5,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_2233E760-82C1-4B76-A331-43A084C50E53-4633-000001974A7F3E84_1703014951.png",
            "price_half_hour": 75,
            "years_experience": 3,
            "copouns": [],
            "nextAvailability": {
              "id": 183,
              "doctor_id": 291,
              "day_id": 3,
              "date": "2024-08-20",
              "start_time": "10:00:00",
              "end_time": "10:30:00",
              "created_at": "2024-05-12T21:10:03.000000Z",
              "updated_at": "2024-08-19T17:02:04.000000Z"
            }
          },
          {
            "id": 1774,
            "full_name": "أحمد خلف",
            "specialist": [
              "أخصائي نفسي"
            ],
            "specialist_id": [
              2
            ],
            "bio": "-أخصائي نفسي اكلينيكي.\r\n-خبرة 14 سنة في المجال النفسي.\r\n-متخصص في الجلسات العلاجية والاستشارات التربوية والنفسية.\r\n-متخصص في التدخلات النفسية وتصميم البرامج العلاجية (الفردية/الجماعية)\r\n\r\n-حاصل على:\r\nماجستير في علم النفس.\r\nدبلوم علم نفس اكلينيكي.\r\nدبلوم خاص في التربية.\r\nالبورد الأمريكي في التكامل الحسي.\r\nمحاضر ومدرب في عدة قطاعات حكومية وخاصة.",
            "gender": 0,
            "reservation_count": 1,
            "avg_rate": 4,
            "count_rate": 0,
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/GTKlXLATYBSqhoYWV5tZuM9mMJFJBJqkPq1EM5zk.png",
            "price_half_hour": 150,
            "years_experience": 14,
            "copouns": [],
            "nextAvailability": {
              "id": 298,
              "doctor_id": 1774,
              "day_id": 3,
              "date": "2024-08-19",
              "start_time": "22:00:00",
              "end_time": "22:30:00",
              "created_at": "2024-07-20T16:15:03.000000Z",
              "updated_at": "2024-08-19T17:02:04.000000Z"
            }
          }
        ]
      }
    },
    {
      "message": "رشح ليا بودكاست",
      "replay": "بناءً على إجاباتك، نرشح لك قائمة البودكاست التالية يمكنك اختيار بودكاست منهم",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": {
        "type": MeetingChatItemTypes.PODCAST,
        "items": [
          {
            "id": 1,
            "title": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
            "description": "يشجع المشاركين على تطوير قدراتهم الشخصية وتحفيز أنفسهم لتحقيق أهدافهم.",
            "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/cWIrPxX1k7evzhHXv87yCV34Aq4hUuZiLYZktFic.png",
            "background_color": "#fff1f7",
            "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/xOT80IEhYpceGg3sckXOyvHsjwD0F3yq7SUcJHUV.mp3",
            "file_type": "audio",
            "link_type": "file",
            "duration": "01:27",
            "type": "free",
            "visit_count": 46,
            "status": 1,
            "created_at": "2024-07-30T16:48:55.000000Z",
            "updated_at": "2025-05-29T10:45:26.000000Z",
            "podcast_category": null,
            "promo": null,
            "start_duration_from": {
              "podcast_id": 1,
              "user_id": 242,
              "start_duration_from": 0,
              "visit_count": 1,
              "created_at": "2025-05-29T10:45:26.000000Z",
              "updated_at": "2025-05-29T10:45:26.000000Z"
            },
            "is_bookmarked": false
          },
          {
            "id": 2,
            "title": "لأجل نفسك لا لأجل غيرك 2",
            "description": "لأجل نفسك لا لأجل غيرك - ياسر الحزيمي",
            "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/wfIKtuuqxIeD3F7oMRTvR6AsLudwWqlhv2toaZG2.png",
            "background_color": "#f5f9ec",
            "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/gjnG09o6l2tBv1XsXWBt6i7eR2f0h19vY0oVu2tQ.mp3",
            "file_type": "audio",
            "link_type": "file",
            "duration": "01:12",
            "type": "free",
            "visit_count": 53,
            "status": 1,
            "created_at": "2024-07-30T16:51:38.000000Z",
            "updated_at": "2025-05-06T08:47:57.000000Z",
            "podcast_category": null,
            "promo": null,
            "start_duration_from": {
              "podcast_id": 2,
              "user_id": 242,
              "start_duration_from": 0,
              "visit_count": 1,
              "created_at": "2024-10-10T18:09:49.000000Z",
              "updated_at": "2024-10-10T18:09:49.000000Z"
            },
            "is_bookmarked": false
          },
          {
            "id": 3,
            "title": "لأجل نفسك لا لأجل غيرك 3",
            "description": "الوصف عبارة عما دل على الذات باعتبار معنى هو المقصود من جوهر حروفه، أي يدل على الذات بصفة، كأحمر فإنه بجوهر حروفه يدل على معنى مقصود",
            "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/9EHL1zX8DNUm6qoT438FrXHxn9NNARIBx8O8y5Zx.png",
            "background_color": "#ebf5fa",
            "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/uln0Y58vP4il02jHPOBbjgw0PSQ4H7x5GrPZZk5W.mp3",
            "file_type": "audio",
            "link_type": "file",
            "duration": "02:18",
            "type": "free",
            "visit_count": 93,
            "status": 1,
            "created_at": "2024-07-30T16:56:41.000000Z",
            "updated_at": "2025-06-17T10:49:46.000000Z",
            "podcast_category": null,
            "promo": null,
            "start_duration_from": {
              "podcast_id": 3,
              "user_id": 242,
              "start_duration_from": 12,
              "visit_count": 3,
              "created_at": "2024-10-12T21:19:46.000000Z",
              "updated_at": "2024-12-09T14:15:14.000000Z"
            },
            "is_bookmarked": false
          }
        ]
      }
    },
    {
      "message": "رشح ليا مقال",
      "replay": "بناءً على إجاباتك، نرشح لك قائمة المقالات التالية يمكنك اختيار مقال منهم",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": {
        "type": MeetingChatItemTypes.ARTICLE,
        "items": [
          {
            "id": 20,
            "article_category": {
              "id": 1,
              "name": "الحزن والقلق",
              "image": null,
              "created_at": "2023-09-06T22:12:08.000000Z"
            },
            "keywords": [],
            "title": "نصائح للحد من تقلب المزاج المفاجئ",
            "description": "<p><b><font color=\"#003163\">إليك بعض النصائح التي يمكن أن تساعدك في الحفاظ على استقرار المزاج والتعامل مع تقلباته المفاجئة، خاصة إذا كانت الأسباب بسيطة:</font></b></p><ol><li><font color=\"#083139\"><strong>تجنب التوتر والإجهاد</strong>: </font>حاول تجنب الضغوطات اليومية والعملية بقدر الإمكان، وخصص وقتًا للاسترخاء والعناية بنفسك.</li><li><font color=\"#083139\"><strong>مارس هواياتك المفضلة</strong>: </font>استفد من أوقات الفراغ بممارسة الأنشطة التي تحبها، سواء كان ذلك بالخروج في نزهة أو قضاء وقت ممتع مع العائلة والأصدقاء.</li><li><font color=\"#083139\"><strong>التفكير الإيجابي</strong>:</font> ركز على الأمور الجيدة في حياتك وابتعد عن التقليل من شأن نفسك أو النقد الذاتي المفرط.</li><li><font color=\"#083139\"><strong>تناول طعامًا صحيًا</strong>: </font>احرص على نظام غذائي متوازن وغني بالفيتامينات والمعادن والألياف لتعزيز صحتك العامة.</li><li><font color=\"#083139\"><strong>ممارسة الرياضة</strong>: </font>حاول ممارسة التمارين الرياضية بانتظام، فهي تساهم في تحسين المزاج والحد من التوتر.</li><li><font color=\"#083139\"><strong>النوم الكافي</strong>: </font>تأكد من الحصول على قسط كافٍ من النوم للمساعدة في الحفاظ على توازن المزاج.</li><li><font color=\"#083139\"><strong>تجنب الكحول والتدخين</strong>: </font>حاول الابتعاد عن تناول المشروبات الكحولية والتدخين، حيث يمكن أن يؤثرا سلبًا على المزاج.</li><li><font color=\"#083139\"><strong>استشارة المختصين</strong>:</font> في حال شعرت بأعراض مرضية تؤثر على مزاجك، لا تتردد في مراجعة الأخصائيين للحصول على الدعم المناسب.</li></ol>",
            "trending": 0,
            "original_trending": "غير شائعة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/rTU9Yb0TIuOhP7I3RbEmvC7wXEbaQJTyMPHOOL4O.jpg",
            "is_bookmark": false,
            "created_at": "2024-07-16T15:40:13.000000Z",
            "new": false
          },
          {
            "id": 24,
            "article_category": {
              "id": 1,
              "name": "الحزن والقلق",
              "image": null,
              "created_at": "2023-09-06T22:12:08.000000Z"
            },
            "keywords": [],
            "title": "تأثير القلق على الحياة اليومية",
            "description": "<p><font color=\"#083139\">يعاني الكثير من الأشخاص من ضيق الوقت والانشغال الشديد بين العمل والمهام الأخرى مما يزيد من الضغط عليهم ويسبب التوتر والقلق وتكون النتيجة قلقًا وإجهادًا وهم وحزن على مختلف تفاصيل الحياة بشكل يؤثر على الصحة النفسية والجسدية ، </font></p><p>وقد كان رسول الله ﷺ يُكثر من التعوذ منهما ويجمع بينهما فيقول :\"اللهم إني أعوذ بك من الهم والحزن\".</p><p><font color=\"#003163\"><span style=\"font-weight: 600;\">القلق</span>&nbsp;: </font>هو شعور بعدم الارتياح ، مثل التوتر أو الخوف ، يمكن أن يكون خفيفًا أو شديدًا.</p><p><font color=\"#003163\"><span style=\"font-weight: 600;\">اضطراب القلق العام :</span>&nbsp;</font>هي حالة طويلة الأمد تجعلك تشعر بالقلق حيال مجموعة واسعة من المواقف والقضايا ، بدلاً من حدث واحد محدد.</p><p>يمكن أن يسبب أعراضًا نفسية أو جسدية وقد يختلف من شخص لآخر لكن يشمل على:&nbsp;</p><p>&nbsp;• الشعور بالقلق أو التوتر .</p><p>&nbsp;• مواجهة صعوبة في التركيز أو النوم .</p><p>&nbsp;• الدوخة أو خفقان القلب .</p><p>&nbsp;• التركيز على الصُّعوبات أو التفكير في أيِّ أمرٍ .</p><p>&nbsp;• الشعور بالخطر الوَشيك أو الذُّعر أو التّشاؤم .</p><p><br></p><p><span style=\"font-weight: 600;\"><font color=\"#003163\">ماهي الأسباب وراء القلق؟&nbsp;</font></span></p><p>الأسباب كثيرة لكن أهمها قد يكون بسبب:</p><p>• فرط النشاط في مناطق الدماغ التي تشارك في المشاعر والسلوك .</p><p>• خلل في المواد الكيميائية في الدماغ مثل السيروتونين و النورادرينالين ، والتي تشارك في التحكم في المزاج وتنظيمه .</p><p>• الوراثة يُقدر أنك أكثر عرضة لإلصابة باضطراب القلق بخمس مرات إذا كان لديك قريب مقرب مصاب بهذه الحالة .&nbsp;</p><p>• وجود تاريخ من التجارب المجهدة أو المؤلمة ، مثل العنف الأسري أو إساءة معاملة الأطفال أو التنمر .</p><p>• الإصابة بحالة صحية مؤلمة طويلة الأمد .</p><p>• وجود تاريخ من تعاطي المخدرات أو الكحول .</p><p>• الكثير من الناس يصابون باضطراب القلق العام (GAD) دون سبب واضح .</p><p><br></p><p><span style=\"font-weight: 600;\"><font color=\"#003163\">كيف يمكن التحكم في القلق وعلاجه ؟!</font></span></p><p>طرق العلاج متعددة وتشمل :</p><p>• العلاجات النفسية : يمكنك الحصول على علاجات نفسية مثل العلاج السلوكي المعرفي (CBT)</p><p>• الأدوية : مثل نوع من مضادات الاكتئاب يسمى مثبطات امتصاص السيروتونين االنتقائية (SSRIS)</p><p><br></p><p>في الختام: لا يمكن إنكار أن القلق جزء أساسي من الحياة، وأن التوتر موجود في كل زاوية من الأنشطة اليومية، وقد لا تختفي مخاوفك من تلقاء نفسها، ويمكن أن تكون إدارته مهمة شاقة وتحتاج لاتباع خطة معينة للتغلب عليه.</p><p>فإذا شعرت أن القلق والتوتر يؤثر عليك ويعيق حياتك اليومية لا تتردد في التواصل مع معالجك النفسي عبر تطبيق تلبينة 🌱</p><p>لمُساعدتك في التغلب على القلق وعيش حياة نفسية جيدة ✨</p>",
            "trending": 0,
            "original_trending": "غير شائعة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/2wiSPlPrlIkFSvTUinaOT5xEJwe2nJ85G8YHEo6X.jpg",
            "is_bookmark": false,
            "created_at": "2024-07-16T23:30:53.000000Z",
            "new": false
          },
          {
            "id": 28,
            "article_category": {
              "id": 5,
              "name": "تعافي",
              "image": null,
              "created_at": "2024-07-16T22:18:03.000000Z"
            },
            "keywords": [],
            "title": "العناية بالصحة النفسية في الحياة اليومية: دليل شامل لحياة متوازنة",
            "description": "<h3><br></h3><h3><br></h3><p>الصحة النفسية ليست مجرد غياب المرض النفسي، بل هي حالة من العافية الكاملة تشمل الرفاهية العاطفية والاجتماعية والنفسية. في هذا المقال، سنستعرض أساليب يومية مبتكرة وسهلة التطبيق لتعزيز الصحة النفسية وضمان التوازن النفسي.</p><h4><font color=\"#003163\" style=\"\"><b>1. البدء بروتين صباحي هادئ</b></font></h4><ul><li><strong>الاستيقاظ المبكر</strong>: حاول الاستيقاظ في وقت مبكر لبدء يومك بهدوء ودون استعجال. هذا يمنحك وقتًا للتفكير والتخطيط ليومك.</li><li><strong>ممارسة التأمل أو الصلاة</strong>: خصص بضع دقائق للتأمل أو الصلاة في بداية اليوم. هذه اللحظات تساعد على تهدئة العقل وإيجاد السلام الداخلي.</li></ul><h4><strong><font color=\"#003163\">2. ممارسة الرياضة بانتظام</font></strong></h4><ul><li><strong>التمارين الرياضية</strong>: اجعل الرياضة جزءًا من روتينك اليومي. يمكن أن تكون الرياضة بسيطة مثل المشي أو الركض، أو أكثر تنظيمًا مثل&nbsp; رفع الأثقال.</li><li><strong>الفوائد النفسية</strong>: التمارين الرياضية تفرز الاندورفين، وهو هرمون يساعد على تحسين المزاج وتقليل التوتر.</li></ul><h4><strong><font color=\"#003163\">3. تناول غذاء صحي ومتوازن</font></strong></h4><ul><li><strong>التغذية الصحية</strong>: تناول غذاء متوازن غني بالفيتامينات والمعادن يساعد في الحفاظ على صحة العقل والجسم. تجنب الأطعمة المصنعة والمليئة بالسكر.</li><li><strong>الترطيب</strong>: تأكد من شرب كمية كافية من الماء يوميًا لأن الجفاف يمكن أن يؤثر على الطاقة والتركيز والمزاج.</li></ul><h4><strong><font color=\"#003163\">4. قضاء وقت مع الأصدقاء والعائلة</font></strong></h4><ul><li><strong>العلاقات الاجتماعية</strong>: العلاقات الاجتماعية القوية تعتبر دعمًا نفسيًا كبيرًا. احرص على التواصل بانتظام مع الأصدقاء والعائلة، سواء وجهًا لوجه أو عبر وسائل التواصل الاجتماعي.</li><li><strong>التطوع والمساعدة</strong>: المشاركة في أنشطة تطوعية يمكن أن تعزز الشعور بالانتماء والرضا النفسي.</li></ul><h4><strong><font color=\"#003163\">5. التحكم في التوتر من خلال الهوايات</font></strong></h4><ul><li><strong>الهوايات</strong>: خصص وقتًا لممارسة هواياتك المفضلة. سواء كانت القراءة، الكتابة، الرسم، أو أي نشاط آخر يجلب لك السعادة.</li><li><strong>الإبداع</strong>: النشاطات الإبداعية مثل الرسم أو الكتابة يمكن أن تكون وسيلة فعالة للتعبير عن المشاعر والتخلص من التوتر.</li></ul><h4><strong><font color=\"#003163\">6. النوم الجيد</font></strong></h4><ul><li><strong>النوم الكافي</strong>: حاول الحصول على 7-9 ساعات من النوم الجيد كل ليلة. النوم الجيد يعزز الذاكرة، ويحسن المزاج، ويزيد من القدرة على التعامل مع التوتر.</li><li><strong>روتين النوم</strong>: ضع روتينًا محددًا للنوم، مثل تقليل الإضاءة قبل النوم، وتجنب الأجهزة الإلكترونية.</li></ul><h4><strong><font color=\"#003163\">7. مراجعة مستشار نفسي</font></strong></h4><ul><li><strong>الاستشارة النفسية</strong>: لا تتردد في طلب المساعدة من مستشار نفسي عند الحاجة. الاستشارة يمكن أن توفر لك استراتيجيات جديدة للتعامل مع الضغوط والمشاعر السلبية.</li><li><strong>الدعم المهني</strong>: المختصون النفسيون يقدمون الدعم اللازم والتوجيه لتجاوز التحديات النفسية.</li></ul><h4><span style=\"font-size: 17.55px;\"><b><font color=\"#083139\">وأخيراً ..&nbsp;</font></b></span></h4><h4><span style=\"font-family: Cairo; font-size: 13px;\">العناية بالصحة النفسية تتطلب التزامًا يوميًا بأساليب بسيطة وفعالة. من خلال تطبيق هذه النصائح والإرشادات، يمكنك تحقيق التوازن النفسي والعيش حياة مليئة بالراحة والسعادة. تذكر أن صحتك النفسية لا تقل أهمية عن صحتك الجسدية، لذا امنحها العناية التي تستحقها.</span><br></h4>",
            "trending": 0,
            "original_trending": "غير شائعة",
            "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/voPbaRHOAavjQOemFdZoUuVcvBQJheJ6RZnTBFhg.jpg",
            "is_bookmark": false,
            "created_at": "2024-08-05T15:19:28.000000Z",
            "new": false
          }
        ]
      }
    },
    {
      "message": "قولي نصايح",
      "replay": "أكيد! هنا بعض النصائح اللي ممكن تساعدك في تحسين صحتك النفسية:\n\n1. **تحدث مع أحد:** إذا شعرت بالقلق أو الاكتئاب، حاول تتحدث مع صديق أو قريب تثق فيه. مشاركة مشاعرك يمكن أن تخفف العبء.\n\n2. **ممارسة الرياضة:** النشاط البدني ممكن يحسن حالتك المزاجية. حتى المشي لمدة 30 دقيقة في اليوم قد يكون مفيد.\n\n3. **تنظيم النوم:** حاول تنام في مواعيد ثابتة وابتعد عن الأجهزة الإلكترونية قبل النوم، حيث أن النوم الجيد يلعب دور مهم في الصحة النفسية.\n\n4. **التغذية الصحية:** حاول تناول وجبات متوازنة تحتوي على الفواكه، الخضروات، والحبوب الكاملة. التغذية يمكن أن تؤثر على مزاجك.\n\n5. **تقنيات الاسترخاء:** مثل التأمل أو التنفس العميق. خذ وقتك للاسترخاء، واهتم بنفسك.\n\n6. **اطلب المساعدة:** إذا كنت تحس أن مشاعرك تؤثر على حياتك اليومية، لا تتردد في طلب مساعدة مختص.\n\n7. **تجنب الكحول والمخدرات:** هذه المواد قد تزيد من القلق والاكتئاب.\n\n8. **حدد أهدافًا بسيطة:** اعمل على أهداف صغيرة وقابلة للتحقيق يوميًا لتحفيز نفسك والرفع من معنوياتك.\n\nإذا تحتاج أي شيء ثاني، أنا هنا لدعمك!",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": null
    },
    {
      "message": "قولي اختبار",
      "replay": "بناءً على إجاباتك، نرشح لك قائمة الإختبارات التالية يمكنك اختيار اختبار منهم",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": {
        type: MeetingChatItemTypes.QUIZ,
        items: [
          {
            id: 42,
            specialist_id: [42],
            full_name: 'د.محمد الغصن',
            specialist: ['طبيب نفسي'],
            bio: `استشاري الطب النفسي شهادة الاختصاص السعودية في الطب النفسي خبرة في عدد من مستشفيات المملكة العربية السعودية ومملكة البحرين تشخيص وعلاج: القلق بأنواعه الوسواس القهري الرهاب والخوف وتوهم المرض اضطرابات الشخصية اختلالات الوظيفة الجنسية الافكار الانتحارية وايذاء النفساضطرابات التغذية والأكل الاكتئاباضطرابات المزاج اضطرابات النوم الفصام الاضطرابات النمائية`,
            gender: 0,
            reservation_count: 49,
            avg_rate: 5,
            count_rate: 5,
            image: 'https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_E5FA67C1-DACD-49FC-98DB-EA3079DAE7F0-44981-000007FB3D18112F_1698824700.jpg',
            price_half_hour: 250,
            years_experience: 10,
            copouns: [],
            nextAvailability: {
              id: 175,
              doctor_id: 42,
              day_id: 3,
              date: '2024-08-19',
              start_time: '20:45:00',
              end_time: '21:15:00',
              created_at: '2024-05-12T21:10:03.000000Z',
              updated_at: '2024-08-19T17:02:04.000000Z'
            }
          }
        ]
      }
    },
    {
      "message": "ابعتلي صور معبرة",
      "replay": "بناءً على إجاباتك، نرشح لك قائمة الصور التالية يمكنك اختيار صوره منهم",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": {
        type: MeetingChatItemTypes.IMAGES,
        items: [
          {
            id: 42,
            specialist_id: [42],
            full_name: 'د.محمد الغصن',
            specialist: ['طبيب نفسي'],
            bio: `استشاري الطب النفسي شهادة الاختصاص السعودية في الطب النفسي خبرة في عدد من مستشفيات المملكة العربية السعودية ومملكة البحرين تشخيص وعلاج: القلق بأنواعه الوسواس القهري الرهاب والخوف وتوهم المرض اضطرابات الشخصية اختلالات الوظيفة الجنسية الافكار الانتحارية وايذاء النفساضطرابات التغذية والأكل الاكتئاباضطرابات المزاج اضطرابات النوم الفصام الاضطرابات النمائية`,
            gender: 0,
            reservation_count: 49,
            avg_rate: 5,
            count_rate: 5,
            image: 'https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_E5FA67C1-DACD-49FC-98DB-EA3079DAE7F0-44981-000007FB3D18112F_1698824700.jpg',
            price_half_hour: 250,
            years_experience: 10,
            copouns: [],
            nextAvailability: {
              id: 175,
              doctor_id: 42,
              day_id: 3,
              date: '2024-08-19',
              start_time: '20:45:00',
              end_time: '21:15:00',
              created_at: '2024-05-12T21:10:03.000000Z',
              updated_at: '2024-08-19T17:02:04.000000Z'
            }
          }
        ]
      }
    },
    {
      "message": "ابعتلي فيديو مناسب",
      "replay": "بناءً على إجاباتك، نرشح لك قائمة الفيديوهات التالية يمكنك اختيار فيديو منهم",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": {
        type: MeetingChatItemTypes.VIDEO,
        items: [
          {
            id: 42,
            specialist_id: [42],
            full_name: 'د.محمد الغصن',
            specialist: ['طبيب نفسي'],
            bio: `استشاري الطب النفسي شهادة الاختصاص السعودية في الطب النفسي خبرة في عدد من مستشفيات المملكة العربية السعودية ومملكة البحرين تشخيص وعلاج: القلق بأنواعه الوسواس القهري الرهاب والخوف وتوهم المرض اضطرابات الشخصية اختلالات الوظيفة الجنسية الافكار الانتحارية وايذاء النفساضطرابات التغذية والأكل الاكتئاباضطرابات المزاج اضطرابات النوم الفصام الاضطرابات النمائية`,
            gender: 0,
            reservation_count: 49,
            avg_rate: 5,
            count_rate: 5,
            image: 'https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_E5FA67C1-DACD-49FC-98DB-EA3079DAE7F0-44981-000007FB3D18112F_1698824700.jpg',
            price_half_hour: 250,
            years_experience: 10,
            copouns: [],
            nextAvailability: {
              id: 175,
              doctor_id: 42,
              day_id: 3,
              date: '2024-08-19',
              start_time: '20:45:00',
              end_time: '21:15:00',
              created_at: '2024-05-12T21:10:03.000000Z',
              updated_at: '2024-08-19T17:02:04.000000Z'
            }
          }
        ]
      }
    },
    {
      "message": "ابعتلي ملف مناسب",
      "replay": "بناءً على إجاباتك، نرشح لك قائمة الملفات التالية يمكنك اختيار الملف!",
      "replay_timestamp": "2023-09-06T21:55:13.000000Z",
      "message_timestamp": "2023-09-06T21:55:13.000000Z",
      "list": {
        type: MeetingChatItemTypes.FILE,
        items: [
          {
            id: 42,
            specialist_id: [42],
            full_name: 'د.محمد الغصن',
            specialist: ['طبيب نفسي'],
            bio: `استشاري الطب النفسي شهادة الاختصاص السعودية في الطب النفسي خبرة في عدد من مستشفيات المملكة العربية السعودية ومملكة البحرين تشخيص وعلاج: القلق بأنواعه الوسواس القهري الرهاب والخوف وتوهم المرض اضطرابات الشخصية اختلالات الوظيفة الجنسية الافكار الانتحارية وايذاء النفساضطرابات التغذية والأكل الاكتئاباضطرابات المزاج اضطرابات النوم الفصام الاضطرابات النمائية`,
            gender: 0,
            reservation_count: 49,
            avg_rate: 5,
            count_rate: 5,
            image: 'https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_E5FA67C1-DACD-49FC-98DB-EA3079DAE7F0-44981-000007FB3D18112F_1698824700.jpg',
            price_half_hour: 250,
            years_experience: 10,
            copouns: [],
            nextAvailability: {
              id: 175,
              doctor_id: 42,
              day_id: 3,
              date: '2024-08-19',
              start_time: '20:45:00',
              end_time: '21:15:00',
              created_at: '2024-05-12T21:10:03.000000Z',
              updated_at: '2024-08-19T17:02:04.000000Z'
            }
          }
        ]
      }
    }
  ],
};

export const mockReservationMeetingChatItem: IApiResponse<IMeetingChatItem[]> = {
  "status": true,
  "message": null,
  "data": [
    {
      "senderId": 2232,
      "message": "الدكتور بدا المكالمة #2815",
      "msgType": "event",
      "msgTime": 1728556470361,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": "https://uat.dev.talbinah.net/prescription?link=f3b310670d890e20d30d2ea3f1b26127",
      "msgType": "viewPdf",
      "msgTime": 1748254813532,
      "is_read": 1,
      "fileName": "تقرير الزيارة",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": "https://uat.dev.talbinah.net/prescription?link=f3b310670d890e20d30d2ea3f1b26127",
      "msgType": "viewPdf",
      "msgTime": 1748254813532,
      "is_read": 1,
      "fileName": "تقرير الزيارة",
      "fileSize": 2014,
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": "https://talbinahtest.s3.eu-central-1.amazonaws.com/chats-files/yDkwyU9oqBRrN35nLP5ERMd7Sufz4SZB52mn0anW.pdf",
      "msgType": "document",
      "msgTime": 1726067940337,
      "is_read": 1,
      "fileName": "الغسيل السريع.pdf",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": "https://talbinahtest.s3.eu-central-1.amazonaws.com/chats-files/yDkwyU9oqBRrN35nLP5ERMd7Sufz4SZB52mn0anW.pdf",
      "msgType": "document",
      "msgTime": 1726067940337,
      "is_read": 1,
      "fileName": "الغسيل السريع.pdf",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": "hiii",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": "hello",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": "https://t4.ftcdn.net/jpg/02/70/36/25/360_F_270362596_kIpf2k7Q5PBjR5wWTp5qentfEeQnm5dM.jpg",
      "msgType": "image",
      "msgTime": 1748254813532,
      "is_read": 1,
      "fileName": "تقرير الزيارة",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": "حابب أطلب منك تعمل اختبار بسيط يساعدنا نفهم حالتك النفسية بشكل أوضح، الاختبار ده موجه علشان يرسم صورة أولية عن مشاعرك الحالية ويقربنا أكتر من التحديات اللي ممكن تكون بتمر بيها، سواء كانت ضغوط يومية، توتر عام، مشاعر حزن أو حتى إحساس بعدم التوازن، هدفنا إننا نسمعك ونفهمك، مش نحكم عليك، علشان كده هتلاقي إن الأسئلة مصممة بطريقة تساعدك تعبّر عن نفسك بحرية، بدون أي إجابات صح أو غلط، كل اللي عليك إنك تجاوب على اللي بتحس بيه فعلاً، وخليك صادق مع نفسك، لأن ده هيكون أول خطوة نحو فهم أعمق لنفسك ونقطة انطلاق لدعم ممكن تحتاجه، وخد بالك إن الإجابات هتكون سرّية ومفيش حد بيشوفها غيرك، مستعد؟ يلا نبدأ مع بعض الرحلة دي.",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "msgType": "video",
      "msgTime": 1748254813532,
      "is_read": 1,
      "fileName": "تقرير الزيارة",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": null,
      "msgType": "deleted",
      "msgTime": 1726064961325,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": null,
      "msgType": "deleted",
      "msgTime": 1726064961325,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      "msgType": "audio",
      "msgTime": 1748254813532,
      "is_read": 0,
      "fileName": "تقرير الزيارة",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      "msgType": "voice",
      "msgTime": 1748254813532,
      "is_read": 1,
      "fileName": "تقرير الزيارة",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": {
        "id": 43,
        "full_name": "د.عبدالمجيد الخميس",
        "specialist": [
          "طبيب نفسي"
        ],
        "specialist_id": [
          1
        ],
        "bio": "أستاذ الطب النفسي ، طبيب استشاري حاصل على زمالتي الطب النفسي الجسدي والعلاج النفسي بالكلام (السيكوديناميكي) من الولايات المتحدة الأمريكية\r\n متخصص بعلاج حالات:\r\n •القلق الاجتماعي وضعف تقدير النفس\r\n •رهاب الساح والأماكن المفتوحة\r\n •القلق العام\r\n •نوبات العلع\r\n •الوسواس القهري\r\n •القلق من الأمراض وتوهم المرض\r\n •حالات الأكتئاب والتأقلم\r\n •الفصام والأمراض الذهانية\r\n •ثنائي القطب والاضطرابات الوجدانية\r\n •الإدمان\r\n •اضطرابات الشخصية والسلوكيات الإنتحارية\r\n •متخصص بالعلاج الكلامي",
        "gender": 0,
        "reservation_count": 82,
        "avg_rate": 5,
        "count_rate": 5,
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/JPEG%20image-C9B8EFE69106-1_1694708488.jpg",
        "price_half_hour": 250,
        "years_experience": 12,
        "copouns": [],
        "nextAvailability": {
          "id": 176,
          "doctor_id": 43,
          "day_id": 3,
          "date": "2024-08-19",
          "start_time": "21:00:00",
          "end_time": "21:30:00",
          "created_at": "2024-05-12T21:10:03.000000Z",
          "updated_at": "2024-08-19T17:02:04.000000Z"
        }

      },
      "msgType": "doctor",
      "msgTime": 1726064961325,
      "is_read": 2,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": 10,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": {
        "id": 77,
        "coupon": "C6jvX",
        "discount": 20,
        "discount_type": "percentage",
        "type": "doctor",
        "doctor_id": 2150,
        "duration_id": null,
        "payment_id": null,
        "user_limit_count": 1,
        "users_limit_count": 2,
        "usage_count": 0,
        "start_date": "2025-05-04",
        "end_date": "2025-05-21",
        "status": 1,
        "is_appear": 1,
        "created_at": "2025-05-04T14:25:04.000000Z",
        "updated_at": "2025-05-04T14:25:04.000000Z"
      },
      "msgType": "coupon",
      "msgTime": 1746372411863,
      "is_read": 1,
      "fileName": null,
      "thumbnailVideoImage": null,
      "recorderTimer": null,
      "isMessageOpened": 0,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": {
        "id": 5,
        "podcast_category_id": null,
        "title": "التعبير الإبداعي والتفريغ العاطفي",
        "description": "التعبير الإبداعي والتفريغ العاطفي: فوائد عظيمة للصحة النفسية والتواصل الفعّال",
        "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/oF8oyjPT5dVDMXUTUwGNuxAwWftAZ8sZBKiAUVIZ.png",
        "background_color": "#3b52c4",
        "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/0rSoeQ5wgrrWwDIduohqS3zTLabKRjiE9nON9zXP.mp3",
        "file_type": "audio",
        "duration": "05:44",
        "type": "free",
        "status": 1,
        "created_at": "2024-08-29T12:44:53.000000Z",
        "updated_at": "2024-12-06T17:40:30.000000Z"
      },
      "msgType": "podcast",
      "msgTime": 1746372456631,
      "is_read": 1,
      "fileName": null,
      "thumbnailVideoImage": null,
      "recorderTimer": null,
      "isMessageOpened": 0,
      "mentalHealthResult": null,
      "homeworkId": 156,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": {
        "id": 1,
        "title": "مقياس اضطراب الاكتئاب",
        "color": "#2970FF",
        "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/MentalAssessment/lCuup2tx7XT217p45YA668860PS6aLLsGke6GsXL.png",
        "question_number": 9,
        "duration": 5,
        "answer_type": "word",
        "total_grade": 27,
        "reference": "الاستبيان الصحي في عينة سعودية. آن جين الطب النفسي",
        "brief": "يشكل هذا الاستبيان جزءا مهما من عملية تقديم افضل رعاية صحية ممكننة لك وستساعد اجابتك فى فهم المشكلات التى قد تعانى منها الرجاء الاجابه عن كل سؤال ب اكبر قدر من الصراحه",
        "usage_count": 414,
        "created_at": "2023-12-28T06:43:53.000000Z",
        "updated_at": "2025-06-10T11:51:18.000000Z",
        "questions": [
          {
            "id": 1,
            "mental_category_id": 1,
            "question": " قلة الاهتمام أو المتعة عند القيام بالأشياء",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 1,
                "mental_category_id": 1,
                "mental_question_id": 1,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 2,
                "mental_category_id": 1,
                "mental_question_id": 1,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 3,
                "mental_category_id": 1,
                "mental_question_id": 1,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 4,
                "mental_category_id": 1,
                "mental_question_id": 1,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 2,
            "mental_category_id": 1,
            "question": " الشعور بالضيقة أو الاكتئاب أو اليأس.",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 5,
                "mental_category_id": 1,
                "mental_question_id": 2,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 6,
                "mental_category_id": 1,
                "mental_question_id": 2,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 7,
                "mental_category_id": 1,
                "mental_question_id": 2,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 8,
                "mental_category_id": 1,
                "mental_question_id": 2,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 3,
            "mental_category_id": 1,
            "question": " صعوبات في النوم أو في الاستمرار في النوم أو كثرة النوم",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 9,
                "mental_category_id": 1,
                "mental_question_id": 3,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 10,
                "mental_category_id": 1,
                "mental_question_id": 3,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 11,
                "mental_category_id": 1,
                "mental_question_id": 3,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 12,
                "mental_category_id": 1,
                "mental_question_id": 3,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 4,
            "mental_category_id": 1,
            "question": "الشعور بالتعب أو قلة النشاط",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 13,
                "mental_category_id": 1,
                "mental_question_id": 4,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 14,
                "mental_category_id": 1,
                "mental_question_id": 4,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 15,
                "mental_category_id": 1,
                "mental_question_id": 4,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 16,
                "mental_category_id": 1,
                "mental_question_id": 4,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 5,
            "mental_category_id": 1,
            "question": "قلة الشهية أو شراهة الاكل",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 17,
                "mental_category_id": 1,
                "mental_question_id": 5,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 18,
                "mental_category_id": 1,
                "mental_question_id": 5,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 19,
                "mental_category_id": 1,
                "mental_question_id": 5,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 20,
                "mental_category_id": 1,
                "mental_question_id": 5,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 6,
            "mental_category_id": 1,
            "question": "الشعور بعدم الرضا عن نفسك أو الشعور بأنك إنسان فاشل أو بأنك خذلت نفسك أو عائلتك.",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 21,
                "mental_category_id": 1,
                "mental_question_id": 6,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 22,
                "mental_category_id": 1,
                "mental_question_id": 6,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 23,
                "mental_category_id": 1,
                "mental_question_id": 6,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 24,
                "mental_category_id": 1,
                "mental_question_id": 6,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 7,
            "mental_category_id": 1,
            "question": "صعوبات في التركيز على الاشياء كقراءة الجريدة أو مشاهدة التلفاز",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 25,
                "mental_category_id": 1,
                "mental_question_id": 7,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 26,
                "mental_category_id": 1,
                "mental_question_id": 7,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 27,
                "mental_category_id": 1,
                "mental_question_id": 7,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 28,
                "mental_category_id": 1,
                "mental_question_id": 7,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 8,
            "mental_category_id": 1,
            "question": " التحرك أو التحدث ببطء شديد لدرجة ملحوظة، أو العكس: التململ وعدم القدرة على الاستقرار لدرجة التحرك من مكان لاخر أكثر من المعتاد",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 29,
                "mental_category_id": 1,
                "mental_question_id": 8,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 30,
                "mental_category_id": 1,
                "mental_question_id": 8,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 31,
                "mental_category_id": 1,
                "mental_question_id": 8,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 32,
                "mental_category_id": 1,
                "mental_question_id": 8,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          },
          {
            "id": 9,
            "mental_category_id": 1,
            "question": "  التفكير بأنه من الأفضل لك الموت أو التفكير بإيذاء نفسك بطريقة ما.",
            "question_grade": 3,
            "header_title": null,
            "footer_title": null,
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z",
            "answers": [
              {
                "id": 33,
                "mental_category_id": 1,
                "mental_question_id": 9,
                "answer": "ابدا",
                "selected": 0,
                "answer_grade": 0,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 34,
                "mental_category_id": 1,
                "mental_question_id": 9,
                "answer": "عدة ايام",
                "selected": 0,
                "answer_grade": 1,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 35,
                "mental_category_id": 1,
                "mental_question_id": 9,
                "answer": "أكثر من نصف الايام",
                "selected": 0,
                "answer_grade": 2,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              },
              {
                "id": 36,
                "mental_category_id": 1,
                "mental_question_id": 9,
                "answer": "كل يوم تقريبا",
                "selected": 0,
                "answer_grade": 3,
                "created_at": "2023-12-28T06:43:53.000000Z",
                "updated_at": "2023-12-28T06:43:53.000000Z"
              }
            ]
          }
        ],
        "results": [
          {
            "id": 1,
            "mental_category_id": 1,
            "start_percentage": 0,
            "end_percentage": 20,
            "result_note": "لا يوجد اكتئاب",
            "title": " يظهر من خلال إجاباتك عدم وجود اكتئاب  ",
            "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z"
          },
          {
            "id": 2,
            "mental_category_id": 1,
            "start_percentage": 20,
            "end_percentage": 40,
            "result_note": "اكتئاب بسيط",
            "title": " يظهر من خلال إجاباتك علامات اكتئاب بسيط",
            "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z"
          },
          {
            "id": 3,
            "mental_category_id": 1,
            "start_percentage": 40,
            "end_percentage": 60,
            "result_note": "اكتئاب متوسط",
            "title": " يظهر من خلال إجاباتك علامات اكتئاب متوسط",
            "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z"
          },
          {
            "id": 4,
            "mental_category_id": 1,
            "start_percentage": 60,
            "end_percentage": 80,
            "result_note": " اكتئاب متوسط الى شديد ",
            "title": " يظهر من خلال إجاباتك علامات اكتئاب متوسط الى شديد",
            "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z"
          },
          {
            "id": 5,
            "mental_category_id": 1,
            "start_percentage": 80,
            "end_percentage": 100,
            "result_note": " اكتئاب شديد",
            "title": " يظهر من خلال إجاباتك علامات اكتئاب  شديد",
            "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
            "created_at": "2023-12-28T06:43:53.000000Z",
            "updated_at": "2023-12-28T06:43:53.000000Z"
          }
        ]
      },
      "msgType": "quiz",
      "msgTime": 1726067940337,
      "is_read": 1,
      "fileName": "الغسيل البطي.pdf",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": 23,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": {
        "id": 20,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "نصائح للحد من تقلب المزاج المفاجئ",
        "description": "<p><b><font color=\"#003163\">إليك بعض النصائح التي يمكن أن تساعدك في الحفاظ على استقرار المزاج والتعامل مع تقلباته المفاجئة، خاصة إذا كانت الأسباب بسيطة:</font></b></p><ol><li><font color=\"#083139\"><strong>تجنب التوتر والإجهاد</strong>: </font>حاول تجنب الضغوطات اليومية والعملية بقدر الإمكان، وخصص وقتًا للاسترخاء والعناية بنفسك.</li><li><font color=\"#083139\"><strong>مارس هواياتك المفضلة</strong>: </font>استفد من أوقات الفراغ بممارسة الأنشطة التي تحبها، سواء كان ذلك بالخروج في نزهة أو قضاء وقت ممتع مع العائلة والأصدقاء.</li><li><font color=\"#083139\"><strong>التفكير الإيجابي</strong>:</font> ركز على الأمور الجيدة في حياتك وابتعد عن التقليل من شأن نفسك أو النقد الذاتي المفرط.</li><li><font color=\"#083139\"><strong>تناول طعامًا صحيًا</strong>: </font>احرص على نظام غذائي متوازن وغني بالفيتامينات والمعادن والألياف لتعزيز صحتك العامة.</li><li><font color=\"#083139\"><strong>ممارسة الرياضة</strong>: </font>حاول ممارسة التمارين الرياضية بانتظام، فهي تساهم في تحسين المزاج والحد من التوتر.</li><li><font color=\"#083139\"><strong>النوم الكافي</strong>: </font>تأكد من الحصول على قسط كافٍ من النوم للمساعدة في الحفاظ على توازن المزاج.</li><li><font color=\"#083139\"><strong>تجنب الكحول والتدخين</strong>: </font>حاول الابتعاد عن تناول المشروبات الكحولية والتدخين، حيث يمكن أن يؤثرا سلبًا على المزاج.</li><li><font color=\"#083139\"><strong>استشارة المختصين</strong>:</font> في حال شعرت بأعراض مرضية تؤثر على مزاجك، لا تتردد في مراجعة الأخصائيين للحصول على الدعم المناسب.</li></ol>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/rTU9Yb0TIuOhP7I3RbEmvC7wXEbaQJTyMPHOOL4O.jpg",
        "is_bookmark": false,
        "created_at": "2024-07-16T15:40:13.000000Z",
        "new": false
      },
      "msgType": "article",
      "msgTime": 1746372456631,
      "is_read": 1,
      "fileName": null,
      "thumbnailVideoImage": null,
      "recorderTimer": null,
      "isMessageOpened": 0,
      "mentalHealthResult": null,
      "homeworkId": 25,
      "replyReference": null
    },
    {
      "senderId": 2232,
      "message": "الدكتور انهي الجلسة #2879",
      "msgType": "event",
      "msgTime": 1748254813197,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },

    {
      "senderId": 2232,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 949,
        "message": "حابب أطلب منك تعمل اختبار بسيط يساعدنا نفهم حالتك النفسية بشكل أوضح، الاختبار ده موجه علشان يرسم صورة أولية عن مشاعرك الحالية ويقربنا أكتر من التحديات اللي ممكن تكون بتمر بيها، سواء كانت ضغوط يومية، توتر عام، مشاعر حزن أو حتى إحساس بعدم التوازن، هدفنا إننا نسمعك ونفهمك، مش نحكم عليك، علشان كده هتلاقي إن الأسئلة مصممة بطريقة تساعدك تعبّر عن نفسك بحرية، بدون أي إجابات صح أو غلط، كل اللي عليك إنك تجاوب على اللي بتحس بيه فعلاً، وخليك صادق مع نفسك، لأن ده هيكون أول خطوة نحو فهم أعمق لنفسك ونقطة انطلاق لدعم ممكن تحتاجه، وخد بالك إن الإجابات هتكون سرّية ومفيش حد بيشوفها غيرك، مستعد؟ يلا نبدأ مع بعض الرحلة دي.",
        "msgType": "text",
        "msgTime": 1725874856849,
        "is_read": 1,
        "fileName": "",
        "thumbnailVideoImage": "",
        "recorderTimer": "00:00",
        "isMessageOpened": null,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      },
    },
    {
      "senderId": 949,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 2232,
        "message": "https://uat.dev.talbinah.net/prescription?link=f3b310670d890e20d30d2ea3f1b26127",
        "msgType": "viewPdf",
        "msgTime": 1748254813532,
        "is_read": 1,
        "fileName": "تقرير الزيارة",
        "fileSize": 2014,
        "thumbnailVideoImage": "",
        "recorderTimer": "0:00:00",
        "isMessageOpened": null,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      },
    },
    {
      "senderId": 2232,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 949,
        "message": "https://t4.ftcdn.net/jpg/02/70/36/25/360_F_270362596_kIpf2k7Q5PBjR5wWTp5qentfEeQnm5dM.jpg",
        "msgType": "image",
        "msgTime": 1748254813532,
        "is_read": 1,
        "fileName": "تقرير الزيارة",
        "thumbnailVideoImage": "",
        "recorderTimer": "0:00:00",
        "isMessageOpened": null,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      }
    },
    {
      "senderId": 949,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 2232,
        "message": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "msgType": "video",
        "msgTime": 1748254813532,
        "is_read": 1,
        "fileName": "تقرير الزيارة",
        "thumbnailVideoImage": "",
        "recorderTimer": "0:00:00",
        "isMessageOpened": null,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      }
    },
    {
      "senderId": 2232,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 949,
        "message": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        "msgType": "audio",
        "msgTime": 1748254813532,
        "is_read": 0,
        "fileName": "تقرير الزيارة",
        "thumbnailVideoImage": "",
        "recorderTimer": "0:00:00",
        "isMessageOpened": null,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      }
    },
    {
      "senderId": 949,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 2232,
        "message": {
          "id": 43,
          "full_name": "د.عبدالمجيد الخميس",
          "specialist": [
            "طبيب نفسي"
          ],
          "specialist_id": [
            1
          ],
          "bio": "أستاذ الطب النفسي ، طبيب استشاري حاصل على زمالتي الطب النفسي الجسدي والعلاج النفسي بالكلام (السيكوديناميكي) من الولايات المتحدة الأمريكية\r\n متخصص بعلاج حالات:\r\n •القلق الاجتماعي وضعف تقدير النفس\r\n •رهاب الساح والأماكن المفتوحة\r\n •القلق العام\r\n •نوبات العلع\r\n •الوسواس القهري\r\n •القلق من الأمراض وتوهم المرض\r\n •حالات الأكتئاب والتأقلم\r\n •الفصام والأمراض الذهانية\r\n •ثنائي القطب والاضطرابات الوجدانية\r\n •الإدمان\r\n •اضطرابات الشخصية والسلوكيات الإنتحارية\r\n •متخصص بالعلاج الكلامي",
          "gender": 0,
          "reservation_count": 82,
          "avg_rate": 5,
          "count_rate": 5,
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/JPEG%20image-C9B8EFE69106-1_1694708488.jpg",
          "price_half_hour": 250,
          "years_experience": 12,
          "copouns": [],
          "nextAvailability": {
            "id": 176,
            "doctor_id": 43,
            "day_id": 3,
            "date": "2024-08-19",
            "start_time": "21:00:00",
            "end_time": "21:30:00",
            "created_at": "2024-05-12T21:10:03.000000Z",
            "updated_at": "2024-08-19T17:02:04.000000Z"
          }

        },
        "msgType": "doctor",
        "msgTime": 1726064961325,
        "is_read": 2,
        "fileName": "",
        "thumbnailVideoImage": "",
        "recorderTimer": "00:00",
        "isMessageOpened": null,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      }
    },
    {
      "senderId": 2232,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 949,
        "message": {
          "id": 77,
          "coupon": "C6jvX",
          "discount": 20,
          "discount_type": "percentage",
          "type": "doctor",
          "doctor_id": 2150,
          "duration_id": null,
          "payment_id": null,
          "user_limit_count": 1,
          "users_limit_count": 2,
          "usage_count": 0,
          "start_date": "2025-05-04",
          "end_date": "2025-05-21",
          "status": 1,
          "is_appear": 1,
          "created_at": "2025-05-04T14:25:04.000000Z",
          "updated_at": "2025-05-04T14:25:04.000000Z"
        },
        "msgType": "coupon",
        "msgTime": 1746372411863,
        "is_read": 1,
        "fileName": null,
        "thumbnailVideoImage": null,
        "recorderTimer": null,
        "isMessageOpened": 0,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      }
    },
    {
      "senderId": 949,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 2232,
        "message": {
          "id": 5,
          "podcast_category_id": null,
          "title": "التعبير الإبداعي والتفريغ العاطفي",
          "description": "التعبير الإبداعي والتفريغ العاطفي: فوائد عظيمة للصحة النفسية والتواصل الفعّال",
          "thumbnail_image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/thumbnails/oF8oyjPT5dVDMXUTUwGNuxAwWftAZ8sZBKiAUVIZ.png",
          "background_color": "#3b52c4",
          "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/0rSoeQ5wgrrWwDIduohqS3zTLabKRjiE9nON9zXP.mp3",
          "file_type": "audio",
          "duration": "05:44",
          "type": "free",
          "status": 1,
          "created_at": "2024-08-29T12:44:53.000000Z",
          "updated_at": "2024-12-06T17:40:30.000000Z"
        },
        "msgType": "podcast",
        "msgTime": 1746372456631,
        "is_read": 1,
        "fileName": null,
        "thumbnailVideoImage": null,
        "recorderTimer": null,
        "isMessageOpened": 0,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      },
    },
    {
      "senderId": 2232,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 949,
        "message": {
          "id": 1,
          "title": "مقياس اضطراب الاكتئاب",
          "color": "#2970FF",
          "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/MentalAssessment/lCuup2tx7XT217p45YA668860PS6aLLsGke6GsXL.png",
          "question_number": 9,
          "duration": 5,
          "answer_type": "word",
          "total_grade": 27,
          "reference": "الاستبيان الصحي في عينة سعودية. آن جين الطب النفسي",
          "brief": "يشكل هذا الاستبيان جزءا مهما من عملية تقديم افضل رعاية صحية ممكننة لك وستساعد اجابتك فى فهم المشكلات التى قد تعانى منها الرجاء الاجابه عن كل سؤال ب اكبر قدر من الصراحه",
          "usage_count": 414,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2025-06-10T11:51:18.000000Z",
          "questions": [
            {
              "id": 1,
              "mental_category_id": 1,
              "question": " قلة الاهتمام أو المتعة عند القيام بالأشياء",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 1,
                  "mental_category_id": 1,
                  "mental_question_id": 1,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 2,
                  "mental_category_id": 1,
                  "mental_question_id": 1,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 3,
                  "mental_category_id": 1,
                  "mental_question_id": 1,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 4,
                  "mental_category_id": 1,
                  "mental_question_id": 1,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 2,
              "mental_category_id": 1,
              "question": " الشعور بالضيقة أو الاكتئاب أو اليأس.",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 5,
                  "mental_category_id": 1,
                  "mental_question_id": 2,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 6,
                  "mental_category_id": 1,
                  "mental_question_id": 2,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 7,
                  "mental_category_id": 1,
                  "mental_question_id": 2,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 8,
                  "mental_category_id": 1,
                  "mental_question_id": 2,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 3,
              "mental_category_id": 1,
              "question": " صعوبات في النوم أو في الاستمرار في النوم أو كثرة النوم",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 9,
                  "mental_category_id": 1,
                  "mental_question_id": 3,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 10,
                  "mental_category_id": 1,
                  "mental_question_id": 3,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 11,
                  "mental_category_id": 1,
                  "mental_question_id": 3,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 12,
                  "mental_category_id": 1,
                  "mental_question_id": 3,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 4,
              "mental_category_id": 1,
              "question": "الشعور بالتعب أو قلة النشاط",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 13,
                  "mental_category_id": 1,
                  "mental_question_id": 4,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 14,
                  "mental_category_id": 1,
                  "mental_question_id": 4,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 15,
                  "mental_category_id": 1,
                  "mental_question_id": 4,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 16,
                  "mental_category_id": 1,
                  "mental_question_id": 4,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 5,
              "mental_category_id": 1,
              "question": "قلة الشهية أو شراهة الاكل",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 17,
                  "mental_category_id": 1,
                  "mental_question_id": 5,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 18,
                  "mental_category_id": 1,
                  "mental_question_id": 5,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 19,
                  "mental_category_id": 1,
                  "mental_question_id": 5,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 20,
                  "mental_category_id": 1,
                  "mental_question_id": 5,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 6,
              "mental_category_id": 1,
              "question": "الشعور بعدم الرضا عن نفسك أو الشعور بأنك إنسان فاشل أو بأنك خذلت نفسك أو عائلتك.",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 21,
                  "mental_category_id": 1,
                  "mental_question_id": 6,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 22,
                  "mental_category_id": 1,
                  "mental_question_id": 6,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 23,
                  "mental_category_id": 1,
                  "mental_question_id": 6,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 24,
                  "mental_category_id": 1,
                  "mental_question_id": 6,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 7,
              "mental_category_id": 1,
              "question": "صعوبات في التركيز على الاشياء كقراءة الجريدة أو مشاهدة التلفاز",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 25,
                  "mental_category_id": 1,
                  "mental_question_id": 7,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 26,
                  "mental_category_id": 1,
                  "mental_question_id": 7,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 27,
                  "mental_category_id": 1,
                  "mental_question_id": 7,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 28,
                  "mental_category_id": 1,
                  "mental_question_id": 7,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 8,
              "mental_category_id": 1,
              "question": " التحرك أو التحدث ببطء شديد لدرجة ملحوظة، أو العكس: التململ وعدم القدرة على الاستقرار لدرجة التحرك من مكان لاخر أكثر من المعتاد",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 29,
                  "mental_category_id": 1,
                  "mental_question_id": 8,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 30,
                  "mental_category_id": 1,
                  "mental_question_id": 8,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 31,
                  "mental_category_id": 1,
                  "mental_question_id": 8,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 32,
                  "mental_category_id": 1,
                  "mental_question_id": 8,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            },
            {
              "id": 9,
              "mental_category_id": 1,
              "question": "  التفكير بأنه من الأفضل لك الموت أو التفكير بإيذاء نفسك بطريقة ما.",
              "question_grade": 3,
              "header_title": null,
              "footer_title": null,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z",
              "answers": [
                {
                  "id": 33,
                  "mental_category_id": 1,
                  "mental_question_id": 9,
                  "answer": "ابدا",
                  "selected": 0,
                  "answer_grade": 0,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 34,
                  "mental_category_id": 1,
                  "mental_question_id": 9,
                  "answer": "عدة ايام",
                  "selected": 0,
                  "answer_grade": 1,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 35,
                  "mental_category_id": 1,
                  "mental_question_id": 9,
                  "answer": "أكثر من نصف الايام",
                  "selected": 0,
                  "answer_grade": 2,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                },
                {
                  "id": 36,
                  "mental_category_id": 1,
                  "mental_question_id": 9,
                  "answer": "كل يوم تقريبا",
                  "selected": 0,
                  "answer_grade": 3,
                  "created_at": "2023-12-28T06:43:53.000000Z",
                  "updated_at": "2023-12-28T06:43:53.000000Z"
                }
              ]
            }
          ],
          "results": [
            {
              "id": 1,
              "mental_category_id": 1,
              "start_percentage": 0,
              "end_percentage": 20,
              "result_note": "لا يوجد اكتئاب",
              "title": " يظهر من خلال إجاباتك عدم وجود اكتئاب  ",
              "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 2,
              "mental_category_id": 1,
              "start_percentage": 20,
              "end_percentage": 40,
              "result_note": "اكتئاب بسيط",
              "title": " يظهر من خلال إجاباتك علامات اكتئاب بسيط",
              "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 3,
              "mental_category_id": 1,
              "start_percentage": 40,
              "end_percentage": 60,
              "result_note": "اكتئاب متوسط",
              "title": " يظهر من خلال إجاباتك علامات اكتئاب متوسط",
              "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 4,
              "mental_category_id": 1,
              "start_percentage": 60,
              "end_percentage": 80,
              "result_note": " اكتئاب متوسط الى شديد ",
              "title": " يظهر من خلال إجاباتك علامات اكتئاب متوسط الى شديد",
              "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 5,
              "mental_category_id": 1,
              "start_percentage": 80,
              "end_percentage": 100,
              "result_note": " اكتئاب شديد",
              "title": " يظهر من خلال إجاباتك علامات اكتئاب  شديد",
              "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        "msgType": "quiz",
        "msgTime": 1726067940337,
        "is_read": 1,
        "fileName": "الغسيل البطي.pdf",
        "thumbnailVideoImage": "",
        "recorderTimer": "0:00:00",
        "isMessageOpened": null,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      }
    },
    {
      "senderId": 949,
      "message": "حاضر ابعتهولي وهعمله",
      "msgType": "text",
      "msgTime": 1725874856849,
      "is_read": 1,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": {
        "senderId": 2232,
        "message": {
          "id": 20,
          "article_category": {
            "id": 1,
            "name": "الحزن والقلق",
            "image": null,
            "created_at": "2023-09-06T22:12:08.000000Z"
          },
          "keywords": [],
          "title": "نصائح للحد من تقلب المزاج المفاجئ",
          "description": "<p><b><font color=\"#003163\">إليك بعض النصائح التي يمكن أن تساعدك في الحفاظ على استقرار المزاج والتعامل مع تقلباته المفاجئة، خاصة إذا كانت الأسباب بسيطة:</font></b></p><ol><li><font color=\"#083139\"><strong>تجنب التوتر والإجهاد</strong>: </font>حاول تجنب الضغوطات اليومية والعملية بقدر الإمكان، وخصص وقتًا للاسترخاء والعناية بنفسك.</li><li><font color=\"#083139\"><strong>مارس هواياتك المفضلة</strong>: </font>استفد من أوقات الفراغ بممارسة الأنشطة التي تحبها، سواء كان ذلك بالخروج في نزهة أو قضاء وقت ممتع مع العائلة والأصدقاء.</li><li><font color=\"#083139\"><strong>التفكير الإيجابي</strong>:</font> ركز على الأمور الجيدة في حياتك وابتعد عن التقليل من شأن نفسك أو النقد الذاتي المفرط.</li><li><font color=\"#083139\"><strong>تناول طعامًا صحيًا</strong>: </font>احرص على نظام غذائي متوازن وغني بالفيتامينات والمعادن والألياف لتعزيز صحتك العامة.</li><li><font color=\"#083139\"><strong>ممارسة الرياضة</strong>: </font>حاول ممارسة التمارين الرياضية بانتظام، فهي تساهم في تحسين المزاج والحد من التوتر.</li><li><font color=\"#083139\"><strong>النوم الكافي</strong>: </font>تأكد من الحصول على قسط كافٍ من النوم للمساعدة في الحفاظ على توازن المزاج.</li><li><font color=\"#083139\"><strong>تجنب الكحول والتدخين</strong>: </font>حاول الابتعاد عن تناول المشروبات الكحولية والتدخين، حيث يمكن أن يؤثرا سلبًا على المزاج.</li><li><font color=\"#083139\"><strong>استشارة المختصين</strong>:</font> في حال شعرت بأعراض مرضية تؤثر على مزاجك، لا تتردد في مراجعة الأخصائيين للحصول على الدعم المناسب.</li></ol>",
          "trending": 0,
          "original_trending": "غير شائعة",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/rTU9Yb0TIuOhP7I3RbEmvC7wXEbaQJTyMPHOOL4O.jpg",
          "is_bookmark": false,
          "created_at": "2024-07-16T15:40:13.000000Z",
          "new": false
        },
        "msgType": "article",
        "msgTime": 1746372456631,
        "is_read": 1,
        "fileName": null,
        "thumbnailVideoImage": null,
        "recorderTimer": null,
        "isMessageOpened": 0,
        "mentalHealthResult": null,
        "homeworkId": null,
        "replyReference": null
      }
    },
    {
      "senderId": 2232,
      "message": {
        "id": 101096,
        "full_name": "د.إسلام عفيفي",
        "specialist": [
          "طبيب نفسي"
        ],
        "specialist_id": [
          1
        ],
        "bio": "أستاذ الطب النفسي ، طبيب استشاري حاصل على زمالتي الطب النفسي الجسدي والعلاج النفسي بالكلام (السيكوديناميكي) من الولايات المتحدة الأمريكية\r\n متخصص بعلاج حالات:\r\n •القلق الاجتماعي وضعف تقدير النفس\r\n •رهاب الساح والأماكن المفتوحة\r\n •القلق العام\r\n •نوبات العلع\r\n •الوسواس القهري\r\n •القلق من الأمراض وتوهم المرض\r\n •حالات الأكتئاب والتأقلم\r\n •الفصام والأمراض الذهانية\r\n •ثنائي القطب والاضطرابات الوجدانية\r\n •الإدمان\r\n •اضطرابات الشخصية والسلوكيات الإنتحارية\r\n •متخصص بالعلاج الكلامي",
        "gender": 0,
        "reservation_count": 82,
        "avg_rate": 5,
        "count_rate": 5,
        "image": "https://scontent.fspx1-1.fna.fbcdn.net/v/t51.75761-15/491413337_18497851972010963_4980128226817792701_n.webp?stp=dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=L_t6mGrlC2gQ7kNvwEVuHCy&_nc_oc=Adl3WcgaKgLp8MwBuWDoXNGe0cDlO6WJ5eFWykS1McETVEvVy18EkQS4kPiMIvDF7eA&_nc_zt=23&_nc_ht=scontent.fspx1-1.fna&_nc_gid=wzJ4L_le-IMV48SRvpeP-w&oh=00_AfT8hRb7mSdi3PSnC6WFO8o1obS7IgpiqJkte3xo_1wSRg&oe=687AE789",
        "price_half_hour": 250,
        "years_experience": 12,
        "copouns": [],
        "nextAvailability": {
          "id": 176,
          "doctor_id": 43,
          "day_id": 3,
          "date": "2024-08-19",
          "start_time": "21:00:00",
          "end_time": "21:30:00",
          "created_at": "2024-05-12T21:10:03.000000Z",
          "updated_at": "2024-08-19T17:02:04.000000Z"
        }

      },
      "msgType": "recommend",
      "msgTime": 1746372456631,
      "is_read": 1,
      "fileName": null,
      "thumbnailVideoImage": null,
      "recorderTimer": null,
      "isMessageOpened": 0,
      "is_recommend": true,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": {
        "id": 101096,
        "full_name": "د.إسلام عفيفي",
        "specialist": [
          "طبيب نفسي"
        ],
        "specialist_id": [
          1
        ],
        "bio": "أستاذ الطب النفسي ، طبيب استشاري حاصل على زمالتي الطب النفسي الجسدي والعلاج النفسي بالكلام (السيكوديناميكي) من الولايات المتحدة الأمريكية\r\n متخصص بعلاج حالات:\r\n •القلق الاجتماعي وضعف تقدير النفس\r\n •رهاب الساح والأماكن المفتوحة\r\n •القلق العام\r\n •نوبات العلع\r\n •الوسواس القهري\r\n •القلق من الأمراض وتوهم المرض\r\n •حالات الأكتئاب والتأقلم\r\n •الفصام والأمراض الذهانية\r\n •ثنائي القطب والاضطرابات الوجدانية\r\n •الإدمان\r\n •اضطرابات الشخصية والسلوكيات الإنتحارية\r\n •متخصص بالعلاج الكلامي",
        "gender": 0,
        "reservation_count": 82,
        "avg_rate": 5,
        "count_rate": 5,
        "image": "https://scontent.fspx1-1.fna.fbcdn.net/v/t39.30808-6/485912314_4108769296002822_8555652118649198700_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=VK5e7tncLCoQ7kNvwHp64S8&_nc_oc=Adl-5kCIufUAWizWKDJWGnkCwh88PG85ERBtkiFI2cVhLpxmMqRwLuRiYG1DKDpwoys&_nc_zt=23&_nc_ht=scontent.fspx1-1.fna&_nc_gid=84-pZEO-jLrpSxwm52k9_w&oh=00_AfToN-XmilH-rWuJ54KOphdZEQSV1ghSIhVLNy0wRs4O_g&oe=687AECBE",
        "price_half_hour": 250,
        "years_experience": 12,
        "copouns": [],
        "nextAvailability": {
          "id": 176,
          "doctor_id": 43,
          "day_id": 3,
          "date": "2024-08-19",
          "start_time": "21:00:00",
          "end_time": "21:30:00",
          "created_at": "2024-05-12T21:10:03.000000Z",
          "updated_at": "2024-08-19T17:02:04.000000Z"
        }

      },
      "msgType": "transferred",
      "msgTime": 1726064961325,
      "is_read": 2,
      "fileName": "",
      "thumbnailVideoImage": "",
      "recorderTimer": "00:00",
      "isMessageOpened": null,
      "is_transferred": true,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    },
    {
      "senderId": 949,
      "message": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      "msgType": "voice",
      "msgTime": 1748254813532,
      "is_read": 1,
      "fileName": "كشف الحساب",
      "thumbnailVideoImage": "",
      "recorderTimer": "0:00:00",
      "isMessageOpened": null,
      "mentalHealthResult": null,
      "homeworkId": null,
      "replyReference": null
    }
  ]
};
export const mockCheckDoctorAtReservation: ICheckDoctorAtReservationResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 3638,
    "url": null,
    "remaining_time": 2231,
    "current_time": "2025-07-28 18:14:26",
    "price": 130,
    "price_after": 130,
    "price_display": 130,
    "tax_amount": 0,
    "coupon": null,
    "doctor": {
      "id": 2139,
      "full_name": "احمد طاهر",
      "phone_no": "1018388999",
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
      "nick_name": "احمد ٩٩٩",
      "email": null,
      "original_gender": "ذكر",
      "gender": 0,
      "birth_date": "2006-08-26",
      "bio": ".........",
      "license_number": "25",
      "license_image": null,
      "license_expiry_date": null,
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/7Ze1XX4NQlFKUlvqU2PbMZGZdlA3KWQRNA2rOCmq.jpg",
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
      "price_half_hour": 65,
      "iban": null,
      "next_availability": null,
      "years_experience": 63,
      "coupons": [
        {
          "id": 150,
          "coupon": "t5koc",
          "discount": 5458788,
          "discount_type": "amount",
          "type": "doctor",
          "doctor_id": 2139,
          "durations": [
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
          "user_limit_count": 5,
          "users_limit_count": 5,
          "usage_count": 0,
          "start_date": "2025-07-20",
          "end_date": "2025-07-29",
          "status": 1,
          "is_appear": 1,
          "created_at": "2025-07-11T18:02:28.000000Z",
          "updated_at": "2025-07-22T08:36:18.000000Z"
        },
        {
          "id": 157,
          "coupon": "6Ycu4",
          "discount": 3,
          "discount_type": "amount",
          "type": "doctor",
          "doctor_id": 2139,
          "durations": [
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
          "user_limit_count": 3,
          "users_limit_count": 3,
          "usage_count": 0,
          "start_date": "2025-07-22",
          "end_date": "2025-07-30",
          "status": 1,
          "is_appear": 1,
          "created_at": "2025-07-13T08:18:11.000000Z",
          "updated_at": "2025-07-22T08:36:24.000000Z"
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
          "id": 22,
          "title": "نتف الشعر"
        },
        {
          "id": 24,
          "title": "اضطراب النزاج"
        }
      ],
      "association": null,
      "reviews_avg": 3.8,
      "is_fav": false,
      "active": 1,
      "preferred_msg_channel": "both",
      "device_type": "Android",
      "device_name": "SM-A546E",
      "version_name": "2.3.30",
      "version_code": "160",
      "created_at": "2024-08-21T07:51:06.000000Z",
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
          "icon": "https://api.dev.talbinah.net/dashboard_assets/media/svg/icons/General/Star.svg",
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
          "icon": "https://api.dev.talbinah.net/dashboard_assets/media/svg/icons/General/Thunder.svg",
          "is_active": 1,
          "created_at": "2025-02-08T21:18:50.000000Z"
        }
      ],
      "is_recommended": false,
      "reviews_count": 59,
      "is_support": false,
      "department": null
    },
    "user": {
      "id": 949,
      "main_lang": "ar",
      "translate_id": null,
      "full_name": "alaatest",
      "nick_name": "alaatest",
      "phone_no": "1013809034",
      "bio": null,
      "original_gender": "أنثى",
      "gender": 1,
      "birth_date": "1988-08-03",
      "national_id": "1066731777",
      "verify_national_id": 1,
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
      "fcm_token": "e4q_aSGCxkA_k5By95dKVY:APA91bEFOkov_wM0W0YcMmcClkEkhLbGLaIQHDZCfsXqcL3ATlcGXiDQPJB7UTLdikDpvkcfCixEdyAvivF0LVIGqzmxPy6zmWERvseLxyb1KuGW1bLJChU",
      "email": "alaarsm@gmail.com",
      "email_verified_at": null,
      "work_email": "eafify@talbinah.net",
      "work_email_verified_at": "2025-07-22 09:21:23",
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-949",
      "referral_code_points": 200,
      "device_type": "IOS",
      "device_name": "23129RAA4G",
      "version_name": "3.0.3",
      "version_code": "249",
      "preferred_msg_channel": "both",
      "created_at": "2024-04-05T16:44:23.000000Z",
      "image": null,
      "is_support": false,
      "department": null,
      "points_count": 0
    },
    "follow_doctor": null,
    "transfer_doctor": null,
    "suggest_doctor": null,
    "tickets": [],
    "time_line": [
      {
        "id": 7084,
        "reservation_id": 3638,
        "description": "تم حجز موعد جديد يوم الثلاثاء 2025-07-29 بتوقيت من : 09:00 الى 10:00",
        "label": "حجز موعد",
        "status": "موعد جديد",
        "doctor": null,
        "created_at": "2025-07-28T17:49:05.000000Z"
      },
      {
        "id": 7085,
        "reservation_id": 3638,
        "description": "تم بدا الموعد من قبل الطبيب",
        "label": "بدا الجلسة",
        "status": "بدا الجلسة",
        "doctor": null,
        "created_at": "2025-07-28T17:50:39.000000Z"
      },
      {
        "id": 7086,
        "reservation_id": 3638,
        "description": "الدكتور دخل المكالمة",
        "label": "المكالمة",
        "status": "تم تعديل التقرير",
        "doctor": null,
        "created_at": "2025-07-28T17:51:37.000000Z"
      },
      {
        "id": 7087,
        "reservation_id": 3638,
        "description": "الدكتور خرج من المكالمة",
        "label": "المكالمة",
        "status": "تم تعديل التقرير",
        "doctor": null,
        "created_at": "2025-07-28T17:53:12.000000Z"
      }
    ],
    "assignments": [],
    "prescriptions": [],
    "is_start": 1,
    "is_end": 0,
    "original_is_start": "attributes.Started",
    "original_is_end": "لم تنتهي",
    "visit_chat_time_user": null,
    "visit_chat_time_doctor": "2025-07-28 17:50:28",
    "visit_call_time_user": "2025-07-28 17:51:45",
    "visit_call_time_doctor": "2025-07-28 17:51:37",
    "day": "الثلاثاء",
    "start_time": "17:51:37",
    "end_time": "18:51:37",
    "date": "2025-07-28",
    "duration": {
      "id": 4,
      "main_lang": "ar",
      "translate_id": null,
      "duration": 60,
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z"
    },
    "review": null,
    "communication": {
      "id": 3,
      "main_lang": "ar",
      "translate_id": null,
      "name": "مكالمة فيديو",
      "description": "مكالمة فيديو مع الدكتور",
      "selected": null,
      "un_selected": null,
      "price": 30,
      "color": "#DBFFDB",
      "hard_color": "#4AAF4F ",
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/communications-images/video-call.svg"
    },
    "payment": {
      "id": 1,
      "main_lang": "ar",
      "translate_id": null,
      "name": "دفع من خلال المحفظة",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/payments-images/wallet.png",
      "active": 1,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z",
      "package": null,
      "payment_id": 1,
      "balance": 60654
    },
    "problem": "المشكلة",
    "message": null,
    "description": null,
    "notes": null,
    "report": null,
    "filename": null,
    "link": null,
    "report_file": "https://api.dev.talbinah.net/prescription?link=",
    "full_name": "alaatest",
    "gender": 0,
    "age": 36,
    "reason": null,
    "active": 1,
    "status": 1,
    "is_blocked": false,
    "admin_locked": false,
    "doctor_locked": true,
    "reservation_type": "normal",
    "original_active": "فعال",
    "original_status": "قادم",
    "original_type": "تقليديه",
    "created_at": "2025-07-28T14:49:05.000000Z"
  }
};

export const mockUploadChatFiles: IApiResponse<string[] | null> = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": [
    "https://talbinahtest.s3.eu-central-1.amazonaws.com/chats-files/9rqBUpWmFaFQbM5aMA8CpfntWh0sfCaGtc85GSlX.pdf"
  ]
};

export const mockReservationHomework: IReservationHomeworkResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "mental_health": [
      {
        "id": 71,
        "reservation_id": 3504,
        "user_id": 242,
        "assignment_type": "App\\Models\\MentalCategory",
        "assignment_id": 1,
        "review": 1,
        "result": "62.96",
        "created_at": "2025-06-29T11:25:24.000000Z",
        "updated_at": "2025-06-29T11:39:13.000000Z",
        "assignment": {
          "id": 1,
          "title": "مقياس اضطراب الاكتئاب",
          "color": "#2970FF",
          "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/MentalAssessment/lCuup2tx7XT217p45YA668860PS6aLLsGke6GsXL.png",
          "question_number": 9,
          "duration": 5,
          "answer_type": "word",
          "total_grade": 27,
          "reference": "الاستبيان الصحي في عينة سعودية. آن جين الطب النفسي",
          "brief": "يشكل هذا الاستبيان جزءا مهما من عملية تقديم افضل رعاية صحية ممكننة لك وستساعد اجابتك فى فهم المشكلات التى قد تعانى منها الرجاء الاجابه عن كل سؤال ب اكبر قدر من الصراحه",
          "usage_count": 514,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2025-07-05T10:48:12.000000Z"
        },
        "type": "mental_health"
      },
      {
        "id": 72,
        "reservation_id": 3504,
        "user_id": 242,
        "assignment_type": "App\\Models\\MentalCategory",
        "assignment_id": 4,
        "review": 1,
        "result": "70.37",
        "created_at": "2025-06-29T11:25:32.000000Z",
        "updated_at": "2025-06-30T14:13:22.000000Z",
        "assignment": {
          "id": 4,
          "title": "مقياس الوسواس القهرى ",
          "color": "#FEB603",
          "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/MentalAssessment/obsessive-compulsive.png",
          "question_number": 10,
          "duration": 3,
          "answer_type": "word",
          "total_grade": 40,
          "reference": "الاستبيان الصحي في عينة سعودية. آن جين الطب النفسي",
          "brief": "يشكل هذا الاستبيان جزءا مهما من عملية تقديم افضل رعاية صحية ممكننة لك وستساعد اجابتك فى فهم المشكلات التى قد تعانى منها الرجاء الاجابه عن كل سؤال ب اكبر قدر من الصراحه",
          "usage_count": 113,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2025-07-02T18:40:50.000000Z"
        },
        "type": "mental_health"
      },
      {
        "id": 74,
        "reservation_id": 3504,
        "user_id": 242,
        "assignment_type": "App\\Models\\MentalCategory",
        "assignment_id": 2,
        "review": 1,
        "result": "52.38",
        "created_at": "2025-07-01T03:58:09.000000Z",
        "updated_at": "2025-07-03T16:54:53.000000Z",
        "assignment": {
          "id": 2,
          "title": "مقياس اضطراب القلق العام ",
          "color": "#13C16D",
          "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/MentalAssessment/Anxiety.png",
          "question_number": 7,
          "duration": 3,
          "answer_type": "word",
          "total_grade": 21,
          "reference": "الاستبيان الصحي في عينة سعودية. آن جين الطب النفسي",
          "brief": "يشكل هذا الاستبيان جزءا مهما من عملية تقديم افضل رعاية صحية ممكننة لك وستساعد اجابتك فى فهم المشكلات التى قد تعانى منها الرجاء الاجابه عن كل سؤال ب اكبر قدر من الصراحه",
          "usage_count": 346,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2025-07-03T16:54:53.000000Z"
        },
        "type": "mental_health"
      }
    ],
    "article": [
      {
        "id": 73,
        "reservation_id": 3504,
        "user_id": 242,
        "assignment_type": "Modules\\Article\\Entities\\Article",
        "assignment_id": 7,
        "review": 1,
        "result": null,
        "created_at": "2025-07-01T03:55:13.000000Z",
        "updated_at": "2025-07-07T04:26:38.000000Z",
        "assignment": {
          "id": 18,
          "article_category": {
            "id": 1,
            "name": "الحزن والقلق",
            "image": null,
            "created_at": "2023-09-06T22:12:08.000000Z"
          },
          "keywords": [],
          "title": "كيف أتخلص من التفكير الزائد والتشتت؟",
          "description": "<p><font color=\"#003163\">عندما نواجه الإفراط في التفكير، يمكن أن يبدو عقلنا وكأنه أسوأ عدو لنا. تلك هي الأفكار المتكررة المشاكل التي نفكر فيها أكثر من اللازم تُرهقنا دون فائدة. ولكن هناك&nbsp;<span style=\"font-weight: 600;\">طرق للتخلص من التفكير الزائد، والحفاظ على صحتنا النفسية، وحمايتنا من الاضطرابات المختلفة.&nbsp;</span>فيما يلي بعض التوصيات والنصائح التي يمكن أن تساعدك:</font></p><p>&nbsp;<span style=\"font-weight: 600;\"><font color=\"#083139\">1. راقب نفسك واكتشف سبب المشكلة:</font></span><span style=\"color: rgb(0, 49, 99);\">&nbsp;</span>في المرة القادمة التي تشعر فيها بالتشتت، حاول أن ترى مدى تأثير ذلك على حالتك المزاجية ورفاهيتك العامة. هل تشعر بالغضب أو التوتر أو الذنب؟ حاول معرفة الشعور الأساسي وراء تلك الأفكار وما هو السبب الرئيسي وراءها. إن البدء في علاج أي مشكلة يتطلب التعرف على أسبابها.</p><p><font color=\"#083139\"><span style=\"font-weight: 600;\">2. ابحث عن طرق للتخلص من هذه الأفكار.</span>&nbsp;</font>هناك مجموعة متنوعة من التقنيات التي يمكن أن تساعدك على إبعاد عقلك عن الأفكار التي تسيطر عليك. ومن الأمثلة على هذه الأساليب: ممارسة التمارين الرياضية بانتظام، والمشاركة في مجموعة متنوعة من الأنشطة الاجتماعية، وتعزيز العلاقات مع العائلة والأصدقاء، وممارسة الهوايات والأنشطة التي تستمتع بها.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">3. جرب تمارين الاسترخاء والتأمل:</font>&nbsp;</span>تمارين الاسترخاء والتأمل لها فوائد جيدة للصحة النفسية والجسدية. يساعدك على محاربة القلق والتوتر، ويساعدك على التخلص من الأفكار المتكررة التي تعيقك عن طريق إعادة توجيه انتباهك إلى الداخل ونسيان المواقف المزعجة والقلق الذي تسببه.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">4. حدد أهدافًا واضحة وركز على الأولويات:</font></span>&nbsp;لا تسمح للمشاكل الصغيرة أن تتحول إلى عقبات كبيرة. فكر دائمًا في ما هو مهم بالنسبة لك وحدد الأولويات والأهداف الرئيسية. لا تدع الأفكار والعقبات الصغيرة تصرفك عن هدفك الرئيسي.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">5. مساعدة الآخرين والتعاون معهم:</font>&nbsp;</span>إن محاولة تخفيف أعباء الآخرين ومساعدتهم يمكن أن تساعدك على رؤية الأشياء في ضوء مختلف. فكر فيما يمكنك فعله لمساعدة شخص يمر بوقت عصيب. إن معرفة أن لديك القدرة على مساعدة الآخرين وتحسين حياتهم يمكن أن يمنع الأفكار السلبية من السيطرة على عقلك ويمنحك شيئًا مفيدًا للتركيز عليه بدلاً من الأفكار المتكررة.</p><p><font color=\"#083139\"><span style=\"font-weight: 600;\">6. تحديد الأفكار السلبية العشوائية والقضاء عليها.</span>&nbsp;</font>تثير هذه الأفكار السلبية العشوائية الخوف والغضب كرد فعل أولي على مواقف معينة. يمكنك التخلص منها باستخدام دفتر ملاحظات وتدوين المواقف التي تسبب لك القلق والتشتت. ثم حاول تحليل المشاعر التي تمر بها وتعلم كيفية التحدث مع نفسك خلال تلك المواقف. حاول إيجاد بديل للأفكار السلبية، على سبيل المثال فكر في الأشياء التي قد تسير على ما يرام بدلاً من الأشياء التي قد تفشل، وما إلى ذلك. الأول يولد الأمل والحماس، والثاني يولد الخوف واليأس.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">7. اعترف بنجاحاتك وكن ممتنًا لنفسك.&nbsp;</font></span>عندما تجد نفسك غارقًا في الأفكار السلبية، تذكر نجاحاتك وإنجازاتك، وركز على الجوانب الإيجابية في حياتك، مثل العمل والدراسة. احترام الذات والاهتمام بالنفس هو الخطوة الأولى في مواجهة أي اضطراب نفسي.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">8. حافظ على تركيزك.</font></span>&nbsp;الأفكار السلبية المتكررة تؤثر بشكل كبير على التركيز وتشتت الانتباه. لذا حاول أن تحافظ على تركيزك على المهام والأهداف الرئيسية، وتتخلص من الأفكار الثانوية التي تشتت ذهنك وتؤثر على أدائك في كافة جوانب حياتك.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">9. لا تتردد في طلب المساعدة عند الحاجة.&nbsp;</font></span>إذا كنت قد جربت التوصيات والنصائح السابقة ولم تلاحظ تحسناً ملحوظاً، أو إذا كان التفكير الزائد يؤثر سلباً على حالتك العامة، فلا تتردد في الاستعانة بالطبيب النفسي. فالأخصائيون هم الأكثر قدرة على تشخيص الحالة وتحديد أسبابها وتقديم العلاج المناسب. التفكير الزائد قد يضرك أكثر من نفعه، لذا حاول تطبيق التوصيات والنصائح السابقة ولا تتردد في طلب المساعدة المتخصصة عند الحاجة.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">10. ابق على مقربة من الأشخاص الإيجابيين.&nbsp;</font></span>يقال أن السعادة معدية، والحقيقة هي أننا نتأثر بشدة ببيئتنا. لذا، حاول أن تظل قريبًا من الأشخاص الإيجابيين والملهمين. ابحث عن الأشخاص الذين يساعدونك على التفكير بشكل إيجابي ويقدمون لك الدعم والتشجيع. - مارسي أنشطة اجتماعية مشتركة معهم، فتفاعلك معهم يمكن أن يساعدك في التخلص من الأفكار السلبية والمشتتات، ويعزز اندماجك في المجتمع.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">11. لا تتردد في طلب المساعدة عند الضرورة.</font></span>&nbsp;إذا كنت قد جربت جميع التوصيات والنصائح السابقة ومازلت تعاني من كثرة التفكير وتأثيره السلبي على حياتك، فلا تتردد في طلب المساعدة المتخصصة. يتمتع المعالجون النفسيون والمهنيون في هذا المجال بالخبرة والمعرفة لمساعدتك في التعامل مع التفكير الزائد وتطوير استراتيجيات لتحسين صحتك العقلية. فلا تتردد في التواصل معهم والاستفادة من خبراتهم. باختصار، التخلص من التفكير الزائد يتطلب ممارسة الوعي، والاهتمام بحالتك النفسية، والعمل على تطبيق تقنيات التخلص من الأشياء الزائدة.</p>",
          "trending": 0,
          "original_trending": "غير شائعة",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/ron17iPkE1aysrr1sQJNqz5M1PljoPKh7c7ZvJxC.png",
          "is_bookmark": false,
          "created_at": "2024-05-27T11:18:52.000000Z",
          "new": false
        },
        "type": "article"
      },
      {
        "id": 73,
        "reservation_id": 3504,
        "user_id": 242,
        "assignment_type": "Modules\\Article\\Entities\\Article",
        "assignment_id": 7,
        "review": 1,
        "result": null,
        "created_at": "2025-07-01T03:55:13.000000Z",
        "updated_at": "2025-07-07T04:26:38.000000Z",
        "assignment": {
          "id": 21,
          "article_category": {
            "id": 1,
            "name": "الحزن والقلق",
            "image": null,
            "created_at": "2023-09-06T22:12:08.000000Z"
          },
          "keywords": [],
          "title": "التعلق المرضي: قيود العاطفة التي تعيق الحرية!",
          "description": "<h3><span style=\"font-family: Cairo; font-size: 13px;\">الحب والاهتمام والروابط العاطفية هي ما تجعلنا بشرًا، تعزز من إنسانيتنا وتضفي معنى على حياتنا. ولكن، ماذا يحدث عندما تتحول هذه الروابط إلى قيود خانقة؟ التعلق المرضي هو حالة نفسية تتجاوز حدود الحب والاهتمام الطبيعيين، لتصبح عائقًا كبيرًا أمام الحرية الشخصية والنمو الذاتي. في هذا المقال، سنستكشف أعماق التعلق المرضي، أسبابه، علاماته، وسبل التحرر منه.</span><br></h3><h4><font color=\"#003163\"><b>التعلق المرضي</b></font></h4><p>التعلق المرضي هو حالة نفسية يشعر فيها الفرد بارتباط عاطفي شديد وغير صحي تجاه شخص آخر. يمكن أن يكون هذا الشخص شريكًا رومانسيًا، صديقًا، أو حتى أحد أفراد العائلة. يتميز التعلق المرضي بالحاجة المفرطة للدعم العاطفي، الاعتماد الزائد على الآخر، والخوف الشديد من الفقدان أو الهجر.</p><h4><font color=\"#083139\">أسباب التعلق المرضي</font></h4><ol><li><strong>الطفولة والتجارب السابقة</strong>: التجارب العاطفية السلبية في الطفولة، مثل الإهمال أو فقدان الأحبة، قد تؤدي إلى تطوير أنماط تعلق غير صحية في المستقبل.</li><li><strong>انعدام الثقة بالنفس</strong>: عندما يفتقر الفرد إلى الثقة بنفسه، يميل إلى البحث عن الأمان والاعتراف من الآخرين بشكل مفرط.</li><li><strong>القلق والخوف من الفقدان</strong>: الأشخاص الذين يعانون من اضطرابات القلق غالبًا ما يخشون الفقدان أو الهجر، مما يعزز التعلق المرضي.</li></ol><h4><font color=\"#083139\">علامات التعلق المرضي</font></h4><ol><li><strong>الاعتماد العاطفي الزائد</strong>: الحاجة المستمرة للتواجد مع الشخص الآخر والحصول على طمأنينة مستمرة.</li><li><strong>الغيرة المفرطة</strong>: الشعور بالغيرة والشكوك بدون أسباب منطقية.</li><li><strong>التضحية بالذات</strong>: تجاهل احتياجاتك ورغباتك في سبيل إرضاء الشخص الآخر.</li><li><strong>الخوف من الانفصال</strong>: الشعور بالرعب من فكرة الانفصال أو الهجر.</li></ol><h4><font color=\"#083139\">آثار التعلق المرضي</font></h4><p>التعلق المرضي يمكن أن يؤدي إلى مجموعة من المشكلات النفسية والعاطفية. قد يشعر الفرد بفقدان هويته واستقلاله، ويعاني من التوتر والقلق المستمرين. كما يمكن أن يؤدي التعلق المرضي إلى تدهور العلاقات، حيث يشعر الطرف الآخر بالاختناق نتيجة للتوقعات والاحتياجات الزائدة.</p><h4><font color=\"#083139\">كيفية التحرر من التعلق المرضي</font></h4><ol><li><strong>الوعي الذاتي</strong>: أول خطوة للتحرر هي الوعي بوجود المشكلة وفهم جذورها. حاول التعرف على الأنماط السلبية في علاقاتك والبحث عن الأسباب الكامنة وراءها.</li><li><strong>بناء الثقة بالنفس</strong>: اعمل على تعزيز ثقتك بنفسك واستقلاليتك. شارك في أنشطة تعزز من قدراتك وتجعلك تشعر بالقوة والاكتفاء الذاتي.</li><li><strong>الاستقلال العاطفي</strong>: حاول تطوير علاقات صحية ومستقلة، واحترم مساحتك الشخصية واحتياجاتك.</li><li><strong>طلب المساعدة</strong>: إذا وجدت صعوبة في التعامل مع التعلق المرضي بمفردك، لا تتردد في طلب المساعدة من مستشار نفسي أو معالج متخصص.</li></ol><h4><span style=\"font-family: Cairo; font-size: 13px;\">التعلق المرضي هو حالة نفسية معقدة يمكن أن تؤثر سلبًا على حياتك وعلاقاتك. من خلال الوعي والجهد المستمر، يمكنك التحرر من قيود هذا التعلق وتطوير علاقات أكثر صحة وتوازنًا. تذكر دائمًا أن الحب الحقيقي يبدأ من حبك واحترامك لنفسك.</span><br></h4>",
          "trending": 0,
          "original_trending": "غير شائعة",
          "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/5yMazSDhb0RA3K4frwh0rg6flOUypXiN98BSn9Uk.jpg",
          "is_bookmark": false,
          "created_at": "2024-07-16T17:18:42.000000Z",
          "new": false
        },
        "type": "article"
      }
    ],
    "podcast": [
      {
        "id": 75,
        "reservation_id": 3504,
        "user_id": 242,
        "assignment_type": "App\\Models\\Podcast",
        "assignment_id": 1,
        "review": 0,
        "result": null,
        "created_at": "2025-07-01T04:36:42.000000Z",
        "updated_at": "2025-07-01T04:36:42.000000Z",
        "assignment": {
          "id": 1,
          "podcast_category_id": 1,
          "podcast_promo_id": null,
          "doctor_name": "د. إسلام عفيفي",
          "title": "لأجل نفسك لا لأجل غيرك",
          "description": "يشجع المشاركين على تطوير قدراتهم الشخصية وتحفيز أنفسهم لتحقيق أهدافهم.",
          "thumbnail_image": "https://scontent.fspx1-1.fna.fbcdn.net/v/t39.30808-6/485912314_4108769296002822_8555652118649198700_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=VK5e7tncLCoQ7kNvwHp64S8&_nc_oc=Adl-5kCIufUAWizWKDJWGnkCwh88PG85ERBtkiFI2cVhLpxmMqRwLuRiYG1DKDpwoys&_nc_zt=23&_nc_ht=scontent.fspx1-1.fna&_nc_gid=84-pZEO-jLrpSxwm52k9_w&oh=00_AfToN-XmilH-rWuJ54KOphdZEQSV1ghSIhVLNy0wRs4O_g&oe=687AECBE",
          "background_color": "#fff1f7",
          "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/xOT80IEhYpceGg3sckXOyvHsjwD0F3yq7SUcJHUV.mp3",
          "file_type": "audio",
          "link_type": "file",
          "duration": "01:27",
          "type": "free",
          "visit_count": 48,
          "status": 1,
          "created_at": "2024-07-30T16:48:55.000000Z",
          "updated_at": "2025-07-02T19:35:34.000000Z"
        },
        "type": "podcast"
      },
      {
        "id": 75,
        "reservation_id": 3504,
        "user_id": 242,
        "assignment_type": "App\\Models\\Podcast",
        "assignment_id": 1,
        "review": 0,
        "result": null,
        "created_at": "2025-07-01T04:36:42.000000Z",
        "updated_at": "2025-07-01T04:36:42.000000Z",
        "assignment": {
          "id": 1,
          "podcast_category_id": 1,
          "podcast_promo_id": null,
          "title": "إزاي تقدر تعيش الحياة بسعادة",
          "description": "يشجع المشاركين على تطوير قدراتهم الشخصية وتحفيز أنفسهم لتحقيق أهدافهم.",
          "thumbnail_image": "https://scontent.fspx1-1.fna.fbcdn.net/v/t51.75761-15/491413337_18497851972010963_4980128226817792701_n.webp?stp=dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=L_t6mGrlC2gQ7kNvwEVuHCy&_nc_oc=Adl3WcgaKgLp8MwBuWDoXNGe0cDlO6WJ5eFWykS1McETVEvVy18EkQS4kPiMIvDF7eA&_nc_zt=23&_nc_ht=scontent.fspx1-1.fna&_nc_gid=wzJ4L_le-IMV48SRvpeP-w&oh=00_AfT8hRb7mSdi3PSnC6WFO8o1obS7IgpiqJkte3xo_1wSRg&oe=687AE789",
          "background_color": "#fff1f7",
          "file": "https://talbinahtest.s3.eu-central-1.amazonaws.com/podcasts/xOT80IEhYpceGg3sckXOyvHsjwD0F3yq7SUcJHUV.mp3",
          "file_type": "audio",
          "link_type": "file",
          "doctor_name": "د. عدي محمد",
          "duration": "01:27",
          "type": "free",
          "visit_count": 48,
          "status": 1,
          "created_at": "2024-07-30T16:48:55.000000Z",
          "updated_at": "2025-07-02T19:35:34.000000Z"
        },
        "type": "podcast"
      }
    ]
  }
};
export const mockLeaveRating: ILeaveRatingResponseDto = {
  "status": true,
  "message": null,
  "data": null
};
export const mockBlockUser: IBlockUserResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "id": 6,
    "doctor_id": 2139,
    "user_id": 242,
    "type": "user",
    "status": 1,
    "created_at": "2024-10-14T14:08:55.000000Z",
    "updated_at": "2025-07-09T15:25:09.000000Z"
  }
};

export const mockReviewHomework: IApiResponse<{ assignment_id: string }> = {
  "status": true,
  "message": null,
  "data": {
    "assignment_id": "1"
  }
};