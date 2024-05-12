// By Angular
import { ApplicationConfig, importProvidersFrom } from "@angular/core"
import { RouteReuseStrategy, provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app.routes';
import { environment } from "src/environments/environment";
import { HttpClientModule } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
 providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    importProvidersFrom( IonicModule.forRoot({}) ),

    importProvidersFrom(HttpClientModule),

    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(
      provideAuth(() => getAuth())
    ),
    importProvidersFrom(
      provideFirestore(() => getFirestore())
    ),
    importProvidersFrom(
      provideStorage(() => getStorage())
    ),

    provideRouter(routes),
  ],
}
