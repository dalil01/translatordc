import path from "path";
import * as fs from "fs";
import { DefaultConfig } from "../constants/default-config";
import { CommandType } from "../types/command.type";
import { Logger } from "../../utils/logger";
import { ParsedCommandType } from "../types/parsed-command.type";
import { ConfigType } from "../types/config.type";

export class CommandParser {
	
	public parse(command: CommandType): ParsedCommandType | null {
		let existedConfigFile = this.findExistedConfigFile(command);
		
		if (!existedConfigFile) {
			Logger.error("Configuration file not found.");
			return null;
		}
		
		if (command.hasOwnProperty("saveConfig")) {
			const file = command.saveConfig;
			
			let isValidExt = false;
			for (const ext of DefaultConfig.defaultFileExtensions) {
				if (file.endsWith(ext)) {
					isValidExt = true;
				}
			}
			
			if (!isValidExt) {
				Logger.error("Invalid config file extension (required: \"" + DefaultConfig.defaultFileExtensions.join("\", \"") + "\").");
				return null;
			}
		}
		
		const parsedCommand: ConfigType = { ...require(existedConfigFile), ...command }
		
		if (command.hasOwnProperty("targetLanguages")) {
			parsedCommand.targetLanguages = command.targetLanguages.replaceAll(' ', '').split(',');
		}
		
		const outputOptions = {}
		
		if (command.hasOwnProperty("outputDir")) {
			outputOptions["dir"] = command.outputDir;
		}
		
		if (command.hasOwnProperty("multipleOutputFiles")) {
			outputOptions["multipleFiles"] = command.multipleOutputFiles;
		}
		
		if (command.hasOwnProperty("outputFilename")) {
			outputOptions["fileOptions"] = { name: command.outputFilename };
		}
		
		if (command.hasOwnProperty("outputFilenameByLanguages")) {
			const arr: {}[] = [];
			const fByLs = command.outputFilenameByLanguages.split(',');
			
			for (const fByL of fByLs) {
				const fByLSplit = fByL.split(':');
				if (fByLSplit.length == 2) {
					arr.push({ lang: fByLSplit[0], name: fByLSplit[1] });
				}
			}
			
			outputOptions["fileOptions"] = arr;
		}
	
		const translationApiObj = {};
		
		if (command.hasOwnProperty("translationApi")) {
			translationApiObj["translationApi"] = command.translationApi
		}
		
		if (command.hasOwnProperty("translationApiKey")) {
			translationApiObj["translationApiKey"] = command.translationApiKey
		}
		
		if (Object.keys(translationApiObj).length > 0) {
			outputOptions["translationAPI"] = translationApiObj;
		}
		
		if (command.hasOwnProperty("forceTranslation")) {
			outputOptions["forceTranslation"] = command.forceTranslation;
		}
		
		if (command.hasOwnProperty("keysNotToBeTranslated")) {
			outputOptions["keysNotToBeTranslated"] = [command.keysNotToBeTranslated];
		}
		
		if (Object.keys(outputOptions).length > 0) {
			parsedCommand.outputOptions = outputOptions;
		}
		
		console.log(parsedCommand);
		
		return { config: parsedCommand };
	}
	
	private findExistedConfigFile(command: CommandType): string | undefined {
		let existedConfigFile;
		let resolvedFilePath;
		
		if (command.hasOwnProperty('configFile')) {
			resolvedFilePath = path.resolve(command.configFile);
			if (fs.existsSync(resolvedFilePath)) {
				existedConfigFile = resolvedFilePath;
			}
		} else {
			for (const defaultFileName of DefaultConfig.defaultFileNames) {
				resolvedFilePath = path.resolve(defaultFileName);
				if (fs.existsSync(resolvedFilePath)) {
					existedConfigFile = resolvedFilePath;
					break;
				}
			}
		}
		
		return existedConfigFile;
	}
	
}