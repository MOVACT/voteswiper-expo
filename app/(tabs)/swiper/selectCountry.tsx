import BoxGradient from "@/components/BoxGradient";
import Container from "@/components/Container";
import CountryPill from "@/components/CountryPill";
import Loader from "@/components/Loader";
import ScrollContainer, {
  styles as scrollContainerStyles,
} from "@/components/ScrollContainer";
import Title from "@/components/Title";
import Txt from "@/components/Txt";
import { ENDPOINTS, useFetch } from "@/connectors/api";
import { useApp } from "@/contexts/app";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {OneSignal} from "react-native-onesignal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Country } from "@/types/api";

const SelectCountry: React.FC = () => {
  const { setCountry, t } = useApp();
  const { loading, error, data, refetch } = useFetch<Country[]>(
    ENDPOINTS.COUNTRIES
  );
  const { top, bottom } = useSafeAreaInsets();


  if (error) {
    return <View />;
  }
  return (
    <Container>
      <ScrollContainer
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={["#ffffff"]}
            enabled
            tintColor={"#ffffff"}
          />
        }
      >
        <View style={styles.list}>
        <BoxGradient>
          <Title mainBig center>
            {t("selectCountry.title")}
          </Title>
          <Txt copy center>
            {t("selectCountry.introText")}
          </Txt>
        </BoxGradient>
        <View style={styles.countriesList}>
          {data && data.map((country: Country) => {
            return (
              <CountryPill
                onPress={() => {
                  OneSignal.User.addTags({
                    country_id: country.id,
                    country_slug: country.slug,
                  });
                  setCountry(country);
                }}
                key={country.id}
                locale={country.country_code}
                name={country.name}
              />
            );
          })}
        </View>
        </View>
      </ScrollContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  countriesList: {
    paddingTop: 10,
  },
  list: {
    paddingHorizontal: 25,
  }
});

export default SelectCountry;
