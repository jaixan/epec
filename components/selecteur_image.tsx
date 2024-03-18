/**
 * Composant SelecteurImage
 *
 * Auteur : Étienne Rivard
 *
 * Basé sur : https://github.com/mschwarzmueller/nextjs-complete-guide-course-resources/tree/main/code/02-nextjs-essentials/30-triggering-cache-revalidations/components/meals
 */

'use client';

import classes from './selecteur_image.module.css';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import genererImage from './generateur';
import { Box } from '@mui/material';

/**
 * Propriétés du composant SelecteurImage.
 * @interface ISelecteurImageProps
 * @property {string} libelle Le libellé du champ qui est affiché.
 * @property {string} nom Le nom du champ du formulaire.
 * @property {boolean} [erreur] Indique si le champ est invalide.
 * @property {string} [messageErreur] Le message d'erreur à afficher.
 * @property {string} [imageUrl] L'URL de l'image, utilisé pour afficher l'image sélectionnée auparavant.
 * @property {string} [inviteGenerateur] L'invite pour le générateur d'image.
 */
interface ISelecteurImageProps {
  libelle: string;
  nom: string;
  erreur?: boolean;
  messageErreur?: string;
  imageUrl?: string;
  inviteGenerateur?: string;
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
  const [generationEnCours, setGenerationEnCours] = useState(false);
  const [imageGeneree, setImageGeneree] = useState('');

  useEffect(() => {
    if (props.imageUrl) {
      setImageSelectionnee(props.imageUrl);
    }
  }, [props.imageUrl]);

  // Référence pour le champ de fichier.
  const imageInput = useRef<HTMLInputElement>(null);

  // Le composant original est caché pour une question de look,
  // alors il faut rediriger le clic vers le composant caché.
  function gereClicSelecteur() {
    imageInput.current!.click();
  }

  /**
   * Gère l'événement de clic pour générer une image.
   * @param event L'événement de clic.
   * @returns void
   */
  function gereClicGenererImage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!props.inviteGenerateur) {
      return;
    }

    // On affiche une animation de chargement.
    setGenerationEnCours(true);

    // On génère une image aléatoire.
    genererImage({ invite: props.inviteGenerateur }).then((imageUrl) => {
      // On met à jour l'état de l'image sélectionnée.
      if (imageUrl) {
        setImageSelectionnee(imageUrl);
        setImageGeneree(imageUrl);
      }
      setGenerationEnCours(false);
    });
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
          {!imageSelectionnee && !generationEnCours && (
            <p>Aucune image sélectionnée.</p>
          )}
          {generationEnCours && <div className={classes.loading_animation} />}
          {imageSelectionnee && !generationEnCours && (
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
          accept="image/png, image/jpeg, image/webp"
          name={nom}
          ref={imageInput}
          onChange={gereChangementImage}
        />
        <input
          className={classes.input}
          type="text"
          id="imageGeneree"
          accept="image/png, image/jpeg, image/webp"
          name="imageGeneree"
          defaultValue={imageGeneree}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
          }}
        >
          <button
            className={classes.button}
            type="button"
            onClick={gereClicSelecteur}
          >
            Choisir une image
          </button>
          <button
            className={classes.button}
            type="button"
            onClick={gereClicGenererImage}
            hidden={!props.inviteGenerateur}
            disabled={generationEnCours}
          >
            Générer une image
          </button>
        </Box>
      </div>
    </div>
  );
}
