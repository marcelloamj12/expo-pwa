import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { cores } from "../theme";
import { Topo } from "./Topo";

// Moldura comum das duas telas: barra no topo e conteúdo centralizado.
export function Pagina({ children }: PropsWithChildren) {
  return (
    <View style={styles.tela}>
      <Topo />
      <ScrollView contentContainerStyle={styles.rolagem} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>{children}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  rolagem: { alignItems: "center", padding: 16, paddingBottom: 48 },
  conteudo: { width: "100%", maxWidth: 560, gap: 16 },
});
