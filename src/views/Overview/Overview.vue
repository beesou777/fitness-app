<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Overview</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
</script>