export interface TemplatingOptions {
    repeat?: number
    type?: string
    value?: unknown
}

export interface TemplatingRequest {
    options?: TemplatingOptions
    template: Record<string, unknown>
}
