import { IArticle, IDoctor, IPodcast, IResponseList } from "../../models";

export interface ITalbinahBotResponseDto {
  message: string;
  replay: string;
  message_timestamp: string;
  replay_timestamp: string;
  list?: IResponseList<IDoctor | IPodcast | IArticle>;
  status: boolean;
}
