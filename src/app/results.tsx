import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useRouter } from 'expo-router';
import { Home, RotateCcw, Trophy } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const { players, resetGame, gameMode } = useGame();

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points);
  }, [players]);

  const winner = sortedPlayers[0];
  const runnersUp = sortedPlayers.slice(1);

  const handleRestart = () => {
    resetGame();
    if (gameMode === 'quem-sou-eu') {
      router.replace('/quem-sou-eu-config');
    } else {
      router.replace('/players');
    }
  };

  const handleExit = () => {
    resetGame();
    router.replace('/');
  };

  if (!winner) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <BrutalHeader title="Partida Finalizada!" showBack={false} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Golden Winner Card */}
          <View style={styles.winnerCardContainer}>
            <View style={styles.winnerCardShadow} />
            <View style={styles.winnerCardFront}>
              <View style={styles.trophyIcon}>
                <Trophy size={40} color={Colors.border} fill={Colors.warning} strokeWidth={2.5} />
              </View>
              <Text style={styles.winnerTextSmall}>GRANDE VENCEDOR</Text>
              <Text style={styles.winnerName}>{winner.name}</Text>
              <View style={styles.winnerBadge}>
                <Text style={styles.winnerBadgeText}>{winner.points} Pontos</Text>
              </View>
            </View>
          </View>

          {/* Runners-up Section */}
          {runnersUp.length > 0 && (
            <View style={styles.rankingContainer}>
              <Text style={styles.rankingTitle}>CLASSIFICAÇÃO GERAL</Text>

              {runnersUp.map((p, index) => (
                <View key={p.id} style={styles.rankRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankBadgeText}>{index + 2}°</Text>
                  </View>
                  <Text style={styles.rankName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.rankPoints}>
                    {p.points} pts
                  </Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <BrutalButton variant="accent1" size="large" onPress={handleRestart}>
            <View style={styles.buttonRow}>
              <RotateCcw size={20} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 8 }} />
              <Text style={styles.buttonTextWhite}>Jogar Novamente</Text>
            </View>
          </BrutalButton>

          <BrutalButton variant="surface" style={{ marginTop: 12 }} onPress={handleExit}>
            <View style={styles.buttonRow}>
              <Home size={20} color={Colors.text} strokeWidth={2.5} style={{ marginRight: 8 }} />
              <Text style={styles.buttonTextDark}>Menu Principal</Text>
            </View>
          </BrutalButton>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  winnerCardFront: {
    zIndex: 2,
    backgroundColor: Colors.warning,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
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
    borderColor: Colors.border,
    marginBottom: 16,
  },
  winnerTextSmall: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.border,
    letterSpacing: 1,
  },
  winnerName: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: Colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  winnerBadge: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  winnerBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.border,
  },
  rankingContainer: {
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
  },
  rankingTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.muted,
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
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.border,
  },
  rankName: {
    flex: 1,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.text,
  },
  rankPoints: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.text,
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
    color: Colors.text,
    fontSize: 18,
  },
});
