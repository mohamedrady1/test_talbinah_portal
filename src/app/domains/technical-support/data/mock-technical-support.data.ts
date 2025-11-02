import { IAssignToCustomersSupportResponseDto, IAssignToDepartmentResponseDto, ICloseSupportConversationResponseDto, ICreateNewConversationToDepartmentResponseDto, ITechnicalSupportChatResponseDto, ITechnicalSupportConversationDetailsResponseDto, IUserSupportConversationLogResponseDto } from "../dtos";
import { ICustomersSupportResponseDto, ITechnicalSupportDepartmentsResponseDto } from "../services";

export const mockTechnicalSupportListing: ITechnicalSupportChatResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 44,
      "department_id": {
        "id": 1,
        "title": "قسم الحالات الطارئة"
      },
      "user_id": {
        "id": 12523,
        "main_lang": "ar",
        "translate_id": null,
        "full_name": "إسلام عفيفي بركات",
        "nick_name": "إسلام عفيفي بركات",
        "phone_no": "1016221599",
        "bio": null,
        "original_gender": "ذكر",
        "gender": 0,
        "birth_date": "1996-10-10",
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
        "fcm_token": "fiBSDAm-SFqtZCY_UzjH6V:APA91bHojLrIzrPpvmfwO9RIKO07dzY2SbANgXjW4tVnANlTKVXlaYmbdAeCAhDZrDcAgNTktbfgLvZNVdIi_MBAQafB28L3GZLzApguYT2eUi8k9x85ldA",
        "fcm_token_web": null,
        "email": "eslamafifybarakat@gmail.com",
        "email_verified_at": null,
        "work_email": null,
        "work_email_verified_at": null,
        "original_active": "فعال",
        "active": 1,
        "referral_code": "TALBINAH-12523",
        "referral_code_points": 150,
        "device_type": "Android",
        "device_name": "SM-A546E",
        "version_name": "3.0.7",
        "version_code": "252",
        "preferred_msg_channel": "both",
        "created_at": "2025-07-14T07:21:25.000000Z",
        "image": null,
        "is_support": false,
        "department": null
      },
      "customer_support_user_id": null,
      "is_started": true,
      "is_closed": false,
      "queue": 0
    },
    {
      "id": 45,
      "department_id": {
        "id": 1,
        "title": "قسم الحالات الطارئة"
      },
      "user_id": {
        "id": 12523,
        "main_lang": "ar",
        "translate_id": null,
        "full_name": "إسلام عفيفي بركات",
        "nick_name": "إسلام عفيفي بركات",
        "phone_no": "1016221599",
        "bio": null,
        "original_gender": "ذكر",
        "gender": 0,
        "birth_date": "1996-10-10",
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
        "fcm_token": "fiBSDAm-SFqtZCY_UzjH6V:APA91bHojLrIzrPpvmfwO9RIKO07dzY2SbANgXjW4tVnANlTKVXlaYmbdAeCAhDZrDcAgNTktbfgLvZNVdIi_MBAQafB28L3GZLzApguYT2eUi8k9x85ldA",
        "fcm_token_web": null,
        "email": "eslamafifybarakat@gmail.com",
        "email_verified_at": null,
        "work_email": null,
        "work_email_verified_at": null,
        "original_active": "فعال",
        "active": 1,
        "referral_code": "TALBINAH-12523",
        "referral_code_points": 150,
        "device_type": "Android",
        "device_name": "SM-A546E",
        "version_name": "3.0.7",
        "version_code": "252",
        "preferred_msg_channel": "both",
        "created_at": "2025-07-14T07:21:25.000000Z",
        "image": null,
        "is_support": false,
        "department": null
      },
      "customer_support_user_id": null,
      "is_started": true,
      "is_closed": false,
      "queue": 0
    },
    {
      "id": 47,
      "department_id": {
        "id": 1,
        "title": "قسم الحالات الطارئة"
      },
      "user_id": {
        "id": 12523,
        "main_lang": "ar",
        "translate_id": null,
        "full_name": "إسلام عفيفي بركات",
        "nick_name": "إسلام عفيفي بركات",
        "phone_no": "1016221599",
        "bio": null,
        "original_gender": "ذكر",
        "gender": 0,
        "birth_date": "1996-10-10",
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
        "fcm_token": "fiBSDAm-SFqtZCY_UzjH6V:APA91bHojLrIzrPpvmfwO9RIKO07dzY2SbANgXjW4tVnANlTKVXlaYmbdAeCAhDZrDcAgNTktbfgLvZNVdIi_MBAQafB28L3GZLzApguYT2eUi8k9x85ldA",
        "fcm_token_web": null,
        "email": "eslamafifybarakat@gmail.com",
        "email_verified_at": null,
        "work_email": null,
        "work_email_verified_at": null,
        "original_active": "فعال",
        "active": 1,
        "referral_code": "TALBINAH-12523",
        "referral_code_points": 150,
        "device_type": "Android",
        "device_name": "SM-A546E",
        "version_name": "3.0.7",
        "version_code": "252",
        "preferred_msg_channel": "both",
        "created_at": "2025-07-14T07:21:25.000000Z",
        "image": null,
        "is_support": false,
        "department": null
      },
      "customer_support_user_id": null,
      "is_started": true,
      "is_closed": false,
      "queue": 0
    }
  ]
};

export const mockCustomersSupport: ICustomersSupportResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 2,
      "main_lang": "ar",
      "translate_id": null,
      "full_name": "ادمن",
      "nick_name": "admin",
      "phone_no": "1112115402",
      "bio": null,
      "original_gender": null,
      "gender": 0,
      "birth_date": "2000-01-01",
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
      "fcm_token": "cRxB1x6BSG6YBPsA6E85t4:APA91bGia9gFuuzsCJR__8WCS192NE2hdx-_CioPKWlZlbpbzUVEtpP9h75cHalrEMdEQentj2FXAEwfUbv4HaD2lop7CIAZGoe1dxVr2Zy9SVmY22cxxMs",
      "fcm_token_web": null,
      "email": "admin@gmail.com",
      "email_verified_at": null,
      "work_email": null,
      "work_email_verified_at": null,
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-2",
      "referral_code_points": 200,
      "device_type": "Android",
      "device_name": "iPhone12,5",
      "version_name": "3.0.6",
      "version_code": "251",
      "preferred_msg_channel": "both",
      "created_at": "2023-09-06T21:55:12.000000Z",
      "image": null,
      "is_support": true,
      "department": "قسم المشكلات التقنية",
      "points_count": 0
    },
    {
      "id": 3,
      "main_lang": "ar",
      "translate_id": null,
      "full_name": "eng-alaa",
      "nick_name": "eng-alaa",
      "phone_no": "20222222258282",
      "bio": null,
      "original_gender": "أنثى",
      "gender": 1,
      "birth_date": "1995-06-09",
      "national_id": null,
      "verify_national_id": 0,
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
      "fcm_token_web": null,
      "email": "alaabadra44@gmail.com",
      "email_verified_at": null,
      "work_email": null,
      "work_email_verified_at": null,
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-3",
      "referral_code_points": 200,
      "device_type": null,
      "device_name": null,
      "version_name": null,
      "version_code": null,
      "preferred_msg_channel": "both",
      "created_at": "2023-09-06T21:55:12.000000Z",
      "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/profiles-images/image_picker_13A4A065-CE04-4DB4-90CE-642F8EC82D24-677-0000003549F2EA81_1694624799.png",
      "is_support": true,
      "department": "قسم الحالات الطارئة",
      "points_count": 0
    }
  ]
};

export const mockTechnicalSupportDepartments: ITechnicalSupportDepartmentsResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "title": "قسم الحالات الطارئة"
    },
    {
      "id": 2,
      "title": "قسم المشكلات التقنية"
    },
    {
      "id": 3,
      "title": "قسم مشكلات الخدمات النفسية"
    },
    {
      "id": 4,
      "title": "قسم الملاحظات والتحسينات"
    },
    {
      "id": 5,
      "title": "قسم المالية"
    },
    {
      "id": 6,
      "title": "قسم المحتوى الحساس"
    }
  ]
};

export const mockassignToDepartment: IAssignToDepartmentResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "id": 1,
    "department_id": {
      "id": 1,
      "title": "قسم الحالات الطارئة"
    },
    "user_id": {
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
      "fcm_token": "evoVj8sCm-6EeQXXRS_0AL:APA91bFK9ac7IJ5tsh7vT-r8TKZ_cVeC30Moa8yQZrMiuDPu5ugMasWuYq2aewRkkmkKw4jtKww6jBbx5rHFkIFMsxT-pXwTwejIcaH8-5VWP1lak-ATBl4",
      "fcm_token_web": null,
      "email": "alaarsm@gmail.com",
      "email_verified_at": null,
      "work_email": "eafify@talbinah.net",
      "work_email_verified_at": "2025-07-22 09:21:23",
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-949",
      "referral_code_points": 200,
      "device_type": "web",
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
    "customer_support_user_id": null,
    "is_started": true,
    "is_closed": true,
    "queue": 0
  }
};

export const mockAssignToCustomerSupport: IAssignToCustomersSupportResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "id": 1,
    "department_id": {
      "id": 1,
      "title": "قسم الحالات الطارئة"
    },
    "user_id": {
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
      "fcm_token": "evoVj8sCm-6EeQXXRS_0AL:APA91bFK9ac7IJ5tsh7vT-r8TKZ_cVeC30Moa8yQZrMiuDPu5ugMasWuYq2aewRkkmkKw4jtKww6jBbx5rHFkIFMsxT-pXwTwejIcaH8-5VWP1lak-ATBl4",
      "fcm_token_web": null,
      "email": "alaarsm@gmail.com",
      "email_verified_at": null,
      "work_email": "eafify@talbinah.net",
      "work_email_verified_at": "2025-07-22 09:21:23",
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-949",
      "referral_code_points": 200,
      "device_type": "web",
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
    "customer_support_user_id": null,
    "is_started": true,
    "is_closed": true,
    "queue": 0
  }
};

export const mockcloseSupportConversation: ICloseSupportConversationResponseDto = {
  "status": true,
  "message": "تمت العملية بنجاح",
  "data": {
    "id": 1,
    "department_id": {
      "id": 1,
      "title": "قسم الحالات الطارئة"
    },
    "user_id": {
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
      "fcm_token": "evoVj8sCm-6EeQXXRS_0AL:APA91bFK9ac7IJ5tsh7vT-r8TKZ_cVeC30Moa8yQZrMiuDPu5ugMasWuYq2aewRkkmkKw4jtKww6jBbx5rHFkIFMsxT-pXwTwejIcaH8-5VWP1lak-ATBl4",
      "fcm_token_web": null,
      "email": "alaarsm@gmail.com",
      "email_verified_at": null,
      "work_email": "eafify@talbinah.net",
      "work_email_verified_at": "2025-07-22 09:21:23",
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-949",
      "referral_code_points": 200,
      "device_type": "web",
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
    "customer_support_user_id": null,
    "is_started": true,
    "is_closed": true,
    "queue": 0
  }
};

export const mockNewConversationToDepartment: ICreateNewConversationToDepartmentResponseDto = {
  "status": true,
  "message": null,
  "data": null
};
export const mockTechnicalSupportConversationDetails: ITechnicalSupportConversationDetailsResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 44,
    "department_id": {
      "id": 1,
      "title": "قسم الحالات الطارئة"
    },
    "user_id": {
      "id": 12523,
      "main_lang": "ar",
      "translate_id": null,
      "full_name": "إسلام عفيفي بركات",
      "nick_name": "إسلام عفيفي بركات",
      "phone_no": "1016221599",
      "bio": null,
      "original_gender": "ذكر",
      "gender": 0,
      "birth_date": "1996-10-10",
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
      "fcm_token": "fiBSDAm-SFqtZCY_UzjH6V:APA91bHojLrIzrPpvmfwO9RIKO07dzY2SbANgXjW4tVnANlTKVXlaYmbdAeCAhDZrDcAgNTktbfgLvZNVdIi_MBAQafB28L3GZLzApguYT2eUi8k9x85ldA",
      "fcm_token_web": null,
      "email": "eslamafifybarakat@gmail.com",
      "email_verified_at": null,
      "work_email": null,
      "work_email_verified_at": null,
      "original_active": "فعال",
      "active": 1,
      "referral_code": "TALBINAH-12523",
      "referral_code_points": 150,
      "device_type": "Android",
      "device_name": "SM-A546E",
      "version_name": "3.0.7",
      "version_code": "252",
      "preferred_msg_channel": "both",
      "created_at": "2025-07-14T07:21:25.000000Z",
      "image": null,
      "is_support": false,
      "department": null
    },
    "customer_support_user_id": null,
    "is_started": true,
    "is_closed": false,
    "queue": 0
  }
};

export const mockUserSupportConversationLog: IUserSupportConversationLogResponseDto = {
  "status": true,
  "message": null,
  "data": null
};

