import Container from "@/components/Container";
import ScrollContainer from "@/components/ScrollContainer";
import Title from "@/components/Title";
import Txt from "@/components/Txt";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSwiper } from "@/contexts/swiper";
import Loader from "@/components/Loader";

const SwiperExplainer: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { election } = useSwiper();

  const question = React.useMemo(() => {
    if (id) {
      return election?.questions.find((q) => q.id === parseInt(id + ""));
    }

    return undefined;
  }, [id]);

  if (!question) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollContainer>
        <View style={styles.content}>
          <Title h5 uppercase>
            {question.topic}
          </Title>
          <Title mainBig>{question.thesis}</Title>

          <Txt style={styles.text}>{question.explainer_text}</Txt>
        </View>
      </ScrollContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 25,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",
  },
});

export default SwiperExplainer;
