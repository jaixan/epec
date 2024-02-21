/**
 * Composant SelecteurImage
 *
 * Auteur : Étienne Rivard
 *
 * Basé sur : https://github.com/mschwarzmueller/nextjs-complete-guide-course-resources/tree/main/code/02-nextjs-essentials/30-triggering-cache-revalidations/components/meals
 */

'use client';

import classes from './selecteur_image.module.css';

import { useRef, useState } from 'react';
import Image from 'next/image';

/**
 * Propriétés du composant SelecteurImage.
 */
interface ISelecteurImageProps {
  libelle: string;
  nom: string;
  erreur?: boolean;
  messageErreur?: string;
}

/**
 * Composant pour sélectionner une image.
 * @param props Les propriétés du composant.
 * @returns Le JSX du composant.
 */
export default function SelecteurImage(props: ISelecteurImageProps) {
  const { libelle, nom } = props;
  const [imageSelectionnee, setImageSelectionnee] = useState<
    string | ArrayBuffer | null
  >(null);

  // Référence pour le champ de fichier.
  const imageInput = useRef<HTMLInputElement>(null);

  // Le composant original est caché pour une question de look,
  // alors il faut rediriger le clic vers le composant caché.
  function gereClicSelecteur() {
    imageInput.current!.click();
  }

  /**
   * Gère l'événement de changement d'image.
   * @param event L'événement de changement.
   * @returns void
   */
  function gereChangementImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files![0];

    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    // Lorsque le fichier est lu, on met à jour l'état de l'image sélectionnée.
    // Doit être assigné avant de lire le fichier.
    fileReader.onload = () => {
      setImageSelectionnee(fileReader.result);
    };

    // Lit le fichier.
    fileReader.readAsDataURL(file);
  }

  // Affiche une erreur si le champ est invalide.
  const erreur = props.erreur ? classes.erreur : classes.apercu;

  return (
    <div className={classes.selecteur}>
      <label htmlFor={nom}>{libelle}</label>
      <div className={classes.controls}>
        <div className={erreur}>
          {!imageSelectionnee && <p>Aucune image sélectionnée.</p>}
          {imageSelectionnee && (
            <Image
              // @ts-ignore
              src={imageSelectionnee}
              alt="L'image sélectionnée par l'utilisateur."
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={nom}
          accept="image/png, image/jpeg"
          name={nom}
          ref={imageInput}
          onChange={gereChangementImage}
        />
        <button
          className={classes.button}
          type="button"
          onClick={gereClicSelecteur}
        >
          Choisir une image
        </button>
      </div>
    </div>
  );
}
