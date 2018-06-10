import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AcceuilPage } from '../acceuil/acceuil';
import { VersionsPage } from '../versions/versions';
import { ChargementPage } from '../chargement/chargement';

import { BddService } from '../../services/bddapi.services';
import { BddApiGetUser } from '../../models/getuser/bddapi-getuser.model';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-connexion',
  templateUrl: 'connexion.html'
})
export class ConnexionPage {

  login: string;
  password: string;
  error: string;
  testConnection: boolean = false;

  //mise en place du parsage de la reponse en JSON
  signin: BddApiGetUser = new BddApiGetUser();

  constructor(public navCtrl: NavController, private bddService: BddService, private sqlite: SQLite, private storage: Storage) {
    
  }

  public Signin() {
    this.error = 'debut signin ';

    //appel de la fonction bddService et transmission des donn�es pour l'appel � l'API
    this.bddService.getInfoVisiteur(this.login, this.password)
    .then(newsFetched => { // si reussi faire ....
      this.signin = newsFetched; // parssage de la r�ponse celon le models "signin" definit en tant que BddApiGetUser

      if (this.signin.Success || this.testConnection) { // test de la reponse getSignin, False or True

        //Si true alors on passe � la page suivante en envoyant des informations � celle ci
        this.navCtrl.push(ChargementPage, {

          signin: this.signin.Visiteur,
          styleLogin: "api",
          next: AcceuilPage

        });
      
      } else { // si faux alors affichage de l'erreur dans la variable error afficher dans html
        this.error = 'Your login or password is not valid';
      }
    })
    .catch(() => this.error = 'Veuillez vérifier votre connexions internet')

  }

  public goToVersions() {
    
    this.navCtrl.push(VersionsPage);
  }

  private openDB(): void {

    this.sqlite.create({

      name: 'gsb.db',
      location: 'default'

    })
      .then((db: SQLiteObject) => {

        db.executeSql('SELECT login, mdp, id FROM `visiteur`;', {})
          .then((data) => {

            if (data == null) {
              return;
            }

            if (data.rows.item(0).login == this.login && data.rows.item(0).mdp == this.password) {

              this.storage.set('idVisiteurConnecte', data.rows.item(0).id.toString());

              this.navCtrl.push(ChargementPage, {

                styleLogin: "local",
                next: AcceuilPage

              });
              
            } else { // si faux alors affichage de l'erreur dans la variable error afficher dans html
              this.error = 'Your login or password is not valid ';
            }

          })
          .catch(() => { 
            
            this.error = 'Lors de la premiere connection, il vous faut une connexion internet'; 
            setTimeout(() => { this.Signin() }, 5000); 

          });


      })
      .catch(() => { this.error = 'Une erreur lors de la creation de la BD est survenue'; setTimeout(() => { this.Signin() }, 5000); });

  }
  
}
