import {ParsedConfigType} from "../types/parsed-config.type";
import * as fse from "fs-extra";
import {Logger} from "../utils/logger";
import {OutputFileExtensions} from "../constants/output-file-extensions";
import * as path from "path";

export class OutputFileGenerator {

    public generate(config: ParsedConfigType): void {
        console.log(config);

        if (this.nothingChanges()) {
            Logger.info("Nothing changes");
            return;
        }

        const languages = [config.sourceLanguage, ...config.targetLanguages];
        // TODO c'est le parser qui doit gérer v
        const quote = (config.hasOwnProperty("singleQuote") && config.singleQuote?.toLowerCase() === "true" || !config.hasOwnProperty("singleQuote") && config.singleQuote) ? "'" : '\"';
        let content = '';

        // TODO c'est le parser qui doit gérer v
        if (config.outputFile.endsWith(OutputFileExtensions.TS) || config.outputFile.endsWith(OutputFileExtensions.JS)) {
            content += "export const " + config.outputFile.split('/').at(-1)?.split('.').at(0) + " = {";
        } else if (config.outputFile.endsWith(OutputFileExtensions.JSON)) {
            content += '{';
        }

        content += "\n";
        for (let i = 0; i < config.translationKeys.length; i++) {
            content += "\t" + config.translationKeys.at(i) + ": {\n";

            for (let j = 0; j < languages.length; j++) {
                content += "\t".repeat(2) + languages.at(j) + ": " + quote;


                content += quote;

                if (j < languages.length -1) {
                    content += ',';
                }
                content += "\n";
            }

            content += "\t}";

            if (i < config.translationKeys.length -1) {
                content += ',';
            }

            content += "\n";
        }

        content += '}';

        this.generateOutputFile(config.outputFile, content);
        this.generateOutputFile(path.dirname(__filename) + "/backup/output", content, false);
    }

    private nothingChanges(): boolean {
        return false;
    }

    private generateOutputFile(filePath: string, content, log: boolean = true) {
        fse.outputFile(filePath, content)
            .then(() => {
                if (log) {
                    Logger.success("Generated!");
                }
            })
            .catch(err => {
                if (log) {
                    Logger.error(err);
                }
            });
    }

}