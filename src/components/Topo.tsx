import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores, raio } from "../theme";

// Barra do topo: nome do app e duas abas para trocar de tela.
export function Topo() {
  const router = useRouter();
  const naLista = usePathname().startsWith("/listagem");

  return (
    <View style={styles.faixa}>
      <View style={styles.interno}>
        <View style={styles.marca}>
          <View style={styles.logo}>
            <Text style={styles.logoLetra}>U</Text>
          </View>
          <Text style={styles.nomeApp}>Usuários</Text>
        </View>

        <View style={styles.abas} accessibilityRole="tablist">
          <Aba titulo="Cadastrar" ativa={!naLista} onPress={() => router.navigate("/")} />
          <Aba titulo="Lista" ativa={naLista} onPress={() => router.navigate("/listagem")} />
        </View>
      </View>
    </View>
  );
}

function Aba({ titulo, ativa, onPress }: { titulo: string; ativa: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: ativa }}
      style={[styles.aba, ativa && styles.abaAtiva]}
    >
      <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  faixa: { backgroundColor: cores.primaria, alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  interno: { width: "100%", maxWidth: 560, gap: 14 },
  marca: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    width: 34,
    height: 34,
    borderRadius: raio.pequeno,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetra: { color: cores.primaria, fontSize: 19, fontWeight: "800" },
  nomeApp: { color: "#FFFFFF", fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  abas: {
    flexDirection: "row",
    backgroundColor: cores.primariaEscura,
    borderRadius: raio.medio,
    padding: 4,
    gap: 4,
  },
  aba: { flex: 1, minHeight: 40, borderRadius: raio.pequeno, alignItems: "center", justifyContent: "center" },
  abaAtiva: { backgroundColor: "#FFFFFF" },
  abaTexto: { color: "#CFE9E9", fontSize: 15, fontWeight: "600" },
  abaTextoAtivo: { color: cores.primariaEscura, fontWeight: "700" },
});
