'use server';
/**
 * Fonctions vers la base de données des élèves.
 *
 * Auteur : Étienne Rivard
 */
import IEleve from '@/models/eleves.models';

import sql from 'better-sqlite3';
import fs from 'node:fs';

const db = sql('epec.db');

/**
 * Fonction pour obtenir la liste des élèves.
 * @returns La liste des élèves.
 */
export async function obtenirEleves(): Promise<IEleve[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare('SELECT * FROM eleves').all() as IEleve[];
}

/**
 * Fonction pour obtenir un élève par son identifiant.
 * @param id L'identifiant de l'élève.
 * @returns L'élève correspondant à l'identifiant.
 */
export async function obtenirEleveParId(id: number): Promise<IEleve> {
  const stmt = db.prepare('SELECT * FROM eleves WHERE id = ?');
  return new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
    const eleve = stmt.get(id) as IEleve;
    return eleve;
  });
}

export async function enregistrerPhotoEleve(eleve: IEleve) {
  const extension = eleve.image!.name.split('.').pop();
  const nomFichier = `${eleve.numero_da}.${extension}`;

  const stream = fs.createWriteStream(`public/images/eleves/${nomFichier}`);
  const bufferedImage = await eleve.image!.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('La sauvegarde de la photo a échouée!');
    }
  });

  const photo = `/images/eleves/${nomFichier}`;
  return photo;
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
