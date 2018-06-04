import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AcceuilPage } from '../acceuil/acceuil';
import { VersionsPage } from '../versions/versions';
import { ChargementPage } from '../chargement/chargement';

import { BddService } from '../../services/bddapi.services';
import { BddApiSignin } from '../../models/bddapi-signin.model';
// import { BddApiGetUser } from '../../models/bddapi-getuser.model';

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
  signin: BddApiSignin = new BddApiSignin();

  constructor(public navCtrl: NavController, private bddService: BddService) {
    
  }

  public Signin() {

    //appel de la fonction bddService et transmission des donn�es pour l'appel � l'API
    this.bddService.getSignin(this.login, this.password)
      .then(newsFetched => { // si reussi faire ....
        this.signin = newsFetched; // parssage de la r�ponse celon le models "signin" definit en tant que BddApiSignin
        if (this.signin.Success || this.testConnection) { // test de la reponse getSignin, False or True
          //Si true alors on passe � la page suivante en envoyant des informations � celle ci
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
