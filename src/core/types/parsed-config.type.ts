import {Language} from "../constants/language";
import {ParsedOutputOptionsType} from "./parsed-output-options.type";

export type ParsedConfigType = {
	translationKeys: string[];
	languages: string[];
	inputFile: string;
	sourceLanguage: Language;
	targetLanguages: Language[] | string[];
	outputOptions: ParsedOutputOptionsType
};