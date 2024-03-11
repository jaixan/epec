/**
 * Grille de la liste des élèves.
 *
 * Auteur : Étienne Rivard
 *
 */

'use client';

import IEleve, { eleveValidationVide } from '@/models/eleves.models';
import Image from 'next/image';
import Link from 'next/link';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  IconButton,
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supprimerEleveAction } from '@/lib/eleves.actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';

/**
 * Propriétés de la liste des élèves.
 */
interface IListeElevesProps {
  eleves: IEleve[];
}

/**
 * Composant pour une carte qui permet d'ajouter un élève.
 * @returns Le JSX pour ajouter un élève.
 */
function CarteAjouterEleve() {
  return (
    <Grid item key={0} lg={4} md={6}>
      <Card
        sx={{
          display: 'flex',
          marginBottom: 1,
          width: { xs: '100vw', md: '40vw', lg: '25vw' },
        }}
      >
        <Link href="/eleves/ajouter">
          <AddIcon sx={{ fontSize: 150 }} />
        </Link>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent
            sx={{
              flex: '1 0 auto',
            }}
          >
            <Typography gutterBottom component="div">
              Ajouter un élève
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
}

/**
 * Composant pour afficher la liste des élèves en grille.
 * @param props Les propriétés de la liste des élèves.
 * @returns Le JSX de la liste des élèves.
 */
export default function ListeEleves(props: IListeElevesProps) {
  const { eleves } = props;

  const [state, formAction] = useFormState(
    supprimerEleveAction,
    eleveValidationVide
  );

  const [openConfirmationSupprimer, setOpenConfirmationSupprimer] =
    useState(false);

  const [eleveId, setEleveId] = useState('');

  function afficherConfirmationSupprimer() {
    setOpenConfirmationSupprimer(true);
  }

  function fermerConfirmationSupprimer() {
    setOpenConfirmationSupprimer(false);
  }

  /**
   * Composant pour la confirmation de suppression d'un élève.
   * @returns Le JSX de la confirmation de suppression.
   *
   **/
  const ConfirmationSupprimerEleve = () => {
    return (
      <Dialog
        open={openConfirmationSupprimer}
        onClose={() => fermerConfirmationSupprimer()}
      >
        <form
          action={formAction}
          onSubmit={() => fermerConfirmationSupprimer()}
        >
          <TextField
            id="eleveid"
            label="ID de l'élève"
            name="eleveid"
            value={eleveId}
            sx={{ display: 'none' }}
          />
          <Button type="submit" variant="contained">
            Confirmer suppression
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => fermerConfirmationSupprimer()}
          >
            Annuler
          </Button>
        </form>
      </Dialog>
    );
  };

  function supprimerEleve(id: string) {
    setEleveId(id);
    afficherConfirmationSupprimer();
  }

  return (
    <>
      <ConfirmationSupprimerEleve />
      <Box
        sx={{
          marginLeft: { xs: '0', md: '5%' },
          marginRight: { xs: '0', md: '5%' },
          width: '80vw',
        }}
      >
        <Grid container spacing={2}>
          <CarteAjouterEleve />
          {eleves &&
            eleves.map((eleve) => (
              <Grid item key={eleve.id} lg={4} md={6}>
                <Card
                  sx={{
                    display: 'flex',
                    marginBottom: 1,
                    width: { xs: '100vw', md: '40vw', lg: '25vw' },
                  }}
                >
                  <Image
                    src={eleve.photo}
                    alt={eleve.nom}
                    width={150}
                    height={150}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent
                      sx={{
                        flex: '1 0 auto',
                      }}
                    >
                      <Typography gutterBottom component="div">
                        DA : {eleve.numero_da}
                      </Typography>
                      <Typography gutterBottom component="div">
                        {eleve.prenom} {eleve.nom}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Link href={`/eleves/${eleve.id}`}>
                        <IconButton sx={{ justifyContent: 'left' }}>
                          <EditIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Link>
                      <IconButton
                        onClick={() => supprimerEleve(eleve.id + '')}
                        sx={{ justifyContent: 'left' }}
                      >
                        <DeleteIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
}

/**
 * Composant pour afficher un squelette de la liste des élèves en grille.
 * @returns Le JSX du squelette de la liste des élèves.
 */
export function SqueletteListeEleves() {
  const cartes = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <>
      <Box
        sx={{
          marginLeft: { xs: '0', md: '5%' },
          marginRight: { xs: '0', md: '5%' },
          width: '80vw',
        }}
      >
        <Grid container spacing={2}>
          {cartes.map((numero) => (
            <Grid item key={numero} lg={4} md={6}>
              <Skeleton
                width={'25vw'}
                height={150}
                variant="rectangular"
                sx={{
                  display: 'flex',
                  marginBottom: 1,
                  width: { xs: '100vw', md: '40vw', lg: '25vw' },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
