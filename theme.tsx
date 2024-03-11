// src/theme.ts
'use client';

import { createTheme } from '@mui/material/styles';

export const themeAppbarBackground = '#0D0D0D';

export const theme = createTheme({
  typography: {
    fontFamily: ['Cutive Mono', 'monospace'].join(','),
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#EAEAEA',
    },
  },
});

export default theme;
