import { Colors, Fonts, Metrics } from '@/constants/theme';
import { playClickSound } from '@/services/soundManager';
import React, { useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, Vibration, View, ViewStyle } from 'react-native';

interface BrutalButtonProps {
  children: React.ReactNode | string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'accent1' | 'accent2' | 'surface' | 'purple';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export default function BrutalButton({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  style,
  textStyle,
  disabled = false,
}: BrutalButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getBgColor = () => {
    if (disabled) return Colors.muted;
    switch (variant) {
      case 'primary': return Colors.primary;
      case 'secondary': return Colors.warning;
      case 'accent1': return Colors.accent1;
      case 'accent2': return Colors.accent2;
      case 'surface': return Colors.surface;
      case 'purple': return Colors.purple;
      default: return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.border;
    if (variant === 'surface') return Colors.text;
    return '#FFFFFF';
  };

  const handlePress = () => {
    if (disabled) return;
    Vibration.vibrate(10); // feedback tátil curto
    playClickSound();
    onPress?.();
  };

  const flatStyle = StyleSheet.flatten(style) || {};
  const hasCustomHeight = flatStyle.height !== undefined || flatStyle.aspectRatio !== undefined;
  const containerHeight = size === 'small' ? 44 : size === 'large' ? Metrics.buttonHeight : 56;
  const containerPadding = size === 'small' ? 12 : 20;

  return (
    <View style={[
      styles.shadowWrapper,
      fullWidth && styles.fullWidth,
      style,
    ]}>
      {/* The dark shadow behind */}
      <View style={[
        styles.shadowBackground,
        { borderRadius: Metrics.radiusButton }
      ]} />

      {/* The actual interactive button front face */}
      <Pressable
        onPressIn={() => !disabled && setIsPressed(true)}
        onPressOut={() => !disabled && setIsPressed(false)}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.buttonFront,
          {
            backgroundColor: getBgColor(),
            borderColor: Colors.border,
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
          <Text style={[
            styles.buttonText,
            {
              color: getTextColor(),
              fontSize: size === 'small' ? 14 : size === 'large' ? 20 : 18,
            },
            textStyle,
          ]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    position: 'relative',
    marginBottom: Metrics.shadowOffset,
    marginRight: Metrics.shadowOffset,
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  shadowBackground: {
    position: 'absolute',
    top: Metrics.shadowOffset,
    left: Metrics.shadowOffset,
    right: -Metrics.shadowOffset,
    bottom: -Metrics.shadowOffset,
    backgroundColor: Colors.border,
    zIndex: 1,
  },
  buttonFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontFamily: Fonts.subheading,
    fontWeight: '700',
    textAlign: 'center',
  },
});
