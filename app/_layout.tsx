import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import MatomoTracker, { MatomoProvider } from "matomo-tracker-react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Constants from "expo-constants";

import { useColorScheme } from "@/components/useColorScheme";
import AppProvider, { useApp } from "@/contexts/app";
import Container from "@/components/Container";
import Loader from "@/components/Loader";
import { StatusBar } from "expo-status-bar";
import { OneSignal } from "react-native-onesignal";
import SelectCountry from "@/components/SelectCountry";
import SwiperProvider from "@/contexts/swiper";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const instance = new MatomoTracker({
    urlBase: "https://t.voteswiper.org/", // required
    // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
    siteId: 1, // required, number matching your Matomo project
    // userId: 'UID76903202' // optional, default value: `undefined`.
    // disabled: false, // optional, default value: false. Disables all tracking operations if set to true.
    // log: false  // optional, default value: false. Enables some logs if set to true.
  });

  const [loaded, error] = useFonts({
    RubikRegular: require("../assets/fonts/Rubik-Regular.ttf"),
    RubikMedium: require("../assets/fonts/Rubik-Medium.ttf"),
    RubikBold: require("../assets/fonts/Rubik-Bold.ttf"),
    ...FontAwesome.font,
  });

  OneSignal.initialize(Constants.expoConfig!.extra!.oneSignalAppId);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <MatomoProvider instance={instance}>
      <AppProvider>
        <SwiperProvider>
          <StatusBar style="light" />
          <RootLayoutNav />
        </SwiperProvider>
      </AppProvider>
    </MatomoProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { hydrated, country, t } = useApp();

  if (!hydrated) {
    return (
      <Container>
        <Loader fullscreen />
      </Container>
    );
  }

  if (!country) {
    return <SelectCountry />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="swiperGame"
          options={{
            gestureEnabled: false,
            headerTransparent: true,
            title: "",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="swiperChooseParties"
          options={{
            gestureEnabled: false,
            headerTransparent: true,
            title: "",
          }}
        />
        <Stack.Screen
          name="swiperResult"
          options={{
            gestureEnabled: false,
            headerTransparent: true,
            title: "",
          }}
        />
        <Stack.Screen
          name="swiperEditAnswers"
          options={{
            gestureEnabled: false,
            headerTransparent: true,
            headerTintColor: "#fff",
            title: t("swiperResult.editAnswers"),
          }}
        />
        <Stack.Screen
          name="swiperCompareParty/[party]"
          options={{
            gestureEnabled: false,
            headerTransparent: true,
            headerTintColor: "#fff",
            title: "",
          }}
        />
        <Stack.Screen
          name="video/[video]"
          options={{
            headerTransparent: true,
            title: "",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="explainer/[id]"
          options={{
            headerTransparent: true,
            title: "",
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#fff" },
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
