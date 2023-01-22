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
			.option("-v, --version", "Display a current version")
			.option("-cf, --config-file <value>", "Custom config file path (Default: " + DefaultConfig.defaultFileNames.join(" | ") + ")")
			.option("-if, --input-file <value>", "Translation keys file")
			.option("-sl, --source-language <value>", "")
			.option("-tl, --target-languages <value>", "")
			.option("-od, --output-dir <value>", "")
			.option("-mof, --multiple-output-files", "")
			.option("-of, --output-filename <value>", "")
			.option("-ofl, --output-filename-by-languages <value>", " fr:file.js,en:file-en.json")
			.option("-tan, --translation-api <value>", "")
			.option("-tak, --translation-api-key <value>", "")
			.option("-ft, --force-translation", "")
			.option("-kt, --keys-not-to-be-translated <value>", "key1:(fr,en)|key2:es|key3:sp,en")
			.option("-sc, --save-config <value>", "")
			.option("-h, --help",  "Display help")
			.parse(process.argv)
		;
	}
	
}