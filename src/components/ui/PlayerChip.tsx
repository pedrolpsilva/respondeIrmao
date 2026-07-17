import { Colors, Fonts, Metrics } from '@/constants/theme';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import React from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { playClickSound } from '@/services/soundManager';

// Enable LayoutAnimation for smooth removal on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface PlayerChipProps {
  name: string;
  photoUri?: string;
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function PlayerChip({ name, photoUri, onRemove, showRemove = true }: PlayerChipProps) {
  const handleRemove = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    playClickSound();
    onRemove?.();
  };

  return (
    <View style={styles.chipContainer}>
      {/* Tiny neobrutalist shadow */}
      <View style={styles.chipShadow} />
      
      {/* Main Card */}
      <View style={styles.chipFront}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.playerImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.defaultAvatarContainer}>
            <Text style={styles.defaultAvatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        {/* Name Overlay at the bottom */}
        <View style={styles.nameOverlay}>
          <Text style={styles.nameText} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>

      {/* Remove button badge absolute on top-right */}
      {showRemove && (
        <Pressable 
          onPress={handleRemove}
          hitSlop={10}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && { opacity: 0.8 }
          ]}
        >
          <X size={12} color="#FFF" strokeWidth={3} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chipContainer: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 12,
    width: 92,
    height: 92,
  },
  chipShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    zIndex: 1,
  },
  chipFront: {
    zIndex: 2,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  defaultAvatarContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: Colors.text,
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(28, 25, 23, 0.75)',
    paddingVertical: 3,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  nameText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.accent2,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
