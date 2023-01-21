import { ConfigType } from "../types/config.type";
import * as fse from "fs-extra";
import { Logger } from "../../utils/logger";
import * as path from "path";
import { CommandType } from "../types/command.type";
import { ParsedConfigType } from "../types/parsed-config.type";

export class ConfigFileGenerator {
	
	public generate(command: CommandType, config: ConfigType, parsedConfig: ParsedConfigType): void {
		//console.log(config);
		
		let content = "";
		
		if (command.saveConfig.endsWith(".js")) {
			content += "module.exports = {";
		} else {
			content += '{';
		}
		
		content += "\n";
		
		content += "\tinputFile: \"" + config.inputFile + "\",\n" +
			"\tsourceLanguage: \"" + parsedConfig.sourceLanguage + "\",\n" +
			"\ttargetLanguages: [\"" + parsedConfig.targetLanguages.join("\", \"") + "\"],\n" +
			"\toutputOptions: {\n" +
			"\t\tdir: \"" + parsedConfig.outputOptions.dir + "\",\n" +
			"\t\tmultipleFiles: " + parsedConfig.outputOptions.multipleFiles + ",\n" +
			"\t\tfileOptions: "
		;
		
		if (Array.isArray(parsedConfig.outputOptions.fileOptions)) {
			content += "[\n";
			
			let i = 0;
			for (const object of parsedConfig.outputOptions.fileOptions) {
				content += "\t\t\t{ ";
				
				let j = 0;
				for (const [key, value] of Object.entries(object)) {
					content += key + ": \"" + value + "\"";
					if (j == 0) {
						content += ", ";
						j++;
					}
				}
				
				content += " }";
				
				if (i == 0) {
					content += ",\n";
					i++;
				}
			}
			
			content += "\n\t\t],\n";
		} else {
			content += "{ ";
			for (const [key, value] of Object.entries(parsedConfig.outputOptions.fileOptions)) {
				content += key + ": \"" + value + "\"";
			}
			content += " },\n"
		}
		
		content += "\t\ttranslationAPI: ";
		
		content += "{ ";
		
		let i = 0;
		for (const [key, value] of Object.entries(parsedConfig.outputOptions.translationAPI)) {
			content += key + ": \"" + value + "\"";
			if (i == 0) {
				content += ", ";
				i++
			}
		}
		
		content += " },\n" +
			"\t\tforceTranslation: " + parsedConfig.outputOptions.forceTranslation + ",\n" +
			"\t\tkeysNotToBeTranslated: " + (config?.outputOptions?.hasOwnProperty("keysNotToBeTranslated") ? config.outputOptions?.keysNotToBeTranslated : "[]") + "\n" +
			"\t}"
		;
		
		content += "\n};";
		
		fse.outputFile(path.resolve(command.saveConfig), content)
		.then(() => {
			Logger.success("Generated parsedConfig file: " + command.saveConfig);
		})
		.catch(err => {
			Logger.error(err);
		});
	}
	
}