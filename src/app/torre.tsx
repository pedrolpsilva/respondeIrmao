import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import { Question, TORRE_QUESTIONS } from '@/constants/questions';
import { Fonts, Metrics } from '@/constants/theme';
import { OPTION_LETTERS, TORRE_LEVELS, QuestionClasse } from '@/constants/torreTypes';
import { useGame } from '@/hooks/useGameContext';
import { useGameInterstitial } from '@/hooks/useGameInterstitial';
import { useModal } from '@/hooks/useModal';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import { playSoundPreset, playClickSound } from '@/services/soundManager';
import { useRouter } from 'expo-router';
import { BookOpen, Check, Clock, Home, Play, RotateCcw, Trophy, Volume2, VolumeX, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface ChoiceButtonProps {
  letter: string;
  text: string;
  onPress: () => void;
  disabled?: boolean;
  bgColor: string;
  textColor: string;
}

function ChoiceButton({ letter, text, onPress, disabled, bgColor, textColor }: ChoiceButtonProps) {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.choiceWrapper}>
      <View style={[styles.choiceShadow, { backgroundColor: theme.border }]} />
      <Pressable
        onPressIn={() => !disabled && setIsPressed(true)}
        onPressOut={() => !disabled && setIsPressed(false)}
        onPress={() => {
          if (!disabled) {
            Vibration.vibrate(10);
            playClickSound();
            onPress();
          }
        }}
        disabled={disabled}
        style={[
          styles.choiceFront,
          {
            backgroundColor: bgColor,
            borderColor: theme.border,
            transform: [
              { translateX: isPressed ? Metrics.shadowOffset : 0 },
              { translateY: isPressed ? Metrics.shadowOffset : 0 },
            ],
          },
        ]}
      >
        <View style={styles.choiceInner}>
          <View style={styles.letterBadge}>
            <Text style={[styles.letterText, { color: textColor }]}>{letter}</Text>
          </View>
          <Text style={[styles.choiceText, { color: textColor, flex: 1 }]}>
            {text}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default function TorreScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { showAdThenNavigate } = useGameInterstitial();
  const { torreQuestions, torreSelectedLevel } = useGame();
  const { showAlert } = useModal();
  const { isTablet, isTabletLandscape } = useTabletLandscape();

  const handleExitTorre = () => {
    stopTimer();
    showAdThenNavigate(() => {
      router.replace('/');
    });
  };

  // Resolve current level config
  const levelConfig = useMemo(
    () => TORRE_LEVELS.find((l) => l.key === torreSelectedLevel) || TORRE_LEVELS[0],
    [torreSelectedLevel]
  );

  // Local States
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentRunQuestions, setCurrentRunQuestions] = useState<Question[]>([]);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Set up details for the current question
  const setupQuestion = useCallback((questions: Question[], level: number) => {
    const question = questions[level - 1];
    if (!question) return;

    const choices = [
      question.correctAnswer || '',
      ...(question.wrongAnswers || []),
    ].filter(Boolean);

    // Shuffle options so correct answer doesn't stay aligned
    setShuffledChoices(shuffleArray(choices));
    setSelectedChoice(null);
    setIsAnswered(false);
  }, []);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start countdown timer for timed levels
  const startTimer = useCallback((seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRemaining(seconds);
    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // Handle timer expiration — auto game-over
  useEffect(() => {
    if (timerRemaining === 0 && !isAnswered && !isGameOver && !isVictory) {
      setIsAnswered(true);
      setSelectedChoice(null);
      Vibration.vibrate([0, 100, 50, 150]);
      if (isSoundEnabled) {
        playSoundPreset('timeOut');
      }
      // Auto-trigger game over after a short delay
      setTimeout(() => {
        setIsGameOver(true);
      }, 1500);
    }
  }, [timerRemaining, isAnswered, isGameOver, isVictory, isSoundEnabled]);

  // Initialize a new game run
  const startNewRun = useCallback(() => {
    const pool = torreQuestions && torreQuestions.length >= 100 ? torreQuestions : TORRE_QUESTIONS;
    const dist = levelConfig.distribution;

    // Partition by classe (with fallback to level for local fallback questions)
    const easyPool = pool.filter((q) => q.classe === 'facil' || (!q.classe && q.level === 'facil'));
    const mediumPool = pool.filter((q) => q.classe === 'medio' || (!q.classe && (q.level === 'media' || q.level === 'medio')));
    const hardPool = pool.filter((q) => q.classe === 'dificil' || (!q.classe && (q.level === 'dificil' || q.level === 'muito_dificil')));

    // Shuffle and pick the required amount for this level
    const pickedEasy = shuffleArray(easyPool).slice(0, dist.facil);
    const pickedMedium = shuffleArray(mediumPool).slice(0, dist.medio);
    const pickedHard = shuffleArray(hardPool).slice(0, dist.dificil);

    // Combine: easy first, then medium, then hard (progressive difficulty within a run)
    const runQuestions = [
      ...shuffleArray(pickedEasy),
      ...shuffleArray(pickedMedium),
      ...shuffleArray(pickedHard),
    ];

    setCurrentRunQuestions(runQuestions);
    setCurrentLevel(1);
    setIsGameOver(false);
    setIsVictory(false);
    setTimerRemaining(null);
    stopTimer();
    setupQuestion(runQuestions, 1);

    // Start timer for timed levels
    if (levelConfig.timerSeconds) {
      startTimer(levelConfig.timerSeconds);
    }
  }, [torreQuestions, setupQuestion, levelConfig, startTimer, stopTimer]);

  // Start on mount
  useEffect(() => {
    startNewRun();
  }, [startNewRun]);

  const currentQuestion = useMemo(() => {
    return currentRunQuestions[currentLevel - 1] || null;
  }, [currentRunQuestions, currentLevel]);

  // Determine current question classe label and color
  const tierInfo = useMemo(() => {
    const classe = currentQuestion?.classe;
    if (classe === 'dificil') {
      return { label: 'DIFÍCIL', color: theme.accent2 };
    } else if (classe === 'medio') {
      return { label: 'MÉDIA', color: theme.warning };
    }
    return { label: 'FÁCIL', color: theme.accent1 };
  }, [currentQuestion, theme]);

  const handleChoicePress = (choice: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedChoice(choice);
    setIsAnswered(true);
    stopTimer();

    const isCorrect = choice === currentQuestion.correctAnswer;

    if (isCorrect) {
      Vibration.vibrate(50); // short positive vibrate
    } else {
      // wrong answer -> game-over trigger
      Vibration.vibrate([0, 100, 50, 150]); // pattern vibration
      if (isSoundEnabled) {
        playSoundPreset('timeOut');
      }
    }
  };

  const handleNextPress = () => {
    if (!currentQuestion) return;

    const isCorrect = selectedChoice === currentQuestion.correctAnswer;

    if (isCorrect) {
      if (currentLevel === 100) {
        stopTimer();
        setIsVictory(true);
      } else {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setupQuestion(currentRunQuestions, nextLevel);
        // Restart timer for the next question
        if (levelConfig.timerSeconds) {
          startTimer(levelConfig.timerSeconds);
        }
      }
    } else {
      stopTimer();
      setIsGameOver(true);
    }
  };

  // Get choice styling variables dynamically
  const getChoiceStyles = (choice: string) => {
    if (!isAnswered || !currentQuestion) {
      return {
        bgColor: theme.surface,
        textColor: theme.text,
      };
    }

    const isCorrect = choice === currentQuestion.correctAnswer;
    const isSelected = choice === selectedChoice;

    if (isCorrect) {
      return {
        bgColor: theme.accent1,
        textColor: '#FFFFFF',
      };
    }

    if (isSelected) {
      return {
        bgColor: theme.accent2,
        textColor: '#FFFFFF',
      };
    }

    return {
      bgColor: theme.background,
      textColor: theme.muted,
    };
  };

  // Render Game Over State
  if (isGameOver) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.overlayInner}>
          <View style={[styles.brutalCard, { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border }]}>
            <View style={[styles.cardHeader, { backgroundColor: theme.accent2, borderColor: theme.border }]}>
              <Text style={styles.cardHeaderTitle}>A TORRE CAIU!</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.overEmoji}>🏰💥</Text>
              <Text style={[styles.overTitle, { color: theme.text }]}>Fim de Jogo</Text>
              <Text style={[styles.overSubtitle, { color: theme.muted }]}>
                Você subiu até a pergunta de nível:
              </Text>
              <View style={[styles.levelBadgeBig, { backgroundColor: theme.warning, borderColor: theme.border }]}>
                <Text style={styles.levelBadgeBigText}>{currentLevel}</Text>
              </View>
              <Text style={[styles.motivationText, { color: theme.muted }]}>
                {"\"Guardei no coração a tua palavra para não pecar contra ti.\" - Salmos 119:11"}
              </Text>
            </View>
          </View>

          <View style={styles.overlayActions}>
            <BrutalButton variant="secondary" size="large" onPress={() => showAdThenNavigate(() => startNewRun())}>
              <RotateCcw size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Tentar Novamente</Text>
            </BrutalButton>

            <BrutalButton variant="surface" size="large" onPress={() => showAdThenNavigate(() => router.replace('/'))}>
              <Home size={24} color={theme.text} style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: theme.text }]}>Menu Principal</Text>
            </BrutalButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Render Victory State
  if (isVictory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.overlayInner}>
          <View style={[styles.brutalCard, { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border }]}>
            <View style={[styles.cardHeader, { backgroundColor: theme.warning, borderColor: theme.border }]}>
              <Text style={styles.cardHeaderTitle}>TORRE CONQUISTADA!</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.overEmoji}>🏆👑</Text>
              <Text style={[styles.overTitle, { color: theme.text }]}>Parabéns, Irmão!</Text>
              <Text style={[styles.overSubtitle, { color: theme.muted }]}>
                Você subiu todos os 100 níveis da Torre de Babel e demonstrou um conhecimento bíblico espetacular!
              </Text>
              <View style={[styles.trophyWrapper, { borderColor: theme.border }]}>
                <Trophy size={64} color={theme.warning} />
              </View>
              <Text style={[styles.motivationText, { color: theme.muted }]}>
                {"\"Lâmpada para os meus pés é tua palavra e luz, para o meu caminho.\" - Salmos 119:105"}
              </Text>
            </View>
          </View>

          <View style={styles.overlayActions}>
            <BrutalButton variant="accent1" size="large" onPress={() => showAdThenNavigate(() => startNewRun())}>
              <Play size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Jogar Novamente</Text>
            </BrutalButton>

            <BrutalButton variant="surface" size="large" onPress={() => showAdThenNavigate(() => router.replace('/'))}>
              <Home size={24} color={theme.text} style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: theme.text }]}>Menu Principal</Text>
            </BrutalButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const renderFloorMap = () => {
    const floors = Array.from({ length: 100 }, (_, i) => i + 1);

    return (
      <View style={styles.mapContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mapScrollContent}
          ref={(ref) => {
            if (ref && currentLevel > 4) {
              ref.scrollTo({ x: (currentLevel - 4) * 40, animated: true });
            }
          }}
        >
          {floors.map((floor) => {
            const isCurrent = floor === currentLevel;
            const isPassed = floor < currentLevel;

            let bg = theme.surface;
            let txt = theme.text;
            if (isCurrent) {
              bg = theme.primary;
              txt = '#FFFFFF';
            } else if (isPassed) {
              bg = theme.accent1;
              txt = '#FFFFFF';
            }

            return (
              <View
                key={floor}
                style={[
                  styles.mapSquare,
                  { backgroundColor: bg, borderColor: theme.border, shadowColor: theme.border },
                  isCurrent && styles.mapSquareCurrent,
                ]}
              >
                <Text style={[styles.mapSquareText, { color: txt }, isCurrent && styles.mapSquareTextCurrent]}>
                  {floor}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const nextButton = (
    <View style={styles.actionContainer}>
      <BrutalButton
        variant={selectedChoice === currentQuestion?.correctAnswer ? 'accent1' : 'accent2'}
        size="large"
        onPress={handleNextPress}
      >
        {selectedChoice === currentQuestion?.correctAnswer ? (
          <>
            <Check size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>
              {currentLevel === 100 ? 'Finalizar Torre' : 'Subir a Torre ➔'}
            </Text>
          </>
        ) : (
          <>
            <X size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Ver Resultado</Text>
          </>
        )}
      </BrutalButton>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
        <View style={styles.tabletWrapper}>
          <BrutalHeader
            showBack={true}
            backRoute={true}
            onBack={handleExitTorre}
            title={`TORRE — ${levelConfig.label}`}
            transparent={true}
            rightComponent={
              <Pressable
                onPress={() => {
                  playClickSound();
                  setIsSoundEnabled(!isSoundEnabled);
                }}
                style={[styles.soundButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              >
                {isSoundEnabled ? (
                  <Volume2 color={theme.text} size={24} />
                ) : (
                  <VolumeX color={theme.muted} size={24} />
                )}
              </Pressable>
            }
          />
          {renderFloorMap()}
          <View style={styles.tabletRow}>
            {/* Left: level progress + action */}
            <View style={styles.tabletLeft}>
              <View style={[styles.progressContainer, { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border }]}>
                <View style={styles.levelRow}>
                  <Text style={[styles.levelProgressLabel, { color: theme.muted }]}>NÍVEL:</Text>
                  <Text style={[styles.levelNumber, { color: theme.text }]}>{currentLevel} / 100</Text>
                  <View style={[styles.tierBadge, { backgroundColor: tierInfo.color, borderColor: theme.border }]}>
                    <Text style={styles.tierBadgeText}>{tierInfo.label}</Text>
                  </View>
                </View>
                <View style={[styles.progressBarTrack, { borderColor: theme.border }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${currentLevel}%`, backgroundColor: tierInfo.color },
                    ]}
                  />
                </View>
                {levelConfig.timerSeconds && timerRemaining !== null && (
                  <View style={styles.timerContainer}>
                    <Clock size={16} color={timerRemaining <= 10 ? theme.accent2 : theme.text} />
                    <Text style={[
                      styles.timerText,
                      { color: theme.text },
                      timerRemaining <= 10 && { color: theme.accent2, fontSize: 18 },
                    ]}>
                      {Math.floor(timerRemaining / 60)}:{String(timerRemaining % 60).padStart(2, '0')}
                    </Text>
                  </View>
                )}
              </View>
              {isAnswered && currentQuestion?.bibleReference && (
                <View style={[styles.referenceContainer, { borderColor: theme.border }]}>
                  <BookOpen size={18} color={theme.warning} style={{ marginRight: 6 }} />
                  <Text style={[styles.referenceText, { color: theme.text }]}>
                    Referência: {currentQuestion.bibleReference}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }} />
              {isAnswered && nextButton}
            </View>
            {/* Right: question card + choices grid 2x2 */}
            <View style={styles.tabletRight}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.cardWrapper}>
                  <View style={[styles.cardShadow, { backgroundColor: theme.border }]} />
                  <View style={[styles.cardFront, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.questionText, { color: theme.text }]}>{currentQuestion?.text}</Text>
                  </View>
                </View>
                <View style={styles.choicesGridTablet}>
                  {shuffledChoices.map((choice, i) => {
                    const { bgColor, textColor } = getChoiceStyles(choice);
                    return (
                      <View key={`choice_${i}`} style={styles.choiceGridItem}>
                        <ChoiceButton
                          letter={OPTION_LETTERS[i] || ''}
                          text={choice}
                          bgColor={bgColor}
                          textColor={textColor}
                          onPress={() => handleChoicePress(choice)}
                          disabled={isAnswered}
                        />
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      ) : (
        // ── PORTRAIT: original layout ────────────────────────────────────────
        <View style={styles.inner}>
          <BrutalHeader
            showBack={true}
            backRoute={true}
            onBack={handleExitTorre}
            title={`TORRE — ${levelConfig.label}`}
            transparent={true}
            rightComponent={
              <Pressable
                onPress={() => {
                  playClickSound();
                  setIsSoundEnabled(!isSoundEnabled);
                }}
                style={[styles.soundButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              >
                {isSoundEnabled ? (
                  <Volume2 color={theme.text} size={24} />
                ) : (
                  <VolumeX color={theme.muted} size={24} />
                )}
              </Pressable>
            }
          />
          {renderFloorMap()}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTabletPortrait]}>
            <View style={[styles.progressContainer, { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border }]}>
              <View style={styles.levelRow}>
                <Text style={[styles.levelProgressLabel, { color: theme.muted }]}>NÍVEL:</Text>
                <Text style={[styles.levelNumber, { color: theme.text }]}>{currentLevel} / 100</Text>
                <View style={[styles.tierBadge, { backgroundColor: tierInfo.color, borderColor: theme.border }]}>
                  <Text style={styles.tierBadgeText}>{tierInfo.label}</Text>
                </View>
              </View>

              <View style={[styles.progressBarTrack, { borderColor: theme.border }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${currentLevel}%`,
                      backgroundColor: tierInfo.color,
                    },
                  ]}
                />
              </View>
              {levelConfig.timerSeconds && timerRemaining !== null && (
                <View style={styles.timerContainer}>
                  <Clock size={16} color={timerRemaining <= 10 ? theme.accent2 : theme.text} />
                  <Text style={[
                    styles.timerText,
                    { color: theme.text },
                    timerRemaining <= 10 && { color: theme.accent2, fontSize: 18 },
                  ]}>
                    {Math.floor(timerRemaining / 60)}:{String(timerRemaining % 60).padStart(2, '0')}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cardWrapper}>
              <View style={[styles.cardShadow, { backgroundColor: theme.border }]} />
              <View style={[styles.cardFront, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.questionText, { color: theme.text }]}>
                  {currentQuestion?.text}
                </Text>

                {isAnswered && currentQuestion?.bibleReference && (
                  <View style={[styles.referenceContainer, { borderColor: theme.border }]}>
                    <BookOpen size={18} color={theme.warning} style={{ marginRight: 6 }} />
                    <Text style={[styles.referenceText, { color: theme.text }]}>
                      Referência: {currentQuestion.bibleReference}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.choicesContainer}>
              {shuffledChoices.map((choice, i) => {
                const { bgColor, textColor } = getChoiceStyles(choice);
                return (
                  <ChoiceButton
                    key={`choice_${i}`}
                    letter={OPTION_LETTERS[i] || ''}
                    text={choice}
                    bgColor={bgColor}
                    textColor={textColor}
                    disabled={isAnswered}
                    onPress={() => handleChoicePress(choice)}
                  />
                );
              })}
            </View>
          </ScrollView>

          {isAnswered && nextButton}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Metrics.containerMargin,
    paddingBottom: 20,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  soundButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginVertical: 16,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelProgressLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginRight: 6,
  },
  levelNumber: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    marginRight: 'auto',
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
  },
  tierBadgeText: {
    fontFamily: Fonts.heading,
    fontSize: 12,
    color: '#FFFFFF',
  },
  progressBarTrack: {
    height: 16,
    backgroundColor: '#E7E5E4',
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  cardWrapper: {
    position: 'relative',
    width: '100%',
    marginVertical: 16,
  },
  cardShadow: {
    position: 'absolute',
    top: Metrics.shadowOffset * 1.5,
    left: Metrics.shadowOffset * 1.5,
    right: -Metrics.shadowOffset * 1.5,
    bottom: -Metrics.shadowOffset * 1.5,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  cardFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 24,
    minHeight: 180,
    justifyContent: 'center',
  },
  questionText: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 34,
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  referenceText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  choicesContainer: {
    marginTop: 12,
    gap: 8,
  },
  actionContainer: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  buttonLabel: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
  },
  overlayInner: {
    flex: 1,
    padding: Metrics.containerMargin,
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  brutalCard: {
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    overflow: 'hidden',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    marginBottom: 32,
  },
  cardHeader: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: Metrics.borderWidth,
  },
  cardHeaderTitle: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardBody: {
    padding: 24,
    alignItems: 'center',
  },
  overEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  overTitle: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    marginBottom: 8,
  },
  overSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  levelBadgeBig: {
    borderWidth: Metrics.borderWidth,
    borderRadius: 20,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  levelBadgeBigText: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: '#FFFFFF',
  },
  trophyWrapper: {
    backgroundColor: '#FEF9C3',
    borderWidth: Metrics.borderWidth,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  motivationText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  overlayActions: {
    gap: 16,
    width: '100%',
  },
  // ── Tablet Landscape ───────────────────────────────────────────────────
  tabletWrapper: {
    flex: 1,
    padding: Metrics.containerMargin,
    width: '100%',
    paddingBottom: 20,
  },
  tabletRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  tabletLeft: {
    flex: 4,
    flexDirection: 'column',
  },
  tabletRight: {
    flex: 6,
    flexDirection: 'column',
  },
  choicesGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  choiceGridItem: {
    width: '48%',
  },
  // ── Choice Buttons ─────────────────────────────────────────────────────
  choiceWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
  },
  choiceShadow: {
    position: 'absolute',
    top: Metrics.shadowOffset,
    left: Metrics.shadowOffset,
    right: -Metrics.shadowOffset,
    bottom: -Metrics.shadowOffset,
    borderRadius: Metrics.radiusButton,
    zIndex: 1,
  },
  choiceFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusButton,
    minHeight: 56,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  letterBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  letterText: {
    fontFamily: Fonts.heading,
    fontSize: 16,
  },
  choiceText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    textAlign: 'left',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  timerText: {
    fontFamily: Fonts.heading,
    fontSize: 16,
  },
  // ── Path Map ───────────────────────────────────────────────────────────
  mapContainer: {
    height: 52,
    marginBottom: 16,
    width: '100%',
  },
  mapScrollContent: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  mapSquare: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  mapSquareCurrent: {
    width: 42,
    height: 42,
    borderRadius: 8,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
  },
  mapSquareText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  mapSquareTextCurrent: {
    fontSize: 16,
  },
  scrollContentTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});
