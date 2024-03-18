import { Link, useFocusEffect, router, useNavigation } from "expo-router";
import BoxGradient from "@/components/BoxGradient";
import Container from "@/components/Container";
import ElectionPill from "@/components/ElectionPill";
import Loader from "@/components/Loader";
import ScrollContainer from "@/components/ScrollContainer";
import Title from "@/components/Title";
import Txt from "@/components/Txt";
import { ENDPOINTS, useFetch } from "@/connectors/api";
import { useApp } from "@/contexts/app";
import React from "react";
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useMatomo } from "matomo-tracker-react-native";
import { Election, ElectionsData } from "@/types/api";
import getCountryFlag from "@/util/getCountryFlag";
import moment from "@/util/momentLocale";
import ChevronRight from "@/icons/ChevronRight";
import rtl from "@/util/rtl";
import { useSwiper } from "@/contexts/swiper";

const ElectionsIndex: React.FC = () => {
  const { setOptions } = useNavigation();
  const { country, t } = useApp();
  const { setElection, setCountry } = useSwiper();
  const { trackScreenView } = useMatomo();

  const { loading, error, data, refetch } = useFetch<Election[], ElectionsData>(
    ENDPOINTS.ELECTIONS,
    { data: { country: country!.id, include: "all" } }
  );

  React.useEffect(() => {
    setOptions({
      headerLeft: () => (
        <Link href="/(tabs)/swiper/selectCountry" asChild>
          <TouchableOpacity style={styles.countryLink}>
            <View style={styles.countryFlag}>
              {getCountryFlag(country!.country_code, {
                width: 28,
                height: 20,
              })}
            </View>
            <Txt style={styles.countryLinkText} medium>
              {country!.name}
            </Txt>
            <ChevronRight style={rtl.mirror} />
          </TouchableOpacity>
        </Link>
      ),
      title: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const trackScreen = React.useCallback(() => {
    trackScreenView({ name: "/elections" + " / ElectionsIndex" });
  }, [trackScreenView]);

  useFocusEffect(trackScreen);

  const upcomingElections = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return data.filter((election) =>
      moment().isSameOrBefore(election.voting_day, "day")
    );
  }, [data]);

  const pastElections = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return data.filter((election) => moment().isAfter(election.voting_day));
  }, [data]);

  if (loading) {
    return (
      <Container>
        <Loader fullscreen />
      </Container>
    );
  }

  if (error) {
    return <Container />;
  }

  return (
    <Container>
      <ScrollContainer
        withPadding
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              refetch();
            }}
            colors={["#ffffff"]}
            enabled
            tintColor={"#ffffff"}
          />
        }
      >
        <BoxGradient>
          <Title mainBig center>
            {t("electionsIndex.boxTitle")}
          </Title>
          {t("electionsIndex.boxText") !== "" ? (
            <Txt copy center>
              {t("electionsIndex.boxText")}
            </Txt>
          ) : null}
        </BoxGradient>

        {upcomingElections.length > 0 ? (
          <View style={styles.electionsList}>
            {upcomingElections.map((election: Election) => {
              return (
                <ElectionPill
                  key={election.id}
                  {...election}
                  onPress={() => {
                    setElection({
                      ...election,
                      questions: [],
                      parties: [],
                    });
                    setCountry(country);

                    router.navigate("/(tabs)/swiper/detail");
                  }}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.noElectionsBox}>
            <Txt copy center>
              {t("electionsIndex.noElections")}
            </Txt>
          </View>
        )}

        {pastElections.length > 0 ? (
          <View style={styles.pastElectionsContainer}>
            <BoxGradient>
              <Title mainBig center>
                {t("electionsIndex.boxPastTitle")}
              </Title>
              {t("electionsIndex.boxPastText") !== "" ? (
                <Txt copy center>
                  {t("electionsIndex.boxText")}
                </Txt>
              ) : null}
            </BoxGradient>

            <View style={styles.electionsList}>
              {pastElections.map((election) => {
                return (
                  <ElectionPill
                    key={election.id}
                    {...election}
                    onPress={() => {
                      setElection({
                        ...election,
                        questions: [],
                        parties: [],
                      });
                      setCountry(country);

                      router.navigate("/(tabs)/swiper/detail");
                    }}
                  />
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  countryLink: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  countryFlag: {
    paddingRight: 10,
  },
  countryLinkText: {
    fontSize: 14,
    color: "#fff",
    marginRight: 5,
  },
  electionsList: {
    paddingTop: 10,
  },
  pastElectionsContainer: {
    paddingTop: 60,
  },
  noElectionsBox: {
    paddingTop: 30,
    paddingLeft: 25,
    paddingRight: 25,
  },
  info: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 5,
    marginBottom: 15,
  },
  infoActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
  },
  infoAction: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  infoMainAction: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  switchText: {
    color: "#392F52",
  },
});

export default ElectionsIndex;
