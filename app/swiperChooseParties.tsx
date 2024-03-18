import { Link, useFocusEffect, useNavigation, router } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import ButtonGradient from "@/components/ButtonGradient";
import Container from "@/components/Container";
import FadeIn from "@/components/FadeIn";
import Txt from "@/components/Txt";
import { useApp } from "@/contexts/app";
import { useSwiper } from "@/contexts/swiper";
import Close from "@/icons/Close";
import React from "react";
import { ifIphoneX } from "@/util/iPhoneXHelper";
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ExitConfirmDialog from "@/components/swiper/ExitConfirmDialog";
import NavigationButton from "@/components/swiper/NavigationButton";
import { styles as swiperStyles } from "./swiperGame";
import { sm } from "@/common/breakpoints";

const SwiperChooseParties: React.FC = () => {
  const { t } = useApp();
  const delay = React.useRef(200);
  const { goBack, setOptions, dispatch } = useNavigation();
  const animation = useSharedValue(0);
  const headerHeight = useHeaderHeight();
  const [exitConfirmation, showExitConfirmation] = React.useState(false);

  const {
    toggleParty,
    clearAnswers,
    isPartyActive,
    selectAllParties,
    unselectAllParties,
    isUnselected,
    election,
    parties,
  } = useSwiper();

  React.useEffect(() => {
    animation.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  React.useEffect(() => {
    setOptions({
      headerLeft: () => {
        return (
          <View style={swiperStyles.headerLeft}>
            <View style={swiperStyles.headerNavigation}>
              <NavigationButton
                onPress={() => {
                  goBack();
                }}
                type="previous"
              />
            </View>
            <View style={swiperStyles.headerTitle}>
              <Txt medium style={swiperStyles.headerTitleText}>
                {t("swiperResult.chooseParties")}
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
          <View style={swiperStyles.headerClose}>
            <TouchableOpacity
              style={swiperStyles.headerCloseAction}
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
  }, [setOptions, goBack, t]);

  const handleBackButton = React.useCallback(() => {
    showExitConfirmation(true);
    return true;
  }, []);

  useFocusEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  });

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 1, 2], [1, 1, 0]),
  }));

  const hasEnoughParties = React.useMemo(() => {
    if (!parties[election!.id]) {
      return false;
    }

    if (parties[election!.id].length === 0) {
      return false;
    }

    return true;
  }, [election, parties]);

  return (
    <Container>
      <View style={styles.container}>
        <View style={[styles.content, { marginTop: headerHeight }]}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Txt style={styles.text}>{t("swiperSelectParties.text")}</Txt>

            <View style={styles.actions}>
              <TouchableOpacity
                disabled={
                  typeof parties[election!.id] !== "undefined" &&
                  parties[election!.id].length >= election!.parties.length
                }
                onPress={() => {
                  selectAllParties(election!.parties);
                }}
                style={[
                  styles.action,
                  typeof parties[election!.id] !== "undefined" &&
                  parties[election!.id].length >= election!.parties.length
                    ? styles.actionDisabled
                    : {},
                ]}
              >
                <Txt medium center style={styles.actionText}>
                  {t("swiperSelectParties.checkAll")}
                </Txt>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isUnselected()}
                onPress={() => {
                  unselectAllParties();
                }}
                style={[
                  styles.action,
                  isUnselected() ? styles.actionDisabled : {},
                ]}
              >
                <Txt medium center style={styles.actionText}>
                  {t("swiperSelectParties.uncheckAll")}
                </Txt>
              </TouchableOpacity>
            </View>

            <Animated.View style={[styles.list, opacityStyle]}>
              {election!.parties.map((party) => {
                delay.current = delay.current + 75;

                return (
                  <View style={styles.party} key={party.slug}>
                    <FadeIn delay={delay.current}>
                      <TouchableOpacity
                        onPress={() => {
                          toggleParty(party.id);
                        }}
                        style={styles.partyShadow}
                      >
                        <LinearGradient
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          colors={["#D9DAEB", "#ffffff"]}
                          style={[
                            styles.partyBg,
                            isPartyActive(party) ? styles.partySelected : null,
                          ]}
                        >
                          <Image
                            source={{ uri: party.logo.public_link }}
                            style={styles.partyLogo}
                          />
                          <Txt medium center style={styles.partyName}>
                            {party.name}
                          </Txt>
                        </LinearGradient>
                      </TouchableOpacity>
                    </FadeIn>
                  </View>
                );
              })}
            </Animated.View>
          </ScrollView>

          <View style={styles.progress}>
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 0 }}
              colors={["rgba(0, 0, 0, 0.95)", "transparent"]}
              style={styles.progressBg}
            >
              <Link href="/swiperResult" asChild>
                <ButtonGradient
                  onPress={() => {}}
                  text={
                    !hasEnoughParties
                      ? t("swiperSelectParties.chooseMinOne")
                      : t("swiperSelectParties.nextButton")
                  }
                  disabled={!hasEnoughParties}
                />
              </Link>
            </LinearGradient>
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
            dispatch({ type: "POP_TO_TOP" });
          }}
        />
      )}
    </Container>
  );
};

const { width } = Dimensions.get("window");

const partyBorderRadius = 10;
let partyBgPadding = 10;
let partyLogoHeight = 50;

if (width < sm) {
  partyBgPadding = 5;
  partyLogoHeight = 60;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
    overflow: "hidden",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  scrollView: {
    padding: 25,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: -5,
  },
  action: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionText: {
    alignSelf: "center",
    color: "#fff",
  },
  partyLogo: {
    resizeMode: "contain",
    height: partyLogoHeight,
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginHorizontal: -5,
    marginTop: 15,
    paddingBottom: 90,
  },
  party: {
    width: "50%",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  partyShadow: {
    backgroundColor: "#D9DAEB",
    borderRadius: partyBorderRadius,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 1,
  },
  partyBg: {
    padding: partyBgPadding,
    borderRadius: partyBorderRadius,
    borderWidth: 4,
    borderColor: "transparent",
    overflow: "hidden",
  },
  partySelected: {
    borderColor: "#E6E90F",
  },
  partyName: {
    alignSelf: "center",
    fontSize: 12,
    paddingTop: 10,
  },
  progress: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressBg: {
    paddingHorizontal: 25,
    ...ifIphoneX({ paddingBottom: 30 }, { paddingBottom: 20 }),
  },
});

export default SwiperChooseParties;
