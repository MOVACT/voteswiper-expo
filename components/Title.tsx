import React from "react";
import Txt from "@/components/Txt";
import { Dimensions, StyleProp, StyleSheet, TextStyle } from "react-native";

interface Props {
  h1?: boolean;
  h5?: boolean;
  h5dark?: boolean;
  mainBig?: boolean;
  center?: boolean;
  textCenter?: boolean;
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
}

const Title: React.FC<React.PropsWithChildren<Props>> = ({
  h1 = false,
  h5 = false,
  h5dark = false,
  mainBig = false,
  center = false,
  textCenter = false,
  uppercase = false,
  style,
  children,
}) => {
  return (
    <Txt
      style={[
        center ? styles.center : null,
        textCenter ? styles.textCenter : null,
        h1 ? styles.h1 : null,
        h5 ? styles.h5 : null,
        h5dark ? styles.h5 : null,
        h5dark ? styles.h5dark : null,
        mainBig ? styles.mainBig : null,
        style,
      ]}
      medium={h1 || h5 || h5dark ? true : false}
    >
      {uppercase && children ? children.toString().toUpperCase() : children}
    </Txt>
  );
};

const iPhone6 = 375;
const { width } = Dimensions.get("window");

let h5FontSize = 12;
let mainBigFontSize = 18;
let mainBigLineHeight = 24;

if (width < iPhone6) {
  h5FontSize = 10;
  mainBigFontSize = 16;
  mainBigLineHeight = 22;
}

const styles = StyleSheet.create({
  center: {
    alignSelf: "center",
  },
  textCenter: {
    textAlign: "center",
  },

  /* Title Styles */
  h1: {
    color: "#fff",
    fontSize: 18,
    marginTop: 25,
    marginBottom: 5,
  },
  h5: {
    fontSize: h5FontSize,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 2,
    marginTop: 10,
    marginBottom: 5,
  },
  h5dark: {
    color: "#392F52",
    opacity: 0.7,
  },

  mainBig: {
    fontSize: mainBigFontSize,
    lineHeight: mainBigLineHeight,
    paddingBottom: 10,
    color: "#fff",
    fontFamily: 'RubikMedium',
  },
});

export default Title;
