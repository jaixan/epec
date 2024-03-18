'use server';
/**
 * Fonctions vers la base de données des classes.
 *
 * Auteur : Étienne Rivard
 */
import IClasse from '@/models/classes.models';

import sql from 'better-sqlite3';
import { ralentir, sauvegardeImage } from './utilitaires';

const db = sql('epec.db');

/**
 * Fonction pour obtenir la liste des classes.
 * @returns La liste des classes.
 */
export async function obtenirClasses(): Promise<IClasse[]> {
  await ralentir();
  return db.prepare('SELECT * FROM classes').all() as IClasse[];
}

/**
 * Fonction pour obtenir une classe par son identifiant.
 * @param id L'identifiant de la classe.
 * @returns La classe correspondant à l'identifiant.
 */
export async function obtenirClasseParId(id: number): Promise<IClasse> {
  await ralentir();
  const stmt = db.prepare('SELECT * FROM classes WHERE id = ?');
  return stmt.get(id) as IClasse;
}

/**
 * Fonction pour enregistrer une classe.
 * @param eleve La classe à enregistrer.
 */
export async function enregistreClasse(classe: IClasse) {
  // Sauvegarder l'image de la classe

  classe.image = await sauvegardeImage(
    `${classe.sigle}-${classe.groupe}-${classe.session}`,
    classe.image,
    classe.fichierImage
  );

  const stmt = db.prepare(
    'INSERT INTO classes (sigle, titre, session, groupe, image) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(
    classe.sigle,
    classe.titre,
    classe.session,
    classe.groupe,
    classe.image
  );
}

/**
 * Fonction pour enregistrer les modifications à une classe.
 * @param eleve La classe à enregistrer.
 */
export async function modifierClasse(classe: IClasse) {
  if (
    classe.image !== 'image' ||
    (classe.fichierImage && classe.fichierImage.size > 0)
  ) {
    // Sauvegarder l'image de la classe
    classe.image = await sauvegardeImage(
      `${classe.sigle}-${classe.groupe}-${classe.session}`,
      classe.image,
      classe.fichierImage
    );

    const stmt = db.prepare(
      'UPDATE classes SET sigle = ?, titre = ?, session = ?, groupe = ?, image = ? WHERE id = ?'
    );
    const result = stmt.run(
      classe.sigle,
      classe.titre,
      classe.session,
      classe.groupe,
      classe.image,
      classe.id
    );
  } else {
    const stmt = db.prepare(
      'UPDATE classes SET sigle = ?, titre = ?, session = ?, groupe = ? WHERE id = ?'
    );
    const result = stmt.run(
      classe.sigle,
      classe.titre,
      classe.session,
      classe.groupe,
      classe.id
    );
  }
}

/**
 * Fonction pour supprimer une classe.
 * @param id L'identifiant de la classe à supprimer.
 */
export async function supprimerClasse(id: number) {
  const stmt = db.prepare('DELETE FROM classes WHERE id = ?');
  stmt.run(id);
}
