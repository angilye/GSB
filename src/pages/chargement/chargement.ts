import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AcceuilPage } from '../acceuil/acceuil';

//Permet la transmission d'information d'une page à l'autre.
import { NavParams } from 'ionic-angular';

//permet la gestion de la BDD locale.
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { BddService } from '../../services/bddapi.services';
import { BddApiGetUser } from '../../models/bddapi-getuser.model';

@Component({
  selector: 'page-chargement',
  templateUrl: 'chargement.html'
})
export class ChargementPage {

  private db: SQLiteObject;

  log: string;

  private nextpage: string; 

  private signin: BddApiGetUser = new BddApiGetUser();

  private id: string;
  private nom: string;
  private prenom: string;
  private login: string;
  private mdp: string;
  private adresse: string;
  private cp: string;
  private ville: string;
  private dateEmbauche: string;

  constructor(public navCtrl: NavController, private navParams: NavParams, private sqlite: SQLite, private bddService: BddService) {

    // récuperation d'information transmise par la page d'avant.
    this.nextpage = navParams.get('next'); 
    this.signin = navParams.get('signin');

    // recuperation des infos de l'utilisateur qui vien de se logue
    this.id = this.signin.id;
    this.prenom = this.signin.nom;
    this.login = this.signin.prenom;
    this.mdp = this.signin.login;
    this.adresse = this.signin.mdp;
    this.cp = this.signin.adresse;
    this.ville = this.signin.ville;
    this.dateEmbauche = this.signin.dateEmbauche;

    //ecriture dans log sur la page chargement
    this.log = 'lancement de la creation de la bd /';

    this.createDatabaseFile();

  }

  private createDatabaseFile(): void {

    this.sqlite.create({

      name: 'gsb.db',
      location: 'default'

    })
    .then((db: SQLiteObject) => {

      this.db = db;

      this.verificationSiTableMonter(this.db);     

    })
    .catch(e => this.log = e);

  }

  private createTable(db: SQLiteObject) {

    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS `visiteur` ( `id` INTEGER NOT NULL PRIMARY KEY UNIQUE, `nom` TEXT, `prenom` TEXT, `login` TEXT, `mdp` TEXT, `adresse` TEXT, `cp` INTEGER, `ville` TEXT, `dateEmbauche` TEXT )'],
      ['CREATE TABLE IF NOT EXISTS `famille` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `libelle` TEXT )'],
      ['CREATE TABLE IF NOT EXISTS `medecin` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nom` TEXT, `prenom` TEXT, `tel` INTEGER, `specialiteComplementaire` TEXT, `departement` TEXT )'],
      ['CREATE TABLE IF NOT EXISTS `medicament` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nomCommercial` TEXT, `idFamille` INTEGER, `composition` TEXT, `effets` TEXT, `contreIndications` TEXT, FOREIGN KEY(`idFamille`) REFERENCES `famille`(`id`) )'],
      ['CREATE TABLE IF NOT EXISTS `rapport` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `date` TEXT, `motif` TEXT, `bilan` TEXT, `idVisiteur` INTEGER, `idMedecin` INTEGER, FOREIGN KEY(`idMedecin`) REFERENCES `medecin`(`id`), FOREIGN KEY(`idVisiteur`) REFERENCES `visiteur`(`id`) )'],
      ['CREATE TABLE IF NOT EXISTS `offrir` ( `idRapport` INTEGER NOT NULL, `idMedicament` INTEGER NOT NULL, `quantite` INTEGER, FOREIGN KEY(`idRapport`) REFERENCES `rapport`(`id`), PRIMARY KEY(`idRapport`,`idMedicament`) )'],
      ['CREATE TABLE IF NOT EXISTS `suivieApp` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `creationDB` INTEGER DEFAULT 0, `creationTables` INTEGER DEFAULT 0, `dateDernierImportInformationViaApi` TEXT, `dateDerniereConnexionSurApp` TEXT, `modifViaApiEnAttente` INTEGER DEFAULT 0, `versionApp` TEXT DEFAULT 0.1 )'],
      ['CREATE TABLE IF NOT EXISTS `attenteEnvoieAPI` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `enteteUrl` TEXT NOT NULL, `requete` TEXT NOT NULL )'],
      ['INSERT INTO suivieApp (id, creationDB, creationTables) VALUES(1,1,1)'],
      ['INSERT INTO visiteur (id, nom, prenom, login, mdp, adresse, cp, ville, dateEmbauche) VALUES(\'' + this.id + '\',\'' + this.nom + '\',\'' + this.prenom + '\',\'' + this.login + '\',\'' + this.mdp + '\',\'' + this.adresse+ '\',\'' + this.cp + '\',\'' + this.ville + '\',\'' + this.dateEmbauche + '\')']
    ])
      .then(() => { this.log = this.log.concat('monter des tables fini'); this.verificationSiTableMonter(this.db);})  
    .catch( () =>this.log = this.log.concat('monter des tables echouer'));
  }

  public drop(db: SQLiteObject) {

    this.db.sqlBatch([
      ['DROP TABLE IF EXISTS`visiteur`;'],
      ['DROP TABLE IF EXISTS`famille`;'],
      ['DROP TABLE IF EXISTS`medecin`;'],
      ['DROP TABLE IF EXISTS`medicament`;'],
      ['DROP TABLE IF EXISTS`rapport`;'],
      ['DROP TABLE IF EXISTS`offrir`;'],
      ['DROP TABLE IF EXISTS`suivieApp`;'],
      ['DROP TABLE IF EXISTS`attenteEnvoieAPI`;']
    ])
      .then(() => {

        //affichage en bas de la page de chargement
        this.log = this.log.concat(' Drop de toutes les tables');

      })
      .catch(() => this.log = this.log.concat(' Drop de toutes les tables echouer'));
  }

  private verificationSiTableMonter(db: SQLiteObject) {

    db.executeSql('SELECT * FROM `suivieApp`;', {})
      .then((data) => {

        if(data == null) {
          return;
        }

        setTimeout(() => { this.navCtrl.push(this.nextpage) }, 30000);

      })
      .catch(() => this.createTable(this.db));
  }
  
}
