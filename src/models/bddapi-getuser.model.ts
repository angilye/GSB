
// importation de la preparation pour la lecture du tableau
import { BddApiGetUserVisiteur } from './bddapi-getuser-visiteur.model';

//Class permettant la lecture et la recuperation d'information lors du retour d'info de l'API en JSON
// utilisation exemple dans chargement.ts
export class BddApiGetUser {
  Success: string;
  Visiteur: BddApiGetUserVisiteur[];
  id: string;
  nom: string;
  prenom: string;
  login: string;
  mdp: string;
  adresse: string;
  cp: string;
  ville: string;
  dateEmbauche: string;
}
