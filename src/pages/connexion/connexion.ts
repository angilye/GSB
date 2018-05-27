import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AcceuilPage } from '../acceuil/acceuil';
import { VersionsPage } from '../versions/versions';

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

  news: BddApiSignin = new BddApiSignin();

  constructor(public navCtrl: NavController, private bddService: BddService) {
    
  }

  public Signin() {

    console.log(this.login);
    console.log(this.password);

    this.bddService.getSignin(this.login, this.password)
      .then(newsFetched => {
        this.news = newsFetched;
        if (this.news.Success) {
          this.navCtrl.push(AcceuilPage);
        } else {
          this.error = 'Your login or password is not valid';
        }
      });
  }

  goToVersions() {
    
    this.navCtrl.push(VersionsPage);
  }
}
