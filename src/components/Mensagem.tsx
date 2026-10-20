import { StyleSheet, Text, View } from "react-native";
import { cores, raio } from "../theme";

export type TipoMensagem = "sucesso" | "erro" | "info";

type Props = { tipo: TipoMensagem; texto: string };

export function Mensagem({ tipo, texto }: Props) {
  return (
    <View style={[styles.caixa, estilos[tipo]]} accessibilityRole="alert">
      <View style={[styles.barra, barras[tipo]]} />
      <Text style={[styles.texto, textos[tipo]]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: "row",
    borderRadius: raio.medio,
    overflow: "hidden",
    alignItems: "stretch",
  },
  barra: { width: 5 },
  texto: { flex: 1, fontSize: 15, lineHeight: 21, paddingVertical: 12, paddingHorizontal: 14 },
});

const estilos = StyleSheet.create({
  sucesso: { backgroundColor: cores.sucessoClaro },
  erro: { backgroundColor: cores.perigoClaro },
  info: { backgroundColor: cores.primariaClara },
});

const barras = StyleSheet.create({
  sucesso: { backgroundColor: cores.sucesso },
  erro: { backgroundColor: cores.perigo },
  info: { backgroundColor: cores.primaria },
});

const textos = StyleSheet.create({
  sucesso: { color: "#0E4F31" },
  erro: { color: "#8A1F28" },
  info: { color: cores.primariaEscura },
});
