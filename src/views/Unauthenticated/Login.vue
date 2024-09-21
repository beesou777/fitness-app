
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
          <ion-card-title>Login</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form @submit.prevent="login" novalidate id="login-form">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">Email</ion-label>
                <ion-input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>

              <ion-text id="emailValidationText" color="danger">
                <p v-show="!emailValidate()" padding-left>{{ emailError }}</p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary">Password</ion-label>
                <ion-input
                  id="password"
                  name="password"
                  v-model="password"
                  type="password"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>

              <ion-text id="passwordValidationText" color="danger">
                <p v-show="!passwordValidate()" padding-left>{{ errorPassword }}</p>
              </ion-text>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button id="loginBtn" type="submit" expand="block" :disabled="disableSend">Login</ion-button>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="12" class="ion-text-center">
                <ion-label>
                  <a href="/forgotPassword">Forgot Password</a>
                </ion-label>
              </ion-col>
              <ion-col size="12" class="ion-text-center">
                <ion-label> Don't have an account? <a href="/register">Sign Up Now!</a> </ion-label>
              </ion-col>
            </ion-row>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  loadingController,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonInput,
  IonText,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/vue';
import router from '@/router';
import { showToast } from '@/utils/show-toast';
import { loginUser } from '@/service/AuthService';

const email = ref<string>('');
const password = ref<string>('');
const emailError = ref<string>('');
const errorPassword = ref<string>('');
const onceSubmitted = ref<boolean>(false);
const disableSend = ref<boolean>(false);

const emailValidate = () => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!email.value.trim()) {
    if (onceSubmitted.value) {
      emailError.value = 'E-mail is required';
    }
    return false;
  } else if (!re.test(email.value)) {
    emailError.value = 'Please enter a valid E-mail';
    return false;
  }
  emailError.value = '';
  return true;
};

const passwordValidate = () => {
  if (!password.value.trim()) {
    if (onceSubmitted.value) {
      errorPassword.value = 'Password is required';
    }
    return false;
  }
  errorPassword.value = '';
  return true;
};

const showLoading = async () => {
  const loading = await loadingController.create({
    message: 'Please wait...',
  });
  await loading.present();
};

const login = async () => {
  onceSubmitted.value = true;

  if (!emailValidate() || !passwordValidate()) {
    return;
  }

  await showLoading();
  const userData = {
    email: email.value,
    password: password.value,
  };

  disableSend.value = true;
  try {
    const loginSuccessfull = await loginUser(userData);
    if (loginSuccessfull) {
      router.push('/tabs/overview');
      showToast('Login Successful');
      onceSubmitted.value = false;
      email.value = '';
      password.value = '';
    } else {
      password.value = '';
      showToast('Login Failed');
    }
  } catch (error) {
    showToast('An error occurred during login');
  } finally {
    disableSend.value = false;
    loadingController.dismiss();
  }
};
</script>
<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>