import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Eye,
  MessageSquare,
  Moon,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react-native';

import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalModal from '@/components/ui/BrutalModal';
import BrutalSwitch from '@/components/ui/BrutalSwitch';
import ConfigBannerAd from '@/components/ui/ConfigBannerAd';
import { Fonts, Metrics, Spacing } from '@/constants/theme';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { ColorblindType } from '@/types/settings';

import { useTabletLandscape } from '@/hooks/useTabletLandscape';

const COLORBIND_OPTIONS: { id: ColorblindType; title: string; desc: string }[] = [
  {
    id: 'protanopia',
    title: 'Protanopia',
    desc: 'Dificuldade em perceber a luz vermelha',
  },
  {
    id: 'deuteranopia',
    title: 'Deuteranopia',
    desc: 'Dificuldade em perceber a luz verde',
  },
  {
    id: 'tritanopia',
    title: 'Tritanopia',
    desc: 'Dificuldade em perceber a luz azul',
  },
  {
    id: 'achromatopsia',
    title: 'Acromatopsia',
    desc: 'Visão monocromática (sem cores)',
  },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { isTablet, isTabletLandscape } = useTabletLandscape();
  const {
    soundEnabled,
    setSoundEnabled,
    darkMode,
    setDarkMode,
    colorblindMode,
    setColorblindMode,
    colorblindType,
    setColorblindType,
    isProMode,
    setIsProMode,
  } = useSettingsContext();

  // Feedback State
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [warnModal, setWarnModal] = useState<string | null>(null);

  const handleSendFeedback = async () => {
    if (!feedbackComment.trim()) {
      setWarnModal('Preencha o campo de feedback.');
      return;
    }

    const sanitizedName = feedbackName.trim().substring(0, 100).replace(/[<>]/g, '');
    const sanitizedFeedback = feedbackComment.substring(0, 1000).replace(/[<>]/g, '');

    try {
      const serviceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setWarnModal('Obrigado pelo seu feedback! Ele é muito importante para mim.');
        setFeedbackVisible(false);
        setFeedbackName('');
        setFeedbackComment('');
      } else {
        setWarnModal('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
      }
    } catch (error: any) {
      console.error('Erro ao enviar feedback:', error);
      if (error.name === 'AbortError') {
        setWarnModal('Tempo esgotado. Verifique sua conexão e tente novamente.');
      } else {
        setWarnModal('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
      }
    }
  };

  const renderLeftColumn = () => (
    <View style={isTabletLandscape ? styles.column : styles.fullWidthGroup}>
      {/* 1. SOM */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            {soundEnabled ? (
              <Volume2 size={isTablet ? 28 : 24} color={theme.text} />
            ) : (
              <VolumeX size={isTablet ? 28 : 24} color={theme.muted} />
            )}
            <View style={styles.titleTextGroup}>
              <Text style={[styles.cardTitle, { color: theme.text }, isTablet && styles.cardTitleTablet]}>Efeitos de Som</Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Efeitos sonoros nas partidas e sons de clique
              </Text>
            </View>
          </View>
          <BrutalSwitch value={soundEnabled} onValueChange={setSoundEnabled} />
        </View>
      </View>

      {/* 2. MODO ESCURO */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Moon size={isTablet ? 28 : 24} color={theme.text} />
            <View style={styles.titleTextGroup}>
              <Text style={[styles.cardTitle, { color: theme.text }, isTablet && styles.cardTitleTablet]}>Modo Escuro</Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Cor de fundo mais escura para ambientes com pouca luz
              </Text>
            </View>
          </View>
          <BrutalSwitch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      {/* 3. MODO PRÓ */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <ShieldCheck size={isTablet ? 28 : 24} color={theme.primary} />
            <View style={styles.titleTextGroup}>
              <View style={styles.proTitleRow}>
                <Text style={[styles.cardTitle, { color: theme.text }, isTablet && styles.cardTitleTablet]}>Modo PRÓ</Text>
                <View style={[styles.proBadge, { backgroundColor: theme.warning }]}>
                  <Text style={styles.proBadgeText}>SEM ADS</Text>
                </View>
              </View>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Desabilita todas as propagandas do aplicativo
              </Text>
            </View>
          </View>
          <BrutalSwitch value={isProMode} onValueChange={setIsProMode} />
        </View>
      </View>
    </View>
  );

  const renderRightColumn = () => (
    <View style={isTabletLandscape ? styles.column : styles.fullWidthGroup}>
      {/* 4. DALTONISMO */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Eye size={isTablet ? 28 : 24} color={theme.text} />
            <View style={styles.titleTextGroup}>
              <Text style={[styles.cardTitle, { color: theme.text }, isTablet && styles.cardTitleTablet]}>Modo Daltonismo</Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                Ajusta o contraste e as cores do app para acessibilidade
              </Text>
            </View>
          </View>
          <BrutalSwitch value={colorblindMode} onValueChange={setColorblindMode} />
        </View>

        {colorblindMode && (
          <View style={styles.colorblindSection}>
            <Text style={[styles.subSectionTitle, { color: theme.text }]}>
              Selecione o Tipo de Daltonismo:
            </Text>

            {COLORBIND_OPTIONS.map((opt) => {
              const isSelected = colorblindType === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.7}
                  onPress={() => setColorblindType(opt.id)}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: isSelected ? theme.background : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border,
                      borderWidth: isSelected ? 3 : 2,
                    },
                  ]}
                >
                  <View style={styles.optionRadioWrapper}>
                    <View
                      style={[
                        styles.radioOuter,
                        { borderColor: isSelected ? theme.primary : theme.border },
                      ]}
                    >
                      {isSelected && (
                        <View
                          style={[
                            styles.radioInner,
                            { backgroundColor: theme.primary },
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.optionTextGroup}>
                      <Text style={[styles.optionTitle, { color: theme.text }]}>
                        {opt.title}
                      </Text>
                      <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                        {opt.desc}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Sample palette preview */}
            <View style={styles.palettePreview}>
              <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>
                Amostra de cores adaptadas:
              </Text>
              <View style={styles.previewSwatches}>
                <View style={[styles.swatch, { backgroundColor: theme.primary }]} />
                <View style={[styles.swatch, { backgroundColor: theme.accent1 }]} />
                <View style={[styles.swatch, { backgroundColor: theme.accent2 }]} />
                <View style={[styles.swatch, { backgroundColor: theme.warning }]} />
                <View style={[styles.swatch, { backgroundColor: theme.purple }]} />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 5. CTA FEEDBACK */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.feedbackCardHeader}>
          <MessageSquare size={isTablet ? 28 : 24} color={theme.text} />
          <View style={styles.titleTextGroup}>
            <Text style={[styles.cardTitle, { color: theme.text }, isTablet && styles.cardTitleTablet]}>Feedback</Text>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              Envie sua opinião, sugestões ou relatos de melhoria para o desenvolvedor
            </Text>
          </View>
        </View>

        <View style={styles.feedbackBtnWrapper}>
          <BrutalButton
            variant="primary"
            size="medium"
            fullWidth={true}
            onPress={() => setFeedbackVisible(true)}
          >
            Enviar Feedback
          </BrutalButton>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <BrutalHeader title="CONFIGURAÇÕES" />
      <ConfigBannerAd />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isTabletLandscape && styles.scrollContentLandscape,
          isTablet && !isTabletLandscape && styles.scrollContentPortraitTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isTabletLandscape ? (
          <View style={styles.twoColumnWrapper}>
            {renderLeftColumn()}
            {renderRightColumn()}
          </View>
        ) : (
          <>
            {renderLeftColumn()}
            {renderRightColumn()}
          </>
        )}
      </ScrollView>

      {/* Warning / Confirmation Modal */}
      {warnModal != null && (
        <BrutalModal
          visible={true}
          title="Aviso"
          cancelText="Ok"
          onCancel={() => setWarnModal(null)}
        >
          <Text style={styles.feedbackLabel}>{warnModal}</Text>
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
            O que está achando do jogo? Compartilhe comigo e me ajude a abençoar mais pessoas através do seu feedback!
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
  },
  scrollContent: {
    paddingHorizontal: Metrics.containerMargin,
    paddingBottom: 40,
    gap: 16,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContentPortraitTablet: {
    maxWidth: 680,
  },
  scrollContentLandscape: {
    maxWidth: 960,
  },
  twoColumnWrapper: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  column: {
    flex: 1,
    gap: 16,
  },
  fullWidthGroup: {
    width: '100%',
    gap: 16,
  },
  card: {
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
    fontWeight: '700',
  },
  cardTitleTablet: {
    fontSize: 20,
  },
  cardDesc: {
    fontFamily: Fonts.body,
    fontSize: 13,
    marginTop: 2,
  },
  proTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  proBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    color: '#000000',
  },
  colorblindSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#00000022',
    gap: 10,
  },
  subSectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginBottom: 4,
  },
  optionRow: {
    borderRadius: Metrics.radiusButton,
    padding: 12,
  },
  optionRadioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionTextGroup: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: Fonts.subheading,
    fontSize: 15,
    fontWeight: '700',
  },
  optionDesc: {
    fontFamily: Fonts.body,
    fontSize: 12,
  },
  palettePreview: {
    marginTop: 10,
    gap: 6,
  },
  previewLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
  },
  previewSwatches: {
    flexDirection: 'row',
    gap: 8,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000000',
  },
  feedbackCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackBtnWrapper: {
    marginTop: 16,
  },
  modalContent: {
    marginTop: Spacing.two,
  },
  feedbackLabel: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: '#1C1917',
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

