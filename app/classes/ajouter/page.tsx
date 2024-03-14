/**
 * Page pour ajouter une classe
 *
 * Auteur : Étienne Rivard
 *
 */

'use client';

import { useFormState } from 'react-dom';

import SelecteurImage from '@/components/selecteur_image';
import classes from './page.module.css';
import { ajouterClasse } from '@/lib/classes.actions';
import BoutonSoumettre from '@/components/bouton_soumettre';
import { Box, TextField } from '@mui/material';
import { classeValidationVide } from '@/models/classes.models';
import { useEffect, useState } from 'react';

/**
 * Page pour ajouter une classe.
 * @returns Page pour ajouter une classe (JSX).
 */
export default function PageAjouterClasse() {
  const [state, formAction] = useFormState(ajouterClasse, classeValidationVide);
  const [inviteGenerateur, setInviteGenerateur] = useState('');

  useEffect(() => {
    const genererInvite =
      'Tu dois générer une image pour représenter une classe ' +
      "dans un logiciel de gestion.L'image peut avoir n'importe quel style, " +
      ' en autant que ça représente le nom de la classe.En aucun cas il y aura ';
    "du texte dans l'image. Le nom de la classe est : " + 'titre du cours';
    setInviteGenerateur(genererInvite);
  }, []);

  const classeValidation = state || classeValidationVide;
  return (
    <>
      <header className={classes.header}>
        <h1>
          Ajouter <span className={classes.highlight}>une classe</span>
        </h1>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={formAction}>
          <Box sx={{ marginBottom: '10px' }}>
            <TextField
              id="sigle"
              label="Sigle du cours"
              name="sigle"
              error={classeValidation.sigle.length > 0}
              helperText={classeValidation.sigle}
            />
            <TextField
              id="titre"
              label="Titre du cours"
              name="titre"
              error={classeValidation.titre.length > 0}
              helperText={classeValidation.titre}
            />
          </Box>
          <Box sx={{ display: 'flex', marginBottom: '10px' }}>
            <TextField
              id="session"
              label="Session du cours"
              name="session"
              error={classeValidation.session.length > 0}
              helperText={classeValidation.session}
            />
            <TextField
              id="groupe"
              label="Groupe du cours"
              name="groupe"
              error={classeValidation.groupe.length > 0}
              helperText={classeValidation.groupe}
            />
          </Box>
          <SelecteurImage
            libelle="Image représentant la classe"
            nom="fichierImage"
            inviteGenerateur={inviteGenerateur}
            erreur={classeValidation.fichierImage!.length > 0}
          />
          <p className={classes.actions}>
            {<BoutonSoumettre label="Ajouter une classe" />}
          </p>
        </form>
      </main>
    </>
  );
}
