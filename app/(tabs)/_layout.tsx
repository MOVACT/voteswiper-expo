import React from "react";
import { Tabs } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import HelpIcon from "@/icons/HelpCircle";
import InfosIcon from "@/icons/InfoCircle";
import ElectionsIcon from "@/icons/Swiper";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";
import { useApp } from "@/contexts/app";

const iPhone6 = 375;
const { width } = Dimensions.get("window");

let titleFontSize = 14;
let backButtonMarginLeft = 30;
if (width < iPhone6) {
  titleFontSize = 12;
  backButtonMarginLeft = 20;
}

const navigatorStyles = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    elevation: 0,
  },
  backButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: backButtonMarginLeft,
  },
  titleStyle: {
    color: "#fff",
    alignSelf: "center",
    fontSize: titleFontSize,
    fontFamily: "RubikMedium",
    //marginLeft: Platform.OS === "android" ? 8 : -5,
    paddingLeft: 0,
    elevation: 0,
  },
  backTitle: {
    fontSize: titleFontSize,
    fontFamily: "RubikMedium",
    color: "#fff",
  },
  settingsIcon: {
    marginRight: 30,
  },
});

function getIcon(name: string): React.FC<SvgProps> {
  switch (name) {
    case "swiper":
      return ElectionsIcon;
    case "help":
      return HelpIcon;
    case "infos":
      return InfosIcon;
  }

  return ElectionsIcon;
}

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'swiper',
};


export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const { t } = useApp();

  return (
    <Tabs
    initialRouteName="swiper"
      screenOptions={({ route }) => {
        return {
          tabBarStyle: {
            backgroundColor: "rgb(39, 31, 59)",
            borderTopWidth: 0,
            paddingBottom: bottom - 8,
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
          tabBarLabelStyle: {
            fontSize: 9,
            fontFamily: "RubikMedium",
            marginTop: 0,
            paddingTop: 0,
          },
          tabBarIcon: ({ focused }) => {
            const routeName = route.name;

            const Icon = getIcon(routeName);

            return (
              <View
                style={{
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 0,
                  opacity: focused ? 1 : 0.5,
                }}
              >
                <Icon />
              </View>
            );
          },
        };
      }}
    >
      <Tabs.Screen name="index" options={{ href: null, headerShown: false }} />

      <Tabs.Screen
        name="help"
        options={{
          headerStyle: navigatorStyles.header,
          headerTransparent: true,
          headerTitleStyle: navigatorStyles.titleStyle,
          title: t("helpIndex.title"),
          tabBarLabel: t("navigation.helpTitle"),
        }}
      />
      <Tabs.Screen
        name="swiper"
        options={{
          headerShown: false,
          tabBarLabel: t("navigation.electionsTitle"),
        }}
      />
      <Tabs.Screen
        name="infos"
        options={{
          tabBarLabel: t("navigation.infoTitle"),
          headerStyle: navigatorStyles.header,
          headerTransparent: true,
          headerTitleStyle: navigatorStyles.titleStyle,
          title: t("infosIndex.title"),
        }}
      />
    </Tabs>
  );
}

/**
 *           headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
 */
