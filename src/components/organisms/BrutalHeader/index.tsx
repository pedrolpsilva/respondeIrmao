import { useTheme } from '@/hooks/use-theme';
import { useModal } from '@/hooks/useModal';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { playClickSound } from '@/services/soundManager';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, Vibration, View } from 'react-native';
import { createStyles } from './styles';
import { BrutalHeaderProps } from './types';

export const BrutalHeader: React.FC<BrutalHeaderProps> = ({
  title,
  showBack = true,
  backRoute,
  transparent = false,
  rightComponent,
  onBackPress,
  onBack,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const { showAlert } = useModal();
  const styles = React.useMemo(() => createStyles(isTablet), [isTablet]);

  const customBackHandler = onBack || onBackPress;

  const handleBack = () => {
    Vibration.vibrate(10);
    playClickSound();
    if (customBackHandler) {
      customBackHandler();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, transparent && styles.containerTransparent]}>
      {!transparent && <View style={[styles.shadow, { backgroundColor: theme.border }]} />}
      <View
        style={[
          styles.content,
          transparent && styles.contentTransparent,
          !transparent && { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {showBack && (
          <Pressable
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: theme.background, borderColor: theme.border }]}
          >
            <ArrowLeft color={theme.text} size={isTablet ? 28 : 24} strokeWidth={3} />
          </Pressable>
        )}
        <Text style={[styles.title, transparent && styles.titleTransparent, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightSide}>
          {rightComponent}
          {backRoute && (
            <Pressable
              onPress={() => {
                playClickSound();
                showAlert({
                  title: 'Sair da Partida',
                  message: 'Deseja realmente voltar ao menu e reiniciar?',
                  confirmText: 'Sim, Sair',
                  cancelText: 'Não',
                  variant: 'danger',
                  onConfirm: () => {
                    if (customBackHandler) {
                      customBackHandler();
                    } else {
                      router.replace('/');
                    }
                  },
                });
              }}
              style={[
                styles.finish,
                { backgroundColor: theme.accent2, borderColor: theme.border, shadowColor: theme.border },
              ]}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Encerrar</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default BrutalHeader;
