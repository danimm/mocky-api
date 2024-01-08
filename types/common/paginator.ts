export interface Paginator {
    "count": number;
    "num_pages": number;
    "per_page": number;
    "has_next": boolean;
    "current_page": string;
    "load_more": URL;
    "translations": string;
}
