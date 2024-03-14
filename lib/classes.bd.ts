'use server';
/**
 * Fonctions vers la base de données des classes.
 *
 * Auteur : Étienne Rivard
 */
import IClasse from '@/models/classes.models';

import sql from 'better-sqlite3';
import fs from 'node:fs';
import axios from 'axios';
import { downloadFile } from './telechargement';

const db = sql('epec.db');

/**
 * Fonction pour obtenir la liste des classes.
 * @returns La liste des classes.
 */
export async function obtenirClasses(): Promise<IClasse[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare('SELECT * FROM classes').all() as IClasse[];
}

/**
 * Fonction pour obtenir une classe par son identifiant.
 * @param id L'identifiant de la classe.
 * @returns La classe correspondant à l'identifiant.
 */
export async function obtenirClasseParId(id: number): Promise<IClasse> {
  const stmt = db.prepare('SELECT * FROM classes WHERE id = ?');
  return new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
    return stmt.get(id) as IClasse;
  });
}

/**
 * Fonction pour enregistrer une classe.
 * @param eleve La classe à enregistrer.
 */
export async function enregistreClasse(classe: IClasse) {
  if (classe.fichierImage === undefined) {
    // L'image de la classe vient de la génération d'image
    const extension = 'png';
    const nomFichier = `${classe.sigle}-${classe.groupe}-${classe.session}.${extension}`;
    // Télécharger l'image venant de l'url
    await downloadFile(classe.image, `public/images/classes/${nomFichier}`);
    classe.image = `/images/classes/${nomFichier}`;
  } else {
    const extension = classe.fichierImage!.name.split('.').pop();
    const nomFichier = `${classe.sigle}-${classe.groupe}-${classe.session}.${extension}`;

    const stream = fs.createWriteStream(`public/images/classes/${nomFichier}`);
    const bufferedImage = await classe.fichierImage!.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error('La sauvegarde de la photo a échouée!');
      }
    });

    classe.image = `/images/classes/${nomFichier}`;
  }
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
  const stmt = db.prepare(
    'UPDATE classes SET sigle = ?, titre = ?, session = ?, groupe = ? WHERE id = ?'
  );
  stmt.run(
    classe.sigle,
    classe.titre,
    classe.session,
    classe.groupe,
    classe.id
  );
}

/**
 * Fonction pour supprimer une classe.
 * @param id L'identifiant de la classe à supprimer.
 */
export async function supprimerClasse(id: number) {
  const stmt = db.prepare('DELETE FROM classes WHERE id = ?');
  stmt.run(id);
}
