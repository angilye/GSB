/*
* Un exemple d'implementation d'un service au sein d'angular
*/

// Core components
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// RxJS
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { BddApiSignin } from '../models/bddapi-signin.model';

// Models
// Importez vos models ici
@Injectable()
export class BddService {

  private baseUrl: string = 'https://gsb-api-angelye.c9users.io/';
  private apiKey: string = '<API_KEY>';

  constructor(private http: Http) { }

  //fonction demandant si un utilisateur est bien present dans la BDD ( return true ou false )
  public getSignin(login: string, password: string): Promise<any>{
    const url = `${this.baseUrl}index.php?action=SignIn&login=${login}&mdp=${password}`;

    return this.http.get(url)
    .toPromise()
    .then(response => response.json() as BddApiSignin)
    .catch(error => console.log('une erreur est survenue '+ error)) 

  }

  // fonction exemple
  public getObjects(): Promise<any> {
    const url = `${this.baseUrl}objects?apiKey=${this.apiKey}`;

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(error => console.log('Une erreur est survenue ' + error))
  }

}

// index.php?action=SignUp&firstname=Eric&lastname=Salyer&email=EricPSalyer@jourrapide.com&password=Boh5ees0l

// index.php?action=GetUser&email=EricPSalyer@jourrapide.com&password=xooKe6AhT
