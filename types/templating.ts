export interface TemplatingOptions {
    repeat?: number
}

export interface TemplatingRequest {
    templatingOptions?: TemplatingOptions
    template: Record<string, unknown>
}
