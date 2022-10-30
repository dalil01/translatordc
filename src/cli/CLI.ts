import commander from "commander";


export class CLI {

    static run(argv: string[]): void {
        const program = commander.program;

        program.version("1.0.0");

        program.parse(process.argv);
    }

}