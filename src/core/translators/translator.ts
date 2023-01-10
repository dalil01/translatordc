import {Language} from "../constants/language";
import {Logger} from "../../utils/logger";
import {TranslationAPI} from "../constants/translation-api";
import {resolve} from "path";

const {generateRequestUrl, normaliseResponse} = require('google-translate-api-browser');
const https = require('https');

const deeplAPI = require("deepl");

export class Translator {

	public async translate(text: string, from: Language, to: Language, api: TranslationAPI, apiKey: string): Promise<string> {
		let translatedText;

		switch (api) {
			case TranslationAPI.FREE_DEEPL:
			case TranslationAPI.DEEPL:
				translatedText = await this.translateWithDeeplApi(text, from, to, api == TranslationAPI.FREE_DEEPL, apiKey);
				break;
			default:
				translatedText = await this.translateWithFreeGoogleApi(text, from, to);
		}

		return translatedText;
	}

	private translateWithFreeGoogleApi(text: string, from: Language, to: Language): Promise<string> {
		const url = generateRequestUrl(text, {from, to});

		return new Promise((resolve, reject) => {
			https.get(url, (resp) => {
				let data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					const translation = normaliseResponse(JSON.parse(data)).text;
					resolve(translation);
				});
			}).on("error", (err) => {
				Logger.error("Google api reject error : " + err.message);
				reject(err);
			});
		});
	}

	private async translateWithDeeplApi(text: string, from: Language, to: Language, isFree: boolean, apiKey: string): Promise<string> {
		const supportedLanguages = ["BG", "CS", "DA", "DE", "EL", "EN-GB", "EN-US", "EN", "ES", "ET", "FI", "FR", "HU", "IT", "JA", "LT", "LV", "NL", "PL", "PT-PT", "PT-BR", "PT", "RO", "RU", "SK", "SL", "SV", "ZH"];

        if (!supportedLanguages.includes(to.toUpperCase())) {
            Logger.error("Target language : " + to + " is not supported by deepl API.");
            return new Promise(() => resolve(''));
        }

        return new Promise((resolve, reject) => {
			deeplAPI({
                free_api: isFree,
				text,
				target_lang: to,
				auth_key: apiKey
			})
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
                    Logger.error("deeplAPI api reject error : " + error.message);
                    reject(error)
				});
		});
	}

}