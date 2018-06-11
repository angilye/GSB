import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ConnexionPage } from '../pages/connexion/connexion';
import { AcceuilPage } from '../pages/acceuil/acceuil';
import { GESTIONRAPPORTSPage } from '../pages/g-estionrapports/g-estionrapports';
import { NOUVEAURAPPORTPage } from '../pages/n-ouveaurapport/n-ouveaurapport';//
import { GESTIONMEDECINSPage } from '../pages/g-estionmedecins/g-estionmedecins';
import { MDecinsPage } from '../pages/m-decins/m-decins';
import { VersionsPage } from '../pages/versions/versions';
import { ChargementPage } from '../pages/chargement/chargement';
import { EditMedecinPage } from '../pages/edit-medecin/edit-medecin';
import { AfficherRapportPage } from '../pages/afficher-rapport/afficher-rapport';
import { EditRapportPage } from '../pages/edit-rapport/edit-rapport';

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
import { RapportProvider } from '../providers/rapport/rapport.provider';
import { MedicamentProvider } from '../providers/medicament/medicament.provider';

@NgModule({
  declarations: [
    MyApp,
    ConnexionPage,
    AcceuilPage,
    GESTIONRAPPORTSPage,
    NOUVEAURAPPORTPage,
    GESTIONMEDECINSPage,
    MDecinsPage,
    VersionsPage,
    EditMedecinPage,
    ChargementPage,
    AfficherRapportPage,
    EditRapportPage
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
    GESTIONMEDECINSPage,
    MDecinsPage,
    VersionsPage,
    ChargementPage,
    EditMedecinPage,
    AfficherRapportPage, 
    EditRapportPage
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
    RapportProvider,
    MedicamentProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
