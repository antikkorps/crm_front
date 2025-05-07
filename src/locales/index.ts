import { createI18n } from 'vue-i18n'
import en from './en.json'
import fr from './fr.json'

export default createI18n({
  legacy: false, // Utiliser la Composition API
  locale: 'fr', // Langue par défaut
  fallbackLocale: 'en', // Langue de secours
  messages: {
    fr: fr,
    en: en,
  },
})
