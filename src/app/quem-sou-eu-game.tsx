import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import HintGrid from '@/components/ui/HintGrid';
import { WhoAmICard } from '@/constants/questions';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { playClickSound, playSoundPreset, stopAllSounds } from '@/services/soundManager';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Check, Medal, SkipForward, Volume2, VolumeX, Play, Pause } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

const CATEGORY_ICONS: Record<string, string> = {
  'Apóstolo': '✝️',
  'Apóstolos': '✝️',
  'Profeta': '📜',
  'Profetas': '📜',
  'Rei / Líder': '👑',
  'Líderes': '👑',
  'Reis': '👑',
  'Local Bíblico': '📍',
  'Locais': '📍',
  'Evento': '⚡',
  'Eventos': '⚡',
  'Momentos importantes': '⚡',
  'Objeto Sagrado': '🏺',
  'Objetos': '🏺',
  'Deus': '✨',
};

export default function QuemSouEuGameScreen() {
  const router = useRouter();
  const {
    players,
    whoAmICards,
    whoAmIConfig,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    handleWhoAmIAnswer,
    nextTurn,
    resetGame,
    setPlayers,
  } = useGame();
  const { isTabletLandscape } = useTabletLandscape();

  const currentPlayer = players[currentPlayerIndex];

  // ── Card state ───────────────────────────────────────────────────────────────
  const [currentCard, setCurrentCard] = useState<WhoAmICard | null>(null);
  const [playedCardIds, setPlayedCardIds] = useState<string[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [selectedHintIndex, setSelectedHintIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(isSoundEnabled);

  // ── Modal state for 'Ver Resposta' ───────────────────────────────────────────
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [isConfirmingAnswer, setIsConfirmingAnswer] = useState(false);
  const modalProgress = useRef(new Animated.Value(1)).current;
  const modalAnimRef = useRef<any>(null);
  const confirmTimeoutRef = useRef<any>(null);

  const handleShowAnswerModal = () => {
    playClickSound();
    
    if (!isConfirmingAnswer) {
      setIsConfirmingAnswer(true);
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = setTimeout(() => {
        setIsConfirmingAnswer(false);
      }, 2000);
    } else {
      setIsConfirmingAnswer(false);
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);

      // Stop/clear any running animation
      if (modalAnimRef.current) modalAnimRef.current.stop();
      
      setAnswerModalVisible(true);
      modalProgress.setValue(1);
      
      // Pause main game timer if running
      stopTimer();

      // Start modal progress animation (from 1 to 0 over 5 seconds)
      modalAnimRef.current = Animated.timing(modalProgress, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: false,
      });
      
      modalAnimRef.current.start(({ finished }) => {
        if (finished) {
          setAnswerModalVisible(false);
          // Resume game timer if timer is enabled and card is not solved
          if (whoAmIConfig.timerEnabled && !showAnswer) {
            startTimer();
          }
        }
      });
    }
  };

  const handleCloseAnswerModal = () => {
    if (modalAnimRef.current) modalAnimRef.current.stop();
    setAnswerModalVisible(false);
    if (whoAmIConfig.timerEnabled && !showAnswer) {
      startTimer();
    }
  };

  // ── Timer state ───────────────────────────────────────────────────────────────
  const [timeRemaining, setTimeRemaining] = useState(whoAmIConfig.timerBase);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const timerProgress = useRef(new Animated.Value(1)).current;
  const timerColor = useMemo(() => {
    return timerProgress.interpolate({
      inputRange: [0, 0.33, 0.34, 0.66, 0.67, 1.0],
      outputRange: ['#EF4444', '#EF4444', '#FBBF24', '#FBBF24', '#22C55E', '#22C55E'],
    });
  }, [timerProgress]);
  const timerIntervalRef = useRef<any>(null);
  const timerAnimRef = useRef<any>(null);

  useEffect(() => {
    soundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

  const allCategories = useMemo(() => {
    const cats = whoAmICards.map(c => c.category.trim()).filter(Boolean);
    return Array.from(new Set(cats));
  }, [whoAmICards]);

  // ── Get eligible cards ────────────────────────────────────────────────────────
  const eligibleCards = useMemo(() => {
    const cats = whoAmIConfig.selectedCategories.length > 0
      ? whoAmIConfig.selectedCategories
      : allCategories;

    return whoAmICards.filter(c =>
      cats.includes(c.category.trim()) && c.hints.length > 0 && c.answer.trim().length > 0
    );
  }, [whoAmICards, whoAmIConfig.selectedCategories, allCategories]);

  // ── Pick a new card ───────────────────────────────────────────────────────────
  const pickNextCard = useCallback(() => {
    let available = eligibleCards.filter(c => !playedCardIds.includes(c.id));
    if (available.length === 0) {
      // Exhausted all cards, reshuffle
      available = eligibleCards;
      setPlayedCardIds([]);
    }
    if (available.length === 0) return;

    const picked = available[Math.floor(Math.random() * available.length)];
    setCurrentCard(picked);
    setPlayedCardIds(prev => [...prev, picked.id]);
    setRevealedIndices([]);
    setSelectedHintIndex(null);
    setShowAnswer(false);
    setAnswerModalVisible(false);
    setIsConfirmingAnswer(false);
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    if (modalAnimRef.current) modalAnimRef.current.stop();
  }, [eligibleCards, playedCardIds]);

  // ── Initial load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (players.length === 0) {
      router.replace('/');
      return;
    }
    pickNextCard();
  }, []);

  // ── Timer logic ───────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (!whoAmIConfig.timerEnabled) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (timerAnimRef.current) timerAnimRef.current.stop();

    setIsTimeUp(false);
    setIsTimerPaused(false);
    setTimeRemaining(whoAmIConfig.timerBase);
    timerProgress.setValue(1);

    timerAnimRef.current = Animated.timing(timerProgress, {
      toValue: 0,
      duration: whoAmIConfig.timerBase * 1000,
      useNativeDriver: false,
    });
    timerAnimRef.current.start();

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === 11 && soundEnabledRef.current) playSoundPreset('tenSeconds');
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setIsTimeUp(true);
          if (soundEnabledRef.current) playSoundPreset('timeOut');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [whoAmIConfig.timerEnabled, whoAmIConfig.timerBase]);

  const toggleTimerPause = useCallback(() => {
    if (!whoAmIConfig.timerEnabled) return;

    if (isTimerPaused) {
      // Resume timer
      setIsTimerPaused(false);
      
      timerAnimRef.current = Animated.timing(timerProgress, {
        toValue: 0,
        duration: timeRemaining * 1000,
        useNativeDriver: false,
      });
      timerAnimRef.current.start();

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === 11 && soundEnabledRef.current) playSoundPreset('tenSeconds');
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
      if (timerAnimRef.current) timerAnimRef.current.stop();
      stopAllSounds();
    }
  }, [isTimerPaused, whoAmIConfig.timerEnabled, whoAmIConfig.timerBase, timeRemaining]);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (timerAnimRef.current) timerAnimRef.current.stop();
    stopAllSounds();
  }, []);

  // Restart timer when the player turn changes
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [currentPlayerIndex]);

  useEffect(() => {
    return () => {
      stopTimer();
      if (modalAnimRef.current) modalAnimRef.current.stop();
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    };
  }, []);

  // ── Available points = total hints - revealed hints (min 1) ──────────────────
  const availablePoints = currentCard
    ? Math.max(1, currentCard.hints.length - revealedIndices.length)
    : 1;

  // ── Actions ───────────────────────────────────────────────────────────────────
  const checkWinCondition = () => {
    const winner = players.find(p => p.points >= whoAmIConfig.targetPoints);
    if (winner) {
      router.replace('/results');
      return true;
    }
    return false;
  };

  const handleHintSelect = (index: number) => {
    playClickSound();
    if (revealedIndices.includes(index)) return;
    setRevealedIndices(prev => [...prev, index]);
    setSelectedHintIndex(index);
    // Restart timer for the selecting player
    startTimer();
  };

  const handleCorrect = () => {
    stopTimer();
    handleWhoAmIAnswer(availablePoints);

    setShowAnswer(true);

    setTimeout(() => {
      const isFinished = checkWinCondition();
      if (!isFinished) {
        nextTurn();
        pickNextCard();
      }
    }, 1500);
  };

  const handlePass = () => {
    stopTimer();
    nextTurn();
    // Same card, next player — do not reset revealed hints or card
  };

  const handleSkipCard = () => {
    stopTimer();
    playClickSound();
    nextTurn();
    pickNextCard();
  };

  // ── Scoreboard ────────────────────────────────────────────────────────────────
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points);
  }, [players]);

  const renderScoreboard = () => (
    <View style={styles.scoreboardContainer}>
      <Text style={styles.scoreboardLabel}>PLACAR ATUAL</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersScroll}>
        {sortedPlayers.map((p, i) => {
          const isActive = p.id === currentPlayer?.id;
          return (
            <View key={p.id} style={[styles.playerCard, isActive && styles.playerCardActive]}>
              <View style={styles.playerCardContent}>
                {p.photoUri ? (
                  <Image source={{ uri: p.photoUri }} style={styles.scoreboardAvatar} />
                ) : (
                  <View style={styles.scoreboardAvatarPlaceholder}>
                    <Text style={styles.scoreboardAvatarPlaceholderText}>{p.name.charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                {i <= 2 && <Medal color={i === 0 ? '#F5B300' : i === 1 ? '#999999' : '#CD7F32'} size={16} />}
                <Text style={[styles.playerName, isActive && styles.playerNameActive]} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={[styles.playerPoints, isActive && styles.playerPointsActive]}>
                  {p.points}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  if (!currentPlayer || !currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.inner, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyText}>
            ⚠️ Nenhuma carta disponível para as categorias selecionadas.{'\n'}Adicione cartas no Google Sheets!
          </Text>
          <BrutalButton variant="primary" onPress={() => router.replace('/')} style={{ marginTop: 24 }}>
            Voltar ao Menu
          </BrutalButton>
        </View>
      </SafeAreaView>
    );
  }

  const currentHintText = selectedHintIndex !== null
    ? currentCard.hints[selectedHintIndex]
    : null;

  const allHintsRevealed = revealedIndices.length >= currentCard.hints.length;

  return (
    <SafeAreaView style={styles.container}>
      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
        <View style={styles.tabletWrapper}>
          <BrutalHeader
            showBack={false}
            backRoute
            title="QUEM SOU EU?"
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
          <View style={styles.tabletRow}>
            {/* Left column: scoreboard + turn + timer + actions */}
            <View style={styles.tabletLeft}>
              {renderScoreboard()}
              <View style={styles.turnSection}>
                {/* Row wrapping both banner and timer */}
                <View style={styles.turnBannerRow}>
                  {/* Left side: Blue banner container */}
                  <View style={[styles.turnBannerLeft, { flex: whoAmIConfig.timerEnabled ? 0.75 : 1 }]}>
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
                  {whoAmIConfig.timerEnabled && (
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
                          <Play size={18} color={Colors.text} fill={Colors.text} />
                        ) : (
                          <Pause size={18} color={Colors.text} fill={Colors.text} />
                        )}
                        <Text style={styles.timerPercentageText}>
                          {timeRemaining}s
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }} />
              {/* Actions in left column */}
              {!showAnswer && (
                <View style={styles.actionsContainer}>
                  {isTimeUp && whoAmIConfig.timerEnabled ? (
                    <BrutalButton variant="surface" size="large" onPress={handlePass}>
                      <SkipForward size={20} color={Colors.text} style={{ marginRight: 8 }} />
                      <Text style={styles.buttonLabel}>Próximo</Text>
                    </BrutalButton>
                  ) : (
                    <>
                      <View style={styles.actionRow}>
                        <View style={styles.halfAction}>
                          <BrutalButton variant="surface" size="large" onPress={handlePass}>
                            <SkipForward size={20} color={Colors.text} style={{ marginRight: 4 }} />
                            <Text style={styles.buttonLabel}>Passar</Text>
                          </BrutalButton>
                        </View>
                        <View style={styles.halfAction}>
                          <BrutalButton variant="accent1" size="large" onPress={handleCorrect}>
                            <Check size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
                            <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Acertei!</Text>
                          </BrutalButton>
                        </View>
                      </View>
                      <BrutalButton variant="secondary" size="medium" onPress={handleSkipCard} style={styles.skipCardButton}>
                        Pular carta
                      </BrutalButton>
                    </>
                  )}
                </View>
              )}
            </View>
            {/* Right column: hint grid + hint card */}
            <View style={styles.tabletRight}>
              {/* Card Header: Points + Category + Ver Resposta */}
              <View style={styles.cardHeader}>
                <View style={styles.leftHeaderSection}>
                  <View style={styles.pointsBadge}>
                    <Text style={styles.pointsValue}>{availablePoints}</Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryIcon}>
                      {CATEGORY_ICONS[currentCard.category] ?? '📖'}
                    </Text>
                    <Text style={styles.categoryText}>{currentCard.category}</Text>
                  </View>
                </View>

                <Pressable
                  onPress={handleShowAnswerModal}
                  style={[
                    styles.verRespostaBadge,
                    isConfirmingAnswer && styles.verRespostaConfirmBadge
                  ]}
                >
                  <Text
                    style={[
                      styles.verRespostaText,
                      isConfirmingAnswer && styles.verRespostaConfirmText
                    ]}
                  >
                    {isConfirmingAnswer ? 'Confirme ver resposta ⚠️' : 'Ver Resposta 👁️'}
                  </Text>
                </Pressable>
              </View>

              {showAnswer ? (
                <View style={styles.answerReveal}>
                  <View style={styles.answerRevealShadow} />
                  <View style={styles.answerRevealFront}>
                    <Text style={styles.answerRevealLabel}>RESPOSTA</Text>
                    <Text style={styles.answerRevealText}>{currentCard.answer}</Text>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.hintGridLabel}>ESCOLHA UMA DICA:</Text>
                  <HintGrid
                    totalHints={currentCard.hints.length}
                    revealedIndices={revealedIndices}
                    selectedIndex={selectedHintIndex}
                    onSelect={handleHintSelect}
                  />
                  {currentHintText ? (
                    <View style={styles.hintCard}>
                      <View style={styles.hintCardShadow} />
                      <View style={styles.hintCardFront}>
                        <Text style={styles.hintCardNumber}>Dica {(selectedHintIndex ?? 0) + 1}</Text>
                        <Text style={styles.hintCardText}>"{currentHintText}"</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.hintPlaceholder}>
                      <Text style={styles.hintPlaceholderText}>
                        👆 Toque em um número para revelar uma dica
                      </Text>
                    </View>
                  )}
                  {allHintsRevealed && (
                    <View style={styles.warningCard}>
                      <Text style={styles.warningText}>
                        🔔 Todas as dicas foram reveladas! O próximo acerto vale 1 ponto.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      ) : (
        // ── PORTRAIT: original layout ────────────────────────────────────────
        <View style={styles.inner}>
          <BrutalHeader
            showBack={false}
            backRoute
            title="QUEM SOU EU?"
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

          {renderScoreboard()}

          {/* Turn Banner */}
          <View style={styles.turnSection}>
            {/* Row wrapping both banner and timer */}
            <View style={styles.turnBannerRow}>
              {/* Left side: Blue banner container */}
              <View style={[styles.turnBannerLeft, { flex: whoAmIConfig.timerEnabled ? 0.75 : 1 }]}>
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
              {whoAmIConfig.timerEnabled && (
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
                      <Play size={18} color={Colors.text} fill={Colors.text} />
                    ) : (
                      <Pause size={18} color={Colors.text} fill={Colors.text} />
                    )}
                    <Text style={styles.timerPercentageText}>
                      {timeRemaining}s
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Card Header: Points + Category + Ver Resposta */}
            <View style={styles.cardHeader}>
              <View style={styles.leftHeaderSection}>
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsValue}>{availablePoints}</Text>
                  <Text style={styles.pointsLabel}>pts</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryIcon}>
                    {CATEGORY_ICONS[currentCard.category] ?? '📖'}
                  </Text>
                  <Text style={styles.categoryText}>{currentCard.category}</Text>
                </View>
              </View>

              <Pressable
                onPress={handleShowAnswerModal}
                style={[
                  styles.verRespostaBadge,
                  isConfirmingAnswer && styles.verRespostaConfirmBadge
                ]}
              >
                <Text
                  style={[
                    styles.verRespostaText,
                    isConfirmingAnswer && styles.verRespostaConfirmText
                  ]}
                >
                  {isConfirmingAnswer ? 'Confirme ver resposta ⚠️' : 'Ver Resposta 👁️'}
                </Text>
              </Pressable>
            </View>

            {/* Answer Reveal (shown after correct guess) */}
            {showAnswer && (
              <View style={styles.answerReveal}>
                <View style={styles.answerRevealShadow} />
                <View style={styles.answerRevealFront}>
                  <Text style={styles.answerRevealLabel}>RESPOSTA</Text>
                  <Text style={styles.answerRevealText}>{currentCard.answer}</Text>
                </View>
              </View>
            )}

            {/* Hint Grid */}
            {!showAnswer && (
              <>
                <Text style={styles.hintGridLabel}>ESCOLHA UMA DICA:</Text>
                <HintGrid
                  totalHints={currentCard.hints.length}
                  revealedIndices={revealedIndices}
                  selectedIndex={selectedHintIndex}
                  onSelect={handleHintSelect}
                />
              </>
            )}

            {/* Current Hint Display */}
            {!showAnswer && currentHintText && (
              <View style={styles.hintCard}>
                <View style={styles.hintCardShadow} />
                <View style={styles.hintCardFront}>
                  <Text style={styles.hintCardNumber}>Dica {(selectedHintIndex ?? 0) + 1}</Text>
                  <Text style={styles.hintCardText}>"{currentHintText}"</Text>
                </View>
              </View>
            )}

            {!showAnswer && !currentHintText && (
              <View style={styles.hintPlaceholder}>
                <Text style={styles.hintPlaceholderText}>
                  👆 Toque em um número para revelar uma dica
                </Text>
              </View>
            )}

            {/* All hints revealed warning */}
            {allHintsRevealed && !showAnswer && (
              <View style={styles.warningCard}>
                <Text style={styles.warningText}>
                  🔔 Todas as dicas foram reveladas! O próximo acerto vale 1 ponto.
                </Text>
              </View>
            )}

          </ScrollView>

          {/* Actions */}
          {!showAnswer && (
            <View style={styles.actionsContainer}>
              {/* Time up: only show next action */}
              {isTimeUp && whoAmIConfig.timerEnabled ? (
                <BrutalButton variant="surface" size="large" onPress={handlePass}>
                  <SkipForward size={20} color={Colors.text} style={{ marginRight: 8 }} />
                  <Text style={styles.buttonLabel}>Próximo</Text>
                </BrutalButton>
              ) : (
                <>
                  <View style={styles.actionRow}>
                    <View style={styles.halfAction}>
                      <BrutalButton variant="surface" size="large" onPress={handlePass}>
                        <SkipForward size={20} color={Colors.text} style={{ marginRight: 4 }} />
                        <Text style={styles.buttonLabel}>Passar</Text>
                      </BrutalButton>
                    </View>
                    <View style={styles.halfAction}>
                      <BrutalButton variant="accent1" size="large" onPress={handleCorrect}>
                        <Check size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Acertei!</Text>
                      </BrutalButton>
                    </View>
                  </View>
                  <BrutalButton variant="secondary" size="medium" onPress={handleSkipCard} style={styles.skipCardButton}>
                    Pular carta
                  </BrutalButton>
                </>
              )}
            </View>
          )}
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
          <View style={styles.photoModalCard}>
            <Text style={styles.photoModalTitle}>{currentPlayer.name}</Text>
            {currentPlayer.photoUri && (
              <Image 
                source={{ uri: currentPlayer.photoUri }} 
                style={styles.photoModalImage} 
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

      {/* Ver Resposta Modal */}
      <Modal
        transparent
        visible={answerModalVisible}
        animationType="fade"
        onRequestClose={handleCloseAnswerModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleCloseAnswerModal}>
          <View style={styles.modalContainer}>
            {/* Shadow behind */}
            <View style={styles.modalShadow} />
            
            {/* Front content */}
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Resposta da Carta</Text>
              
              <View style={styles.answerTextContainer}>
                <Text style={styles.modalAnswerText}>{currentCard.answer}</Text>
              </View>

              {/* Reverse Progress Bar */}
              <View style={styles.progressBarTrack}>
                <Animated.View style={[
                  styles.progressBarFill,
                  {
                    width: modalProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: Colors.accent2,
                  }
                ]} />
              </View>
              
              <View style={styles.modalFooter}>
                <BrutalButton
                  variant="surface"
                  size="medium"
                  onPress={handleCloseAnswerModal}
                >
                  Fechar
                </BrutalButton>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

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
  scrollContent: {
    paddingBottom: 12,
  },
  emptyText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  // Scoreboard
  scoreboardContainer: {
    marginBottom: 16,
  },
  scoreboardLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.muted,
    marginBottom: 6,
    letterSpacing: 1,
  },
  playersScroll: {
    gap: 8,
    paddingRight: 20,
  },
  playerCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 90,
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  playerCardActive: {
    backgroundColor: Colors.primary,
  },
  playerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerName: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  playerNameActive: {
    color: '#FFFFFF',
  },
  playerPoints: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.text,
  },
  playerPointsActive: {
    color: '#FFFFFF',
  },
  // Turn Banner
  turnSection: {
    marginBottom: 16,
  },
  turnBannerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 72,
    zIndex: 2,
  },
  turnBannerLeft: {
    backgroundColor: Colors.primary,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    shadowColor: Colors.border,
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
    borderColor: Colors.border,
  },
  turnBannerAvatarPlaceholderLarge: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnBannerAvatarPlaceholderLargeText: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.text,
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
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: Colors.border,
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
    color: Colors.text,
    marginTop: 1,
  },
  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  leftHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warning,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  pointsValue: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.text,
  },
  pointsLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.text,
    marginTop: 2,
  },
  verRespostaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    paddingHorizontal: 10,
    height: 48,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  verRespostaConfirmBadge: {
    backgroundColor: Colors.accent2,
  },
  verRespostaText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.text,
  },
  verRespostaConfirmText: {
    color: '#FFFFFF',
    fontSize: 10.5,
  },
  // Answer Reveal
  answerReveal: {
    position: 'relative',
    marginBottom: 16,
  },
  answerRevealShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    zIndex: 0,
  },
  answerRevealFront: {
    zIndex: 1,
    backgroundColor: Colors.accent1,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    alignItems: 'center',
  },
  answerRevealLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  answerRevealText: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Hint Grid
  hintGridLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  // Hint Card
  hintCard: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 8,
  },
  hintCardShadow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    zIndex: 0,
  },
  hintCardFront: {
    zIndex: 1,
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    minHeight: 90,
    justifyContent: 'center',
  },
  hintCardNumber: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  hintCardText: {
    fontFamily: Fonts.subheading,
    fontSize: 20,
    color: Colors.text,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  hintPlaceholder: {
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
  },
  hintPlaceholderText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#FEF08A',
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 12,
    marginTop: 12,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  warningText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  // Actions
  actionsContainer: {
    marginTop: 'auto',
    paddingTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  halfAction: {
    flex: 1,
  },
  buttonLabel: {
    fontFamily: Fonts.subheading,
    fontSize: 17,
    color: Colors.text,
  },
  skipCardButton: {
    marginTop: 4,
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
  // Modal layout
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  modalShadow: {
    position: 'absolute',
    top: Metrics.shadowOffset,
    left: Metrics.shadowOffset,
    right: -Metrics.shadowOffset,
    bottom: -Metrics.shadowOffset,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    zIndex: 0,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 24,
    zIndex: 1,
  },
  modalTitle: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  answerTextContainer: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalAnswerText: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: Colors.text,
    textAlign: 'center',
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
  },
  modalFooter: {
    marginTop: 8,
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
  scoreboardAvatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  scoreboardAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreboardAvatarPlaceholderText: {
    fontSize: 11,
    fontFamily: Fonts.heading,
    color: Colors.text,
  },
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
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnBannerAvatarPlaceholderText: {
    fontSize: 14,
    fontFamily: Fonts.heading,
    color: Colors.text,
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  photoModalCard: {
    backgroundColor: Colors.background,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: Colors.border,
    shadowOffset: { width: Metrics.shadowOffset, height: Metrics.shadowOffset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  photoModalTitle: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  photoModalImage: {
    width: 280,
    height: 280,
    borderRadius: 8,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
});

