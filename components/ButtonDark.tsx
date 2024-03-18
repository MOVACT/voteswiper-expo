import React from "react";
import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Txt from "@/components/Txt";

interface Props {
  text: string | React.ReactElement;
  icon?: string;
  center?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const ButtonDark: React.FC<Props> = ({ text, center = false, onPress }) => {
  const [active, setActive] = React.useState(false);

  return (
    <TouchableHighlight
      onPressIn={() => {
        setActive(true);
      }}
      onPressOut={() => {
        setActive(false);
      }}
      onPress={onPress}
      underlayColor="rgba(0,0,0,0)"
    >
      <View style={styles.button}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,1)"]}
          style={[styles.bg, active === true ? styles.bgActive : {}]}
        />
        <View style={styles.inner}>
          {center === true ? (
            <View style={styles.textWithIcon}>
              <Txt style={styles.text} medium>
                {text}
              </Txt>
            </View>
          ) : (
            <Txt style={styles.text} medium>
              {text}
            </Txt>
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

const borderRadius = 10;

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    position: "relative",
  },
  inner: {
    borderRadius,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: Platform.isTV ? 15 : 11,
    paddingBottom: Platform.isTV ? 19 : 13,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: Platform.isTV ? 29 : 14,
    color: "#fff",
  },
  bg: {
    borderRadius,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  bgActive: {
    opacity: 0.8,
  },
  icon: {
    marginRight: 10,
  },
  textWithIcon: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ButtonDark;
