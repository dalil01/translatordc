import {ParsedConfigType} from "../types/parsed-config.type";
import * as fse from "fs-extra";
import {Logger} from "../utils/logger";
import * as path from "path";
import {OutputFileExtensions} from "../constants/output-file-extensions";
import * as fs from "fs";
import {Language} from "../constants/language";
import {ParsedOutputOptionsType} from "../types/parsed-output-options.type";
import * as dgram from "dgram";

export class OutputFileGenerator {

    public generate(config: ParsedConfigType): void {
        console.log(config);

        const outputOptions = config.outputOptions;
        const languagesByFilename: Map<string, string[]> = this.findLanguagesByFilename(outputOptions, config.languages);
        const generatedFiles: Set<string> = new Set();
        const savedOutputFile = path.dirname(__filename) + "/saved-output.json";

        if (fs.existsSync(savedOutputFile)) {
            const lastSavedOutput = require(savedOutputFile);
            //console.log(lastSavedOutput["key1"]);
        }

        // TODO : get all existed data.
        let currentOutput = '';
        for (const [filename, languages] of languagesByFilename) {
            const currentOutputPath = path.resolve(outputOptions.dir + filename);
            if (fs.existsSync(currentOutputPath)) {
                console.log(require(currentOutputPath));
            }
        }

        for (const [filename, languages] of languagesByFilename) {

            //const currentValueByLanguageByKey = this.findValueByLanguageByKey();

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

            this.generateOutputFile(outputOptions.dir + filename, content, !generatedFiles.has(filename));
            generatedFiles.add(filename);
        }

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

        console.log(languagesByFilename);

        return languagesByFilename;
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