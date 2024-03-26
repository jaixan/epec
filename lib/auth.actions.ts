/**
 * Traite l'authentification de l'utilisateur.
 *
 * @param etatPrecedent les messages d'erreurs par champ
 * @param formData les données du formulaire
 * @returns Un message d'erreur ou rien.
 */
'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { obtenirMotDePasseUtilisateur } from './auth.bd';
import { creerCookiesSession, supprimerCookiesSession } from './utilitaires';

interface IAuthentifierUtilisateurValidation {
  message: string;
}

export async function authentifierUtilisateur(
  state: IAuthentifierUtilisateurValidation | void,
  formData: FormData
): Promise<IAuthentifierUtilisateurValidation | void> {
  const utilisateur: string | null = formData.get('utilisateur') as
    | string
    | null;
  const motdepasse: string | null = formData.get('motdepasse') as string | null;

  const validation: IAuthentifierUtilisateurValidation = {
    message: '',
  };

  if (!utilisateur || !motdepasse) {
    validation.message = 'Veuillez remplir tous les champs.';
    return validation;
  }

  const hash = await obtenirMotDePasseUtilisateur(utilisateur!);
  if (!hash) {
    validation.message = 'Utilisateur ou mot de passe invalide.';
    return validation;
  }

  if (!(await bcrypt.compare(motdepasse, hash))) {
    validation.message = 'Utilisateur ou mot de passe invalide.';
    return validation;
  }

  creerCookiesSession(utilisateur);
  redirect('/');
}

/**
 * Déconnecte l'utilisateur.
 */
export async function deconnecterUtilisateur() {
  supprimerCookiesSession();
  redirect('/login');
}
