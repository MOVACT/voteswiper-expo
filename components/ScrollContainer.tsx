import React from "react";
import {
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

interface Props extends ScrollViewProps {
  withPadding?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ScrollContainer: React.FC<Props> = ({
  withPadding = false,
  style,
  children,
  ...props
}) => {
  const headerHeight = useHeaderHeight();

  return (
    <View style={styles.flex}>
      <View style={styles.flex}>
        <ScrollView
          {...props}
          style={[
            {
              marginTop: headerHeight + 10,
            },
            style,
          ]}
        >
          <View style={withPadding ? styles.withPadding : {}}>{children}</View>
        </ScrollView>
      </View>
    </View>
  );
};


const iPhone6 = 375;
const {width} = Dimensions.get('window');

let widthPaddingPadding = 30;

if (width < iPhone6) {
  widthPaddingPadding = 20;
}

export const styles = StyleSheet.create({
  withPadding: {
    paddingHorizontal: widthPaddingPadding,
    paddingBottom: widthPaddingPadding,
  },
  flex: {
    flex: 1,
  },
});


export default ScrollContainer;
