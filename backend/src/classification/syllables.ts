// Función para dividir palabras en sílabas (implementación mejorada)
export const divideSyllables = (word: string): string[] => {
  // Casos especiales conocidos para mayor precisión
  const specialCases: { [key: string]: string[] } = {
    // Palabras agudas
    'canción': ['can', 'ción'],
    'corazón': ['co', 'ra', 'zón'],
    'después': ['des', 'pués'],
    'jamás': ['ja', 'más'],
    'ciudad': ['ciu', 'dad'],
    'amor': ['a', 'mor'],
    'papel': ['pa', 'pel'],
    'reloj': ['re', 'loj'],
    'café': ['ca', 'fé'],
    'verdad': ['ver', 'dad'],
    'mamá': ['ma', 'má'],
    'papá': ['pa', 'pá'],
    'bebé': ['be', 'bé'],
    'sofá': ['so', 'fá'],
    'menú': ['me', 'nú'],
    'bambú': ['bam', 'bú'],
    'maní': ['ma', 'ní'],
    'rubí': ['ru', 'bí'],
    'bisturí': ['bis', 'tu', 'rí'],
    'colibrí': ['co', 'li', 'brí'],
    'ratón': ['ra', 'tón'],
    'limón': ['li', 'món'],
    'jabón': ['ja', 'bón'],
    'balón': ['ba', 'lón'],
    'camión': ['ca', 'mión'],
    'avión': ['a', 'vión'],
    'león': ['le', 'ón'],
    'melón': ['me', 'lón'],
    'salón': ['sa', 'lón'],
    'rincón': ['rin', 'cón'],
    'celular': ['ce', 'lu', 'lar'],
    
    // Palabras graves
    'casa': ['ca', 'sa'],
    'árbol': ['ár', 'bol'],
    'fácil': ['fá', 'cil'],
    'mesa': ['me', 'sa'],
    'libro': ['li', 'bro'],
    'ventana': ['ven', 'ta', 'na'],
    'problema': ['pro', 'ble', 'ma'],
    'momento': ['mo', 'men', 'to'],
    'persona': ['per', 'so', 'na'],
    'tiempo': ['tiem', 'po'],
    'niño': ['ni', 'ño'],
    'niña': ['ni', 'ña'],
    'perro': ['pe', 'rro'],
    'gato': ['ga', 'to'],
    'agua': ['a', 'gua'],
    'tierra': ['tie', 'rra'],
    'cielo': ['cie', 'lo'],
    'nube': ['nu', 'be'],
    'flor': ['flor'],
    'hoja': ['ho', 'ja'],
    'amigo': ['a', 'mi', 'go'],
    'juego': ['jue', 'go'],
    'colegio': ['co', 'le', 'gio'],
    'maestro': ['maes', 'tro'],
    'lápiz': ['lá', 'piz'],
    'cuaderno': ['cua', 'der', 'no'],
    'mochila': ['mo', 'chi', 'la'],
    'pelota': ['pe', 'lo', 'ta'],
    'bicicleta': ['bi', 'ci', 'cle', 'ta'],
    'computadora': ['com', 'pu', 'ta', 'do', 'ra'],
    
    // Palabras esdrújulas
    'teléfono': ['te', 'lé', 'fo', 'no'],
    'médico': ['mé', 'di', 'co'],
    'rápido': ['rá', 'pi', 'do'],
    'música': ['mú', 'si', 'ca'],
    'público': ['pú', 'bli', 'co'],
    'básico': ['bá', 'si', 'co'],
    'práctico': ['prác', 'ti', 'co'],
    'económico': ['e', 'co', 'nó', 'mi', 'co'],
    'académico': ['a', 'ca', 'dé', 'mi', 'co'],
    'histórico': ['his', 'tó', 'ri', 'co'],
    'pájaro': ['pá', 'ja', 'ro'],
    'número': ['nú', 'me', 'ro'],
    'cámara': ['cá', 'ma', 'ra'],
    'lámpara': ['lám', 'pa', 'ra'],
    'sábado': ['sá', 'ba', 'do'],
    'miércoles': ['miér', 'co', 'les'],
    'matemáticas': ['ma', 'te', 'má', 'ti', 'cas'],
    'gramática': ['gra', 'má', 'ti', 'ca'],
    'fantástico': ['fan', 'tás', 'ti', 'co'],
    'simpático': ['sim', 'pá', 'ti', 'co'],
    'película': ['pe', 'lí', 'cu', 'la'],
    'máquina': ['má', 'qui', 'na'],
    'página': ['pá', 'gi', 'na'],
    'fábrica': ['fá', 'bri', 'ca'],
    'médula': ['mé', 'du', 'la'],
    'cómico': ['có', 'mi', 'co'],
    'tímido': ['tí', 'mi', 'do'],
    'último': ['úl', 'ti', 'mo'],
    'séptimo': ['sép', 'ti', 'mo'],
    'décimo': ['dé', 'ci', 'mo']
  };
  
  const normalizedWord = word.toLowerCase();
  if (specialCases[normalizedWord]) {
    return specialCases[normalizedWord];
  }
  
  // Algoritmo general mejorado
  const vowels = 'aeiouáéíóú';
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  
  const syllables: string[] = [];
  let currentSyllable = '';
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    currentSyllable += word[i];
    
    // Si encontramos una vocal
    if (vowels.includes(char)) {
      // Buscar la siguiente vocal
      let nextVowelIndex = -1;
      let consonantsBetween = '';
      
      for (let j = i + 1; j < word.length; j++) {
        if (vowels.includes(word[j].toLowerCase())) {
          nextVowelIndex = j;
          break;
        }
        consonantsBetween += word[j].toLowerCase();
      }
      
      // Si no hay más vocales, esta es la última sílaba
      if (nextVowelIndex === -1) {
        syllables.push(currentSyllable);
        break;
      }
      
      const consonantCount = consonantsBetween.length;
      
      // Reglas de división silábica
      if (consonantCount === 0) {
        // Vocal seguida directamente de vocal
        syllables.push(currentSyllable);
        currentSyllable = '';
      } else if (consonantCount === 1) {
        // Una consonante: va con la siguiente vocal
        syllables.push(currentSyllable);
        currentSyllable = '';
      } else if (consonantCount === 2) {
        // Dos consonantes: verificar si forman grupo inseparable
        const inseparableGroups = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'tr', 'ch', 'll', 'rr'];
        
        if (inseparableGroups.includes(consonantsBetween)) {
          // Grupo inseparable: va completo con la siguiente vocal
          syllables.push(currentSyllable);
          currentSyllable = '';
        } else {
          // Se separan: primera consonante queda con la vocal anterior
          currentSyllable += word[i + 1];
          syllables.push(currentSyllable);
          currentSyllable = '';
          i++;
        }
      } else {
        // Tres o más consonantes: primera queda con vocal anterior
        currentSyllable += word[i + 1];
        syllables.push(currentSyllable);
        currentSyllable = '';
        i++;
      }
    }
  }
  
  // Agregar cualquier sílaba restante
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }
  
  return syllables.filter(s => s.length > 0);
};

// Función para encontrar la sílaba tónica
export const findStressedSyllable = (word: string, syllables: string[]): number => {
  // Buscar acento ortográfico
  const accentedVowels = ['á', 'é', 'í', 'ó', 'ú'];
  
  for (let i = 0; i < syllables.length; i++) {
    const syllable = syllables[i];
    for (const vowel of accentedVowels) {
      if (syllable.includes(vowel)) {
        return i;
      }
    }
  }
  
  // Si no hay acento ortográfico, aplicar reglas de acentuación
  const lastChar = word[word.length - 1].toLowerCase();
  const vowels = 'aeiou';
  const consonantsNS = 'ns';
  
  if (syllables.length === 1) {
    return 0; // Monosílabos
  }
  
  if (vowels.includes(lastChar) || consonantsNS.includes(lastChar)) {
    // Termina en vocal, n o s: grave (penúltima sílaba)
    return syllables.length - 2;
  } else {
    // Termina en consonante (excepto n, s): aguda (última sílaba)
    return syllables.length - 1;
  }
};