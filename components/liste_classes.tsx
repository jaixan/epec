/**
 * Grille de la liste des classes.
 *
 * Auteur : Étienne Rivard
 *
 */

'use client';

import { IClasse, classeValidationVide } from '@/models/classes.models';
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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { supprimerClasseAction } from '@/lib/classes.actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';

/**
 * Propriétés de la liste des classes.
 */
interface IListeClassesProps {
  classes: IClasse[];
}

/**
 * Composant pour une carte qui permet d'ajouter une classe.
 * @returns Le JSX pour ajouter une classe.
 */
function CarteAjouterClasse() {
  return (
    <Grid item key={0} lg={4} md={6}>
      <Card
        sx={{
          display: 'flex',
          marginBottom: 1,
          width: { xs: '100vw', md: '40vw', lg: '25vw' },
        }}
      >
        <Link href="/classes/ajouter">
          <AddIcon sx={{ fontSize: 150 }} />
        </Link>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent
            sx={{
              flex: '1 0 auto',
            }}
          >
            <Typography gutterBottom component="div">
              Ajouter une classe
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
}

/**
 * Composant pour afficher la liste des classes en grille.
 * @param props Les propriétés de la liste des classes.
 * @returns Le JSX de la liste des classes.
 */
export default function ListeClasses(props: IListeClassesProps) {
  const { classes } = props;

  const [state, formAction] = useFormState(
    supprimerClasseAction,
    classeValidationVide
  );

  const [openConfirmationSupprimer, setOpenConfirmationSupprimer] =
    useState(false);

  const [classeId, setClasseId] = useState('');

  function afficherConfirmationSupprimer() {
    setOpenConfirmationSupprimer(true);
  }

  function fermerConfirmationSupprimer() {
    setOpenConfirmationSupprimer(false);
  }

  /**
   * Composant pour la confirmation de suppression d'une classe.
   * @returns Le JSX de la confirmation de suppression.
   *
   **/
  const ConfirmationSupprimerClasse = () => {
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
            id="classeid"
            label="ID de la classe"
            name="classeid"
            value={classeId}
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

  function supprimerClasse(id: string) {
    setClasseId(id);
    afficherConfirmationSupprimer();
  }

  return (
    <>
      <ConfirmationSupprimerClasse />
      <Box
        sx={{
          marginLeft: { xs: '0', md: '5%' },
          marginRight: { xs: '0', md: '5%' },
          width: '80vw',
        }}
      >
        <Grid container spacing={2}>
          <CarteAjouterClasse />
          {classes &&
            classes.map((classe) => (
              <Grid item key={classe.id} lg={4} md={6}>
                <Card
                  sx={{
                    display: 'flex',
                    marginBottom: 1,
                    width: { xs: '100vw', md: '40vw', lg: '25vw' },
                  }}
                >
                  <Image
                    src={classe.image}
                    alt={classe.titre}
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
                        {classe.titre}
                      </Typography>
                      <Typography gutterBottom component="div">
                        {classe.sigle} - {classe.groupe} - {classe.session}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Link href={`/classes/${classe.id}`}>
                        <IconButton sx={{ justifyContent: 'left' }}>
                          <EditIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Link>
                      <IconButton
                        onClick={() => supprimerClasse(classe.id + '')}
                        sx={{ justifyContent: 'left' }}
                      >
                        <DeleteIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                      <Link href={`/presences/${classe.id}`}>
                        <IconButton sx={{ justifyContent: 'left' }}>
                          <EventAvailableIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Link>
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
 * Composant pour afficher un squelette de la liste des classes en grille.
 * @returns Le JSX du squelette de la liste des classes.
 */
export function SqueletteListeClasses() {
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
