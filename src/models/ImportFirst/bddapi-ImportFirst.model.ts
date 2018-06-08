
// importation de la preparation pour la lecture du tableau
import { BddApiImportFirstFamille } from '../tableStructure/bddapi-ImportFirs-Famille.model';
import { BddApiImportFirstMedecin } from '../tableStructure/bddapi-ImportFirs-Medecin.model';
import { BddApiImportFirstMedicament } from '../tableStructure/bddapi-ImportFirs-Medicament.model';
import { BddApiImportFirstOffrir } from '../tableStructure/bddapi-ImportFirs-Offrir.model';
import { BddApiImportFirstRapport } from '../tableStructure/bddapi-ImportFirs-Rapport.model';

//Class permettant la lecture et la recuperation d'information lors du retour d'info de l'API en JSON
// utilisation exemple dans chargement.ts
export class BddApiImportFirst {
    Success: string;
    Famille: BddApiImportFirstFamille[];
    Medecin: BddApiImportFirstMedecin[];
    Medicament: BddApiImportFirstMedicament[];
    Offrir: BddApiImportFirstOffrir[];
    Rapport: BddApiImportFirstRapport[];
}
