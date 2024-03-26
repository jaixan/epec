/**
 * Formulaire pour une classe
 *
 * Auteur : Étienne Rivard
 *
 * Description : Isoler la partie interactive de la page d'ajout ou de modification d'une classe.
 *
 */
'use client';

import { useFormState } from 'react-dom';

import classes from './formulaire.module.css';
import { Box, TextField } from '@mui/material';
import { IClasse, classeValidationVide } from '@/models/classes.models';
import BoutonSoumettre from '@/components/bouton_soumettre';
import SelecteurImage from '@/components/selecteur_image';
import SelecteurEleves from '@/components/selecteur_eleves';
import { IEleve } from '@/models/eleves.models';
import { useEffect, useState } from 'react';

/**
 * Propriétés du formulaire de gestion d'une classe.
 */
interface FormulaireClasseProps {
  formAction: any; // L'action serveur à exécuter lors de la soumission du formulaire
  donneesInitiales: IClasse; // Les données initiales du formulaire
  eleves: IEleve[]; // La liste des élèves à sélectionner
}

/**
 * Formulaire de gestion d'une classe.
 * @returns Page pour mettre à jour une classe (JSX).
 */
export default function FormulaireClasse(props: FormulaireClasseProps) {
  const [elevesSelectionnes, setElevesSelectionnes] = useState<IEleve[]>([]);
  const [inviteGenerateur, setInviteGenerateur] = useState('');
  const eleves = props.eleves;
  const classe = props.donneesInitiales;

  const id_des_eleves = elevesSelectionnes.map((eleve) => eleve.id).join(',');

  useEffect(() => {
    const elevesASelectionner = eleves.filter((eleve) =>
      props.donneesInitiales.eleves.includes(eleve.id!)
    );
    setElevesSelectionnes(elevesASelectionner);
  }, [props.donneesInitiales.eleves, eleves]);

  // Générer l'invite pour le générateur d'image seulement si le titre du cours est entré.
  useEffect(() => {
    if (classe.titre === '') {
      setInviteGenerateur('');
      return;
    }

    const genererInvite =
      'Tu dois générer une image pour représenter une classe ' +
      "dans un logiciel de gestion.L'image peut avoir n'importe quel style, " +
      ' en autant que ça représente le nom de la classe.En aucun cas il y aura ';
    "du texte dans l'image. Le nom de la classe est : " + classe.titre;
    setInviteGenerateur(genererInvite);
  }, [classe.titre]);

  const [state, formAction] = useFormState(
    props.formAction,
    classeValidationVide
  );

  const classeValidation = state || classeValidationVide;
  return (
    <>
      <form className={classes.form} action={formAction}>
        <input type="hidden" name="id_des_eleves" value={id_des_eleves} />
        <Box sx={{ marginBottom: '10px' }}>
          <TextField
            id="sigle"
            label="Sigle du cours"
            name="sigle"
            defaultValue={classe.sigle}
            error={classeValidation.sigle.length > 0}
            helperText={classeValidation.sigle}
          />
          <TextField
            id="titre"
            label="Titre du cours"
            name="titre"
            defaultValue={classe.titre}
            error={classeValidation.titre.length > 0}
            helperText={classeValidation.titre}
          />
        </Box>
        <Box sx={{ display: 'flex', marginBottom: '10px' }}>
          <TextField
            id="session"
            label="Session du cours"
            name="session"
            defaultValue={classe.session}
            error={classeValidation.session.length > 0}
            helperText={classeValidation.session}
          />
          <TextField
            id="groupe"
            label="Groupe du cours"
            name="groupe"
            defaultValue={classe.groupe}
            error={classeValidation.groupe.length > 0}
            helperText={classeValidation.groupe}
          />
        </Box>
        <SelecteurImage
          libelle="Image représentant la classe"
          nom="fichierImage"
          imageUrl={classe.image}
          inviteGenerateur={inviteGenerateur}
          erreur={classeValidation.fichierImage!.length > 0}
        />
        <SelecteurEleves
          eleves={eleves}
          elevesSelectionnes={elevesSelectionnes}
          onChange={(elevesSelectionnes) =>
            setElevesSelectionnes(elevesSelectionnes)
          }
        />
        <p className={classes.actions}>
          {<BoutonSoumettre label="Enregistrer" />}
        </p>
      </form>
    </>
  );
}
