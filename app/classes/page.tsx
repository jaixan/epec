/**
 * Page des classes
 *
 * Auteur : Étienne Rivard
 */

import classes from './page.module.css';
import { obtenirClasses } from '@/lib/classes.bd';
import { Suspense } from 'react';
import Chargement from '@/components/chargement';
import ListeClasses from '@/components/liste_classes';

/**
 * Obtient la liste des classes et génère le JSX pour les afficher.
 * (Dans une fonction séparée async pour pouvoir utiliser <Suspense>)
 *
 * @returns Le composant JSX pour afficher la liste des élèves.
 */
async function Classes() {
  const classes = await obtenirClasses();
  return <ListeClasses classes={classes} />;
}

/**
 * Page des classes.
 * @returns Le JSX pour la page des classes.
 */
export default async function PageClasses() {
  return (
    <div>
      <h1 className={classes.entete}>Classes</h1>
      <Suspense fallback={<Chargement message={'Chargement...'} />}>
        <Classes />
      </Suspense>
    </div>
  );
}
