import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import ConfigBannerAd from '@/components/ui/ConfigBannerAd';
import { Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, Vibration, View } from 'react-native';
import { playClickSound } from '@/services/soundManager';

export default function ConfigScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { gameMode, config, updateConfig, resetGame } = useGame();
  const { isTablet, isTabletLandscape } = useTabletLandscape();

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
    activeColor: string = theme.primary
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
          { borderRightColor: theme.border },
          isSelected && {
            backgroundColor: activeColor,
            borderColor: theme.border,
          }
        ]}
      >
        {isSelected && <View style={styles.segmentActiveShadow} />}
        <Text style={[
          styles.segmentText,
          { color: theme.text },
          isSelected && { color: activeColor === theme.surface ? theme.text : '#FFFFFF', fontFamily: Fonts.bodyBold }
        ]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const levelSection = gameMode !== 'teologico' && (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.text }]}>Nível de Dificuldade</Text>
      <View style={[styles.segmentedContainer, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {gameMode === 'compartilhar' ? (
          <>
            {renderSegment('Comunhão', 'comunhao', selectedLevel, setSelectedLevel, theme.accent1)}
            {renderSegment('Testemunho', 'testemunho', selectedLevel, setSelectedLevel, theme.warning)}
            {renderSegment('Confissão', 'confissao', selectedLevel, setSelectedLevel, theme.accent2)}
          </>
        ) : (
          <>
            {renderSegment('Multidão', 'multidao', selectedLevel, setSelectedLevel, theme.accent1)}
            {renderSegment('Discípulo', 'discipulo', selectedLevel, setSelectedLevel, theme.warning)}
            {renderSegment('Apóstolo', 'apostolo', selectedLevel, setSelectedLevel, theme.accent2)}
          </>
        )}
      </View>

      {/* include lower levels switch */}
      <View style={[styles.toggleCard, { marginTop: 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.toggleTextWrapper}>
          <Text style={[styles.toggleTitle, { color: theme.text }]}>Utilizar palavras de níveis menores</Text>
          <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>
            Palavras de níveis mais fáceis aparecerão em níveis mais difíceis.
          </Text>
        </View>
        <Switch
          trackColor={{ false: theme.muted, true: theme.primary }}
          thumbColor={theme.border}
          ios_backgroundColor={theme.muted}
          onValueChange={setIncludeLower}
          value={includeLower}
        />
      </View>
    </View>
  );

  const scoringSection = (gameMode === 'quiz' || gameMode === 'teologico') ? (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.text }]}>Pontuação Alvo (Para Vencer)</Text>
        <View style={[styles.segmentedContainer, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          {renderSegment('10 pts', '10', targetScore.toString(), (v) => setTargetScore(parseInt(v)), theme.primary)}
          {renderSegment('15 pts', '15', targetScore.toString(), (v) => setTargetScore(parseInt(v)), theme.primary)}
          {renderSegment('20 pts', '20', targetScore.toString(), (v) => setTargetScore(parseInt(v)), theme.primary)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.text }]}>Tempo por Turno</Text>
        <View style={[styles.timerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Pressable
            onPress={() => {
              Vibration.vibrate(10);
              playClickSound();
              setTimer(prev => Math.max(15, prev - 15));
            }}
            style={[styles.timerButton, { backgroundColor: theme.background, borderColor: theme.border }]}
          >
            <Minus color={theme.text} size={24} strokeWidth={3} />
          </Pressable>
          <View style={styles.timerDisplay}>
            <Text style={[styles.timerValue, { color: theme.primary }]}>{timer}s</Text>
          </View>
          <Pressable
            onPress={() => {
              Vibration.vibrate(10);
              playClickSound();
              setTimer(prev => Math.min(120, prev + 15));
            }}
            style={[styles.timerButton, { backgroundColor: theme.background, borderColor: theme.border }]}
          >
            <Plus color={theme.text} size={24} strokeWidth={3} />
          </Pressable>
        </View>
      </View>
    </>
  ) : (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.text }]}>Perguntas Repetidas</Text>
      <View style={[styles.toggleCard, { marginBottom: 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.toggleTextWrapper}>
          <Text style={[styles.toggleTitle, { color: theme.text }]}>Para o mesmo jogador</Text>
          <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>Uma pergunta pode cair de novo para a mesma pessoa.</Text>
        </View>
        <Switch
          trackColor={{ false: theme.muted, true: theme.primary }}
          thumbColor={theme.border}
          ios_backgroundColor={theme.muted}
          onValueChange={setRepeatSame}
          value={repeatSame}
        />
      </View>
      <View style={[styles.toggleCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.toggleTextWrapper}>
          <Text style={[styles.toggleTitle, { color: theme.text }]}>Para outros jogadores</Text>
          <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>Uma pergunta já respondida pode cair para outra pessoa.</Text>
        </View>
        <Switch
          trackColor={{ false: theme.muted, true: theme.primary }}
          thumbColor={theme.border}
          ios_backgroundColor={theme.muted}
          onValueChange={setRepeatOther}
          value={repeatOther}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
        <View style={styles.tabletWrapper}>
          <BrutalHeader title="Configurar Partida" />
          <ConfigBannerAd />
          <View style={styles.tabletRow}>
            {/* Left column: mode subtitle + level section */}
            <View style={styles.tabletLeft}>
              <View style={styles.headerInfo}>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Ajuste as regras para o Modo {gameMode === 'teologico' ? 'Quiz Teológico' : gameMode === 'quiz' ? 'Quiz' : 'Compartilhar'}
                </Text>
              </View>
              {gameMode === 'teologico' && (
                <View style={[styles.warningCard, { borderColor: theme.border }]}>
                  <Text style={[styles.warningText, { color: '#1C1917' }]}>
                    ⚠️ Obs: As respostas não precisam ser exatas como está no jogo, basta que os jogadores tenham a compreensão da resposta correta.
                  </Text>
                </View>
              )}
              {levelSection}
            </View>
            {/* Right column: scoring + footer */}
            <View style={styles.tabletRight}>
              {scoringSection}
              <View style={styles.footer}>
                <BrutalButton variant="accent1" size="large" onPress={handleSubmit}>
                  Bora Jogar!
                </BrutalButton>
              </View>
            </View>
          </View>
        </View>
      ) : (
        // ── PORTRAIT: original layout ────────────────────────────────────────
        <View style={[styles.inner, isTablet && styles.innerTabletPortrait]}>
          <BrutalHeader title="Configurar Partida" />
          <ConfigBannerAd />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerInfo}>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Ajuste as regras para o Modo {gameMode === 'teologico' ? 'Quiz Teológico' : gameMode === 'quiz' ? 'Quiz' : 'Compartilhar'}
              </Text>
            </View>

            {gameMode === 'teologico' && (
              <View style={[styles.warningCard, { borderColor: theme.border }]}>
                <Text style={[styles.warningText, { color: '#1C1917' }]}>
                  ⚠️ Obs: As respostas não precisam ser exatas como está no jogo, basta que os jogadores tenham a compreensão da resposta correta.
                </Text>
              </View>
            )}

            {levelSection}
            {scoringSection}
          </ScrollView>

          <View style={styles.footer}>
            <BrutalButton variant="accent1" size="large" onPress={handleSubmit}>
              Bora Jogar!
            </BrutalButton>
          </View>
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
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
    marginBottom: 12,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusButton,
    overflow: 'hidden',
    height: 56,
  },
  segmentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1.5,
  },
  segmentActiveShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  segmentText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 16,
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
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
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: Metrics.borderWidth,
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
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  footer: {
    marginTop: 16,
  },
  warningCard: {
    backgroundColor: '#FEF08A',
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    marginBottom: 24,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  warningText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  // ── Tablet Landscape ───────────────────────────────────────────────────
  tabletWrapper: {
    flex: 1,
    padding: Metrics.containerMargin,
    width: '100%',
  },
  tabletRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },
  tabletLeft: {
    flex: 5,
  },
  tabletRight: {
    flex: 5,
  },
  innerTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});
