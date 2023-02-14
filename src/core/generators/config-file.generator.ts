import { ConfigType } from "../types/config.type";
import * as fse from "fs-extra";
import { Logger } from "../../utils/logger";
import * as path from "path";
import { CommandType } from "../types/command.type";
import { ParsedConfigType } from "../types/parsed-config.type";
import * as fs from "fs";
import * as handlebars from "handlebars";

export class ConfigFileGenerator {

	// TODO : refactor

	public generate(command: CommandType, parsedConfig: ParsedConfigType): void {
		console.log(parsedConfig);

		let content = "";

		const isJs = command.saveConfig.endsWith(".js");
		if (isJs) {
			content += "module.exports = {";
		} else {
			content += '{';
		}

		/*
		content += "\n";
		
		content += "\t" + (!isJs ? "\"" : '') + "inputFile" + (!isJs ? "\"" : '') + ": \"" + config.inputFile + "\",\n" +
			"\t" + (!isJs ? "\"" : '') + "sourceLanguage" + (!isJs ? "\"" : '') + ": \"" + parsedConfig.sourceLanguage + "\",\n" +
			"\t" + (!isJs ? "\"" : '') + "targetLanguages" + (!isJs ? "\"" : '') + ": [\"" + parsedConfig.targetLanguages.join("\", \"") + "\"],\n" +
			"\t" + (!isJs ? "\"" : '') + "outputOptions" + (!isJs ? "\"" : '') + ": {\n" +
			"\t\t" + (!isJs ? "\"" : '') + "dir" + (!isJs ? "\"" : '') + ": \"" + parsedConfig.outputOptions.dir + "\",\n" +
			"\t\t" + (!isJs ? "\"" : '') + "multipleFiles" + (!isJs ? "\"" : '') + ": " + parsedConfig.outputOptions.multipleFiles + ",\n" +
			"\t\t" + (!isJs ? "\"" : '') + "fileOptions" + (!isJs ? "\"" : '') + ": "
		;
		
		if (Array.isArray(parsedConfig.outputOptions.fileOptions)) {
			content += "[\n";
			
			let i = 0;
			for (const object of parsedConfig.outputOptions.fileOptions) {
				if (i == 1) {
					content += ",\n";
				} else if (i == 0) {
					i++;
				}
				
				content += "\t\t\t{ ";
				
				let j = 0;
				for (const [key, value] of Object.entries(object)) {
					content += (!isJs ? "\"" : '') + key + (!isJs ? "\"" : '') + ": \"" + value + "\"";
					if (j == 0) {
						content += ", ";
						j++;
					}
				}
				
				content += " }";
			}
			
			content += "\n\t\t],\n";
		} else {
			content += "{ ";
			for (const [key, value] of Object.entries(parsedConfig.outputOptions.fileOptions)) {
				content += (!isJs ? "\"" : '') + key + (!isJs ? "\"" : '') + ": \"" + value + "\"";
			}
			content += " },\n"
		}
		
		content += "\t\t" + (!isJs ? "\"" : '') + "translationAPI" + (!isJs ? "\"" : '') + ": ";
		
		content += "{ ";
		
		let i = 0;
		for (const [key, value] of Object.entries(parsedConfig.outputOptions.translationAPI)) {
			content += (!isJs ? "\"" : '') + key + (!isJs ? "\"" : '') + ": \"" + value + "\"";
			if (i == 0) {
				content += ", ";
				i++
			}
		}
		
		console.log("fef", config?.outputOptions?.keysNotToBeTranslated)
		
		content += " },\n" +
			"\t\t" + (!isJs ? "\"" : '') + "forceTranslation" + (!isJs ? "\"" : '') + ": " + parsedConfig.outputOptions.forceTranslation + ",\n" +
			"\t\t" + (!isJs ? "\"" : '') + "keysNotToBeTranslated" + (!isJs ? "\"" : '') + ": " + (config?.outputOptions?.hasOwnProperty("keysNotToBeTranslated") ? JSON.stringify(config.outputOptions?.keysNotToBeTranslated) : "[]") + "\n" +
			"\t}"
		;
		
		content += "\n}";

		 */

		const templatesPath = "src/core/generators/templates/configs/";

		let configTemplate = handlebars.compile(
			fs.readFileSync(path.resolve(templatesPath + "config." + ((isJs) ? "js" : "json") + ".hbs"), "utf8")
		);

		const outputOptions = parsedConfig.outputOptions;

		const configTemplateData = {
			inputFile: parsedConfig.inputFile,
			sourceLanguage: parsedConfig.sourceLanguage,
			targetLanguages: parsedConfig.targetLanguages,
			outputOptions: {
				dir: outputOptions.dir,
				multipleFiles: outputOptions.multipleFiles,
				defaultFilename: outputOptions.defaultFilename,
				fileOptionsIsArray: Array.isArray(outputOptions.fileOptions),
				fileOptions: outputOptions.fileOptions,
				translationAPI: outputOptions.translationAPI,
				forceTranslation: outputOptions.forceTranslation,
				keysNotToBeTranslated: outputOptions.keysNotToBeTranslated
			}
		};

		fse.outputFile(path.resolve(command.saveConfig), configTemplate(configTemplateData))
			.then(() => {
				Logger.success("Generated parsedConfig file: " + command.saveConfig);
			})
			.catch(err => {
				Logger.error(err);
			});
	}

}