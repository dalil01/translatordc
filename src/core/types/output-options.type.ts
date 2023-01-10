import {Language} from "../constants/language";

export type OutputOptionsType = {
    dir?: string;
    multipleFiles?: boolean;
    fileOptions?: { name: string } | { lang: Language, name: string }[] // File extensions (.js | .ts | .json) | Ex: [{ lang: "en", filename: "en.output.ts" }].
    /*translationAPI?: {
        name: TranslationAPI,

    };*/
    forceTranslation: boolean;
};