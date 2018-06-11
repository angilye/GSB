// Core components
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//permet la gestion de la BDD locale.
import { SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';

// RxJS
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { BddApiSignin } from '../models/signin/bddapi-signin.model';
import { BddApiGetUser } from '../models/getuser/bddapi-getuser.model';
import { BddApiImportFirst } from '../models/ImportFirst/bddapi-ImportFirst.model';

// class import
import { Medecin } from '../providers/medecin/medecin.provider';
import { Rapport } from '../providers/rapport/rapport.provider';

import { DatabaseProvider } from '../providers/database/database.provider';



// Models
// Importez models ici
@Injectable()
export class BddService {

  private baseUrl: string = 'https://gsb-api-angelye.c9users.io/';
  // Penser � mettre en place une API KEY ? 
  private apiKey: string = '<API_KEY>';

  private idVisiteurConnecte: string = "";

  constructor(private http: Http, private dbProvider: DatabaseProvider, private storage: Storage) {
    storage.get('idVisiteurConnecte').then((val) => {
      this.idVisiteurConnecte = val;
    });
    }

  //fonction demandant si un utilisateur est bien present dans la BDD ( return true ou false )
  public getSignin(login: string, password: string): Promise<any>{
    //Preparation des informations transmise � la fonction � l'API
    const url = `${this.baseUrl}index.php?action=SignIn&login=${login}&mdp=${password}`;
    //Envoie de la requete
    return this.http.get(url)
    .toPromise()
    .then(response => response.json() as BddApiSignin) // si on a une reponse on l'organise via la class BddApiSignin.
    .catch(error => console.log('une erreur est survenue '+ error)) // si probleme.

  }

  // fonction demandant les informations propres de l'utilisateur renseigner.
  public getInfoVisiteur(login: string, password: string): Promise<any> {
    const url = `${this.baseUrl}index.php?action=GetUser&login=${login}&mdp=${password}`;

    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as BddApiGetUser)
      .catch(error => console.log('Une erreur est survenue ' + error))
  }

  // fonction servant à l'importation des tables lors de la premiere connexion.
  public getTables(id: string): Promise<any> {
    const url = `${this.baseUrl}index.php?action=ImportFirst&id=${id}`;

    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as BddApiImportFirst)
      .catch(error => console.log('Une erreur est survenue ' + error))
  }

  public pushRequeteSave(){

    let test: BddApiSignin = new BddApiSignin;
    let donnee: Medecin = new Medecin;
    let donneeRapport: Rapport;

    let url: string;
    
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {

        db.executeSql('SELECT * FROM attenteEnvoieAPI', {})
        .then((requeteStocker) => {
          
          if (requeteStocker.rows.length > 0) {
            
            let idAttenteEnvoieAPI: string = '';
            let requeteAction: string = '';
            let requeteId1: string = '';
            let requeteId2: string = '';
            let requeteTable: string = '';
            
            for (var i = 0; i < requeteStocker.rows.length; i++) {
              
              idAttenteEnvoieAPI = requeteStocker.rows.item(i).id;
              requeteAction = requeteStocker.rows.item(i).action;
              requeteId1 = requeteStocker.rows.item(i).id1;

              if (requeteStocker.rows.item(i).id2 != null) {
                requeteId2 = requeteStocker.rows.item(i).id2;
              }

              requeteTable = requeteStocker.rows.item(i).tableAction;

              if (requeteTable == "medecin") {

                if (requeteAction == "remove") {
                  
                  url = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=${requeteAction}&tableAction=${requeteTable}&id=${requeteId1}&idVisiteur=${this.idVisiteurConnecte}`;
                  this.http.get(url)
                    .toPromise()
                    .then(response => {
                      test = response.json() as BddApiSignin
                      if (test.Success) {
                        db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                      }
                    })
                    .catch(error => console.log('Une erreur est survenue ' + error));

                }else if (requeteAction == "insert") {

                  db.executeSql('SELECT * FROM  ' + requeteTable + ' WHERE id=\'' + requeteId1 + '\' ', {})
                    .then((data) => {
                      
                      if (data.rows.length > 0) {
                        
                        for (var i = 0; i < data.rows.length; i++) {
                          
                          donnee.id = data.rows.item(i).id;
                          donnee.nom = data.rows.item(i).nom;
                          donnee.prenom = data.rows.item(i).prenom;
                          donnee.adresse = data.rows.item(i).adresse;
                          donnee.cp = data.rows.item(i).cp;
                          donnee.ville = data.rows.item(i).ville;
                          donnee.tel = data.rows.item(i).tel;
                          donnee.specialiteComplementaire = data.rows.item(i).specialiteComplementaire;
                          donnee.departement = data.rows.item(i).departement;
                          donnee.category_id = data.rows.item(i).category_id;

                          let urlI = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=insert&tableAction=${requeteTable}&idVisiteur=${this.idVisiteurConnecte}&id=${donnee.id}&nom=${donnee.nom}&prenom=${donnee.prenom}&adresse=${donnee.adresse}&cp=${donnee.cp}&ville=${donnee.ville}&tel=${donnee.tel}&specialiteComplementaire=${donnee.specialiteComplementaire}&departement=${donnee.departement}&category_id=${donnee.category_id}`;
                          this.http.get(urlI)
                            .toPromise()
                            .then(response => {
                              test = response.json() as BddApiSignin
                              if (test.Success) {
                                db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                              }
                            })
                            .catch(error => console.log('Une erreur est survenue ' + error));

                        }

                      }

                    });

                } else if (requeteAction == "update") {

                  db.executeSql('SELECT * FROM  ' + requeteTable + ' WHERE id=\'' + requeteId1 + '\' ', {})
                    .then((data) => {

                      if (data.rows.length > 0) {

                        for (var i = 0; i < data.rows.length; i++) {

                          donnee.id = data.rows.item(i).id;
                          donnee.nom = data.rows.item(i).nom;
                          donnee.prenom = data.rows.item(i).prenom;
                          donnee.adresse = data.rows.item(i).adresse;
                          donnee.cp = data.rows.item(i).cp;
                          donnee.ville = data.rows.item(i).ville;
                          donnee.tel = data.rows.item(i).tel;
                          donnee.specialiteComplementaire = data.rows.item(i).specialiteComplementaire;
                          donnee.departement = data.rows.item(i).departement;
                          donnee.category_id = data.rows.item(i).category_id;

                          let urlU = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=update&tableAction=${requeteTable}&idVisiteur=${this.idVisiteurConnecte}&id=${donnee.id}&nom=${donnee.nom}&prenom=${donnee.prenom}&adresse=${donnee.adresse}&cp=${donnee.cp}&ville=${donnee.ville}&tel=${donnee.tel}&specialiteComplementaire=${donnee.specialiteComplementaire}&departement=${donnee.departement}&category_id=${donnee.category_id}`;
                          this.http.get(urlU)
                            .toPromise()
                            .then(response => {
                              test = response.json() as BddApiSignin
                              if (test.Success) {
                                db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                              }
                            })
                            .catch(error => console.log('Une erreur est survenue ' + error));

                          }

                      }

                    });

                }

              } else if (requeteTable == "rapport") {

                if (requeteAction == "remove") {
                  const urle = `https://gsb-api-angelye.c9users.io/index.php?action=test&actionSQL=debutRemove`; this.http.get(urle).toPromise();
                  url = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=${requeteAction}&tableAction=${requeteTable}&id=${requeteId1}&idVisiteur=${this.idVisiteurConnecte}`;
                  this.http.get(url)
                    .toPromise()
                    .then(response => {
                      test = response.json() as BddApiSignin
                      const urle = `https://gsb-api-angelye.c9users.io/index.php?action=test&actionSQL=debutpromesse`; this.http.get(urle).toPromise();
                      if (test.Success) {
                        const urle = `https://gsb-api-angelye.c9users.io/index.php?action=test&actionSQL=success`; this.http.get(urle).toPromise();
                        db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                          .then(() => { const urle = `https://gsb-api-angelye.c9users.io/index.php?action=test&actionSQL=lacondetoi`; this.http.get(urle).toPromise();});
                      }
                    })
                    .catch(error => console.log('Une erreur est survenue ' + error));

                } else if (requeteAction == "insert") {

                  db.executeSql('SELECT * FROM  ' + requeteTable + ' WHERE id=\'' + requeteId1 + '\' ', {})
                    .then((data) => {

                      if (data.rows.length > 0) {

                        for (var i = 0; i < data.rows.length; i++) {

                          donneeRapport.id = data.rows.item(i).id;
                          donneeRapport.date = data.rows.item(i).date;
                          donneeRapport.motif = data.rows.item(i).motif;
                          donneeRapport.bilan = data.rows.item(i).bilan;
                          donneeRapport.idVisiteur = data.rows.item(i).idVisiteur;
                          donneeRapport.idMedecin = data.rows.item(i).idMedecin;

                          let urlI = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=insert&tableAction=${requeteTable}&id=18&date=${donneeRapport.date}&motif=${donneeRapport.motif}&bilan=${donneeRapport.bilan}&idVisiteur=${donneeRapport.idVisiteur}&idMedecin=${donneeRapport.idMedecin}`;
                          this.http.get(urlI)
                            .toPromise()
                            .then(response => {
                              test = response.json() as BddApiSignin
                              if (test.Success) {
                                db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                              }
                            })
                            .catch(error => console.log('Une erreur est survenue ' + error));

                        }

                      }

                    });

                } else if (requeteAction == "update") {

                  db.executeSql('SELECT * FROM  ' + requeteTable + ' WHERE id=\'' + requeteId1 + '\' ', {})
                    .then((data) => {

                      if (data.rows.length > 0) {

                        for (var i = 0; i < data.rows.length; i++) {

                          donneeRapport.id = data.rows.item(i).id;
                          donneeRapport.date = data.rows.item(i).date;
                          donneeRapport.motif = data.rows.item(i).motif;
                          donneeRapport.bilan = data.rows.item(i).bilan;
                          donneeRapport.idVisiteur = data.rows.item(i).idVisiteur;
                          donneeRapport.idMedecin = data.rows.item(i).idMedecin;

                          let urlU = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=update&tableAction=${requeteTable}&id=${donneeRapport.id}&date=${donneeRapport.date}&motif=${donneeRapport.motif}&bilan=${donneeRapport.bilan}&idVisiteur=${donneeRapport.idVisiteur}&idMedecin=${donneeRapport.idMedecin}`;
                          this.http.get(urlU)
                            .toPromise()
                            .then(response => {
                              test = response.json() as BddApiSignin
                              if (test.Success) {
                                db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                              }
                            })
                            .catch(error => console.log('Une erreur est survenue ' + error));

                        }

                      }

                    });

                }

              } else if (requeteTable == "offrir") {

                if (requeteAction == "remove") {

                  url = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=${requeteAction}&tableAction=${requeteTable}&idRapport=${requeteId1}`;
                  this.http.get(url)
                    .toPromise()
                    .then(response => {
                      test = response.json() as BddApiSignin
                      if (test.Success) {
                        db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                      }
                    })
                    .catch(error => console.log('Une erreur est survenue ' + error));

                } //else if (requeteAction == "insert") {

                //   db.executeSql('SELECT * FROM  ' + requeteTable + ' WHERE idRapport=\'' + requeteId1 + '\' AND idMedicament=\'' + requeteId2 + '\'', {})
                //     .then((data) => {

                //       if (data.rows.length > 0) {

                //         for (var i = 0; i < data.rows.length; i++) {

                //           donneeRapport.id = data.rows.item(i).idRapport;
                //           donneeRapport.idMedicament = data.rows.item(i).idMedicament;
                //           donneeRapport.quantite = data.rows.item(i).quantite;

                //           let urlI = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=insert&tableAction=${requeteTable}&idRapport=${donneeRapport.id}&idMedicament=${donneeRapport.idMedicament}&quantite=${donneeRapport.quantite}`;
                //           this.http.get(urlI)
                //             .toPromise()
                //             .then(response => {
                //               test = response.json() as BddApiSignin
                //               if (test.Success) {
                //                 db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                //               }
                //             })
                //             .catch(error => console.log('Une erreur est survenue ' + error));

                //         }

                //       }

                //     });

                // } else if (requeteAction == "update") {

                //   db.executeSql('SELECT * FROM  ' + requeteTable + ' WHERE idRapport=\'' + requeteId1 + '\' AND idMedicament=\'' + requeteId2 + '\'', {})
                //     .then((data) => {

                //       if (data.rows.length > 0) {

                //         for (var i = 0; i < data.rows.length; i++) {

                //           donneeRapport.id = data.rows.item(i).idRapport;
                //           donneeRapport.idMedicament = data.rows.item(i).idMedicament;
                //           donneeRapport.quantite = data.rows.item(i).quantite;

                //           let urlU = `${this.baseUrl}index.php?action=PushRequeteSave&actionSQL=update&tableAction=${requeteTable}&idRapport=${donneeRapport.id}&idMedicament=${donneeRapport.idMedicament}&quantite=${donneeRapport.quantite}`;
                //           this.http.get(urlU)
                //             .toPromise()
                //             .then(response => {
                //               test = response.json() as BddApiSignin
                //               if (test.Success) {
                //                 db.executeSql('DELETE FROM attenteEnvoieAPI WHERE id=\'' + idAttenteEnvoieAPI + '\'', {})
                //               }
                //             })
                //             .catch(error => console.log('Une erreur est survenue ' + error));

                //         }

                //       }

                //     });

                // }



              }

            }
          } else {
            return;
          }

        })
          .catch(() => { const url = `${this.baseUrl}index.php?action=test&requete=echouerAlaRequete`; this.http.get(url).toPromise(); });
      })
      .catch(() => { const url = `${this.baseUrl}index.php?action=test&requete=echouerAlouverture`; this.http.get(url).toPromise(); });

  }

}

// index.php?action=SignUp&firstname=Eric&lastname=Salyer&email=EricPSalyer@jourrapide.com&password=Boh5ees0l

// index.php?action=GetUser&email=EricPSalyer@jourrapide.com&password=
