import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface IImageGETParams {
  nomfichier: string;
}

export function GET(req: NextApiRequest) {
  console.log(req.url!);
  const { pathname } = new URL(req.url!);
  const nomfichier = pathname.split('/').pop();
  console.log(nomfichier);
  const filePath = path.resolve('./uploads', nomfichier!);

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const res = new Response(imageBuffer);
    res.headers.set('Content-Type', 'image/png');
    return res;
  } catch (error) {
    return Response.error();
  }
}
