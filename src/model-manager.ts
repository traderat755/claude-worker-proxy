import { Config } from './config'

export class ModelManager {
    private config: Config
    private providerType?: 'gemini' | 'openai'

    constructor(config: Config, providerType?: 'gemini' | 'openai') {
        this.config = config
        this.providerType = providerType
    }

    mapModel(claudeModel: string): string {
        const model = claudeModel.toLowerCase()

        // Haiku models -> small model
        if (model.includes('haiku')) {
            return this.config.smallModel || claudeModel
        }

        // Opus models -> big model
        if (model.includes('opus')) {
            return this.config.bigModel || claudeModel
        }

        // Sonnet models -> middle model
        if (model.includes('sonnet')) {
            return this.config.middleModel || claudeModel
        }

        // Default to original model if no mapping configured
        return claudeModel
    }
}
