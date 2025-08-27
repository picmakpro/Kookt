import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../src/stores';
import { LoadingSpinner } from '../src/components/ui';

export default function Index() {
  const router = useRouter();
  const { isOnboardingCompleted, isLoading } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);

  // Attendre que le composant soit monté avant de naviguer
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      // Utiliser un petit délai pour s'assurer que le router est prêt
      const timer = setTimeout(() => {
        if (isOnboardingCompleted) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMounted, isLoading, isOnboardingCompleted, router]);

  return (
    <View style={{ flex: 1 }}>
      <LoadingSpinner 
        fullScreen 
        message="Chargement de Kookt..."
      />
    </View>
  );
}
