import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useRouter } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, Vibration, View } from 'react-native';
import { playClickSound } from '@/services/soundManager';

export default function QuemSouEuConfigScreen() {
  const router = useRouter();
  const { whoAmIConfig, updateWhoAmIConfig, resetGame, whoAmICards } = useGame();

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
          isSelected && { backgroundColor: activeColor, borderColor: Colors.border },
        ]}
      >
        {isSelected && <View style={styles.segmentActiveShadow} />}
        <Text
          style={[
            styles.segmentText,
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
      selectedCategories: selectedCategories.length === allCategories.length ? [] : selectedCategories,
    });
    resetGame();
    router.push('/quem-sou-eu-game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <BrutalHeader title="Quem Sou Eu?" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.headerInfo}>
            <Text style={styles.subtitle}>Configure a partida bíblica 🕊️</Text>
          </View>

          {/* Target Score */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Pontuação Alvo (Para Vencer)</Text>
            <View style={styles.segmentedContainer}>
              {renderSegment('20 pts', 20, targetScore, setTargetScore)}
              {renderSegment('30 pts', 30, targetScore, setTargetScore)}
              {renderSegment('40 pts', 40, targetScore, setTargetScore)}
            </View>
          </View>

          {/* Timer Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Cronômetro</Text>
            <View style={[styles.toggleCard, { marginBottom: timerEnabled ? 12 : 0 }]}>
              <View style={styles.toggleTextWrapper}>
                <Text style={styles.toggleTitle}>Ativar Cronômetro</Text>
                <Text style={styles.toggleSubtitle}>
                  Cada jogador terá um tempo limite para adivinhar.
                </Text>
              </View>
              <Switch
                trackColor={{ false: Colors.muted, true: Colors.primary }}
                thumbColor={Colors.border}
                ios_backgroundColor={Colors.muted}
                onValueChange={(val) => {
                  Vibration.vibrate(10);
                  setTimerEnabled(val);
                }}
                value={timerEnabled}
              />
            </View>

            {timerEnabled && (
              <View style={styles.timerCard}>
                <Pressable
                  onPress={() => {
                    Vibration.vibrate(10);
                    playClickSound();
                    setTimer(prev => Math.max(30, prev - 10));
                  }}
                  style={styles.timerButton}
                >
                  <Minus color={Colors.border} size={24} strokeWidth={3} />
                </Pressable>

                <View style={styles.timerDisplay}>
                  <Text style={styles.timerValue}>{timer}s</Text>
                  <Text style={styles.timerLabel}>por turno</Text>
                </View>

                <Pressable
                  onPress={() => {
                    Vibration.vibrate(10);
                    playClickSound();
                    setTimer(prev => Math.min(90, prev + 10));
                  }}
                  style={styles.timerButton}
                >
                  <Plus color={Colors.border} size={24} strokeWidth={3} />
                </Pressable>
              </View>
            )}
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Categorias</Text>
            <Text style={styles.toggleSubtitle} numberOfLines={2}>
              Selecione quais categorias de cartas aparecerão no jogo.
            </Text>
            <View style={styles.categoriesGrid}>
              {allCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <Pressable
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.chipShadow} />}
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {selectedCategories.length === 0 && (
              <View style={styles.warningCard}>
                <Text style={styles.warningText}>
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
    fontSize: 17,
    color: Colors.text,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 12,
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
  timerLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
    marginTop: -4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  categoryChip: {
    position: 'relative',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    backgroundColor: Colors.surface,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
  },
  chipShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    zIndex: -1,
  },
  categoryChipText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.text,
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  warningCard: {
    backgroundColor: '#FEF08A',
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 12,
    marginTop: 12,
    shadowColor: Colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  warningText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.text,
  },
  footer: {
    marginTop: 16,
  },
});
