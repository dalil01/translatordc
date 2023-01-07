const {Language} = require("../../../../src/core/constants/language");

module.exports = {
    inputFile: "../../inputs/input1.ts",
    sourceLanguage: Language.French,
    targetLanguages: [Language.English, 'es'],
    outputOptions: {
        dir: "../../outputs",
        file: "output.ts",
    },


}