import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause } from 'lucide-react-native';
import { Fonts, Metrics } from '@/constants/theme';
import { Player } from '@/types/settings';
import { useTheme } from '@/hooks/use-theme';

interface QuemSouEuTurnBannerProps {
  currentPlayer: Player;
  onAvatarPress: () => void;
  timerEnabled: boolean;
  isTimerPaused: boolean;
  timeRemaining: number;
  timerProgress: Animated.Value;
  timerColor: Animated.AnimatedInterpolation<string | number>;
  onToggleTimerPause: () => void;
}

export const QuemSouEuTurnBanner: React.FC<QuemSouEuTurnBannerProps> = ({
  currentPlayer,
  onAvatarPress,
  timerEnabled,
  isTimerPaused,
  timeRemaining,
  timerProgress,
  timerColor,
  onToggleTimerPause,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.turnSection}>
      <View style={styles.turnBannerRow}>
        <View
          style={[
            styles.turnBannerLeft,
            {
              backgroundColor: theme.primary,
              borderColor: theme.border,
              shadowColor: theme.border,
              flex: timerEnabled ? 0.75 : 1,
            },
          ]}
        >
          <View style={styles.playerInfoRow}>
            {currentPlayer.photoUri ? (
              <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8}>
                <Image source={{ uri: currentPlayer.photoUri }} style={styles.turnBannerAvatarLarge} />
              </TouchableOpacity>
            ) : (
              <View style={styles.turnBannerAvatarPlaceholderLarge}>
                <Text style={styles.turnBannerAvatarPlaceholderLargeText}>
                  {currentPlayer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.playerTextColumn}>
              <Text style={styles.turnLabelText}>Vez de</Text>
              <Text style={styles.turnBannerNameLarge} numberOfLines={2}>
                {currentPlayer.name}
              </Text>
            </View>
          </View>
        </View>

        {timerEnabled && (
          <TouchableOpacity
            style={[styles.horizontalTimerContainer, { borderColor: theme.border, shadowColor: theme.border }]}
            onPress={onToggleTimerPause}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.horizontalTimerBar,
                {
                  width: timerProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: timerColor,
                },
              ]}
            />
            <View style={styles.timerIconOverlay}>
              {isTimerPaused ? (
                <Play size={18} color="#1C1917" fill="#1C1917" />
              ) : (
                <Pause size={18} color="#1C1917" fill="#1C1917" />
              )}
              <Text style={styles.timerPercentageText}>{timeRemaining}s</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  turnSection: {
    marginBottom: 20,
  },
  turnBannerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 72,
    zIndex: 2,
  },
  turnBannerLeft: {
    borderWidth: Metrics.borderWidth,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  playerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playerTextColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  turnBannerAvatarLarge: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  turnBannerAvatarPlaceholderLarge: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnBannerAvatarPlaceholderLargeText: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: '#1C1917',
  },
  turnLabelText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  turnBannerNameLarge: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: '#FFFFFF',
    flex: 1,
  },
  horizontalTimerContainer: {
    flex: 0.25,
    backgroundColor: '#E5E7EB',
    borderWidth: Metrics.borderWidth,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  horizontalTimerBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  timerIconOverlay: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerPercentageText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: '#1C1917',
    marginTop: 1,
  },
});
