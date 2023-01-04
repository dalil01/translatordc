import {ParsedConfigType} from "../types/parsed-config.type";
import * as fse from "fs-extra";
import {Logger} from "../utils/logger";

export class OutputFileGenerator {

    public generate(config: ParsedConfigType): void {
        console.log(config);

        fse.outputFile(config.outputFile, "")
            .then(() => {
                Logger.success("Generated!");
            })
            .catch(err => {
                Logger.error(err);
            });
    }

}