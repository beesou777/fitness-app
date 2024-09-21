<template>
  <ion-app>
    <ion-menu side="start" menu-id="first" content-id="main">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item detail @click="profile">Profile</ion-item>
          <ion-item detail @click="settings">Settings</ion-item>
          <ion-item detail @click="intervalTimer">Interval Timer</ion-item>
          <ion-item @click="logout">Logout</ion-item>
        </ion-list>
      </ion-content>
      <ion-footer class="bar-stable">
        <ion-item lines="full">
          <ion-icon slot="start" :icon="moon"></ion-icon>
          <ion-label> Toggle Dark Theme </ion-label>
          <ion-toggle
            @ionChange="changeTheme($event.detail.checked)"
            :checked="theme == 'dark'"
            slot="end"
          ></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>{{ version }}</ion-label>
          <ion-icon :icon="cloudDownloadOutline" slot="end" @click="updateApp"></ion-icon>
        </ion-item>
      </ion-footer>
    </ion-menu>

    <ion-router-outlet id="main" />
  </ion-app>
</template>
<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonFooter,
  IonIcon,
  IonLabel,
  IonToggle,
  menuController,
  useBackButton, 
  useIonRouter
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { cloudDownloadOutline, moon } from 'ionicons/icons';

import { logout, isLoggedIn, storeFCMToken } from "@/service/AuthService";
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { AppVersion } from '@ionic-native/app-version';
import { Downloader } from '@ionic-native/downloader';
import { get, set } from "@/helper/storage";
import { showToast } from '@/utils/show-toast';
import { App } from '@capacitor/app';
import router from "./router";

const version = ref<string>("");
const theme = ref<string>("light");

// Initialize Push Notifications and register for FCM
onMounted(() => {
  if (Capacitor.isPluginAvailable('PushNotifications')) {
    PushNotifications.requestPermissions().then(result => {
      console.log('pushNotificationReceived permission:' + JSON.stringify(result));
      PushNotifications.register();
    });

    PushNotifications.addListener('registration', (token) => {
      console.log('pushNotification registration, token: ' + token.value);
      isLoggedIn().then((res) => {
        if (res) {
          storeFCMToken({"token": token.value});
        }
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', async (notificationaction) => {
      console.log(`pushNotificationActionPerformed  ${JSON.stringify(notificationaction)}`);
      const data = notificationaction.notification.data;
      if (data.url) {
        router.push("/" + data.url);
      }
    });
  }

  // Get saved theme and set version if on native platform
  get("theme").then((selectedTheme) => {
    theme.value = selectedTheme || "light";
  });

  if (Capacitor.isNativePlatform()) {
    AppVersion.getVersionNumber().then(data => {
      version.value = "Version " + data;
    });
  }
});

// Handle back button behavior
const ionRouter = useIonRouter();
useBackButton(-1, () => {
  if (!ionRouter.canGoBack()) {
    App.exitApp();
  }
});

// Logout function
const handleLogout = () => {
  logout()
    .then(() => {
      menuController.close();
      router.push("/login");
    })
    .catch((err) => {
      console.log(err);
      logout(true).then(() => {
        menuController.close();
        router.push("/login");
      });
    });
};

// Navigation functions
const profile = () => {
  menuController.close();
  router.push("/profile");
};

const settings = () => {
  menuController.close();
  router.push("/settings");
};

const intervalTimer = () => {
  menuController.close();
  router.push("/intervalTimer");
};

// Update app function
const updateApp = () => {
  menuController.close();
  showToast("The latest version is being downloaded. However, you need to install it manually.");

  const request = {
    uri: "https://github.com/Umfi/my-fitness-app/releases/download/latest-build/myfitnessapp-latest.apk",
    title: 'MyFitnessApp.apk',
    description: 'Latest version of MyFitnessApp',
    visibleInDownloadsUi: true,
    notificationVisibility: 1,
    mimeType: '',
    destinationInExternalPublicDir: {
      dirType: 'Download',
      subPath: 'myfitnessapp-latest.apk'
    }
  };

  Downloader.download(request)
    .then((location) => console.log('File downloaded at: ' + location))
    .catch((error) => console.error(error));
};

// Change theme function
const changeTheme = (isDarkMode: boolean) => {
  theme.value = isDarkMode ? "dark" : "light";
  document.body.classList.toggle('dark', isDarkMode);
  set("theme", theme.value);
};
</script>
