import { CommandType } from "../types/command.type";
import { CommandParser } from "../parsers/command.parser";
import { ConfigParser } from "../parsers/config.parser";
import {OutputFileGenerator} from "../generators/output-file.generator";

export class Runner {
	
	private commandParser: CommandParser = new CommandParser();
	private configParser: ConfigParser = new ConfigParser();

	private outputFileGenerator: OutputFileGenerator = new OutputFileGenerator();

	public run(command: CommandType): void {
		const parsedCommand = this.commandParser.parse(command);
		if (!parsedCommand) {
			return;
		}
		
		const parsedConfig = this.configParser.parse(parsedCommand.config);
		if (!parsedConfig) {
			return;
		}

		this.outputFileGenerator.generate(parsedConfig);
		
	}
	
	
}