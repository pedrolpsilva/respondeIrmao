import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import ConfigBannerAd from '@/components/ui/ConfigBannerAd';
import { Fonts, Metrics } from '@/constants/theme';
import { TORRE_LEVELS, TorreLevelConfig } from '@/constants/torreTypes';
import { useGame } from '@/hooks/useGameContext';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import { playClickSound } from '@/services/soundManager';
import { useRouter } from 'expo-router';
import { Clock, Flame, Shield, Skull, Star, Zap } from 'lucide-react-native';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

function getLevelColor(key: string, theme: any): string {
  switch (key) {
    case 'muito_facil':
      return theme.accent1;
    case 'facil':
      return theme.primary;
    case 'medio':
      return theme.warning;
    case 'dificil':
      return theme.accent2;
    case 'muito_dificil':
      return theme.accent2;
    case 'impossivel':
      return theme.purple;
    default:
      return theme.primary;
  }
}

function renderLevelIcon(key: string, color: string) {
  switch (key) {
    case 'muito_facil':
      return <Shield size={28} color={color} />;
    case 'facil':
      return <Star size={28} color={color} />;
    case 'medio':
      return <Flame size={28} color={color} />;
    case 'dificil':
      return <Zap size={28} color={color} />;
    case 'muito_dificil':
      return <Flame size={28} color={color} />;
    case 'impossivel':
      return <Skull size={28} color={color} />;
    default:
      return <Star size={28} color={color} />;
  }
}

interface LevelCardProps {
  config: TorreLevelConfig;
  isSelected: boolean;
  onPress: () => void;
}

function LevelCard({ config, isSelected, onPress }: LevelCardProps) {
  const theme = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);
  const dynamicColor = getLevelColor(config.key, theme);

  return (
    <View style={cardStyles.wrapper}>
      <View style={[cardStyles.shadow, { backgroundColor: theme.border }]} />
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => {
          Vibration.vibrate(10);
          playClickSound();
          onPress();
        }}
        style={[
          cardStyles.front,
          { backgroundColor: theme.surface, borderColor: theme.border },
          isSelected && { borderColor: dynamicColor, borderWidth: 4 },
          {
            transform: [
              { translateX: isPressed ? Metrics.shadowOffset : 0 },
              { translateY: isPressed ? Metrics.shadowOffset : 0 },
            ],
          },
        ]}
      >
        <View style={cardStyles.topRow}>
          <View style={[cardStyles.iconContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
            {renderLevelIcon(config.key, dynamicColor)}
          </View>
          <View style={cardStyles.textContainer}>
            <Text style={[cardStyles.levelName, { color: theme.text }]}>{config.emoji} {config.label}</Text>
            <Text style={[cardStyles.levelDescription, { color: theme.muted }]}>{config.description}</Text>
          </View>
        </View>

        {config.timerSeconds && (
          <View style={[cardStyles.timerBadge, { backgroundColor: dynamicColor }]}>
            <Clock size={14} color="#FFFFFF" />
            <Text style={cardStyles.timerText}>
              {config.timerSeconds >= 60
                ? `${Math.floor(config.timerSeconds / 60)}:${String(config.timerSeconds % 60).padStart(2, '0')}`
                : `${config.timerSeconds}s`} por pergunta
            </Text>
          </View>
        )}

        {isSelected && (
          <View style={[cardStyles.selectedIndicator, { backgroundColor: dynamicColor }]}>
            <Text style={cardStyles.selectedText}>SELECIONADO</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

export default function TorreConfigScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { torreSelectedLevel, setTorreSelectedLevel, setPlayers, resetGame, setGameMode } = useGame();
  const { isTablet, isTabletLandscape } = useTabletLandscape();

  const handleStartTorre = () => {
    setGameMode('torre');
    setPlayers([{ id: '1', name: 'Jogador', points: 0 }]);
    resetGame();
    router.push('/torre');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.inner, isTabletLandscape && styles.innerTabletLandscape, isTablet && !isTabletLandscape && styles.innerTabletPortrait]}>
        <BrutalHeader
          showBack={true}
          title="TORRE DE BABEL"
          transparent={true}
        />
        <ConfigBannerAd />

        <Text style={[styles.subtitle, { color: theme.muted }]}>Escolha o nível da sua torre</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            isTabletLandscape && styles.scrollContentTablet,
          ]}
        >
          <View style={[styles.levelsGrid, isTabletLandscape && styles.levelsGridTablet]}>
            {TORRE_LEVELS.map((level) => (
              <View
                key={level.key}
                style={isTabletLandscape ? styles.gridItemTablet : styles.gridItem}
              >
                <LevelCard
                  config={level}
                  isSelected={torreSelectedLevel === level.key}
                  onPress={() => setTorreSelectedLevel(level.key)}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.actionContainer}>
          <BrutalButton variant="secondary" size="large" onPress={handleStartTorre}>
            <Text style={styles.startButtonText}>
              INICIAR TORRE 🏰
            </Text>
          </BrutalButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Metrics.containerMargin,
    paddingBottom: 20,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentTablet: {
    paddingBottom: 10,
  },
  levelsGrid: {
    gap: 12,
  },
  levelsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '100%',
  },
  gridItemTablet: {
    width: '48%',
  },
  actionContainer: {
    marginTop: 8,
  },
  startButtonText: {
    fontFamily: Fonts.subheading,
    fontSize: 20,
    color: '#FFFFFF',
  },
  innerTabletLandscape: {
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  innerTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});

const cardStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    top: Metrics.shadowOffset,
    left: Metrics.shadowOffset,
    right: -Metrics.shadowOffset,
    bottom: -Metrics.shadowOffset,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  front: {
    zIndex: 2,
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  levelName: {
    fontFamily: Fonts.heading,
    fontSize: 18,
  },
  levelDescription: {
    fontFamily: Fonts.body,
    fontSize: 13,
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  timerText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  selectedText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
