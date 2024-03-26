/**
 * Utilitaires
 *
 * Auteur : Etienne Rivard
 */

import Axios from 'axios';
import fs from 'fs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// Fonction qui ralentit l'exécution de 2 secondes
// Pratique pour simuler un appel à une base de données
export function ralentir(): Promise<void> {
  const delai = parseInt(process.env.DELAI_BD || '0');
  return new Promise((resolve) => setTimeout(resolve, delai));
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

/**
 * Chiffrer les données de session
 * @param texte
 * @returns
 */
async function encrypt(texte: string) {
  const key = new TextEncoder().encode(process.env.CLE_SECRETE!);

  return await new SignJWT({ utilisateur: texte })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10 hours from now')
    .sign(key);
}

/**
 * Déchiffrer les données de session
 * @param encryptedData
 * @returns
 */
async function decrypt(encryptedData: string) {
  const key = new TextEncoder().encode(process.env.CLE_SECRETE!);

  try {
    const { payload } = await jwtVerify(encryptedData, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Erreur de déchiffrement', error);
    return null;
  }
}

/**
 * Créer les cookies de session
 */
export async function creerCookiesSession(utilisateur: string) {
  const donneesSessionChiffrees = await encrypt(utilisateur);
  cookies().set('session', donneesSessionChiffrees, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
}

/**
 * Lire cookies de session
 * @param texte
 * @returns
 */
export async function lireCookiesSession() {
  const texteChiffre = cookies().get('session')?.value;
  if (!texteChiffre) {
    return null;
  }
  const donneesSessionDechiffrees = await decrypt(texteChiffre);
  return donneesSessionDechiffrees;
}

/**
 * Lire cookies de session
 * @param texte
 * @returns
 */
export async function supprimerCookiesSession() {
  cookies().delete('session');
}
