import ArrowLeft from "@/icons/ArrowLeft";
import ArrowRight from "@/icons/ArrowRight";
import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import rtl from "@/util/rtl";

interface Props {
  type: "previous" | "next";
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const NavigationButton: React.FC<Props> = ({ onPress, disabled, type }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      disabled={disabled}
    >
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#464872", "#5D5D94"]}
        style={[styles.bg, disabled ? styles.disabled : {}]}
      >
        {type === "previous" ? (
          <ArrowLeft style={rtl.mirror} />
        ) : (
          <ArrowRight style={rtl.mirror} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  bg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default NavigationButton;
