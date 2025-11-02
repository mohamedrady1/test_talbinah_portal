export interface IStoreUserMoodResponseDto {
  status: boolean;
  message: string | null;
  data?: { // The 'data' field is now explicitly defined
    id: number;
    main_lang: string;
    translate_id: number | null;
    association_id: number | null;
    fcm_token: string | null;
    device_type: string;
    device_name: string | null;
    version_name: string | null;
    version_code: string | null;
    full_name: string;
    nick_name: string | null;
    country_id: number;
    phone_no: string;
    phone_verified_at: string | null;
    email: string;
    email_verified_at: string | null;
    work_email: string | null;
    work_email_verified_at: string | null;
    remember_token: string | null;
    owned_code: string | null;
    referral_code: string | null;
    role: string;
    active: number;
    visible: number;
    created_by: string;
    last_seen: string;
    coupon_notify: number;
    preferred_msg_channel: string;
    created_at: string;
    updated_at: string;
    original_active: string;
    moods: { // This array seems to contain the specific mood that was just stored
      id: number;
      feelings: string;
      icon: string;
      color: string;
      created_at: string;
      updated_at: string;
      pivot: {
        user_id: number;
        mood_id: number;
        date: string;
      };
    }[]; // It's an array of mood objects
  };
}
