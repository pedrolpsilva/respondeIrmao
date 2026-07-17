import { COMPARTILHAR_QUESTIONS, Question, QUIZ_QUESTIONS, TEOLOGICO_QUESTIONS, TORRE_QUESTIONS, WHO_AM_I_CARDS, WhoAmICard } from '@/constants/questions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

const STORAGE_KEY_QUIZ = '@respondeirmao:quiz_questions';
const STORAGE_KEY_COMPARTILHAR = '@respondeirmao:compartilhar_questions';
const STORAGE_KEY_TORRE = '@respondeirmao:torre_questions';
const STORAGE_KEY_TEOLOGICO = '@respondeirmao:teologico_questions';
const STORAGE_KEY_WHO_AM_I = '@respondeirmao:who_am_i_cards';
const STORAGE_KEY_NAMES = '@respondeirmao:random_names';

const SPREADSHEET_PUBHTML_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNUtmrVIX691QEwOmo9dhR22Q-S93ugZJSEvFTHNVozU2_Dp8-cl2wu0iZDGLXhH_Om6CVvBIFA6U5/pubhtml';
const SPREADSHEET_CSV_BASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNUtmrVIX691QEwOmo9dhR22Q-S93ugZJSEvFTHNVozU2_Dp8-cl2wu0iZDGLXhH_Om6CVvBIFA6U5/pub';

interface SheetItem {
  name: string;
  gid: string;
}

/**
 * Robust CSV parser that handles multiple columns, quoted values, and multi-line strings.
 * Returns an array of rows, where each row is an array of strings (columns).
 */
export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentCell = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped double quote inside quote marks
        currentCell += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      // Real end of line
      currentRow.push(currentCell.trim());

      // Only push non-empty rows
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentCell = '';

      if (char === '\r' && nextChar === '\n') {
        i++; // Skip trailing LF for CRLF line endings
      }
    } else {
      currentCell += char;
    }
  }

  // Handle residual data at EOF
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}


/**
 * Normalizes a sheet name into our level ID keys.
 * E.g., "Compartilhamento - Comunhao" -> "comunhao"
 * E.g., "Quiz - Multidão" -> "multidao"
 */
export function normalizeLevelKey(name: string): string {
  return name
    .replace(/^Compartilhamento\s*-\s*/i, '')
    .replace(/^Quiz\s*-\s*/i, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

/**
 * Extracts the array of sheets from Google's published HTML JavaScript init function.
 * Using RegExp to match `items.push({name: "NAME", ..., gid: "GID", ...})` pattern.
 */
function extractSheetItems(html: string): SheetItem[] {
  const items: SheetItem[] = [];

  // Pattern search: items.push({name: "...", pageUrl: "...", gid: "...", ...})
  // Or matching name and gid properties
  const regex = /items\.push\(\s*\{\s*name:\s*"([^"]+)",[^}]*gid:\s*"([^"]+)"/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    items.push({
      name: match[1],
      gid: match[2]
    });
  }

  return items;
}

export interface CachedQuestions {
  quiz: Record<string, Question[]>;
  compartilhar: Record<string, Question[]>;
  torre: Question[];
  teologico: Question[];
  whoAmI: WhoAmICard[];
  names: string[];
}

function getStepKeyForSheet(sheetName: string): string | null {
  if (sheetName === 'Nomes') return 'nomes';
  if (sheetName === 'Quiz - Multidão') return 'quiz_multidao';
  if (sheetName === 'Quiz - Discipulo') return 'quiz_discipulo';
  if (sheetName === 'Quiz - Apostolo') return 'quiz_apostolo';
  if (sheetName === 'Quiz Teologico') return 'quiz_teologico';
  if (sheetName === 'Compartilhamento - Comunhao') return 'compartilhar_comunhao';
  if (sheetName === 'Compartilhamento - Testemunho') return 'compartilhar_testemunho';
  if (sheetName === 'Compartilhamento - Confissao') return 'compartilhar_confissao';
  if (sheetName === 'Torre de Babel') return 'torre';
  if (sheetName === 'Quem Sou Eu') return 'who_am_i';
  return null;
}

export const questionsService = {
  /**
   * Loads stored questions from local cache or falls back to hardcoded defaults.
   */
  async loadLocalQuestions(): Promise<CachedQuestions> {
    try {
      const [quizJson, compartilharJson, torreJson, teologicoJson, whoAmIJson, namesJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_QUIZ),
        AsyncStorage.getItem(STORAGE_KEY_COMPARTILHAR),
        AsyncStorage.getItem(STORAGE_KEY_TORRE),
        AsyncStorage.getItem(STORAGE_KEY_TEOLOGICO),
        AsyncStorage.getItem(STORAGE_KEY_WHO_AM_I),
        AsyncStorage.getItem(STORAGE_KEY_NAMES),
      ]);

      const quiz = quizJson ? JSON.parse(quizJson) : QUIZ_QUESTIONS;
      const compartilhar = compartilharJson ? JSON.parse(compartilharJson) : COMPARTILHAR_QUESTIONS;
      const torre = torreJson ? JSON.parse(torreJson) : TORRE_QUESTIONS;
      const teologico = teologicoJson ? JSON.parse(teologicoJson) : TEOLOGICO_QUESTIONS;
      const whoAmI = whoAmIJson ? JSON.parse(whoAmIJson) : WHO_AM_I_CARDS;
      const names = namesJson ? JSON.parse(namesJson) : [];

      return { quiz, compartilhar, torre, teologico, whoAmI, names };
    } catch (error) {
      console.error('[QuestionsService] Failed to read local cache:', error);
      return {
        quiz: QUIZ_QUESTIONS,
        compartilhar: COMPARTILHAR_QUESTIONS,
        torre: TORRE_QUESTIONS,
        teologico: TEOLOGICO_QUESTIONS,
        whoAmI: WHO_AM_I_CARDS,
        names: [],
      };
    }
  },

  /**
   * Connects to Supabase, downloads all matching tables and stores them safely.
   * Returns the new fully mapped question sets if successful.
   * Rejects if syncing failed, adhering to "não substitua a memória atual" policy.
   */
  async fetchAndSyncQuestions(
    onStepUpdate?: (stepKey: string, status: 'loading' | 'success' | 'error') => void
  ): Promise<CachedQuestions> {
    const current = await this.loadLocalQuestions();
    const newQuiz = { ...current.quiz };
    const newCompartilhar = { ...current.compartilhar };
    let newTorre = [ ...current.torre ];
    let newTeologico = [ ...current.teologico ];
    let newWhoAmI = [ ...current.whoAmI ];
    let newNomes = [ ...current.names ];

    const syncSteps = [
      { stepKey: 'nomes', table: 'nomes' },
      { stepKey: 'quiz_multidao', table: 'quiz_multidao' },
      { stepKey: 'quiz_discipulo', table: 'quiz_discipulo' },
      { stepKey: 'quiz_apostolo', table: 'quiz_apostolo' },
      { stepKey: 'quiz_teologico', table: 'quiz_teologico' },
      { stepKey: 'compartilhar_comunhao', table: 'compartilhamento_comunhao' },
      { stepKey: 'compartilhar_testemunho', table: 'compartilhamento_testemunho' },
      { stepKey: 'compartilhar_confissao', table: 'compartilhamento_confissao' },
      { stepKey: 'torre', table: 'torre_de_babel' },
      { stepKey: 'who_am_i', table: 'quem_sou_eu' },
    ];

    if (onStepUpdate) {
      syncSteps.forEach(step => onStepUpdate(step.stepKey, 'loading'));
    }

    let hasUpdates = false;

    // Process all tables in parallel
    const promises = syncSteps.map(async ({ stepKey, table }) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error(`No data returned for table: ${table}`);
        }

        if (stepKey === 'nomes') {
          newNomes = data
            .map((row: any) => (row.nome || '').trim())
            .filter((name: string) => name.length > 0 && name.toLowerCase() !== 'nome' && name.toLowerCase() !== 'nomes');
        } else if (stepKey === 'quiz_teologico') {
          newTeologico = data.map((row: any) => ({
            id: `remote_teologico_${row.id}`,
            text: row.pergunta || '',
            correctAnswer: row.resposta || '',
            level: 'teologico',
          }));
        } else if (stepKey.startsWith('quiz_')) {
          const levelKey = stepKey.replace('quiz_', '');
          newQuiz[levelKey] = data.map((row: any) => ({
            id: `remote_${levelKey}_${row.id}`,
            text: row.pergunta || '',
            correctAnswer: row.resposta || '',
            level: levelKey,
          }));
        } else if (stepKey.startsWith('compartilhar_')) {
          const levelKey = stepKey.replace('compartilhar_', '');
          newCompartilhar[levelKey] = data.map((row: any) => ({
            id: `remote_${levelKey}_${row.id}`,
            text: row.pergunta || '',
            level: levelKey,
          }));
        } else if (stepKey === 'torre') {
          newTorre = data.map((row: any, idx: number) => {
            let level = 'facil';
            if (idx >= 90) level = 'muito_dificil';
            else if (idx >= 60) level = 'dificil';
            else if (idx >= 30) level = 'media';

            return {
              id: `remote_torre_${row.id}`,
              text: row.pergunta || '',
              correctAnswer: row.resposta_correta || '',
              wrongAnswers: [row.resposta_incorreta_1 || '', row.resposta_incorreta_2 || '', row.resposta_incorreta_3 || ''].filter(Boolean),
              bibleReference: row.referencia_biblica || '',
              level,
            };
          });
        } else if (stepKey === 'who_am_i') {
          newWhoAmI = data.map((row: any) => {
            const hints: string[] = [];
            for (let i = 1; i <= 20; i++) {
              const dica = row[`dica_${i}`];
              if (dica && dica.trim().length > 0) {
                hints.push(dica.trim());
              }
            }
            return {
              id: `remote_whoami_${row.id}`,
              answer: row.palavra || '',
              category: row.categoria || '',
              hints,
            };
          });
        }

        if (onStepUpdate) {
          onStepUpdate(stepKey, 'success');
        }
        hasUpdates = true;
      } catch (err) {
        console.warn(`[QuestionsService] Sync failed for ${stepKey} (${table}):`, err);
        if (onStepUpdate) {
          onStepUpdate(stepKey, 'error');
        }
      }
    });

    await Promise.all(promises);

    if (!hasUpdates) {
      throw new Error('Sync execution found no updateable question contents from Supabase.');
    }

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(newQuiz)),
      AsyncStorage.setItem(STORAGE_KEY_COMPARTILHAR, JSON.stringify(newCompartilhar)),
      AsyncStorage.setItem(STORAGE_KEY_TORRE, JSON.stringify(newTorre)),
      AsyncStorage.setItem(STORAGE_KEY_TEOLOGICO, JSON.stringify(newTeologico)),
      AsyncStorage.setItem(STORAGE_KEY_WHO_AM_I, JSON.stringify(newWhoAmI)),
      AsyncStorage.setItem(STORAGE_KEY_NAMES, JSON.stringify(newNomes)),
    ]);

    return { quiz: newQuiz, compartilhar: newCompartilhar, torre: newTorre, teologico: newTeologico, whoAmI: newWhoAmI, names: newNomes };
  }
};
