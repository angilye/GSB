import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AcceuilPage } from '../acceuil/acceuil';

//Permet la transmission d'information d'une page à l'autre.
import { NavParams } from 'ionic-angular';

//permet la gestion de la BDD locale.
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-chargement',
  templateUrl: 'chargement.html'
})
export class ChargementPage {

  private db: SQLiteObject;

  log: string;

  private testTables: string;

  constructor(public navCtrl: NavController, private navParams: NavParams, private sqlite: SQLite) {

    // récuperation d'information transmise par la page d'avant.
    let nextPage = navParams.get('next');

    this.log = 'lancement de la creation de la bd /';

    this.createDatabaseFile();

    setTimeout(() => { this.navCtrl.push(nextPage) }, 78000);

  }

  private createDatabaseFile(): void {

    this.sqlite.create({

      name: 'gsb.db',
      location: 'default'

    })
    .then((db: SQLiteObject) => {

      this.db = db;
      
      this.createTable(this.db);

      this.validationCreationTables(this.db);

      this.verificationSiTableMonter(this.db);

    })
    .catch(e => console.log(e));

  }

  private createTable(db: SQLiteObject) {

    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS `visiteur` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nom` TEXT, `prenom` TEXT, `login` TEXT, `mdp` TEXT, `adresse` TEXT, `cp` INTEGER, `ville` TEXT, `dateEmbauche` TEXT )'],
      ['CREATE TABLE IF NOT EXISTS `famille` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `libelle` TEXT )'],
      ['CREATE TABLE IF NOT EXISTS `medecin` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nom` TEXT, `prenom` TEXT, `tel` INTEGER, `specialiteComplementaire` TEXT, `departement` TEXT )'],
      ['CREATE TABLE IF NOT EXISTS "medicament" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nomCommercial` TEXT, `idFamille` INTEGER, `composition` TEXT, `effets` TEXT, `contreIndications` TEXT, FOREIGN KEY(`idFamille`) REFERENCES `famille`(`id`) )'],
      ['CREATE TABLE IF NOT EXISTS "rapport" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `date` TEXT, `motif` TEXT, `bilan` TEXT, `idVisiteur` INTEGER, `idMedecin` INTEGER, FOREIGN KEY(`idMedecin`) REFERENCES `medecin`(`id`), FOREIGN KEY(`idVisiteur`) REFERENCES `visiteur`(`id`) )'],
      ['CREATE TABLE IF NOT EXISTS "offrir" ( `idRapport` INTEGER NOT NULL, `idMedicament` INTEGER NOT NULL, `quantite` INTEGER, FOREIGN KEY(`idRapport`) REFERENCES `rapport`(`id`), PRIMARY KEY(`idRapport`,`idMedicament`) )'],
      ['CREATE TABLE IF NOT EXISTS `suivieApp` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `creationDB` INTEGER, `creationTables` INTEGER, `dateDernierImportInformationViaApi` TEXT, `dateDerniereConnexionSurApp` TEXT, `modifViaApiEnAttente` INTEGER, `versionApp` TEXT )'],
      ['CREATE TABLE `attenteEnvoieAPI` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `enteteUrl` TEXT NOT NULL, `requete` TEXT NOT NULL )']
    ])
    .then( () => this.log = this.log.concat('monter des tables fini'))  
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

  private validationCreationDB(db: SQLiteObject) {

    db.executeSql('INSERT INTO suivieApp (creationDB) VALUES(1);', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));

  }

  private validationCreationTables(db: SQLiteObject) {

    db.executeSql('INSERT INTO suivieApp (creationTables) VALUES(1);', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));

  }

  private verificationSiTableMonter(db: SQLiteObject) {

    db.executeSql('SELECT creationTables FROM `suivieApp`;', {})
      .then((data) => {
        
        if(data.rows){
          this.log = data.rows.item(0).creationTables; 
        }
      })
      .catch(e => console.log(e));
  }
  
}
