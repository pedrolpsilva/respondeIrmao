import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Volume2, VolumeX } from 'lucide-react-native';

import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import { WhoAmICard } from '@/constants/questions';
import { Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useGameInterstitial } from '@/hooks/useGameInterstitial';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import { playClickSound, playSoundPreset, stopAllSounds } from '@/services/soundManager';

import {
  QuemSouEuScoreboard,
  QuemSouEuTurnBanner,
  QuemSouEuCardHeader,
  QuemSouEuActions,
  QuemSouEuHintSection,
} from '@/components/organisms/QuemSouEu';

export default function QuemSouEuGameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isTablet, isTabletLandscape } = useTabletLandscape();

  const {
    players,
    whoAmIConfig,
    whoAmICards,
    handleWhoAmIAnswer,
  } = useGame();

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [deck, setDeck] = useState<WhoAmICard[]>([]);

  useEffect(() => {
    let filtered = whoAmICards;
    if (whoAmIConfig.selectedCategories && whoAmIConfig.selectedCategories.length > 0) {
      filtered = whoAmICards.filter(c => whoAmIConfig.selectedCategories.includes(c.category.trim()));
    }
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  }, [whoAmICards, whoAmIConfig.selectedCategories]);

  // Hint State
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [selectedHintIndex, setSelectedHintIndex] = useState<number | null>(null);

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState(whoAmIConfig.timePerTurn);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Answer state
  const [showAnswer, setShowAnswer] = useState(false);
  const [isConfirmingAnswer, setIsConfirmingAnswer] = useState(false);
  const [answerModalVisible, setAnswerModalVisible] = useState(false);

  // Photo Modal state
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  // Sound settings
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(isSoundEnabled);

  useEffect(() => {
    soundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modalAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerProgress = useRef(new Animated.Value(1)).current;
  const modalProgress = useRef(new Animated.Value(1)).current;

  // ── Flow ──────────────────────────────────────────────────────────────────────
  const currentPlayer = players[currentPlayerIndex];
  const currentCard: WhoAmICard | undefined = deck[currentCardIndex];

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (!whoAmIConfig.timerEnabled || showAnswer || isTimeUp) return;
    stopTimer();
    
    setTimeRemaining(whoAmIConfig.timePerTurn);
    setIsTimerPaused(false);
    
    Animated.timing(timerProgress, {
      toValue: 1,
      duration: 0,
      useNativeDriver: false,
    }).start();
    
    Animated.timing(timerProgress, {
      toValue: 0,
      duration: whoAmIConfig.timePerTurn * 1000,
      useNativeDriver: false,
    }).start();

    const startTime = Date.now();
    const initialTime = whoAmIConfig.timePerTurn;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const nextTime = Math.max(0, initialTime - elapsed);

      setTimeRemaining(prev => {
        if (prev === nextTime) return prev;
        
        if (nextTime <= 0) {
          stopTimer();
          setIsTimeUp(true);
          if (soundEnabledRef.current) playSoundPreset('timeup');
          timerProgress.setValue(0);
          return 0;
        }
        
        // Timer sounds
        if (nextTime === 10 && prev > 10) {
          if (soundEnabledRef.current) playSoundPreset('tick');
        }
        if (nextTime <= 5 && nextTime > 0 && prev > nextTime) {
          if (soundEnabledRef.current) playSoundPreset('tick');
        }
        
        return nextTime;
      });
    }, 500);
  }, [whoAmIConfig.timerEnabled, whoAmIConfig.timePerTurn, stopTimer, showAnswer, isTimeUp, timerProgress]);

  const toggleTimerPause = () => {
    playClickSound();
    if (isTimerPaused) {
      setIsTimerPaused(false);
      
      Animated.timing(timerProgress, {
        toValue: 0,
        duration: timeRemaining * 1000,
        useNativeDriver: false,
      }).start();

      const startTime = Date.now();
      const initialTime = timeRemaining;

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const nextTime = Math.max(0, initialTime - elapsed);

        setTimeRemaining(prev => {
          if (prev === nextTime) return prev;
          
          if (nextTime <= 0) {
            stopTimer();
            setIsTimeUp(true);
            if (soundEnabledRef.current) playSoundPreset('timeup');
            timerProgress.setValue(0);
            return 0;
          }
          if (nextTime === 10 && prev > 10 && soundEnabledRef.current) playSoundPreset('tick');
          if (nextTime <= 5 && nextTime > 0 && prev > nextTime && soundEnabledRef.current) playSoundPreset('tick');
          return nextTime;
        });
      }, 500);
    } else {
      setIsTimerPaused(true);
      stopTimer();
      timerProgress.stopAnimation();
    }
  };

  const nextTurn = () => {
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    setIsTimeUp(false);
    setShowAnswer(false);
    setIsConfirmingAnswer(false);
    stopAllSounds();
  };

  const pickNextCard = () => {
    setCurrentCardIndex(prev => (prev + 1) % deck.length);
    setRevealedIndices([]);
    setSelectedHintIndex(null);
  };

  useEffect(() => {
    if (currentCard && !showAnswer) {
      startTimer();
    }
    return () => stopTimer();
  }, [currentPlayerIndex, currentCard, showAnswer, startTimer, stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      if (modalAnimRef.current) modalAnimRef.current.stop();
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
      if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current);
    };
  }, [stopTimer]);

  // ── Available points ──────────────────────────────────────────────────────────
  const availablePoints = currentCard
    ? Math.max(1, currentCard.hints.length - revealedIndices.length)
    : 1;

  const { showAdThenNavigate } = useGameInterstitial();

  const handleExitQuemSouEu = () => {
    stopTimer();
    showAdThenNavigate(() => {
      router.replace('/');
    });
  };

  // ── Actions ───────────────────────────────────────────────────────────────────
  const checkWinCondition = () => {
    const winner = players.find(p => p.points >= whoAmIConfig.targetPoints);
    if (winner) {
      stopTimer();
      showAdThenNavigate(() => {
        router.replace('/results');
      });
      return true;
    }
    return false;
  };

  const handleHintSelect = (index: number) => {
    playClickSound();
    if (revealedIndices.includes(index)) return;
    setRevealedIndices(prev => [...prev, index]);
    setSelectedHintIndex(index);
    startTimer();
  };

  const handleCorrect = () => {
    stopTimer();
    handleWhoAmIAnswer(availablePoints);

    setShowAnswer(true);

    correctTimeoutRef.current = setTimeout(() => {
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
  };

  const handleSkipCard = () => {
    stopTimer();
    playClickSound();
    nextTurn();
    pickNextCard();
  };

  // ── Ver Resposta Flow ─────────────────────────────────────────────────────────
  const handleShowAnswerModal = () => {
    playClickSound();
    
    if (!isConfirmingAnswer) {
      setIsConfirmingAnswer(true);
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = setTimeout(() => {
        setIsConfirmingAnswer(false);
      }, 2000);
      return;
    }

    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    setIsConfirmingAnswer(false);
    
    const wasPaused = isTimerPaused;
    if (!isTimerPaused && whoAmIConfig.timerEnabled) {
      toggleTimerPause(); 
    }
    
    setAnswerModalVisible(true);
    
    modalProgress.setValue(1);
    const anim = Animated.timing(modalProgress, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: false,
    });
    
    modalAnimRef.current = anim;
    anim.start(({ finished }) => {
      if (finished) {
        setAnswerModalVisible(false);
        if (!wasPaused && whoAmIConfig.timerEnabled) {
          toggleTimerPause(); 
        }
      }
    });
  };

  const handleCloseAnswerModal = () => {
    playClickSound();
    if (modalAnimRef.current) {
      modalAnimRef.current.stop();
    }
    setAnswerModalVisible(false);
    if (isTimerPaused && whoAmIConfig.timerEnabled) {
      toggleTimerPause();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (!currentPlayer || !currentCard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.inner, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
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

  const timerColor = timerProgress.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [theme.danger, theme.warning, theme.primary, theme.primary]
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
        <View style={styles.tabletWrapper}>
          <BrutalHeader
            showBack={true}
            backRoute={true}
            onBack={handleExitQuemSouEu}
            title="QUEM SOU EU?"
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
            {/* Left column */}
            <View style={styles.tabletLeft}>
              <QuemSouEuScoreboard players={players} currentPlayerId={currentPlayer.id} />
              
              <QuemSouEuTurnBanner
                currentPlayer={currentPlayer}
                onAvatarPress={() => setPhotoModalVisible(true)}
                timerEnabled={whoAmIConfig.timerEnabled}
                isTimerPaused={isTimerPaused}
                timeRemaining={timeRemaining}
                timerProgress={timerProgress}
                timerColor={timerColor}
                onToggleTimerPause={toggleTimerPause}
              />
              
              <View style={{ flex: 1 }} />
              
              {/* Actions */}
              {!showAnswer && (
                <QuemSouEuActions
                  isTimeUp={isTimeUp}
                  timerEnabled={whoAmIConfig.timerEnabled}
                  onPass={handlePass}
                  onCorrect={handleCorrect}
                  onSkipCard={handleSkipCard}
                />
              )}
            </View>
            
            {/* Right column */}
            <View style={styles.tabletRight}>
              <QuemSouEuCardHeader
                availablePoints={availablePoints}
                category={currentCard.category}
                isConfirmingAnswer={isConfirmingAnswer}
                onShowAnswerModal={handleShowAnswerModal}
              />

              <QuemSouEuHintSection
                showAnswer={showAnswer}
                answer={currentCard.answer}
                hints={currentCard.hints}
                revealedIndices={revealedIndices}
                selectedHintIndex={selectedHintIndex}
                currentHintText={currentHintText}
                allHintsRevealed={allHintsRevealed}
                onHintSelect={handleHintSelect}
              />
            </View>
          </View>
        </View>
      ) : (
        // ── PORTRAIT: original layout ────────────────────────────────────────
        <View style={[styles.inner, isTablet && styles.innerTabletPortrait]}>
          <BrutalHeader
            showBack={true}
            backRoute={true}
            onBack={handleExitQuemSouEu}
            title="QUEM SOU EU?"
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

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <QuemSouEuScoreboard players={players} currentPlayerId={currentPlayer.id} />
            
            <QuemSouEuTurnBanner
              currentPlayer={currentPlayer}
              onAvatarPress={() => setPhotoModalVisible(true)}
              timerEnabled={whoAmIConfig.timerEnabled}
              isTimerPaused={isTimerPaused}
              timeRemaining={timeRemaining}
              timerProgress={timerProgress}
              timerColor={timerColor}
              onToggleTimerPause={toggleTimerPause}
            />

            <QuemSouEuCardHeader
              availablePoints={availablePoints}
              category={currentCard.category}
              isConfirmingAnswer={isConfirmingAnswer}
              onShowAnswerModal={handleShowAnswerModal}
            />

            <QuemSouEuHintSection
              showAnswer={showAnswer}
              answer={currentCard.answer}
              hints={currentCard.hints}
              revealedIndices={revealedIndices}
              selectedHintIndex={selectedHintIndex}
              currentHintText={currentHintText}
              allHintsRevealed={allHintsRevealed}
              onHintSelect={handleHintSelect}
            />
          </ScrollView>

          {/* Actions */}
          {!showAnswer && (
            <QuemSouEuActions
              isTimeUp={isTimeUp}
              timerEnabled={whoAmIConfig.timerEnabled}
              onPass={handlePass}
              onCorrect={handleCorrect}
              onSkipCard={handleSkipCard}
            />
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

      {/* Ver Resposta Modal */}
      <Modal
        transparent
        visible={answerModalVisible}
        animationType="fade"
        onRequestClose={handleCloseAnswerModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleCloseAnswerModal}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalShadow, { backgroundColor: theme.border }]} />
            
            <Pressable style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={(e) => e.stopPropagation()}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Resposta da Carta</Text>
              
              <View style={[styles.answerTextContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.modalAnswerText, { color: theme.text }]}>{currentCard.answer}</Text>
              </View>

              {/* Reverse Progress Bar */}
              <View style={[styles.progressBarTrack, { borderColor: theme.border }]}>
                <Animated.View style={[
                  styles.progressBarFill,
                  {
                    width: modalProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: theme.accent2,
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
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  soundButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
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
    borderRadius: Metrics.radiusCard,
    zIndex: 0,
  },
  modalContent: {
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 24,
    zIndex: 1,
  },
  modalTitle: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  answerTextContainer: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalAnswerText: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    textAlign: 'center',
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
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
  innerTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});
