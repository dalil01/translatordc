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
			.option("-c, --config-file <value>", "Custom config file path (Default: " + DefaultConfig.defaultFileNames.join(" | ") + ")")
			.option("-t, --translation-keys-file <value>", "Translation keys file")
			.option("-o, --output-file <value>", "Output file")
			.option("-r, --restore-output-file <value>", "Restore output file")
			.option("-h, --help", "Display help")
			.parse(process.argv)
		;
	}
	
}