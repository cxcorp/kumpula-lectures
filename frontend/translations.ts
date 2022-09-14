export const translations = {
  en: {
    "<title>": "Lecture list | Exactum | University of Helsinki",
    "Responsible unit": "Responsible unit",
    "Lecture listing": "Lecture listing - Exactum",
    "Search for available lectures...":
      "Search for upcoming lectures scheduled in the Kumpula campus Exactum building and explore other units at the University of Helsinki.",
  },
  fi: {
    "<title>": "Luentolistaus | Exactum | Helsingin yliopisto",
    "Responsible unit": "Vastuuyksikkö",
    "Lecture listing": "Luentolistaus - Exactum",
    "Search for available lectures...":
      "Hae Kumpulan Kampuksen Exactum-rakennuksen tulevia luentoja ja tutustu muiden Helsingin yliopiston yksiköiden luentoihin.",
  },
  sv: {
    "<title>": "Föreläsningslista | Exactum | Helsingfors universitet",
    "Responsible unit": "Ansvarig enhet",
    "Lecture listing": "Föreläsningslista - Exactum",
  },
};

/**
 * List of weekdays per locale, starting from Sunday. Starting from
 * Sunday because Date.getDate() returns an integer starting from
 * Sunday being 0.
 */
export const weekdays = {
  en: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
  fi: ["su", "ma", "ti", "ke", "to", "pe", "la"],
  sv: ["sö", "må", "ti", "on", "to", "fr", "lö"],
};

export const makeT =
  (lang: string) => (text: keyof typeof translations["en"]) =>
    translations[lang]?.[text] ??
    translations["en"]?.[text] ??
    translations["fi"]?.[text] ??
    translations["sv"]?.[text] ??
    `t(${text})`;
