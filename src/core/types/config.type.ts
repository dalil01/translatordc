import { Language } from "../constants/language";
import {TranslationAPI} from "../constants/translation-api";

export type ConfigType = {
	inputFile: string; // Translation keys (enums, object) -> Ex : { KEY_1, key2 } or { key_1 = "value", key_2 = "value" }.
	sourceLanguage: Language;
	targetLanguages: Language[] | string[];
	outputOptions: {
		dir: string;
		filename?: string; // File extensions (.js | .ts | .json).
		multiple?: boolean;
		filenames?: { lang: string, filename: string }[] // If multiple is true -> Ex: [{ lang: "en", filename: "en.output.ts" }]
		singleQuote?: string; // true | false,
		translationAPI?: {
			name: TranslationAPI,

		};
		forceTranslation: boolean;
	}
}