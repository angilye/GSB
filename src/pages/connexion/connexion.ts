import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AcceuilPage } from '../acceuil/acceuil';

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

  Signin() {
    console.log(this.login)
    console.log(this.password)
    this.bddService.getSignin(this.login, this.password)
      .then(newsFetched => {
        this.news = newsFetched;
        console.log(this.news);
        if (this.news.Success) {
          this.goToAcceuil();
        } else {
          this.error ='Your login or password is not valid'
        }
      });
  }

  //goToAcceuil(params){
  goToAcceuil() {
    //if (!params) params = {};
    this.navCtrl.push(AcceuilPage);
  }
}
