/**
 * Page pour ajouter un élève
 *
 * Auteur : Étienne Rivard
 *
 */

'use client';

import { useFormState } from 'react-dom';

import SelecteurImage from '@/components/selecteur_image';
import classes from './page.module.css';
import { ajouterEleve } from '@/lib/eleves.actions';
import SoumettreEleve from '@/components/eleve_soumettre';
import { Box, TextField } from '@mui/material';
import { eleveValidationVide } from '@/models/eleves.models';

/**
 * Page pour ajouter un élève.
 * @returns Page pour ajouter un élève (JSX).
 */
export default function PageAjouterEleve() {
  const [state, formAction] = useFormState(ajouterEleve, eleveValidationVide);

  const eleveValidation = state || eleveValidationVide;
  return (
    <>
      <header className={classes.header}>
        <h1>
          Ajouter <span className={classes.highlight}>un élève</span>
        </h1>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={formAction}>
          <Box sx={{ marginBottom: '10px' }}>
            <TextField
              id="numero_da"
              label="Numéro DA"
              name="numero_da"
              error={eleveValidation.numero_da.length > 0}
              helperText={eleveValidation.numero_da}
            />
          </Box>
          <Box sx={{ display: 'flex', marginBottom: '10px' }}>
            <TextField
              id="prenom"
              label="Prénom de l'élève"
              name="prenom"
              error={eleveValidation.prenom.length > 0}
              helperText={eleveValidation.prenom}
            />
            <TextField
              id="nom"
              label="Nom de l'élève"
              name="nom"
              error={eleveValidation.nom.length > 0}
              helperText={eleveValidation.nom}
            />
          </Box>
          <SelecteurImage
            libelle="Photo de l'élève"
            nom="image"
            erreur={eleveValidation.image.length > 0}
          />
          <p className={classes.actions}>{<SoumettreEleve />}</p>
        </form>
      </main>
    </>
  );
}
