import React from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Colors, Fonts, Metrics, Spacing } from '@/constants/theme';
import { X } from 'lucide-react-native';

// Enable LayoutAnimation for smooth removal on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface PlayerChipProps {
  name: string;
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function PlayerChip({ name, onRemove, showRemove = true }: PlayerChipProps) {
  const handleRemove = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onRemove?.();
  };

  return (
    <View style={styles.chipContainer}>
      {/* Tiny shadow element */}
      <View style={styles.chipShadow} />
      
      {/* Foreground */}
      <View style={styles.chipFront}>
        <Text style={styles.chipText} numberOfLines={1}>
          {name}
        </Text>
        
        {showRemove && (
          <Pressable 
            onPress={handleRemove}
            hitSlop={10}
            style={({ pressed }) => [
              styles.removeButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <X size={18} color={Colors.accent2} strokeWidth={3} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipContainer: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 12,
  },
  chipShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: Colors.border,
    borderRadius: 8,
    zIndex: 1,
  },
  chipFront: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 2.5,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  chipText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.text,
    maxWidth: 150,
  },
  removeButton: {
    padding: 2,
  },
});
