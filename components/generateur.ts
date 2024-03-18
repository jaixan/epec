'use server';

import OpenAI from 'openai';

interface IGenererImageProps {
  invite: string;
}
//const imageAleatoire = `https://picsum.photos/200/300?random=${Math.random()}`;
export default async function genererImage(props: IGenererImageProps) {
  const openai = new OpenAI();
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: props.invite,
    n: 1,
    size: '1024x1024',
  });
  const image_url = response.data[0].url;
  return image_url;
}
