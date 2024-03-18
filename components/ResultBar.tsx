import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ChevronRight from "@/icons/ChevronRight";
import rtl from "@/util/rtl";
import Txt from "@/components/Txt";

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  name: string;
  percentage: number;
  delay?: number;
  shareBar?: boolean;
}

export const roundNumber = (num: number, scale: number) => {
  if (!("" + num).includes("e")) {
    return +(Math.round(Number(num + "e+" + scale)) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(
      Math.round(Number(+arr[0] + "e" + sig + (+arr[1] + scale))) +
      "e-" +
      scale
    );
  }
};

const ResultBar: React.FC<Props> = ({
  delay = 0,
  shareBar = false,
  name,
  percentage,
  onPress,
}) => {
  const mounted = React.useRef(false);
  //const width = React.useRef(0);
  //const barWidth = React.useRef(0);

  const [width, setWidth] = React.useState(0);
  const [barWidth, setBarWidth] = React.useState(0);

  const animation = useSharedValue(0);

  const [initialKick, setInitialKick] = React.useState(false);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 1, 2], [0, 1, 1]),
  }));

  const barAnimationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          shareBar === true
            ? 0
            : interpolate(
                animation.value,
                [0, 0.75, 2],
                [-width, -width, -width + barWidth]
              ),
      },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          animation.value,
          [0, 1, 1.75, 2],
          [40, 40, 10, 0]
        ),
      },
    ],
  }));

  React.useEffect(() => {
    if (initialKick === true && mounted.current === false) {
      setTimeout(() => {
        mounted.current = true;
        animation.value = withTiming(2, {
          duration: 750,
          easing: Easing.out(Easing.quad),
        });
      }, delay);
    }
  }, [initialKick, delay]);

  return (
    <Animated.View style={opacityStyle}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View
          style={styles.root}
          onLayout={(event) => {
            const { width: viewWidth } = event.nativeEvent.layout;

            setWidth(viewWidth);
            setBarWidth((viewWidth * percentage) / 100);

            // width.current = viewWidth;
            //barWidth.current =

            // We need one state update before animation to get the correct width and height
            // we could also store the width in state but I want to prevent unneccessary state
            // updates in cases where "onLayout" may be fired again, as we don't need them
            // as long as the app is non rotateable
            setInitialKick(true);
          }}
        >
          <Animated.View
            style={[
              styles.bar,
              {
                width: shareBar === true ? barWidth : width,
              },
              barAnimationStyle,
            ]}
          />

          <Animated.View style={[styles.content, contentStyle]}>
            <Txt medium style={styles.text}>
              {name}
            </Txt>

            <View style={styles.meta}>
              <Txt medium style={styles.text}>
                {roundNumber(percentage, 1).toLocaleString("de-DE")}%
              </Txt>
              {shareBar !== true ? (
                <View style={styles.icon}>
                  <ChevronRight style={rtl.mirror} />
                </View>
              ) : null}
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 40,
    borderRadius: 3,
    backgroundColor: "#8186D7",
    overflow: "hidden",
  },
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 1,
    borderRadius: 3,
    backgroundColor: "#8186D7",
    marginTop: 10,
  },
  bar: {
    backgroundColor: "#DB67AE",
    height: 40,
    borderRadius: 3,
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 15,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 14,
  },
  icon: {
    marginLeft: 5,
  },
});

export default ResultBar;
