import { Language } from "../constants/language";
import {TranslationAPI} from "../constants/translation-api";
import {OutputOptionsType} from "./output-options.type";

export type ConfigType = {
	inputFile: string; // Translation keys (enums, object) -> Ex : { KEY_1, key2 } or { key_1 = "value", key_2 = "value" }.
	sourceLanguage: Language;
	targetLanguages: Language[] | string[];
	outputOptions?: OutputOptionsType
}