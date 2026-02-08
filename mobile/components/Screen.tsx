import * as React from 'react';
import { View, Text } from 'react-native';

export function Screen({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10 }}>{title}</Text>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}
