// Core components
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// RxJS
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { BddApiSignin } from '../models/bddapi-signin.model';
import { BddApiGetUser } from '../models/bddapi-getuser.model';

// Models
// Importez models ici
@Injectable()
export class BddService {

  private baseUrl: string = 'https://gsb-api-angelye.c9users.io/';
  // Penser � mettre en place une API KEY ? 
  private apiKey: string = '<API_KEY>';

  constructor(private http: Http) { }

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
  
}

// index.php?action=SignUp&firstname=Eric&lastname=Salyer&email=EricPSalyer@jourrapide.com&password=Boh5ees0l

// index.php?action=GetUser&email=EricPSalyer@jourrapide.com&password=xooKe6AhT
