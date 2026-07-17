import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import { Question, TORRE_QUESTIONS } from '@/constants/questions';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useModal } from '@/hooks/useModal';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { playSoundPreset, playClickSound } from '@/services/soundManager';
import { useRouter } from 'expo-router';
import { BookOpen, Check, Home, Play, RotateCcw, Trophy, Volume2, VolumeX, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  text: string;
  onPress: () => void;
  disabled?: boolean;
  bgColor: string;
  textColor: string;
}

function ChoiceButton({ text, onPress, disabled, bgColor, textColor }: ChoiceButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.choiceWrapper}>
      <View style={styles.choiceShadow} />
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
            transform: [
              { translateX: isPressed ? Metrics.shadowOffset : 0 },
              { translateY: isPressed ? Metrics.shadowOffset : 0 },
            ],
          },
        ]}
      >
        <Text style={[styles.choiceText, { color: textColor }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}

export default function TorreScreen() {
  const router = useRouter();
  const { torreQuestions } = useGame();
  const { showAlert } = useModal();
  const { isTabletLandscape } = useTabletLandscape();

  // Local States
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentRunQuestions, setCurrentRunQuestions] = useState<Question[]>([]);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

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

  // Initialize a new game run
  const startNewRun = useCallback(() => {
    const pool = torreQuestions && torreQuestions.length >= 100 ? torreQuestions : TORRE_QUESTIONS;

    // Partition by tier
    const easy = pool.filter((q) => q.level === 'facil');
    const medium = pool.filter((q) => q.level === 'media');
    const difficult = pool.filter((q) => q.level === 'dificil');
    const veryDifficult = pool.filter((q) => q.level === 'muito_dificil');

    // Shuffle each tier
    const shuffledEasy = shuffleArray(easy).slice(0, 30);
    const shuffledMedium = shuffleArray(medium).slice(0, 30);
    const shuffledDifficult = shuffleArray(difficult).slice(0, 30);
    const shuffledVeryDifficult = shuffleArray(veryDifficult).slice(0, 10);

    // Combine into a 100 question list
    const runQuestions = [
      ...shuffledEasy,
      ...shuffledMedium,
      ...shuffledDifficult,
      ...shuffledVeryDifficult,
    ];

    setCurrentRunQuestions(runQuestions);
    setCurrentLevel(1);
    setIsGameOver(false);
    setIsVictory(false);
    setupQuestion(runQuestions, 1);
  }, [torreQuestions, setupQuestion]);

  // Start on mount
  useEffect(() => {
    startNewRun();
  }, [startNewRun]);

  const currentQuestion = useMemo(() => {
    return currentRunQuestions[currentLevel - 1] || null;
  }, [currentRunQuestions, currentLevel]);

  // Determine current tier label and color
  const tierInfo = useMemo(() => {
    if (currentLevel <= 30) {
      return { label: 'FÁCIL', color: Colors.accent1 };
    } else if (currentLevel <= 60) {
      return { label: 'MÉDIA', color: Colors.warning };
    } else if (currentLevel <= 90) {
      return { label: 'DIFÍCIL', color: Colors.primary };
    } else {
      return { label: 'MUITO DIFÍCIL', color: Colors.accent2 };
    }
  }, [currentLevel]);

  const handleChoicePress = (choice: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedChoice(choice);
    setIsAnswered(true);

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
        setIsVictory(true);
      } else {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setupQuestion(currentRunQuestions, nextLevel);
      }
    } else {
      setIsGameOver(true);
    }
  };

  const handleExitPress = () => {
    showAlert({
      title: 'Sair da Torre?',
      message: 'Se sair agora perderá todo o progresso da sua subida.',
      confirmText: 'Sair',
      cancelText: 'Continuar Jogando',
      variant: 'danger',
      showCancel: true,
      onConfirm: () => {
        router.replace('/');
      },
    });
  };

  // Get choice styling variables dynamically
  const getChoiceStyles = (choice: string) => {
    if (!isAnswered || !currentQuestion) {
      return {
        bgColor: Colors.surface,
        textColor: Colors.text,
      };
    }

    const isCorrect = choice === currentQuestion.correctAnswer;
    const isSelected = choice === selectedChoice;

    if (isCorrect) {
      return {
        bgColor: Colors.accent1,
        textColor: '#FFFFFF',
      };
    }

    if (isSelected) {
      return {
        bgColor: Colors.accent2,
        textColor: '#FFFFFF',
      };
    }

    return {
      bgColor: '#E7E5E4', // disabled/faded out surface
      textColor: Colors.muted,
    };
  };

  // Render Game Over State
  if (isGameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.overlayInner}>
          <View style={styles.brutalCard}>
            <View style={[styles.cardHeader, { backgroundColor: Colors.accent2 }]}>
              <Text style={styles.cardHeaderTitle}>A TORRE CAIU!</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.overEmoji}>🏰💥</Text>
              <Text style={styles.overTitle}>Fim de Jogo</Text>
              <Text style={styles.overSubtitle}>
                Você subiu até a pergunta de nível:
              </Text>
              <View style={styles.levelBadgeBig}>
                <Text style={styles.levelBadgeBigText}>{currentLevel}</Text>
              </View>
              <Text style={styles.motivationText}>
                {"\"Guardei no coração a tua palavra para não pecar contra ti.\" - Salmos 119:11"}
              </Text>
            </View>
          </View>

          <View style={styles.overlayActions}>
            <BrutalButton variant="secondary" size="large" onPress={startNewRun}>
              <RotateCcw size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Tentar Novamente</Text>
            </BrutalButton>

            <BrutalButton variant="surface" size="large" onPress={() => router.replace('/')}>
              <Home size={24} color={Colors.text} style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: Colors.text }]}>Menu Principal</Text>
            </BrutalButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Render Victory State
  if (isVictory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.overlayInner}>
          <View style={styles.brutalCard}>
            <View style={[styles.cardHeader, { backgroundColor: Colors.warning }]}>
              <Text style={styles.cardHeaderTitle}>TORRE CONQUISTADA!</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.overEmoji}>🏆👑</Text>
              <Text style={styles.overTitle}>Parabéns, Irmão!</Text>
              <Text style={styles.overSubtitle}>
                Você subiu todos os 100 níveis da Torre de Babel e demonstrou um conhecimento bíblico espetacular!
              </Text>
              <View style={styles.trophyWrapper}>
                <Trophy size={64} color={Colors.warning} />
              </View>
              <Text style={styles.motivationText}>
                {"\"Lâmpada para os meus pés é tua palavra e luz, para o meu caminho.\" - Salmos 119:105"}
              </Text>
            </View>
          </View>

          <View style={styles.overlayActions}>
            <BrutalButton variant="accent1" size="large" onPress={startNewRun}>
              <Play size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Jogar Novamente</Text>
            </BrutalButton>

            <BrutalButton variant="surface" size="large" onPress={() => router.replace('/')}>
              <Home size={24} color={Colors.text} style={{ marginRight: 10 }} />
              <Text style={[styles.buttonLabel, { color: Colors.text }]}>Menu Principal</Text>
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

            let bg = '#FFFFFF';
            let txt = '#000000';
            if (isCurrent) {
              bg = Colors.primary;
              txt = '#FFFFFF';
            } else if (isPassed) {
              bg = '#22C55E';
              txt = '#FFFFFF';
            }

            return (
              <View
                key={floor}
                style={[
                  styles.mapSquare,
                  { backgroundColor: bg },
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
    <SafeAreaView style={styles.container}>
      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
        <View style={styles.tabletWrapper}>
          <BrutalHeader
            showBack={false}
            backRoute
            title="TORRE DE BABEL"
            transparent={true}
            rightComponent={
              <Pressable
                onPress={() => {
                  playClickSound();
                  setIsSoundEnabled(!isSoundEnabled);
                }}
                style={styles.soundButton}
              >
                {isSoundEnabled ? (
                  <Volume2 color={Colors.text} size={24} />
                ) : (
                  <VolumeX color={Colors.muted} size={24} />
                )}
              </Pressable>
            }
          />
          {renderFloorMap()}
          <View style={styles.tabletRow}>
            {/* Left: level progress + action */}
            <View style={styles.tabletLeft}>
              <View style={styles.progressContainer}>
                <View style={styles.levelRow}>
                  <Text style={styles.levelProgressLabel}>NÍVEL:</Text>
                  <Text style={styles.levelNumber}>{currentLevel} / 100</Text>
                  <View style={[styles.tierBadge, { backgroundColor: tierInfo.color }]}>
                    <Text style={styles.tierBadgeText}>{tierInfo.label}</Text>
                  </View>
                </View>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${currentLevel}%`, backgroundColor: tierInfo.color },
                    ]}
                  />
                </View>
              </View>
              {isAnswered && currentQuestion?.bibleReference && (
                <View style={styles.referenceContainer}>
                  <BookOpen size={18} color={Colors.warning} style={{ marginRight: 6 }} />
                  <Text style={styles.referenceText}>
                    Refêrencia: {currentQuestion.bibleReference}
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
                  <View style={styles.cardShadow} />
                  <View style={styles.cardFront}>
                    <Text style={styles.questionText}>{currentQuestion?.text}</Text>
                  </View>
                </View>
                <View style={styles.choicesGridTablet}>
                  {shuffledChoices.map((choice, i) => {
                    const { bgColor, textColor } = getChoiceStyles(choice);
                    return (
                      <View key={`choice_${i}`} style={styles.choiceGridItem}>
                        <ChoiceButton
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
            showBack={false}
            backRoute
            title="TORRE DE BABEL"
            transparent={true}
            rightComponent={
              <Pressable
                onPress={() => {
                  playClickSound();
                  setIsSoundEnabled(!isSoundEnabled);
                }}
                style={styles.soundButton}
              >
                {isSoundEnabled ? (
                  <Volume2 color={Colors.text} size={24} />
                ) : (
                  <VolumeX color={Colors.muted} size={24} />
                )}
              </Pressable>
            }
          />
          {renderFloorMap()}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.progressContainer}>
              <View style={styles.levelRow}>
                <Text style={styles.levelProgressLabel}>NÍVEL:</Text>
                <Text style={styles.levelNumber}>{currentLevel} / 100</Text>
                <View style={[styles.tierBadge, { backgroundColor: tierInfo.color }]}>
                  <Text style={styles.tierBadgeText}>{tierInfo.label}</Text>
                </View>
              </View>

              <View style={styles.progressBarTrack}>
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
            </View>

            <View style={styles.cardWrapper}>
              <View style={styles.cardShadow} />
              <View style={styles.cardFront}>
                <Text style={styles.questionText}>
                  {currentQuestion?.text}
                </Text>

                {isAnswered && currentQuestion?.bibleReference && (
                  <View style={styles.referenceContainer}>
                    <BookOpen size={18} color={Colors.warning} style={{ marginRight: 6 }} />
                    <Text style={styles.referenceText}>
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginVertical: 16,
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    shadowColor: Colors.border,
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
    color: Colors.muted,
    marginRight: 6,
  },
  levelNumber: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.text,
    marginRight: 'auto',
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
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
    borderColor: Colors.border,
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
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  cardFront: {
    zIndex: 2,
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
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
    color: Colors.text,
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF9C3', // Light yellow accent for scripture reference
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  referenceText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
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
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    overflow: 'hidden',
    shadowColor: Colors.border,
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
    borderColor: Colors.border,
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
    color: Colors.text,
    marginBottom: 8,
  },
  overSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 12,
  },
  levelBadgeBig: {
    backgroundColor: Colors.warning,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: 20,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: Colors.border,
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
    borderColor: Colors.border,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  motivationText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
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
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    zIndex: 1,
  },
  choiceFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    minHeight: 56,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    textAlign: 'center',
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
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.border,
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
});
