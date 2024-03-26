/**
 * Ce fichier contient l'interface IEleve qui est un modèle de données pour les élèves
 *
 * Auteur : Étienne Rivard
 */

/**
 * Type pour les élèves.
 * @param id L'identifiant de l'élève.
 * @param numero_da Le numéro DA de l'élève.
 * @param nom Le nom de l'élève.
 * @param prenom Le prénom de l'élève.
 * @param photo Le chemin de la photo de l'élève.
 * @param image L'image de l'élève.
 */
export type IEleve = {
  id?: number;
  numero_da: number;
  nom: string;
  prenom: string;
  photo: string;
  image?: File;
};

/**
 * Type de données pour les messages de validation pour les élèves.
 */
export type IEleveValidation = {
  numero_da: string;
  nom: string;
  prenom: string;
  photo: string;
  image?: string;
};

/**
 * Messages vides de validation pour les élèves.
 */
export const eleveValidationVide: IEleveValidation = {
  numero_da: '',
  nom: '',
  prenom: '',
  photo: '',
  image: '',
};

/**
 * Élève vide.
 */
export const eleveVide: IEleve = {
  numero_da: 0,
  nom: '',
  prenom: '',
  photo: '',
};
