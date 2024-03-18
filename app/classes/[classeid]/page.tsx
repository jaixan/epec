/**
 * Page pour mettre à jour une classe
 *
 * Auteur : Étienne Rivard
 *
 */
'use client';

import { useFormState } from 'react-dom';

import classes from './page.module.css';
import { mettreAJourClasse } from '@/lib/classes.actions';
import { Box, Skeleton, TextField } from '@mui/material';
import { classeValidationVide } from '@/models/classes.models';
import { obtenirClasseParId } from '@/lib/classes.bd';
import { useEffect, useState } from 'react';
import BoutonSoumettre from '@/components/bouton_soumettre';
import SelecteurImage from '@/components/selecteur_image';

/**
 * Propriétés de la page de mise à jour des classes.
 */
interface PageMiseAJourClasseProps {
  params: {
    classeid: string;
  };
}

/**
 * Composant pour afficher un squelette du formulaire de mise à jour des classes.
 * @returns Le JSX du squelette.
 */
export function SqueletteMiseAJourClasse() {
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
 * Page pour mettre à jour une classe.
 * @returns Page pour mettre à jour une classe (JSX).
 */
export default function PageMiseAJourClasse(props: PageMiseAJourClasseProps) {
  const classeid = +props.params.classeid;
  const [inviteGenerateur, setInviteGenerateur] = useState('');
  const [sigle, setSigle] = useState('');
  const [titre, setTitre] = useState('');
  const [session, setSession] = useState('');
  const [groupe, setGroupe] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  // Générer l'invite pour le générateur d'image seulement si le titre du cours est entré.
  useEffect(() => {
    if (titre === '') {
      setInviteGenerateur('');
      return;
    }

    const genererInvite =
      'Tu dois générer une image pour représenter une classe ' +
      "dans un logiciel de gestion.L'image peut avoir n'importe quel style, " +
      ' en autant que ça représente le nom de la classe.En aucun cas il y aura ';
    "du texte dans l'image. Le nom de la classe est : " + titre;
    setInviteGenerateur(genererInvite);
  }, [titre]);

  // Obtenir la classe par son identifiant.
  useEffect(() => {
    obtenirClasseParId(classeid).then((c) => {
      setSigle(c.sigle);
      setTitre(c.titre);
      setSession(c.session);
      setGroupe(c.groupe + '');
      setAfficherFormulaire(true);
      setImageUrl(c.image);
    });
  }, [classeid]);

  const [state, formAction] = useFormState(
    mettreAJourClasse,
    classeValidationVide
  );

  const classeValidation = state || classeValidationVide;
  return (
    <>
      <header className={classes.header}>
        <h1>
          Modifier <span className={classes.highlight}>une classe</span>
        </h1>
      </header>
      <main className={classes.main}>
        {!afficherFormulaire ? (
          <SqueletteMiseAJourClasse />
        ) : (
          <form className={classes.form} action={formAction}>
            <input type="hidden" name="classeid" value={classeid} />
            <Box sx={{ marginBottom: '10px' }}>
              <TextField
                id="sigle"
                label="Sigle du cours"
                name="sigle"
                defaultValue={sigle}
                error={classeValidation.sigle.length > 0}
                helperText={classeValidation.sigle}
              />
              <TextField
                id="titre"
                label="Titre du cours"
                name="titre"
                value={titre}
                onChange={(e) => {
                  setTitre(e.target.value);
                }}
                error={classeValidation.titre.length > 0}
                helperText={classeValidation.titre}
              />
            </Box>
            <Box sx={{ display: 'flex', marginBottom: '10px' }}>
              <TextField
                id="session"
                label="Session du cours"
                name="session"
                defaultValue={session}
                error={classeValidation.session.length > 0}
                helperText={classeValidation.session}
              />
              <TextField
                id="groupe"
                label="Groupe du cours"
                name="groupe"
                defaultValue={groupe}
                error={classeValidation.groupe.length > 0}
                helperText={classeValidation.groupe}
              />
            </Box>
            <SelecteurImage
              libelle="Image représentant la classe"
              nom="fichierImage"
              imageUrl={imageUrl}
              inviteGenerateur={inviteGenerateur}
              erreur={classeValidation.fichierImage!.length > 0}
            />
            <p className={classes.actions}>
              {<BoutonSoumettre label="Modifier une classe" />}
            </p>
          </form>
        )}
      </main>
    </>
  );
}
