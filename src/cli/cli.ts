import * as commander from "commander";
import * as packageJson from "../../package.json";

export class CLI {
	
	private readonly name: string;
	private readonly version: string;
	private readonly configFileNames: string[];
	
	private readonly command: commander.Command;
	
	constructor() {
		this.name = packageJson.name;
		this.version = packageJson.version;
		this.configFileNames = [
			this.name + ".config.json",
			this.name + ".config.js",
			this.name + ".config.ts"
		];
		this.command = new commander.Command();
		this.autoSetOptions();
	}
	
	public run(): void {
		const opts = this.command.opts();
		
		console.log(opts);
		
		if (opts.version) {
			console.log(this.version);
		} else if (this.command.help()) {
			this.command.outputHelp();
		} else {
			if (opts.configFile) {
			
			}
		}
	}
	
	private autoSetOptions(): void {
		this.command
			.name(this.name)
			.usage("[options]")
			.option("-v, --version", "Display a current version")
			.option("-cf, --config-file <value>", "Custom config file path (Default: " + this.configFileNames.join(" | ") + ")")
			.option("-h, --help", "Display help")
			.parse(process.argv)
		;
	}
	
}