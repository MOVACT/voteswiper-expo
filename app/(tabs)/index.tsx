import Container from "@/components/Container";
import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";

const Test: React.FC = () => {
  return (
    <Container>
      <Redirect href="/(tabs)/swiper" />
    </Container>
  );
};

export default Test;
