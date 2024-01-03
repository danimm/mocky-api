import { Paginator } from "./common/paginator";

export interface Download {
    category: string;
    file_name: string;
    format: string;
    title: string;
}

export interface DownloadDoc {
    name: string;
    headings: string[];
    search_fields: string[];
    downloads: Download[];
}

export interface DownloadMetadata {
    headings: string[];
    search_fields: string[];
    translations: string;
    categories: string[];
    search_url: string;
    pagination: Paginator;
}
