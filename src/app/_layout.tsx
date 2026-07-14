import { DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Outfit_700Bold, Outfit_800ExtraBold, useFonts } from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors } from '@/constants/theme';
import { GameProvider } from '@/hooks/useGameContext';

import { ModalProvider } from '@/hooks/useModal';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_800ExtraBold,
    Outfit_700Bold,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalProvider>
        <GameProvider>
          <StatusBar hidden={true} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="players" />
            <Stack.Screen name="config" />
            <Stack.Screen name="game" />
            <Stack.Screen name="torre" />
            <Stack.Screen name="quem-sou-eu-config" />
            <Stack.Screen name="quem-sou-eu-game" />
            <Stack.Screen name="results" />
            <Stack.Screen name="about" />
            <Stack.Screen name="help" />
          </Stack>
        </GameProvider>
      </ModalProvider>
    </GestureHandlerRootView>
  );
}
