import { COMPARTILHAR_QUESTIONS, Question, QUIZ_QUESTIONS, TEOLOGICO_QUESTIONS, TORRE_QUESTIONS, WHO_AM_I_CARDS, WhoAmICard } from '@/constants/questions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_QUIZ = '@respondeirmao:quiz_questions';
const STORAGE_KEY_COMPARTILHAR = '@respondeirmao:compartilhar_questions';
const STORAGE_KEY_TORRE = '@respondeirmao:torre_questions';
const STORAGE_KEY_TEOLOGICO = '@respondeirmao:teologico_questions';
const STORAGE_KEY_WHO_AM_I = '@respondeirmao:who_am_i_cards';

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
function normalizeLevelKey(name: string): string {
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
}

export const questionsService = {
  /**
   * Loads stored questions from local cache or falls back to hardcoded defaults.
   */
  async loadLocalQuestions(): Promise<CachedQuestions> {
    try {
      const [quizJson, compartilharJson, torreJson, teologicoJson, whoAmIJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_QUIZ),
        AsyncStorage.getItem(STORAGE_KEY_COMPARTILHAR),
        AsyncStorage.getItem(STORAGE_KEY_TORRE),
        AsyncStorage.getItem(STORAGE_KEY_TEOLOGICO),
        AsyncStorage.getItem(STORAGE_KEY_WHO_AM_I),
      ]);

      const quiz = quizJson ? JSON.parse(quizJson) : QUIZ_QUESTIONS;
      const compartilhar = compartilharJson ? JSON.parse(compartilharJson) : COMPARTILHAR_QUESTIONS;
      const torre = torreJson ? JSON.parse(torreJson) : TORRE_QUESTIONS;
      const teologico = teologicoJson ? JSON.parse(teologicoJson) : TEOLOGICO_QUESTIONS;
      const whoAmI = whoAmIJson ? JSON.parse(whoAmIJson) : WHO_AM_I_CARDS;

      return { quiz, compartilhar, torre, teologico, whoAmI };
    } catch (error) {
      console.error('[QuestionsService] Failed to read local cache:', error);
      return {
        quiz: QUIZ_QUESTIONS,
        compartilhar: COMPARTILHAR_QUESTIONS,
        torre: TORRE_QUESTIONS,
        teologico: TEOLOGICO_QUESTIONS,
        whoAmI: WHO_AM_I_CARDS,
      };
    }
  },

  /**
   * Connects to Google Sheets, downloads all matching sheets and stores them safely.
   * Returns the new fully mapped question sets if successful.
   * Rejects if syncing failed, adhering to "não substitua a memória atual" policy.
   */
  async fetchAndSyncQuestions(): Promise<CachedQuestions> {
    // console.log('[QuestionsService] Starting background sync from Google Sheets...');

    const response = await fetch(SPREADSHEET_PUBHTML_URL, {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet pubhtml, status: ${response.status}`);
    }

    const html = await response.text();
    const sheetItems = extractSheetItems(html);

    if (sheetItems.length === 0) {
      throw new Error('No sheets found in the spreadsheet HTML payload.');
    }

    const newQuiz: Record<string, Question[]> = { ...QUIZ_QUESTIONS };
    const newCompartilhar: Record<string, Question[]> = { ...COMPARTILHAR_QUESTIONS };
    let newTorre: Question[] = [ ...TORRE_QUESTIONS ];
    let newTeologico: Question[] = [ ...TEOLOGICO_QUESTIONS ];
    let newWhoAmI: WhoAmICard[] = [ ...WHO_AM_I_CARDS ];

    // Process all matched sheets concurrently
    const sheetPromises = sheetItems.map(async (item) => {
      const isCompartilhar = item.name.startsWith('Compartilhamento - ');
      const isQuiz = item.name.startsWith('Quiz - ');
      const isTorre = item.name === 'Torre de Babel';
      const isTeologico = item.name === 'Quiz Teologico';
      const isWhoAmI = item.name === 'Quem Sou Eu';

      if (!isCompartilhar && !isQuiz && !isTorre && !isTeologico && !isWhoAmI) {
        return null; // Ignore sheets we don't use
      }

      const levelKey = normalizeLevelKey(item.name);
      const csvUrl = `${SPREADSHEET_CSV_BASE_URL}?output=csv&gid=${item.gid}`;

      // console.log(`[QuestionsService] Fetching CSV for ${item.name} (gid: ${item.gid})`);

      try {
        const csvResponse = await fetch(csvUrl, { headers: { 'Cache-Control': 'no-cache' } });
        if (!csvResponse.ok) {
          console.warn(`[QuestionsService] Failed downloading sheet: ${item.name}`);
          return null; // Skip this specific sheet but could proceed or fail entirely?
        }

        const csvText = await csvResponse.text();

        const parsedRows = parseCsvRows(csvText);
        // console.log(`[QuestionsService] Parsed ${parsedRows.length} rows for ${item.name}`);

        // Skip updating if the sheet exists but is empty
        if (parsedRows.length === 0) {
          // console.log(`[QuestionsService] Sheet ${item.name} is currently empty. Skipping override.`);
          return null;
        }

        // Map rows into Question model format
        const mappedQuestions: Question[] = parsedRows.map((row, index) => {
          if (isQuiz) {
            // Quiz: A=Question, B=Separator, C=Answer
            return {
              id: `remote_${levelKey}_${index}`,
              text: row[0] || '',
              correctAnswer: row[2] || '',
              level: levelKey,
            };
          } else if (isTeologico) {
            // Quiz Teologico: A=Question, B=Separator, C=Answer
            return {
              id: `remote_teologico_${index}`,
              text: row[0] || '',
              correctAnswer: row[2] || '',
              level: 'teologico',
            };
          } else if (isCompartilhar) {
            // Compartilhamento: A=Question
            return {
              id: `remote_${levelKey}_${index}`,
              text: row[0] || '',
              level: levelKey,
            };
          } else if (isWhoAmI) {
            // Quem Sou Eu: A=Answer, B=Category, C-Z=Hints (skip empty columns)
            const hints = row.slice(2).filter(h => h.trim().length > 0);
            return {
              id: `remote_whoami_${index}`,
              answer: row[0] || '',
              category: row[1] || '',
              hints,
            } as unknown as Question; // Cast: will be post-processed below
          } else {
            // Torre de Babel: A=Question, B=Correct Answer, C, D, E=Wrong Answers, F=Bible Reference
            let level = 'facil';
            if (index >= 90) level = 'muito_dificil';
            else if (index >= 60) level = 'dificil';
            else if (index >= 30) level = 'media';

            return {
              id: `remote_torre_${index}`,
              text: row[0] || '',
              correctAnswer: row[1] || '',
              wrongAnswers: [row[2] || '', row[3] || '', row[4] || ''].filter(Boolean),
              bibleReference: row[5] || '',
              level,
            };
          }
        });

        return { isQuiz, isCompartilhar, isTorre, isTeologico, isWhoAmI, levelKey, mappedQuestions };
      } catch (error) {
        console.warn(`[QuestionsService] Error fetching sheet ${item.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(sheetPromises);

    let hasUpdates = false;
    for (const result of results) {
      if (!result) continue;

      if (result.isQuiz) {
        newQuiz[result.levelKey] = result.mappedQuestions;
      } else if (result.isCompartilhar) {
        newCompartilhar[result.levelKey] = result.mappedQuestions;
      } else if (result.isTorre) {
        newTorre = result.mappedQuestions;
      } else if (result.isTeologico) {
        newTeologico = result.mappedQuestions;
      } else if (result.isWhoAmI) {
        // Cast back to WhoAmICard[] (we used Question as a carrier type above)
        newWhoAmI = result.mappedQuestions as unknown as WhoAmICard[];
      }
      hasUpdates = true;
    }

    if (!hasUpdates) {
      throw new Error('Sync execution found no updateable question contents.');
    }

    // Succeeded with at least some updates! Persist them
    // console.log('[QuestionsService] Sync successful, storing cache to device...');
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(newQuiz)),
      AsyncStorage.setItem(STORAGE_KEY_COMPARTILHAR, JSON.stringify(newCompartilhar)),
      AsyncStorage.setItem(STORAGE_KEY_TORRE, JSON.stringify(newTorre)),
      AsyncStorage.setItem(STORAGE_KEY_TEOLOGICO, JSON.stringify(newTeologico)),
      AsyncStorage.setItem(STORAGE_KEY_WHO_AM_I, JSON.stringify(newWhoAmI)),
    ]);

    return { quiz: newQuiz, compartilhar: newCompartilhar, torre: newTorre, teologico: newTeologico, whoAmI: newWhoAmI };
  }
};
