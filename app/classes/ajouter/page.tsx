/**
 * Page pour ajouter une classe
 *
 * Auteur : Étienne Rivard
 *
 */

import classes from './page.module.css';
import { ajouterClasse } from '@/lib/classes.actions';
import { classeVide } from '@/models/classes.models';
import FormulaireClasse from '@/components/formulaire_classe';
import { obtenirEleves } from '@/lib/eleves.bd';

/**
 * Page pour ajouter une classe.
 * @returns Page pour ajouter une classe (JSX).
 */
export default async function PageAjouterClasse() {
  const eleves = await obtenirEleves();
  return (
    <>
      <header className={classes.header}>
        <h1>
          Ajouter <span className={classes.highlight}>une classe</span>
        </h1>
      </header>
      <main className={classes.main}>
        <FormulaireClasse
          formAction={ajouterClasse}
          donneesInitiales={classeVide}
          eleves={eleves}
        />
      </main>
    </>
  );
}
