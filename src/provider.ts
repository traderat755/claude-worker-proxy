export interface Provider {
    convertToProviderRequest(request: Request, baseUrl: string, apiKey: string): Promise<Request>
    convertToClaudeResponse(providerResponse: Response): Promise<Response>
    countTokens(request: Request, baseUrl: string, apiKey: string): Promise<Response>
}
