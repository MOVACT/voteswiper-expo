import React from "react";
import {
  I18nManager,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";

interface Props {
  style?: StyleProp<TextStyle>;
  medium?: boolean;
  bold?: boolean;
  copy?: boolean;
  center?: boolean;
}

const Txt: React.FC<React.PropsWithChildren<Props>> = ({
  medium = false,
  bold = false,
  copy = false,
  center = false,
  style,
  children,
}) => {
  return (
    <Text
      style={[
        styles.text,
        medium ? styles.textMedium : null,
        bold ? styles.textBold : null,
        copy ? styles.copy : null,
        center ? styles.center : null,
        style,
      ]}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    backgroundColor: "transparent",
    fontFamily: Platform.isTV ? "System" : "RubikRegular",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
  textMedium: {
    fontFamily: Platform.isTV ? "System" : "RubikMedium",
    fontWeight: "500",
  },
  textBold: {
    fontFamily: Platform.isTV ? "System" : "RubikBold",
    fontWeight: "bold",
  },
  copy: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  center: {
    textAlign: "center",
  },
});

export default Txt;
