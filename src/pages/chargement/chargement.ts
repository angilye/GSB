import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AcceuilPage } from '../acceuil/acceuil';

//Permet la transmission d'information d'une page à l'autre.
import { NavParams } from 'ionic-angular';

//permet la gestion de la BDD locale.
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';

import { BddService } from '../../services/bddapi.services';
import { BddApiGetUser } from '../../models/getuser/bddapi-getuser.model';
import { BddApiImportFirst } from '../../models/ImportFirst/bddapi-ImportFirst.model';


@Component({
  selector: 'page-chargement',
  templateUrl: 'chargement.html'
})
export class ChargementPage {

  private db: SQLiteObject;

  log: string;

  private nextpage: string; 

  private signin: BddApiGetUser = new BddApiGetUser();
  private familleTable: BddApiImportFirst = new BddApiImportFirst();

  private id: string;
  private nom: string;
  private prenom: string;
  private login: string;
  private mdp: string;
  private adresse: string;
  private cp: string;
  private ville: string;
  private dateEmbauche: string;


  private testConnection: boolean = false;

  constructor(public navCtrl: NavController, private navParams: NavParams, private sqlite: SQLite, private bddService: BddService, private storage: Storage) {

    // récuperation d'information transmise par la page d'avant.
    this.nextpage = navParams.get('next'); 

    if(navParams.get('styleLogin') == "api") {

      this.signin = navParams.get('signin');
      // recuperation des infos de l'utilisateur qui vien de se logue
      this.id = this.signin.id;
      this.nom = this.signin.nom;
      this.prenom = this.signin.prenom;
      this.login = this.signin.login;
      this.mdp = this.signin.mdp;
      this.adresse = this.signin.adresse;
      this.cp = this.signin.cp;
      this.ville = this.signin.ville;
      this.dateEmbauche = this.signin.dateEmbauche;

      this.storage.set('idVisiteurConnecte', this.signin.id.toString());
    }

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
      ['CREATE TABLE IF NOT EXISTS `medecin` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nom` TEXT, `prenom` TEXT, `adresse` TEXT, `cp` TEXT, `ville` TEXT, `tel` TEXT, `specialiteComplementaire` TEXT, `category_id` INTEGER, `departement` TEXT, FOREIGN KEY(`category_id`) REFERENCES categories(`id`) )'],
      ['CREATE TABLE IF NOT EXISTS `medicament` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nomCommercial` TEXT, `idFamille` INTEGER, `composition` TEXT, `effets` TEXT, `contreIndications` TEXT, FOREIGN KEY(`idFamille`) REFERENCES `famille`(`id`) )'],
      ['CREATE TABLE IF NOT EXISTS `rapport` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `date` TEXT, `motif` TEXT, `bilan` TEXT, `idVisiteur` INTEGER, `idMedecin` INTEGER, FOREIGN KEY(`idMedecin`) REFERENCES `medecin`(`id`), FOREIGN KEY(`idVisiteur`) REFERENCES `visiteur`(`id`) )'],
      ['CREATE TABLE IF NOT EXISTS `offrir` ( `idRapport` INTEGER NOT NULL, `idMedicament` INTEGER NOT NULL, `quantite` INTEGER, FOREIGN KEY(`idRapport`) REFERENCES `rapport`(`id`), PRIMARY KEY(`idRapport`,`idMedicament`) )'],
      ['CREATE TABLE IF NOT EXISTS `suivieApp` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `creationDB` INTEGER DEFAULT 0, `creationTables` INTEGER DEFAULT 0, `dateDernierImportInformationViaApi` TEXT, `dateDerniereConnexionSurApp` TEXT, `modifViaApiEnAttente` INTEGER DEFAULT 0, `versionApp` TEXT DEFAULT 0.1 )'],
      ['CREATE TABLE IF NOT EXISTS `attenteEnvoieAPI` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `id1` TEXT NOT NULL, `id2` TEXT, `action` TEXT NOT NULL, `tableAction` TEXT NOT NULL)'],
      ['CREATE TABLE IF NOT EXISTS `categories` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `name` TEXT)'],
      ['INSERT INTO suivieApp (id, creationDB, creationTables) VALUES(1,1,1)'], 
      ['insert into categories (id, name) values (1,?)', ['Medecin']],
      ['insert into categories (id, name) values (2,?)', ['Pharmacien']],
      ['insert into categories (id, name) values (3,?)', ['Chef de Clinique']],
      ['insert into categories (id, name) values (4,?)', ['Autre']],
      ['INSERT INTO visiteur (id, nom, prenom, login, mdp, adresse, cp, ville, dateEmbauche) VALUES(\'' + this.id + '\',\'' + this.nom + '\',\'' + this.prenom + '\',\'' + this.login + '\',\'' + this.mdp + '\',\'' + this.adresse+ '\',\'' + this.cp + '\',\'' + this.ville + '\',\'' + this.dateEmbauche + '\')']
    ])
      .then(() => { this.log = this.log.concat('monter des tables fini'); this.ImportTables(this.db);})  
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
      ['DROP TABLE IF EXISTS`attenteEnvoieAPI`;'],
      ['DROP TABLE IF EXISTS`categories`;']
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

        setTimeout(() => { 
          this.navCtrl.push(this.nextpage); 
          this.log = this.log.concat('Tout est bon ca passe')
        }, 5000);

      })
      .catch(() => this.createTable(this.db));
  }

  public ImportTables(db: SQLiteObject) {
    //appel de la fonction bddService et transmission des donn�es pour l'appel � l'API
    this.bddService.getTables(this.id)
      .then(newsFetched => { // si reussi faire ....
        this.familleTable = newsFetched; // parssage de la r�ponse celon le models "importFirst" definit en tant que BddApiImportFirst

        if (this.familleTable.Success || this.testConnection) { // test de la reponse ImportFirst, False or True

          // parcours de la liste contenue dans familleTable.Famille
          this.familleTable.Famille.forEach(element => {
            // insertion des elements recu par l'API dans la tables local
            db.executeSql('INSERT INTO famille (id, libelle) VALUES(\'' + element.id + '\',\'' + element.libelle + '\')', {})
              .then((data) => {

                if (data == null) {
                  return;
                }

                // le temps des test peux etre virer apres.
                this.log = this.log.concat(element.id);

              })
              .catch(() => this.log = this.log.concat('errorF'));

          });

          this.familleTable.Medecin.forEach(element => {
            // insertion des elements recu par l'API dans la tables local
            db.executeSql('INSERT INTO medecin (id, nom, prenom, adresse, cp, ville, tel, specialiteComplementaire, category_id, departement) VALUES(\'' + element.id + '\',\'' + element.nom + '\',\'' + element.prenom + '\',\'' + element.adresse + '\',\'' + element.cp + '\',\'' + element.ville + '\',\'' + element.tel + '\',\'' + element.specialiteComplementaire + '\',\'' + element.category_id + '\',\'' + element.departement + '\')', {})
              .then((data) => {

                if ( data == null ){
                  return;
                }
                // le temps des test peux etre virer apres.
                this.log = this.log.concat(element.id.toString());

              })
              .catch(() => this.log = this.log.concat('errorM'));

          });

          this.familleTable.Medicament.forEach(element => {
            // insertion des elements recu par l'API dans la tables local
            db.executeSql('INSERT INTO medicament (id, nomCommercial, idFamille, composition, effets, contreIndications) VALUES(\'' + element.id + '\',\'' + element.nomCommercial + '\',\'' + element.idFamille + '\',\'' + element.composition + '\',\'' + element.effets + '\',\'' + element.contreIndications + '\')', {})
              .then((data) => {

                if (data == null) {
                  return;
                }

                // le temps des test peux etre virer apres.
                this.log = this.log.concat(element.id);

              })
              .catch(() => this.log = this.log.concat('errorMe'));

          });

          this.familleTable.Offrir.forEach(element => {
            // insertion des elements recu par l'API dans la tables local
            db.executeSql('INSERT INTO offir (idRapport, idMedicament) VALUES(\'' + element.idRapport + '\',\'' + element.idMedicament + '\')', {})
              .then((data) => {

                if (data == null) {
                  return;
                }

                // le temps des test peux etre virer apres.
                this.log = this.log.concat(element.idRapport);

              })
              .catch(() => this.log = this.log.concat('errorO'));

          });

          this.familleTable.Rapport.forEach(element => {
            // insertion des elements recu par l'API dans la tables local
            db.executeSql('INSERT INTO rapport (id, date, motif, bilan, idVisiteur, idMedecin) VALUES(\'' + element.id + '\',\'' + element.date + '\',\'' + element.motif + '\',\'' + element.bilan + '\',\'' + element.idVisiteur + '\',\'' + element.idMedecin + '\')', {})
              .then((data) => {

                if (data == null) {
                  return;
                }

                // le temps des test peux etre virer apres.
                this.log = this.log.concat(element.id);

              })
              .catch(() => this.log = this.log.concat('errorR'));

          });

          this.verificationSiTableMonter(this.db);
          

        } else { // si faux alors affichage de l'erreur dans la variable error afficher dans html
          this.log = 'Une erreur dans l envoie ou la reception des donnée de l API ';
        }
      })
      .catch(() => this.log = 'Veuillez vérifier votre connexions internet')

  }
  
}
