/**
 * Page d'accueil de l'application.
 *
 * Auteur : Étienne Rivard
 *
 */

import Image from 'next/image';
import styles from './page.module.css';
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';

const elementsDeMenu = [
  {
    image: '/classes.webp',
    alt: 'Classes',
    titre: 'Classes',
    lien: '/classes',
  },
  {
    image: '/eleves.webp',
    alt: 'Élèves',
    titre: 'Élèves',
    lien: '/eleves',
  },
  {
    image: '/presences.webp',
    alt: 'Prendre les présences',
    titre: 'Prendre les présences',
    lien: '/prendre-les-presences',
  },
];

/**
 * La page d'accueil de l'application.
 * @returns La page d'accueil de l'application.
 */
export default function Home() {
  return (
    <main className={styles.main}>
      <Grid className={styles.center} container spacing={2}>
        {elementsDeMenu.map((element, index) => (
          <Grid item xl={2} key={index}>
            <Link href={element.lien}>
              <Card key={index} className={styles.card}>
                <CardActionArea>
                  <Image
                    src={element.image}
                    alt={element.alt}
                    width={300}
                    height={300}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {element.titre}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </main>
  );
}
