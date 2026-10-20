import { StyleSheet, Text, View } from "react-native";
import { coresAvatar } from "../theme";

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] ?? "" : "";
  return (primeira + ultima).toUpperCase();
}

// A cor depende do nome, então a mesma pessoa sempre tem a mesma cor.
function corDoNome(nome: string) {
  let soma = 0;
  for (let i = 0; i < nome.length; i++) soma += nome.charCodeAt(i);
  return coresAvatar[soma % coresAvatar.length];
}

export function Avatar({ nome, tamanho = 44 }: { nome: string; tamanho?: number }) {
  const cor = corDoNome(nome);
  return (
    <View
      style={[
        styles.circulo,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: cor.fundo },
      ]}
    >
      <Text style={[styles.letras, { color: cor.letra, fontSize: tamanho * 0.38 }]}>{iniciais(nome)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: { alignItems: "center", justifyContent: "center" },
  letras: { fontWeight: "700" },
});
