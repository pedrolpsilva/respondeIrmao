import BrutalHeader from '@/components/ui/BrutalHeader';
import { Fonts, Metrics } from '@/constants/theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HelpScreen() {
  const theme = useTheme();
  const { isTablet, isTabletLandscape } = useTabletLandscape();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.inner, isTabletLandscape && styles.innerTabletLandscape, isTablet && !isTabletLandscape && styles.innerTabletPortrait]}>
        <BrutalHeader title="Ajuda e Regras" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[
          styles.scrollContainer,
          isTabletLandscape && styles.scrollContainerTablet
        ]}>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: theme.primary, borderColor: theme.border }]}>
              <Text style={styles.badgeText}>Compartilhar</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.rule, { color: theme.text }]}>• Modo amigável voltado à comunhão e conhecimento mútuo.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Não possui pontuação, vencedores ou tempo limite.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Responda à pergunta com liberdade e profundidade.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Níveis: Comunhão (leve), Testemunho (médio) e Confissão (profundo).</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: theme.accent1, borderColor: theme.border }]}>
              <Text style={styles.badgeText}>Quiz Bíblico</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.rule, { color: theme.text }]}>• Modo competitivo para testar conhecimentos sobre a Bíblia.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Cada acerto concede 1 ponto ao jogador da vez.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• O jogo termina quando um jogador alcança a pontuação alvo configurada.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Níveis: Multidão (fácil), Discípulo (médio) e Apóstolo (difícil).</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: theme.accent2, borderColor: theme.border }]}>
              <Text style={styles.badgeText}>Quiz Teológico</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.rule, { color: theme.text }]}>• Modo focado no estudo e compreensão de termos teológicos essenciais.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Cada resposta correta concede 1 ponto.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Atenção: as respostas não precisam ser idênticas palavra por palavra, bastando que o jogador demonstre a compreensão do conceito.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Excelente para aprender conceitos como Trindade, Graça, Aliança, entre outros.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: theme.warning, borderColor: theme.border }]}>
              <Text style={styles.badgeText}>Torre de Babel (Solo)</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.rule, { color: theme.text }]}>• Desafio solo extremo para testar seu conhecimento bíblico máximo em 100 andares.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Escolha entre 6 níveis de torre: Muito Fácil, Fácil, Médio, Difícil, Muito Difícil e Impossível.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Cada nível combina 100 perguntas divididas em 3 classes (Fácil, Médio e Difícil).</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Níveis avançados (Difícil, Muito Difícil e Impossível) possuem timer regressivo por pergunta!</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• As opções de resposta são identificadas com letras (A, B, C, D) para facilitar sua escolha.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Cuidado: errar uma resposta ou estourar o tempo resulta em queda imediata (Fim de Jogo)!</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: theme.purple, borderColor: theme.border }]}>
              <Text style={styles.badgeText}>Quem Sou Eu?</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.rule, { color: theme.text }]}>• Jogo de adivinhação em grupo por rodadas e dicas numeradas.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• O valor em pontos da palavra é igual ao número de dicas ainda não reveladas.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Em sua vez, o jogador escolhe um número de dica ainda fechado, lê e tenta adivinhar ou passa a vez.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• Se a vez passar, o valor em pontos da palavra diminui em 1. Se todas as dicas forem reveladas, o acerto vale 1 ponto.</Text>
              <Text style={[styles.rule, { color: theme.text }]}>• O primeiro jogador a alcançar o limite de pontuação configurado (20, 30 ou 40 pts) vence o jogo.</Text>
            </View>
          </View>
        </ScrollView>
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
    padding: Metrics.containerMargin,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  innerTablet: {
    maxWidth: 800,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  scrollContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
    columnGap: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: Metrics.borderWidth,
    borderRadius: 20,
    marginBottom: -12,
    marginLeft: 12,
    zIndex: 3,
  },
  badgeText: {
    fontFamily: Fonts.bodyBold,
    color: '#FFFFFF',
    fontSize: 14,
  },
  card: {
    borderWidth: Metrics.borderWidth,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    paddingTop: 24,
    zIndex: 2,
  },
  rule: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontFamily: Fonts.bodyBold,
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
