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
    private translator: Translator = new Translator();

    public generate(config: ParsedConfigType): void {
        console.log(config);

        const outputOptions = config.outputOptions;
        const languagesByFilename: Map<string, string[]> = this.findLanguagesByFilename(outputOptions, config.languages);
        console.log(languagesByFilename);

        const generatedFiles: Set<string> = new Set();

        this.autoSetLanguageByValueByKey(languagesByFilename, outputOptions.dir);

        console.log(this.languageByValueByKey);

        this.applyTranslations(config.sourceLanguage).then(() => {
            console.log("ok", this.languageByValueByKey);

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
                content += "\t" + (isJSON ? "\"" : '') + config.translationKeys.at(i) + (isJSON ? "\"" : '') + ": ";

                if (languages.length > 1) {
                    content += "{\n";

                    for (let j = 0; j < languages.length; j++) {
                        content += "\t".repeat(2) + (isJSON ? "\"" : '') + languages.at(j) + (isJSON ? "\"" : '') + ": \"";


                        content += "\"";

                        if (j < languages.length -1) {
                            content += ",\n";
                        }
                    }

                    content += "\n\t}";
                } else {
                    content += "\"";

                    content += "\"";
                }

                if (i < config.translationKeys.length -1) {
                    content += ',';
                }

                content += "\n";
            }

            content += '}';



            //this.generateOutputFile(outputOptions.dir + filename, content, !generatedFiles.has(filename));
            generatedFiles.add(filename);
        }

        /*
        let saved = '{';

        for (let i = 0; i < config.translationKeys.length; i++) {
            saved += "\"" + config.translationKeys.at(i) + "\":{";

            for (let j = 0; j < config.languages.length; j++) {
                saved += "\"" + config.languages[j] + "\":\"";

                saved += "\"";

                if (j < config.languages.length -1) {
                    saved += ',';
                }
            }

            saved += '}'

            if (i < config.translationKeys.length -1) {
                saved += ',';
            }
        }

        saved += '}';

        this.generateOutputFile(savedOutputFile, saved, false);
         */
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

    private async applyTranslations(sourceLanguage: string): Promise<void> {
        for (const [, valueByLanguage] of this.languageByValueByKey) {
            const baseValue = (valueByLanguage.get(sourceLanguage) || '').trim();
            if (baseValue.length == 0) {
                continue;
            }

            for (let [language, value] of valueByLanguage) {
                value = value.trim();
                if (language != sourceLanguage) {
                    if (value.length > 0) {
                        continue;
                    }

                    valueByLanguage.set(language, await this.translator.translate(baseValue, sourceLanguage as Language, language as Language));
                }
            }
        }
    }

    private autoSetLanguageByValueByKey(languagesByFilename: Map<string, string[]>, dir: string): void {
        for (const [filename, languages] of languagesByFilename) {
            const currentOutputPath = path.resolve(dir + filename);
            const isJSON = filename.endsWith(OutputFileExtensions.JSON);

            if (fs.existsSync(currentOutputPath) && languages.length > 0) {
                const map = new Map(Object.entries(require(currentOutputPath)));

                if (isJSON) {
                    if (languages.length == 1) {
                        for (const [key, value] of map) {
                            this.fillLanguageByValueByKey(key, languages[0], value as string);
                        }
                    } else {
                        // @ts-ignore
                        this.mergeLanguageByValueByKey(map);
                    }
                } else {
                    for (const [k, v] of map) {
                        // @ts-ignore
                        const vEntries = Object.entries(v);
                        console.log(map)

                        if (languages.length == 1) {
                            for (const [key, value] of vEntries) {
                                this.fillLanguageByValueByKey(key, languages[0], value as string );
                            }
                        } else {
                            // @ts-ignore
                            this.mergeLanguageByValueByKey(new Map(vEntries));
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

    private mergeLanguageByValueByKey(map: Map<string, Map<string, string>>): void {
        this.languageByValueByKey = new Map([...this.languageByValueByKey, ...map]);
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