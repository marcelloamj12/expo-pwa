import { StyleSheet, Text, View } from "react-native";

export type TipoMensagem = "sucesso" | "erro" | "info";

type Props = { tipo: TipoMensagem; texto: string };

export function Mensagem({ tipo, texto }: Props) {
  return (
    <View style={[styles.caixa, estilos[tipo]]} accessibilityRole="alert">
      <Text style={[styles.texto, textos[tipo]]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { padding: 12, borderRadius: 8, borderWidth: 1 },
  texto: { fontSize: 15 },
});

const estilos = StyleSheet.create({
  sucesso: { backgroundColor: "#ecfdf5", borderColor: "#34d399" },
  erro: { backgroundColor: "#fef2f2", borderColor: "#f87171" },
  info: { backgroundColor: "#eff6ff", borderColor: "#93c5fd" },
});

const textos = StyleSheet.create({
  sucesso: { color: "#065f46" },
  erro: { color: "#991b1b" },
  info: { color: "#1e40af" },
});
