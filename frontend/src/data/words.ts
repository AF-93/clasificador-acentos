import { Word } from '../types/index.js';

// Base de datos de palabras predefinidas con clasificaciones correctas
export const wordsDatabase: Word[] = [
  // Palabras agudas
  { word: 'canción', accentType: 'aguda', explanation: 'La palabra "canción" se divide en 2 sílabas: can-ción. El acento está en la última sílaba (ción), por lo tanto es una palabra aguda.', syllables: ['can', 'ción'] },
  { word: 'café', accentType: 'aguda', explanation: 'La palabra "café" se divide en 2 sílabas: ca-fé. El acento está en la última sílaba (fé), por lo tanto es una palabra aguda.', syllables: ['ca', 'fé'] },
  { word: 'reloj', accentType: 'aguda', explanation: 'La palabra "reloj" se divide en 2 sílabas: re-loj. El acento está en la última sílaba (loj), por lo tanto es una palabra aguda.', syllables: ['re', 'loj'] },
  { word: 'papel', accentType: 'aguda', explanation: 'La palabra "papel" se divide en 2 sílabas: pa-pel. El acento está en la última sílaba (pel), por lo tanto es una palabra aguda.', syllables: ['pa', 'pel'] },
  { word: 'ciudad', accentType: 'aguda', explanation: 'La palabra "ciudad" se divide en 2 sílabas: ciu-dad. El acento está en la última sílaba (dad), por lo tanto es una palabra aguda.', syllables: ['ciu', 'dad'] },
  { word: 'amor', accentType: 'aguda', explanation: 'La palabra "amor" se divide en 2 sílabas: a-mor. El acento está en la última sílaba (mor), por lo tanto es una palabra aguda.', syllables: ['a', 'mor'] },
  { word: 'verdad', accentType: 'aguda', explanation: 'La palabra "verdad" se divide en 2 sílabas: ver-dad. El acento está en la última sílaba (dad), por lo tanto es una palabra aguda.', syllables: ['ver', 'dad'] },
  { word: 'corazón', accentType: 'aguda', explanation: 'La palabra "corazón" se divide en 3 sílabas: co-ra-zón. El acento está en la última sílaba (zón), por lo tanto es una palabra aguda.', syllables: ['co', 'ra', 'zón'] },
  { word: 'jamás', accentType: 'aguda', explanation: 'La palabra "jamás" se divide en 2 sílabas: ja-más. El acento está en la última sílaba (más), por lo tanto es una palabra aguda.', syllables: ['ja', 'más'] },
  { word: 'después', accentType: 'aguda', explanation: 'La palabra "después" se divide en 2 sílabas: des-pués. El acento está en la última sílaba (pués), por lo tanto es una palabra aguda.', syllables: ['des', 'pués'] },

  // Palabras graves
  { word: 'casa', accentType: 'grave', explanation: 'La palabra "casa" se divide en 2 sílabas: ca-sa. El acento está en la penúltima sílaba (ca), por lo tanto es una palabra grave.', syllables: ['ca', 'sa'] },
  { word: 'árbol', accentType: 'grave', explanation: 'La palabra "árbol" se divide en 2 sílabas: ár-bol. El acento está en la penúltima sílaba (ár), por lo tanto es una palabra grave.', syllables: ['ár', 'bol'] },
  { word: 'fácil', accentType: 'grave', explanation: 'La palabra "fácil" se divide en 2 sílabas: fá-cil. El acento está en la penúltima sílaba (fá), por lo tanto es una palabra grave.', syllables: ['fá', 'cil'] },
  { word: 'mesa', accentType: 'grave', explanation: 'La palabra "mesa" se divide en 2 sílabas: me-sa. El acento está en la penúltima sílaba (me), por lo tanto es una palabra grave.', syllables: ['me', 'sa'] },
  { word: 'libro', accentType: 'grave', explanation: 'La palabra "libro" se divide en 2 sílabas: li-bro. El acento está en la penúltima sílaba (li), por lo tanto es una palabra grave.', syllables: ['li', 'bro'] },
  { word: 'ventana', accentType: 'grave', explanation: 'La palabra "ventana" se divide en 3 sílabas: ven-ta-na. El acento está en la penúltima sílaba (ta), por lo tanto es una palabra grave.', syllables: ['ven', 'ta', 'na'] },
  { word: 'problema', accentType: 'grave', explanation: 'La palabra "problema" se divide en 3 sílabas: pro-ble-ma. El acento está en la penúltima sílaba (ble), por lo tanto es una palabra grave.', syllables: ['pro', 'ble', 'ma'] },
  { word: 'momento', accentType: 'grave', explanation: 'La palabra "momento" se divide en 3 sílabas: mo-men-to. El acento está en la penúltima sílaba (men), por lo tanto es una palabra grave.', syllables: ['mo', 'men', 'to'] },
  { word: 'persona', accentType: 'grave', explanation: 'La palabra "persona" se divide en 3 sílabas: per-so-na. El acento está en la penúltima sílaba (so), por lo tanto es una palabra grave.', syllables: ['per', 'so', 'na'] },
  { word: 'tiempo', accentType: 'grave', explanation: 'La palabra "tiempo" se divide en 2 sílabas: tiem-po. El acento está en la penúltima sílaba (tiem), por lo tanto es una palabra grave.', syllables: ['tiem', 'po'] },

  // Palabras esdrújulas
  { word: 'teléfono', accentType: 'esdrujula', explanation: 'La palabra "teléfono" se divide en 4 sílabas: te-lé-fo-no. El acento está en la antepenúltima sílaba (lé), por lo tanto es una palabra esdrújula.', syllables: ['te', 'lé', 'fo', 'no'] },
  { word: 'médico', accentType: 'esdrujula', explanation: 'La palabra "médico" se divide en 3 sílabas: mé-di-co. El acento está en la antepenúltima sílaba (mé), por lo tanto es una palabra esdrújula.', syllables: ['mé', 'di', 'co'] },
  { word: 'rápido', accentType: 'esdrujula', explanation: 'La palabra "rápido" se divide en 3 sílabas: rá-pi-do. El acento está en la antepenúltima sílaba (rá), por lo tanto es una palabra esdrújula.', syllables: ['rá', 'pi', 'do'] },
  { word: 'música', accentType: 'esdrujula', explanation: 'La palabra "música" se divide en 3 sílabas: mú-si-ca. El acento está en la antepenúltima sílaba (mú), por lo tanto es una palabra esdrújula.', syllables: ['mú', 'si', 'ca'] },
  { word: 'público', accentType: 'esdrujula', explanation: 'La palabra "público" se divide en 3 sílabas: pú-bli-co. El acento está en la antepenúltima sílaba (pú), por lo tanto es una palabra esdrújula.', syllables: ['pú', 'bli', 'co'] },
  { word: 'básico', accentType: 'esdrujula', explanation: 'La palabra "básico" se divide en 3 sílabas: bá-si-co. El acento está en la antepenúltima sílaba (bá), por lo tanto es una palabra esdrújula.', syllables: ['bá', 'si', 'co'] },
  { word: 'práctico', accentType: 'esdrujula', explanation: 'La palabra "práctico" se divide en 3 sílabas: prác-ti-co. El acento está en la antepenúltima sílaba (prác), por lo tanto es una palabra esdrújula.', syllables: ['prác', 'ti', 'co'] },
  { word: 'económico', accentType: 'esdrujula', explanation: 'La palabra "económico" se divide en 5 sílabas: e-co-nó-mi-co. El acento está en la antepenúltima sílaba (nó), por lo tanto es una palabra esdrújula.', syllables: ['e', 'co', 'nó', 'mi', 'co'] },
  { word: 'académico', accentType: 'esdrujula', explanation: 'La palabra "académico" se divide en 5 sílabas: a-ca-dé-mi-co. El acento está en la antepenúltima sílaba (dé), por lo tanto es una palabra esdrújula.', syllables: ['a', 'ca', 'dé', 'mi', 'co'] },
  { word: 'histórico', accentType: 'esdrujula', explanation: 'La palabra "histórico" se divide en 4 sílabas: his-tó-ri-co. El acento está en la antepenúltima sílaba (tó), por lo tanto es una palabra esdrújula.', syllables: ['his', 'tó', 'ri', 'co'] },
];

// Función para obtener una palabra aleatoria
export const getRandomWord = (): Word => {
  const randomIndex = Math.floor(Math.random() * wordsDatabase.length);
  return wordsDatabase[randomIndex];
};

// Función para obtener múltiples palabras aleatorias
export const getBatchWords = (count: number = 10): Word[] => {
  const shuffled = [...wordsDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, wordsDatabase.length));
};