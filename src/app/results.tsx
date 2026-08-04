import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import { Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useGameInterstitial } from '@/hooks/useGameInterstitial';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Home, RotateCcw, Trophy } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { showAdThenNavigate } = useGameInterstitial();
  const { players, resetGame, gameMode } = useGame();
  const { isTablet, isTabletLandscape } = useTabletLandscape();

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points);
  }, [players]);

  const winner = sortedPlayers[0];
  const runnersUp = sortedPlayers.slice(1);

  const handleRestart = () => {
    resetGame();
    showAdThenNavigate(() => {
      if (gameMode === 'quem-sou-eu') {
        router.replace('/quem-sou-eu-config');
      } else {
        router.replace('/players');
      }
    });
  };

  const handleExit = () => {
    resetGame();
    showAdThenNavigate(() => {
      router.replace('/');
    });
  };

  if (!winner) return null;

  const winnerCard = (
    <View style={styles.winnerCardContainer}>
      <View style={[styles.winnerCardShadow, { backgroundColor: theme.border }]} />
      <View style={[styles.winnerCardFront, { backgroundColor: theme.warning, borderColor: theme.border }]}>
        <View style={[styles.avatarFrame, { borderColor: theme.border }]}>
          {winner.photoUri ? (
            <Image source={{ uri: winner.photoUri }} style={styles.winnerPhoto} />
          ) : (
            <View style={[styles.winnerPhotoPlaceholder, { backgroundColor: theme.background }]}>
              <Text style={[styles.winnerPhotoPlaceholderText, { color: theme.text }]}>{winner.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={[styles.miniTrophyBadge, { borderColor: theme.border }]}>
            <Trophy size={16} color={theme.border} fill={theme.warning} strokeWidth={2.5} />
          </View>
        </View>
        <Text style={[styles.winnerTextSmall, { color: '#1C1917' }]}>GRANDE VENCEDOR</Text>
        <Text style={[styles.winnerName, { color: '#1C1917' }]}>{winner.name}</Text>
        <View style={[styles.winnerBadge, { borderColor: theme.border }]}>
          <Text style={[styles.winnerBadgeText, { color: '#1C1917' }]}>{winner.points} Pontos</Text>
        </View>
      </View>
    </View>
  );

  const rankingCard = runnersUp.length > 0 ? (
    <View style={[styles.rankingContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.rankingTitle, { color: theme.muted }]}>CLASSIFICAÇÃO GERAL</Text>
      {runnersUp.map((p, index) => (
        <View key={p.id} style={styles.rankRow}>
          <View style={[styles.rankBadge, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.rankBadgeText, { color: theme.text }]}>{index + 2}°</Text>
          </View>
          {p.photoUri ? (
            <Image source={{ uri: p.photoUri }} style={[styles.rankAvatar, { borderColor: theme.border }]} />
          ) : (
            <View style={[styles.rankAvatarPlaceholder, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.rankAvatarPlaceholderText, { color: theme.text }]}>{p.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <Text style={[styles.rankName, { color: theme.text }]} numberOfLines={1}>
            {p.name}
          </Text>
          <Text style={[styles.rankPoints, { color: theme.text }]}>
            {p.points} pts
          </Text>
        </View>
      ))}
    </View>
  ) : null;

  const footerButtons = (
    <View style={styles.footer}>
      <BrutalButton variant="accent1" size="large" onPress={handleRestart}>
        <View style={styles.buttonRow}>
          <RotateCcw size={20} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 8 }} />
          <Text style={styles.buttonTextWhite}>Jogar Novamente</Text>
        </View>
      </BrutalButton>
      <BrutalButton variant="surface" style={{ marginTop: 12 }} onPress={handleExit}>
        <View style={styles.buttonRow}>
          <Home size={20} color={theme.text} strokeWidth={2.5} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonTextDark, { color: theme.text }]}>Menu Principal</Text>
        </View>
      </BrutalButton>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
        <View style={styles.tabletWrapper}>
          <BrutalHeader title="Partida Finalizada!" showBack={false} />
          <View style={styles.tabletRow}>
            <View style={styles.tabletLeft}>
              {winnerCard}
              {footerButtons}
            </View>
            <View style={styles.tabletRight}>
              {rankingCard}
            </View>
          </View>
        </View>
      ) : (
        // ── PORTRAIT: original layout ────────────────────────────────────────
        <View style={[styles.inner, isTablet && styles.innerTabletPortrait]}>
          <BrutalHeader title="Partida Finalizada!" showBack={false} />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {winnerCard}
            {rankingCard}
          </ScrollView>
          {footerButtons}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: Metrics.containerMargin,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  scroll: {
    paddingBottom: 24,
  },
  winnerCardContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 32,
  },
  winnerCardShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  winnerCardFront: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 24,
    alignItems: 'center',
  },
  trophyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: 16,
  },
  winnerTextSmall: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 1,
  },
  winnerName: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    marginTop: 4,
    textAlign: 'center',
  },
  winnerBadge: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  winnerBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  rankingContainer: {
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 20,
  },
  rankingTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 12,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },
  rankName: {
    flex: 1,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  rankPoints: {
    fontFamily: Fonts.body,
    fontSize: 16,
  },
  footer: {
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextWhite: {
    fontFamily: Fonts.subheading,
    color: '#FFFFFF',
    fontSize: 18,
  },
  buttonTextDark: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
  },
  // ── Tablet Landscape ─────────────────────────────────────────────────────
  tabletWrapper: {
    flex: 1,
    padding: Metrics.containerMargin,
    width: '100%',
  },
  tabletRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
  },
  tabletLeft: {
    flex: 5,
  },
  tabletRight: {
    flex: 5,
    paddingTop: 8,
  },
  avatarFrame: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: Metrics.radiusCard,
    borderWidth: Metrics.borderWidth,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    overflow: 'visible',
  },
  winnerPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: Metrics.radiusCard - 3,
  },
  winnerPhotoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: Metrics.radiusCard - 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerPhotoPlaceholderText: {
    fontFamily: Fonts.heading,
    fontSize: 48,
  },
  miniTrophyBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  rankAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    marginRight: 10,
  },
  rankAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankAvatarPlaceholderText: {
    fontSize: 14,
    fontFamily: Fonts.heading,
  },
  innerTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});
