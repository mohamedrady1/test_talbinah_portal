export interface IChangePasswordRequestDto {
  old_password: string;
  new_password: string;
  confirmation_new_password: string;
}
