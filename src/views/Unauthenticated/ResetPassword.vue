<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>My Fitness App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Reset password</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form novalidate @submit.prevent="resetPassword">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">E-Mail</ion-label>
                <ion-input v-model="email" name="email" type="email" disabled></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Password</ion-label>
                <ion-input v-model="password" name="password" type="password" required></ion-input>
              </ion-item>

              <ion-text color="danger">
                <p v-show="!passwordValid()" padding-left v-text="errorPassword"></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary">Confirm Password</ion-label>
                <ion-input v-model="passwordconfirm" name="passwordconfirm" type="password" required></ion-input>
              </ion-item>

              <ion-text color="danger">
                <p v-show="!passwordconfirmValid()" padding-left v-text="errorPasswordconfirm"></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary">Security Code</ion-label>
                <ion-input
                  v-model="token"
                  name="token"
                  type="text"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>
              <ion-item>
                <p>Check your inbox for your security code!</p>
              </ion-item>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button type="submit" expand="block"> Update Password </ion-button>
              </ion-col>
            </ion-row>

            <ion-row responsive-sm>
              <ion-col size="12" class="ion-text-center">
                <ion-label><a href="/login">Back to Login?</a></ion-label>
              </ion-col>
            </ion-row>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonLabel,
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonButton,
  IonCol,
  IonRow,
  loadingController,
} from '@ionic/vue';
import { onMounted, ref } from 'vue';

import { resetUserPassword } from '@/service/AuthService';
import { showToast } from '@/utils/show-toast';
import router from '@/router';

const token = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const passwordconfirm = ref<string>('');
const errorPassword = ref<string>('');
const errorPasswordconfirm = ref<string>('');
const onceSubmitted = ref<boolean>(false);

const showLoading = async () => {
  const loading = await loadingController.create({
    message: 'Please wait...',
  });
  await loading.present();
};

const emailValidate = () => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.value == null || email.value == '') {
    if (onceSubmitted.value) {
      return false;
    }
  } else if (!re.test(email.value)) {
    return false;
  }

  return true;
};

const passwordValid = () => {
  if (onceSubmitted.value) {
    if (password.value == null || password.value == '') {
      errorPassword.value = 'Password is required';
      return false;
    } else if (password.value.length < 6) {
      errorPassword.value = 'Password is too short. (Minimum length is 6)';
      return false;
    }
  }

  errorPassword.value = '';
  return true;
};

const passwordconfirmValid = () => {
  if (onceSubmitted.value) {
    if (password.value != passwordconfirm.value) {
      errorPasswordconfirm.value = 'Password confirm does not match with password';
      return false;
    }
  }

  errorPasswordconfirm.value = '';
  return true;
};

const resetPassword = async () => {
  onceSubmitted.value = true;

  if (!emailValidate() || !passwordValid() || !passwordconfirmValid()) {
    return;
  }

  await showLoading();
  const resetData = {
    email: email.value,
    password: password.value,
    password_confirmation: passwordconfirm.value,
    token: token.value,
  };
  const resetSuccess = await resetUserPassword(resetData);
  loadingController.dismiss();

  if (resetSuccess) {
    router.push('/login');
    showToast('Your password has been reset!');
  } else {
    showToast("Couldn't reset password! Please try again.");
  }
};

onMounted(() => {
  email.value = decodeURIComponent(router.currentRoute.value.params.email as string);
});
</script>