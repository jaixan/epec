/**
 * Utilitaires
 *
 * Auteur : Etienne Rivard
 */

import Axios from 'axios';
import fs from 'fs';
import { revalidatePath } from 'next/cache';

// Fonction qui ralentit l'exécution de 2 secondes
// Pratique pour simuler un appel à une base de données
export function ralentir(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

/**
 * Télécharge un fichier à partir d'une url.
 * @param url L'url du fichier à télécharger.
 * @param path Le chemin où le fichier sera sauvegardé.
 * * Venant de :
 * https://stackoverflow.com/questions/55374755/node-js-axios-download-file-stream-and-writefile
 */
export async function telechargerFichier(url: string, path: string) {
  const fsPromises = fs.promises;

  const fileResponse = await Axios({
    url: url,
    method: 'GET',
    responseType: 'stream',
  });

  // Sauvegarder le fichier
  await fsPromises.writeFile(path, fileResponse.data);
}

/**
 * Sauvegarde une image dans le dossier uploads.
 * @param url L'url de l'image à télécharger.
 * @param fichierImage Le fichier image à sauvegarder.
 * @param nomFichierSansExtension Le nom du fichier sans l'extension.
 * @returns Le chemin vers l'image sauvegardée.
 */
export async function sauvegardeImage(
  nomFichierSansExtension: string,
  url: string,
  fichierImage?: File
) {
  if (url === null && fichierImage === null) {
    throw new Error('Aucune image à sauvegarder!');
  }

  if (fichierImage === undefined && url !== null) {
    // Télécharger l'image venant de l'url
    const extension = 'png';
    const nomFichier = `${nomFichierSansExtension}.${extension}`;
    await telechargerFichier(url, `uploads/${nomFichier}`);
    revalidatePath(`/api/images`);
    return `/api/images/${nomFichier}`;
  } else {
    const extension = fichierImage!.name.split('.').pop();
    const nomFichier = `${nomFichierSansExtension}.${extension}`;

    const stream = fs.createWriteStream(`uploads/${nomFichier}`);
    const bufferedImage = await fichierImage!.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error("La sauvegarde de l'image a échouée!");
      }
    });

    revalidatePath(`/api/images`);
    return `/api/images/${nomFichier}`;
  }
}
