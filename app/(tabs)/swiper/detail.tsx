import Box from "@/components/Box";
import BoxGradient from "@/components/BoxGradient";
import Container from "@/components/Container";
import Countdown from "@/components/Countdown";
import Loader from "@/components/Loader";
import ScrollContainer from "@/components/ScrollContainer";
import ShareButton from "@/components/ShareButton";
import Title from "@/components/Title";
import Txt from "@/components/Txt";
import { ENDPOINTS, fetch, useFetch } from "@/connectors/api";
import { useApp } from "@/contexts/app";
import { useSwiper } from "@/contexts/swiper";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useMatomo } from "matomo-tracker-react-native";
import {
  Election,
  InitiateData,
  PartiesData,
  Party,
  Question,
  QuestionsData,
} from "@/types/api";
import locale from "@/util/locale";
import moment from "@/util/momentLocale";
import { useNavigation, router, useFocusEffect } from "expo-router";

const ElectionDetails: React.FC = () => {
  const { trackScreenView } = useMatomo();
  const { setOptions } = useNavigation();
  const { language, t } = useApp();
  const { setElection, election, country } = useSwiper();

  const electionData = election!;
  const electionCountry = country!;

  moment.locale(language || "de");

  const { loading, error, data } = useFetch<Question[], QuestionsData>(
    ENDPOINTS.QUESTIONS,
    { data: { id: electionData.id } }
  );

  const {
    loading: loadingParties,
    error: errorParties,
    data: parties,
  } = useFetch<Party[], PartiesData>(ENDPOINTS.PARTIES, {
    data: { id: electionData.id },
  });

  React.useEffect(() => {
    setOptions({
      title: electionData.name,
      headerRight: () => (
        <ShareButton
          message="#VoteSwiper #WahlSwiper"
          url={`https://www.voteswiper.org/${locale(language)}/${
            electionCountry.slug
          }/${electionData.slug}`}
          title="#VoteSwiper"
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackScreen = React.useCallback(() => {
    trackScreenView({ name: electionData.slug + " / " + "ElectionDetails" });
  }, [trackScreenView]);

  useFocusEffect(trackScreen);

  const trackInitiation = React.useCallback(
    (election: Election) => {
      fetch<InitiateData>(ENDPOINTS.COUNT_INITIATE, language!, {
        data: {
          election_id: election!.id,
          platform: Platform.OS,
        },
      });
    },
    [language]
  );

  if (loading || loadingParties) {
    return (
      <Container>
        <Loader fullscreen />
      </Container>
    );
  }
  if (error || errorParties) {
    return <Container />;
  }

  return (
    <Container>
      <ScrollContainer
        withPadding
        contentInset={{ top: 0 }}
        contentContainerStyle={styles.container}
      >
        <BoxGradient>
          {moment().isAfter(moment(electionData.voting_day)) ? (
            <View>
              <Title uppercase center h5>
                {t("electionDetails.countdownPast")}
              </Title>
              <Title h1 center style={styles.electionDate}>
                {moment(electionData.voting_day).format("LL")}
              </Title>
            </View>
          ) : (
            <View>
              <Title h5 uppercase center>
                {t("electionDetails.countdown")}
              </Title>
              <Countdown date={`${electionData.voting_day} 00:00:00`} />
            </View>
          )}
        </BoxGradient>

        <Box
          actionText={t("electionDetails.startButtonText")}
          actionOnPress={() => {
            trackInitiation(electionData);
            setElection({
              ...electionData,
              questions:
                process.env.NODE_ENV === "development"
                  ? data.slice(0, 2)
                  : data,
              parties,
            });
            router.navigate("/swiperGame");
          }}
          withBorder
        >
          <Title mainBig center textCenter style={styles.textColor}>
            {electionData.name}
          </Title>
          <Txt copy center style={styles.textColor}>
            {t("electionDetails.infoText")}
          </Txt>
        </Box>
      </ScrollContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  electionDate: {
    paddingTop: 0,
    marginTop: 0,
  },
  partnerInfo: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  partnerImage: {
    width: 150,
    height: 60,
  },
  partnerUNSN: {
    width: 200,
    height: 75,
  },
  partnerText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 15,
  },
  textColor: {
    color: "#392F52",
  },
});

export default ElectionDetails;
