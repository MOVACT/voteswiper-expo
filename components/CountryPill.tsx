import ArrowRightCircle from "@/icons/ArrowRightCircle";
import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import getCountryFlag from "@/util/getCountryFlag";
import Txt from "@/components/Txt";

interface Props {
  name: string;
  locale: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CountryPill: React.FC<Props> = ({ locale, name, onPress }) => {
  const [active, setActive] = React.useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => {
        setActive(true);
      }}
      onPressOut={() => {
        setActive(false);
      }}
    >
      <View style={[styles.shadow]}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["#fff", active ? "#D2DCFD" : "#EFF3FF"]}
          style={styles.root}
        >
          <View style={styles.flag}>{getCountryFlag(locale)}</View>
          <View style={styles.content}>
            <Txt medium style={styles.title}>
              {name}
            </Txt>
          </View>
          <View>
            <ArrowRightCircle fill="#8186D7" width={20} height={20} />
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const borderRadius = 11;

const styles = StyleSheet.create({
  flag: {
    minWidth: 55,
  },
  shadow: {
    backgroundColor: "#fff",
    borderRadius,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 2,
    marginTop: 15,
  },
  root: {
    borderRadius,
    paddingRight: 15,
    paddingLeft: 11,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    paddingRight: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "#59568B",
  },
  subTitle: {
    fontSize: 14,
    color: "#59568B",
    opacity: 0.75,
    paddingTop: 1,
  },
  icon: {
    textShadowColor: "rgba(129, 134, 215, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
});

export default CountryPill;
