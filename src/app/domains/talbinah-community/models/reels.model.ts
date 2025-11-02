
export enum MediaType {
    Video = 'video',
    Image = 'image',
}

export interface ReelUser {
    name: string;
    avatar: string; // URL to the avatar image
    isFollowing: boolean;
}

export interface Reel {
    id: string;
    mediaType: MediaType;
    url: string; // URL to video or image
    duration?: number; // Duration in seconds, only for images (e.g., 5 seconds)
    description: string;
    user: ReelUser;
}

// --- New additions for Reactions ---
export enum ReelReactionType {
    None = 'none',
    Like = 'like',
    Love = 'love',
    Haha = 'haha',
    Wow = 'wow',
    Sad = 'sad',
    Angry = 'angry',
}

export interface Reaction {
    id: ReelReactionType;
    name: string; // e.g., "أعجبني", "أحببته"
    imageUrl: string; // URL to the reaction image/GIF
    // You might add a default SVG path if you want to render them directly
    // svgPath?: string;
}

// Define default reactions data for easy use
export const REACTION_TYPES: Reaction[] = [
    { id: ReelReactionType.Like, name: 'talbinahCommunity.reacts.like', imageUrl: 'images/community/reacts/heart.svg' },
    { id: ReelReactionType.Haha, name: 'talbinahCommunity.reacts.haha', imageUrl: 'images/community/reacts/laugh.svg' }, // Assuming 'laugh.svg' for Haha
    { id: ReelReactionType.Wow, name: 'talbinahCommunity.reacts.wow', imageUrl: 'images/community/reacts/wow.svg' },
    { id: ReelReactionType.Sad, name: 'talbinahCommunity.reacts.sad', imageUrl: 'images/community/reacts/sad.svg' },
    { id: ReelReactionType.Angry, name: 'talbinahCommunity.reacts.angry', imageUrl: 'images/community/reacts/angry.svg' },
];

export interface UserReelsData {
    userId: string;
    userName: string;
    userAvatar: string;
    reels: Reel[];
}