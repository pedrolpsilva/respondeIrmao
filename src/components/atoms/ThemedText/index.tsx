import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import React from 'react';
import { Text } from 'react-native';
import { createStyles } from './styles';
import { ThemedTextProps } from './types';

export const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  type = 'default',
  themeColor,
  ...rest
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const styles = createStyles(isTablet);

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
};

export * from './types';
export default ThemedText;
