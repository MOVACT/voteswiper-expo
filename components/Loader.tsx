import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface Props {
  fullscreen?: boolean;
}

const Loader: React.FC<Props> = ({ fullscreen = false }) => {
  return (
    <View style={[styles.loader, fullscreen ? styles.loaderFull : {}]}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 50,
  },
  loaderFull: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loader;
