import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import daTranslation from './locales/da/translation.json';

// Use ISO language codes
const resources = {
  en: {
    translation: enTranslation,
  },
  da: {
    translation: daTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: ['en', 'da'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;