import { Colors, Fonts, Metrics } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HintGridProps {
  totalHints: number;
  revealedIndices: number[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export default function HintGrid({ totalHints, revealedIndices, selectedIndex, onSelect }: HintGridProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalHints }, (_, i) => {
        const isRevealed = revealedIndices.includes(i);
        const isSelected = selectedIndex === i;

        return (
          <View key={i} style={styles.buttonWrapper}>
            {/* Neobrutalist shadow behind the button */}
            {!isRevealed && (
              <View
                style={[
                  styles.buttonShadow,
                  isSelected && { backgroundColor: Colors.primary },
                ]}
              />
            )}
            <Pressable
              disabled={isRevealed}
              onPress={() => onSelect(i)}
              style={({ pressed }) => [
                styles.hintButton,
                isRevealed && styles.hintRevealed,
                isSelected && styles.hintSelected,
                pressed && !isRevealed && styles.hintPressed,
              ]}
            >
              <Text
                style={[
                  styles.hintNumber,
                  isRevealed && styles.hintNumberRevealed,
                  isSelected && styles.hintNumberSelected,
                ]}
              >
                {i + 1}
              </Text>
              {isRevealed && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  buttonWrapper: {
    position: 'relative',
    width: 42,
    height: 42,
    marginBottom: 3,
    marginRight: 3,
  },
  hintButton: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 2.5, // slightly thinner border for smaller button balance
    borderColor: Colors.border,
    borderRadius: 8, // smaller radius for smaller size
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.border,
    borderRadius: 8,
  },
  hintRevealed: {
    backgroundColor: '#E5E7EB',
    borderColor: Colors.muted,
    opacity: 0.6,
  },
  hintSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
  },
  hintPressed: {
    transform: [{ translateX: 1.5 }, { translateY: 1.5 }],
  },
  hintNumber: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.text,
  },
  hintNumberRevealed: {
    color: Colors.muted,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  hintNumberSelected: {
    color: '#FFFFFF',
  },
  checkMark: {
    position: 'absolute',
    top: 1,
    right: 3,
    fontSize: 7,
    color: Colors.muted,
    fontFamily: Fonts.bodyBold,
  },
});
