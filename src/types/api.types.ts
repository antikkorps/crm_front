export interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  includeAuth?: boolean
}
