import React from "react";
import { View, StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import Txt from "@/components/Txt";
import SvgClose from "@/icons/Close";
import { ifIphoneX, isIphoneX } from "@/util/iPhoneXHelper";

interface Props {
  onClose: () => void;
  source: { uri: string };
}

const FullScreenVideo: React.FC<Props> = ({ onClose, source }) => {
  const interval = React.useRef<NodeJS.Timeout>();
  const player = React.useRef<Video>(null);
  const currentTimeRef = React.useRef(0);

  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    if (!isIphoneX()) {
      StatusBar.setHidden(true, "slide");
    }

    () => {
      StatusBar.setHidden(false, "slide");

      clearInterval(interval.current);
    };
  }, []);

  const updateCurrentTime = React.useCallback(() => {
    setCurrentTime(currentTimeRef.current);
  }, [currentTimeRef]);

  const renderCloseButton = React.useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          onClose();
        }}
      >
        <LinearGradient
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          colors={["#464872", "#5D5D94"]}
          style={[styles.control]}
        >
          <SvgClose width="10" height="10" />
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [onClose]);

  return (
    <View style={styles.videoPlayer}>
      <View style={styles.videoPlayerInner}>
        <Video
          shouldPlay
          source={source} // Can be a URL or a local file.
          ref={player}
          resizeMode={ResizeMode.CONTAIN}
          isMuted={false}
          style={styles.video}
          onLoad={(info) => {
            interval.current = setInterval(updateCurrentTime, 1000);
          }}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              if (status.didJustFinish) {
                onClose();
              } else {
                setDuration(
                  status.durationMillis ? status.durationMillis / 1000 : 0
                );
                currentTimeRef.current = status.positionMillis / 1000;
              }
            }
          }}
        />
        <View style={styles.videoToolBar}>
          <View style={styles.timeRemainingBg}>
            <Txt medium style={styles.timeRemaining}>
              {duration - currentTime < 1
                ? 0
                : Math.trunc(duration - currentTime)}
            </Txt>
          </View>

          {renderCloseButton}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoPlayer: {
    position: "absolute",
    zIndex: 2000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    ...ifIphoneX(
      {
        paddingTop: 44,
        paddingBottom: 34,
      },
      {}
    ),
  },
  videoPlayerInner: {
    flex: 1,
  },
  video: {
    flex: 1,
  },

  videoProgress: {
    position: "absolute",
    zIndex: 2120,
    top: 0,
    left: 0,
    height: 5,
    width: "100%",
    backgroundColor: "#DB67AE",
  },
  videoToolBar: {
    position: "absolute",
    zIndex: 2100,
    top: 0,
    left: 0,
    right: 0,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  timeRemainingBg: {
    backgroundColor: "#fff",
    height: 26,
    width: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timeRemaining: {
    color: "#000",
    fontSize: 14,
  },
  control: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FullScreenVideo;
