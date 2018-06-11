import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GESTIONRAPPORTSPage } from '../g-estionrapports/g-estionrapports';
import { NOUVEAURAPPORTPage } from '../n-ouveaurapport/n-ouveaurapport';
import { GESTIONMEDECINSPage } from '../g-estionmedecins/g-estionmedecins';
import { MDecinsPage } from '../m-decins/m-decins';

import { BddService } from '../../services/bddapi.services';

@Component({
  selector: 'page-acceuil',
  templateUrl: 'acceuil.html'
})
export class AcceuilPage {
  error:string;
  constructor(public navCtrl: NavController, private bddService: BddService) {
  }
  goToGESTIONRAPPORTS(params){
    if (!params) params = {};
    this.navCtrl.push(GESTIONRAPPORTSPage);
  }goToNOUVEAURAPPORT(params){
    if (!params) params = {};
    this.navCtrl.push(NOUVEAURAPPORTPage);
  }goToGESTIONMEDECINS(params){
    if (!params) params = {};
    this.navCtrl.push(GESTIONMEDECINSPage);
  }goToMDecins(params){
    if (!params) params = {};
    this.navCtrl.push(MDecinsPage);
  }

  synchronisation() {
    this.bddService.pushRequeteSave();
  }
}
