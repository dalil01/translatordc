import {ParsedConfigType} from "../types/parsed-config.type";
import * as fse from "fs-extra";
import {Logger} from "../utils/logger";
import * as path from "path";
import {OutputFileExtensions} from "../constants/output-file-extensions";
import * as fs from "fs";

export class OutputFileGenerator {

    public generate(config: ParsedConfigType): void {
        console.log(config);

        if (this.nothingChanges()) {
            Logger.info("Nothing changes");
            return;
        }

        const outputOptions = config.outputOptions;
        const fileOptions = outputOptions.fileOptions;
        const filenames: string[] = [];

        if (Array.isArray(fileOptions)) {
            for (let i = 0; i < fileOptions.length; i++) {
                filenames.push(fileOptions[i].name);
            }
        } else {
            if (outputOptions.multipleFiles) {
                for (let i = 0; i < config.languages.length; i++) {
                    filenames.push(config.languages[i] + '.' + fileOptions.name)
                }
            } else {
                filenames.push(fileOptions.name);
            }
        }

        console.log(filenames);

        const quote = (outputOptions.singleQuote) ? "'" : '\"';

        for (let i = 0; i < filenames.length; i++) {
            const filename = filenames[i];

            let content = '';

            if (filename.endsWith(OutputFileExtensions.TS) || filename.endsWith(OutputFileExtensions.JS)) {
                content += "export const " + filename.split('/').at(-1)?.split('.').at(0) + " = {";
            } else if (filename.endsWith(OutputFileExtensions.JSON)) {
                content += '{';
            }


            content += '}';

            this.generateOutputFile(outputOptions.dir + filename, content);

            const savedDir = path.dirname(__filename) + "/saved";
            if (fs.existsSync(savedDir)) {
                fs.rm(savedDir,  { recursive: true, force: true }, () => {});
            }

            this.generateOutputFile(savedDir + '/' + filename, content, false);
        }



        /*

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


         */
    }

    private nothingChanges(): boolean {
        return false;
    }

    private generateOutputFile(filePath: string, content, log: boolean = true) {
        fse.outputFile(filePath, content)
            .then(() => {
                if (log) {
                    Logger.success("Generated : " + filePath);
                }
            })
            .catch(err => {
                if (log) {
                    Logger.error(err);
                }
            });
    }

}