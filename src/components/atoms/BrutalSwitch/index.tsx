import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { playClickSound } from '@/services/soundManager';
import React from 'react';
import { Pressable, Vibration, View } from 'react-native';
import { createStyles } from './styles';
import { BrutalSwitchProps } from './types';

export const BrutalSwitch: React.FC<BrutalSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const styles = React.useMemo(() => createStyles(isTablet), [isTablet]);

  const handlePress = () => {
    if (disabled) return;
    Vibration.vibrate(10);
    playClickSound();
    onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={styles.container}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <View style={[styles.shadowBackground, { backgroundColor: theme.border }]} />
      <View
        style={[
          styles.track,
          {
            backgroundColor: value ? theme.primary : theme.surface,
            borderColor: theme.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: value ? theme.surface : theme.muted,
              borderColor: theme.border,
              alignSelf: value ? 'flex-end' : 'flex-start',
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

export default BrutalSwitch;
