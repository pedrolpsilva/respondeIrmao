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
              <Text style={styles.badgeText}>Modo Compartilhar</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.rule}>• Modo amigável voltado à comunhão.</Text>
              <Text style={styles.rule}>• Não possui pontuação, vencedores ou tempo.</Text>
              <Text style={styles.rule}>• Responda à pergunta com liberdade e profundidade.</Text>
              <Text style={styles.rule}>• Níveis: Comunhão (leve), Testemunho (médio), Confissão (profundo).</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: Colors.accent1 }]}>
              <Text style={styles.badgeText}>Modo Quiz</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.rule}>• Modo competitivo sobre conhecimentos bíblicos.</Text>
              <Text style={styles.rule}>• Acertos concedem 1 ponto.</Text>
              <Text style={styles.rule}>• Acertar 3 seguidas ativa o status <Text style={styles.bold}>Ungido</Text> (+2 pontos por acerto).</Text>
              <Text style={styles.rule}>• Atenção ao tempo, pontuação e demais regras configuradas!</Text>
              <Text style={styles.rule}>• Níveis: Multidão (fácil), Discípulo (médio), Apóstolo (difícil).</Text>
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
