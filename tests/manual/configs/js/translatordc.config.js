const {Language} = require("../../../../src/core/constants/language");
const {TranslationAPI} = require("../../../../src/core/constants/translation-api");

module.exports = {
    inputFile: "../../inputs/input1.ts",
    sourceLanguage: Language.French,
    targetLanguages: [Language.English, 'es'],
    outputOptions: {
        dir: "../../outputs",
        multipleFiles: false,
        fileOptions: { name: "myfile.json" },
        translationAPI: {
            name: TranslationAPI.FREE_DEEPL,
            apiKey: ''
        },
        forceTranslation: true
    },


}