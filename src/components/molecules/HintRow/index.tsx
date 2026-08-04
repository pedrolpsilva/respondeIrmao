import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../../atoms/ThemedText';
import { ThemedView } from '../../atoms/ThemedView';
import { styles } from './styles';
import { HintRowProps } from './types';

export const HintRow: React.FC<HintRowProps> = ({
  title = 'Try editing',
  hint = 'app/index.tsx',
}) => {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundSelected" style={styles.codeSnippet}>
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
};

export default HintRow;
