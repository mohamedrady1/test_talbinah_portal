export interface ImportantNumberItem {
    id: number;
    main_lang: string;
    translate_id: number | null;
    title: string;
    number: string;
    active: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ImportantNumbersResponse {
    status: boolean;
    message: string | null;
    data: ImportantNumberItem[];
} 