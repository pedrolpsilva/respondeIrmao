import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalCameraModal from '@/components/ui/BrutalCameraModal';
import ConfigBannerAd from '@/components/ui/ConfigBannerAd';
import PlayerChip from '@/components/ui/PlayerChip';
import { Fonts, Metrics } from '@/constants/theme';
import { useGame } from '@/hooks/useGameContext';
import { useModal } from '@/hooks/useModal';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Camera, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const BrutalCameraButton = ({ onPress, photoUri }: { onPress: () => void; photoUri: string | null }) => {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  return (
    <View style={styles.cameraBtnWrapper}>
      <View style={[styles.cameraBtnShadow, { backgroundColor: theme.border }]} />
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        style={[
          styles.cameraBtnFront,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            transform: [
              { translateX: pressed ? Metrics.shadowOffset : 0 },
              { translateY: pressed ? Metrics.shadowOffset : 0 },
            ],
          }
        ]}
      >
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.cameraBtnImage}
          />
        ) : (
          <Camera color={theme.text} size={24} strokeWidth={2.5} />
        )}
      </Pressable>
    </View>
  );
};

export default function PlayersScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { players, addPlayer, removePlayer, gameMode, randomNames } = useGame();
  const { showAlert } = useModal();
  const { isTablet, isTabletLandscape } = useTabletLandscape();
  const [playerName, setPlayerName] = useState('');
  const [inputError, setInputError] = useState(false);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [randomPlaceholder, setRandomPlaceholder] = useState('');

  const playerPhotosDir = `${FileSystem.documentDirectory}player_photos/`;

  const ensureDirectoryExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(playerPhotosDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(playerPhotosDir, { intermediates: true });
    }
  };

  const storePhotoPermanently = async (tempUri: string): Promise<string> => {
    await ensureDirectoryExists();
    const cleanUri = tempUri.split('?')[0];
    const extension = cleanUri.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const destination = `${playerPhotosDir}${filename}`;
    await FileSystem.copyAsync({
      from: tempUri,
      to: destination,
    });
    return destination;
  };

  const handlePhotoCaptured = (uri: string) => {
    setSelectedPhotoUri(uri);
    setCameraVisible(false);

    // Pick a random available name as the placeholder
    const takenNames = new Set(players.map(p => p.name.toLowerCase()));
    const available = randomNames.filter(n => !takenNames.has(n.toLowerCase()));
    
    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      setRandomPlaceholder(available[randomIndex]);
    } else if (randomNames.length > 0) {
      const randomIndex = Math.floor(Math.random() * randomNames.length);
      setRandomPlaceholder(`${randomNames[randomIndex]} ${players.length + 1}`);
    } else {
      setRandomPlaceholder(`Jogador ${players.length + 1}`);
    }
  };

  const handleAdd = async () => {
    let nameTrimmed = playerName.trim();
    if (!nameTrimmed) {
      if (selectedPhotoUri) {
        nameTrimmed = randomPlaceholder || `Jogador ${players.length + 1}`;
      } else {
        setInputError(true);
        setTimeout(() => setInputError(false), 600);
        return;
      }
    }

    let savedPhotoUri: string | undefined = undefined;

    if (selectedPhotoUri) {
      try {
        savedPhotoUri = await storePhotoPermanently(selectedPhotoUri);
      } catch (err: any) {
        console.warn('Failed to store player photo:', err);
        showAlert({
          title: 'Erro ao salvar foto',
          message: 'Não foi possível salvar a foto do jogador: ' + (err?.message || err),
          confirmText: 'Ok',
          showCancel: false,
        });
      }
    }

    const success = addPlayer(nameTrimmed, savedPhotoUri);
    if (!success) {
      setInputError(true);
      setTimeout(() => setInputError(false), 600);
      if (savedPhotoUri) {
        FileSystem.deleteAsync(savedPhotoUri, { idempotent: true }).catch(() => {});
      }
      showAlert({
        title: 'Ops!',
        message: 'Esse jogador já foi adicionado ou nome é inválido.',
        confirmText: 'Entendi',
        showCancel: false,
      });
      return;
    }

    setPlayerName('');
    setSelectedPhotoUri(null);
    setRandomPlaceholder('');
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

  const chipsContent = (
    <>
      {players.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
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
                photoUri={player.photoUri}
                onRemove={() => removePlayer(player.id)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {isTabletLandscape ? (
          // ── TABLET LANDSCAPE: two-column layout ─────────────────────────────
          <View style={styles.tabletWrapper}>
            <BrutalHeader title="Quem vai jogar?" />
            <View style={styles.tabletRow}>
              {/* Left: only input + add button */}
              <View style={styles.tabletLeft}>
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <BrutalInput
                      placeholder={selectedPhotoUri && randomPlaceholder ? `Nome: ${randomPlaceholder}` : "Nome do abençoado..."}
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
                  <BrutalCameraButton onPress={() => setCameraVisible(true)} photoUri={selectedPhotoUri} />
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
              </View>
              {/* Right: chips + footer button */}
              <View style={[styles.tabletRight, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                {chipsContent}
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
            </View>
          </View>
        ) : (
          // ── PORTRAIT: original layout ────────────────────────────────────────
          <View style={[styles.inner, isTablet && styles.innerTabletPortrait]}>
            <BrutalHeader title="Quem vai jogar?" />

            {/* Input + Add Row */}
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <BrutalInput
                  placeholder={selectedPhotoUri && randomPlaceholder ? `Nome: ${randomPlaceholder}` : "Nome do abençoado..."}
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
              <BrutalCameraButton onPress={() => setCameraVisible(true)} photoUri={selectedPhotoUri} />
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

            {/* In-app Camera Modal */}
            <BrutalCameraModal
              visible={cameraVisible}
              onClose={() => setCameraVisible(false)}
              onCapture={handlePhotoCaptured}
            />

            {/* Content Scrollable Area */}
            <View style={styles.chipsArea}>
              {chipsContent}
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
        )}
      </KeyboardAvoidingView>
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
    paddingTop: 8,
    paddingHorizontal: 8,
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
    lineHeight: 24,
  },
  footer: {
    marginTop: 16,
  },
  // ── Tablet Landscape ────────────────────────────────────────────────────────
  tabletWrapper: {
    flex: 1,
    padding: Metrics.containerMargin,
    width: '100%',
  },
  tabletRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },
  tabletLeft: {
    flex: 4,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  tabletRight: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    overflow: 'hidden',
  },
  cameraBtnWrapper: {
    position: 'relative',
    width: Metrics.touchTargetMin,
    height: Metrics.touchTargetMin,
    marginBottom: Metrics.shadowOffset,
    marginRight: Metrics.shadowOffset,
  },
  cameraBtnShadow: {
    position: 'absolute',
    top: Metrics.shadowOffset,
    left: Metrics.shadowOffset,
    right: -Metrics.shadowOffset,
    bottom: -Metrics.shadowOffset,
    borderRadius: Metrics.radiusButton,
    zIndex: 1,
  },
  cameraBtnFront: {
    zIndex: 2,
    width: '100%',
    height: '100%',
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusButton,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cameraBtnImage: {
    width: '100%',
    height: '100%',
  },
  modalButtonsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  innerTabletPortrait: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
});
