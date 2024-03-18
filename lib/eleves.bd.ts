'use server';
/**
 * Fonctions vers la base de données des élèves.
 *
 * Auteur : Étienne Rivard
 */
import IEleve from '@/models/eleves.models';

import sql from 'better-sqlite3';
import fs from 'node:fs';
import { ralentir, sauvegardeImage } from './utilitaires';

const db = sql('epec.db');

/**
 * Fonction pour obtenir la liste des élèves.
 * @returns La liste des élèves.
 */
export async function obtenirEleves(): Promise<IEleve[]> {
  await ralentir();
  return db.prepare('SELECT * FROM eleves').all() as IEleve[];
}

/**
 * Fonction pour obtenir un élève par son identifiant.
 * @param id L'identifiant de l'élève.
 * @returns L'élève correspondant à l'identifiant.
 */
export async function obtenirEleveParId(id: number): Promise<IEleve> {
  await ralentir();
  const stmt = db.prepare('SELECT * FROM eleves WHERE id = ?');
  const eleve = stmt.get(id) as IEleve;
  return eleve;
}

/**
 * Enregistre la photo de l'élève.
 * @param eleve
 * @returns Le chemin de la photo
 */
export async function enregistrerPhotoEleve(eleve: IEleve): Promise<string> {
  // Sauvegarder l'image de l'élève
  return sauvegardeImage(`${eleve.numero_da}`, eleve.photo, eleve.image);
}

/**
 * Fonction pour enregistrer un élève.
 * @param eleve L'élève à enregistrer.
 */
export async function enregistreEleve(eleve: IEleve) {
  eleve.photo = await enregistrerPhotoEleve(eleve);

  const stmt = db.prepare(
    'INSERT INTO eleves (numero_da, nom, prenom, photo) VALUES (?, ?, ?, ?)'
  );
  stmt.run(eleve.numero_da, eleve.nom, eleve.prenom, eleve.photo);
}

/**
 * Fonction pour enregistrer les modifications à un élève.
 * @param eleve L'élève à enregistrer.
 */
export async function modifierEleve(eleve: IEleve) {
  if (eleve.image && eleve.image.size > 0) {
    eleve.photo = await enregistrerPhotoEleve(eleve);
    const stmt = db.prepare(
      'UPDATE eleves SET numero_da = ?, nom = ?, prenom = ?, photo = ? WHERE id = ?'
    );
    stmt.run(eleve.numero_da, eleve.nom, eleve.prenom, eleve.photo, eleve.id);
  } else {
    const stmt = db.prepare(
      'UPDATE eleves SET numero_da = ?, nom = ?, prenom = ? WHERE id = ?'
    );
    stmt.run(eleve.numero_da, eleve.nom, eleve.prenom, eleve.id);
  }
}

/**
 * Fonction pour supprimer un élève.
 * @param id L'identifiant de l'élève à supprimer.
 */
export async function supprimerEleve(id: number) {
  const stmt = db.prepare('DELETE FROM eleves WHERE id = ?');
  stmt.run(id);
}
