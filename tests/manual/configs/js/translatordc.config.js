const {Language} = require("../../../../src/core/constants/language");
const {TranslationAPI} = require("../../../../src/core/constants/translation-api");

module.exports = {
    inputFile: "../../inputs/input1.ts",
    sourceLanguage: Language.French,
    targetLanguages: [Language.English, 'es', Language.Pashto],
    outputOptions: {
        dir: "../../outputs",
        multipleFiles: true,
        fileOptions: [{ lang: "en", name: "myfile.json" }],
        translationAPI: {
            name: TranslationAPI.FREE_GOOGLE_TRANSLATE,
            apiKey: ''
        },
        forceTranslation: true,
    }
};