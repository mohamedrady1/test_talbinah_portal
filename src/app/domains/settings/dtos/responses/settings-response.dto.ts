export interface ISettingMenuResponseDto {
  status: boolean;
  message: string | null;
  data: ISettingsMenuData;
}

export interface ISettingsMenuData {
  header_items: ISettingMenuItem[];
  profile: ISettingMenuItem[];
  support: ISettingMenuItem[];
  app: ISettingMenuItem[];
}

export interface ISettingMenuItem {
  id: number;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  second_color: string;
  action: string;
  page: string;
  link: string | null;
  order: number;
  new_tag_limit: string | null;
  type: string;
  user_type: string;
  location: string;
  visible: number;
  active: number;
  created_at: string;
  updated_at: string;
  sub_title?: string | number;
  new: boolean;
  soon: boolean;
}
