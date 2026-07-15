import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import ConfigBannerAd from '@/components/ui/ConfigBannerAd';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useRouter } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, Vibration, View } from 'react-native';
import { playClickSound } from '@/services/soundManager';

export default function ConfigScreen() {
  const router = useRouter();
  const { gameMode, config, updateConfig, resetGame } = useGame();

  // Local states for UI, sync to context on Submit
  const [selectedLevel, setSelectedLevel] = useState(
    gameMode === 'teologico' ? 'teologico' : gameMode === 'quiz' ? 'multidao' : 'comunhao'
  );
  const [targetScore, setTargetScore] = useState(config.targetPoints || 10);
  const [timer, setTimer] = useState(config.timerBase || 30);
  const [repeatSame, setRepeatSame] = useState(config.repeatSamePlayer || false);
  const [repeatOther, setRepeatOther] = useState(config.repeatOtherPlayers || false);
  const [includeLower, setIncludeLower] = useState(config.includeLowerLevels ?? false);

  const handleSubmit = () => {
    updateConfig({
      level: selectedLevel,
      targetPoints: targetScore,
      timerBase: timer,
      repeatSamePlayer: repeatSame,
      repeatOtherPlayers: repeatOther,
      includeLowerLevels: includeLower,
    });
    resetGame();
    router.push('/game');
  };

  // Helpers for segmented control rendering
  const renderSegment = (
    label: string,
    value: string,
    current: string,
    onSelect: (val: string) => void,
    activeColor: string = Colors.primary
  ) => {
    const isSelected = value === current;
    return (
      <Pressable
        key={value}
        onPress={() => {
          Vibration.vibrate(10);
          playClickSound();
          onSelect(value);
        }}
        style={[
          styles.segmentOption,
          isSelected && {
            backgroundColor: activeColor,
            borderColor: Colors.border,
            // transform: [{ translateX: 2 }, { translateY: 2 }],
          }
        ]}
      >
        {isSelected && <View style={styles.segmentActiveShadow} />}
        <Text style={[
          styles.segmentText,
          isSelected && { color: activeColor === Colors.surface ? Colors.text : '#FFFFFF', fontFamily: Fonts.bodyBold }
        ]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <BrutalHeader title="Configurar Partida" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Banner AdMob */}
          {/* <ConfigBannerAd /> */}

          <View style={styles.headerInfo}>
            <Text style={styles.subtitle}>
              Ajuste as regras para o Modo {gameMode === 'teologico' ? 'Quiz Teológico' : gameMode === 'quiz' ? 'Quiz' : 'Compartilhar'}
            </Text>
          </View>

          {gameMode === 'teologico' && (
            <View style={styles.warningCard}>
              <Text style={styles.warningText}>
                ⚠️ Obs: As respostas não precisam ser exatas como está no jogo, basta que os jogadores tenham a compreensão da resposta correta.
              </Text>
            </View>
          )}

          {/* Level Selection */}
          {gameMode !== 'teologico' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Nível de Dificuldade</Text>
              <View style={styles.segmentedContainer}>
                {gameMode === 'compartilhar' ? (
                  <>
                    {renderSegment('Comunhão', 'comunhao', selectedLevel, setSelectedLevel, Colors.accent1)}
                    {renderSegment('Testemunho', 'testemunho', selectedLevel, setSelectedLevel, Colors.warning)}
                    {renderSegment('Confissão', 'confissao', selectedLevel, setSelectedLevel, Colors.accent2)}
                  </>
                ) : (
                  <>
                    {renderSegment('Multidão', 'multidao', selectedLevel, setSelectedLevel, Colors.accent1)}
                    {renderSegment('Discípulo', 'discipulo', selectedLevel, setSelectedLevel, Colors.warning)}
                    {renderSegment('Apóstolo', 'apostolo', selectedLevel, setSelectedLevel, Colors.accent2)}
                  </>
                )}
              </View>

              {/* include lower levels switch */}
              <View style={[styles.toggleCard, { marginTop: 12 }]}>
                <View style={styles.toggleTextWrapper}>
                  <Text style={styles.toggleTitle}>Utilizar palavras de níveis menores</Text>
                  <Text style={styles.toggleSubtitle}>
                    Palavras de níveis mais fáceis aparecerão em níveis mais difíceis.
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: Colors.muted, true: Colors.primary }}
                  thumbColor={Colors.border}
                  ios_backgroundColor={Colors.muted}
                  onValueChange={setIncludeLower}
                  value={includeLower}
                />
              </View>
            </View>
          )}

          {(gameMode === 'quiz' || gameMode === 'teologico') ? (
            <>
              {/* Target Score Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Pontuação Alvo (Para Vencer)</Text>
                <View style={styles.segmentedContainer}>
                  {renderSegment('10 pts', '10', targetScore.toString(), (v) => setTargetScore(parseInt(v)), Colors.primary)}
                  {renderSegment('15 pts', '15', targetScore.toString(), (v) => setTargetScore(parseInt(v)), Colors.primary)}
                  {renderSegment('20 pts', '20', targetScore.toString(), (v) => setTargetScore(parseInt(v)), Colors.primary)}
                </View>
              </View>

              {/* Timer Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Tempo por Turno</Text>
                <View style={styles.timerCard}>
                  <Pressable
                    onPress={() => {
                      Vibration.vibrate(10);
                      playClickSound();
                      setTimer(prev => Math.max(15, prev - 15));
                    }}
                    style={styles.timerButton}
                  >
                    <Minus color={Colors.border} size={24} strokeWidth={3} />
                  </Pressable>

                  <View style={styles.timerDisplay}>
                    <Text style={styles.timerValue}>{timer}s</Text>
                  </View>

                  <Pressable
                    onPress={() => {
                      Vibration.vibrate(10);
                      playClickSound();
                      setTimer(prev => Math.min(120, prev + 15));
                    }}
                    style={styles.timerButton}
                  >
                    <Plus color={Colors.border} size={24} strokeWidth={3} />
                  </Pressable>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Compartilhar Repeats Toggles */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Perguntas Repetidas</Text>

                <View style={[styles.toggleCard, { marginBottom: 12 }]}>
                  <View style={styles.toggleTextWrapper}>
                    <Text style={styles.toggleTitle}>Para o mesmo jogador</Text>
                    <Text style={styles.toggleSubtitle}>Uma pergunta pode cair de novo para a mesma pessoa.</Text>
                  </View>
                  <Switch
                    trackColor={{ false: Colors.muted, true: Colors.primary }}
                    thumbColor={Colors.border}
                    ios_backgroundColor={Colors.muted}
                    onValueChange={setRepeatSame}
                    value={repeatSame}
                  />
                </View>

                <View style={styles.toggleCard}>
                  <View style={styles.toggleTextWrapper}>
                    <Text style={styles.toggleTitle}>Para outros jogadores</Text>
                    <Text style={styles.toggleSubtitle}>Uma pergunta já respondida pode cair para outra pessoa.</Text>
                  </View>
                  <Switch
                    trackColor={{ false: Colors.muted, true: Colors.primary }}
                    thumbColor={Colors.border}
                    ios_backgroundColor={Colors.muted}
                    onValueChange={setRepeatOther}
                    value={repeatOther}
                  />
                </View>
              </View>
            </>
          )}

        </ScrollView>

        <View style={styles.footer}>
          <BrutalButton variant="accent1" size="large" onPress={handleSubmit}>
            Bora Jogar!
          </BrutalButton>
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
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerInfo: {
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.muted,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    height: 56,
  },
  segmentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1.5,
    borderRightColor: Colors.border,
  },
  segmentActiveShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  segmentText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 16,
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: Colors.primary,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
  },
  toggleTextWrapper: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
  },
  footer: {
    marginTop: 16,
  },
  warningCard: {
    backgroundColor: '#FEF08A',
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    marginBottom: 24,
    // Neobrutalist shadow
    shadowColor: Colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  warningText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});
