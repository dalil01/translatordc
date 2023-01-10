import { ConfigType } from "../types/config.type";
import * as fs from "fs";
import path from "node:path";
import { Logger } from "../../utils/logger";
import { ParsedConfigType } from "../types/parsed-config.type";
import {Language} from "../constants/language";
import {OutputFileExtensions} from "../constants/output-file-extensions";
import {ParsedOutputOptionsType} from "../types/parsed-output-options.type";
import {DefaultConfig} from "../constants/default-config";

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

		if (!config.outputOptions) {
			return null;
		}

		const parsedOutputOptions = this.parseOutputOptions(config);
		if (!parsedOutputOptions) {
			return null;
		}

		return {
			translationKeys,
			inputFile: path.resolve(config.inputFile),
			sourceLanguage: config.sourceLanguage,
			targetLanguages: config.targetLanguages,
			languages:  [...new Set([config.sourceLanguage, ...config.targetLanguages])],
			outputOptions: parsedOutputOptions
		};
	}

	private parseOutputOptions(config: ConfigType): ParsedOutputOptionsType | null {
		if (!config.outputOptions) {
			return null;
		}

		const outputOptions = config.outputOptions;

		const defaultFilename = DefaultConfig.outputOptions.name + '.' + config.inputFile.split('.').at(-1);
		let fileOptions: any = { name: defaultFilename };

		const invalidFileOptionsMsg = "Invalid output file options."
		if (typeof outputOptions.fileOptions != "object") {
			Logger.error(invalidFileOptionsMsg);
			return null;
		}

		if (outputOptions.hasOwnProperty("fileOptions")) {
			let validFile = true;

			if (!outputOptions.fileOptions || (!Array.isArray(outputOptions.fileOptions) && !this.isValidOutputFile(outputOptions.fileOptions.name))) {
				validFile = false;
			} else if (Array.isArray(outputOptions.fileOptions)) {
				for (let i = 0; i < outputOptions.fileOptions.length; i++) {
					const obj = outputOptions.fileOptions[0];
					if (!obj.lang || !obj.name || !this.isValidLanguages([obj.lang]) || !this.isValidOutputFile(obj.name) || ![config.sourceLanguage, ...config.targetLanguages].includes(obj.lang)) {
						validFile = false;
						break;
					}
				}
			}

			if (!validFile) {
				Logger.error(invalidFileOptionsMsg);
				return null;
			} else {
				fileOptions = outputOptions.fileOptions;
			}
		}

		let dir;
		if (outputOptions.hasOwnProperty("fileOptions")) {
			dir = outputOptions.dir + (outputOptions.dir?.at(-1) != '/' ? '/' : '');
		} else {
			if (config.inputFile.includes('/')) {
				const inputFileSplit = config.inputFile.split('/');
				inputFileSplit.pop();
				dir = inputFileSplit.join('/');
			} else {
				dir = DefaultConfig.outputOptions.dir;
			}

			dir = path.resolve(dir);
			dir += (dir?.at(-1) != '/' ? '/' : '');
		}

		return {
			dir,
			multipleFiles: outputOptions.hasOwnProperty("multipleFiles") && outputOptions.multipleFiles ? outputOptions.multipleFiles : DefaultConfig.outputOptions.multipleFiles,
			defaultFilename,
			fileOptions,
			forceTranslation: outputOptions.hasOwnProperty("forceTranslation") ? outputOptions.forceTranslation : DefaultConfig.outputOptions.forceTranslation
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

	private isValidOutputFile(filename): boolean {
		let valid = false;

		const validExtensions = Object.values(OutputFileExtensions);
		for (let i = 0; i < validExtensions.length; i++) {
			if (filename.endsWith(validExtensions[i])) {
				valid = true;
				break;
			}
		}

		return valid;
	}

}