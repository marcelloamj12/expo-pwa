import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// A barra do topo é desenhada pelo próprio app (componente Topo), por isso o cabeçalho padrão fica desligado.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </>
  );
}
