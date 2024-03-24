/**
 * Page de gestion des présences.
 *
 * Auteur : Étienne Rivard
 */

'use client';

import { debounce } from 'lodash';
import { produce } from 'immer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Checkbox,
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Snackbar,
  Popover,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import IEleve from '@/models/eleves.models';
import IPresence from '@/models/presences.models';
import {
  enregistrerPresences,
  extraireDatesPresences,
  extrairePresences,
  obtenirElevesDeLaClasse,
} from '@/lib/classes.bd';
import Image from 'next/image';

/**
 * Propriétés de la page de mise à jour des présences pour une classe.
 */
interface PagePresencesProps {
  params: {
    classeid: string;
  };
}

/**
 * Page de gestion des présences.
 * @param props Les propriétés de la page.
 * @returns Le JSX de la page de gestion des présences.
 */
export default function PagePresences({ params }: PagePresencesProps) {
  const classeId = parseInt(params.classeid);

  const [eleves, setEleves] = useState<IEleve[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [presences, setPresences] = useState<IPresence[]>([]);
  const [saveMessageOpen, setSaveMessageOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Récupérer les élèves de la classe
  function fetchEleves() {
    obtenirElevesDeLaClasse(classeId).then((rows) => {
      console.log('eleves', rows);
      setEleves(rows);
    });
  }

  // Récupérer les dates de présence déjà prises
  function fetchDates() {
    extraireDatesPresences(classeId).then((rows) => {
      setDates(rows);
    });
  }

  // extraire les présences déjà prises
  function fetchPresences() {
    extrairePresences(classeId).then((rows) => {
      console.log('presences', rows);
      setPresences(rows);
    });
  }

  /**
   *  Déterminer la présence pour une date et un élève
   *
   * @param eleveId L'identifiant de l'élève
   * @param date La date
   * @returns Si l'élève est présent ou non
   */
  function determinerPresence(eleveId: number, date: Date) {
    const presence = presences.find(
      (p) => p.eleve_id === eleveId && p.date_cours.getDate() === date.getDate()
    );
    return presence?.present || false;
  }

  // Debounce pour l'appel de enregistrerPresences
  // Le debounce permet de ne pas appeler la fonction enregistrerPresences trop souvent
  // pour éviter de surcharger la base de données.
  // useCallback permet de ne pas recréer la fonction à chaque rendu.

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedEnregistrerPresences = useCallback(
    debounce(
      (nouvellesPresences) => {
        enregistrerPresences(nouvellesPresences);
        setSaveMessageOpen(true);
      },
      3000,
      {
        leading: false,
        trailing: true,
      }
    ),
    []
  );

  // Gérer le clic sur la case à cocher de présence
  const handleCheckboxChange = (
    eleveId: number,
    date: Date,
    presence: boolean
  ) => {
    // Produire un nouveau tableau de présences pour le useState
    const nouvellesPresences = produce(presences, (draft) => {
      const existingPresence = draft.find(
        (p) =>
          p.eleve_id === eleveId && p.date_cours.getDate() === date.getDate()
      );
      if (existingPresence) {
        existingPresence.present = presence;
      } else {
        draft.push({
          classe_id: classeId,
          eleve_id: eleveId,
          date_cours: date,
          present: presence,
        });
      }
    });

    debouncedEnregistrerPresences(nouvellesPresences);
    setPresences(nouvellesPresences);
  };

  // Gérer le clic sur l'icône d'ajout
  const handleAddIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Gérer la sélection d'une date dans le calendrier
  const handleDateSelect = (date: Date) => {
    setDates(
      produce(dates, (draft) => {
        draft.push(date);
        draft.sort((a, b) => b.getTime() - a.getTime());
      })
    );
    setAnchorEl(null);
  };

  // Effectuer les appels aux fonctions de récupération des données
  useEffect(() => {
    fetchEleves();
    fetchDates();
    fetchPresences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Snackbar
          open={saveMessageOpen}
          autoHideDuration={1000}
          onClose={() => {
            setSaveMessageOpen(false);
          }}
          message="Présences enregistrées!"
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Photo</TableCell>
              {dates.map((date) => (
                <TableCell key={date.getTime()}>
                  {date.toLocaleDateString()}
                </TableCell>
              ))}
              <TableCell>
                <IconButton onClick={handleAddIconClick}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eleves.map((eleve) => (
              <TableRow key={eleve.id}>
                <TableCell>{eleve.nom}</TableCell>
                <TableCell>{eleve.prenom}</TableCell>
                <TableCell>
                  <Image
                    src={eleve.photo}
                    width="150"
                    height="150"
                    alt={`${eleve.nom} ${eleve.prenom}`}
                  />
                </TableCell>
                {dates.map((date) => (
                  <TableCell key={date.getTime()}>
                    <Checkbox
                      checked={determinerPresence(eleve.id!, date)}
                      onChange={(event) =>
                        handleCheckboxChange(
                          eleve.id!,
                          date,
                          event.target.checked
                        )
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box>
            <DateCalendar
              onChange={(nouvelleDate) =>
                handleDateSelect(new Date(nouvelleDate))
              }
            />
          </Box>
        </Popover>
      </div>
    </LocalizationProvider>
  );
}
