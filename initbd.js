/**
 * Créer une base de données SQLite avec des données bidons
 *
 * Auteur : Étienne Rivard
 *
 * Pour exécuter ce script, exécutez la commande suivante dans votre terminal:
 *
 * node initbd.js
 *
 */

const sql = require('better-sqlite3');
const db = sql('epec.db');

const eleves = [
  {
    numero_da: 24000001,
    prenom: 'Jean',
    nom: 'Dupont',
    photo: '/images/eleves/24000001.jpg',
  },
  {
    numero_da: 24000002,
    prenom: 'Marie',
    nom: 'Durand',
    photo: '/images/eleves/24000002.jpg',
  },
  {
    numero_da: 24000003,
    prenom: 'Pierre',
    nom: 'Martin',
    photo: '/images/eleves/24000003.jpg',
  },
  {
    numero_da: 24000004,
    prenom: 'Sophie',
    nom: 'Lefebvre',
    photo: '/images/eleves/24000004.jpg',
  },
  {
    numero_da: 24000005,
    prenom: 'Luc',
    nom: 'Michel',
    photo: '/images/eleves/24000005.jpg',
  },
  {
    numero_da: 24000006,
    prenom: 'Catherine',
    nom: 'Leroy',
    photo: '/images/eleves/24000006.jpg',
  },
  {
    numero_da: 24000007,
    prenom: 'Philippe',
    nom: 'Moreau',
    photo: '/images/eleves/24000007.jpg',
  },
  {
    numero_da: 24000008,
    prenom: 'Isabelle',
    nom: 'El Koury',
    photo: '/images/eleves/24000008.jpg',
  },
  {
    numero_da: 24000009,
    prenom: 'Jacques',
    nom: 'Garcia',
    photo: '/images/eleves/24000009.jpg',
  },
  {
    numero_da: 24000010,
    prenom: 'Christine',
    nom: 'Fournier',
    photo: '/images/eleves/24000010.jpg',
  },
];

db.prepare(
  `
   CREATE TABLE IF NOT EXISTS eleves (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       numero_da INTEGER NOT NULL UNIQUE,
       prenom TEXT NOT NULL,
       nom TEXT NOT NULL,
       photo TEXT NOT NULL
    )
`
).run();

async function initData() {
  const stmt = db.prepare(`
      INSERT INTO eleves VALUES (
         null,
         @numero_da,
         @prenom,
         @nom,
         @photo
      )
   `);

  for (const eleve of eleves) {
    stmt.run(eleve);
  }
}

initData();
console.log('Base de données créée avec succès!');
