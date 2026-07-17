import BrutalButton from '@/components/ui/BrutalButton';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalModal from '@/components/ui/BrutalModal';
import { Colors, Fonts, Metrics, Spacing } from '@/constants/theme';
import { GameMode, useGame } from '@/hooks/useGameContext';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useRouter } from 'expo-router';
import { Star, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';

const STEP_TITLES: Record<string, string> = {
  nomes: 'Nomes dos Jogadores',
  quiz_multidao: 'Quiz - Nível Multidão',
  quiz_discipulo: 'Quiz - Nível Discípulo',
  quiz_apostolo: 'Quiz - Nível Apóstolo',
  quiz_teologico: 'Quiz Teológico',
  compartilhar_comunhao: 'Compartilhar - Nível Comunhão',
  compartilhar_testemunho: 'Compartilhar - Nível Testemunho',
  compartilhar_confissao: 'Compartilhar - Nível Confissão',
  torre: 'Torre de Babel',
  who_am_i: 'Quem Sou Eu',
};

export default function HomeScreen() {
  const router = useRouter();
  const { setGameMode, resetGame, setPlayers, syncQuestions } = useGame();
  const { isTabletLandscape } = useTabletLandscape();

  const [syncModalVisible, setSyncModalVisible] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState<'syncing' | 'success' | 'error'>('syncing');
  const [syncSteps, setSyncSteps] = React.useState<Record<string, 'pending' | 'loading' | 'success' | 'error'>>({
    nomes: 'pending',
    quiz_multidao: 'pending',
    quiz_discipulo: 'pending',
    quiz_apostolo: 'pending',
    quiz_teologico: 'pending',
    compartilhar_comunhao: 'pending',
    compartilhar_testemunho: 'pending',
    compartilhar_confissao: 'pending',
    torre: 'pending',
    who_am_i: 'pending',
  });

  const handleSyncSheet = async () => {
    // Reset steps
    setSyncSteps({
      nomes: 'pending',
      quiz_multidao: 'pending',
      quiz_discipulo: 'pending',
      quiz_apostolo: 'pending',
      quiz_teologico: 'pending',
      compartilhar_comunhao: 'pending',
      compartilhar_testemunho: 'pending',
      compartilhar_confissao: 'pending',
      torre: 'pending',
      who_am_i: 'pending',
    });
    setSyncStatus('syncing');
    setSyncModalVisible(true);

    try {
      await syncQuestions((stepKey, status) => {
        setSyncSteps(prev => ({ ...prev, [stepKey]: status }));
      });
      
      // Auto-complete pending items to success
      setSyncSteps(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k] === 'pending') {
            next[k] = 'success';
          }
        });
        return next;
      });

      setSyncStatus('success');
    } catch (error) {
      console.warn('Sync failed:', error);
      setSyncStatus('error');
    }
  };

  const [warn, setWarn] = React.useState<null | string>();
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);
  const [feedbackName, setFeedbackName] = React.useState('');
  const [feedbackComment, setFeedbackComment] = React.useState('');

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    setPlayers(prev => {
      if (prev.length === 1 && prev[0].name === 'Jogador') {
        return [];
      }
      return prev;
    });
    router.push('/players');
  };

  const handleStartQuemSouEu = () => {
    setGameMode('quem-sou-eu');
    resetGame();
    setPlayers(prev => {
      if (prev.length === 1 && prev[0].name === 'Jogador') {
        return [];
      }
      return prev;
    });
    router.push('/players');
  };

  const handleSendFeedback = async () => {
    if (!feedbackComment.trim()) {
      setWarn('Preencha o campo de feedback.');
      return;
    }

    const sanitizedName = feedbackName.trim().substring(0, 100).replace(/[<>]/g, '');
    const sanitizedFeedback = feedbackComment.substring(0, 1000).replace(/[<>]/g, '');

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
            name: sanitizedName || 'Irmão Anônimo',
            feedback: sanitizedFeedback,
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
      'Mandamento: Ame a Deus com tudo que tem!',
      'Mandamento: Ame aos outros como Jesus amou!',
      'Dica: Seu chamado é testemunhar e anunciar Jesus!',
      'Dica: Se deleite na presença do Senhor!',
      'Dica: A palavra de Deus é lâmpada para os nossos pés!',
      'Dica: Deus é especialista em recomeços!',
      'Dica: Não desista!',
      'Mandamento: Perdoe!',
      'Mandamento: Se arrependa!',
      'Mandamento: Busque a santidade!',
      'Mandamento: Ore sem cessar!',
      'Mandamento: Seja grato!',
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

  const gameButtons = (
    <View style={[styles.mainActions, isTabletLandscape && styles.mainActionsTablet]}>
      <BrutalButton
        variant="primary"
        fullWidth={true}
        onPress={() => handleStart('compartilhar')}
      >
        <Text style={{
          fontFamily: Fonts.subheading,
          fontWeight: '700',
          color: '#FFFFFF',
          fontSize: isTabletLandscape ? 20 : 18,
        }}>
          COMPARTILHAR
        </Text>
        <View style={styles.badgeContainer}>
          <Star size={16} color={Colors.primary} fill={Colors.primary} />
        </View>
      </BrutalButton>

      <BrutalButton
        variant="accent1"
        fullWidth={true}
        onPress={() => handleStart('quiz')}
      >
        QUIZ BÍBLICO
      </BrutalButton>

      <BrutalButton
        variant="accent2"
        fullWidth={true}
        onPress={() => handleStart('teologico')}
      >
        QUIZ TEOLÓGICO
      </BrutalButton>

      <BrutalButton
        variant="purple"
        fullWidth={true}
        onPress={handleStartQuemSouEu}
      >
        QUEM SOU EU?
      </BrutalButton>

      <BrutalButton
        variant="secondary"
        fullWidth={true}
        onPress={() => {
          setGameMode('torre');
          setPlayers([{ id: '1', name: 'Jogador', points: 0 }]);
          resetGame();
          router.push('/torre');
        }}
      >
        TORRE DE BABEL (solo)
      </BrutalButton>
    </View>
  );

  const secondaryButtons = (
    <View style={[styles.footerActionsTwo, isTabletLandscape && styles.footerActionsTwoTablet]}>
      <View style={styles.footerActions}>
        <View style={styles.halfWidth}>
          <BrutalButton
            variant="primary"
            size="small"
            onPress={() => router.push('/help')}
          >
            Ajuda
          </BrutalButton>
        </View>
        <View style={styles.halfWidth}>
          <BrutalButton
            variant="primary"
            size="small"
            onPress={() => router.push('/about')}
          >
            Sobre
          </BrutalButton>
        </View>
      </View>

      <View style={styles.feedbackSection}>
        <BrutalButton
          variant="primary"
          size="small"
          onPress={() => setFeedbackVisible(true)}
        >
          Feedback
        </BrutalButton>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Sync Button */}
      <TouchableOpacity
        style={styles.floatingSyncBtn}
        onPress={handleSyncSheet}
        activeOpacity={0.8}
      >
        <RefreshCw size={22} color={Colors.text} />
      </TouchableOpacity>

      {/* Sync Steps Modal */}
      <Modal
        visible={syncModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (syncStatus !== 'syncing') {
            setSyncModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.syncCard}>
            <Text style={styles.syncTitle}>Sincronizando Planilha</Text>
            
            <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
              {Object.keys(STEP_TITLES).map((key) => {
                const title = STEP_TITLES[key];
                const status = syncSteps[key] || 'pending';
                
                let statusText = 'Pendente';
                let statusColor = Colors.muted;
                let statusIcon = '⏳';
                
                if (status === 'loading') {
                  statusText = 'Baixando...';
                  statusColor = '#0052cc';
                  statusIcon = '🔄';
                } else if (status === 'success') {
                  statusText = 'Sucesso';
                  statusColor = '#107c41';
                  statusIcon = '✅';
                } else if (status === 'error') {
                  statusText = 'Erro';
                  statusColor = Colors.error;
                  statusIcon = '❌';
                }
                
                return (
                  <View key={key} style={styles.stepRow}>
                    <Text style={styles.stepName}>{title}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {statusIcon} {statusText}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.syncFooter}>
              {syncStatus === 'syncing' ? (
                <View style={styles.loadingFooter}>
                  <ActivityIndicator size="small" color={Colors.text} />
                  <Text style={styles.syncFooterText}>Buscando bênçãos e perguntas...</Text>
                </View>
              ) : syncStatus === 'success' ? (
                <View style={styles.actionFooter}>
                  <Text style={styles.syncSuccessText}>Sincronização concluída!</Text>
                  <BrutalButton
                    variant="primary"
                    fullWidth={true}
                    onPress={() => setSyncModalVisible(false)}
                  >
                    Glória a Deus! Continuar
                  </BrutalButton>
                </View>
              ) : (
                <View style={styles.actionFooter}>
                  <Text style={styles.syncErrorText}>Algumas abas não puderam ser baixadas.</Text>
                  <BrutalButton
                    variant="surface"
                    fullWidth={true}
                    onPress={() => setSyncModalVisible(false)}
                  >
                    Fechar
                  </BrutalButton>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {isTabletLandscape ? (
        // ── TABLET LANDSCAPE: two-column layout ──────────────────────────────
        <View style={styles.tabletRow}>
          {/* Left column: logo + secondary actions */}
          <View style={styles.tabletLeft}>
            <View style={styles.logoSection}>
              <Text style={[styles.logoTextTop, styles.logoTextTablet]}>RESPONDE,</Text>
              <Text style={[styles.logoTextBottom, styles.logoTextTablet]}>IRMÃO!</Text>
            </View>
            <Text style={[styles.subtittle, { transform: [{ rotate: sortRotation() }] }]}>{sortSubtittle()}</Text>
            {secondaryButtons}
          </View>

          {/* Right column: game mode buttons */}
          <View style={styles.tabletRight}>
            {gameButtons}
          </View>
        </View>
      ) : (
        // ── PORTRAIT: original single-column layout ───────────────────────────
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Logo Section */}
          <View style={styles.logoSection}>
            <Text style={styles.logoTextTop}>RESPONDE,</Text>
            <Text style={styles.logoTextBottom}>IRMÃO!</Text>
          </View>

          <Text style={[styles.subtittle, { transform: [{ rotate: sortRotation() }] }]}>{sortSubtittle()}</Text>

          {gameButtons}
          {secondaryButtons}
        </ScrollView>
      )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // ── Portrait layout ─────────────────────────────────────────────────────
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Metrics.containerMargin,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
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
    flexDirection: 'column',
    width: '100%',
    gap: 16,
    marginTop: 32,
  },
  gridItemText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 600,
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  footerActionsTwo: {
    width: '100%',
    gap: 12,
    marginTop: 16,
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
  },
  // ── Tablet Landscape layout ──────────────────────────────────────────────
  tabletRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: Metrics.containerMargin,
    paddingVertical: 20,
    gap: 24,
  },
  tabletLeft: {
    flex: 4,
    justifyContent: 'center',
    gap: 12,
  },
  tabletRight: {
    flex: 6,
    justifyContent: 'center',
  },
  logoTextTablet: {
    fontSize: 52,
    lineHeight: 58,
  },
  mainActionsTablet: {
    marginTop: 0,
    gap: 12,
  },
  footerActionsTwoTablet: {
    marginTop: 8,
    gap: 10,
  },
  // ── Sync Modal & Floating Button Styles ───────────────────────────────────
  floatingSyncBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 99,
    width: 48,
    height: 48,
    borderRadius: Metrics.radiusButton,
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.border,
    shadowOffset: { width: Metrics.shadowOffset, height: Metrics.shadowOffset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  syncCard: {
    backgroundColor: Colors.background,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 20,
    shadowColor: Colors.border,
    shadowOffset: { width: Metrics.shadowOffset, height: Metrics.shadowOffset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  syncTitle: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepsList: {
    flexGrow: 0,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '33',
  },
  stepName: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    paddingRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },
  syncFooter: {
    marginTop: 10,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  syncFooterText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.text,
    fontStyle: 'italic',
  },
  actionFooter: {
    alignItems: 'center',
    gap: 12,
  },
  syncSuccessText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: '#107c41',
    textAlign: 'center',
    marginBottom: 4,
  },
  syncErrorText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 4,
  },
});

