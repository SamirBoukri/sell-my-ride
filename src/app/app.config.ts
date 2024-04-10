import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  provideRouter,
} from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RequestService } from './service/request.service';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDNUjtF6I5eHpG_6gu_5jzzEaEbFBJhwzw',
  authDomain: 'sellmyride-408da.firebaseapp.com',
  projectId: 'sellmyride-408da',
  storageBucket: 'sellmyride-408da.appspot.com',
  messagingSenderId: '43788889093',
  appId: '1:43788889093:web:3cfb427dbef1497b79006c',
};

export const appConfig: ApplicationConfig = {
  providers: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    RequestService,
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(firebaseConfig)), // Initialisez Firebase App
      provideFirestore(() => getFirestore()), // Fournit Firestore
      provideStorage(() => getStorage())
    ),
    provideAnimationsAsync(),
  ],
};
