export interface Env {
    SMALL_MODEL?: string;
    MIDDLE_MODEL?: string;
    BIG_MODEL?: string;
}

export interface Config {
    smallModel: string | null;
    middleModel: string | null;
    bigModel: string | null;
}

export function getConfig(env: Env): Config {
    return {
        smallModel: env.SMALL_MODEL || null,
        middleModel: env.MIDDLE_MODEL || null,
        bigModel: env.BIG_MODEL || null,
    };
}