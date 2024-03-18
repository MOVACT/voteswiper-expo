import React from 'react';
import {Dimensions, GestureResponderEvent, Platform, StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import ButtonGradient from '@/components/ButtonGradient';

interface Props {
  actionText?: string;
  actionOnPress?: (event?: GestureResponderEvent) => void;
  withBorder?: boolean;
  topMargin?: number;
}

const Box: React.FC<React.PropsWithChildren<Props>> = ({
  topMargin = 30,
  actionText,
  actionOnPress,
  withBorder = false,
  children,
}) => {
  return (
    <View>
      <View style={[styles.shadow, {marginTop: topMargin}]}>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={['#D9DAEB', '#ffffff']}
          style={[
            styles.root,
            actionText ? styles.withAction : null,
            withBorder === true ? styles.withBorder : null,
          ]}>
          {children}
        </LinearGradient>
      </View>

      {actionText && actionOnPress ? (
        <View style={styles.action}>
          <ButtonGradient text={actionText} onPress={actionOnPress} />
        </View>
      ) : null}
    </View>
  );
};

const borderRadius = 5;

const iPhone6 = 375;
const {width} = Dimensions.get('window');

let rootPadding = 20;
let withActionPaddingHorizontal = 40;
let withActionPaddingTop = withActionPaddingHorizontal;
let withActionPaddingBottom = 60;

if (width < iPhone6) {
  rootPadding = 15;
  withActionPaddingHorizontal = 20;
  withActionPaddingTop = withActionPaddingHorizontal;
  withActionPaddingBottom = 30;
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 0,
    marginTop: 30,
    backgroundColor: 'transparent',
  },
  root: {
    padding: rootPadding,
    borderRadius,
  },

  withAction: {
    marginBottom: 30,
    paddingHorizontal: withActionPaddingHorizontal,
    paddingTop: withActionPaddingTop,
    paddingBottom: withActionPaddingBottom,
  },
  withBorder: {
    borderWidth: Platform.OS === 'android' ? 0 : 4,
    borderColor: '#E6E90F',
    overflow: 'hidden',
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});


export default Box;
