import { parseCsvRows, normalizeLevelKey } from './questionsService';

describe('normalizeLevelKey', () => {
  it('should remove "Compartilhamento - " prefix and trim', () => {
    expect(normalizeLevelKey('Compartilhamento - Comunhao')).toBe('comunhao');
    expect(normalizeLevelKey('Compartilhamento -  Amor ')).toBe('amor');
    expect(normalizeLevelKey('compartilhamento - Test')).toBe('test');
  });

  it('should remove "Quiz - " prefix and trim', () => {
    expect(normalizeLevelKey('Quiz - Multidão')).toBe('multidao');
    expect(normalizeLevelKey('Quiz -  Test ')).toBe('test');
    expect(normalizeLevelKey('quiz - test')).toBe('test');
  });

  it('should remove accents and normalize to lowercase', () => {
    expect(normalizeLevelKey('Multidão')).toBe('multidao');
    expect(normalizeLevelKey('Coração')).toBe('coracao');
    expect(normalizeLevelKey('ÁÉÍÓÚáéíóú')).toBe('aeiouaeiou');
    expect(normalizeLevelKey('ÂÊÎÔÛâêîôû')).toBe('aeiouaeiou');
    expect(normalizeLevelKey('ÀÈÌÒÙàèìòù')).toBe('aeiouaeiou');
    expect(normalizeLevelKey('ÃÕãõ')).toBe('aoao');
  });

  it('should combine all normalizations', () => {
    expect(normalizeLevelKey('Compartilhamento - Crianças')).toBe('criancas');
    expect(normalizeLevelKey('Quiz - Missões')).toBe('missoes');
  });

  it('should handle strings without prefixes', () => {
    expect(normalizeLevelKey('Test')).toBe('test');
    expect(normalizeLevelKey('  Spaces  ')).toBe('spaces');
  });
});

describe('parseCsvRows', () => {
  it('should parse simple CSV with comma separated values', () => {
    const csv = 'a,b,c\n1,2,3';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3']
    ]);
  });

  it('should handle quoted values with commas', () => {
    const csv = '"a,b",c\n"1,2",3';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a,b', 'c'],
      ['1,2', '3']
    ]);
  });

  it('should handle multi-line strings in quotes', () => {
    const csv = 'a,"b\nc",d';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a', 'b\nc', 'd']
    ]);
  });

  it('should handle quotes inside quotes', () => {
    const csv = 'a,"b""c",d';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a', 'b"c', 'd']
    ]);
  });

  it('should handle empty cells', () => {
    const csv = 'a,,c\n1,,3';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a', '', 'c'],
      ['1', '', '3']
    ]);
  });

  it('should handle trailing empty lines', () => {
    const csv = 'a,b,c\n\n';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a', 'b', 'c']
    ]);
  });

  it('should handle crlf line endings', () => {
    const csv = 'a,b,c\r\n1,2,3';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3']
    ]);
  });

  it('should handle missing trailing newline', () => {
    const csv = 'a,b,c';
    const result = parseCsvRows(csv);
    expect(result).toEqual([
      ['a', 'b', 'c']
    ]);
  });
});
