import Container from "@/components/Container";
import FullScreenVideo from "@/components/FullScreenVideo";
import React from "react";
import { useLocalSearchParams, router, useNavigation } from "expo-router";

const SwiperVideo: React.FC = () => {
  const { setOptions } = useNavigation();
  const { video } = useLocalSearchParams();
  React.useEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, [setOptions]);
  return (
    <Container noPadding>
      <FullScreenVideo
        source={{ uri: video as string }}
        onClose={() => {
          router.back();
        }}
      />
    </Container>
  );
};

export default SwiperVideo;
