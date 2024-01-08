import { Paginator } from "./common/paginator";
import { Timestamp } from "@firebase/firestore";

export interface DownloadResponse {
    headings: string[];
    search_fields: string[];
    downloads: DownloadDoc[],
    translations: string;
    paginator: Paginator;
    categories: string[];
    search_url: string;
}

export interface DownloadDoc {
    title: string;
    category: string;
    download_url: string;
    file_name: string;
    format: string;
    created_at: Timestamp;
}

export interface DownloadMetadata {
    headings: string[];
    search_fields: string[];
    translations: string;
    categories: string[];
    search_url: string;
    paginator: Paginator;
}
