import { Metrics } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { playClickSound } from '@/services/soundManager';
import { analyticsService } from '@/services/analyticsService';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { createStyles } from './styles';
import { BrutalButtonProps } from './types';

export const BrutalButton: React.FC<BrutalButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  style,
  textStyle,
  disabled = false,
  analyticsEventName,
  analyticsParams,
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const [isPressed, setIsPressed] = useState(false);
  const styles = React.useMemo(() => createStyles(isTablet), [isTablet]);

  const getBgColor = () => {
    if (disabled) return theme.muted;
    switch (variant) {
      case 'primary': return theme.primary;
      case 'secondary': return theme.warning;
      case 'accent1': return theme.accent1;
      case 'accent2': return theme.accent2;
      case 'surface': return theme.surface;
      case 'purple': return theme.purple;
      default: return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.border;
    if (variant === 'surface') return theme.text;
    return '#FFFFFF';
  };

  const handlePress = () => {
    if (disabled) return;
    Vibration.vibrate(10);
    playClickSound();

    const labelText = analyticsEventName || (typeof children === 'string' ? children : 'button');
    analyticsService.logButtonClick(labelText, {
      variant,
      size,
      ...analyticsParams,
    });

    onPress?.();
  };

  const flatStyle = StyleSheet.flatten(style) || {};
  const hasCustomHeight = flatStyle.height !== undefined || flatStyle.aspectRatio !== undefined;

  const baseContainerHeight = size === 'small' ? 44 : size === 'large' ? Metrics.buttonHeight : 56;
  const containerHeight = isTablet ? baseContainerHeight * 1.2 : baseContainerHeight;

  const basePadding = size === 'small' ? 12 : 20;
  const containerPadding = isTablet ? basePadding * 1.3 : basePadding;

  const baseFontSize = size === 'small' ? 14 : size === 'large' ? 20 : 18;
  const fontSize = isTablet ? baseFontSize * 1.2 : baseFontSize;

  return (
    <View style={[styles.shadowWrapper, fullWidth && styles.fullWidth, style]}>
      <View style={[styles.shadowBackground, { backgroundColor: theme.border, borderRadius: Metrics.radiusButton }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={typeof children === 'string' ? children : undefined}
        onPressIn={() => !disabled && setIsPressed(true)}
        onPressOut={() => !disabled && setIsPressed(false)}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.buttonFront,
          {
            backgroundColor: getBgColor(),
            borderColor: theme.border,
            borderRadius: Metrics.radiusButton,
            height: hasCustomHeight ? '100%' : containerHeight,
            paddingHorizontal: containerPadding,
            transform: [
              { translateX: isPressed ? Metrics.shadowOffset : 0 },
              { translateY: isPressed ? Metrics.shadowOffset : 0 },
            ],
          },
        ]}
      >
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.buttonText,
              {
                color: getTextColor(),
                fontSize,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </View>
  );
};

export default BrutalButton;
