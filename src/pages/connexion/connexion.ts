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
    this.error = "1";
    this.bddService.getSignin(this.login, this.password)
      .then(newsFetched => {
        this.error = "2";
        this.news = newsFetched;
        console.log(this.news);
        this.error = "3";
        if (this.news.Success) {
          this.error = "4";
          this.navCtrl.push(AcceuilPage);
          this.error = 'succes';
        } else {
          this.error = 'Your login or password is not valid';
        }
      });
  }

  goToVersions() {
    
    this.navCtrl.push(VersionsPage);
  }
}
