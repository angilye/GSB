import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditRapportPage } from '../edit-rapport/edit-rapport';
import { AfficherRapportPage } from '../afficher-rapport/afficher-rapport';

@Component({
  selector: 'page-g-estionrapports',
  templateUrl: 'g-estionrapports.html'
})
export class GESTIONRAPPORTSPage {

  constructor(public navCtrl: NavController) {
  }

  addRapport() {
    this.navCtrl.push(EditRapportPage);
  }

  goToVOIRRAPPORT(params) {
    if (!params) params = {};
    this.navCtrl.push(AfficherRapportPage);
  }
}

