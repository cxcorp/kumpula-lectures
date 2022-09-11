import { useRouter } from "next/router";
import { createContext, useState, useMemo, useContext } from "react";
import { makeT } from "../translations";

export const LocalizationContext = createContext({
  langs: ["fi", "en", "sv"],
  lang: "fi",
  setLang: (lang) => {},
  /**
   * Picks the string of the current locale if available
   * @param {import("../api").Name} value name with multiple translations
   */
  l: (value) => "",
  /**
   * Translates the specified string
   * @type {ReturnType<typeof makeT>}
   */
  t: (value) => "",
});

export const useLocalizationContext = () => useContext(LocalizationContext);

const makeGetLocalizedString = (locales, lang) => {
  const langOrder = [...locales];
  langOrder.splice(langOrder.indexOf(lang, 1));
  langOrder.unshift(lang);

  return (val) => {
    for (const lang of langOrder) {
      if (typeof val[lang] === "string") {
        return val[lang];
      }
    }

    return undefined;
  };
};

export const LocalizationContextContainer = ({ children }) => {
  const { locale, locales } = useRouter();

  const state = useMemo(
    () => ({
      langs: locales,
      lang: locale,
      l: makeGetLocalizedString(locales, locale),
      t: makeT(locale),
    }),
    [locale, locales]
  );

  return (
    <LocalizationContext.Provider value={state}>
      {children}
    </LocalizationContext.Provider>
  );
};
