import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  if (!Device.isDevice) {
    console.log("Notifications need a physical device");
    return false;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-reminders", {
      name: "Daily Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF4FA3",
    });
  }

  return true;
}

export async function cancelAllBudgetNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleMorningReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good morning ☀️",
      body: "Don’t forget to upload your budget and track today’s spending.",
      sound: false,
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

export async function scheduleEveningReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "End of day reminder 🌙",
      body: "Upload today’s transactions before the day ends for better results.",
      sound: false,
    },
    trigger: {
      hour: 20,
      minute: 30,
      repeats: true,
    },
  });
}

export async function setupBudgetReminders() {
  const granted = await requestNotificationPermissions();

  if (!granted) return false;

  await cancelAllBudgetNotifications();
  await scheduleMorningReminder();
  await scheduleEveningReminder();

  return true;
}