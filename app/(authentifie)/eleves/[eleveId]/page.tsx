/**
 * Page pour mettre à jour un élève
 *
 * Auteur : Étienne Rivard
 *
 */

import classes from './page.module.css';
import { mettreAJourEleve } from '@/lib/eleves.actions';
import { obtenirEleveParId } from '@/lib/eleves.bd';

import FormulaireEleve from '@/components/formulaire_eleve';

/**
 * Propriétés de la page de mise à jour des élèves.
 */
interface PageMiseAJourEleveProps {
  params: {
    eleveId: string;
  };
}

/**
 * Page pour mettre à jour un élève.
 * @returns Page pour mettre à jour un élève (JSX).
 */
export default async function PageMiseAJourEleve(
  props: PageMiseAJourEleveProps
) {
  const eleveId = +props.params.eleveId;
  const actionMettreAJourEleve = mettreAJourEleve.bind(null, eleveId);

  const eleve = await obtenirEleveParId(eleveId);

  return (
    <>
      <header className={classes.header}>
        <h1>
          Modifier <span className={classes.highlight}>un élève</span>
        </h1>
      </header>
      <main className={classes.main}>
        <FormulaireEleve
          formAction={actionMettreAJourEleve}
          donneesInitiales={eleve}
        />
      </main>
    </>
  );
}
