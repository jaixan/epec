'use server';

import { IEleve, IEleveValidation } from '@/models/eleves.models';
import { enregistreEleve, modifierEleve, supprimerEleve } from './eleves.bd';

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

/**
 * Traite l'ajout d'un élève venant du formulaire.
 *
 * @param etatPrecedent les messages d'erreurs par champ
 * @param formData les données du formulaire
 * @returns Un message d'erreur ou rien.
 */
export async function ajouterEleve(
  state: IEleveValidation | void,
  formData: FormData
): Promise<IEleveValidation | void> {
  const numero_da: string | null = formData.get('numero_da') as string | null;
  const nom: string | null = formData.get('nom') as string | null;
  const prenom: string | null = formData.get('prenom') as string | null;
  const image: File | null = formData.get('image') as File | null;

  if (
    estTexteInvalide(nom) ||
    estTexteInvalide(prenom) ||
    estNumeroDaInvalide(numero_da) ||
    !image ||
    image.size === 0
  ) {
    return {
      numero_da: estNumeroDaInvalide(numero_da) ? 'Numéro DA invalide' : '',
      nom: estTexteInvalide(nom) ? 'Nom invalide' : '',
      prenom: estTexteInvalide(prenom) ? 'Prénom invalide' : '',
      photo: '',
      image: image!.size === 0 ? 'Image invalide' : '',
    };
  }

  const eleve: IEleve = {
    numero_da: +numero_da!,
    nom: nom!,
    prenom: prenom!,
    photo: 'photo',
    image: image,
  };

  await enregistreEleve(eleve);

  // Revalidation de la page pour mettre à jour la liste des élèves.
  revalidatePath('/eleves');

  // Redirection vers la liste des élèves.
  redirect('/eleves');
}

/**
 * Traite la mise à jour d'un élève venant du formulaire.
 *
 * @param etatPrecedent les messages d'erreurs par champ
 * @param formData les données du formulaire
 * @returns Un message d'erreur ou rien.
 */
export async function mettreAJourEleve(
  eleveId: number,
  state: IEleveValidation | void,
  formData: FormData
): Promise<IEleveValidation | void> {
  const numero_da: string | null = formData.get('numero_da') as string | null;
  const nom: string | null = formData.get('nom') as string | null;
  const prenom: string | null = formData.get('prenom') as string | null;
  const image: File | null = formData.get('image') as File | null;

  if (
    estTexteInvalide(nom) ||
    estTexteInvalide(prenom) ||
    estNumeroDaInvalide(numero_da)
  ) {
    return {
      numero_da: estNumeroDaInvalide(numero_da) ? 'Numéro DA invalide' : '',
      nom: estTexteInvalide(nom) ? 'Nom invalide' : '',
      prenom: estTexteInvalide(prenom) ? 'Prénom invalide' : '',
      photo: '',
    };
  }

  const eleve: IEleve = {
    id: eleveId,
    numero_da: +numero_da!,
    nom: nom!,
    prenom: prenom!,
    photo: 'photo',
    image: image || undefined,
  };

  await modifierEleve(eleve);

  // Revalidation de la page pour mettre à jour la liste des élèves.
  revalidatePath('/eleves');

  // Redirection vers la liste des élèves.
  redirect('/eleves');
}

/**
 * Traite la suppression d'un élève
 *
 * @param etatPrecedent un élève
 * @param formData les données du formulaire
 * @returns Un message d'erreur ou rien.
 */
export async function supprimerEleveAction(
  state: IEleveValidation | void,
  formData: FormData
): Promise<IEleveValidation | void> {
  const eleveid: string | null = formData.get('eleveid') as string | null;

  await supprimerEleve(+eleveid!);

  // Revalidation de la page pour mettre à jour la liste des élèves.
  revalidatePath('/eleves');

  // Redirection vers la liste des élèves.
  redirect('/eleves');
}
