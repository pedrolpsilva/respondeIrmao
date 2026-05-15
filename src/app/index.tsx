import BrutalButton from '@/components/ui/BrutalButton';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalModal from '@/components/ui/BrutalModal';
import { Colors, Fonts, Metrics, Spacing } from '@/constants/theme';
import { GameMode, useGame } from '@/hooks/useGameContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { setGameMode, resetGame } = useGame();

  const [warn, setWarn] = React.useState<null | string>();
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);
  const [feedbackName, setFeedbackName] = React.useState('');
  const [feedbackComment, setFeedbackComment] = React.useState('');

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    router.push('/players');
  };

  const handleSendFeedback = async () => {
    if (!feedbackComment.trim()) {
      setWarn('Preencha o campo de feedback.');
      return;
    }

    try {
      const serviceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: feedbackName.trim() || 'Irmão Anônimo',
            feedback: feedbackComment,
          },
        }),
      })
        .then((response) => {
          if (response.ok) {
            setWarn('Obrigado pelo seu feedback! Ele é muito importante para mim.');
            setFeedbackVisible(false);
            setFeedbackName('');
            setFeedbackComment('');
          } else {
            setWarn('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
          }
        })
        .catch((error) => {
          console.error('Erro ao enviar feedback:', error);
          setWarn('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
        });
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      setWarn('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
    }
  };

  const sortSubtittle = () => {
    const subtittles = [
      'Um pouco de comunhão prática!',
      'Vivendo com seu irmão em Cristo.',
      'Você realmente conhece esse(a) abençoado(a) do teu lado?',
      'Um jogo para aproximar os crentes!',
      'Teste seus conhecimentos bíblicos!',
      'Já leu a Bíblia hoje?',
      'Dica: Aprenda mais sobre seu irmão em Cristo.',
      'Dica: Aprenda a ouvir mais!',
      'O jogo que vai testar sua fé e seu conhecimento!',
      'O que você não sabe sobre seu irmão em Cristo?',
      'Já orou hoje?',
      'Abençoa esse irmão que está ao teu lado!',
      'Não é só um jogo, é voltar a comunhão!',
    ];
    return subtittles[Math.floor(Math.random() * subtittles.length)];
  };

  const sortRotation = () => {
    const rotations = [
      '-6deg',
      '-5deg',
      '-4deg',
      '-3deg',
      '-2deg',
      '-1deg',
      '1deg',
      '2deg',
      '3deg',
      '4deg',
      '5deg',
      '6deg',
    ];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoTextTop}>RESPONDE,</Text>
          <Text style={styles.logoTextBottom}>IRMÃO!</Text>
        </View>

        <Text style={[styles.subtittle, { transform: [{ rotate: sortRotation() }] }]}>{sortSubtittle()}</Text>

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

        {warn != null && (
          <BrutalModal
            visible={feedbackVisible}
            title="Aviso"
            cancelText="Ok"
            onCancel={() => setWarn(null)}
          >
            <Text style={styles.feedbackLabel}>
              {warn}
            </Text>
          </BrutalModal>
        )}
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
              placeholder="Nome (opcional)"
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
  subtittle: {
    fontFamily: Fonts.body,
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    // transform: [{ rotate: '-4deg' }],
  },
});
