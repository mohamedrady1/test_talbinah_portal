import { ICreateMentalHealthScaleResponseDto, ILastSevenUserMoodsResponseDto, IMentalHealthScalesListingResponseDto, IMoodsListingResponseDto, IMyMentalHealthScalesResponseDto, IStoreUserMoodResponseDto } from "../dtos";

export const mockMoodsListing: IMoodsListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "feelings": "سعيد",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/1.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-06-04T15:13:45.000000Z"
    },
    {
      "id": 2,
      "feelings": "محايد",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/2.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-06-01T05:54:10.000000Z"
    },
    {
      "id": 3,
      "feelings": "متعب",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/3.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-06-01T05:54:07.000000Z"
    },
    {
      "id": 4,
      "feelings": "محبط",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/4.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-05-27T10:19:39.000000Z"
    },
    {
      "id": 5,
      "feelings": "غاضب",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/5.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-05-27T08:47:21.000000Z"
    },
    {
      "id": 6,
      "feelings": "حزين",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/6.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-05-27T11:15:30.000000Z"
    },
    {
      "id": 7,
      "feelings": "قلق",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/7.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-05-27T09:57:00.000000Z"
    },
    {
      "id": 8,
      "feelings": "راضي",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/8.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-05-24T18:02:50.000000Z"
    },
    {
      "id": 9,
      "feelings": "متأقلم",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/9.png",
      "color": "#F8E96A",
      "created_at": "2023-12-28T06:44:18.000000Z",
      "updated_at": "2025-05-27T16:52:04.000000Z"
    }
  ]
};

export const mockStoreMood: IStoreUserMoodResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 2266,
    "main_lang": "ar",
    "translate_id": null,
    "association_id": null,
    "fcm_token": null,
    "device_type": "web",
    "device_name": null,
    "version_name": null,
    "version_code": null,
    "full_name": "Eslam Afify",
    "nick_name": null,
    "country_id": 63,
    "phone_no": "1016221599",
    "phone_verified_at": null,
    "email": "eslamafifybarakat@gmail.com",
    "email_verified_at": null,
    "work_email": null,
    "work_email_verified_at": null,
    "remember_token": null,
    "owned_code": null,
    "referral_code": null,
    "role": "user",
    "active": 1,
    "visible": 1,
    "created_by": "website",
    "last_seen": "2025-06-01 12:02:47",
    "coupon_notify": 0,
    "preferred_msg_channel": "both",
    "created_at": "2025-03-13T01:05:57.000000Z",
    "updated_at": "2025-06-01T09:02:47.000000Z",
    "original_active": "فعال",
    "moods": [
      {
        "id": 1,
        "feelings": "سعيد",
        "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/1.png",
        "color": "#F8E96A",
        "created_at": "2023-12-28T06:44:18.000000Z",
        "updated_at": "2025-06-11T10:14:39.000000Z",
        "pivot": {
          "user_id": 2266,
          "mood_id": 1,
          "date": "2025-06-11"
        }
      }
    ]
  }
};

export const mockLastSeven: ILastSevenUserMoodsResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "mood_id": 1,
      "feelings": "سعيد",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/moods/1.png",
      "color": "#F8E96A",
      "created_at": "2025-06-11"
    }
  ]
};

export const mockMentalHealthScalesListing: IMentalHealthScalesListingResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
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
    {
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
      "usage_count": 321,
      "created_at": "2023-12-28T06:43:53.000000Z",
      "updated_at": "2025-05-27T07:44:44.000000Z",
      "questions": [
        {
          "id": 10,
          "mental_category_id": 2,
          "question": "الشعور بالتوتر، العصبية أو القلق",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 37,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 38,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 39,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 40,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 11,
          "mental_category_id": 2,
          "question": "عدم القدرة على ايقاف قلقك وهمومك او السيطرة عليها.",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 41,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 42,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 43,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 44,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 12,
          "mental_category_id": 2,
          "question": "القلق و الهم الزائد حول عدة أمور",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 45,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 46,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 47,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 48,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 13,
          "mental_category_id": 2,
          "question": "صعوبة في الاسترخاء",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 49,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 50,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 51,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 52,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 14,
          "mental_category_id": 2,
          "question": "الشعور بعدم الاستقرار لدرجة تصعب عليك فيها الجلوس بلا حركة",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 53,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 54,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 55,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 56,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 15,
          "mental_category_id": 2,
          "question": "الانفعال أو الانزعاج بسهولة",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 57,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 58,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 59,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 60,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 16,
          "mental_category_id": 2,
          "question": " هل شعرت بضيق في التنفس؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 61,
              "mental_category_id": 2,
              "mental_question_id": 16,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 62,
              "mental_category_id": 2,
              "mental_question_id": 16,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 63,
              "mental_category_id": 2,
              "mental_question_id": 16,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 64,
              "mental_category_id": 2,
              "mental_question_id": 16,
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
          "id": 6,
          "mental_category_id": 2,
          "start_percentage": 0,
          "end_percentage": 20,
          "result_note": "لا يوجد قلق",
          "title": " يظهر من خلال إجاباتك عدم وجود قلق  ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 7,
          "mental_category_id": 2,
          "start_percentage": 20,
          "end_percentage": 40,
          "result_note": "قلق بسيط",
          "title": " يظهر من خلال إجاباتك علامات قلق بسيط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 8,
          "mental_category_id": 2,
          "start_percentage": 40,
          "end_percentage": 60,
          "result_note": "قلق متوسط",
          "title": " يظهر من خلال إجاباتك علامات قلق متوسط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 9,
          "mental_category_id": 2,
          "start_percentage": 60,
          "end_percentage": 80,
          "result_note": " قلق متوسط الى شديد ",
          "title": " يظهر من خلال إجاباتك علامات قلق متوسط الى شديد",
          "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 10,
          "mental_category_id": 2,
          "start_percentage": 80,
          "end_percentage": 100,
          "result_note": " قلق شديد",
          "title": " يظهر من خلال إجاباتك علامات قلق  شديد",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        }
      ]
    },
    {
      "id": 3,
      "title": "مقياس اضطراب الهلع ",
      "color": "#EA7B86",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/MentalAssessment/Panic.png",
      "question_number": 11,
      "duration": 2,
      "answer_type": "word",
      "total_grade": 11,
      "reference": "الاستبيان الصحي في عينة سعودية. آن جين الطب النفسي",
      "brief": "يشكل هذا الاستبيان جزءا مهما من عملية تقديم افضل رعاية صحية ممكننة لك وستساعد اجابتك فى فهم المشكلات التى قد تعانى منها الرجاء الاجابه عن كل سؤال ب اكبر قدر من الصراحه",
      "usage_count": 144,
      "created_at": "2023-12-28T06:43:53.000000Z",
      "updated_at": "2025-05-20T16:37:59.000000Z",
      "questions": [
        {
          "id": 17,
          "mental_category_id": 3,
          "question": " هل شعرت بخفقان أو تسارع نبضات قلبك؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 65,
              "mental_category_id": 3,
              "mental_question_id": 17,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 66,
              "mental_category_id": 3,
              "mental_question_id": 17,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 18,
          "mental_category_id": 3,
          "question": " هل آلمك صدرك أو شعرت بضغط عليه؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 67,
              "mental_category_id": 3,
              "mental_question_id": 18,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 68,
              "mental_category_id": 3,
              "mental_question_id": 18,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 19,
          "mental_category_id": 3,
          "question": " هل تعرقت؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 69,
              "mental_category_id": 3,
              "mental_question_id": 19,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 70,
              "mental_category_id": 3,
              "mental_question_id": 19,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 20,
          "mental_category_id": 3,
          "question": " هل شعرت وكأنك تختنق؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 71,
              "mental_category_id": 3,
              "mental_question_id": 20,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 72,
              "mental_category_id": 3,
              "mental_question_id": 20,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 21,
          "mental_category_id": 3,
          "question": "هل مررت بنوبات حرارة أو برودة؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 73,
              "mental_category_id": 3,
              "mental_question_id": 21,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 74,
              "mental_category_id": 3,
              "mental_question_id": 21,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 22,
          "mental_category_id": 3,
          "question": "هل شعرت بالغثيان أو بتلبك في معدتك أو شعرت بأنك ستصاب بالاسهال؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 75,
              "mental_category_id": 3,
              "mental_question_id": 22,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 76,
              "mental_category_id": 3,
              "mental_question_id": 22,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 23,
          "mental_category_id": 3,
          "question": " هل أغمي عليك أو شعرت بدوخة أو عدم الاتزان؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 77,
              "mental_category_id": 3,
              "mental_question_id": 23,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 78,
              "mental_category_id": 3,
              "mental_question_id": 23,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 24,
          "mental_category_id": 3,
          "question": " هل شعرت بوخزات أو تنميل في أجزاء من جسمك؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 79,
              "mental_category_id": 3,
              "mental_question_id": 24,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 80,
              "mental_category_id": 3,
              "mental_question_id": 24,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 25,
          "mental_category_id": 3,
          "question": " هل شعرت بالرعشة أو الارتجاف؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 81,
              "mental_category_id": 3,
              "mental_question_id": 25,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 82,
              "mental_category_id": 3,
              "mental_question_id": 25,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 26,
          "mental_category_id": 3,
          "question": " هل خفت من أن تموت؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 83,
              "mental_category_id": 3,
              "mental_question_id": 26,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 84,
              "mental_category_id": 3,
              "mental_question_id": 26,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        }
      ],
      "results": [
        {
          "id": 11,
          "mental_category_id": 3,
          "start_percentage": 0,
          "end_percentage": 20,
          "result_note": "لا يوجد هلع",
          "title": " يظهر من خلال إجاباتك عدم وجود هلع  ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 12,
          "mental_category_id": 3,
          "start_percentage": 20,
          "end_percentage": 40,
          "result_note": "هلع بسيط",
          "title": " يظهر من خلال إجاباتك علامات هلع بسيط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 13,
          "mental_category_id": 3,
          "start_percentage": 40,
          "end_percentage": 60,
          "result_note": "هلع متوسط",
          "title": " يظهر من خلال إجاباتك علامات هلع متوسط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 14,
          "mental_category_id": 3,
          "start_percentage": 60,
          "end_percentage": 80,
          "result_note": " هلع متوسط الى شديد ",
          "title": " يظهر من خلال إجاباتك علامات هلع متوسط الى شديد",
          "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 15,
          "mental_category_id": 3,
          "start_percentage": 80,
          "end_percentage": 100,
          "result_note": " هلع شديد",
          "title": " يظهر من خلال إجاباتك علامات هلع  شديد",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        }
      ]
    },
    {
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
      "usage_count": 107,
      "created_at": "2024-02-22T04:23:42.000000Z",
      "updated_at": "2025-05-27T11:18:44.000000Z",
      "questions": [
        {
          "id": 27,
          "mental_category_id": 4,
          "question": "مقدار الوقت الذى تستغرقه الافكار الوسواسية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 85,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "لا شيء",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 86,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "اقل من ساعة فى اليوم أو تتكرر احيانا (بمعدل 8 مرات فأقل يوميا )",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 87,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "من ساعة الى 3 ساعات فى اليوم او تتكرر كثيرا (اكثر من 8 مرات فى اليوم وفى معظم ساعات اليوم)",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 88,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "من 3 الى 8 ساعات فى اليوم او تحدث كثرا جدا (تحدث اكثر من 8 مرات فى اليوم وفى معظم ساعات اليوم )",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 89,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "اكثر من 8 ساعات فى اليوم او تحدث بشكل دائم (اكثر من تحملها ونادرا ما تمر ساعة بدون وساوس كثيرة ) ",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 28,
          "mental_category_id": 4,
          "question": "مقدار التعارض الذى تحدثه الافكار الوسواسيه مع نشاطاتك الاجتماعية والعلمية ",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 90,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 91,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تعارض خفيف مع النشاطات الاجتماعية او العملية ولكن النشاط العام لا يتأثر",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 92,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تعارض واضح مع النشاطات الاجتماعية او العملية ولكن يمكن السيطرة عليه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 93,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تسبب خللا كبيرا فى اداء النشاطات الاجتماعية او العملية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 94,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تسبب خللا بليغا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 29,
          "mental_category_id": 4,
          "question": "مقدار التوتر والقلق المصاحب للأفكار الوسواسية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 95,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 96,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "خفيف (احيانا) ليس مزعجا",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 97,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "متوسط (غالبا) ومزعجا ولكن يمكن السيطرة عليه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 98,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": " شديد (اغلب الوقت) ومزعج جدا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 99,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "توتر بليغ (دائم) لحد الاعاقة تقريبا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 30,
          "mental_category_id": 4,
          "question": "مقدار الجهد المبذول فى مقاومة الافكار الوسواسية (بغض النظر عن نجاحك فى المقاومة)",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 100,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "لا ابذل جهدا حتى اقاوم دائما (او ان الافكار قليلة جدا بحيث لا حاجة للمقاومة",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 101,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "احاول ان اقاوم معظم الوقت",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 102,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "ابذل بعض الجهد حتى أقاوم",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 103,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "استسلم لكل الافكار الوسواسية بدون محاولة للسيطرة عليها وان حاولت السيطرة فيكون بعد تردد",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 104,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "استسلم كليا وبإرادتى للافكار الوسواسية كلها",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 31,
          "mental_category_id": 4,
          "question": "مقدار سيطرتك على الافكار الوسواسية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 105,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة تامة",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 106,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة كبيرة عادة يمكننى ان اوقف او اصرف انتباهى عن الوسواس عند بذل بعض الجهد والتركيز",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 107,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة متوسطة بعض الاحيان استطيع ايقاف او صرف انتباهي عن الوسواس",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 108,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة قليلة نادرا ما انجح فى ايقاف الوسواس استطيع فقط صرف الانتباه وبصعوبة",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 109,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "لا سيطرة نادرا ما استطيع صرف الانتباه عن الوساوس ولو للحظات قليلة",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 32,
          "mental_category_id": 4,
          "question": "مقدار الوقت الذي تمضيه فى القيام بالافعال القهرية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 110,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "لا شيء",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 111,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "اقل من ساعة فى اليوم او تقوم بالافعال احيانا ( لا تزيد عن 8 مرات فى اليوم )",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 112,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "من ساعة الى 3 ساعات في اليوم او تقوم بالافعال كثيرا (اكثر من 8 مرات فى اليوم ولكن معظم الساعات تخلو من الافعال القهرية)",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 113,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "اكثر من ثلاث ساعات فى اليوم اة تقوم بالافعال كثيرا جدا (اكثر من 8 مرات فى اليوم وخلال معظم ساعات اليوم )",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 114,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "اكثر من 8 ساعات فى اليوم او تقوم بالافعال بشكل دائم (اكثر من ان تحصيها ونادرا ما تمر ساعة لا تقوم فيها بالافعال )",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 33,
          "mental_category_id": 4,
          "question": "مقدار التعارض الذي تحدثه الافعال القهرية فى نشاطاتك الاجتماعية والعملية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 115,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 116,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تعارض خفيف مع النشاطات الاجتماعية او العملية ولكن النشاط العام لا يتأثر",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 117,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تعارض واضح مع النشاطات الاجتماعية او العملية ولكن يمكن السيطره عليه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 118,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تسبب خللا كبيرا فى اداء النشاطات الاجتماعية او العملية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 119,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تسبب عجزا كبيرا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 34,
          "mental_category_id": 4,
          "question": "مقدار التوتر والقلق الناتج فى حال الامتناع عن القيام بالافعال القهرية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 120,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 121,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "قلق بسيط عند الامتناع عن القيام بالافعال",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 122,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "يظهر القلق ولكن يمكن تحمله",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 123,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "قلق واضح ومزعج للغاية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 124,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "قلق شديد يسبب عجزا بليغا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 35,
          "mental_category_id": 4,
          "question": "مقدار الجهد المبذول فى مقاومة الافعال القهرية (بغض النظر عن مدي نجاحك فى المقاومة",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 125,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "ابذل جهدا حتى اقاوم دائما ( او ان الافعال القهرية قليلة بحيث لا حاجه للمقاومه)",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 126,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "احاول ان اقاوم معظم الوقت",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 127,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "اعمل بعض المحاولات للمقاومه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 128,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "استسلم لكل الافعال القهرية بدون محاولة للسيطرة عليها وان حاولت السيطرة فيكون بعد تردد",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 129,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "استسلم كلية وبإرادتى لكل الافعال القهرية",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 36,
          "mental_category_id": 4,
          "question": "مقدار سيطرتك على الافعال القهرية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 130,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "سيطرة تامة",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 131,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "عادة ما اوقف الافعال القهرية بصعوبة",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 132,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "احيانا استطيع ايقاف الافعال القهرية بصعوبة",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 133,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "استطيع بصعوبة ان اؤخر -فقط- الافعال القهرية لكن يجب على القيام بها حتى النهاية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 134,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "نادرا ما استطيع ان اؤخر القيام بالافعال القهرية ولو للحظات",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        }
      ],
      "results": [
        {
          "id": 16,
          "mental_category_id": 4,
          "start_percentage": 0,
          "end_percentage": 20,
          "result_note": "خفيف جدا",
          "title": " يظهر من خلال إجاباتك وجود وسواس خفيف جدا  ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 17,
          "mental_category_id": 4,
          "start_percentage": 20,
          "end_percentage": 40,
          "result_note": "خفيف",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس خفيف ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 18,
          "mental_category_id": 4,
          "start_percentage": 40,
          "end_percentage": 60,
          "result_note": "متوسط",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس متوسط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 19,
          "mental_category_id": 4,
          "start_percentage": 60,
          "end_percentage": 80,
          "result_note": "ملحوظ",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس ملحوظ",
          "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 20,
          "mental_category_id": 4,
          "start_percentage": 80,
          "end_percentage": 100,
          "result_note": "شديد",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس شديد",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        }
      ]
    }
  ]
};
export const mockMyMentalHealthScales: any = {
  "status": true,
  "message": null,
  "data": [
    {
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
    {
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
      "usage_count": 321,
      "created_at": "2023-12-28T06:43:53.000000Z",
      "updated_at": "2025-05-27T07:44:44.000000Z",
      "questions": [
        {
          "id": 10,
          "mental_category_id": 2,
          "question": "الشعور بالتوتر، العصبية أو القلق",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 37,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 38,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 39,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 40,
              "mental_category_id": 2,
              "mental_question_id": 10,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 11,
          "mental_category_id": 2,
          "question": "عدم القدرة على ايقاف قلقك وهمومك او السيطرة عليها.",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 41,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 42,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 43,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 44,
              "mental_category_id": 2,
              "mental_question_id": 11,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 12,
          "mental_category_id": 2,
          "question": "القلق و الهم الزائد حول عدة أمور",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 45,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 46,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 47,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 48,
              "mental_category_id": 2,
              "mental_question_id": 12,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 13,
          "mental_category_id": 2,
          "question": "صعوبة في الاسترخاء",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 49,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 50,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 51,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 52,
              "mental_category_id": 2,
              "mental_question_id": 13,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 14,
          "mental_category_id": 2,
          "question": "الشعور بعدم الاستقرار لدرجة تصعب عليك فيها الجلوس بلا حركة",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 53,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 54,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 55,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 56,
              "mental_category_id": 2,
              "mental_question_id": 14,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 15,
          "mental_category_id": 2,
          "question": "الانفعال أو الانزعاج بسهولة",
          "question_grade": 3,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 57,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 58,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 59,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 60,
              "mental_category_id": 2,
              "mental_question_id": 15,
              "answer": "كل يوم تقريبا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 16,
          "mental_category_id": 2,
          "question": " هل شعرت بضيق في التنفس؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 61,
              "mental_category_id": 2,
              "mental_question_id": 16,
              "answer": "ابدا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 62,
              "mental_category_id": 2,
              "mental_question_id": 16,
              "answer": "عدة ايام",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 63,
              "mental_category_id": 2,
              "mental_question_id": 16,
              "answer": "أكثر من نصف الايام",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 64,
              "mental_category_id": 2,
              "mental_question_id": 16,
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
          "id": 6,
          "mental_category_id": 2,
          "start_percentage": 0,
          "end_percentage": 20,
          "result_note": "لا يوجد قلق",
          "title": " يظهر من خلال إجاباتك عدم وجود قلق  ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 7,
          "mental_category_id": 2,
          "start_percentage": 20,
          "end_percentage": 40,
          "result_note": "قلق بسيط",
          "title": " يظهر من خلال إجاباتك علامات قلق بسيط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 8,
          "mental_category_id": 2,
          "start_percentage": 40,
          "end_percentage": 60,
          "result_note": "قلق متوسط",
          "title": " يظهر من خلال إجاباتك علامات قلق متوسط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 9,
          "mental_category_id": 2,
          "start_percentage": 60,
          "end_percentage": 80,
          "result_note": " قلق متوسط الى شديد ",
          "title": " يظهر من خلال إجاباتك علامات قلق متوسط الى شديد",
          "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 10,
          "mental_category_id": 2,
          "start_percentage": 80,
          "end_percentage": 100,
          "result_note": " قلق شديد",
          "title": " يظهر من خلال إجاباتك علامات قلق  شديد",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        }
      ]
    },
    {
      "id": 3,
      "title": "مقياس اضطراب الهلع ",
      "color": "#EA7B86",
      "icon": "https://talbinahtest.s3.eu-central-1.amazonaws.com/MentalAssessment/Panic.png",
      "question_number": 11,
      "duration": 2,
      "answer_type": "word",
      "total_grade": 11,
      "reference": "الاستبيان الصحي في عينة سعودية. آن جين الطب النفسي",
      "brief": "يشكل هذا الاستبيان جزءا مهما من عملية تقديم افضل رعاية صحية ممكننة لك وستساعد اجابتك فى فهم المشكلات التى قد تعانى منها الرجاء الاجابه عن كل سؤال ب اكبر قدر من الصراحه",
      "usage_count": 144,
      "created_at": "2023-12-28T06:43:53.000000Z",
      "updated_at": "2025-05-20T16:37:59.000000Z",
      "questions": [
        {
          "id": 17,
          "mental_category_id": 3,
          "question": " هل شعرت بخفقان أو تسارع نبضات قلبك؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 65,
              "mental_category_id": 3,
              "mental_question_id": 17,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 66,
              "mental_category_id": 3,
              "mental_question_id": 17,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 18,
          "mental_category_id": 3,
          "question": " هل آلمك صدرك أو شعرت بضغط عليه؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 67,
              "mental_category_id": 3,
              "mental_question_id": 18,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 68,
              "mental_category_id": 3,
              "mental_question_id": 18,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 19,
          "mental_category_id": 3,
          "question": " هل تعرقت؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 69,
              "mental_category_id": 3,
              "mental_question_id": 19,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 70,
              "mental_category_id": 3,
              "mental_question_id": 19,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 20,
          "mental_category_id": 3,
          "question": " هل شعرت وكأنك تختنق؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 71,
              "mental_category_id": 3,
              "mental_question_id": 20,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 72,
              "mental_category_id": 3,
              "mental_question_id": 20,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 21,
          "mental_category_id": 3,
          "question": "هل مررت بنوبات حرارة أو برودة؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 73,
              "mental_category_id": 3,
              "mental_question_id": 21,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 74,
              "mental_category_id": 3,
              "mental_question_id": 21,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 22,
          "mental_category_id": 3,
          "question": "هل شعرت بالغثيان أو بتلبك في معدتك أو شعرت بأنك ستصاب بالاسهال؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 75,
              "mental_category_id": 3,
              "mental_question_id": 22,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 76,
              "mental_category_id": 3,
              "mental_question_id": 22,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 23,
          "mental_category_id": 3,
          "question": " هل أغمي عليك أو شعرت بدوخة أو عدم الاتزان؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 77,
              "mental_category_id": 3,
              "mental_question_id": 23,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 78,
              "mental_category_id": 3,
              "mental_question_id": 23,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 24,
          "mental_category_id": 3,
          "question": " هل شعرت بوخزات أو تنميل في أجزاء من جسمك؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 79,
              "mental_category_id": 3,
              "mental_question_id": 24,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 80,
              "mental_category_id": 3,
              "mental_question_id": 24,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 25,
          "mental_category_id": 3,
          "question": " هل شعرت بالرعشة أو الارتجاف؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 81,
              "mental_category_id": 3,
              "mental_question_id": 25,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 82,
              "mental_category_id": 3,
              "mental_question_id": 25,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        },
        {
          "id": 26,
          "mental_category_id": 3,
          "question": " هل خفت من أن تموت؟",
          "question_grade": 1,
          "header_title": null,
          "footer_title": null,
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z",
          "answers": [
            {
              "id": 83,
              "mental_category_id": 3,
              "mental_question_id": 26,
              "answer": "نعم",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            },
            {
              "id": 84,
              "mental_category_id": 3,
              "mental_question_id": 26,
              "answer": "لا",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2023-12-28T06:43:53.000000Z",
              "updated_at": "2023-12-28T06:43:53.000000Z"
            }
          ]
        }
      ],
      "results": [
        {
          "id": 11,
          "mental_category_id": 3,
          "start_percentage": 0,
          "end_percentage": 20,
          "result_note": "لا يوجد هلع",
          "title": " يظهر من خلال إجاباتك عدم وجود هلع  ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 12,
          "mental_category_id": 3,
          "start_percentage": 20,
          "end_percentage": 40,
          "result_note": "هلع بسيط",
          "title": " يظهر من خلال إجاباتك علامات هلع بسيط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 13,
          "mental_category_id": 3,
          "start_percentage": 40,
          "end_percentage": 60,
          "result_note": "هلع متوسط",
          "title": " يظهر من خلال إجاباتك علامات هلع متوسط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 14,
          "mental_category_id": 3,
          "start_percentage": 60,
          "end_percentage": 80,
          "result_note": " هلع متوسط الى شديد ",
          "title": " يظهر من خلال إجاباتك علامات هلع متوسط الى شديد",
          "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        },
        {
          "id": 15,
          "mental_category_id": 3,
          "start_percentage": 80,
          "end_percentage": 100,
          "result_note": " هلع شديد",
          "title": " يظهر من خلال إجاباتك علامات هلع  شديد",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2023-12-28T06:43:53.000000Z",
          "updated_at": "2023-12-28T06:43:53.000000Z"
        }
      ]
    },
    {
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
      "usage_count": 107,
      "created_at": "2024-02-22T04:23:42.000000Z",
      "updated_at": "2025-05-27T11:18:44.000000Z",
      "questions": [
        {
          "id": 27,
          "mental_category_id": 4,
          "question": "مقدار الوقت الذى تستغرقه الافكار الوسواسية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 85,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "لا شيء",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 86,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "اقل من ساعة فى اليوم أو تتكرر احيانا (بمعدل 8 مرات فأقل يوميا )",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 87,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "من ساعة الى 3 ساعات فى اليوم او تتكرر كثيرا (اكثر من 8 مرات فى اليوم وفى معظم ساعات اليوم)",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 88,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "من 3 الى 8 ساعات فى اليوم او تحدث كثرا جدا (تحدث اكثر من 8 مرات فى اليوم وفى معظم ساعات اليوم )",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 89,
              "mental_category_id": 4,
              "mental_question_id": 27,
              "answer": "اكثر من 8 ساعات فى اليوم او تحدث بشكل دائم (اكثر من تحملها ونادرا ما تمر ساعة بدون وساوس كثيرة ) ",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 28,
          "mental_category_id": 4,
          "question": "مقدار التعارض الذى تحدثه الافكار الوسواسيه مع نشاطاتك الاجتماعية والعلمية ",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 90,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 91,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تعارض خفيف مع النشاطات الاجتماعية او العملية ولكن النشاط العام لا يتأثر",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 92,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تعارض واضح مع النشاطات الاجتماعية او العملية ولكن يمكن السيطرة عليه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 93,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تسبب خللا كبيرا فى اداء النشاطات الاجتماعية او العملية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 94,
              "mental_category_id": 4,
              "mental_question_id": 28,
              "answer": "تسبب خللا بليغا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 29,
          "mental_category_id": 4,
          "question": "مقدار التوتر والقلق المصاحب للأفكار الوسواسية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 95,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 96,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "خفيف (احيانا) ليس مزعجا",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 97,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "متوسط (غالبا) ومزعجا ولكن يمكن السيطرة عليه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 98,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": " شديد (اغلب الوقت) ومزعج جدا",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 99,
              "mental_category_id": 4,
              "mental_question_id": 29,
              "answer": "توتر بليغ (دائم) لحد الاعاقة تقريبا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 30,
          "mental_category_id": 4,
          "question": "مقدار الجهد المبذول فى مقاومة الافكار الوسواسية (بغض النظر عن نجاحك فى المقاومة)",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 100,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "لا ابذل جهدا حتى اقاوم دائما (او ان الافكار قليلة جدا بحيث لا حاجة للمقاومة",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 101,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "احاول ان اقاوم معظم الوقت",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 102,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "ابذل بعض الجهد حتى أقاوم",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 103,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "استسلم لكل الافكار الوسواسية بدون محاولة للسيطرة عليها وان حاولت السيطرة فيكون بعد تردد",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 104,
              "mental_category_id": 4,
              "mental_question_id": 30,
              "answer": "استسلم كليا وبإرادتى للافكار الوسواسية كلها",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 31,
          "mental_category_id": 4,
          "question": "مقدار سيطرتك على الافكار الوسواسية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 105,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة تامة",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 106,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة كبيرة عادة يمكننى ان اوقف او اصرف انتباهى عن الوسواس عند بذل بعض الجهد والتركيز",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 107,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة متوسطة بعض الاحيان استطيع ايقاف او صرف انتباهي عن الوسواس",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 108,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "سيطرة قليلة نادرا ما انجح فى ايقاف الوسواس استطيع فقط صرف الانتباه وبصعوبة",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 109,
              "mental_category_id": 4,
              "mental_question_id": 31,
              "answer": "لا سيطرة نادرا ما استطيع صرف الانتباه عن الوساوس ولو للحظات قليلة",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 32,
          "mental_category_id": 4,
          "question": "مقدار الوقت الذي تمضيه فى القيام بالافعال القهرية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 110,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "لا شيء",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 111,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "اقل من ساعة فى اليوم او تقوم بالافعال احيانا ( لا تزيد عن 8 مرات فى اليوم )",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 112,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "من ساعة الى 3 ساعات في اليوم او تقوم بالافعال كثيرا (اكثر من 8 مرات فى اليوم ولكن معظم الساعات تخلو من الافعال القهرية)",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 113,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "اكثر من ثلاث ساعات فى اليوم اة تقوم بالافعال كثيرا جدا (اكثر من 8 مرات فى اليوم وخلال معظم ساعات اليوم )",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 114,
              "mental_category_id": 4,
              "mental_question_id": 32,
              "answer": "اكثر من 8 ساعات فى اليوم او تقوم بالافعال بشكل دائم (اكثر من ان تحصيها ونادرا ما تمر ساعة لا تقوم فيها بالافعال )",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 33,
          "mental_category_id": 4,
          "question": "مقدار التعارض الذي تحدثه الافعال القهرية فى نشاطاتك الاجتماعية والعملية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 115,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 116,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تعارض خفيف مع النشاطات الاجتماعية او العملية ولكن النشاط العام لا يتأثر",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 117,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تعارض واضح مع النشاطات الاجتماعية او العملية ولكن يمكن السيطره عليه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 118,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تسبب خللا كبيرا فى اداء النشاطات الاجتماعية او العملية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 119,
              "mental_category_id": 4,
              "mental_question_id": 33,
              "answer": "تسبب عجزا كبيرا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 34,
          "mental_category_id": 4,
          "question": "مقدار التوتر والقلق الناتج فى حال الامتناع عن القيام بالافعال القهرية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 120,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "لا يوجد",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 121,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "قلق بسيط عند الامتناع عن القيام بالافعال",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 122,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "يظهر القلق ولكن يمكن تحمله",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 123,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "قلق واضح ومزعج للغاية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 124,
              "mental_category_id": 4,
              "mental_question_id": 34,
              "answer": "قلق شديد يسبب عجزا بليغا",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 35,
          "mental_category_id": 4,
          "question": "مقدار الجهد المبذول فى مقاومة الافعال القهرية (بغض النظر عن مدي نجاحك فى المقاومة",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 125,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "ابذل جهدا حتى اقاوم دائما ( او ان الافعال القهرية قليلة بحيث لا حاجه للمقاومه)",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 126,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "احاول ان اقاوم معظم الوقت",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 127,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "اعمل بعض المحاولات للمقاومه",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 128,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "استسلم لكل الافعال القهرية بدون محاولة للسيطرة عليها وان حاولت السيطرة فيكون بعد تردد",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 129,
              "mental_category_id": 4,
              "mental_question_id": 35,
              "answer": "استسلم كلية وبإرادتى لكل الافعال القهرية",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        },
        {
          "id": 36,
          "mental_category_id": 4,
          "question": "مقدار سيطرتك على الافعال القهرية",
          "question_grade": 4,
          "header_title": null,
          "footer_title": null,
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z",
          "answers": [
            {
              "id": 130,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "سيطرة تامة",
              "selected": 0,
              "answer_grade": 0,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 131,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "عادة ما اوقف الافعال القهرية بصعوبة",
              "selected": 0,
              "answer_grade": 1,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 132,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "احيانا استطيع ايقاف الافعال القهرية بصعوبة",
              "selected": 0,
              "answer_grade": 2,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 133,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "استطيع بصعوبة ان اؤخر -فقط- الافعال القهرية لكن يجب على القيام بها حتى النهاية",
              "selected": 0,
              "answer_grade": 3,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            },
            {
              "id": 134,
              "mental_category_id": 4,
              "mental_question_id": 36,
              "answer": "نادرا ما استطيع ان اؤخر القيام بالافعال القهرية ولو للحظات",
              "selected": 0,
              "answer_grade": 4,
              "created_at": "2024-02-22T04:23:42.000000Z",
              "updated_at": "2024-02-22T04:23:42.000000Z"
            }
          ]
        }
      ],
      "results": [
        {
          "id": 16,
          "mental_category_id": 4,
          "start_percentage": 0,
          "end_percentage": 20,
          "result_note": "خفيف جدا",
          "title": " يظهر من خلال إجاباتك وجود وسواس خفيف جدا  ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 17,
          "mental_category_id": 4,
          "start_percentage": 20,
          "end_percentage": 40,
          "result_note": "خفيف",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس خفيف ",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 18,
          "mental_category_id": 4,
          "start_percentage": 40,
          "end_percentage": 60,
          "result_note": "متوسط",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس متوسط",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 19,
          "mental_category_id": 4,
          "start_percentage": 60,
          "end_percentage": 80,
          "result_note": "ملحوظ",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس ملحوظ",
          "sub_title": "صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك ",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        },
        {
          "id": 20,
          "mental_category_id": 4,
          "start_percentage": 80,
          "end_percentage": 100,
          "result_note": "شديد",
          "title": " يظهر من خلال إجاباتك علامات وجود وسواس شديد",
          "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
          "created_at": "2024-02-22T04:23:42.000000Z",
          "updated_at": "2024-02-22T04:23:42.000000Z"
        }
      ]
    }
  ]
};
export const mockCreateMentalHealthScale: ICreateMentalHealthScaleResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "mental_category_name": "مقياس اضطراب الاكتئاب",
    "percentage": 0.37037037037037035,
    "result_note": "اكتئاب بسيط",
    "title": " يظهر من خلال إجاباتك علامات اكتئاب بسيط",
    "sub_title": " صحتك النفسية تدعو للاطمئنان، وندعوك للاهتمام بزيادة الصحة النفسية من خلال: محاولة وضع روتين للأنشطة ولو قليلة كالرياضة وعادات الأكل المنتظمة. استقطاع أوقات للراحة خلال اليوم وخلال الأسبوع. التواصل مع المحيطين بك والتحدث معهم وإظهار مشاعرك. التزم بنظام غذائي صحي. أخذ قسط من النوم الكافي. الامتنان اليومي والامتنان للأمور التي تقوم بها والاستمتاع باللحظات من خلال التركيز على الحواس الخمس. نوع نشاطاتك الاجتماعية، شارك تطوع، جرب هواية بمفردك أو مع صديق. قد يكون شعور المتعة قليل حاول أن تستمر بممارسة هواياتك، تحدث مع صديق أو اطلب الجلسة مع مختص ونحن هنا في تلبينه لمساعدتك",
    "suggest_doctor": {
      "id": 2246,
      "full_name": "د عمر 904",
      "nick_name": "cvgvvbbb",
      "phone_no": "1126075904",
      "fcm_token": "d1rK7S9sQYqe3NRhetUa9A:APA91bHT3JVMZsddptH-WGPJx-rodIANEJz3w1zKVnkTCP3vQMJhA8Rnw88iJ6EsOf6K2n8tzopq8j_12aSyg7tULFlKX24A_sdxbiVpUveQ7PyXe0yyENA",
      "email": null,
      "email_verified_at": null,
      "bio": "hgggvccf",
      "original_gender": "ذكر",
      "gender": 0,
      "birth_date": "2007-03-09",
      "country": null,
      "nextAvailability": null,
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
      "image": null,
      "reviews_avg": 0,
      "price_half_hour": 200,
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
      "years_experience": 2,
      "license_number": "123456",
      "reservations_count": 0,
      "is_fav": false,
      "copouns": [],
      "packages": null,
      "programme": null,
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
        }
      ],
      "created_by": null,
      "active": 0,
      "created_at": "2025-03-04T08:37:45.000000Z",
      "badges": []
    },
    "created_at": "2025-06-15T13:00:49.000000Z",
    "icon": "https://talbinah.net/assets/images/not-found/no-article.svg"
  }
};

