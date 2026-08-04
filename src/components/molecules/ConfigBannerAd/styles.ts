import { Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

const BANNER_HEIGHT = Math.round(Metrics.touchTargetMin * 1.5);

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    marginHorizontal: -Metrics.containerMargin,
    marginTop: -20,
    minHeight: BANNER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
});
