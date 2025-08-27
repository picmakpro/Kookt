import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserStore } from '../src/stores';
import { colors } from '../src/constants';

// Créer une instance de Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

export default function RootLayout() {
  const initializeUser = useUserStore(state => state.initializeUser);

  useEffect(() => {
    // Initialiser l'utilisateur au démarrage
    initializeUser();
  }, [initializeUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" backgroundColor={colors.white} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.gray[900],
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.gray[50],
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            title: 'Accueil'
          }} 
        />
        <Stack.Screen 
          name="onboarding/index" 
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="ingredients/add" 
          options={{ 
            title: 'Ajouter des ingrédients',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="recipes/[id]" 
          options={{ 
            title: 'Recette',
            headerBackTitle: 'Retour'
          }} 
        />
        <Stack.Screen 
          name="shopping/list" 
          options={{ 
            title: 'Liste de courses',
            headerBackTitle: 'Retour'
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}
