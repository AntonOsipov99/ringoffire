import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-1fb3f","appId":"1:704532977732:web:ea570e8a50540bebba4411","storageBucket":"ring-of-fire-1fb3f.appspot.com","apiKey":"AIzaSyDHQGClk8Wz79Yl8jygT1LP1xCvTDCsGHE","authDomain":"ring-of-fire-1fb3f.firebaseapp.com","messagingSenderId":"704532977732"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
