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

        for (const [filename, languages] of languagesByFilename) {
            let content = '';

            if (filename.endsWith(OutputFileExtensions.TS) || filename.endsWith(OutputFileExtensions.JS)) {
                content += "export const " + filename.split('/').at(-1)?.split('.').at(0) + " = {";
            } else if (filename.endsWith(OutputFileExtensions.JSON)) {
                content += '{';
            }

            content += "\n";
            for (let i = 0; i < config.translationKeys.length; i++) {
                content += "\t" + config.translationKeys.at(i) + ": " + ((languages.length > 1) ? "\"" : "{\n");

                /*
                for (let j = 0; j < config.languages.length; j++) {
                    content += "\t".repeat(2) + config.languages.at(j) + ": \"";

                    //

                    content += "\"";

                    if (j < config.languages.length -1) {
                        content += ',';
                    }

                    content += "\n";
                }

                 */

                content += "\t" + ((languages.length > 1) ? "\"" : "}");

                if (i < config.translationKeys.length -1) {
                    content += ',';
                }

                content += "\n";
            }

            content += '}';

            this.generateOutputFile(outputOptions.dir + filename, content, !generatedFiles.has(filename));

            const savedDir = path.dirname(__filename) + "/saved";
            if (fs.existsSync(savedDir)) {
                fs.rmSync(savedDir,  { recursive: true, force: true });
            }

            this.generateOutputFile(savedDir + '/' + filename, content, false);

            generatedFiles.add(filename);
        }
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