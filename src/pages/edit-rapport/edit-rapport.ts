import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { MedecinProvider } from '../../providers/medecin/medecin.provider';
import { RapportProvider, Rapport } from '../../providers/rapport/rapport.provider';
import { AfficherRapportPage } from '../afficher-rapport/afficher-rapport';
import { MedicamentProvider } from '../../providers/medicament/medicament.provider';

@Component({
  selector: 'page-edit-rapport',
  templateUrl: 'edit-rapport.html',
})
export class EditRapportPage {

model: Rapport;
praticiens= [];
medicaments= [];
onlyInactives: string;
searchText: string;
idFournie: string;
  
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private toast: ToastController, private rapportProvider: RapportProvider,
    private medecinProvider: MedecinProvider,
    private medicamentProvider: MedicamentProvider
    ) {
 
    this.model = new Rapport();
     if (this.navParams.data.id) {
       this.idFournie = this.navParams.data.id;
        this.rapportProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
    }

  }
 
  /**
   * Runs when the page has loaded
   */
  ionViewDidLoad() {
    this.medecinProvider.getAll(this.searchText)
      .then((result: any[]) => {
        this.praticiens = result;
      })
           
      this.medicamentProvider.getAll(this.searchText)
      .then((result: any[]) => {
        this.medicaments = result;
      })

    }
 
  save() {
    this.saveRapport()
      .then(() => {
        this.toast.create({ message: 'rapport saved.', duration: 3000, position: 'botton' }).present();
        this.navCtrl.popTo(AfficherRapportPage);
      })
      .catch(() => {
        this.toast.create({ message: 'Erreur.', duration: 3000, position: 'botton' }).present();
      });
  }
 
  private saveRapport() {
    if (this.model.id) {
      return this.rapportProvider.update(this.model);
    } else {
      return this.rapportProvider.insert(this.model);
    }
  }
 }

