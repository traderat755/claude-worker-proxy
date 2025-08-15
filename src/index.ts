import * as provider from './provider'
import * as gemini from './gemini'
import * as openai from './openai'
import { getConfig, Env } from './config'
import { ModelManager } from './model-manager'

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        try {
            return await handle(request, env)
        } catch (error) {
            console.error(error)
            return new Response('Internal server error', { status: 500 })
        }
    }
} satisfies ExportedHandler<Env>

async function handle(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
    }

    const url = new URL(request.url)
    const path = url.pathname

    // Direct Anthropic-style endpoint support for count_tokens
    // Example: POST /v1/messages/count_tokens with x-api-key header
    if (path === '/v1/messages/count_tokens') {
        const apiKey = request.headers.get('x-api-key')
        if (!apiKey) {
            return new Response('Missing x-api-key header', { status: 401 })
        }

        // Default to OpenAI provider for token counting
        const modelManager = new ModelManager(getConfig(env, 'openai'), 'openai')
        const openaiProvider = new openai.impl(modelManager)
        // baseUrl is unused by current countTokens implementation
        return await openaiProvider.countTokens(request.clone(), '', apiKey)
    }

    const isMessagesEndpoint = path.endsWith('/v1/messages')
    const isCountTokensEndpoint = path.endsWith('/v1/messages/count_tokens')

    if (!isMessagesEndpoint && !isCountTokensEndpoint) {
        return new Response('Path must end with /v1/messages or /v1/messages/count_tokens', { status: 404 })
    }

    const pathParts = path.split('/').filter(part => part !== '')

    const v1Index = pathParts.lastIndexOf('v1')
    if (v1Index === -1) {
        return new Response('Invalid path format. Expected: /{type}/{provider_url}/v1/...', { status: 400 })
    }

    const typeParam = pathParts[0]
    const providerUrlParts = pathParts.slice(1, v1Index)
    const baseUrl = providerUrlParts.join('/')

    if (!typeParam || !baseUrl) {
        return new Response('Missing type or provider_url in path', { status: 400 })
    }

    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
        return new Response('Missing x-api-key header', { status: 401 })
    }

    let provider: provider.Provider
    let modelManager: ModelManager
    switch (typeParam) {
        case 'gemini':
            modelManager = new ModelManager(getConfig(env, 'gemini'), 'gemini')
            provider = new gemini.impl(modelManager)
            break
        case 'openai':
            modelManager = new ModelManager(getConfig(env, 'openai'), 'openai')
            provider = new openai.impl(modelManager)
            break
        default:
            return new Response('Unsupported type', { status: 400 })
    }

    if (isMessagesEndpoint) {
        const providerRequest = await provider.convertToProviderRequest(request.clone(), baseUrl, apiKey)
        const providerResponse = await fetch(providerRequest)
        return await provider.convertToClaudeResponse(providerResponse)
    } else if (isCountTokensEndpoint) {
        return await provider.countTokens(request.clone(), baseUrl, apiKey)
    }

    return new Response('Internal server error', { status: 500 })
}

