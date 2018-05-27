import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AcceuilPage } from '../acceuil/acceuil';

import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-chargement',
  templateUrl: 'chargement.html'
})
export class ChargementPage {

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    let nextPage = navParams.get('next');
    setTimeout(this.navCtrl.push(AcceuilPage), 1000);
  }


  
}
