import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AcceuilPage } from '../acceuil/acceuil';

//Permet la transmission d'information d'une page à l'autre.
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-chargement',
  templateUrl: 'chargement.html'
})
export class ChargementPage {

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    // récuperation d'information transmise par la page d'avant.
    let nextPage = navParams.get('next');
    setTimeout(() => { this.navCtrl.push(nextPage) }, 8000);
  }

  // faire tout les imports de base de données et verification si pas deja ou mise a jour a faire, fais avant de passer a la prochaine page
  
}
