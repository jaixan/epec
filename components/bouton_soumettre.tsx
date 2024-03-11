/**
 * Bouton pour soumettre
 *
 * Auteur : Étienne Rivard
 */

'use client';

import { useFormStatus } from 'react-dom';

/**
 * Propriétés pour le bouton de soumission.
 */
interface ISoumettreProps {
  label: string;
}

/**
 * Composant pour soumettre. Le bouton est désactivé lors de la soumission.
 * @returns Le JSX pour le bouton soumettre.
 */
export default function BoutonSoumettre(props: ISoumettreProps) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? 'Soumission...' : props.label}
    </button>
  );
}
