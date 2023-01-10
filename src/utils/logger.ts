const clc = require("cli-color");

enum LoggerType {
	INFO= "INFO",
	WARNING = "WARNING",
	ERROR = "ERROR",
	SUCCESS = "SUCCESS"
}

export class Logger {
	
	public static info(message: string) {
		this.printLog(LoggerType.INFO, message);
	}
	
	public static warning(message: string) {
		this.printLog(LoggerType.WARNING, message);
	}
	
	public static error(message: string) {
		this.printLog(LoggerType.ERROR, message);
	}

	public static success(message: string) {
		this.printLog(LoggerType.SUCCESS, message);
	}
	
	private static printLog(type: LoggerType, message: string): void {
		let logMessage;
		
		switch (type) {
			case LoggerType.INFO:
				logMessage = clc.blue(`[${LoggerType.INFO}] ` + message);
				break;
			case LoggerType.WARNING:
				logMessage = clc.orange(`[${LoggerType.WARNING}] ` + message);
				break;
			case LoggerType.ERROR:
				logMessage = clc.red(`[${LoggerType.ERROR}] ` + message);
				break;
			case LoggerType.SUCCESS:
				logMessage = clc.green(`[${LoggerType.SUCCESS}] ` + message);
				break;
		}
		
		console.log(logMessage);
	}
	
}