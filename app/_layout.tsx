import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2563eb" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Cadastro" }} />
      <Stack.Screen name="listagem" options={{ title: "Listagem" }} />
    </Stack>
  );
}
