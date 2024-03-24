/**
 * Page pour mettre à jour une classe
 *
 * Auteur : Étienne Rivard
 *
 */

import classes from './page.module.css';
import { mettreAJourClasse } from '@/lib/classes.actions';
import { obtenirClasseParId } from '@/lib/classes.bd';
import { obtenirEleves } from '@/lib/eleves.bd';
import FormulaireClasse from '@/components/formulaire_classe';

/**
 * Propriétés de la page de mise à jour des classes.
 */
interface PageMiseAJourClasseProps {
  params: {
    classeid: string;
  };
}

/**
 * Page pour mettre à jour une classe.
 * @returns Page pour mettre à jour une classe (JSX).
 */
export default async function PageMiseAJourClasse(
  props: PageMiseAJourClasseProps
) {
  const classeid = +props.params.classeid;

  var classe = await obtenirClasseParId(classeid);
  var eleves = await obtenirEleves();

  const actionMettreAJourClasse = mettreAJourClasse.bind(null, classeid);
  return (
    <>
      <header className={classes.header}>
        <h1>
          Modifier <span className={classes.highlight}>une classe</span>
        </h1>
      </header>
      <main className={classes.main}>
        <FormulaireClasse
          formAction={actionMettreAJourClasse}
          donneesInitiales={classe}
          eleves={eleves}
        />
      </main>
    </>
  );
}
