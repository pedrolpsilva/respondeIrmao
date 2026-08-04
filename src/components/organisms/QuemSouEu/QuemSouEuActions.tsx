import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkipForward, Check } from 'lucide-react-native';
import BrutalButton from '@/components/ui/BrutalButton';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface QuemSouEuActionsProps {
  isTimeUp: boolean;
  timerEnabled: boolean;
  onPass: () => void;
  onCorrect: () => void;
  onSkipCard: () => void;
}

export const QuemSouEuActions: React.FC<QuemSouEuActionsProps> = ({
  isTimeUp,
  timerEnabled,
  onPass,
  onCorrect,
  onSkipCard,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.actionsContainer}>
      {isTimeUp && timerEnabled ? (
        <BrutalButton variant="surface" size="large" onPress={onPass}>
          <SkipForward size={20} color={theme.text} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonLabel, { color: theme.text }]}>Próximo</Text>
        </BrutalButton>
      ) : (
        <>
          <View style={styles.actionRow}>
            <View style={styles.halfAction}>
              <BrutalButton variant="surface" size="large" onPress={onPass}>
                <SkipForward size={20} color={theme.text} style={{ marginRight: 4 }} />
                <Text style={[styles.buttonLabel, { color: theme.text }]}>Passar</Text>
              </BrutalButton>
            </View>
            <View style={styles.halfAction}>
              <BrutalButton variant="accent1" size="large" onPress={onCorrect}>
                <Check size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>Acertei!</Text>
              </BrutalButton>
            </View>
          </View>
          <BrutalButton variant="secondary" size="medium" onPress={onSkipCard} style={styles.skipCardButton}>
            Pular carta
          </BrutalButton>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    marginTop: 20,
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfAction: {
    flex: 1,
  },
  buttonLabel: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
  },
  skipCardButton: {
    marginTop: 12,
  },
});
