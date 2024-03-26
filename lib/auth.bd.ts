'use server';
/**
 * Fonctions vers la base de données des utilisateurs.
 *
 * Auteur : Étienne Rivard
 */

import sql from 'better-sqlite3';

const db = sql('epec.db');

/**
 * Fonction pour obtenir le mot de passe d'un utilisateur par son courriel.
 * @returns Le mot de passe.
 */
export async function obtenirMotDePasseUtilisateur(
  courriel: string
): Promise<string> {
  const stmt = db.prepare(
    'SELECT motdepasse FROM utilisateurs WHERE courriel = ?'
  );

  const resultat = stmt.get(courriel) as { motdepasse: string };
  if (resultat && resultat.motdepasse) return resultat.motdepasse;
  return '';
}
