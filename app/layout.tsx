/**
 * Il faut avoir un layout au root de l'application pour permettre les redirections entre les groupes de routes
 * Voir : https://github.com/vercel/next.js/issues/58263
 */

export const metadata = {
  title: 'Eleves Présents en Classe',
  description: 'Prise de présence pour les élèves en classe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
