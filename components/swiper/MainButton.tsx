import Txt from "@/components/Txt";
import { useApp } from "@/contexts/app";
import React from "react";
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { sm } from "@/common/breakpoints";

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  type: "yes" | "no";
}

const YesButton: React.FC<Props> = ({ onPress, type, disabled = false }) => {
  const [active, setActive] = React.useState(false);
  const { t } = useApp();

  const colors = {
    yes: [active === true ? "#12A73B" : "#00E640", "#12A73B"],
    no: [active === true ? "#B92727" : "#F03434", "#B92727"],
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      disabled={disabled}
    >
      <View style={styles.button}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={colors[type]}
          style={styles.bg}
        >
          <Txt style={styles.text} medium>
            {t(type === "yes" ? "swiper.yes" : "swiper.no")}
          </Txt>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const { width } = Dimensions.get("window");

let buttonSize = 60;
let buttonFontSize = 16;

if (width < sm) {
  buttonSize = 50;
  buttonFontSize = 12;
}

export { buttonSize };

const styles = StyleSheet.create({
  button: {
    borderRadius: buttonSize / 2,
    width: buttonSize,
    height: buttonSize,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 2,
  },
  bg: {
    flex: 1,
    borderRadius: buttonSize / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: buttonFontSize,
    color: "#fff",
    textAlign: "center",
  },
});

export default YesButton;
