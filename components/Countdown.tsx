import React from "react";
import { StyleSheet, View } from "react-native";
import Txt from "@/components/Txt";
import moment from "@/util/momentLocale";
import { useApp } from "@/contexts/app";

interface Props {
  date: string;
}

const calculateRemainingTime = (date: string) => {
  const total =
    // @ts-expect-error
    Date.parse(moment(date).toDate()) - Date.parse(new Date().toISOString());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

const Countdown: React.FC<Props> = ({ date }) => {
  const interval = React.useRef<any>(null);
  const { t } = useApp();
  const [remainingTime, setRemainingTime] = React.useState<{
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>(calculateRemainingTime(date));

  const updateCountdown = React.useCallback(() => {
    setRemainingTime(calculateRemainingTime(date));
  }, [date]);

  React.useEffect(() => {
    interval.current = setInterval(updateCountdown, 1000);

    () => {
      clearInterval(interval.current);
    };
  }, [updateCountdown]);

  return (
    <View style={styles.countdown}>
      {remainingTime.days > 0 ? (
        <View style={styles.column}>
          <Txt bold style={styles.number}>
            {remainingTime.days}
          </Txt>
          <Txt medium style={styles.label}>
            {t("countdown.days")}
          </Txt>
        </View>
      ) : null}

      <View style={styles.column}>
        <Txt bold style={styles.number}>
          {("0" + remainingTime.hours).slice(-2)}
        </Txt>
        <Txt medium style={styles.label}>
          {t("countdown.hours")}
        </Txt>
      </View>

      <View style={styles.column}>
        <Txt bold style={styles.number}>
          {("0" + remainingTime.minutes).slice(-2)}
        </Txt>
        <Txt medium style={styles.label}>
          {t("countdown.minutes")}
        </Txt>
      </View>

      <View style={styles.column}>
        <Txt bold style={styles.number}>
          {("0" + remainingTime.seconds).slice(-2)}
        </Txt>
        <Txt medium style={styles.label}>
          {t("countdown.seconds")}
        </Txt>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  countdown: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingBottom: 10,
    paddingTop: 10,
  },
  column: {
    paddingHorizontal: 5,
    flexDirection: "column",
    alignItems: "center",
  },
  number: {
    color: "#fff",
    fontSize: 24,
  },
  label: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 10,
    letterSpacing: 2,
  },
});

export default Countdown;
