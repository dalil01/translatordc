 # translatordc
 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/dalil01/translatordc/blob/main/LICENSE)

<blockquote align="center">
    Easy-to-use, pre-configured CLI tool for generating translations in your web applications.
</blockquote>

### Intro

**translatordc** is a tool for automatic generation of translation files. 
It uses a translation key file as input, and converts terms from a source language into different target languages. 

By default, it uses the Google Translation API, but it is also possible to configure the use of other translation APIs.

### Install

```bash
npm install translatordc
```

## Usage

### Command-line

```
Usage: translatordc

Options:
  -v, --version                                 Display the current version
  -cf, --config-file <value>                    Custom config file path (default: translatordc.config.js | translatordc.config.json)
  -if, --input-file <value>                     Translation keys file
  -sl, --source-language <value>                Source language
  -tl, --target-languages <value>               Target languages (Ex: en,fr,es)
  -od, --output-dir <value>                     Output dir path
  -mof, --multiple-output-files                 Generate multiple output files per language
  -of, --output-filename <value>                Output filename (Expected file: js, ts, json)
  -ofl, --output-filename-by-languages <value>  Output filename by languages (Ex: en:file-en.json,fr:file.js,es:es.file.ts)
  -tan, --translation-api <value>               Translation API
  -tak, --translation-api-key <value>           Translation API Key
  -ft, --force-translation                      Force translation
  -kt, --keys-not-to-be-translated <value>      Specify the translation keys not to be translated (Ex: key1:(fr,en)|key2:es|key3:sp,en)
  -sc, --save-config <value>                    Saving the command line configuration in a file
  -h, --help                                    Display help
```

**Note:** Even if all options can be specified by the command line, you can use a configuration file.

### Configuration file

By  default, `translatordc` will look for one of following files in the working directory:

```
translatordc.config.js | translatordc.config.json
```

Here's an example `translatordc.config.js`:

```js
module.exports = {
    inputFile: "input.ts", // (required)
    sourceLanguage: Language.French, // (required)
    targetLanguages: [Language.English, "es"], // (required)
    outputOptions: {
        dir: "./output",
        multipleFiles: true,
        fileOptions: { name: "translated.js" }, // or [ { lang: "en", name: "enTranslated.ts" }, { lang: "es", name: "es.translated.json" }  ]
        translationAPI: {
            name: TranslationAPI.FREE_GOOGLE_TRANSLATE,
            apiKey: ''
        },
        forceTranslation: true,
        keysNotToBeTranslated: ["key1", "key2:(en,fr)", "key3:es"]
    }
};
```

### Translation APIs

- **FREE_GOOGLE_TRANSLATE**
- **FREE_DEEPL**
- **DEEPL**

## Contribute

PRs are always welcome. If you need help questions, want to bounce ideas, contact me by e-mail: **dalil.chablis@gmail.com**.

## License

translatordc &copy; 2023 - Dalil CHABLIS - Released under the [MIT license](https://github.com/tancredi/translatordc/blob/master/LICENSE)