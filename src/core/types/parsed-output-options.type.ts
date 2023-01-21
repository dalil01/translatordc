import {Language} from "../constants/language";
import {TranslationAPI} from "../constants/translation-api";

export type ParsedOutputOptionsType = {
    dir: string;
    multipleFiles: boolean;
    defaultFilename: string;
    fileOptions: { name: string } | { lang: Language, name: string }[];
    translationAPI: {
        name: TranslationAPI;
        apiKey: string;
    };
    forceTranslation: boolean;
    keysNotToBeTranslated: Map<string, string[]>;
};