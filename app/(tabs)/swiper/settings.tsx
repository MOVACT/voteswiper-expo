import config from "@/common/config";
import BoxGradient from "@/components/BoxGradient";
import ButtonGradient from "@/components/ButtonGradient";
import Container from "@/components/Container";
import ScrollContainer from "@/components/ScrollContainer";
import Title from "@/components/Title";
import * as Updates from "expo-updates";
import Txt from "@/components/Txt";
import { useApp } from "@/contexts/app";
import React from "react";
import { I18nManager, StyleSheet, TouchableOpacity, View } from "react-native";
import translations from "@/translations";

const Settings: React.FC = () => {
  const { language, setLocale, t } = useApp();

  const [pick, setPick] = React.useState<null | string>(null);

  const activeStyle = (lang: string) => {
    if (pick !== null) {
      if (lang === pick) {
        return styles.activeLanguage;
      }

      return null;
    }

    if (language === lang || (lang === "default" && language === null)) {
      return styles.activeLanguage;
    }

    return null;
  };

  return (
    <Container>
      <ScrollContainer withPadding>
        <BoxGradient>
          <Title mainBig center>
            {t("settingsLanguage.boxTitle")}
          </Title>
          <Txt copy center>
            {t("settingsLanguage.boxText")}
          </Txt>
        </BoxGradient>
        <View>
          <TouchableOpacity
            onPress={() => {
              if (language === null) {
                setPick(null);
              } else {
                setPick("default");
              }
            }}
            style={[styles.language, activeStyle("default")]}
          >
            <Txt copy medium>
              {t("settings.systemDefault")}
            </Txt>
            <Txt copy>{t("settings.systemDefaultText")}</Txt>
          </TouchableOpacity>
          {config.locales.map((lang) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (language === lang) {
                    setPick(null);
                  } else {
                    setPick(lang);
                  }
                }}
                style={[styles.language, activeStyle(lang)]}
                key={lang}
              >
                <Txt
                  copy
                  medium
                  style={
                    config.rtlLocales.indexOf(lang) > -1
                      ? styles.rtl
                      : styles.ltr
                  }
                >
                  {/* @ts-ignore */}
                  {translations[lang].name}
                </Txt>
              </TouchableOpacity>
            );
          })}
        </View>
        {pick !== null && <View style={styles.offset} />}
      </ScrollContainer>

      {pick !== null && (
        <View style={styles.button}>
          <ButtonGradient
            text="Save"
            onPress={() => {
              setLocale(pick === "default" ? null : pick);
              setTimeout(async () => {
                I18nManager.forceRTL(config.rtlLocales.indexOf(pick) > -1);
                try {
                  await Updates.reloadAsync();
                } catch (e) {
                  console.error(e);
                }
              }, 500);
            }}
          />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  countriesList: {
    paddingTop: 10,
  },
  language: {
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.0)",
    marginTop: 15,
    borderRadius: 10,
  },
  activeLanguage: {
    borderColor: "#E6E90F",
  },
  offset: {
    height: 90,
  },
  button: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  rtl: {
    writingDirection: "rtl",
  },
  ltr: {
    writingDirection: "ltr",
  },
});

export default Settings;
