import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HintGrid from '@/components/ui/HintGrid';
import { Fonts, Metrics } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface QuemSouEuHintSectionProps {
  showAnswer: boolean;
  answer: string;
  hints: string[];
  revealedIndices: number[];
  selectedHintIndex: number | null;
  currentHintText: string | null;
  allHintsRevealed: boolean;
  onHintSelect: (index: number) => void;
}

export const QuemSouEuHintSection: React.FC<QuemSouEuHintSectionProps> = ({
  showAnswer,
  answer,
  hints,
  revealedIndices,
  selectedHintIndex,
  currentHintText,
  allHintsRevealed,
  onHintSelect,
}) => {
  const theme = useTheme();

  if (showAnswer) {
    return (
      <View style={styles.answerReveal}>
        <View style={[styles.answerRevealShadow, { backgroundColor: theme.border }]} />
        <View style={[styles.answerRevealFront, { backgroundColor: theme.accent1, borderColor: theme.border }]}>
          <Text style={styles.answerRevealLabel}>RESPOSTA</Text>
          <Text style={styles.answerRevealText}>{answer}</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Text style={[styles.hintGridLabel, { color: theme.muted }]}>ESCOLHA UMA DICA:</Text>
      <HintGrid
        totalHints={hints.length}
        revealedIndices={revealedIndices}
        selectedIndex={selectedHintIndex}
        onSelect={onHintSelect}
      />
      {currentHintText ? (
        <View style={styles.hintCard}>
          <View style={[styles.hintCardShadow, { backgroundColor: theme.border }]} />
          <View style={[styles.hintCardFront, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.hintCardNumber, { color: theme.primary }]}>
              Dica {(selectedHintIndex ?? 0) + 1}
            </Text>
            <Text style={[styles.hintCardText, { color: theme.text }]}>"{currentHintText}"</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.hintPlaceholder, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.hintPlaceholderText, { color: theme.muted }]}>
            👆 Toque em um número para revelar uma dica
          </Text>
        </View>
      )}
      {allHintsRevealed && (
        <View style={[styles.warningCard, { borderColor: theme.border, shadowColor: theme.border }]}>
          <Text style={[styles.warningText, { color: '#1C1917' }]}>
            🔔 Todas as dicas foram reveladas! O próximo acerto vale 1 ponto.
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  answerReveal: {
    position: 'relative',
    marginVertical: 20,
  },
  answerRevealShadow: {
    position: 'absolute',
    top: Metrics.shadowOffset * 1.5,
    left: Metrics.shadowOffset * 1.5,
    right: -Metrics.shadowOffset * 1.5,
    bottom: -Metrics.shadowOffset * 1.5,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  answerRevealFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 24,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerRevealLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 8,
    opacity: 0.9,
  },
  answerRevealText: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 40,
    color: '#FFFFFF',
  },
  hintGridLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 1,
  },
  hintCard: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 10,
  },
  hintCardShadow: {
    position: 'absolute',
    top: Metrics.shadowOffset * 1.2,
    left: Metrics.shadowOffset * 1.2,
    right: -Metrics.shadowOffset * 1.2,
    bottom: -Metrics.shadowOffset * 1.2,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  hintCardFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 24,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintCardNumber: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hintCardText: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
  },
  hintPlaceholder: {
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 24,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    marginTop: 20,
  },
  hintPlaceholderText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#FEF08A', // Yellow-200
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  warningText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
