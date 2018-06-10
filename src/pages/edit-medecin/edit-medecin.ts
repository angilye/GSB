import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { MedecinProvider, Medecin } from '../../providers/medecin/medecin.provider';
import { CategoryProvider } from '../../providers/category/category.provider';
import { MDecinsPage } from '../m-decins/m-decins';

@Component({
  selector: 'page-edit-medecin',
  templateUrl: 'edit-medecin.html',
})
export class EditMedecinPage {
  model: Medecin;
  categories: any [];
  
  constructor(
    public navCtrl: NavController, public navParams: NavParams, 
    private medecinProvider: MedecinProvider, private toast: ToastController,
    private categoryProvider: CategoryProvider
  ) {
 
    this.model = new Medecin();
     if (this.navParams.data.id) {
       this.medecinProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
    }
  }

  /**
 * Runs when the page has loaded
 */
  ionViewDidLoad() {
    this.categoryProvider.getAll()
      .then((result: any[]) => {
        this.categories = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erreur de get des categories.', duration: 3000, position: 'botton' }).present();
      });

  }

  save() {
    this.savePraticien()
      .then(() => {
        this.toast.create({ message: 'Praticien saved.', duration: 3000, position: 'botton' }).present();
        this.navCtrl.popTo(MDecinsPage);
      })
      .catch(() => {
        this.toast.create({ message: 'Erreur.', duration: 3000, position: 'botton' }).present();
      });
  }
 
  private savePraticien() {
    if (this.model.id) {
      return this.medecinProvider.update(this.model);
    } else {
      return this.medecinProvider.insert(this.model);
    }
  }
 
}