export interface IComment {
    id: number;
    author: string;
    avatarUrl: string;
    text: string;
    likes: number;
    replies: IComment[];
    since: number;
}
