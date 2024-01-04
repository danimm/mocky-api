import { Paginator } from "./common/paginator";
import { Timestamp } from "@firebase/firestore";

export interface Download {
    category: string;
    file_name: string;
    format: string;
    title: string;
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
