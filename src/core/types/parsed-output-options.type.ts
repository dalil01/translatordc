import {Language} from "../constants/language";

export type ParsedOutputOptionsType = {
    dir: string;
    multipleFiles: boolean;
    fileOptions: { name: string } | { lang: Language, name: string }[] // File extensions (.js | .ts | .json) | Ex: [{ lang: "en", filename: "en.output.ts" }].
    singleQuote: boolean;
};