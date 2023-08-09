import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import localesResourse from "../assets/locales";
import * as RNLocalize from "react-native-localize";

const languageDefault = 'zh'; // china, taiwan, hongkong, macao

const getLanguageCode = () => {
  let result = languageDefault;
  const listLanguage = RNLocalize.getLocales();
  if (listLanguage && listLanguage.length > 0) {
    const temp = listLanguage[0];
    result = temp?.languageCode ?? languageDefault;
  }
  return result;
};

const languageDetector = {
  type: "languageDetector",
  detect: () => getLanguageCode(),
  init: () => { },
  cacheUserLanguage: () => { }
};

i18n
  .use(reactI18nextModule)
  .use(languageDetector)
  .init({
    compatibilityJSON: 'v3',
    resources: localesResourse,
    fallbackLng: languageDefault,
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true
    }
  });

export default i18n;