import path from "path";
import * as fs from "fs";
import { DefaultConfig } from "../constants/default-config";
import { CommandType } from "../types/command.type";
import { Logger } from "../utils/logger";

export class CommandParser {
	
	public parse(command: CommandType): CommandType | null {
		let existedConfigFile;
		
		if (command.hasOwnProperty('configFile')) {
			const resolvedFilePath = path.resolve(command.configFile);
			if (fs.existsSync(resolvedFilePath)) {
				existedConfigFile = resolvedFilePath;
			}
		} else {
			for (const defaultFileName of DefaultConfig.defaultFileNames) {
				const resolvedFilePath = path.resolve(defaultFileName);
				if (fs.existsSync(resolvedFilePath)) {
					existedConfigFile = resolvedFilePath;
					break;
				}
			}
		}
		
		if (!existedConfigFile) {
			Logger.error("Config file not found.");
			return null;
		}
		
		return {
			configFile: existedConfigFile,
			config: { ...require(existedConfigFile), ...command }
		};
	}
	
}