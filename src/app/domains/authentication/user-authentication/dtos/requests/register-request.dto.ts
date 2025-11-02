export interface IRegisterRequestDto {
  name: string;
  email?: string | null;
  gender: 'male' | 'female' | 'other'; // Adjust based on your backend enum/expectation
  password: string;
  phone_no: string;             // This is `data.phoneCode`
  country_id: string | number; // Assuming it's a phone code like "+1", or an ID like 1
  role: 'user' | 'admin';       // If other roles are allowed, extend the union type
  device_type: 'web' | 'ios' | 'android'; // 'web' here
  fcm_token: string | null;
  birth_date?: string | null; // Optional, in 'YYYY-MM-DD' format
}

