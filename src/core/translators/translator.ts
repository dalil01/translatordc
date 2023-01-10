import {Language} from "../constants/language";
import {Logger} from "../../utils/logger";
import {TranslationAPI} from "../constants/translation-api";

const {generateRequestUrl, normaliseResponse} = require('google-translate-api-browser');
const https = require('https');

export class Translator {

	public async translate(text: string, from: Language, to: Language, api: TranslationAPI = TranslationAPI.FREE_GOOGLE_TRANSLATE): Promise<string> {
        let translatedText = '';

        switch (api) {
            case TranslationAPI.DEEPL:
                break;
            default:
                return await this.translateWithFreeGoogleApi(text, from, to);
        }

        return translatedText;
    }

    private translateWithFreeGoogleApi(text: string, from: Language, to: Language): Promise<string> {
        const url = generateRequestUrl(text, { from, to });

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
                Logger.error("Google translate api reject error : " + err.message);
                reject(err);
            });
        });
    }

    private async translateWithGoogleCloudApi(text: string, to: Language): Promise<string> {
		return new Promise(() => "");
	}

}