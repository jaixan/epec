/**
 * Barre de menu pour l'application.
 *
 * Auteur : Étienne Rivard
 *
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { themeAppbarBackground } from '@/theme';

/**
 * Composant pour la barre de menu.
 * @returns Le JSX de la barre de menu.
 */
export default function BarreDeMenu() {
  const routeur = useRouter();

  // État pour l'ancrage du menu principal. Sert à afficher ou cacher le menu.
  const [ancrageMenuPrincipal, setAncrageMenuPrincipal] =
    useState<null | HTMLElement>(null);

  // Fonction pour ouvrir le menu principal.
  const ouvrirMenuPrincipal = (event: React.MouseEvent<HTMLElement>) => {
    setAncrageMenuPrincipal(event.currentTarget);
  };

  // Fonction pour fermer le menu principal.
  const fermerMenuPrincipal = () => {
    setAncrageMenuPrincipal(null);
  };

  // Fonction pour aller à la page des classes.
  const allerAuxClasses = () => {
    setAncrageMenuPrincipal(null);
    routeur.push('/classes');
  };

  // Fonction pour aller à la page des élèves.
  const allerAuxEleves = () => {
    setAncrageMenuPrincipal(null);
    routeur.push('/eleves');
  };

  // Le backgroundColor est un hack car le AppBar ne réagit pas au thème.
  return (
    <AppBar position="static" sx={{ backgroundColor: themeAppbarBackground }}>
      <Container maxWidth="xl" sx={{ minWidth: '80vw' }}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton
              size="large"
              aria-label="menu principal"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={ouvrirMenuPrincipal}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={ancrageMenuPrincipal}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(ancrageMenuPrincipal)}
              onClose={fermerMenuPrincipal}
            >
              <MenuItem key="classes" onClick={allerAuxClasses}>
                <Typography textAlign="center">Classes</Typography>
              </MenuItem>
              <MenuItem key="eleves" onClick={allerAuxEleves}>
                <Typography textAlign="center">Élèves</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Élèves présents en classe
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              display: {
                xs: 'block',
                sm: 'none',
              },
            }}
          >
            EPEC
          </Typography>
          <Box sx={{ flexGrow: 0, display: { md: 'flex' } }}></Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
