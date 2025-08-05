import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import daTranslation from './locales/da/translation.json';

const resources = {
  EN: {
    translation: enTranslation,
  },
  DK: {
    translation: daTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'EN', // default language
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false, // react already does escaping
    },
  });

export default i18n;