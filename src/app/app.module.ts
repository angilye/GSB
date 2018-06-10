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
import { VersionsPage } from '../pages/versions/versions';
import { ChargementPage } from '../pages/chargement/chargement';
import { EditMedecinPage } from '../pages/edit-medecin/edit-medecin';

import { BddService } from '../services/bddapi.services';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';

import { HttpModule } from "@angular/http";

// import { Network } from '@ionic-native/network';

import { DatabaseProvider } from '../providers/database/database.provider';
import { MedecinProvider } from '../providers/medecin/medecin.provider';
import { CategoryProvider } from '../providers/category/category.provider';

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
    MDecinsPage,
    VersionsPage,
    EditMedecinPage,
    ChargementPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
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
    MDecinsPage,
    VersionsPage,
    ChargementPage,
    EditMedecinPage
  ],
  providers: [
    BddService,
    StatusBar,
    SplashScreen,
    SQLite,
    // Network,
    DatabaseProvider,
    MedecinProvider,
    CategoryProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
