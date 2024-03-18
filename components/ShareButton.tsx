import React from 'react';
import {TouchableOpacity, Share, Platform, View, StyleSheet} from 'react-native';
import ShareIcon from '@/icons/Share';

interface Props {
  message: string;
  title: string;
  url?: string;
}

const ShareButton: React.FC<Props> = ({message, title, url}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        let shareMessage = message;

        if (Platform.OS === 'android') {
          shareMessage = `${message} ${url ?? ''}`;
        }

        Share.share({
          message: shareMessage,
          title: title,
          url,
        });
      }}>
      <View style={styles.button}>
        <ShareIcon height={24} width={18} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingBottom: 1,
  },
});

export default ShareButton;
