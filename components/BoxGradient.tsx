import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BoxGradient: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <View style={styles.shadow}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#222043", "#000000"]}
        style={styles.root}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const borderRadius = 5;

const iPhone6 = 375;
const { width } = Dimensions.get("window");

let rootPadding = 20;

if (width < iPhone6) {
  rootPadding = 15;
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius,
    backgroundColor: "#222043",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 1,
  },
  root: {
    padding: rootPadding,
    borderRadius,
  },
});

export default BoxGradient;
