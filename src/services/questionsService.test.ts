import { parseCsvRows } from './questionsService';

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
