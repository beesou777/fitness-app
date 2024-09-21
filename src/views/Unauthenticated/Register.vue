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
          <ion-card-title>Register</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form novalidate @submit.prevent="register">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">Name</ion-label>
                <ion-input
                  v-model="name"
                  name="name"
                  type="text"
                  spellcheck="true"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>
              <ion-text id="nameValidationText" color="danger">
                <p v-show="!nameValid()" padding-left v-text="errorName"></p>
              </ion-text>

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

              <ion-text id="emailValidationText" color="danger">
                <p v-show="!emailValidate()" padding-left v-text="errorEmail"></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary">Password</ion-label>
                <ion-input v-model="password" name="password" type="password" required></ion-input>
              </ion-item>

              <ion-text id="passwordValidationText" color="danger">
                <p v-show="!passwordValid()" padding-left v-text="errorPassword"></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary">Confirm Password</ion-label>
                <ion-input v-model="passwordconfirm" name="passwordconfirm" type="password" required></ion-input>
              </ion-item>

              <ion-text id="passwordConfirmValidationText" color="danger">
                <p v-show="!passwordconfirmValid()" padding-left v-text="errorPasswordconfirm"></p>
              </ion-text>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button id="registerBtn" type="submit" expand="block">Register</ion-button>
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
import { ref } from 'vue';

import { registerUser } from '@/service/AuthService';
import { showToast } from '@/utils/show-toast';
import router from '@/router';

const email = ref<string>('');
const errorEmail = ref<string>('');
const onceSubmitted = ref<boolean>(false);
const name = ref<string>('');
const errorName = ref<string>('');
const password = ref<string>('');
const errorPassword = ref<string>('');
const passwordconfirm = ref<string>('');
const errorPasswordconfirm = ref<string>('');

const nameValid = () => {
  var re = /^([a-zA-Z ]){2,30}$/;

  if (onceSubmitted.value) {
    if (name.value == null || name.value == '' || !name.value.trim()) {
      errorName.value = 'Name is required';
      return false;
    } else if (!re.test(name.value)) {
      errorName.value = 'Please enter a valid name (Only letters A-Z)';
      return false;
    }
  }

  errorName.value = '';
  return true;
};

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

const passwordValid = () => {
  if (!password.value.trim()) {
    if (onceSubmitted.value) {
      errorPassword.value = 'Password is required';
    }
    return false;
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

const showLoading = async () => {
  const loading = await loadingController.create({
    message: 'Please wait...',
  });

  await loading.present();
};

const register = async () => {
  onceSubmitted.value = true;

  if (!nameValid() || !emailValidate() || !passwordValid() || !passwordconfirmValid()) {
    return;
  }

  await showLoading();

  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordconfirm.value,
  };

  let registerSuccessful = await registerUser(userData);

  loadingController.dismiss();
  if (registerSuccessful) {
    router.push('/login');
    showToast('Registration succesful!');
    onceSubmitted.value = false;
    name.value = '';
    email.value = '';
    password.value = '';
    passwordconfirm.value = '';
  } else {
    showToast('Registration failed!');
  }
};
</script>