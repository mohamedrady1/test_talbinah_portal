import { Signal } from "@angular/core";
import { Tab } from "../components";
import { IPost } from "../dtos";

export interface ICommentBoxConfig extends IPost {
  avatarUrl: string;
  placeholder: string;
  readonlyOnClick?: boolean;
  isActions?: boolean;
}
