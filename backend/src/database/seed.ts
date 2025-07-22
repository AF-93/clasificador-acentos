import { prisma } from './client.js';
import { AccentClassifier } from '../classification/index.js';

const classifier = new AccentClassifier();

// Palabras apropiadas para niños de 10 años (edad escolar)
const sampleWords = [
  // Palabras agudas (31)
  'canción', 'café', 'reloj', 'papel', 'ciudad', 'amor', 'verdad', 'corazón', 'jamás', 'después',
  'mamá', 'papá', 'bebé', 'sofá', 'menú', 'bambú', 'maní', 'rubí', 'bisturí', 'colibrí',
  'ratón', 'limón', 'jabón', 'balón', 'camión', 'avión', 'león', 'melón', 'salón', 'rincón', 'celular',
  
  // Palabras graves (30)
  'casa', 'árbol', 'fácil', 'mesa', 'libro', 'ventana', 'problema', 'momento', 'persona', 'tiempo',
  'niño', 'niña', 'perro', 'gato', 'agua', 'tierra', 'cielo', 'nube', 'flor', 'hoja',
  'amigo', 'juego', 'colegio', 'maestro', 'lápiz', 'cuaderno', 'mochila', 'pelota', 'bicicleta', 'computadora',
  
  // Palabras esdrújulas (30)
  'teléfono', 'médico', 'rápido', 'música', 'público', 'básico', 'práctico', 'económico', 'académico', 'histórico',
  'pájaro', 'número', 'cámara', 'lámpara', 'sábado', 'miércoles', 'matemáticas', 'gramática', 'fantástico', 'simpático',
  'película', 'máquina', 'página', 'fábrica', 'médula', 'cómico', 'tímido', 'último', 'séptimo', 'décimo'
];

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...');
  
  try {
    // Limpiar datos existentes
    await prisma.word.deleteMany();
    console.log('🧹 Datos existentes eliminados');
    
    // Insertar palabras de ejemplo
    for (const word of sampleWords) {
      const classification = classifier.classifyWord(word);
      
      await prisma.word.create({
        data: {
          word: word,
          accentType: classification.type,
          explanation: classification.explanation,
          syllables: JSON.stringify(classification.syllables),
        },
      });
      
      console.log(`✅ Palabra agregada: ${word} (${classification.type})`);
    }
    
    console.log(`🎉 Seed completado. ${sampleWords.length} palabras agregadas.`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar seed si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { seed };