import { CommandType } from "../types/command.type";
import { CommandParser } from "../parsers/command.parser";
import { ConfigParser } from "../parsers/config.parser";
import {OutputFileGenerator} from "../generators/output-file.generator";
import { ConfigFileGenerator } from "../generators/config-file.generator";

export class Runner {
	
	private commandParser: CommandParser = new CommandParser();
	private configParser: ConfigParser = new ConfigParser();

	private configFileGenerator: ConfigFileGenerator = new ConfigFileGenerator();
	private outputFileGenerator: OutputFileGenerator = new OutputFileGenerator();

	public run(command: CommandType): void {
		console.log(command);
		
		const parsedCommand = this.commandParser.parse(command);
		if (!parsedCommand) {
			return;
		}
		
		const parsedConfig = this.configParser.parse(parsedCommand.config);
		if (!parsedConfig) {
			return;
		}
		
		if (command.saveConfig) {
			this.configFileGenerator.generate(command, parsedCommand.config, parsedConfig);
		}

		this.outputFileGenerator.generate(parsedConfig);
	}
	
	
}