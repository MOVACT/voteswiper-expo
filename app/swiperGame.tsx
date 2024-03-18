import { useFocusEffect, useNavigation, router } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import Container from "@/components/Container";
import Loader from "@/components/Loader";
import Txt from "@/components/Txt";
import { ENDPOINTS, fetch } from "@/connectors/api";
import { useApp } from "@/contexts/app";
import { useSwiper } from "@/contexts/swiper";
import Close from "@/icons/Close";
import Skip from "@/icons/Skip";
import React from "react";
import { sm } from "@/common/breakpoints";
import {
  BackHandler,
  Platform,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  I18nManager,
} from "react-native";
import DeckSwiper from "react-native-deck-swiper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountAnswerData, Question } from "@/types/api";
import rtl from "@/util/rtl";
import Card from "@/components/swiper/Card";
import ExitConfirmDialog from "@/components/swiper/ExitConfirmDialog";
import MainButton from "@/components/swiper/MainButton";
import { buttonSize } from "@/components/swiper/MainButton";
import NavigationButton from "@/components/swiper/NavigationButton";
import { cardBorderRadius } from "@/components/swiper/Card";

const Swiper: React.FC = () => {
  const $swiper = React.useRef<DeckSwiper<Question>>(null);
  const headerHeight = useHeaderHeight();
  const { t, language } = useApp();
  const { bottom } = useSafeAreaInsets();
  const { setOptions, dispatch, navigate } = useNavigation();
  const { election, clearAnswers, setAnswer } = useSwiper();
  const [cardIndex, setCardIndex] = React.useState(0);
  const [exitConfirmation, showExitConfirmation] = React.useState(false);

  const controlBottomSize = bottom === 0 ? 20 : bottom;

  const trackAnswer = React.useCallback(
    (question: number, answer: number) => {
      fetch<CountAnswerData>(ENDPOINTS.COUNT_ANSWER, language!, {
        data: {
          election_id: election!.id,
          question_id: question,
          answer: answer,
          platform: Platform.OS,
        },
      });
    },
    [election, language]
  );

  React.useEffect(() => {
    setOptions({
      /**
       * Will show previous and next buttons in the header
       */
      headerLeft: () => {
        return (
          <View style={styles.headerLeft}>
            <View style={styles.headerNavigation}>
              <NavigationButton
                onPress={() => {
                  $swiper.current?.jumpToCardIndex(cardIndex - 1);
                  setCardIndex(cardIndex - 1);
                }}
                disabled={cardIndex < 1}
                type="previous"
              />
              <NavigationButton
                onPress={() => {
                  $swiper.current?.jumpToCardIndex(cardIndex + 1);
                  setCardIndex(cardIndex + 1);
                }}
                disabled={cardIndex + 1 > election!.questions.length}
                type="next"
              />
            </View>
            <View style={styles.headerTitle}>
              <Txt medium style={styles.headerTitleText}>
                {t("swiper.questionNumber", [
                  cardIndex + 1 > election!.questions.length
                    ? election!.questions.length
                    : cardIndex + 1,
                  election!.questions.length,
                ])}
              </Txt>
            </View>
          </View>
        );
      },
      /**
       * Will show a close button with confirmation dialog
       */
      headerRight: () => {
        return (
          <View style={styles.headerClose}>
            <TouchableOpacity
              style={styles.headerCloseAction}
              onPress={() => {
                showExitConfirmation(true);
              }}
            >
              <Close />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [setOptions, clearAnswers, dispatch, cardIndex, election, t]);

  const handleBackButton = React.useCallback(() => {
    showExitConfirmation(true);
    return true;
  }, []);

  useFocusEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    /**
     * Go to last card if one comes back after he finished
     */
    if (cardIndex === election!.questions.length) {
      $swiper.current?.jumpToCardIndex(cardIndex - 1);
      setCardIndex(cardIndex - 1);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  });

  const getQuestionID = React.useCallback(
    (index: number) => {
      return election!.questions[index].id;
    },
    [election]
  );

  const swipedNo = React.useCallback(
    (index: number) => {
      const id = getQuestionID(index);
      setAnswer(id, 1);
      trackAnswer(id, 1);
    },
    [setAnswer, trackAnswer, getQuestionID]
  );

  const swipedYes = React.useCallback(
    (index: number) => {
      const id = getQuestionID(index);
      setAnswer(id, 2);
      trackAnswer(id, 2);
    },
    [setAnswer, trackAnswer, getQuestionID]
  );

  const swipedSkip = React.useCallback(
    (index: number) => {
      const id = getQuestionID(index);
      setAnswer(id, 0);
      trackAnswer(id, 0);
    },
    [setAnswer, trackAnswer, getQuestionID]
  );

  if (!election) {
    return (
      <Container>
        <Loader fullscreen />
      </Container>
    );
  }

  return (
    <Container noPadding>
      <View style={styles.root}>
        <View style={{ ...styles.content, marginTop: headerHeight }}>
          <View style={styles.swiper}>
            <DeckSwiper
              ref={$swiper}
              cards={election.questions}
              keyExtractor={(cardData) => cardData.id.toString()}
              renderCard={(card) => {
                return <Card {...card} />;
              }}
              onSwipedAll={() => {
                router.navigate('/swiperChooseParties');
              }}
              onSwiped={(index) => {
                setCardIndex(index + 1);
              }}
              onSwipedLeft={swipedNo}
              onSwipedRight={swipedYes}
              onSwipedTop={swipedSkip}
              cardIndex={cardIndex}
              showSecondCard
              stackSize={3}
              stackSeparation={20}
              backgroundColor="transparent"
              cardHorizontalMargin={containerPaddingHorizontal}
              marginTop={-30}
              marginBottom={
                buttonSize +
                controlBottomSize +
                controlsPaddingTop + 40 +
                (Platform.OS === 'android' ? 20 : 0)
              }
              disableBottomSwipe
              animateOverlayLabelsOpacity
              overlayLabels={{
                left: {
                  element: (
                    <View style={styles.noOverlay}>
                      <Txt medium style={styles.overlayText}>
                        {t("swiper.no")}
                      </Txt>
                    </View>
                  ),
                  style: {
                    wrapper: styles.noOverlayWrapper,
                  },
                },
                right: {
                  element: (
                    <View style={styles.yesOverlay}>
                      <Txt medium style={styles.overlayText}>
                        {t("swiper.yes")}
                      </Txt>
                    </View>
                  ),
                  style: {
                    wrapper: styles.yesOverlayWrapper,
                  },
                },
                top: {
                  element: (
                    <View style={styles.skipOverlay}>
                      <Txt medium style={styles.overlayText}>
                        {t("swiper.skip")}
                      </Txt>
                    </View>
                  ),
                  style: {
                    wrapper: styles.skipOverlayWrapper,
                  },
                },
              }}
            />
          </View>

          <View
            style={[
              styles.controls,
              {
                height: buttonSize + controlBottomSize + controlsPaddingTop,
                paddingBottom: controlBottomSize,
              },
            ]}
          >
            <MainButton
              type="no"
              onPress={() => {
                if ($swiper.current) {
                  $swiper.current.swipeLeft();
                }
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if ($swiper.current) {
                  $swiper.current.swipeTop();
                }
              }}
              style={styles.skip}
            >
              <Skip width={20} height={20} style={rtl.mirror} />
              <Txt style={styles.skipText}>{t("swiper.skip")}</Txt>
            </TouchableOpacity>
            <MainButton
              type="yes"
              onPress={() => {
                if ($swiper.current) {
                  $swiper.current.swipeRight();
                }
              }}
            />
          </View>
        </View>
      </View>

      {exitConfirmation && (
        <ExitConfirmDialog
          onCancel={() => {
            showExitConfirmation(false);
          }}
          onConfirm={() => {
            clearAnswers();
            dispatch({ type: 'POP_TO_TOP' })
            //dispatch(StackActions.pop(1));
          }}
        />
      )}
    </Container>
  );
};

const { width } = Dimensions.get("window");

let containerPaddingHorizontal = 30;
const controlsPaddingTop = 40;

if (width < sm) {
  containerPaddingHorizontal = 20;
}

export { containerPaddingHorizontal, controlsPaddingTop };

export const styles = StyleSheet.create({
  headerClose: {
    marginRight: 15,
  },
  headerCloseAction: {
    padding: 5,
  },
  headerLeft: {
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  headerNavigation: {
    flexDirection: "row",
  },
  headerTitle: {
    marginLeft: 10,
  },
  headerTitleText: {
    color: "#fff",
    fontSize: 14,
  },
  root: {
    flex: 1,
    flexDirection: "column",
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  swiper: {
    flex: 1,
    padding: containerPaddingHorizontal,
    position: "relative",
    zIndex: 100,
  },
  controls: {
    paddingTop: controlsPaddingTop,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "relative",
    zIndex: 50,
    paddingHorizontal: containerPaddingHorizontal + 20,
  },
  skip: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 12,
    color: "#fff",
    paddingTop: 5,
  },
  noOverlayWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(240, 52, 52, 0.5)",
    borderRadius: cardBorderRadius,
  },
  yesOverlayWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 230, 64, 0.5)",
    borderRadius: cardBorderRadius,
  },
  skipOverlayWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(117, 119, 189, 0.5)",
    borderRadius: cardBorderRadius,
  },
  overlayText: {
    fontSize: 30,
    color: "#ffffff",
  },
  noOverlay: {
    backgroundColor: "rgb(240, 52, 52)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  yesOverlay: {
    backgroundColor: "rgb(0, 230, 64)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  skipOverlay: {
    backgroundColor: "rgb(117, 119, 189)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default Swiper;
