import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Medal } from 'lucide-react-native';
import { Fonts } from '@/constants/theme';
import { Player } from '@/types/settings';
import { useTheme } from '@/hooks/use-theme';

interface QuemSouEuScoreboardProps {
  players: Player[];
  currentPlayerId: string;
}

export const QuemSouEuScoreboard: React.FC<QuemSouEuScoreboardProps> = ({
  players,
  currentPlayerId,
}) => {
  const theme = useTheme();

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points);
  }, [players]);

  return (
    <View style={styles.scoreboardContainer}>
      <Text style={[styles.scoreboardLabel, { color: theme.textSecondary }]}>PLACAR ATUAL</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersScroll}>
        {sortedPlayers.map((p, i) => {
          const isActive = p.id === currentPlayerId;
          return (
            <View key={p.id} style={[
              styles.playerCard,
              { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.border },
              isActive && { backgroundColor: theme.primary, borderColor: theme.border }
            ]}>
              <View style={styles.playerCardContent}>
                {p.photoUri ? (
                  <Image source={{ uri: p.photoUri }} style={[styles.scoreboardAvatar, { borderColor: theme.border }]} />
                ) : (
                  <View style={[styles.scoreboardAvatarPlaceholder, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Text style={[styles.scoreboardAvatarPlaceholderText, { color: theme.text }]}>{p.name.charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                {i === 0 && <Medal color="#F5B300" size={16} />}
                {i === 1 && <Medal color="#999999" size={16} />}
                {i === 2 && <Medal color="#CD7F32" size={16} />}
                <Text style={[styles.playerName, { color: theme.text }, isActive && { color: '#FFFFFF' }]} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={[styles.playerPoints, { color: theme.text }, isActive && { color: '#FFFFFF' }]}>
                  {p.points}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreboardContainer: {
    marginBottom: 20,
  },
  scoreboardLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
  playersScroll: {
    gap: 10,
    paddingRight: 20,
  },
  playerCard: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  playerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  scoreboardAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  scoreboardAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreboardAvatarPlaceholderText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },
  playerName: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    flex: 1,
  },
  playerPoints: {
    fontFamily: Fonts.heading,
    fontSize: 18,
  },
});
