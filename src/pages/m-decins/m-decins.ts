import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MedecinProvider, Medecin } from '../../providers/medecin/medecin.provider';
import { EditMedecinPage } from '../edit-medecin/edit-medecin';

//permet la gestion de la BDD locale.
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-m-decins',
  templateUrl: 'm-decins.html'
})
export class MDecinsPage {

  medecins: any[] = [];
  onlyInactives: boolean = false;
  searchText: string = null;

  constructor(public navCtrl: NavController,
    private toast: ToastController,
    private medecinProvider: MedecinProvider) { }

  ionViewDidEnter() {
    this.getAllMedecins();
  }

  public getAllMedecins() {
    this.medecinProvider.getAll(this.searchText)
      .then((result: any[]) => {
        this.medecins = result;
      });
  }
  addMedecin() {
    this.navCtrl.push(EditMedecinPage);
  }

  editMedecin(id: number) {
    this.navCtrl.push(EditMedecinPage, { id: id });
  }

  removeMedecin(medecin: Medecin) {
    this.medecinProvider.remove(medecin.id)
      .then(() => {
        var index = this.medecins.indexOf(medecin);
        this.medecins.splice(index, 1);
        this.toast.create({ message: 'Medecin removed.', duration: 3000, position: 'botton' }).present();
      })
  }

  public filterMedecins(ev: any) {
    this.getAllMedecins();
  }

}