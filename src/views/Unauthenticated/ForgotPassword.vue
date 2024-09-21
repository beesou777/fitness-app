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
                <ion-input
                  v-model="email"
                  name="email"
                  type="email"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>

              <ion-text color="danger">
               <p v-show="!emailValidate()" v-text="errorEmail" padding-left></p>
              </ion-text>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button
                  :disabled="sendDisabled"
                  type="submit"
                  expand="block">
                  Send Reset E-Mail
                  </ion-button>
              </ion-col>
            </ion-row>

            <ion-row responsive-sm>
              <ion-col size="12" class="ion-text-center">
                <ion-label
                  ><a href="/login">Back to Login?</a></ion-label>
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
  IonPage,
  IonHeader,
  IonTabBar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/vue';
import { ref } from 'vue';
import { showToast } from '@/utils/show-toast';
import router from '@/router';
import {forgotPassword} from '@/service/AuthService';

const email = ref<string>('');
const errorEmail = ref<string>('');
const onceSubmitted = ref<boolean>(false);
const sendDisabled = ref<boolean>(false);
const emailValidate = () => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!email.value.trim()) {
    if (onceSubmitted.value) {
      errorEmail.value = 'E-mail is required';
    }
    return false;
  } else if (!re.test(email.value)) {
    errorEmail.value = 'Please enter a valid E-mail';
    return false;
  }
  errorEmail.value = '';
  return true;
};

const resetPassword = async () => {
  onceSubmitted.value = true;
  if (!emailValidate()) {
    return;
  }
  sendDisabled.value = true;
  try {
    await forgotPassword({email:email.value});
    router.push("/resetPassword?email=" + encodeURIComponent(email.value))
    showToast('Reset E-Mail sent');
  } catch (error) {
    showToast('An error occurred during password reset');
  } finally {
    sendDisabled.value = false;
  }
};
</script>