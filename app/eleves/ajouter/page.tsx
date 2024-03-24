/**
 * Page pour ajouter un élève
 *
 * Auteur : Étienne Rivard
 *
 */

import classes from './page.module.css';
import { ajouterEleve } from '@/lib/eleves.actions';
import { eleveVide } from '@/models/eleves.models';
import FormulaireEleve from '@/components/formulaire_eleve';

/**
 * Page pour ajouter un élève.
 * @returns Page pour ajouter un élève (JSX).
 */
export default function PageAjouterEleve() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Ajouter <span className={classes.highlight}>un élève</span>
        </h1>
      </header>
      <main className={classes.main}>
        <FormulaireEleve
          formAction={ajouterEleve}
          donneesInitiales={eleveVide}
        />
      </main>
    </>
  );
}
