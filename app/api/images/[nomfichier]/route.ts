import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

// Pour empêcher le cache des images
export const dynamic = 'force-dynamic';

/**
 * Fonction pour obtenir une image.
 * @param req La requête.
 * @returns La réponse.
 */
export function GET(req: NextRequest) {
  const { pathname } = new URL(req.url!);
  const nomfichier = pathname.split('/').pop();
  const extension = nomfichier!.split('.').pop();
  const filePath = path.join(process.cwd(), 'uploads', nomfichier!);

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const res = new Response(imageBuffer);
    res.headers.set('Content-Type', `image/${extension}`);
    return res;
  } catch (error) {
    return Response.error();
  }
}
