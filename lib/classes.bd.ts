'use server';
/**
 * Fonctions vers la base de données des classes.
 *
 * Auteur : Étienne Rivard
 */
import IClasse from '@/models/classes.models';

import sql from 'better-sqlite3';
import { ralentir, sauvegardeImage } from './utilitaires';
import IEleve from '@/models/eleves.models';
import IPresence from '@/models/presences.models';
import { now } from 'lodash';

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
  const classe = stmt.get(id) as IClasse;
  classe.eleves = obtenirIdElevesDeLaClasse(id);
  console.log('classe', classe);
  return classe;
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

  mettreAJourElevesDeLaClasse(classe.id!, classe.eleves);
}

/**
 * Extrait les identifiants des élèves d'une classe.
 * @param id
 * @returns Les identifiants des élèves de la classe.
 */
function obtenirIdElevesDeLaClasse(id: number): number[] {
  const stmt = db.prepare(
    'SELECT eleve_id FROM classes_eleves WHERE classe_id = ?'
  );
  return stmt.all(id).map((row) => (row as { eleve_id: number }).eleve_id);
}

/**
 * Extrait les élèves d'une classe.
 * @param id
 * @returns Les élèves de la classe.
 */
export async function obtenirElevesDeLaClasse(id: number) {
  const stmt = db.prepare(
    'SELECT eleves.id, eleves.nom, eleves.prenom, eleves.photo FROM classes_eleves INNER JOIN eleves ON eleves.id = classes_eleves.eleve_id WHERE classe_id = ?'
  );
  return stmt.all(id) as IEleve[];
}

function mettreAJourElevesDeLaClasse(id: number, eleves: number[]) {
  const stmt = db.prepare('DELETE FROM classes_eleves WHERE classe_id = ?');
  stmt.run(id);

  const stmt2 = db.prepare(
    'INSERT INTO classes_eleves (classe_id, eleve_id) VALUES (?, ?)'
  );
  eleves.forEach((eleve_id) => {
    stmt2.run(id, eleve_id);
  });
}

/**
 * Fonction pour supprimer une classe.
 * @param id L'identifiant de la classe à supprimer.
 */
export async function supprimerClasse(id: number) {
  const stmt = db.prepare('DELETE FROM classes WHERE id = ?');
  stmt.run(id);
}

// Récupérer les dates de présence déjà prises
export async function extraireDatesPresences(classeId: number) {
  const stmt = db.prepare(
    'SELECT DISTINCT date_cours FROM presences WHERE classe_id = ? ORDER BY date_cours DESC'
  );
  const rows = stmt.all(classeId);
  const dates = rows.map((row: any) => new Date(row.date_cours));
  return dates;
}

// Récupérer les présences déjà prises
export async function extrairePresences(classeId: number) {
  const stmt = db.prepare('SELECT * FROM presences WHERE classe_id = ?');
  const rows = stmt.all(classeId);
  const presences = rows.map((row: any) => {
    const presence: IPresence = {
      classe_id: row.classe_id,
      eleve_id: row.eleve_id,
      present: row.present === 1,
      date_cours: new Date(row.date_cours),
    };
    return presence;
  });
  return presences;
}

// Enregistrer les présences
export async function enregistrerPresences(presences: IPresence[]) {
  console.log(now(), 'enregistrerPresences');
  const insertStmt = db.prepare(
    'INSERT INTO presences (classe_id, eleve_id, date_cours, present) VALUES (?, ?, ?, ?)'
  );
  const updateStmt = db.prepare(
    'UPDATE presences SET present = ? WHERE classe_id = ? AND eleve_id = ? AND date_cours = ?'
  );
  presences.forEach((presence) => {
    const existingPresence = obtenirPresence(
      presence.classe_id,
      presence.eleve_id,
      presence.date_cours
    );
    if (existingPresence) {
      updateStmt.run(
        presence.present ? 1 : 0,
        presence.classe_id,
        presence.eleve_id,
        presence.date_cours.toISOString()
      );
    } else {
      insertStmt.run(
        presence.classe_id,
        presence.eleve_id,
        presence.date_cours.toISOString(),
        presence.present ? 1 : 0
      );
    }
  });
}

function obtenirPresence(
  classeId: number,
  eleveId: number,
  dateCours: Date
): IPresence | undefined {
  const stmt = db.prepare(
    'SELECT * FROM presences WHERE classe_id = ? AND eleve_id = ? AND date_cours = ?'
  );
  const row: any = stmt.get(classeId, eleveId, dateCours.toISOString());
  if (row) {
    const presence: IPresence = {
      classe_id: row.classe_id,
      eleve_id: row.eleve_id,
      present: row.present === 1,
      date_cours: new Date(row.date_cours),
    };
    return presence;
  }
  return undefined;
}
