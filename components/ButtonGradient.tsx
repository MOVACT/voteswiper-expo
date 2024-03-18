import React from "react";
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Txt from "@/components/Txt";

interface Props {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

const ButtonGradient: React.FC<Props> = ({
  text,
  disabled = false,
  onPress,
}) => {
  const [active, setActive] = React.useState(false);

  const color1 = React.useMemo(() => {
    if (disabled) {
      return "#49223A";
    }

    if (active === true) {
      return "#8186D7";
    }

    return "#DB67AE";
  }, [active, disabled]);

  const color2 = React.useMemo(() => {
    if (disabled) {
      return "#2B2C47";
    }

    return "#8186D7";
  }, [disabled]);

  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        setActive(true);
      }}
      onPressOut={() => {
        setActive(false);
      }}
      onPress={onPress}
      style={styles.buttonOuter}
      disabled={disabled}
    >
      <View style={styles.button}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[color1, color2]}
          style={[styles.bg, active === true ? styles.bgActive : {}]}
        />
        <View style={styles.inner}>
          <Txt style={styles.text} medium>
            {text}
          </Txt>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const iPhone6 = 375;
const { width } = Dimensions.get("window");

let innerPaddingHorizontal = 40;
let innerHeight = 60;
let textFontSize = 18;

if (width < iPhone6) {
  innerPaddingHorizontal = 30;
  innerHeight = 50;
  textFontSize = 16;
}

const borderRadius = 15;

const styles = StyleSheet.create({
  buttonOuter: {
    alignSelf: "center",
  },
  button: {
    marginTop: 10,
  },
  inner: {
    borderRadius,
    backgroundColor: "transparent",
    paddingHorizontal: innerPaddingHorizontal,
    height: innerHeight,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: textFontSize,
    color: "#fff",
    alignSelf: "center",
    textAlign: "center",
  },
  bg: {
    borderRadius,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  bgActive: {
    opacity: 1,
  },
});

export default ButtonGradient;
