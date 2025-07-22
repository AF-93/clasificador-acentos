import { AccentType, AccentClassification } from '../types/index.js';
import { divideSyllables, findStressedSyllable } from './syllables.js';

export class AccentClassifier {
  
  classifyWord(word: string): AccentClassification {
    const syllables = divideSyllables(word);
    const stressedSyllableIndex = findStressedSyllable(word, syllables);
    const type = this.determineAccentType(syllables, stressedSyllableIndex);
    const explanation = this.generateExplanation(word, syllables, stressedSyllableIndex, type);
    
    return {
      type,
      stressedSyllableIndex,
      syllables,
      explanation
    };
  }
  
  private determineAccentType(syllables: string[], stressedIndex: number): AccentType {
    const totalSyllables = syllables.length;
    
    if (totalSyllables === 1) {
      return 'aguda'; // Los monosílabos se consideran agudos
    }
    
    // Última sílaba (aguda)
    if (stressedIndex === totalSyllables - 1) {
      return 'aguda';
    }
    
    // Penúltima sílaba (grave/llana)
    if (stressedIndex === totalSyllables - 2) {
      return 'grave';
    }
    
    // Antepenúltima o anterior (esdrújula)
    return 'esdrujula';
  }
  
  private generateExplanation(
    word: string, 
    syllables: string[], 
    stressedIndex: number, 
    type: AccentType
  ): string {
    const stressedSyllable = syllables[stressedIndex];
    const syllablePosition = this.getSyllablePosition(syllables.length, stressedIndex);
    
    let explanation = `La palabra "${word}" se divide en ${syllables.length} sílaba${syllables.length > 1 ? 's' : ''}: ${syllables.join('-')}. `;
    explanation += `El acento está en la ${syllablePosition} sílaba (${stressedSyllable}), `;
    
    switch (type) {
      case 'aguda':
        explanation += 'por lo tanto es una palabra aguda.';
        break;
      case 'grave':
        explanation += 'por lo tanto es una palabra grave o llana.';
        break;
      case 'esdrujula':
        explanation += 'por lo tanto es una palabra esdrújula.';
        break;
    }
    
    return explanation;
  }
  
  private getSyllablePosition(totalSyllables: number, stressedIndex: number): string {
    if (stressedIndex === totalSyllables - 1) {
      return 'última';
    } else if (stressedIndex === totalSyllables - 2) {
      return 'penúltima';
    } else if (stressedIndex === totalSyllables - 3) {
      return 'antepenúltima';
    } else {
      return `${totalSyllables - stressedIndex}ª desde el final`;
    }
  }
  
  validateClassification(word: string, expectedType: AccentType): boolean {
    const classification = this.classifyWord(word);
    return classification.type === expectedType;
  }
}