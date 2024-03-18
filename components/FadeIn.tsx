import React from "react";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  delay?: number;
}

const FadeIn: React.FC<React.PropsWithChildren<Props>> = ({
  delay = 0,
  children,
}) => {
  const animValue = useSharedValue(0);

  React.useEffect(() => {
    setTimeout(() => {
      animValue.value = withTiming(1, {
        duration: 100,
        easing: Easing.ease,
      });
    }, delay);
  }, [delay]);

  const scaleStyle = useAnimatedStyle(() => ({
    opacity: animValue.value,
    transform: [{ scale: interpolate(animValue.value, [0, 1], [0.9, 1]) }],
  }));

  return (
    <Animated.View
      style={scaleStyle}
    >
      {children}
    </Animated.View>
  );
};

export default FadeIn;
