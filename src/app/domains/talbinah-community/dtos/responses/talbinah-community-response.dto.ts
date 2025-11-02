// Define base interfaces first (e.g., in a 'common/models' or 'domains/shared/models' directory)

/**
 * Interface for an Emoji object.
 */
export interface IEmoji {
  id: number;
  image: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for an Interest object.
 */
export interface IInterest {
  id: number;
  name: string;
  image: string;
  description?: string | null; // description can be null
  created_at: string;
  updated_at?: string; // updated_at might not always be present for interests nested in user
}

/**
 * Interface for the pivot object within is_liked.
 */
export interface IIsLikedPivot {
  post_id: number;
  react_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for the 'is_liked' reaction object.
 */
export interface IIsLikedReaction {
  id: number;
  image: string;
  label: string;
  created_at: string;
  updated_at: string;
  pivot: IIsLikedPivot;
}

/**
 * Interface for a Comment object within a Post.
 */
export interface ICommentPost {
  id: number;
  post_id: number;
  user_id: number;
  user: IUserCommunity;
  content: string;
  created_at: string;
  updated_at: string;
  reactions_count: number;
  is_liked: IIsLikedReaction | null; // is_liked can be an object or null
  replies?: any[]
}

/**
 * Interface for a User object within a Post.
 */
export interface IUserCommunity {
  id: number;
  dummy_name: string;
  is_followed?: boolean | number | null | undefined;
  emoji: IEmoji;
  interests: IInterest[];
  my_post_count?: number;
  my_following_count?: number;
  my_followers_count?: number;
  created_at: string;
}

/**
 * Interface for a single Post object.
 */
export interface IPost {
  id: number;
  user: IUserCommunity;
  interest: IInterest | null; // interest can be null
  content: string;
  image: string | null; // image can be null
  url: string | null; // url can be null
  comments_count: number | null;
  reactions_count: number | null;
  is_liked: IIsLikedReaction | null; // is_liked can be an object or null
  is_marked: boolean;
  bookmarks_count: number; // Added based on JSON
  comments: ICommentPost[]; // Added based on JSON
  is_followed: boolean | number | null | any; // Added based on JSON
  user_followed_count: number; // Added based on JSON
  created_at: string;
  marked_count?: number; // Kept as optional, though bookmarks_count seems to be the one in JSON
}

/**
 * Interface for the 'links' object in pagination (first, last, prev, next).
 */
export interface ILink {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

/**
 * Interface for a single link item within the 'meta.links' array.
 */
export interface IPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Interface for the 'meta' object in pagination.
 */
export interface IPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IPaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

/**
 * Interface for the 'data' field containing the posts array and pagination info.
 */
export interface IPostsData {
  data: IPost[];
  links: ILink;
  meta: IPaginationMeta;
}

/**
 * The top-level response DTO for all posts.
 */
export interface IAllPostsResponseDto {
  status: boolean;
  message: string | null;
  data: IPostsData;
}
