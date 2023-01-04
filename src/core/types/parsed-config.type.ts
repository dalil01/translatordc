import {ConfigType} from "./config.type";

export type ParsedConfigType = {
	translationKeys: string[];
} & ConfigType;