import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

interface Props {
  noPadding?: boolean;
}

const Container: React.FC<React.PropsWithChildren<Props>> = ({
  noPadding = false,
  children,
}) => {
  return (
    <LinearGradient
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      colors={["#392F52", "#7577BD"]}
      style={[styles.root, noPadding ? styles.noPadding : null]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  noPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default Container;
