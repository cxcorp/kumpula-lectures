export const translations = {
  en: {
    "Responsible unit": "Responsible unit",
  },
  fi: {
    "Responsible unit": "Vastuuyksikkö",
  },
  sv: {
    "Responsible unit": "Ansvarig enhet",
  },
};

export const makeT =
  (lang: string) => (text: keyof typeof translations["en"]) =>
    translations[lang]?.[text] ??
    translations["en"]?.[text] ??
    translations["fi"]?.[text] ??
    translations["sv"]?.[text];
