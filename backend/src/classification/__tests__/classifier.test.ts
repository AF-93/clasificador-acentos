import { AccentClassifier } from '../classifier.js';

describe('AccentClassifier', () => {
  let classifier: AccentClassifier;
  
  beforeEach(() => {
    classifier = new AccentClassifier();
  });
  
  describe('Palabras agudas', () => {
    test('debe clasificar correctamente palabras agudas con acento', () => {
      const result = classifier.classifyWord('canción');
      expect(result.type).toBe('aguda');
      expect(result.syllables).toEqual(['can', 'ción']);
    });
    
    test('debe clasificar correctamente palabras agudas sin acento', () => {
      const result = classifier.classifyWord('reloj');
      expect(result.type).toBe('aguda');
    });
  });
  
  describe('Palabras graves', () => {
    test('debe clasificar correctamente palabras graves', () => {
      const result = classifier.classifyWord('casa');
      expect(result.type).toBe('grave');
      expect(result.syllables).toEqual(['ca', 'sa']);
    });
    
    test('debe clasificar correctamente palabras graves con acento', () => {
      const result = classifier.classifyWord('árbol');
      expect(result.type).toBe('grave');
    });
  });
  
  describe('Palabras esdrújulas', () => {
    test('debe clasificar correctamente palabras esdrújulas', () => {
      const result = classifier.classifyWord('teléfono');
      expect(result.type).toBe('esdrujula');
      expect(result.syllables).toEqual(['te', 'lé', 'fo', 'no']);
    });
    
    test('debe clasificar correctamente palabras esdrújulas', () => {
      const result = classifier.classifyWord('médico');
      expect(result.type).toBe('esdrujula');
    });
  });
  
  describe('Validación', () => {
    test('debe validar clasificaciones correctas', () => {
      expect(classifier.validateClassification('canción', 'aguda')).toBe(true);
      expect(classifier.validateClassification('casa', 'grave')).toBe(true);
      expect(classifier.validateClassification('teléfono', 'esdrujula')).toBe(true);
    });
    
    test('debe rechazar clasificaciones incorrectas', () => {
      expect(classifier.validateClassification('canción', 'grave')).toBe(false);
      expect(classifier.validateClassification('casa', 'aguda')).toBe(false);
      expect(classifier.validateClassification('teléfono', 'grave')).toBe(false);
    });
  });
});