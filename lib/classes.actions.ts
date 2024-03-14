'use server';

import IClasse, { IClasseValidation } from '@/models/classes.models';
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

// Fonction pour valider si un numéro DA est invalide.
function estNumeroDaInvalide(numeroDa: string | null | undefined) {
  return !numeroDa || numeroDa.trim() === '' || isNaN(+numeroDa);
}

// Fonction pour valider si un groupe est invalide.
function estGroupeInvalide(groupe: number | null | undefined) {
  return !groupe || groupe < 1;
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

  if (
    estTexteInvalide(sigle) ||
    estTexteInvalide(titre) ||
    estGroupeInvalide(groupe) ||
    (!fichierImage && !imageGeneree)
  ) {
    return {
      sigle: estTexteInvalide(sigle) ? 'Sigle invalide' : '',
      titre: estTexteInvalide(titre) ? 'Titre invalide' : '',
      session: estTexteInvalide(session) ? 'Session invalide' : '',
      groupe: estGroupeInvalide(groupe) ? 'Groupe invalide' : '',
      image: '',
      fichierImage: fichierImage!.size === 0 ? 'Image invalide' : '',
    };
  }

  var classe: IClasse;
  const image = imageGeneree || 'image';
  if (imageGeneree) {
    classe = {
      sigle: sigle!,
      titre: titre!,
      groupe: groupe!,
      session: session!,
      image: image,
    };
  } else {
    classe = {
      sigle: sigle!,
      titre: titre!,
      groupe: groupe!,
      session: session!,
      image: 'image',
      fichierImage: fichierImage!,
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
  state: IClasseValidation | void,
  formData: FormData
): Promise<IClasseValidation | void> {
  const sigle: string | null = formData.get('sigle') as string | null;
  const titre: string | null = formData.get('titre') as string | null;
  const groupe: number | null = formData.get('groupe') as number | null;
  const session: string | null = formData.get('session') as string | null;
  const fichierImage: File | null = formData.get('image') as File | null;

  if (
    estTexteInvalide(sigle) ||
    estTexteInvalide(titre) ||
    estGroupeInvalide(groupe)
  ) {
    return {
      sigle: estNumeroDaInvalide(sigle) ? 'Sigle invalide' : '',
      titre: estTexteInvalide(titre) ? 'Titre invalide' : '',
      session: estTexteInvalide(session) ? 'Session invalide' : '',
      groupe: estGroupeInvalide(groupe) ? 'Groupe invalide' : '',
      image: '',
      fichierImage: '',
    };
  }
  const classe: IClasse = {
    sigle: sigle!,
    titre: titre!,
    groupe: groupe!,
    session: session!,
    image: 'image',
  };

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
