/**
 * Ce fichier contient l'interface IPresence qui est un modèle de données pour les présences.
 *
 * Auteur : Étienne Rivard
 */

/**
 * Interface pour les présences.
 * @param classe_id L'identifiant de la classe.
 * @param eleve_id L'identifiant de l'élève.
 * @param date_cours La date de la présence.
 * @param present Si l'élève est présent ou non.
 */
export default interface IPresence {
  classe_id: number;
  eleve_id: number;
  date_cours: Date;
  present: boolean;
}
