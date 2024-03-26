/**
 * Modèle de mise en page racine pour l'application authentifiée.
 *
 * Auteur : Étienne Rivard
 *
 */
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import { CssBaseline } from '@mui/material';
import { Metadata } from 'next';

/*
 * Les métadonnées de l'application.
 */
export const metadata: Metadata = {
  title: 'Élèves présents en classe (EPEC)',
  description: 'Prise de présence en classe pour les élèves.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* AppRouter requis par MaterialUI pour le fonctionnement de la librairie visuelle. */}
      <AppRouterCacheProvider>
        <body>
          {/* Le thème de l'application pour la librairie MaterialUI. */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </body>
      </AppRouterCacheProvider>
    </html>
  );
}
