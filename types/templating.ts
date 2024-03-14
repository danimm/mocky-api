export interface TemplatingOptions {
    repeat?: number
    type?: string
    value?: unknown
    oneOf?: Array<unknown>
    someOf?: Array<unknown>
}

export interface TemplatingRequest {
    options?: TemplatingOptions
    template: Record<string, unknown>
}
