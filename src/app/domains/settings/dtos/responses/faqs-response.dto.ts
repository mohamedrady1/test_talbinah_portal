export interface FaqCategory {
    id: number;
    name: string;
    description: string;
    color: string;
    image: string | null;
    created_at: string;
    updated_at: string;
}

export interface FaqItem {
    id: number;
    faq_category_id: number;
    question: string;
    answer: string;
    file_type: string | null;
    thumbnail_image: string | null;
    file: string | null;
    order: number;
    status: number;
    type: string;
    created_at: string;
    updated_at: string;
    faq_category: FaqCategory;
}

export interface FaqsResponse {
    status: boolean;
    message: string | null;
    data: FaqItem[];
} 