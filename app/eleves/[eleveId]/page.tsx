/**
 * Page pour mettre à jour un élève
 *
 * Auteur : Étienne Rivard
 *
 */
'use client';

import { useFormState } from 'react-dom';

import classes from './page.module.css';
import { mettreAJourEleve } from '@/lib/eleves.actions';
import { Box, Skeleton, TextField } from '@mui/material';
import { eleveValidationVide } from '@/models/eleves.models';
import { obtenirEleveParId } from '@/lib/eleves.bd';
import { useEffect, useState } from 'react';
import BoutonSoumettre from '@/components/bouton_soumettre';

/**
 * Propriétés de la page de mise à jour des élèves.
 */
interface PageMiseAJourEleveProps {
  params: {
    eleveId: string;
  };
}

/**
 * Composant pour afficher un squelette du formulaire de mise à jour des élèves.
 * @returns Le JSX du squelette.
 */
export function SqueletteMiseAJourEleves() {
  return (
    <>
      <Box
        sx={{
          width: '80vw',
        }}
      >
        <Skeleton
          width={'20vw'}
          height={50}
          variant="rectangular"
          sx={{
            display: 'flex',
            marginBottom: 1,
            width: { xs: '100vw', md: '40vw', lg: '25vw' },
          }}
        />
        <Box
          sx={{
            width: '80vw',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Skeleton
            width={'20vw'}
            height={50}
            variant="rectangular"
            sx={{
              display: 'flex',
              marginBottom: 1,
              width: { xs: '100vw', md: '40vw', lg: '25vw' },
            }}
          />
          <Box />
          <Skeleton
            width={'20vw'}
            height={50}
            variant="rectangular"
            sx={{
              display: 'flex',
              marginBottom: 1,
              width: { xs: '100vw', md: '40vw', lg: '25vw' },
            }}
          />
        </Box>
      </Box>
    </>
  );
}

/**
 * Page pour mettre à jour un élève.
 * @returns Page pour mettre à jour un élève (JSX).
 */
export default function PageMiseAJourEleve(props: PageMiseAJourEleveProps) {
  const eleveId = +props.params.eleveId;
  const [numero_da, setNumeroDa] = useState(0);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  // Obtenir l'élève par son identifiant.
  useEffect(() => {
    obtenirEleveParId(eleveId).then((e) => {
      setNumeroDa(e.numero_da);
      setPrenom(e.prenom);
      setNom(e.nom);
      setAfficherFormulaire(true);
    });
  }, [eleveId]);

  const [state, formAction] = useFormState(
    mettreAJourEleve,
    eleveValidationVide
  );

  const eleveValidation = state || eleveValidationVide;
  return (
    <>
      <header className={classes.header}>
        <h1>
          Modifier <span className={classes.highlight}>un élève</span>
        </h1>
      </header>
      <main className={classes.main}>
        {!afficherFormulaire ? (
          <SqueletteMiseAJourEleves />
        ) : (
          <form className={classes.form} action={formAction}>
            <input type="hidden" name="eleveId" value={eleveId} />
            <Box sx={{ marginBottom: '10px' }}>
              <TextField
                id="numero_da"
                label="Numéro DA"
                name="numero_da"
                value={numero_da}
                error={eleveValidation.numero_da.length > 0}
                helperText={eleveValidation.numero_da}
                onChange={(e) => setNumeroDa(+e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', marginBottom: '10px' }}>
              <TextField
                id="prenom"
                label="Prénom de l'élève"
                name="prenom"
                value={prenom}
                error={eleveValidation.prenom.length > 0}
                helperText={eleveValidation.prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              <TextField
                id="nom"
                label="Nom de l'élève"
                name="nom"
                value={nom}
                error={eleveValidation.nom.length > 0}
                helperText={eleveValidation.nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </Box>
            <p className={classes.actions}>
              {<BoutonSoumettre label="Modifier l'élève" />}
            </p>
          </form>
        )}
      </main>
    </>
  );
}
