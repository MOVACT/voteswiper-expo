import {useApp} from '@/contexts/app';
import React from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Election} from '@/types/api';
import moment from '@/util/momentLocale';
import ArrowRightCircle from '@/icons/ArrowRightCircle';
import rtl from '@/util/rtl';
import Txt from '@/components/Txt';

interface Props extends Election {
  onPress: (event: GestureResponderEvent) => void;
}

const ElectionPill: React.FC<Props> = ({
  onPress,
  card,
  name,
  voting_day,
  playable,
  playable_date,
}) => {
  const {t, language} = useApp();
  const [clickActive, setActiveClick] = React.useState(false);

  moment.locale(language || 'de');

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => {
        setActiveClick(true);
      }}
      onPressOut={() => {
        setActiveClick(false);
      }}
      disabled={!playable}>
      <View style={[styles.shadow, playable ? {} : styles.disabled]}>
        <View style={styles.cardHolder}>
          <Image
            source={{uri: card.public_link}}
            resizeMode="cover"
            style={styles.card}
          />
        </View>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#fff', clickActive ? '#D2DCFD' : '#EFF3FF']}
          style={styles.root}>
          <View style={styles.content}>
            <Txt medium style={styles.title}>
              {name}
            </Txt>
            <Txt medium style={styles.subTitle}>
              {playable
                ? moment(voting_day).format('LL')
                : t('electionPill.availableFrom', [
                    moment(playable_date).format('LL'),
                  ])}
            </Txt>
          </View>
          <View>
            <ArrowRightCircle
              fill="#8186D7"
              width={20}
              height={20}
              style={rtl.mirror}
            />
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const borderRadius = 11;

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: '#fff',
    borderRadius,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 2,
    marginTop: 20,
  },
  card: {
    aspectRatio: 16 / 9,
  },
  cardHolder: {
    borderTopLeftRadius: borderRadius - 1,
    borderTopRightRadius: borderRadius - 1,
    overflow: 'hidden',
  },
  root: {
    borderRadius,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexWrap: 'wrap',
    color: '#59568B',
  },
  subTitle: {
    fontSize: 14,
    color: '#59568B',
    opacity: 0.75,
    paddingTop: 1,
  },
  icon: {
    textShadowColor: 'rgba(129, 134, 215, 0.2)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 5,
  },
});


export default ElectionPill;
