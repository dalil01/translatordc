import { Language } from "../constants/language";

export type ConfigType = {
	inputFile: string; // Translation keys (enums, object) -> Ex : { KEY_1, key2 } or { key_1 = "value", key_2 = "value" }.
	sourceLanguage: Language;
	targetLanguages: Language[] | string[];
	outputFile: string; // File extensions (.js | .ts | .json).
	translationAPI?: {
		name: "google",

	};


}