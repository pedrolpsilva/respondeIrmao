import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeader from '@/components/ui/BrutalHeader';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import * as Application from 'expo-application';
import { Mail } from 'lucide-react-native';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const handleEmailPress = async () => {
    try {
      await Linking.openURL('mailto:PEDRO.LPO.OFICIAL@GMAIL.COM');
    } catch (error) {
      console.error('Erro ao abrir aplicativo de e-mail:', error);
    }
  };

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

          <View style={styles.section}>
            <View style={[styles.badge, { backgroundColor: Colors.warning }]}>
              <Text style={styles.badgeText}>Detalhes</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Versão do jogo: </Text>
                {Application.nativeApplicationVersion || '1.0.0'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Desenvolvido por: </Text>
                Pedro Luiz PS
              </Text>
              <Text style={[styles.detailText, { marginBottom: 16 }]}>
                <Text style={styles.bold}>Contato: </Text>
                PEDRO.LPO.OFICIAL@GMAIL.COM
              </Text>

              <BrutalButton
                variant="primary"
                size="medium"
                onPress={handleEmailPress}
              >
                <View style={styles.emailButtonContent}>
                  <Mail size={20} color="#FFFFFF" style={styles.emailIcon} />
                  <Text style={styles.emailButtonText}>Enviar E-mail</Text>
                </View>
              </BrutalButton>
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
  card: {
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    marginBottom: 24,
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
  cardDetails: {
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: 20,
    paddingTop: 24,
    zIndex: 2,
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
  detailText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  emailButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emailIcon: {
    marginRight: 4,
  },
  emailButtonText: {
    fontFamily: Fonts.subheading,
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 18,
  },
});
