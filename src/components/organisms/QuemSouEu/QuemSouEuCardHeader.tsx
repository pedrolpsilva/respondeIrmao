import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Fonts, Metrics } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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

interface QuemSouEuCardHeaderProps {
  availablePoints: number;
  category: string;
  isConfirmingAnswer: boolean;
  onShowAnswerModal: () => void;
}

export const QuemSouEuCardHeader: React.FC<QuemSouEuCardHeaderProps> = ({
  availablePoints,
  category,
  isConfirmingAnswer,
  onShowAnswerModal,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.cardHeader}>
      <View style={styles.leftHeaderSection}>
        <View style={[styles.pointsBadge, { backgroundColor: theme.warning, borderColor: theme.border, shadowColor: theme.border }]}>
          <Text style={[styles.pointsValue, { color: '#1C1917' }]}>{availablePoints}</Text>
          <Text style={[styles.pointsLabel, { color: '#1C1917' }]}>pts</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border }]}>
          <Text style={styles.categoryIcon}>
            {CATEGORY_ICONS[category] ?? '📖'}
          </Text>
          <Text style={[styles.categoryText, { color: theme.text }]}>{category}</Text>
        </View>
      </View>

      <Pressable
        onPress={onShowAnswerModal}
        style={[
          styles.verRespostaBadge,
          { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border },
          isConfirmingAnswer && { backgroundColor: theme.accent2 }
        ]}
      >
        <Text
          style={[
            styles.verRespostaText,
            { color: theme.text },
            isConfirmingAnswer && { color: '#FFFFFF' }
          ]}
        >
          {isConfirmingAnswer ? 'Confirme ver resposta ⚠️' : 'Ver Resposta 👁️'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  leftHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: Metrics.borderWidth,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  pointsValue: {
    fontFamily: Fonts.heading,
    fontSize: 24,
  },
  pointsLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginLeft: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: Metrics.borderWidth,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  verRespostaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: Metrics.borderWidth,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  verRespostaText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
});
