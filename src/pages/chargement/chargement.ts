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
        this.log = 'lancement de la creation des tables /';
        this.db = db;
        this.createTables();
    })
    .catch(e => console.log(e));

  }

  private createTables(): void {
    this.log = this.log.concat('/ testa avant la creation');
    this.db.executeSql('CREATE TABLE IF NOT EXISTS `visiteur` (`id` int(11) NOT NULL,`nom` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`prenom` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`login` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`mdp` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`adresse` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`cp` int(5) NULL DEFAULT NULL,`ville` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`dateEmbauche` datetime(0) NULL DEFAULT NULL,PRIMARY KEY(`id`) USING BTREE) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;', {})
      .then(() => {

        this.log = this.log.concat('/ visiteur table create');

        this.db.executeSql('CREATE TABLE IF NOT EXISTS `famille`  (`id` int(100) NOT NULL AUTO_INCREMENT,`libelle` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,PRIMARY KEY(`id`) USING BTREE) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;', {})
          .then(() => {

            this.log = this.log.concat('/ famille table create');

            this.db.executeSql('CREATE TABLE IF NOT EXISTS `medecin`  (`id` int(11) NOT NULL AUTO_INCREMENT,`nom` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`prenom` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`adresse` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`cp` int(5) NULL DEFAULT NULL,`ville` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`tel` int(15) NULL DEFAULT NULL,`specialiteComplementaire` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`departement` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,PRIMARY KEY(`id`) USING BTREE) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;', {})
              .then(() => {

                this.log = this.log.concat('/ medecin table create');

                this.db.executeSql('CREATE TABLE IF NOT EXISTS `medicament`  (`id` int(100) NOT NULL AUTO_INCREMENT,`nomCommercial` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`idFamille` int(100) NULL DEFAULT NULL,`composition` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,`effets` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,`contreIndications` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,PRIMARY KEY(`id`) USING BTREE,INDEX`id`(`id`) USING BTREE,INDEX`idFamille`(`idFamille`) USING BTREE,CONSTRAINT`medicament_ibfk_1` FOREIGN KEY(`idFamille`) REFERENCES`famille`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;', {})
                  .then(() => {

                    this.log = this.log.concat('/ medicament table create');

                    this.db.executeSql('CREATE TABLE IF NOT EXISTS `offrir`  (`idRapport` int(100) NOT NULL,`idMedicament` int(100) NOT NULL,PRIMARY KEY(`idRapport`, `idMedicament`) USING BTREE,INDEX`idRapport`(`idRapport`) USING BTREE,INDEX`idMedicament`(`idMedicament`) USING BTREE,CONSTRAINT`offrir_ibfk_1` FOREIGN KEY(`idRapport`) REFERENCES`rapport`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE,CONSTRAINT`offrir_ibfk_2` FOREIGN KEY(`idMedicament`) REFERENCES`medicament`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;', {})
                      .then(() => {

                        this.log = this.log.concat('/ offrir table create');

                        this.db.executeSql('CREATE TABLE IF NOT EXISTS `rapport`  (`id` int(11) NOT NULL AUTO_INCREMENT,`date` datetime(0) NULL DEFAULT NULL,`motif` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`bilan` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,`idVisiteur` int(255) NULL DEFAULT NULL,`idMedecin` int(255) NULL DEFAULT NULL,PRIMARY KEY(`id`) USING BTREE,INDEX`idVisiteur`(`idVisiteur`) USING BTREE,INDEX`idMedecin`(`idMedecin`) USING BTREE,CONSTRAINT`rapport_ibfk_1` FOREIGN KEY(`idVisiteur`) REFERENCES`visiteur`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE,CONSTRAINT`rapport_ibfk_2` FOREIGN KEY(`idMedecin`) REFERENCES`medecin`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;', {})
                          .then(() => {

                            this.log = this.log.concat('/ rapport table create');

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
