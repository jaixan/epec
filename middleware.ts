/**
 * Middleware pour vérifier si l'utilisateur est connecté
 */

import { lireCookiesSession } from '@/lib/utilitaires';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const utilisateurCourant = await lireCookiesSession();

  if (!utilisateurCourant && !request.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', request.url));
  }
}

/**
 * Le matcher permet de spécifier les routes sur lesquelles le middleware doit être appliqué
 */
export const config = {
  matcher: [
    '/(classes|eleves|presences)',
    '/(classes/.+)',
    '/(eleves/.+)',
    '/(presences/.+)',
    '/',
  ],
};
