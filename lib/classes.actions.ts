'use server';

import { IClasse, IClasseValidation } from '@/models/classes.models';
import {
  enregistreClasse,
  modifierClasse,
  supprimerClasse,
} from './classes.bd';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Fonction pour valider si un texte est invalide.
function estTexteInvalide(texte: string | null | undefined) {
  return !texte || texte.trim() === '';
}

// Fonction pour valider si un groupe est invalide.
function estGroupeInvalide(groupe: number | null | undefined) {
  return !groupe || groupe < 1;
}

/**
 * Fonction pour valider si une classe est invalide.
 */
function estClasseInvalide(
  sigle: string | null | undefined,
  titre: string | null | undefined,
  session: string | null | undefined,
  groupe: number | null | undefined,
  image: string | null | undefined,
  fichierImage: File | null | undefined,
  imageObligatoire: boolean
): IClasseValidation {
  const validation: IClasseValidation = {
    sigle: '',
    titre: '',
    session: '',
    groupe: '',
    image: '',
    fichierImage: '',
  };

  // Validation du sigle
  if (estTexteInvalide(sigle)) {
    validation.sigle = 'Sigle invalide';
  }

  // Validation du titre
  if (estTexteInvalide(titre)) {
    validation.titre = 'Titre invalide';
  }

  // Validation du groupe
  if (estGroupeInvalide(groupe)) {
    validation.groupe = 'Groupe invalide';
  }

  // Validation de la session
  if (estTexteInvalide(session)) {
    validation.session = 'Session invalide';
  }

  // Validation de l'image
  if (imageObligatoire && !image && !fichierImage) {
    validation.image = 'Image invalide';
  }

  return validation;
}

/**
 * Traite l'ajout d'une classe venant du formulaire.
 *
 * @param etatPrecedent les messages d'erreurs par champ
 * @param formData les données du formulaire
 * @returns Un message d'erreur ou rien.
 */
export async function ajouterClasse(
  state: IClasseValidation | void,
  formData: FormData
): Promise<IClasseValidation | void> {
  const sigle: string | null = formData.get('sigle') as string | null;
  const titre: string | null = formData.get('titre') as string | null;
  const groupe: number | null = formData.get('groupe') as number | null;
  const session: string | null = formData.get('session') as string | null;
  const fichierImage: File | null = formData.get('fichierImage') as File | null;
  const imageGeneree: string | null = formData.get('imageGeneree') as
    | string
    | null;
  const id_des_eleves: string | null = formData.get('id_des_eleves') as
    | string
    | null;

  const validation: IClasseValidation = estClasseInvalide(
    sigle,
    titre,
    session,
    groupe,
    imageGeneree,
    fichierImage,
    true
  );

  // Si un champ est invalide, on retourne les messages d'erreurs.
  if (
    validation.sigle ||
    validation.titre ||
    validation.session ||
    validation.groupe ||
    validation.image
  ) {
    return validation;
  }

  var classe: IClasse;
  const image = imageGeneree || 'image';
  const eleves = id_des_eleves?.split(',').map((id) => +id);

  if (imageGeneree) {
    classe = {
      sigle: sigle!,
      titre: titre!,
      groupe: groupe!,
      session: session!,
      image: image,
      eleves: eleves!,
    };
  } else {
    classe = {
      sigle: sigle!,
      titre: titre!,
      groupe: groupe!,
      session: session!,
      image: 'image',
      fichierImage: fichierImage!,
      eleves: eleves!,
    };
  }

  await enregistreClasse(classe);

  // Revalidation de la page pour mettre à jour la liste des classes.
  revalidatePath('/classes');

  // Redirection vers la liste des classes.
  redirect('/classes');
}

/**
 * Traite la mise à jour d'une classe venant du formulaire.
 *
 * @param etatPrecedent les messages d'erreurs par champ
 * @param formData les données du formulaire
 * @returns Un message d'erreur ou rien.
 */
export async function mettreAJourClasse(
  classeid: number,
  state: IClasseValidation | void,
  formData: FormData
): Promise<IClasseValidation | void> {
  const sigle: string | null = formData.get('sigle') as string | null;
  const titre: string | null = formData.get('titre') as string | null;
  const groupe: number | null = formData.get('groupe') as number | null;
  const session: string | null = formData.get('session') as string | null;
  const fichierImage: File | null = formData.get('fichierImage') as File | null;
  const imageGeneree: string | null = formData.get('imageGeneree') as
    | string
    | null;
  const id_des_eleves: string | null = formData.get('id_des_eleves') as
    | string
    | null;

  console.log('id_des_eleves', id_des_eleves);

  const validation: IClasseValidation = estClasseInvalide(
    sigle,
    titre,
    session,
    groupe,
    imageGeneree,
    fichierImage,
    false
  );

  // Si un champ est invalide, on retourne les messages d'erreurs.
  if (
    validation.sigle ||
    validation.titre ||
    validation.session ||
    validation.groupe ||
    validation.image
  ) {
    return validation;
  }

  const eleves = id_des_eleves?.split(',').map((id) => +id);

  var classe: IClasse;
  const image = imageGeneree || 'image';
  if (imageGeneree) {
    classe = {
      id: +classeid!,
      sigle: sigle!,
      titre: titre!,
      groupe: groupe!,
      session: session!,
      image: image,
      eleves: eleves!,
    };
  } else {
    classe = {
      id: +classeid!,
      sigle: sigle!,
      titre: titre!,
      groupe: groupe!,
      session: session!,
      image: image,
      fichierImage: fichierImage!,
      eleves: eleves!,
    };
  }

  await modifierClasse(classe);

  // Revalidation de la page pour mettre à jour la liste des classes.
  revalidatePath('/classes');

  // Redirection vers la liste des classes.
  redirect('/classes');
}

/**
 * Traite la suppression d'une classe
 *
 * @param etatPrecedent une classe
 * @param formData les données du formulaire
 * @returns Un message d'erreur ou rien.
 */
export async function supprimerClasseAction(
  state: IClasseValidation | void,
  formData: FormData
): Promise<IClasseValidation | void> {
  const classeid: string | null = formData.get('classeid') as string | null;

  await supprimerClasse(+classeid!);

  // Revalidation de la page pour mettre à jour la liste des classes.
  revalidatePath('/classes');

  // Redirection vers la liste des classes.
  redirect('/classes');
}
