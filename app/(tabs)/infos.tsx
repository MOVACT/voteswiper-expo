import Container from "@/components/Container";
import Txt from "@/components/Txt";
import { useApp } from "@/contexts/app";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import ScrollContainer from "@/components/ScrollContainer";
import Title from "@/components/Title";
import ButtonDark from "@/components/ButtonDark";

const Infos: React.FC = () => {
  const { t } = useApp();

  return (
    <Container>
      <ScrollContainer withPadding>
        <View style={styles.root}>
          <Title h1 style={styles.screenTitle}>
            {t("infosIndex.headline")}
          </Title>

          <Txt style={[styles.bodyText, styles.bodyTextFirst]}>
            {t("infosIndex.paragraph1")}
          </Txt>

          <Txt style={styles.bodyText}>{t("infosIndex.paragraph2")}</Txt>

          <Txt style={styles.bodyText}>{t("infosIndex.paragraph3")}</Txt>

          <View style={styles.offset} />

          <ButtonDark
            text={t("infosIndex.imprintButton")}
            onPress={() => {
              Linking.openURL(t("infosIndex.imprintLink"));
            }}
          />
          <ButtonDark
            text={t("infosIndex.privacyButton")}
            onPress={() => {
              Linking.openURL(t("infosIndex.privacyLink"));
            }}
          />
        </View>
      </ScrollContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "rgba(57,47,82,0.1)",
  },
  contentInner: {
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#59568B",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(57,47,82,0.1)",
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: "#392F52",
  },
  screenTitle: {
    paddingBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",
    paddingTop: 15,
  },
  bodyTextFirst: {
    paddingTop: 0,
  },
  offset: {
    height: 25,
  },
});

export default Infos;
