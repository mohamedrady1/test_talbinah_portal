export interface IIdentityFormSubmissionRequestDto {
  dummy_name: string;
  emoji_id: string | number | null;
  interest_id: string | number[];
}

export interface IUpdateUserIdentifyProfileRequestDto {
  dummy_name: string;
  emoji_id: string | number | null;
  interest_id: string | number[];
}
