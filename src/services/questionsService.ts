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



export interface CachedQuestions {
  quiz: Record<string, Question[]>;
  compartilhar: Record<string, Question[]>;
  torre: Question[];
  teologico: Question[];
  whoAmI: WhoAmICard[];
  names: string[];
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
            .map((row: Record<string, unknown>) => (String(row.nome || '')).trim())
            .filter((name: string) => name.length > 0 && name.toLowerCase() !== 'nome' && name.toLowerCase() !== 'nomes');
        } else if (stepKey === 'quiz_teologico') {
          newTeologico = data.map((row: Record<string, unknown>) => ({
            id: `remote_teologico_${row.id}`,
            text: String(row.pergunta || ''),
            correctAnswer: String(row.resposta || ''),
            level: 'teologico',
          }));
        } else if (stepKey.startsWith('quiz_')) {
          const levelKey = stepKey.replace('quiz_', '');
          newQuiz[levelKey] = data.map((row: Record<string, unknown>) => ({
            id: `remote_${levelKey}_${row.id}`,
            text: String(row.pergunta || ''),
            correctAnswer: String(row.resposta || ''),
            level: levelKey,
          }));
        } else if (stepKey.startsWith('compartilhar_')) {
          const levelKey = stepKey.replace('compartilhar_', '');
          newCompartilhar[levelKey] = data.map((row: Record<string, unknown>) => ({
            id: `remote_${levelKey}_${row.id}`,
            text: String(row.pergunta || ''),
            level: levelKey,
          }));
        } else if (stepKey === 'torre') {
          newTorre = data.map((row: Record<string, unknown>) => {
            const classe = String(row.classe || 'facil');
            return {
              id: `remote_torre_${row.id}`,
              text: String(row.pergunta || ''),
              correctAnswer: String(row.resposta_correta || ''),
              wrongAnswers: [String(row.resposta_incorreta_1 || ''), String(row.resposta_incorreta_2 || ''), String(row.resposta_incorreta_3 || '')].filter(Boolean),
              bibleReference: String(row.referencia_biblica || ''),
              classe: (classe === 'media' ? 'medio' : classe) as 'facil' | 'medio' | 'dificil',
              level: classe,
            };
          });
        } else if (stepKey === 'who_am_i') {
          newWhoAmI = data.map((row: Record<string, unknown>) => {
            const hints: string[] = [];
            for (let i = 1; i <= 20; i++) {
              const dica = row[`dica_${i}`];
              if (dica && String(dica).trim().length > 0) {
                hints.push(String(dica).trim());
              }
            }
            return {
              id: `remote_whoami_${row.id}`,
              answer: String(row.palavra || ''),
              category: String(row.categoria || ''),
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
