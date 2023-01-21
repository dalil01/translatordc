import path from "path";
import * as fs from "fs";
import { DefaultConfig } from "../constants/default-config";
import { CommandType } from "../types/command.type";
import { Logger } from "../../utils/logger";
import { ParsedCommandType } from "../types/parsed-command.type";

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
		
		return {
			config: { ...require(existedConfigFile), ...command }
		};
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