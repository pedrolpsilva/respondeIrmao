import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import BrutalInput from '@/components/ui/BrutalInput';
import ConfigBannerAd from '@/components/ui/ConfigBannerAd';
import PlayerChip from '@/components/ui/PlayerChip';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useModal } from '@/hooks/useModal';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PlayersScreen() {
  const router = useRouter();
  const { players, addPlayer, removePlayer, gameMode } = useGame();
  const { showAlert } = useModal();
  const [playerName, setPlayerName] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleAdd = () => {
    const nameTrimmed = playerName.trim();
    if (!nameTrimmed) {
      setInputError(true);
      setTimeout(() => setInputError(false), 600);
      return;
    }

    const success = addPlayer(nameTrimmed);
    if (!success) {
      setInputError(true);
      setTimeout(() => setInputError(false), 600);
      showAlert({
        title: 'Ops!',
        message: 'Esse jogador já foi adicionado ou nome é inválido.',
        confirmText: 'Entendi',
        showCancel: false,
      });
      return;
    }

    setPlayerName('');
    setInputError(false);
  };

  const handleNext = () => {
    if (players.length < 2) {
      showAlert({
        title: 'Atenção',
        message: 'Adicione pelo menos 2 jogadores para poder jogar!',
        confirmText: 'Vou adicionar',
        showCancel: false,
      });
      return;
    }
    if (gameMode === 'quem-sou-eu') {
      router.push('/quem-sou-eu-config');
    } else {
      router.push('/config');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>

          <BrutalHeader title="Quem vai jogar?" />

          {/* Banner AdMob */}
          {/* <ConfigBannerAd /> */}

          {/* Input + Add Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <BrutalInput
                placeholder="Nome do abençoado..."
                value={playerName}
                onChangeText={(txt) => {
                  setPlayerName(txt);
                  if (inputError) setInputError(false);
                }}
                hasError={inputError}
                onSubmitEditing={handleAdd}
                returnKeyType="next"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <BrutalButton
                variant="accent1"
                onPress={handleAdd}
                fullWidth={false}
                style={styles.circularButton}
              >
                <Plus color="#FFF" size={24} strokeWidth={3} />
              </BrutalButton>
            </View>
          </View>

          {/* Content Scrollable Area */}
          <View style={styles.chipsArea}>
            {players.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👥</Text>
                <Text style={styles.emptyText}>
                  Adicione pelo menos 2 jogadores para começar.
                </Text>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={styles.chipsScroll}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.chipsGrid}>
                  {players.map((player) => (
                    <PlayerChip
                      key={player.id}
                      name={player.name}
                      onRemove={() => removePlayer(player.id)}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Sticky Footer */}
          <View style={styles.footer}>
            <BrutalButton
              variant="primary"
              onPress={handleNext}
              disabled={players.length < 2}
            >
              Configurar Jogo
            </BrutalButton>
          </View>

        </View>
      </KeyboardAvoidingView>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    width: Metrics.touchTargetMin + 8,
  },
  circularButton: {
    width: Metrics.touchTargetMin,
    height: Metrics.touchTargetMin,
    borderRadius: Metrics.radiusButton,
  },
  chipsArea: {
    flex: 1,
    marginTop: 10,
  },
  chipsScroll: {
    paddingBottom: 20,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.muted,
    lineHeight: 24,
  },
  footer: {
    marginTop: 16,
  },
});
