import { Languages } from "../constants/languages";

export type ConfigType = {
	translationKeysFile: string; // Translation keys (enums, object) -> Ex : { KEY_1, key2 } or { key_1 = "value", key_2 = "value" }.
	outputDir?: string;
	sourceLanguage: Languages;
	targetLanguages: Languages[] | string[];
	
	
	
}