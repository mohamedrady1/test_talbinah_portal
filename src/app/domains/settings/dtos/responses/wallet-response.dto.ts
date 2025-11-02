export interface WalletUser {
    id: number;
    main_lang: string;
    translate_id: number | null;
    association_id: number | null;
    fcm_token: string;
    device_type: string;
    device_name: string;
    version_name: string;
    version_code: string;
    full_name: string;
    nick_name: string;
    country_id: number;
    phone_no: string;
    phone_verified_at: string;
    email: string | null;
    email_verified_at: string | null;
    activation_date: string | null;
    work_email: string;
    work_email_verified_at: string;
    remember_token: string | null;
    owned_code: string;
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
}

export interface WalletData {
    id: number;
    user: WalletUser;
    balance: number;
    count_movements: number;
}

export interface WalletResponse {
    status: boolean;
    message: string | null;
    data: WalletData;
} 