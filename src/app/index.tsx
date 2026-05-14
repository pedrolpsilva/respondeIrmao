import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame, GameMode } from '@/hooks/useGameContext';
import { Colors, Fonts, Metrics, Spacing } from '@/constants/theme';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalModal from '@/components/ui/BrutalModal';
import BrutalInput from '@/components/ui/BrutalInput';

export default function HomeScreen() {
  const router = useRouter();
  const { setGameMode, resetGame } = useGame();
  
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);
  const [feedbackName, setFeedbackName] = React.useState('');
  const [feedbackComment, setFeedbackComment] = React.useState('');

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    router.push('/players');
  };

  const handleSendFeedback = () => {
    // Here you would typically send the feedback to a backend or service
    console.log('Feedback sent:', { name: feedbackName, comment: feedbackComment });
    setFeedbackVisible(false);
    setFeedbackName('');
    setFeedbackComment('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoTextTop}>RESPONDE,</Text>
          <Text style={styles.logoTextBottom}>IRMÃO!</Text>
        </View>

        {/* Primary Play Actions */}
        <View style={styles.mainActions}>
          <BrutalButton
            variant="primary"
            size="large"
            onPress={() => handleStart('compartilhar')}
            style={styles.spacing}
          >
            JOGAR COMPARTILHAMENTO
          </BrutalButton>

          <BrutalButton
            variant="primary"
            size="large"
            onPress={() => handleStart('quiz')}
            style={styles.spacing}
          >
            JOGAR QUIZ
          </BrutalButton>
        </View>

        {/* Secondary Small Actions */}
        <View style={styles.footerActions}>
          <View style={styles.halfWidth}>
            <BrutalButton
              variant="primary"
              size="medium"
              onPress={() => router.push('/help')}
            >
              Ajuda
            </BrutalButton>
          </View>
          <View style={styles.halfWidth}>
            <BrutalButton
              variant="primary"
              size="medium"
              onPress={() => router.push('/about')}
            >
              Sobre
            </BrutalButton>
          </View>
        </View>

        {/* Feedback CTA */}
        <View style={styles.feedbackSection}>
          <BrutalButton
            variant="secondary"
            size="medium"
            onPress={() => setFeedbackVisible(true)}
          >
            Feedback
          </BrutalButton>
        </View>

        {/* Feedback Modal */}
        <BrutalModal
          visible={feedbackVisible}
          title="Feedback"
          confirmText="Enviar"
          cancelText="Cancelar"
          onConfirm={handleSendFeedback}
          onCancel={() => setFeedbackVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.feedbackLabel}>
              O que está achado do jogo? Compartilhe comigo e me ajude a abençoar mais pessoas através do seu feedback!
            </Text>
            
            <BrutalInput
              placeholder="Nome"
              value={feedbackName}
              onChangeText={setFeedbackName}
              containerStyle={styles.inputSpacing}
            />
            
            <BrutalInput
              placeholder="Meu comentário..."
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>
        </BrutalModal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: Metrics.containerMargin,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoTextTop: {
    fontFamily: Fonts.heading,
    fontSize: 48,
    lineHeight: 52,
    color: Colors.text,
    textAlign: 'center',
  },
  logoTextBottom: {
    fontFamily: Fonts.heading,
    fontSize: 48,
    lineHeight: 52,
    color: Colors.text,
    textAlign: 'center',
  },
  mainActions: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    marginTop: 40,
  },
  spacing: {
    marginBottom: 8,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  feedbackSection: {
    width: '100%',
  },
  modalContent: {
    marginTop: Spacing.two,
  },
  feedbackLabel: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.four,
    lineHeight: 22,
  },
  inputSpacing: {
    marginBottom: Spacing.three,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
