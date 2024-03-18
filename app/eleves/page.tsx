/**
 * Page des élèves
 *
 * Auteur : Étienne Rivard
 */

import classes from './page.module.css';
import { obtenirEleves } from '@/lib/eleves.bd';
import { Suspense } from 'react';
import Chargement from '@/components/chargement';
import ListeEleves from '@/components/liste_eleves';

/**
 * Obtient la liste des élèves et génère le JSX pour les afficher.
 * (Dans une fonction séparée async pour pouvoir utiliser <Suspense>)
 *
 * @returns Le composant JSX pour afficher la liste des élèves.
 */
async function Eleves() {
  const eleves = await obtenirEleves();
  return <ListeEleves eleves={eleves} />;
}

/**
 * Page des élèves.
 * @returns Le JSX pour la page des élèves.
 */
export default async function PageEleves() {
  return (
    <div>
      <h1 className={classes.entete}>Élèves</h1>
      <Suspense fallback={<Chargement message={'Chargement...'} />}>
        <Eleves />
      </Suspense>
    </div>
  );
}
