import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PROFILDUMEDECINPage } from '../p-rofildumedecin/p-rofildumedecin';
import { MDecinsPage } from '../m-decins/m-decins';

import { EditMedecinPage } from '../edit-medecin/edit-medecin';

@Component({
  selector: 'page-g-estionmedecins',
  templateUrl: 'g-estionmedecins.html'
})
export class GESTIONMEDECINSPage {

  constructor(public navCtrl: NavController) {
  }
  goToPROFILDUMEDECIN(params){
    if (!params) params = {};
    this.navCtrl.push(EditMedecinPage);
  }goToMDecins(params){
    if (!params) params = {};
    this.navCtrl.push(MDecinsPage);
  }
}
