export interface OpenAIEnv {
    OPENAI_SMALL_MODEL?: string
    OPENAI_MIDDLE_MODEL?: string
    OPENAI_BIG_MODEL?: string
}

export interface OpenAIConfig {
    smallModel: string | null
    middleModel: string | null
    bigModel: string | null
}

export function getOpenAIConfig(env: OpenAIEnv): OpenAIConfig {
    return {
        smallModel: env.OPENAI_SMALL_MODEL || null,
        middleModel: env.OPENAI_MIDDLE_MODEL || null,
        bigModel: env.OPENAI_BIG_MODEL || null
    }
}
