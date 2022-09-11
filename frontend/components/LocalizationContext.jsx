import { createContext, useState, useMemo, useContext } from "react";

export const LANGS = ["fi", "en", "sv"];

export const LocalizationContext = createContext({
  langs: LANGS,
  lang: "fi",
  setLang: (lang) => {},
  l: (value) => "",
});

export const useLocalizationContext = () => useContext(LocalizationContext);

const makeGetLocalizedString = (lang) => {
  const langOrder = [...LANGS];
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
  const [lang, setLang] = useState("fi");

  const state = useMemo(
    () => ({
      langs: LANGS,
      lang,
      setLang,
      l: makeGetLocalizedString(lang),
    }),
    [lang, setLang]
  );

  return (
    <LocalizationContext.Provider value={state}>
      {children}
    </LocalizationContext.Provider>
  );
};
