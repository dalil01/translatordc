const {Language} = require("../../../../src/core/constants/language");
const {TranslationAPI} = require("../../../../src/core/constants/translation-api");

module.exports = {
    inputFile: "../../inputs/input1.ts",
    sourceLanguage: Language.French,
    targetLanguages: [],
    outputOptions: {
        dir: "../../outputs",
        multipleFiles: true,
        fileOptions: { name: "myfile.js" },
        translationAPI: {
            name: TranslationAPI.FREE_GOOGLE_TRANSLATE,
            apiKey: ''
        },
        forceTranslation: true,
    }
};