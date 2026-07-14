import BrutalHeader from '@/components/ui/BrutalHeader';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <BrutalHeader title="Ajuda e Regras" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
              <Text style={styles.badgeText}>Compartilhar</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.rule}>• Modo amigável voltado à comunhão e conhecimento mútuo.</Text>
              <Text style={styles.rule}>• Não possui pontuação, vencedores ou tempo limite.</Text>
              <Text style={styles.rule}>• Responda à pergunta com liberdade e profundidade.</Text>
              <Text style={styles.rule}>• Níveis: Comunhão (leve), Testemunho (médio) e Confissão (profundo).</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: Colors.accent1 }]}>
              <Text style={styles.badgeText}>Quiz Bíblico</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.rule}>• Modo competitivo para testar conhecimentos sobre a Bíblia.</Text>
              <Text style={styles.rule}>• Cada acerto concede 1 ponto ao jogador da vez.</Text>
              <Text style={styles.rule}>• O jogo termina quando um jogador alcança a pontuação alvo configurada.</Text>
              <Text style={styles.rule}>• Níveis: Multidão (fácil), Discípulo (médio) e Apóstolo (difícil).</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: Colors.accent2 }]}>
              <Text style={styles.badgeText}>Quiz Teológico</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.rule}>• Modo focado no estudo e compreensão de termos teológicos essenciais.</Text>
              <Text style={styles.rule}>• Cada resposta correta concede 1 ponto.</Text>
              <Text style={styles.rule}>• Atenção: as respostas não precisam ser idênticas palavra por palavra, bastando que o jogador demonstre a compreensão do conceito.</Text>
              <Text style={styles.rule}>• Excelente para aprender conceitos como Trindade, Graça, Aliança, entre outros.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: Colors.warning }]}>
              <Text style={styles.badgeText}>Torre de Babel (Solo)</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.rule}>• Desafio solo extremo para testar seu conhecimento bíblico máximo.</Text>
              <Text style={styles.rule}>• Tente subir os 100 níveis da torre respondendo a perguntas que aumentam de dificuldade.</Text>
              <Text style={styles.rule}>• Cuidado: qualquer resposta errada resulta em queda imediata (Fim de Jogo)!</Text>
              <Text style={styles.rule}>• Classificação das perguntas: 30 fáceis, 30 médias, 30 difíceis e 10 muito difíceis.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: Colors.purple }]}>
              <Text style={styles.badgeText}>Quem Sou Eu?</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.rule}>• Jogo de adivinhação em grupo por rodadas e dicas numeradas.</Text>
              <Text style={styles.rule}>• O valor em pontos da palavra é igual ao número de dicas ainda não reveladas.</Text>
              <Text style={styles.rule}>• Em sua vez, o jogador escolhe um número de dica ainda fechado, lê e tenta adivinhar ou passa a vez.</Text>
              <Text style={styles.rule}>• Se a vez passar, o valor em pontos da palavra diminui em 1. Se todas as dicas forem reveladas, o acerto vale 1 ponto.</Text>
              <Text style={styles.rule}>• O primeiro jogador a alcançar o limite de pontuação configurado (20, 30 ou 40 pts) vence o jogo.</Text>
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
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    padding: Metrics.containerMargin,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: Colors.text,
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
    borderColor: Colors.border,
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
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    paddingTop: 24,
    zIndex: 2,
  },
  rule: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontFamily: Fonts.bodyBold,
    color: Colors.accent2,
  },
});
