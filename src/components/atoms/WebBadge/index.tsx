import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import React from 'react';
import { useColorScheme } from 'react-native';
import { styles } from './styles';
import { WebBadgeProps } from './types';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

export const WebBadge: React.FC<WebBadgeProps> = () => {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.versionText}>
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
      />
    </ThemedView>
  );
};

export default WebBadge;
