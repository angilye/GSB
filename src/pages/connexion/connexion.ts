import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AcceuilPage } from '../acceuil/acceuil';
import { VersionsPage } from '../versions/versions';
import { ChargementPage } from '../chargement/chargement';

import { BddService } from '../../services/bddapi.services';
import { BddApiSignin } from '../../models/bddapi-signin.model';

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
  news: BddApiSignin = new BddApiSignin();

  constructor(public navCtrl: NavController, private bddService: BddService) {
    
  }

  public Signin() {

    //appel de la fonction bddService et transmission des données pour l'appel à l'API
    this.bddService.getSignin(this.login, this.password)
      .then(newsFetched => { // si reussi faire ....
        this.news = newsFetched; // parssage de la réponse celon le models "news" definit en tant que BddApiSignin
        if (this.news.Success || this.testConnection) { // test de la reponse getSignin, False or True
          //Si true alors on passe à la page suivante en envoyant des informations à celle ci
          this.navCtrl.push(ChargementPage, {
            next: AcceuilPage
          });
        } else { // si faux alors affichage de l'erreur dans la variable error afficher dans html
          this.error = 'Your login or password is not valid';
        }
      });
  }

  goToVersions() {
    
    this.navCtrl.push(VersionsPage);
  }
}
