const {Language} = require("../../../../src/core/constants/language");
const {TranslationAPI} = require("../../../../src/core/constants/translation-api");

module.exports = {
    inputFile: "../../inputs/input1.ts",
    sourceLanguage: Language.French,
    targetLanguages: [Language.English, Language.Spanish, Language.Dutch, Language.ChineseSimplified],
    outputOptions: {
        dir: "../../outputs",
        multipleFiles: false,
        fileOptions: { name: "translated.ts" },
        translationAPI: {
            name: TranslationAPI.FREE_GOOGLE_TRANSLATE,
            apiKey: ''
        },
        forceTranslation: true,
    }
};