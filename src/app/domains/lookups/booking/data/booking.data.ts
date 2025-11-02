import { ICommunicationsResponseDto, IDurationsResponseDto, ISpecialitiesResponseDto } from '../dtos';


export const mockSpecialitiesResponseData: ISpecialitiesResponseDto = {
  "status": true,
  "message": null,
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
    }
  ]
};

export const mockDurationsResponseData: IDurationsResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 5,
      "main_lang": "ar",
      "translate_id": null,
      "duration": 5,
      "active": 1,
      "price": 12,
      "original_active": "فعال",
      "created_at": "2024-06-13T07:58:13.000000Z"
    },
    {
      "id": 1,
      "main_lang": "ar",
      "translate_id": null,
      "duration": 15,
      "active": 1,
      "price": 12,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z"
    },
    {
      "id": 2,
      "main_lang": "ar",
      "translate_id": null,
      "duration": 30,
      "active": 1,
      "price": 12,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z"
    },
    {
      "id": 3,
      "main_lang": "ar",
      "translate_id": null,
      "duration": 45,
      "active": 1,
      "price": 12,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z"
    },
    {
      "id": 4,
      "main_lang": "ar",
      "translate_id": null,
      "duration": 60,
      "active": 1,
      "price": 12,
      "original_active": "فعال",
      "created_at": "2023-09-06T21:55:13.000000Z"
    }
  ]
};

export const mockCommunicationsResponseData: ICommunicationsResponseDto = {
  "status": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "main_lang": "ar",
      "translate_id": null,
      "name": "Messaging",
      "description": "Chat messages with doctor",
      "price": 10,
      "active": 1,
      "original_active": "Active",
      "created_at": "2023-05-30T10:41:33.000000Z"
    },
    {
      "id": 2,
      "main_lang": "ar",
      "translate_id": null,
      "name": "Voice Call",
      "description": "Voice Call with doctor",
      "price": 20,
      "active": 1,
      "original_active": "Active",
      "created_at": "2023-05-30T10:41:33.000000Z"
    },
    {
      "id": 3,
      "main_lang": "ar",
      "translate_id": null,
      "name": "Video Call",
      "description": "Video Call with doctor",
      "price": 30,
      "active": 1,
      "original_active": "Active",
      "created_at": "2023-05-30T10:41:33.000000Z"
    }
  ]
};

