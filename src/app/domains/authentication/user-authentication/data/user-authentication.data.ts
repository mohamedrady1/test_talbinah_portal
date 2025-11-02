import { ILoginResponseDto, IRegisterResponseDto, ICheckNumberResponseDto, IMethodSelectionResponseDto, IResetPasswordResponseDto, IAsGuestResponseDto } from '../dtos';

export const mockAuthData = {
  checkNumberResponse: {
    "status": true,
    "message": "هذا الرقم موجود بالفعل",
    "data": {
      "user": true
    }
  } as ICheckNumberResponseDto,

  methodSelectionResponse: {
    status: true,
    message: 'Success',
    // data: {
    //   token: 'fake-jwt-token',
    //   user: {
    //     id: '1',
    //     name: 'John Doe',
    //     email: 'john@example.com',
    //     token: 'fake-jwt-token',
    //     isVerified: true,
    //     formattedPhoneNumber: '+201016221599',
    //     phoneNumber: '1016221599',
    //     countryCode: '+20'
    //   } as IUser
    // }
  } as IMethodSelectionResponseDto,

  otpVerificationResponse: {
    status: true,
    message: 'Success',
    data: null
    // data: {
    //   token: 'fake-jwt-token',
    //   user: {
    //     id: '1',
    //     name: 'John Doe',
    //     email: 'john@example.com',
    //     token: 'fake-jwt-token',
    //     isVerified: true,
    //     formattedPhoneNumber: '+201016221599',
    //     phoneNumber: '1016221599',
    //     countryCode: '+20'
    //   } as IUser
    // }
  } as IMethodSelectionResponseDto,

  loginResponse: {
    "status": true,
    "message": "auth.Logged in successfully",
    "data": {
      "token": "2097|TFNfsWomhLWdSWcIJYCRA0o5m7REYuIf05yRTgqm84b7e8a5",
      "user": {
        "id": 2191,
        "main_lang": "ar",
        "translate_id": null,
        "full_name": "عمر201",
        "nick_name": "عمر201",
        "phone_no": "1016221599",
        "bio": null,
        "original_gender": "ذكر",
        "gender": 0,
        "birth_date": "2006-10-18",
        "national_id": null,
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
        "role": "guest",
        "fcm_token": "dSJ5MQGoRzGY1v4DW2CaB2:APA91bHtSkBpUr84H7SxEX_6tmr6-S5aWh5YinP9fRVpqU1JFNbPvvllWw_mfTIoByglw6ifOkIxAX5VwhkTR_sxS70ChlmqfnMaGddblZY9uCvEplB0bPs",
        "email": null,
        "email_verified_at": null,
        "work_email": "omarali@talbinah.net",
        "work_email_verified_at": "2025-05-28 18:36:33",
        "original_active": "فعال",
        "active": 1,
        "referral_code": "TALBINAH-2191",
        "referral_code_points": 200,
        "device_type": "Android",
        "device_name": "CPH1911",
        "version_name": "2.2.51",
        "version_code": "241",
        "preferred_msg_channel": "both",
        "created_at": "2024-10-13T15:13:30.000000Z",
        "image": null
      },
      "device_data": {
        "ip": "string",
        "user_agent": "string"
      }
    }
  } as ILoginResponseDto,

  AsGuestRespons: {
    "status": true,
    "message": "auth.Logged in successfully",
    "data": {
      "token": "2097|TFNfsWomhLWdSWcIJYCRA0o5m7REYuIf05yRTgqm84b7e8a5",
      "user": {
        "id": 2191,
        "main_lang": "ar",
        "translate_id": null,
        "full_name": "عمر201",
        "nick_name": "عمر201",
        "phone_no": "1016221599",
        "bio": null,
        "original_gender": "ذكر",
        "gender": 0,
        "birth_date": "2006-10-18",
        "national_id": null,
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
        "role": "guest",
        "fcm_token": "dSJ5MQGoRzGY1v4DW2CaB2:APA91bHtSkBpUr84H7SxEX_6tmr6-S5aWh5YinP9fRVpqU1JFNbPvvllWw_mfTIoByglw6ifOkIxAX5VwhkTR_sxS70ChlmqfnMaGddblZY9uCvEplB0bPs",
        "email": null,
        "email_verified_at": null,
        "work_email": "omarali@talbinah.net",
        "work_email_verified_at": "2025-05-28 18:36:33",
        "original_active": "فعال",
        "active": 1,
        "referral_code": "TALBINAH-2191",
        "referral_code_points": 200,
        "device_type": "Android",
        "device_name": "CPH1911",
        "version_name": "2.2.51",
        "version_code": "241",
        "preferred_msg_channel": "both",
        "created_at": "2024-10-13T15:13:30.000000Z",
        "image": null
      },
      "device_data": {}
    }
  } as IAsGuestResponseDto,


  resetPasswordResponse: {
    "status": true,
    "message": "auth.Logged in successfully",
    "data": {
      "token": "2097|TFNfsWomhLWdSWcIJYCRA0o5m7REYuIf05yRTgqm84b7e8a5",
      "user": {
        "id": 2191,
        "main_lang": "ar",
        "translate_id": null,
        "full_name": "عمر201",
        "nick_name": "عمر201",
        "phone_no": "1016221599",
        "bio": null,
        "original_gender": "ذكر",
        "gender": 0,
        "birth_date": "2006-10-18",
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
        "fcm_token": "dSJ5MQGoRzGY1v4DW2CaB2:APA91bHtSkBpUr84H7SxEX_6tmr6-S5aWh5YinP9fRVpqU1JFNbPvvllWw_mfTIoByglw6ifOkIxAX5VwhkTR_sxS70ChlmqfnMaGddblZY9uCvEplB0bPs",
        "email": null,
        "email_verified_at": null,
        "work_email": "omarali@talbinah.net",
        "work_email_verified_at": "2025-05-28 18:36:33",
        "original_active": "فعال",
        "active": 1,
        "referral_code": "TALBINAH-2191",
        "referral_code_points": 200,
        "device_type": "Android",
        "device_name": "CPH1911",
        "version_name": "2.2.51",
        "version_code": "241",
        "preferred_msg_channel": "both",
        "created_at": "2024-10-13T15:13:30.000000Z",
        "image": null
      }
    }
  } as IResetPasswordResponseDto,

  registerResponse: {
    status: true,
    token: 'fake-register-token',
    user: {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      formattedPhoneNumber: '+201016221599',
      phoneNumber: '1016221599',
      countryCode: '+20'
    }
  } as IRegisterResponseDto
};
