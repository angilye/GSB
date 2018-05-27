// Core components
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// RxJS
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { BddApiSignin } from '../models/bddapi-signin.model';

// Models
// Importez models ici
@Injectable()
export class BddService {

  private baseUrl: string = 'https://gsb-api-angelye.c9users.io/';
  // Penser à mettre en place une API KEY ? 
  private apiKey: string = '<API_KEY>';

  constructor(private http: Http) { }

  //fonction demandant si un utilisateur est bien present dans la BDD ( return true ou false )
  public getSignin(login: string, password: string): Promise<any>{
    //Preparation des informations transmise à la fonction à l'API
    const url = `${this.baseUrl}index.php?action=SignIn&login=${login}&mdp=${password}`;
    //Envoie de la requete
    return this.http.get(url)
    .toPromise()
    .then(response => response.json() as BddApiSignin) // si on a une reponse on l'organise via la class BddApiSignin.
    .catch(error => console.log('une erreur est survenue '+ error)) // si probleme.

  }

  // fonction exemple
  public getObjects(): Promise<any> {
    const url = `${this.baseUrl}objects?apiKey=${this.apiKey}`;

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(error => console.log('Une erreur est survenue ' + error))
  }
  // Fin exemple
}

// index.php?action=SignUp&firstname=Eric&lastname=Salyer&email=EricPSalyer@jourrapide.com&password=Boh5ees0l

// index.php?action=GetUser&email=EricPSalyer@jourrapide.com&password=xooKe6AhT
