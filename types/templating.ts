export interface TemplatingOptions {
    repeat?: number
}

export interface TemplatingRequest {
    templatingOptions?: TemplatingOptions
    query: Record<string, unknown>
}
