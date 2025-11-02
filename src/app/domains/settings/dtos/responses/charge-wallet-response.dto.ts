export interface IChargeWalletResponseDto {
  status: boolean;
  message: string | null;
  data: {
    url: string;
    wallet: {
      id: number;
      user_id: number;
      balance: number;
      active: number;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
      original_active: string;
    };
  };
}
