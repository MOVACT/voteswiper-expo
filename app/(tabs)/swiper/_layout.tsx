import Settings from "@/icons/Settings";
import { Link, Stack } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const iPhone6 = 375;
const { width } = Dimensions.get("window");

let titleFontSize = 14;
let backButtonMarginLeft = 30;
if (width < iPhone6) {
  titleFontSize = 12;
  backButtonMarginLeft = 20;
}

const styles = StyleSheet.create({
  settingsIcon: {
    marginRight: 20,
  },
  header: {
    //borderBottomWidth: 0,
    //elevation: 0,
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
});

const headerScreenOptions = {
  headerStyle: styles.header,
  headerTransparent: true,
  headerTintColor: "#ffffff",
  headerBackTitleStyle: styles.backTitle,
  headerTitleStyle: styles.titleStyle,
};

const Layout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        ...headerScreenOptions,
        //headerBackTitle: t('navigation.backTitle'),
        headerRight: () => (
          <Link href="/(tabs)/swiper/settings" asChild>
            <TouchableOpacity style={styles.settingsIcon}>
              <Settings />
            </TouchableOpacity>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="selectCountry" options={{ title: "" }} />
      <Stack.Screen name="detail" options={{ title: "" }} />
    </Stack>
  );
};

export default Layout;
