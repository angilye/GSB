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

  constructor(public navCtrl: NavController, private navParams: NavParams, private sqlite: SQLite) {
    // récuperation d'information transmise par la page d'avant.
    let nextPage = navParams.get('next');
    //this.log = 'lancement de la creation de la bd /';
    this.createDatabaseFile();
    setTimeout(() => { this.navCtrl.push(nextPage) }, 78000);
  }

  private createDatabaseFile(): void {

    this.sqlite.create({
      name: 'gsb.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      //this.log = 'Debut';
      this.db = db;
      //this.log = this.log.concat('debut de la monte des tables')
      this.createTable(this.db);
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
      ['CREATE TABLE IF NOT EXISTS `suivieApp` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `creationDB` INTEGER, `creationTables` INTEGER, `dateDernierImportInformationViaApi` TEXT, `dateDerniereConnexionSurApp` TEXT, `modifViaApiEnAttente` INTEGER, `versionApp` TEXT )']
    ])
    .then( () => this.log = this.log.concat('monter des tables fini'))  
    .catch( () =>this.log = this.log.concat('monter des tables echouer'));
  }

  public drop(): void {
    this.log = this.log.concat('/ testa avant la DROP');
    this.db.executeSql('DROP TABLE IF EXISTS `visiteur`;', {})
      .then(() => {

        this.log = this.log.concat('/ visiteur table DROP');

        this.db.executeSql('DROP TABLE IF EXISTS `famille`;', {})
          .then(() => {

            this.log = this.log.concat('/ famille table DROP');

            this.db.executeSql('DROP TABLE IF EXISTS `medecin`;', {})
              .then(() => {

                this.log = this.log.concat('/ medecin table DROP');

                this.db.executeSql('DROP TABLE IF EXISTS `medicament`;', {})
                  .then(() => {

                    this.log = this.log.concat('/ medicament table DROP');

                    this.db.executeSql('DROP TABLE IF EXISTS `offrir`;', {})
                      .then(() => {

                        this.log = this.log.concat('/ offrir table DROP');

                        this.db.executeSql('DROP TABLE IF EXISTS `rapport`;', {})
                          .then(() => {

                            this.log = this.log.concat('/ rapport table DROP');

                            this.db.executeSql('DROP TABLE IF EXISTS `suivieApp`;', {})
                          .then(() => {

                            this.log = this.log.concat('/ suivieApp table DROP');

                          })
                          .catch(e => console.log(e));

                          })
                          .catch(e => console.log(e));

                      })
                      .catch(e => console.log(e));

                  })
                  .catch(e => console.log(e));

              })
              .catch(e => console.log(e));

          })
          .catch(e => console.log(e));

      })
      .catch(e => this.log = 'mon ' + e);
  }

  // faire tout les imports de base de données et verification si pas deja ou mise a jour a faire, fais avant de passer a la prochaine page
  
}
