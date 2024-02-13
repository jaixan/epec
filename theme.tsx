// src/theme.ts
'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: ['Cutive Mono', 'monospace'].join(','),
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#c75000',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#2f1000',
      paper: '#202027',
    },
    text: {
      primary: '#EFECEC',
      secondary: '#FFFFFF',
      disabled: 'rgba(70,38,38,0.5)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#3b1705 ',
          color: '#EFECEC',
          primary: '#FFFFFF',
          ':hover': {
            color: '#5C5757',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        item: {
          paddingTop: '0px !important',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          columnGap: '4px !important',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          minWidth: '31vw',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#3e1906 ',
          color: '#EFECEC',
          primary: '#FFFFFF',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#3a1101',
          color: '#EFECEC',
          primary: '#FFFFFF',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#EFECEC',
          primary: '#FFFFFF',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& fieldset.MuiOutlinedInput-notchedOutline': {
            borderColor: '#3a1101',
          },
          '& select': {
            padding: '5px 25px 5px 5px !important',
            backgroundColor: '#3b1705 ',
          },
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        iconOutlined: {
          fill: '#FFFFFF',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Cutive Mono';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          }
      `,
    },
  },
});

export default theme;
