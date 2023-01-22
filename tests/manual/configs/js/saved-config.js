module.exports = {
	inputFile: "../../inputs/input1.ts",
	sourceLanguage: "fr",
	targetLanguages: ["en"],
	outputOptions: {
		dir: "./",
		multipleFiles: true,
		fileOptions: [
			{ lang: "fr", name: "fr.output.ts" },

		],
		translationAPI: { name: "FREE_GOOGLE_TRANSLATE", apiKey: "" },
		forceTranslation: true,
		keysNotToBeTranslated: ["key3"]
	}
}