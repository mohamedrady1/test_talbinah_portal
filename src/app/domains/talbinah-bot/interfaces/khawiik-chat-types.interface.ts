import { ChatTypeEnum } from "../enums";

export interface IChatType {
  readonly id: ChatTypeEnum;
  readonly label: string;
  readonly icon: string;
  readonly isActive: boolean;
}

export interface IChatTypeConfig {
  readonly defaultType: ChatTypeEnum;
  readonly options: readonly IChatType[];
}
