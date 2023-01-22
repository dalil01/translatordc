import * as commander from "commander";
import * as packageJson from "../../package.json";
import { Runner } from "../core/runner/runner";
import { CommandType } from "../core/types/command.type";
import { DefaultConfig } from "../core/constants/default-config";

export class CLI {
	
	private readonly name: string = packageJson.name;
	private readonly version: string = packageJson.version;
	private readonly command: commander.Command = new commander.Command();
	private readonly runner: Runner = new Runner();
	
	constructor() {
		this.autoSetOptions();
	}
	
	public run(): void {
		const opts = this.command.opts();
		
		// console.log(opts);
		
		if (opts.version) {
			console.log(this.version);
		} else if (opts.help) {
			this.command.outputHelp();
		} else {
			this.runner.run(opts as CommandType);
		}
	}
	
	private autoSetOptions(): void {
		this.command
			.name(this.name)
			.usage("[options]")
			.option("-v, --version", "Display the current version")
			.option("-cf, --config-file <value>", "Custom config file path (default: " + DefaultConfig.defaultFileNames.join(" | ") + ")")
			.option("-if, --input-file <value>", "Translation keys file")
			.option("-sl, --source-language <value>", "Source language")
			.option("-tl, --target-languages <value>", "Target languages (Ex: en,fr,es)")
			.option("-od, --output-dir <value>", "Output dir path")
			.option("-mof, --multiple-output-files", "Generate multiple output files per language")
			.option("-of, --output-filename <value>", "Output filename (Expected file: js, ts, json)")
			.option("-ofl, --output-filename-by-languages <value>", "Output filename by languages (Ex: en:file-en.json,fr:file.js,es:es.file.ts)")
			.option("-tan, --translation-api <value>", "Translation API")
			.option("-tak, --translation-api-key <value>", "Translation API Key")
			.option("-ft, --force-translation", "Force translation")
			.option("-kt, --keys-not-to-be-translated <value>", "Specify the translation keys not to be translated (Ex: key1|key2:(en,fr)|key3:sp)")
			.option("-sc, --save-config <value>", "Saving the command line configuration in a file")
			.option("-h, --help",  "Display help")
			.parse(process.argv)
		;
	}
	
}