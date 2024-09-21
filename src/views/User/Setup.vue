<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>My Fitness App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Setup</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form novalidate @submit.prevent="setupProfile">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">Gender</ion-label>
                <ion-select v-model="gender" name="gender" placeholder="Select One" required>
                  <ion-select-option value="1">Female</ion-select-option>
                  <ion-select-option value="0">Male</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Birthday</ion-label>
                <ion-datetime v-model="dob" name="dob" presentation="date" required></ion-datetime>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Weight (in kg)</ion-label>
                <ion-input v-model="weight" name="weight" type="number" required></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Height (in cm)</ion-label>
                <ion-input v-model="height" name="height" type="number" required></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Activity level</ion-label>
                <ion-select v-model="activity" name="activity" placeholder="Select One" required>
                  <ion-select-option value="0">little active</ion-select-option>
                  <ion-select-option value="1">slightly active</ion-select-option>
                  <ion-select-option value="2">moderately active</ion-select-option>
                  <ion-select-option value="3">very active</ion-select-option>
                  <ion-select-option value="4">extremely active</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Goal</ion-label>
                <ion-select v-model="goal" name="goal" placeholder="Select One" required>
                  <ion-select-option value="0">Fat loss</ion-select-option>
                  <ion-select-option value="1">Muscle building</ion-select-option>
                  <ion-select-option value="2">Keep weight</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button type="submit" expand="block">Submit</ion-button>
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
  IonButton,
  IonButtons,
  IonMenuButton,
  IonCol,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  loadingController,
} from '@ionic/vue';
import { ref } from 'vue';

import { updateUserData } from '@/service/UserServices';
import { showToast } from '@/utils/show-toast';
import router from '@/router';

const gender = ref<string>('');
const dob = ref<string>('');
const weight = ref<number>(0);
const height = ref<number>(0);
const activity = ref<string>('');
const goal = ref<string>('');

const showLoading = async () => {
  const loading = await loadingController.create({
    message: 'Please wait...',
  });
  await loading.present();
};

const setupProfile = async () => {
  if (
    gender.value !== null &&
    dob.value != null &&
    weight.value != null &&
    height.value != null &&
    activity.value != null &&
    goal.value != null
  ) {
    await showLoading();

    let setupSuccessful = await updateUserData({
      'gender': parseInt(gender.value),
      'dob': dob.value,
      'weight': weight.value,
      'height': height.value,
      'activity': parseInt(activity.value),
      'goal': parseInt(goal.value),
      'language': 'en',
    });

    loadingController.dismiss();
    if (setupSuccessful) {
      router.push('/tabs/overview');
      showToast('Setup succesful!');
    } else {
      showToast('Setup failed!');
    }
  } else {
    showToast('Setup failed!');
  }
};
</script>