import config from "@/common/config";
import * as ExpoLocation from "expo-localization";

const getCurrentLocale = (language: string | null): string => {
  if (language === null) {
    return "en";
  }

  const locales = ExpoLocation.getLocales();

  if (locales.length > 0) {
    if (locales[0].languageCode && config.locales.indexOf(locales[0].languageCode) > -1) {
      return language;
    }
  }

  return config.fallbackLocale;
};

export default getCurrentLocale;
