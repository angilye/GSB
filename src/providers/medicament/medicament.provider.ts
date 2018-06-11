//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider} from '../database/database.provider';

@Injectable()
export class MedicamentProvider {

  constructor(private dbProvider: DatabaseProvider) { 
  
   }

// function get data
public get(id: number){
  return this.dbProvider.getDB()
  .then((db:SQLiteObject)=>{
    let sql ='SELECT * FROM medicaments WHERE id = ?';
    let data = [id];

    return db.executeSql(sql, data)
    .then ((data: any)=>{
      if (data.rows.length > 0){
        let item = data.rows.item(0);
        let medicament = new Medicament();
        medicament.id = item.id;
        medicament.nomCommercial = item.nomCommercial;
        medicament.composition= item.composition;
        medicament.effets= item.effets;
        medicament.contreIndications = item.contreIndications;
        medicament.idFamille = item.idFamille;
        
      
        return medicament;
      }
    return null;
    })
  .catch ((e)=>console.error());
  })
.catch ((e)=>console.error());
}

// function get all data 

public getAll(nom:string = null){
  return this.dbProvider.getDB()
  .then ((db: SQLiteObject)=>{
    let sql = 'select m.*, f.libelle as famille_name FROM medicament m inner join famille f on m.idFamille = f.id';
    var data =[];

    if (nom){
      sql += 'and m.nom like ?'
      data.push ('%'+ nom +'%');
    }
    return db.executeSql(sql, data)
    .then((data: any)=>{
      if (data.rows.length >0) {
        let medicaments = [];
        for (var i=0; i< data.rows.length; i++){
        var medicament = data.rows.item(i);
        medicaments.push(medicament);
        }
        return medicaments;
      }else {
        return [];
      }
    }) 
    .catch ((e)=>console.error());
  })
.catch ((e)=>console.error());
}

}
export class Medicament {
  id: number;
  nomCommercial: string;
  composition: string;
  effets: string;
  contreIndications: string;
  idFamille: number;
}
 
