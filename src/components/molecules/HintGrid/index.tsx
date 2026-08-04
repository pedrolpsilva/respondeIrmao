import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createStyles } from './styles';
import { HintGridProps } from './types';

export const HintGrid: React.FC<HintGridProps> = ({
  totalHints,
  revealedIndices,
  selectedIndex,
  onSelect,
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const styles = React.useMemo(() => createStyles(isTablet), [isTablet]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalHints }, (_, i) => {
        const isRevealed = revealedIndices.includes(i);
        const isSelected = selectedIndex === i;

        return (
          <View key={i} style={styles.buttonWrapper}>
            {!isRevealed && (
              <View
                style={[
                  styles.buttonShadow,
                  { backgroundColor: theme.border },
                  isSelected && { backgroundColor: theme.primary },
                ]}
              />
            )}
            <Pressable
              disabled={isRevealed}
              onPress={() => onSelect(i)}
              style={({ pressed }) => [
                styles.hintButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
                isRevealed && [styles.hintRevealed, { backgroundColor: theme.background, borderColor: theme.muted }],
                isSelected && [styles.hintSelected, { backgroundColor: theme.primary, borderColor: theme.border }],
                pressed && !isRevealed && styles.hintPressed,
              ]}
            >
              <Text
                style={[
                  styles.hintNumber,
                  { color: theme.text },
                  isRevealed && [styles.hintNumberRevealed, { color: theme.muted }],
                  isSelected && styles.hintNumberSelected,
                ]}
              >
                {i + 1}
              </Text>
              {isRevealed && <Text style={[styles.checkMark, { color: theme.muted }]}>✓</Text>}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default HintGrid;
