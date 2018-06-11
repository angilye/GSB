import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database.provider';
import { BddService } from '../../services/bddapi.services';


@Injectable()
export class MedecinProvider {

    constructor(private dbProvider: DatabaseProvider, private bddService: BddService) { }

    public insert(medecin: Medecin) {
        return this.dbProvider.getDB()
            .then((db: SQLiteObject) => {
                let sql = 'insert into medecin (nom, prenom, adresse, cp, ville, tel, specialiteComplementaire, departement, category_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                let data = [medecin.nom, medecin.prenom, medecin.adresse, medecin.cp, medecin.ville, medecin.tel, medecin.specialiteComplementaire, medecin.departement, medecin.category_id];

                db.executeSql(sql, data)
                .catch((e) => console.error('can not insert data praticien', e))
                .then(() => {

                    let dataSave = [medecin.nom, medecin.prenom, medecin.adresse, medecin.cp, medecin.ville, medecin.tel, medecin.specialiteComplementaire, medecin.departement, medecin.category_id];
                    db.executeSql("SELECT id FROM medecin WHERE nom=? AND prenom=? AND adresse=? AND cp=? AND ville=? AND tel=? AND specialiteComplementaire=? AND departement=? AND category_id=?", dataSave)
                        .then((elementId) => {

                            medecin.id = elementId.rows.item(0).id;
                                
                            let sqlSave = "INSERT INTO attenteEnvoieAPI (id1, action, tableAction) values ('" + medecin.id + "','insert','medecin')";
                            return db.executeSql(sqlSave, {})
                                .catch((e) => console.error('can not save data', e));

                        });

                });
                
            })
            .catch((e) => console.error(e));

    }

    public update(medecin: Medecin) {
        return this.dbProvider.getDB()
            .then((db: SQLiteObject) => {
                let sql = 'update medecin set nom=?, prenom=?, adresse=?, cp=?, ville=?, tel=?, specialiteComplementaire=?, departement=?, category_id=? where id=?';
                let data = [medecin.nom, medecin.prenom, medecin.adresse, medecin.cp, medecin.ville, medecin.tel, medecin.specialiteComplementaire, medecin.departement, medecin.category_id, medecin.id];

                return db.executeSql(sql, data)
                    .catch((e) => console.error(e))
                    .then(() => { 

                        let sqlSaveUpdate = "INSERT INTO attenteEnvoieAPI (id1, action, tableAction) values ('" + medecin.id + "','update','medecin')";

                        db.executeSql(sqlSaveUpdate, {})
                            .catch((e) => console.error('can not save data', e));

                    });
            })
            .catch((e) => console.error(e));
    }

    public remove(id: number) {
        return this.dbProvider.getDB()
            .then((db: SQLiteObject) => {
                let sql = 'delete from medecin where id = ?';
                let data = [id];

                return db.executeSql(sql, data)
                    .catch((e) => console.error(e))
                    .then(() => { 

                        let sqlSaveRemove = "INSERT INTO attenteEnvoieAPI (id1, action, tableAction) values ('" + id + "','remove','medecin')";

                        db.executeSql(sqlSaveRemove, {})
                            .catch((e) => console.error('can not save data', e));

                    });
            })
            .catch((e) => console.error(e));
    }

    public get(id: number) {
        return this.dbProvider.getDB()
            .then((db: SQLiteObject) => {
                let sql = 'select * from medecin where id = ?';
                let data = [id];

                return db.executeSql(sql, data)
                    .then((data: any) => {
                        if (data.rows.length > 0) {
                            let item = data.rows.item(0);
                            let medecin = new Medecin();
                            medecin.id = item.id;
                            medecin.nom = item.nom;
                            medecin.prenom = item.prenom;
                            medecin.adresse = item.adresse;
                            medecin.cp = item.cp;
                            medecin.ville = item.ville;
                            medecin.tel = item.tel;
                            medecin.specialiteComplementaire = item.specialiteComplementaire;
                            medecin.departement = item.departement;
                            medecin.category_id = item.category_id;

                            return medecin;
                        }
                        return null;
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }

    public getAll(nom: string = null) {
        return this.dbProvider.getDB()
            .then((db: SQLiteObject) => {
                let sql = 'SELECT m.*, c.name as category_name FROM medecin m inner join categories c on m.category_id = c.id'; //where p.active = ?
                var data: any[] = [];

                // filtrer par nom de medecin
                if (nom) {
                    sql += ' WHERE m.nom like ?'
                    data.push('%' + nom + '%');
                }
                return db.executeSql(sql, data)
                    .then((data: any) => {
                        if (data.rows.length > 0) {
                            let praticiens: any[] = [];
                            for (var i = 0; i < data.rows.length; i++) {
                                var praticien = data.rows.item(i);
                                praticiens.push(praticien);
                            }
                            return praticiens;
                        } else {
                            return [];
                        }
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }

    

}// fermeture de la classe PraticienProvider

export class Medecin {
    id: number;
    nom: string;
    prenom: string;
    adresse: string;
    cp: string;
    ville: string;
    tel: string;
    specialiteComplementaire: string;
    departement: string;
    category_id: number;
}