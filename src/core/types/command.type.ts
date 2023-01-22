export type CommandType = {
	configFile: string,
	inputFile: string,
	sourceLanguage: string,
	targetLanguages: string, // Ex : es,fr,sp
	outputDir: string,
	multipleOutputFiles: boolean,
	outputFilename: string,
	outputFilenameByLanguages: string,
	translationApi: string,
	translationApiKey: string,
	forceTranslation: boolean,
	keysNotToBeTranslated: string,
	saveConfig: string
}