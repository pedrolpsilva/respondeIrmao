import BrutalHeader from '@/components/ui/BrutalHeader';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import pkg from '../../package.json';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <BrutalHeader title="Sobre o Jogo" />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.bodyText}>
              O <Text style={styles.bold}>Responde, Irmão!</Text> é um jogo mobile <Text style={styles.italic}>pass-and-play</Text> (responde e passa) cristão, desenvolvido especialmente para conectar jovens e adultos em momentos de <Text style={styles.bold}>comunhão</Text>.
            </Text>
            <Text style={styles.bodyText}>
              Nossa missão é proporcionar <Text style={styles.bold}>diversão saudável</Text> enquanto estimulamos o aprendizado e o compartilhamento da palavra, fortalecendo laços de amizade e fé.
            </Text>
            <Text style={styles.bodyText}>
              Ajudando meus irmãos e irmãs a serem não só filhos do <Text style={styles.bold}>verdadeiro e único Deus</Text>, mas também <Text style={styles.bold}>irmãos uns dos outros</Text>.
            </Text>
          </View>

          <View style={styles.cardHighlight}>
            <Text style={styles.highlightTitle}>Detalhes</Text>
            <Text style={styles.highlightText}>
              Versão do jogo: {pkg.version}
            </Text>
            <Text style={styles.bodyText}>
              Desenvolvido por: {pkg.author.name} - {pkg.author.email}
            </Text>
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
  card: {
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    marginBottom: 24,
  },
  cardHighlight: {
    backgroundColor: Colors.warning,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    marginBottom: 24,
  },
  bodyText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontFamily: Fonts.bodyBold,
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  highlightTitle: {
    fontFamily: Fonts.subheading,
    fontSize: 20,
    marginBottom: 8,
    color: Colors.border,
  },
  highlightText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.border,
    lineHeight: 22,
  },
});
