import React from 'react';
import { Redirect } from 'expo-router';

export default function ShoppingListRedirect() {
  // Rediriger vers l'onglet shopping
  return <Redirect href="/(tabs)/shopping" />;
}
