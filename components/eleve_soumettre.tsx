/**
 * Bouton pour soumettre un élève
 *
 * Auteur : Étienne Rivard
 */

'use client';

import { useFormStatus } from 'react-dom';

/**
 * Composant pour soumettre un élève. Le bouton est désactivé lors de la soumission.
 * @returns Le JSX pour soumettre un élève.
 */
export default function SoumettreEleve() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? 'Soumission...' : 'Ajouter un élève'}
    </button>
  );
}
