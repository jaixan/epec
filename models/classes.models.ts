/**
 * Ce fichier contient l'interface IClasse qui est un modèle de données pour les classes.
 *
 * Auteur : Étienne Rivard
 */

/**
 * Interface pour les classes.
 * @param id L'identifiant de la classe.
 * @param sigle Le sigle de la classe.
 * @param titre Le titre de la classe.
 * @param session La session de la classe.
 * @param groupe Le groupe de la classe.
 * @param image Le chemin de l'image de la classe.
 * @param fichierImage Le fichier de l'image de la classe.
 */
export default interface IClasse {
  id?: number;
  sigle: string;
  titre: string;
  session: string;
  groupe: number;
  image: string;
  fichierImage?: File;
}

/**
 * Modèle de données pour les messages de validation pour les classes.
 */
export interface IClasseValidation {
  sigle: string;
  titre: string;
  session: string;
  groupe: string;
  image?: string;
  fichierImage?: string;
}

/**
 * Messages vides de validation pour les classes.
 */
export const classeValidationVide: IClasseValidation = {
  sigle: '',
  titre: '',
  session: '',
  groupe: '',
  image: '',
  fichierImage: '',
};

/**
 * Classe vide.
 */
export const classeVide: IClasse = {
  sigle: '',
  titre: '',
  session: '',
  groupe: 1,
  image: '',
  fichierImage: undefined,
};
