import { Colors, Fonts, Metrics } from '@/constants/theme';
import { useModal } from '@/hooks/useModal';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

interface BrutalHeaderProps {
  title: string;
  showBack?: boolean;
  backRoute?: boolean;
  transparent?: boolean;
}

export default function BrutalHeader({ title, showBack = true, backRoute, transparent = false }: BrutalHeaderProps) {
  const router = useRouter();
  const { showAlert } = useModal();

  const handleBack = () => {
    Vibration.vibrate(10);
    router.back();
  };

  return (
    <View style={[styles.container, transparent && styles.containerTransparent]}>
      {!transparent && <View style={styles.shadow} />}
      <View style={[styles.content, transparent && styles.contentTransparent]}>
        {showBack && (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={Colors.text} size={24} strokeWidth={3} />
          </Pressable>
        )}
        <Text style={[styles.title, transparent && styles.titleTransparent]} numberOfLines={1}>{title}</Text>
        {backRoute &&
          <Pressable onPress={() => {
            showAlert({
              title: 'Sair da Partida',
              message: 'Deseja realmente voltar ao menu e reiniciar?',
              confirmText: 'Sim, Sair',
              cancelText: 'Não',
              variant: 'danger',
              onConfirm: () => router.replace('/'),
            });
          }} style={styles.finish}>
            <Text style={[
              styles.buttonText,
              {
                color: '#FFFFFF',
                fontSize: 14,
              },
            ]}>
              Encerrar
            </Text>
          </Pressable>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    marginBottom: 20,
    position: 'relative',
  },
  containerTransparent: {
    height: 60,
    marginBottom: 10,
  },
  shadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: Colors.border,
    borderBottomLeftRadius: Metrics.radiusXl,
    borderBottomRightRadius: Metrics.radiusXl,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderBottomLeftRadius: Metrics.radiusXl,
    borderBottomRightRadius: Metrics.radiusXl,
    paddingHorizontal: 16,
  },
  contentTransparent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  finish: {
    width: 90,
    height: 48,
    borderRadius: 4,
    backgroundColor: Colors.accent2,
    borderWidth: 3,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    // Neobrutalist shadow for the button itself
    shadowColor: Colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.text,
    flex: 1,
  },
  titleTransparent: {
    fontSize: 28,
    letterSpacing: -1,
  },
  buttonText: {
    fontFamily: Fonts.subheading,
    fontWeight: '700',
    textAlign: 'center',
  },
});
