//Class permettant la lecture et la recuperation d'information lors du retour d'info de l'API en JSON
// utilisation exemple dans chargement.ts
export class BddApiImportFirstMedecin {
    id: string;
    nom: string;
    prenom: string;
    adresse: string;
    cp: string;
    ville: string;
    tel: string;
    specialiteComplementaire: string;
    departement: string;
}