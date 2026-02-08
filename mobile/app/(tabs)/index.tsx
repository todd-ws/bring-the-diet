import { View, Text } from 'react-native';

export default function Screen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>index</Text>
      <Text style={{ marginTop: 12, maxWidth: 720 }}>
        Foundation placeholder. Next steps: connect to API, add list/detail flows, and implement OIDC login.
      </Text>
    </View>
  );
}
