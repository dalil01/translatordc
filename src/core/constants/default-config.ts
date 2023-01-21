import {TranslationAPI} from "./translation-api";

export const DefaultConfig = {
	defaultFileNames: ["translatordc.config.js", "translatordc.config.json"],
	outputOptions: {
		dir: "./",
		multipleFiles: false,
		name: "translated",
		translationAPI: {
			name: TranslationAPI.FREE_GOOGLE_TRANSLATE,
			apiKey: ''
		},
		forceTranslation: false,
		keysNotToBeTranslated: new Map()
	}
}