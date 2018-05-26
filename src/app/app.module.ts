import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ConnexionPage } from '../pages/connexion/connexion';
import { AcceuilPage } from '../pages/acceuil/acceuil';
import { GESTIONRAPPORTSPage } from '../pages/g-estionrapports/g-estionrapports';
import { NOUVEAURAPPORTPage } from '../pages/n-ouveaurapport/n-ouveaurapport';
import { MODIFIERRAPPORTPage } from '../pages/m-odifierrapport/m-odifierrapport';
import { GESTIONMEDECINSPage } from '../pages/g-estionmedecins/g-estionmedecins';
import { PROFILDUMEDECINPage } from '../pages/p-rofildumedecin/p-rofildumedecin';
import { MDecinsPage } from '../pages/m-decins/m-decins';

import { BddService } from '../services/bddapi.services';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SQLite } from '@ionic-native/sqlite';

import { HttpModule } from "@angular/http";

@NgModule({
  declarations: [
    MyApp,
    ConnexionPage,
    AcceuilPage,
    GESTIONRAPPORTSPage,
    NOUVEAURAPPORTPage,
    MODIFIERRAPPORTPage,
    GESTIONMEDECINSPage,
    PROFILDUMEDECINPage,
    MDecinsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConnexionPage,
    AcceuilPage,
    GESTIONRAPPORTSPage,
    NOUVEAURAPPORTPage,
    MODIFIERRAPPORTPage,
    GESTIONMEDECINSPage,
    PROFILDUMEDECINPage,
    MDecinsPage
  ],
  providers: [
    BddService,
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
