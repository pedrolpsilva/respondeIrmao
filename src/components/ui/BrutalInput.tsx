import React from 'react';
import { TextInput, StyleSheet, View, StyleProp, ViewStyle, TextInputProps } from 'react-native';
import { Colors, Fonts, Metrics } from '@/constants/theme';

interface BrutalInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  hasError?: boolean;
}

export default function BrutalInput({
  containerStyle,
  hasError = false,
  style,
  ...props
}: BrutalInputProps) {
  return (
    <View style={[styles.shadowWrapper, containerStyle]}>
      {/* Solid shadow behind */}
      <View style={styles.shadowBackground} />
      
      {/* The text input front layer */}
      <TextInput
        placeholderTextColor={Colors.muted}
        style={[
          styles.inputFront,
          {
            backgroundColor: Colors.surface,
            borderColor: hasError ? Colors.accent2 : Colors.border,
            color: Colors.text,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: Metrics.shadowOffset,
    marginRight: Metrics.shadowOffset,
  },
  shadowBackground: {
    position: 'absolute',
    top: Metrics.shadowOffset,
    left: Metrics.shadowOffset,
    right: -Metrics.shadowOffset,
    bottom: -Metrics.shadowOffset,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusButton,
    zIndex: 1,
  },
  inputFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusButton,
    height: Metrics.touchTargetMin,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.body,
    fontWeight: '500',
  },
});
