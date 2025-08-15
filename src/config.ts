export interface Env {
    // Original config for backward compatibility
    SMALL_MODEL?: string
    MIDDLE_MODEL?: string
    BIG_MODEL?: string

    // Gemini specific configs
    GEMINI_SMALL_MODEL?: string
    GEMINI_MIDDLE_MODEL?: string
    GEMINI_BIG_MODEL?: string

    // OpenAI specific configs
    OPENAI_SMALL_MODEL?: string
    OPENAI_MIDDLE_MODEL?: string
    OPENAI_BIG_MODEL?: string
}

export interface Config {
    smallModel: string | null
    middleModel: string | null
    bigModel: string | null
}

export function getConfig(env: Env, providerType?: 'gemini' | 'openai'): Config {
    if (providerType === 'gemini') {
        return {
            smallModel: env.GEMINI_SMALL_MODEL || env.SMALL_MODEL || null,
            middleModel: env.GEMINI_MIDDLE_MODEL || env.MIDDLE_MODEL || null,
            bigModel: env.GEMINI_BIG_MODEL || env.BIG_MODEL || null
        }
    } else if (providerType === 'openai') {
        return {
            smallModel: env.OPENAI_SMALL_MODEL || env.SMALL_MODEL || null,
            middleModel: env.OPENAI_MIDDLE_MODEL || env.MIDDLE_MODEL || null,
            bigModel: env.OPENAI_BIG_MODEL || env.BIG_MODEL || null
        }
    } else {
        return {
            smallModel: env.SMALL_MODEL || null,
            middleModel: env.MIDDLE_MODEL || null,
            bigModel: env.BIG_MODEL || null
        }
    }
}
