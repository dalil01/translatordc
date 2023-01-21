module.exports = {
	inputFile: "../../inputs/input1.ts",
	sourceLanguage: "fr",
	targetLanguages: ["en", "es", "ps"],
	outputOptions: {
		dir: "../../outputs/",
		multipleFiles: true,
		fileOptions: [
			0: "[object Object]"]		translationAPI: {"name":"FREE_GOOGLE_TRANSLATE","apiKey":""},
		forceTranslation: true,
		keysNotToBeTranslated: []
	}
};