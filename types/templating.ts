export interface TemplatingOptions {
    repeat?: number
    type?: string
    value?: unknown
    oneOf?: Array<unknown>
    someOf?: Array<unknown>
    switchCase?: {
        check: unknown
        defaultCase: unknown
        cases: Array<{ match: unknown; value: unknown }>
    }
}

export interface TemplatingRequest {
    options?: TemplatingOptions
    template: Record<string, unknown>
}
