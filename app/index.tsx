import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

// Tela 1 — Cadastro (vazia por enquanto; o formulário entra no Checkpoint 3).
export default function Cadastro() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de usuários</Text>
      <Text style={styles.text}>O formulário entra no Checkpoint 3.</Text>
      <Link href="/listagem" style={styles.link}>
        Ver usuários cadastrados
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, backgroundColor: "#ffffff" },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  text: { fontSize: 16, color: "#4b5563" },
  link: { fontSize: 16, color: "#2563eb", fontWeight: "600" },
});
