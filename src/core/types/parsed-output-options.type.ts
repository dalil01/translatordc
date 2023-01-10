import {Language} from "../constants/language";
import {TranslationAPI} from "../constants/translation-api";

export type ParsedOutputOptionsType = {
    dir: string;
    multipleFiles: boolean;
    defaultFilename: string;
    fileOptions: { name: string } | { lang: Language, name: string }[] // File extensions (.js | .ts | .json) | Ex: [{ lang: "en", filename: "en.output.ts" }].
    translationAPI: {
        name: TranslationAPI;
        apiKey: string;
    };
    forceTranslation: boolean;
};