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
