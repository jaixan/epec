/**
 * Modèle de mise en page racine pour l'application authentifiée.
 *
 * Auteur : Étienne Rivard
 *
 */
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';

import type { Metadata } from 'next';
import './globals.css';

import Menu from '../../components/menu';
import { CssBaseline } from '@mui/material';

/*
 * Les métadonnées de l'application.
 */
export const metadata: Metadata = {
  title: 'Élèves présents en classe (EPEC)',
  description: 'Prise de présence en classe pour les élèves.',
};

/**
 * Le composant React qui représente la mise en page racine de l'application.
 * @param children Les éléments enfants du site.
 * @returns La mise en page racine de l'application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* AppRouter requis par MaterialUI pour le fonctionnement de la librairie visuelle. */}
        <AppRouterCacheProvider>
          <header>
            <Menu />
          </header>

          {/* Le thème de l'application pour la librairie MaterialUI. */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
