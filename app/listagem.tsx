import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

// Tela 2 — Listagem (vazia por enquanto; a consulta ao Firestore entra no Checkpoint 4).
export default function Listagem() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários cadastrados</Text>
      <Text style={styles.text}>A lista entra no Checkpoint 4.</Text>
      <Link href="/" style={styles.link}>
        Voltar ao cadastro
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
