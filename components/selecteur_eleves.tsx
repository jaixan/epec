import React, { useState } from 'react';
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { IEleve } from '@/models/eleves.models';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

interface ISelecteurElevesProps {
  eleves: IEleve[];
  elevesSelectionnes: IEleve[];
  onChange: (elevesSelectionnees: IEleve[]) => void;
}

export default function SelecteurEleves(props: ISelecteurElevesProps) {
  const selectionnerEleve = (
    event: React.SyntheticEvent,
    nouvelleValeur: IEleve | null
  ) => {
    if (nouvelleValeur) {
      props.onChange([...props.elevesSelectionnes, nouvelleValeur]);
      console.log('nouvelleValeur', nouvelleValeur);
    }
  };

  return (
    <div>
      <Autocomplete
        options={props.eleves}
        getOptionLabel={(option) => option.nom + ' ' + option.prenom}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField {...params} label="Rechercher un élève" />
        )}
        onChange={selectionnerEleve}
        clearOnEscape
        selectOnFocus
        renderOption={(props, option) => (
          <li {...props}>
            <Avatar src={option.photo} />
            {option.prenom} {option.nom}
          </li>
        )}
      />
      <div>
        <strong>Élèves dans le cours :</strong>
        <List>
          {props.elevesSelectionnes.map((Eleve, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar src={Eleve.photo} />
              </ListItemAvatar>
              <ListItemText primary={Eleve.prenom + ' ' + Eleve.nom} />
              <IconButton
                edge="end"
                aria-label="retirer de la sélection"
                onClick={() => {
                  const nouvelleSelectionEleves =
                    props.elevesSelectionnes.filter((eleve) => eleve !== Eleve);
                  props.onChange(nouvelleSelectionEleves);
                }}
              >
                <CloseIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}
