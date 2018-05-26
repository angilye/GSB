import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NOUVEAURAPPORTPage } from '../n-ouveaurapport/n-ouveaurapport';
import { MODIFIERRAPPORTPage } from '../m-odifierrapport/m-odifierrapport';

@Component({
  selector: 'page-g-estionrapports',
  templateUrl: 'g-estionrapports.html'
})
export class GESTIONRAPPORTSPage {

  constructor(public navCtrl: NavController) {
  }
  goToNOUVEAURAPPORT(params){
    if (!params) params = {};
    this.navCtrl.push(NOUVEAURAPPORTPage);
  }goToMODIFIERRAPPORT(params){
    if (!params) params = {};
    this.navCtrl.push(MODIFIERRAPPORTPage);
  }
}
