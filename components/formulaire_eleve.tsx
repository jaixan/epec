/**
 * Formulaire de gestion d'un élève
 *
 * Auteur : Étienne Rivard
 *
 */
'use client';

import { useFormState } from 'react-dom';

import classes from './formulaire.module.css';
import { Box, TextField } from '@mui/material';
import { IEleve, eleveValidationVide } from '@/models/eleves.models';
import BoutonSoumettre from '@/components/bouton_soumettre';
import SelecteurImage from '@/components/selecteur_image';

/**
 * Propriétés de la page de mise à jour des élèves.
 */
interface FormulaireEleveProps {
  formAction: any; // L'action serveur à exécuter lors de la soumission du formulaire
  donneesInitiales: IEleve; // Les données initiales du formulaire
}

/**
 * Formulaire de gestion d'un élève.
 * @returns Formulaire de gestion d'un élève (JSX).
 */
export default function FormulaireEleve(props: FormulaireEleveProps) {
  const eleve = props.donneesInitiales;
  const [state, formAction] = useFormState(
    props.formAction,
    eleveValidationVide
  );

  const eleveValidation = state || eleveValidationVide;
  return (
    <>
      <form className={classes.form} action={formAction}>
        <Box sx={{ marginBottom: '10px' }}>
          <TextField
            id="numero_da"
            label="Numéro DA"
            name="numero_da"
            defaultValue={eleve.numero_da}
            error={eleveValidation.numero_da.length > 0}
            helperText={eleveValidation.numero_da}
          />
        </Box>
        <Box sx={{ display: 'flex', marginBottom: '10px' }}>
          <TextField
            id="prenom"
            label="Prénom de l'élève"
            name="prenom"
            defaultValue={eleve.prenom}
            error={eleveValidation.prenom.length > 0}
            helperText={eleveValidation.prenom}
          />
          <TextField
            id="nom"
            label="Nom de l'élève"
            name="nom"
            defaultValue={eleve.nom}
            error={eleveValidation.nom.length > 0}
            helperText={eleveValidation.nom}
          />
        </Box>
        <SelecteurImage
          libelle="Photo de l'élève"
          nom="image"
          imageUrl={eleve.photo}
          erreur={eleveValidation.image!.length > 0}
        />
        <p className={classes.actions}>
          {<BoutonSoumettre label="Enregistrer" />}
        </p>
      </form>
    </>
  );
}
