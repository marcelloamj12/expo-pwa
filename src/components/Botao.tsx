import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { cores, raio } from "../theme";

export type VarianteBotao = "primario" | "suave" | "contorno" | "perigo" | "texto" | "textoPerigo";

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: VarianteBotao;
  carregando?: boolean;
  desativado?: boolean;
  pequeno?: boolean;
  larguraTotal?: boolean;
};

const fundo: Record<VarianteBotao, string> = {
  primario: cores.primaria,
  suave: cores.primariaClara,
  contorno: cores.superficie,
  perigo: cores.perigo,
  texto: "transparent",
  textoPerigo: "transparent",
};

const letra: Record<VarianteBotao, string> = {
  primario: "#FFFFFF",
  suave: cores.primariaEscura,
  contorno: cores.texto,
  perigo: "#FFFFFF",
  texto: cores.primaria,
  textoPerigo: cores.perigo,
};

export function Botao({
  titulo,
  onPress,
  variante = "primario",
  carregando = false,
  desativado = false,
  pequeno = false,
  larguraTotal = false,
}: Props) {
  const bloqueado = desativado || carregando;
  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      style={({ pressed }) => [
        styles.base,
        pequeno ? styles.pequeno : styles.normal,
        larguraTotal && styles.total,
        { backgroundColor: fundo[variante] },
        variante === "contorno" && styles.contorno,
        pressed && styles.pressionado,
        bloqueado && styles.desativado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator size="small" color={letra[variante]} />
      ) : (
        <Text style={[styles.texto, pequeno && styles.textoPequeno, { color: letra[variante] }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", borderRadius: raio.medio },
  normal: { minHeight: 50, paddingHorizontal: 18 },
  pequeno: { minHeight: 38, paddingHorizontal: 14, borderRadius: raio.pequeno },
  total: { alignSelf: "stretch" },
  contorno: { borderWidth: 1.5, borderColor: cores.borda },
  pressionado: { opacity: 0.8 },
  desativado: { opacity: 0.55 },
  texto: { fontSize: 16, fontWeight: "700" },
  textoPequeno: { fontSize: 14 },
});
