export interface GeminiEnv {
    GEMINI_SMALL_MODEL?: string
    GEMINI_MIDDLE_MODEL?: string
    GEMINI_BIG_MODEL?: string
}

export interface GeminiConfig {
    smallModel: string | null
    middleModel: string | null
    bigModel: string | null
}

export function getGeminiConfig(env: GeminiEnv): GeminiConfig {
    return {
        smallModel: env.GEMINI_SMALL_MODEL || null,
        middleModel: env.GEMINI_MIDDLE_MODEL || null,
        bigModel: env.GEMINI_BIG_MODEL || null
    }
}
