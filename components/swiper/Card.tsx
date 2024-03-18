import { Link, useNavigation } from "expo-router";
import Title from "@/components/Title";
import Txt from "@/components/Txt";
import { useApp } from "@/contexts/app";
import { useSwiper } from "@/contexts/swiper";
import SvgCircleInfo from "@/icons/InfoCircle";
import Play from "@/icons/Play";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
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
import { Question } from "@/types/api";
import rtl from "@/util/rtl";
import { sm } from "@/common/breakpoints";

const Card: React.FC<Question> = ({
  id,
  thumbnail,
  video_url,
  explainer_text,
  thesis,
  topic,
}) => {
  const { navigate } = useNavigation();
  const { t } = useApp();
  const { getDoubleWeightValue, toggleDoubleWeight } = useSwiper();

  const borderAnimationValue = useSharedValue(
    getDoubleWeightValue(id) === false ? 0 : 1
  );

  const cardLink = React.useMemo(() => {
    const button = (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#DB67AE", "#8186D7"]}
        style={styles.videoButton}
      >
        {video_url ? (
          <Play height={24} width={21} style={rtl.mirror} />
        ) : (
          <SvgCircleInfo style={styles.infoIcon} />
        )}
      </LinearGradient>
    );

    if (video_url) {
      return (
        <Link
          href={{
            pathname: "/video/[video]",
            params: { video: video_url },
          }}
          asChild
        >
          <TouchableOpacity activeOpacity={0.9} style={styles.videoLink}>
            {button}
          </TouchableOpacity>
        </Link>
      );
    } else {
      return (
        <Link
          href={{
            pathname: "/explainer/[id]",
            params: { id: id },
          }}
          asChild
        >
          <TouchableOpacity activeOpacity={0.9} style={styles.videoLink}>
            {button}
          </TouchableOpacity>
        </Link>
      );
    }
  }, []);

  const cardThumbnail = React.useMemo(() => {
    return (
      <View style={styles.thumbnail}>
        <Image
          source={{ uri: thumbnail.public_link }}
          style={styles.thumbnailImage}
        />
        {video_url || explainer_text ? cardLink : null}
      </View>
    );
  }, [thumbnail, video_url, explainer_text, navigate, thesis, topic]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(borderAnimationValue.value, [0, 1], [1.05, 1]) },
    ],
  }));
  const border = React.useMemo(() => {
    return (
      <Animated.View pointerEvents="none" style={[styles.border, scaleStyle]} />
    );
  }, [scaleStyle]);

  const toggleDoubleWeightState = React.useCallback(() => {
    borderAnimationValue.value = withTiming(
      getDoubleWeightValue(id) === false ? 1 : 0,
      {
        duration: 150,
        easing: Easing.ease,
      }
    );
    toggleDoubleWeight(id);
  }, [id, getDoubleWeightValue, toggleDoubleWeight]);

  const isDoubleWeighted = getDoubleWeightValue(id);

  const doubleWeight = React.useMemo(() => {
    return (
      <TouchableOpacity
        onPress={toggleDoubleWeightState}
        style={[
          styles.doubleWeightContainer,
          Platform.OS === "ios" ? styles.doubleWeightContainerIOS : null,
        ]}
      >
        <View
          style={[
            styles.doubleWeightLabel,
            isDoubleWeighted ? styles.doubleWeightedLabel : {},
          ]}
        >
          <Txt medium style={styles.doubleWeightText}>
            {isDoubleWeighted === false
              ? t("swiper.doubleWeight")
              : t("swiper.doubleWeighted")}
          </Txt>
        </View>
      </TouchableOpacity>
    );
  }, [isDoubleWeighted, toggleDoubleWeightState, t]);

  return (
    <View style={styles.card}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#FFFFFF", "#D9DAEB"]}
        style={styles.inner}
      >
        {cardThumbnail}
        <View style={styles.content}>
          <Title h5dark uppercase center>
            {topic}
          </Title>
          <Title mainBig center textCenter style={styles.questionText}>
            {thesis}
          </Title>

          {Platform.OS === "android" && doubleWeight}
        </View>

        {Platform.OS === "android" ? null : border}

        {Platform.OS === "ios" && doubleWeight}
      </LinearGradient>
    </View>
  );
};

const { height, width } = Dimensions.get("window");

const cardBorderRadius = 15;

let thumbnailWidth = width - 50 - 30;

if (width < sm) {
  thumbnailWidth = width - 50 - 20;
}

const thumbnailHeight = (thumbnailWidth / 16) * 9;

export { cardBorderRadius };

const styles = StyleSheet.create({
  card: {
    flex: 1,
    position: "relative",
    borderRadius: cardBorderRadius,
    backgroundColor: "#fff",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    //elevation: 5,
    shadowRadius: 40,
  },
  inner: {
    flex: 1,
    borderRadius: cardBorderRadius,
    padding: 25,
  },
  border: {
    borderColor: "#E6E90F",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderWidth: 4,
    borderRadius: cardBorderRadius,
  },
  thumbnail: {
    position: "relative",
    maxHeight: thumbnailHeight,
    flex: 1,
  },
  thumbnailImage: {
    flex: 1,
    borderRadius: 5,
  },
  videoLink: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  videoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    paddingLeft: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: {
    transform: [{ translateX: -2 }],
  },
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    color: "#392F52",
  },
  doubleWeightContainer: {
    height: 32,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "center",
  },
  doubleWeightContainerIOS: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  doubleWeightLabel: {
    height: 30,
    backgroundColor: "transparent",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  doubleWeightedLabel: {
    backgroundColor: "#E6E90F",
  },
  doubleWeightText: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 12,
  },
});

export default Card;
