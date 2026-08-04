import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { createStyles } from './styles';
import { BaseLayoutProps } from './types';

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  style,
  contentStyle,
  scrollable = true,
}) => {
  const theme = useTheme();
  const { isTablet, isTabletLandscape } = useTabletLandscape();
  const styles = createStyles(isTablet, isTabletLandscape);

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }, style]}>
      <SafeAreaView style={styles.safeArea}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentStyle]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.innerContainer}>{children}</View>
          </ScrollView>
        ) : (
          <View style={[styles.nonScrollContent, contentStyle]}>
            <View style={styles.innerContainer}>{children}</View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default BaseLayout;
