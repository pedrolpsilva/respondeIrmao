import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import QuestionCard from '@/components/ui/QuestionCard';
import { Question } from '@/constants/questions';
import { Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useGameInterstitial } from '@/hooks/useGameInterstitial';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import { playSoundPreset, stopAllSounds, playClickSound } from '@/services/soundManager';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Check, Medal, Volume2, VolumeX, X, Play, Pause } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

export default function GameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { showAdThenNavigate, adLoaded } = useGameInterstitial();
  const { isTablet, isTabletLandscape } = useTabletLandscape();
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
    teologicoQuestions,
    setPlayers,
  } = useGame();

  // Core local states
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [animTrigger, setAnimTrigger] = useState<'slide' | 'flip' | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(config.timerBase);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  // Animated refs
  const timerProgress = useRef(new Animated.Value(1)).current;
  const timerColor = useMemo(() => {
    return timerProgress.interpolate({
      inputRange: [0, 0.33, 0.34, 0.66, 0.67, 1.0],
      outputRange: ['#EF4444', '#EF4444', '#FBBF24', '#FBBF24', '#22C55E', '#22C55E'],
    });
  }, [timerProgress]);
  const timerIntervalRef = useRef<any>(null);
  const soundEnabledRef = useRef(isSoundEnabled);

  useEffect(() => {
    soundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

  const currentPlayer = players[currentPlayerIndex];

  // Load relevant pool
  const getQuestionPool = useCallback(() => {
    const { level, includeLowerLevels } = config;

    if (gameMode === 'teologico') {
      return (teologicoQuestions || []).map(q => ({ ...q, level: 'teologico' }));
    }

    if (gameMode === 'quiz') {
      const m = (quizQuestions['multidao'] || []).map(q => ({ ...q, level: q.level || 'multidao' }));
      const d = (quizQuestions['discipulo'] || []).map(q => ({ ...q, level: q.level || 'discipulo' }));
      const a = (quizQuestions['apostolo'] || []).map(q => ({ ...q, level: q.level || 'apostolo' }));

      if (level === 'multidao') return m;
      if (level === 'discipulo') return includeLowerLevels ? [...m, ...d] : d;
      if (level === 'apostolo') return includeLowerLevels ? [...m, ...d, ...a] : a;

      return (quizQuestions[level] || []).map(q => ({ ...q, level: q.level || level }));
    }

    const c = (compartilharQuestions['comunhao'] || []).map(q => ({ ...q, level: q.level || 'comunhao' }));
    const t = (compartilharQuestions['testemunho'] || []).map(q => ({ ...q, level: q.level || 'testemunho' }));
    const f = (compartilharQuestions['confissao'] || []).map(q => ({ ...q, level: q.level || 'confissao' }));

    if (level === 'comunhao') return c;
    if (level === 'testemunho') return includeLowerLevels ? [...c, ...t] : t;
    if (level === 'confissao') return includeLowerLevels ? [...c, ...t, ...f] : f;

    return (compartilharQuestions[level] || []).map(q => ({ ...q, level: q.level || level }));
  }, [gameMode, config.level, config.includeLowerLevels, quizQuestions, compartilharQuestions, teologicoQuestions]);

  // Pull random new question
  const selectNextQuestion = useCallback((forceResetRepeated = false) => {
    const pool = getQuestionPool();
    if (pool.length === 0) return;

    const playedGlobalSet = new Set(playedQuestionIds);
    const playedByMeSet = new Set(currentPlayer?.playedIds || []);

    let available = pool.filter(q => {
      const alreadyPlayedGlobal = playedGlobalSet.has(q.id);
      const alreadyPlayedByMe = playedByMeSet.has(q.id);

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

  const handleCurrentSound = async () => {
    await playSoundPreset('tenSeconds');
  }

  const stopCurrentSound = () => {
    stopAllSounds();
  };

  const resetTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimeUp(false);
    setIsTimerPaused(false);
    setTimeRemaining(config.timerBase);
    timerProgress.setValue(1);

    if (gameMode === 'quiz' || gameMode === 'teologico') {
      Animated.timing(timerProgress, {
        toValue: 0,
        duration: config.timerBase * 1000,
        useNativeDriver: false,
      }).start();

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev == 11) {
            if (soundEnabledRef.current) handleCurrentSound()
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

  const toggleTimerPause = () => {
    if (gameMode !== 'quiz' && gameMode !== 'teologico') return;

    if (isTimerPaused) {
      // Resume timer
      setIsTimerPaused(false);
      
      Animated.timing(timerProgress, {
        toValue: 0,
        duration: timeRemaining * 1000,
        useNativeDriver: false,
      }).start();

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev == 11) {
            if (soundEnabledRef.current) handleCurrentSound()
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
    } else {
      // Pause timer
      setIsTimerPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerProgress.stopAnimation();
      stopAllSounds();
    }
  };

  useEffect(() => {
    resetTimer();
  }, [currentPlayerIndex]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      stopAllSounds();
    };
  }, []);

  const checkWinCondition = () => {
    const winner = players.find(p => p.points >= config.targetPoints);
    if (winner) {
      console.log(`[Game] 🏆 Condição de vitória atingida! Vencedor: ${winner.name} (${winner.points} pontos)`);
      stopAllSounds();
      showAdThenNavigate(() => {
        console.log('[Game] ✅ Navegando para /results após o anúncio');
        router.replace('/results');
      });
      return true;
    }
    return false;
  };

  const handleExitGame = () => {
    stopAllSounds();
    showAdThenNavigate(() => {
      router.replace('/');
    });
  };

  const handleCorrect = () => {
    stopCurrentSound()

    if (gameMode === 'quiz' || gameMode === 'teologico') {
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
    stopCurrentSound()

    if (gameMode === 'quiz' || gameMode === 'teologico') {
      handleAnswer(false);
      setAnimTrigger('slide');
      selectNextQuestion();
      nextTurn();
    }
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points);
  }, [players]);

  const renderScoreboard = () => {
    return (
      <View style={styles.scoreboardContainer}>
        <Text style={[styles.scoreboardLabel, { color: theme.textSecondary }]}>PLACAR ATUAL</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersScroll}>
          {sortedPlayers.map((p, i) => {
            const isActive = p.id === currentPlayer?.id;
            return (
              <View key={p.id} style={[
                styles.playerCard,
                { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border },
                isActive && { borderColor: theme.primary, backgroundColor: theme.background }
              ]}>
                <View style={styles.playerCardContent}>
                  {p.photoUri ? (
                    <Image source={{ uri: p.photoUri }} style={[styles.scoreboardAvatar, { borderColor: theme.border }]} />
                  ) : (
                    <View style={[styles.scoreboardAvatarPlaceholder, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <Text style={[styles.scoreboardAvatarPlaceholderText, { color: theme.text }]}>{p.name.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  {i <= 2 && (<Medal color={i == 0 ? '#F5B300' : i == 1 ? '#999999' : '#CD7F32'} size={16} />)}
                  <Text style={[styles.playerName, { color: theme.text }]}>{p.name}</Text>
                  <Text style={[styles.playerPoints, { color: theme.text }]}>{p.points}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  if (!currentPlayer || !currentQuestion) return null;

  const actionButtons = (
    <View style={styles.actionsContainer}>
      {(gameMode === 'quiz' || gameMode === 'teologico') ? (
        <View style={styles.actionRow}>
          <View style={styles.halfAction}>
            <BrutalButton variant="surface" size="large" onPress={handleWrong}>
              <X size={24} color={theme.accent2} style={{ marginRight: 8 }} />
              <Text style={[styles.buttonLabel, { color: theme.text }]}>{!isTimeUp ? 'Errou' : 'Próximo'}</Text>
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
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
        <View style={styles.tabletWrapper}>
          <BrutalHeader
            showBack={true}
            backRoute={true}
            onBack={handleExitGame}
            title="PARTIDA"
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
          <View style={styles.tabletRow}>
            {/* Left column: scoreboard + turn info + timer */}
            <View style={styles.tabletLeft}>
              {(gameMode === 'quiz' || gameMode === 'teologico') && renderScoreboard()}
              <View style={styles.turnSection}>
                {/* Row wrapping both banner and timer */}
                <View style={styles.turnBannerRow}>
                  {/* Left side: Blue banner container */}
                  <View style={[styles.turnBannerLeft, { flex: (gameMode === 'quiz' || gameMode === 'teologico') ? 0.75 : 1 }]}>
                    <View style={styles.playerInfoRow}>
                      {/* Player Avatar / Placeholder */}
                      {currentPlayer.photoUri ? (
                        <TouchableOpacity
                          onPress={() => setPhotoModalVisible(true)}
                          activeOpacity={0.8}
                        >
                          <Image source={{ uri: currentPlayer.photoUri }} style={styles.turnBannerAvatarLarge} />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.turnBannerAvatarPlaceholderLarge}>
                          <Text style={styles.turnBannerAvatarPlaceholderLargeText}>
                            {currentPlayer.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}

                      <View style={styles.playerTextColumn}>
                        <Text style={styles.turnLabelText}>Vez de</Text>
                        <Text style={styles.turnBannerNameLarge} numberOfLines={2}>
                          {currentPlayer.name}
                        </Text>
                      </View>
                    </View>
                  </View>

                    {/* Right side: Horizontal Timer Button */}
                    {(gameMode === 'quiz' || gameMode === 'teologico') && (
                      <TouchableOpacity
                        style={styles.horizontalTimerContainer}
                        onPress={toggleTimerPause}
                        activeOpacity={0.8}
                      >
                        <Animated.View style={[
                          styles.horizontalTimerBar,
                          {
                            width: timerProgress.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            }),
                            backgroundColor: timerColor,
                          }
                        ]} />
                        <View style={styles.timerIconOverlay}>
                          {isTimerPaused ? (
                            <Play size={18} color={theme.text} fill={theme.text} />
                          ) : (
                            <Pause size={18} color={theme.text} fill={theme.text} />
                          )}
                          <Text style={styles.timerPercentageText}>
                            {timeRemaining}s
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
              <View style={styles.tabletLeftSpacer} />
              {actionButtons}
            </View>
            {/* Right column: question card */}
            <View style={styles.tabletRight}>
              <QuestionCard
                question={currentQuestion}
                levelLabel={currentQuestion.level || config.level}
                actionTrigger={animTrigger}
                showAnswerButton={gameMode === 'quiz' || gameMode === 'teologico'}
                timeUp={isTimeUp}
                showAnswer={showAnswer}
                isTabletLandscape={true}
                onToggleAnswer={() => {
                  setAnimTrigger('flip');
                  setShowAnswer(!showAnswer);
                }}
              />
              {gameMode === 'teologico' && showAnswer && (
                <View style={styles.observationContainer}>
                  <Text style={styles.observationText}>
                    Obs: as respostas não precisam ser exatas como está no jogo, basta que os jogadores tenham a compreensão da resposta correta.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        // ── PORTRAIT: original layout ────────────────────────────────────────
        <View style={[styles.inner, isTablet && styles.innerTabletPortrait]}>
          <BrutalHeader
            showBack={true}
            backRoute={true}
            onBack={handleExitGame}
            title="PARTIDA"
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

          {/* Scoreboard Area */}
          {(gameMode === 'quiz' || gameMode === 'teologico') && renderScoreboard()}

          {/* Turn Banner */}
          <View style={styles.turnSection}>
            {/* Row wrapping both banner and timer */}
            <View style={styles.turnBannerRow}>
              {/* Left side: Blue banner container */}
              <View style={[
                styles.turnBannerLeft,
                {
                  backgroundColor: theme.primary,
                  borderColor: theme.border,
                  shadowColor: theme.border,
                  flex: (gameMode === 'quiz' || gameMode === 'teologico') ? 0.75 : 1
                }
              ]}>
                <View style={styles.playerInfoRow}>
                  {/* Player Avatar / Placeholder */}
                  {currentPlayer.photoUri ? (
                    <TouchableOpacity
                      onPress={() => setPhotoModalVisible(true)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: currentPlayer.photoUri }} style={styles.turnBannerAvatarLarge} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.turnBannerAvatarPlaceholderLarge}>
                      <Text style={styles.turnBannerAvatarPlaceholderLargeText}>
                        {currentPlayer.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.playerTextColumn}>
                    <Text style={styles.turnLabelText}>Vez de</Text>
                    <Text style={styles.turnBannerNameLarge} numberOfLines={2}>
                      {currentPlayer.name}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right side: Horizontal Timer Button */}
              {(gameMode === 'quiz' || gameMode === 'teologico') && (
                <TouchableOpacity
                  style={[styles.horizontalTimerContainer, { borderColor: theme.border, shadowColor: theme.border }]}
                  onPress={toggleTimerPause}
                  activeOpacity={0.8}
                >
                  <Animated.View style={[
                    styles.horizontalTimerBar,
                    {
                      width: timerProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                      backgroundColor: timerColor,
                    }
                  ]} />
                  <View style={styles.timerIconOverlay}>
                    {isTimerPaused ? (
                      <Play size={18} color="#1C1917" fill="#1C1917" />
                    ) : (
                      <Pause size={18} color="#1C1917" fill="#1C1917" />
                    )}
                    <Text style={styles.timerPercentageText}>
                      {timeRemaining}s
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Question Card */}
          <QuestionCard
            question={currentQuestion}
            levelLabel={currentQuestion.level || config.level}
            actionTrigger={animTrigger}
            showAnswerButton={gameMode === 'quiz' || gameMode === 'teologico'}
            timeUp={isTimeUp}
            showAnswer={showAnswer}
            onToggleAnswer={() => {
              setAnimTrigger('flip');
              setShowAnswer(!showAnswer);
            }}
            containerStyle={gameMode === 'teologico' ? { height: '50%' } : undefined}
          />

          {gameMode === 'teologico' && showAnswer && (
            <View style={[styles.observationContainer, { borderColor: theme.border, shadowColor: theme.border }]}>
              <Text style={[styles.observationText, { color: '#1C1917' }]}>
                Obs: as respostas não precisam ser exatas como está no jogo, basta que os jogadores tenham a compreensão da resposta correta.
              </Text>
            </View>
          )}

          {/* Actions Area */}
          {actionButtons}
        </View>
      )}

      {/* Expanded Photo Modal */}
      <Modal
        visible={photoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable 
          style={styles.photoModalOverlay} 
          onPress={() => setPhotoModalVisible(false)}
        >
          <View style={[styles.photoModalCard, { backgroundColor: theme.background, borderColor: theme.border, shadowColor: theme.border }]}>
            <Text style={[styles.photoModalTitle, { color: theme.text }]}>{currentPlayer.name}</Text>
            {currentPlayer.photoUri && (
              <Image 
                source={{ uri: currentPlayer.photoUri }} 
                style={[styles.photoModalImage, { borderColor: theme.border, backgroundColor: theme.surface }]} 
                contentFit="contain"
              />
            )}
            <BrutalButton
              variant="primary"
              fullWidth={true}
              onPress={() => setPhotoModalVisible(false)}
              style={{ marginTop: 24 }}
            >
              Fechar
            </BrutalButton>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
    letterSpacing: 1,
  },
  playersScroll: {
    gap: 10,
    paddingRight: 20,
  },
  playerCard: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
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
    flex: 1,
  },
  playerPoints: {
    fontFamily: Fonts.heading,
    fontSize: 18,
  },
  turnSection: {
    marginBottom: 20,
  },
  turnBannerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 72,
    zIndex: 2,
  },
  turnBannerLeft: {
    borderWidth: Metrics.borderWidth,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  turnLeftInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  turnLabelText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playerTextColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  turnBannerAvatarLarge: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  turnBannerAvatarPlaceholderLarge: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnBannerAvatarPlaceholderLargeText: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: '#1C1917',
  },
  turnBannerNameLarge: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: '#FFFFFF',
    flex: 1,
  },
  horizontalTimerContainer: {
    flex: 0.25,
    backgroundColor: '#E5E7EB',
    borderWidth: Metrics.borderWidth,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  horizontalTimerBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  timerIconOverlay: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerPercentageText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: '#1C1917',
    marginTop: 1,
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  photoModalCard: {
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowOffset: { width: Metrics.shadowOffset, height: Metrics.shadowOffset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  photoModalTitle: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  photoModalImage: {
    width: 280,
    height: 280,
    borderRadius: 8,
    borderWidth: Metrics.borderWidth,
  },
  actionsContainer: {
    marginTop: 'auto',
    paddingTop: 12,
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
  },
  soundButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  observationContainer: {
    backgroundColor: '#FEF08A',
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    marginBottom: 6,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  observationText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: '#1C1917',
    textAlign: 'center',
    lineHeight: 15,
  },
  // ── Tablet Landscape ─────────────────────────────────────────────────────
  tabletWrapper: {
    flex: 1,
    paddingHorizontal: Metrics.containerMargin,
    paddingTop: Metrics.containerMargin,
    paddingBottom: 20,
  },
  tabletRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },
  tabletLeft: {
    flex: 4,
    flexDirection: 'column',
  },
  tabletRight: {
    flex: 7,
    flexDirection: 'column',
  },
  tabletLeftSpacer: {
    flex: 1,
  },
  scoreboardAvatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  scoreboardAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreboardAvatarPlaceholderText: {
    fontSize: 11,
    fontFamily: Fonts.heading,
  },
  playerCardActive: {},
  turnBannerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  turnBannerAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnBannerAvatarPlaceholderText: {
    fontSize: 14,
    fontFamily: Fonts.heading,
  },
  innerTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});
