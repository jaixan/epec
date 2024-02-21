/**
 * Grille de la liste des élèves.
 *
 * Auteur : Étienne Rivard
 *
 */

'use client';

import IEleve from '@/models/eleves.models';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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

  return (
    <Box
      sx={{
        marginLeft: { xs: '0', md: '5%' },
        marginRight: { xs: '0', md: '5%' },
        width: '80vw',
      }}
    >
      <Grid container spacing={2}>
        <CarteAjouterEleve />
        {eleves.map((eleve) => (
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
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
