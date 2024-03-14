export interface TemplatingOptions {
    repeat?: number
    type?: string
    value?: unknown
}

export interface TemplatingRequest {
    templatingOptions?: TemplatingOptions
    template: Record<string, unknown>
}
