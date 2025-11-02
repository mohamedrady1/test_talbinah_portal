export interface ICreatePostResponseDto {
    status: boolean;
    message: string;
    data: {
        user_id: number;
        content: string;
        image: string[]; // Assuming 'image' is an array of strings (URLs)
        url: string;
        updated_at: string; // ISO 8601 date string
        created_at: string; // ISO 8601 date string
        id: number;
    };
}
