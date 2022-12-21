import { ConfigType } from "../types/config.type";
import * as fs from "fs";
import path from "node:path";
import { Logger } from "../utils/logger";
import { ParsedConfigType } from "../types/parsed-config.type";

export class ConfigParser {

	public parse(config: ConfigType): ParsedConfigType | null {
		console.log(config);
		
		if (!config.translationKeysFile || !fs.existsSync(path.resolve(config.translationKeysFile))) {
			Logger.error("Input file not found.");
			return null;
		}
		
		const translationKeys = this.findTranslationKeys(path.resolve(config.translationKeysFile));
		if (!translationKeys) {
			Logger.error("The content of your translation keys file is not in expected format.");
			return null;
		}
		
		if (translationKeys.length === 0) {
			return null;
		}
		
		console.log(translationKeys);
		
		return {
			translationKeys
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
	
}