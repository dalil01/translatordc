module.exports = {
	inputFile: "../../inputs/input1.ts",
	sourceLanguage: "fr",
	targetLanguages: ["en", "es", "ps"],
	outputOptions: {
		dir: "../../outputs/",
		multipleFiles: true,
		fileOptions: { name: "myfile.json" },
		translationAPI: { name: "FREE_GOOGLE_TRANSLATE", apiKey: "" },
		forceTranslation: true,
		keysNotToBeTranslated: []
	}
}