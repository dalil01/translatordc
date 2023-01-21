import {ParsedConfigType} from "../types/parsed-config.type";
import * as fse from "fs-extra";
import {Logger} from "../../utils/logger";
import * as path from "path";
import {OutputFileExtensions} from "../constants/output-file-extensions";
import * as fs from "fs";
import {Language} from "../constants/language";
import {ParsedOutputOptionsType} from "../types/parsed-output-options.type";
import {Translator} from "../translators/translator";

export class OutputFileGenerator {

	private languageByValueByKey: Map<string, Map<string, string>> = new Map();
	private notTranslatedLanguageByValueByKey: Map<string, Map<string, string>> = new Map();

	private translator: Translator = new Translator();

	public generate(config: ParsedConfigType): void {
		console.log(config);

		const outputOptions = config.outputOptions;
		const languagesByFilename: Map<string, string[]> = this.findLanguagesByFilename(outputOptions, config.languages);
		//console.log(languagesByFilename);

		const generatedFiles: Set<string> = new Set();

		this.autoSetLanguageByValueByKey(languagesByFilename, outputOptions.dir);
		//console.log(this.languageByValueByKey);

		this.applyTranslations(config.sourceLanguage, outputOptions).then(() => {
			//console.log(this.languageByValueByKey);

			for (const [filename, languages] of languagesByFilename) {

				const isJSON = filename.endsWith(OutputFileExtensions.JSON);

				let content = '';

				if (filename.endsWith(OutputFileExtensions.TS) || filename.endsWith(OutputFileExtensions.JS)) {
					content += "export const " + filename.split('/').at(-1)?.split('.').at(0) + " = {";
				} else if (isJSON) {
					content += '{';
				}

				content += "\n";

				for (let i = 0; i < config.translationKeys.length; i++) {
					const key = config.translationKeys.at(i);

					content += "\t" + (isJSON ? "\"" : '') + key + (isJSON ? "\"" : '') + ": ";

					if (languages.length == 1) {
						// @ts-ignore
						content += "\"";

						// @ts-ignore
						const valueByLanguage = this.languageByValueByKey.get(key);
						if (valueByLanguage) {
							content += (valueByLanguage.get(languages[0]) || '');
						}

						content += "\"";
					} else if (languages.length > 1) {
						content += "{\n";

						for (let j = 0; j < languages.length; j++) {
							content += "\t".repeat(2) + (isJSON ? "\"" : '') + languages.at(j) + (isJSON ? "\"" : '') + ": \"";

							// @ts-ignore
							const valueByLanguage = this.languageByValueByKey.get(key);
							if (valueByLanguage) {
								content += (valueByLanguage.get(languages.at(j) || ''));
							}

							content += "\"";

							if (j < languages.length - 1) {
								content += ",\n";
							}
						}

						content += "\n\t}";
					}

					if (i < config.translationKeys.length - 1) {
						content += ',';
					}

					content += "\n";
				}

				content += '}';
				
				//console.log(content);

				this.generateOutputFile(outputOptions.dir + filename, content, !generatedFiles.has(filename));

				if (this.notTranslatedLanguageByValueByKey.size > 0) {
					Logger.warning("Please note that one or more keys have not been translated because the translation values do not match the current values.\n" +
						"It is possible that your language options have changed or that you have changed some things.\n" +
						"However, the -f option allows you to force the translation.");
				}

				generatedFiles.add(filename);
			}
		});
	}

	private findLanguagesByFilename(outputOptions: ParsedOutputOptionsType, languages: string[]): Map<string, string[]> {
		const fileOptions = outputOptions.fileOptions;
		const filenameByLanguage: Map<string, string> = new Map();

		if (Array.isArray(fileOptions)) {
			const languagesCustom: Language[] | string[] = [];
			for (let i = 0; i < fileOptions.length; i++) {
				languagesCustom.push(fileOptions[i].lang);
			}

			for (let i = 0; i < languages.length; i++) {
				const language: any = languages[i];
				if (!languagesCustom.includes(language)) {
					filenameByLanguage.set(language, outputOptions.defaultFilename);
				}
			}

			for (let i = 0; i < fileOptions.length; i++) {
				filenameByLanguage.set(fileOptions[i].lang, fileOptions[i].name);
			}
		} else {
			if (outputOptions.multipleFiles) {
				for (let i = 0; i < languages.length; i++) {
					filenameByLanguage.set(languages[i], languages[i] + '.' + fileOptions.name);
				}
			} else {
				for (let i = 0; i < languages.length; i++) {
					filenameByLanguage.set(languages[i], fileOptions.name);
				}
			}
		}

		const languagesByFilename: Map<string, string[]> = new Map();
		for (const [, filename] of filenameByLanguage) {
			languagesByFilename.set(filename, []);
		}

		for (const [lang, filename] of filenameByLanguage) {
			languagesByFilename.get(filename)?.push(lang);
		}

		return languagesByFilename;
	}

	private async applyTranslations(sourceLanguage: string, outputOptions: ParsedOutputOptionsType): Promise<void> {
		for (const [key, valueByLanguage] of this.languageByValueByKey) {
			const baseValue = (valueByLanguage.get(sourceLanguage) || '').trim();
			if (baseValue.length == 0) {
				continue;
			}

			for (let [language, value] of valueByLanguage) {
				value = value.trim();
				if (language != sourceLanguage && !outputOptions.keysNotToBeTranslated.get(key)?.includes(language)) {
					const translation = await this.translator.translate(baseValue, sourceLanguage as Language, language as Language, outputOptions.translationAPI.name, outputOptions.translationAPI.apiKey);
					if (translation.length > 0) {
						if (value.length == 0 || outputOptions.forceTranslation) {
							valueByLanguage.set(language, translation);
						} else if (value != translation) {
							this.fillNotTranslatedLanguageByValueByKey(key, language, value);
						}
					}
				}
			}
		}
	}

	private autoSetLanguageByValueByKey(languagesByFilename: Map<string, string[]>, dir: string): void {
		for (const [filename, languages] of languagesByFilename) {
			const currentOutputPath = path.resolve(dir + filename);
			const isJSON = filename.toLowerCase().endsWith(OutputFileExtensions.JSON);

			if (fs.existsSync(currentOutputPath) && languages.length > 0) {
				const map = new Map(Object.entries(require(currentOutputPath)));
				//console.log(map)
				
				if (isJSON) {
					if (languages.length == 1) {
						for (const [key, value] of map) {
							this.fillLanguageByValueByKey(key, languages[0], value as string);
						}
					} else {
						// @ts-ignore
						this.mergeLanguageByValueByKey(map, languages);
					}
				} else {
					for (const [, v] of map) {
						// @ts-ignore
						const vEntries = Object.entries(v);

						if (languages.length == 1) {
							for (const [key, value] of vEntries) {
								this.fillLanguageByValueByKey(key, languages[0], value as string);
							}
						} else {
							// @ts-ignore
							this.mergeLanguageByValueByKey(new Map(vEntries), []);
						}
					}
				}
			}
		}
	}

	private fillLanguageByValueByKey(key: string, language: string, value: string): void {
		if (!this.languageByValueByKey.get(key)) {
			this.languageByValueByKey.set(key, new Map());
		}

		this.languageByValueByKey.get(key)?.set(language, value);
	}

	private mergeLanguageByValueByKey(map: Map<string, Map<string, string>>, languages: string[]): void {
		for (const [key, valueByLanguage] of map) {
			for (const language of languages) {
				if (!valueByLanguage.hasOwnProperty(language)) {
					valueByLanguage[language] = '';
				}
			}
			
			for (const [language, value] of Object.entries(valueByLanguage)) {
				this.fillLanguageByValueByKey(key, language, value);
			}
		}
	}

	private fillNotTranslatedLanguageByValueByKey(key: string, language: string, value: string): void {
		if (!this.notTranslatedLanguageByValueByKey.get(key)) {
			this.notTranslatedLanguageByValueByKey.set(key, new Map());
		}

		this.notTranslatedLanguageByValueByKey.get(key)?.set(language, value);
	}

	private generateOutputFile(filePath: string, content, log: boolean = true): void {
		fse.outputFile(filePath, content)
			.then(() => {
				if (log) {
					Logger.success("Generated: " + filePath);
				}
			})
			.catch(err => {
				if (log) {
					Logger.error(err);
				}
			});
	}

}