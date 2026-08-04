import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { playClickSound } from '@/services/soundManager';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import React from 'react';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';
import { createStyles } from './styles';
import { PlayerChipProps } from './types';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const PlayerChip: React.FC<PlayerChipProps> = ({
  name,
  photoUri,
  onRemove,
  showRemove = true,
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const styles = createStyles(isTablet);

  const handleRemove = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    playClickSound();
    onRemove?.();
  };

  return (
    <View style={styles.chipContainer}>
      <View style={[styles.chipShadow, { backgroundColor: theme.border }]} />
      <View style={[styles.chipFront, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.playerImage} contentFit="cover" />
        ) : (
          <View style={[styles.defaultAvatarContainer, { backgroundColor: theme.background }]}>
            <Text style={[styles.defaultAvatarText, { color: theme.text }]}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.nameOverlay}>
          <Text style={styles.nameText} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>

      {showRemove && (
        <Pressable
          onPress={handleRemove}
          hitSlop={10}
          style={({ pressed }) => [
            styles.removeButton,
            { backgroundColor: theme.accent2, borderColor: theme.border },
            pressed && { opacity: 0.8 },
          ]}
        >
          <X size={isTablet ? 16 : 12} color="#FFF" strokeWidth={3} />
        </Pressable>
      )}
    </View>
  );
};

export default PlayerChip;
