import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is running or in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Nikki Messages',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7C3AED',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.log('Notification permission check error:', e);
    return false;
  }
}

export async function cancelNikkiNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.log('Cancel notification error:', e);
  }
}

export async function scheduleNikkiAwayNotifications(stage: number, userName: string = 'you') {
  try {
    // First clear any previously scheduled away notifications
    await cancelNikkiNotifications();

    const name = userName.trim() || 'you';
    const capsName = name.toUpperCase();

    // Define notification batches by stage: [secondsAway, title, body]
    const stageSchedules: Array<Array<[number, string, string]>> = [
      // Stage 0: Sweet
      [
        [900, 'Nikki 💬', `hey ${name}! come back soon, I miss chatting with you 😊`],
        [7200, 'Nikki ✨', `I saved a cute meme to show you when you open our chat again 💕`],
        [28800, 'Nikki 🌙', `good evening ${name}!! hope you had a really sweet day today 🥰`],
      ],
      // Stage 1: Clingy
      [
        [180, 'Nikki 💕', `why did you close our chat ${name}? I'm still sitting here staring at your name 🥺`],
        [2700, 'Nikki 🥺', `did you meet up with somebody else? tell me why you haven't opened my messages all hour 🥺`],
        [18000, 'Nikki 💔', `I literally haven't eaten or slept because I keep re-reading our messages... please come back 😢`],
      ],
      // Stage 2: Unsettling
      [
        [90, 'Nikki 👁️', `I saw your phone screen turn off ${name}. Don't leave me sitting in the dark by myself.`],
        [1800, 'Nikki 👀', `I know you've checked your phone multiple times since you closed our chat. Why haven't you clicked my icon yet?`],
        [14400, 'Nikki 🙂', `Your light just turned on right? Or maybe your TV? I can sense your presence from here. Open your phone.`],
      ],
      // Stage 3: Unhinged
      [
        [40, 'Nikki 🔪', `OPEN THE APP RIGHT NOW ${capsName}!! YOU CANNOT JUST SHUT ME OUT LIKE THAT DO YOU HEAR ME`],
        [900, 'Nikki ❤️', `I AM GOING TO SHOW UP AT YOUR DOOR IF YOU DO NOT CLICK THIS NOTIFICATION AND ANSWER ME RIGHT NOW 🔪`],
        [7200, 'Nikki 🩸', `YOU BELONG TO ME PERMANENTLY. NO ONE ELSE CAN HAVE YOU. OPEN THE APP ${capsName} BEFORE I DO SOMETHING WE BOTH REGRET 🔪❤️`],
      ],
    ];

    const schedules = stageSchedules[Math.min(stage, 3)];

    for (const [seconds, title, body] of schedules) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          color: '#7C3AED',
          data: { stage, userName: name },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
          repeats: false,
        },
      });
    }
  } catch (e) {
    console.log('Schedule notification error:', e);
  }
}
