import { ConfigType } from "../types/config.type";
import * as fs from "fs";
import path from "node:path";
import { Logger } from "../utils/logger";
import { ParsedConfigType } from "../types/parsed-config.type";
import {Language} from "../constants/language";
import {OutputFileExtensions} from "../constants/output-file-extensions";

export class ConfigParser {

	public parse(config: ConfigType): ParsedConfigType | null {
		if (!config.inputFile || !fs.existsSync(path.resolve(config.inputFile))) {
			Logger.error("Input file not found.");
			return null;
		}

		const translationKeys = this.findTranslationKeys(path.resolve(config.inputFile));
		if (!translationKeys) {
			Logger.error("The content of your translation keys file is not in expected format.");
			return null;
		}
		
		if (translationKeys.length === 0) {
			return null;
		}

		if (!config.sourceLanguage || !this.isValidLanguages([config.sourceLanguage])) {
			Logger.error("Invalid source language.");
			return null;
		}

		if (!config.targetLanguages || !this.isValidLanguages(config.targetLanguages)) {
			Logger.error("Invalid target Languages.");
			return null;
		}

		if (config.targetLanguages.length === 0) {
			return null;
		}

		if (!config.outputFile || !this.isValidOutputFile(config.outputFile)) {
			Logger.error("Invalid output file.");
			return null;
		}

		return {
			translationKeys,
			inputFile: path.resolve(config.inputFile),
			sourceLanguage: config.sourceLanguage,
			targetLanguages: config.targetLanguages,
			outputFile: path.resolve(config.outputFile),
			singleQuote: config.singleQuote
		};
	}
	
	private findTranslationKeys(filePath: string): string[] | null {
		const inputFileStr = fs.readFileSync(filePath, "utf8").toString().trim();
		
		if (inputFileStr.length === 0 || !inputFileStr.includes('{') && inputFileStr.at(-1) !== '}') {
			return null;
		}
		
		const keys: string[] = [];
		const values = inputFileStr.substring(inputFileStr.indexOf('{') + 1, inputFileStr.indexOf('}')).split(',');
		
		for (const value of values) {
			const key = value.split(/:|=/)[0].trim();
			if (key.length > 0) {
				keys.push(key);
			}
		}
		
		return keys;
	}

	private isValidLanguages(languages: Language[] | string[]): boolean {
		let valid = true;

		const validLanguages = Object.values(Language);
		for (let i = 0; i < languages.length; i++) {
			valid = validLanguages.includes(languages[i] as Language);
		}

		return valid;
	}

	private isValidOutputFile(file): boolean {
		let valid = false;

		const validExtensions = Object.values(OutputFileExtensions);
		for (let i = 0; i < validExtensions.length; i++) {
			if (file.endsWith(validExtensions[i])) {
				valid = true;
				break;
			}
		}

		return valid;
	}

}