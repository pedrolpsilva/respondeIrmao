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

export default function QuemSouEuConfigScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { whoAmIConfig, updateWhoAmIConfig, resetGame, whoAmICards } = useGame();
  const { isTablet, isTabletLandscape } = useTabletLandscape();

  const allCategories = React.useMemo(() => {
    const cats = whoAmICards.map(c => c.category.trim()).filter(Boolean);
    const unique = Array.from(new Set(cats));
    return unique.length > 0 ? unique : ['Apóstolos', 'Profetas', 'Locais', 'Momentos importantes', 'Deus'];
  }, [whoAmICards]);

  const [targetScore, setTargetScore] = useState(whoAmIConfig.targetPoints || 20);
  const [timerEnabled, setTimerEnabled] = useState(whoAmIConfig.timerEnabled ?? false);
  const [timer, setTimer] = useState(whoAmIConfig.timerBase || 30);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  React.useEffect(() => {
    if (whoAmIConfig.selectedCategories.length > 0) {
      setSelectedCategories(whoAmIConfig.selectedCategories);
    } else {
      setSelectedCategories(allCategories);
    }
  }, [allCategories]);

  const toggleCategory = (cat: string) => {
    Vibration.vibrate(10);
    playClickSound();
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const renderSegment = (
    label: string,
    value: number,
    current: number,
    onSelect: (val: number) => void,
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
          isSelected && { backgroundColor: activeColor, borderColor: theme.border },
        ]}
      >
        {isSelected && <View style={styles.segmentActiveShadow} />}
        <Text
          style={[
            styles.segmentText,
            { color: theme.text },
            isSelected && { color: '#FFFFFF', fontFamily: Fonts.bodyBold },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  const handleSubmit = () => {
    updateWhoAmIConfig({
      targetPoints: targetScore,
      timerEnabled,
      timerBase: timer,
      selectedCategories: selectedCategories.length === 0 ? allCategories : selectedCategories,
    });
    resetGame();
    router.push('/quem-sou-eu-game');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.inner, isTabletLandscape && styles.innerTabletLandscape, isTablet && !isTabletLandscape && styles.innerTabletPortrait]}>
        <BrutalHeader title="Quem Sou Eu? — Configurar" />
        <ConfigBannerAd />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[
          styles.scrollContent,
          isTabletLandscape && styles.scrollContentTablet
        ]}>

          <View style={styles.headerInfo}>
            <Text style={[styles.subtitle, { color: theme.muted }]}>Configure a partida bíblica 🕊️</Text>
          </View>

          {/* Target Score */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Pontuação Alvo (Para Vencer)</Text>
            <View style={[styles.segmentedContainer, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              {renderSegment('20 pts', 20, targetScore, setTargetScore)}
              {renderSegment('30 pts', 30, targetScore, setTargetScore)}
              {renderSegment('40 pts', 40, targetScore, setTargetScore)}
            </View>
          </View>

          {/* Timer Toggle */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Cronômetro</Text>
            <View style={[styles.toggleCard, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: timerEnabled ? 12 : 0 }]}>
              <View style={styles.toggleTextWrapper}>
                <Text style={[styles.toggleTitle, { color: theme.text }]}>Ativar Cronômetro</Text>
                <Text style={[styles.toggleSubtitle, { color: theme.muted }]}>
                  Cada jogador terá um tempo limite para adivinhar.
                </Text>
              </View>
              <Switch
                trackColor={{ false: theme.muted, true: theme.primary }}
                thumbColor={theme.border}
                ios_backgroundColor={theme.muted}
                onValueChange={(val) => {
                  Vibration.vibrate(10);
                  setTimerEnabled(val);
                }}
                value={timerEnabled}
              />
            </View>

            {timerEnabled && (
              <View style={[styles.timerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Pressable
                  onPress={() => {
                    Vibration.vibrate(10);
                    playClickSound();
                    setTimer(prev => Math.max(30, prev - 10));
                  }}
                  style={[styles.timerButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                >
                  <Minus color={theme.border} size={24} strokeWidth={3} />
                </Pressable>

                <View style={styles.timerDisplay}>
                  <Text style={[styles.timerValue, { color: theme.primary }]}>{timer}s</Text>
                  <Text style={[styles.timerLabel, { color: theme.muted }]}>por turno</Text>
                </View>

                <Pressable
                  onPress={() => {
                    Vibration.vibrate(10);
                    playClickSound();
                    setTimer(prev => Math.min(90, prev + 10));
                  }}
                  style={[styles.timerButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                >
                  <Plus color={theme.border} size={24} strokeWidth={3} />
                </Pressable>
              </View>
            )}
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Categorias</Text>
            <Text style={[styles.toggleSubtitle, { color: theme.muted }]} numberOfLines={2}>
              Selecione quais categorias de cartas aparecerão no jogo.
            </Text>
            <View style={styles.categoriesGrid}>
              {allCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <View key={cat} style={styles.chipWrapper}>
                    {isSelected && <View style={[styles.chipShadow, { backgroundColor: theme.border }]} />}
                    <Pressable
                      onPress={() => toggleCategory(cat)}
                      style={[
                        styles.categoryChip,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        isSelected && { backgroundColor: theme.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          { color: theme.text },
                          isSelected && { color: '#FFFFFF' },
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
            {selectedCategories.length === 0 && (
              <View style={[styles.warningCard, { borderColor: theme.border, shadowColor: theme.border }]}>
                <Text style={[styles.warningText, { color: '#1C1917' }]}>
                  ⚠️ Selecione pelo menos uma categoria para jogar.
                </Text>
              </View>
            )}
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <BrutalButton
            variant="accent1"
            size="large"
            onPress={handleSubmit}
            disabled={selectedCategories.length === 0}
          >
            Bora Jogar! 🙌
          </BrutalButton>
        </View>

      </View>
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
  innerTablet: {
    maxWidth: 800,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  scrollContentTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 24,
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
    fontSize: 17,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    marginBottom: 12,
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
  timerLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    marginTop: -4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  chipWrapper: {
    position: 'relative',
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusButton,
  },
  chipShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    borderRadius: Metrics.radiusButton,
  },
  categoryChipText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  warningCard: {
    backgroundColor: '#FEF08A',
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 12,
    marginTop: 12,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  warningText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  footer: {
    marginTop: 16,
  },
  innerTabletLandscape: {
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  innerTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});
