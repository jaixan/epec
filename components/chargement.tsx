/**
 * Un composant qui affiche un message de chargement.
 *
 * Auteur : Étienne Rivard
 *
 */

import classes from './chargement.module.css';

/**
 * Propriétés du composant de chargement.
 */
interface IChargementProps {
  message: string;
}

/**
 * Un composant qui affiche un message de chargement.
 * @returns Un composant qui affiche un message de chargement.
 */
export default function Chargement(props: IChargementProps) {
  return (
    <div className={classes.loading_page}>
      <div className={classes.loading_container}>
        <div className={classes.loading_animation}></div>
        <p>{props.message}</p>
      </div>
    </div>
  );
}
