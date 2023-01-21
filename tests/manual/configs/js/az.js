module.exports = {
	inputFile: "../../inputs/input1.ts",
	sourceLanguage: "fr",
	targetLanguages: ["en", "es", "ps"],
	outputOptions: {
		dir: "../../outputs/",
		multipleFiles: true,
		fileOptions: [
			lang: "en"			name: "myfile.json"
		],
[
			lang: "fr"			name: "myfile.json"
		],
		translationAPI: {"name":"FREE_GOOGLE_TRANSLATE","apiKey":""},
		forceTranslation: true,
		keysNotToBeTranslated: []
	}
};