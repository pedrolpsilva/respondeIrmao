import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import React from 'react';
import { TextInput, View } from 'react-native';
import { createStyles } from './styles';
import { BrutalInputProps } from './types';

export const BrutalInput: React.FC<BrutalInputProps> = ({
  containerStyle,
  hasError = false,
  style,
  ...props
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const styles = createStyles(isTablet);

  return (
    <View style={[styles.shadowWrapper, containerStyle]}>
      <View style={[styles.shadowBackground, { backgroundColor: theme.border }]} />
      <TextInput
        placeholderTextColor={theme.muted}
        style={[
          styles.inputFront,
          {
            backgroundColor: theme.surface,
            borderColor: hasError ? theme.accent2 : theme.border,
            color: theme.text,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
};

export default BrutalInput;
