import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database.provider';

import { BddService } from '../../services/bddapi.services';
import { Http } from '@angular/http';

import { Storage } from '@ionic/storage';

@Injectable()
export class RapportProvider {
 
  private idVisiteurConnecte;

  constructor(private dbProvider: DatabaseProvider, private storage: Storage, private bddServie: BddService, private http: Http) {
    storage.get('idVisiteurConnecte').then((val) => {
      this.idVisiteurConnecte = val;
    });
  }

  public insert(rapport: Rapport) {

    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sqlRapport = 'insert into rapport(date, motif, bilan, idVisiteur, idMedecin)  values (\'' + rapport.date + '\',\'' + rapport.motif + '\',\'' + rapport.bilan + '\',\'' + this.idVisiteurConnecte + '\',\'' + rapport.idMedecin + '\')';

        // insertion du rapport dans la bd local
        db.executeSql(sqlRapport, {})
          .then(() => {

            //recuperation de l'idRapport qui vien d'etre cree pour le sauvegarder dans attenteEnvoieAPI
            db.executeSql('SELECT id FROM rapport WHERE date=\'' + rapport.date + '\' AND motif=\'' + rapport.motif + '\' AND bilan=\'' + rapport.bilan + '\' AND idVisiteur=\'' + this.idVisiteurConnecte + '\' AND idMedecin=\'' + rapport.idMedecin + '\'', {})
              .then((elementId) => {

                rapport.id = elementId.rows.item(0);

                // Sauvegarde des donnes utile a l'envoie du rapport sauvegarder en local sur la BD en LIGNE
                let sqlSave = "INSERT INTO attenteEnvoieAPI (id1, action, tableAction) values ('" + rapport.id + "','insert','rapport')";
                db.executeSql(sqlSave, {})
                  .then(() => {

                    // insertion des informations offrir sur la BD local
                    db.executeSql('insert into offrir(idRapport, idMedicament, quantite) values(\'' + rapport.id + '\', \'' + rapport.idMedicament + '\', \'' + rapport.quantite + '\')', {})
                      .then(() => {

                        // Sauvegarde des donnes utile a l'envoie de OFFRIR sauvegarder en local sur la BD en LIGNE
                        let sqlSave = "INSERT INTO attenteEnvoieAPI (id1, id2, action, tableAction) values ('" + rapport.id + "', '" + rapport.idMedicament + "','insert','offrir')";
                        db.executeSql(sqlSave, {})
                          .then(() => { const url = `https://gsb-api-angelye.c9users.io/index.php?action=test&actionSQL=insert`; this.http.get(url).toPromise(); })
                          .catch((e) => console.error('can not save data', e));

                      });

                  })
                  .catch((e) => console.error('can not save data', e));

              });

          })
          .catch((e) => console.error('can not insert data rapport', e));


      })
      .catch((e) => console.error(e));
  }

  public update(rapport: Rapport) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {

        let sqlRapport = 'update rapport set date=?, motif=?, bilan=?, idMedecin=? where id=?';
        let dataRapport = [rapport.date, rapport.motif, rapport.bilan, rapport.idMedecin, rapport.id];

        // sauvegarde de l'update en local sur rapport 
        db.executeSql(sqlRapport, dataRapport)
          .catch((e) => console.error('can not update rapport', e))
          .then(() => {

            // sauvegarde de l'update en local sur offrir
            db.executeSql('update offrir set quantite=\'' + rapport.quantite + '\' where idRapport=\'' + rapport.id + '\' AND idMedicament=\'' + rapport.idMedicament + '\'', {})
              .then(() => {

                // Sauvegarde des donnes utile a l'envoie de OFFRIR sauvegarder en local sur la BD en LIGNE
                let sqlSave = "INSERT INTO attenteEnvoieAPI (id1, action, tableAction) values ('" + rapport.id + "','update','rapport')";
                db.executeSql(sqlSave, {})
                  .then(() => {

                    // Sauvegarde des donnes utile a l'envoie de OFFRIR sauvegarder en local sur la BD en LIGNE
                    let sqlSave = "INSERT INTO attenteEnvoieAPI (id1, id2, action, tableAction) values ('" + rapport.id + "', '" + rapport.idMedicament + "','update','offrir')";
                    db.executeSql(sqlSave, {})
                      .then(() => { const url = `https://gsb-api-angelye.c9users.io/index.php?action=test&actionSQL=update`; this.http.get(url).toPromise(); })
                      .catch((e) => console.error('can not save data', e));

                  })
                  .catch((e) => console.error('can not save data', e));

              });


          });

      })
      .catch((e) => console.error(e));
  }

  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from rapport where id = ?';
        let data = [id];

        //Suppression du rapport en local
        return db.executeSql(sql, data)
          .then(() => {

            // suppression en local de la ligne id de offrir
            db.executeSql('delete from offrir where idRapport =\'' + id + '\'', {})
              .then(() => {

                // Sauvegarde des donnes utile a l'envoie de OFFRIR sauvegarder en local sur la BD en LIGNE
                let sqlSave = "INSERT INTO attenteEnvoieAPI (id1, action, tableAction) values ('" + id + "','remove','rapport')";
                db.executeSql(sqlSave, {})
                  .then(() => {

                    // Sauvegarde des donnes utile a l'envoie de OFFRIR sauvegarder en local sur la BD en LIGNE
                    let sqlSave = "INSERT INTO attenteEnvoieAPI (id1, action, tableAction) values ('" + id + "','remove','offrir')";
                    db.executeSql(sqlSave, {})
                      .then(() => { const url = `https://gsb-api-angelye.c9users.io/index.php?action=test&actionSQL=remove`; this.http.get(url).toPromise(); })
                      .catch((e) => console.error('can not save data', e));

                  })
                  .catch((e) => console.error('can not save data', e));

              });

          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select r.id, r.date, r.motif, r.bilan, o.quantite as quantite_medoc, m.id as id_medicament, m.nomCommercial as nom_medicament, mede.id as id_medecin, mede.prenom as prenom_medecin, v.nom as nom_visiteur, v.prenom as prenom_visiteur from rapport r left join offrir o on r.id =  o.idRapport left join medicament m on o.idMedicament = m.id left join medecin mede on r.idMedecin = mede.id left join visiteur v on r.IdVisiteur = v.id where r.id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let rapport = new Rapport();
              rapport.id = item.id;
              rapport.date = item.date;
              rapport.motif = item.motif;
              rapport.bilan = item.bilan;
              rapport.idMedecin = item.id_medecin;
              rapport.idVisiteur = item.idVisiteur;
              rapport.idMedicament = item.id_medicament;
              rapport.quantite = item.quantite_medoc;

              return rapport;
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAll(date: Date = null) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select r.id, r.date, r.motif, r.bilan, o.quantite as quantite_medoc, m.nomCommercial as nom_medicament, mede.nom as nom_medecin, mede.prenom as prenom_medecin, v.nom as nom_visiteur, v.prenom as prenom_visiteur from rapport r left join offrir o on r.id =  o.idRapport left join medicament m on o.idMedicament = m.id left join medecin mede on r.idMedecin = mede.id left join visiteur v on r.IdVisiteur = v.id';
        var data = [];
        //filtrer par la date
        if (date) {

          var regex = /(\w+)-(\w+)-(\w+)/;
          var dateRegex = date.toString().replace(regex, '$3-$2-$1');

          sql += ' WHERE r.date like ?'
          data.push('%' + dateRegex + '%');
        }
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let rapports = [];
              for (var i = 0; i < data.rows.length; i++) {
                var rapport = data.rows.item(i);
                rapports.push(rapport);
              }
              return rapports;
            } else {
              return [];
            }
          })
          .catch((e) => console.error('can not get all rapports', e));
      })
      .catch((e) => console.error(e));
  }
}

export class Rapport {
  id: number;
  date: Date;
  motif: string;
  bilan: string;
  idVisiteur: string;
  idMedecin: string;
  idMedicament: string;
  quantite: number;
}


