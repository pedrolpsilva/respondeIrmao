import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import QuestionCard from '@/components/ui/QuestionCard';
import { Question } from '@/constants/questions';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { playSoundPreset } from '@/services/soundManager';
import { useRouter } from 'expo-router';
import { Check, Medal, X, Volume2, VolumeX } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GameScreen() {
  const router = useRouter();
  const {
    gameMode,
    players,
    config,
    currentPlayerIndex,
    playedQuestionIds,
    setPlayedQuestionIds,
    handleAnswer,
    nextTurn,
    quizQuestions,
    compartilharQuestions,
    setPlayers,
  } = useGame();

  // Core local states
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [animTrigger, setAnimTrigger] = useState<'slide' | 'flip' | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(config.timerBase);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Animated refs
  const timerProgress = useRef(new Animated.Value(1)).current;
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundEnabledRef = useRef(isSoundEnabled);

  useEffect(() => {
    soundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

  const currentPlayer = players[currentPlayerIndex];

  // Load relevant pool
  const getQuestionPool = useCallback(() => {
    const { level } = config;

    if (gameMode === 'quiz') {
      const m = quizQuestions['multidao'] || [];
      const d = quizQuestions['discipulo'] || [];
      const a = quizQuestions['apostolo'] || [];

      if (level === 'multidao') return m;
      if (level === 'discipulo') return [...m, ...d];
      if (level === 'apostolo') return [...m, ...d, ...a];

      return quizQuestions[level] || [];
    }

    const c = compartilharQuestions['comunhao'] || [];
    const t = compartilharQuestions['testemunho'] || [];
    const f = compartilharQuestions['confissao'] || [];

    if (level === 'comunhao') return c;
    if (level === 'testemunho') return [...c, ...t];
    if (level === 'confissao') return [...c, ...t, ...f];

    return compartilharQuestions[level] || [];
  }, [gameMode, config.level, quizQuestions, compartilharQuestions]);

  // Pull random new question
  const selectNextQuestion = useCallback((forceResetRepeated = false) => {
    const pool = getQuestionPool();
    if (pool.length === 0) return;

    let available = pool.filter(q => {
      const alreadyPlayedGlobal = playedQuestionIds.includes(q.id);
      const alreadyPlayedByMe = currentPlayer?.playedIds?.includes(q.id);

      if (forceResetRepeated) return true;
      if (!config.repeatOtherPlayers && alreadyPlayedGlobal) return false;
      if (!config.repeatSamePlayer && alreadyPlayedByMe) return false;
      return true;
    });

    if (available.length === 0) {
      available = pool;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    if (picked) {
      setCurrentQuestion(picked);
      setPlayedQuestionIds(prev => [...prev, picked.id]);
      setShowAnswer(false);

      setPlayers(prev => {
        const next = [...prev];
        const p = next[currentPlayerIndex];
        if (p) {
          next[currentPlayerIndex] = {
            ...p,
            playedIds: [...(p.playedIds || []), picked.id]
          };
        }
        return next;
      });
    }
  }, [getQuestionPool, playedQuestionIds, currentPlayerIndex, players, config]);

  // Initial load
  useEffect(() => {
    if (players.length === 0) {
      router.replace('/');
      return;
    }
    selectNextQuestion();
  }, []);


  const resetTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimeUp(false);
    setTimeRemaining(config.timerBase);
    timerProgress.setValue(1);

    if (gameMode === 'quiz') {
      Animated.timing(timerProgress, {
        toValue: 0,
        duration: config.timerBase * 1000,
        useNativeDriver: false,
      }).start();

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev == 11) {
            if (soundEnabledRef.current) playSoundPreset('tenSeconds');
          }
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimeUp(true);

            if (soundEnabledRef.current) playSoundPreset('timeOut');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    resetTimer();
  }, [currentPlayerIndex]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const checkWinCondition = () => {
    const winner = players.find(p => p.points >= config.targetPoints);
    if (winner) {
      router.replace('/results');
      return true;
    }
    return false;
  };

  const handleCorrect = () => {
    if (gameMode === 'quiz') {
      handleAnswer(true);
      setTimeout(() => {
        const isFinished = checkWinCondition();
        if (!isFinished) {
          setAnimTrigger('slide');
          selectNextQuestion();
          nextTurn();
        }
      }, 50);
    } else {
      setAnimTrigger('slide');
      selectNextQuestion();
      nextTurn();
    }
  };

  const handleWrong = () => {
    if (gameMode === 'quiz') {
      handleAnswer(false);
      setAnimTrigger('slide');
      selectNextQuestion();
      nextTurn();
    }
  };

  const handleSkip = () => {
    setAnimTrigger('flip');
    selectNextQuestion(true);
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points);
  }, [players]);

  const renderScoreboard = () => {
    return (
      <View style={styles.scoreboardContainer}>
        <Text style={styles.scoreboardLabel}>PLACAR ATUAL</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersScroll}>
          {sortedPlayers.map((p, i) => {
              const isActive = p.id === currentPlayer?.id;
              return (
                <View key={p.id} style={[
                  styles.playerCard,
                  // isActive && { backgroundColor: '#BEF264' }
                ]}>
                  <View style={styles.playerCardContent}>
                    {i <= 2 && (<Medal color={i == 0 ? '#F5B300' : i == 1 ? '#999999' : '#CD7F32'} />)}
                    <Text style={styles.playerName}>{p.name}</Text>
                    <Text style={styles.playerPoints}>{p.points}</Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  if (!currentPlayer || !currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <BrutalHeader
          showBack={false}
          backRoute
          title="PARTIDA"
          transparent={true}
          rightComponent={
            <Pressable
              onPress={() => setIsSoundEnabled(!isSoundEnabled)}
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

        {/* Scoreboard Area */}
        {gameMode === 'quiz' && renderScoreboard()}

        {/* Turn indicator and Timer bar combined */}
        <View style={styles.turnSection}>
          <View style={styles.turnBanner}>
            <Text style={styles.turnBannerText}>
              Vez de <Text style={styles.turnBannerName}>{currentPlayer.name}</Text>
            </Text>
          </View>
          {gameMode === 'quiz' && (
            <View style={styles.timerTrack}>
              <Animated.View style={[
                styles.timerBar,
                {
                  width: timerProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: Colors.accent2
                }
              ]} />
            </View>
          )}
        </View>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          levelLabel={showAnswer ? "RESPOSTA" : config.level}
          actionTrigger={animTrigger}
          showAnswerButton={gameMode === 'quiz'}
          timeUp={isTimeUp}
          showAnswer={showAnswer}
          onToggleAnswer={() => {
            setAnimTrigger('flip');
            setShowAnswer(!showAnswer);
          }}
        />

        {/* Actions Area */}
        <View style={styles.actionsContainer}>
          {gameMode === 'quiz' ? (
            <View style={styles.actionRow}>
              <View style={styles.halfAction}>
                <BrutalButton variant="surface" size="large" onPress={handleWrong}>
                  <X size={24} color={Colors.accent2} style={{ marginRight: 8 }} />
                  <Text style={styles.buttonLabel}>{!isTimeUp ? 'Errou' : 'Próximo'}</Text>
                </BrutalButton>
              </View>
              {!isTimeUp && (
                <View style={styles.halfAction}>
                  <BrutalButton variant="accent1" size="large" onPress={handleCorrect}>
                    <Check size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Acertou</Text>
                  </BrutalButton>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.actionRow}>
              <View style={styles.halfAction}>
                <BrutalButton variant="accent1" size="large" onPress={handleCorrect}>
                  <Check size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Próximo</Text>
                </BrutalButton>
              </View>
            </View>
          )}
        </View>
      </View>
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
    padding: Metrics.containerMargin,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  scoreboardContainer: {
    marginBottom: 20,
  },
  scoreboardLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.muted,
    marginBottom: 8,
    letterSpacing: 1,
  },
  playersScroll: {
    gap: 10,
    paddingRight: 20,
  },
  playerCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    // Neobrutalist shadow
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  playerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  playerName: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  playerPoints: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: Colors.text,
  },
  turnSection: {
    marginBottom: 20,
  },
  turnBanner: {
    backgroundColor: Colors.primary,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    // Neobrutalist shadow
    shadowColor: Colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  turnBannerText: {
    fontFamily: Fonts.body,
    fontSize: 18,
    color: '#FFFFFF',
  },
  turnBannerName: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: '#FFFFFF',
  },
  timerTrack: {
    height: 14,
    backgroundColor: '#E5E7EB', // Light purple/gray as per image
    borderWidth: 2,
    borderColor: Colors.border,
    marginTop: -2, // Pull up to overlap with banner shadow
    zIndex: 1,
  },
  timerBar: {
    height: '100%',
  },
  actionsContainer: {
    marginTop: 'auto',
  },
  answerButton: {
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfAction: {
    flex: 1,
  },
  buttonLabel: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
    color: Colors.text,
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
});
