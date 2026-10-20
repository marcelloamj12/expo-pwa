import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { cores, raio } from "../theme";

type Props = Pick<
  TextInputProps,
  "value" | "onChangeText" | "placeholder" | "editable" | "keyboardType" | "autoCapitalize" | "autoCorrect"
> & {
  rotulo: string;
  erro?: string;
};

export function Campo({ rotulo, erro, ...resto }: Props) {
  const [focado, setFocado] = useState(false);
  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        {...resto}
        accessibilityLabel={rotulo}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        placeholderTextColor="#8AA0A4"
        style={[styles.input, focado && styles.focado, !!erro && styles.comErro]}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: "600", color: cores.texto },
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: raio.medio,
    paddingHorizontal: 14,
    fontSize: 16,
    color: cores.texto,
    backgroundColor: cores.fundo,
    outlineWidth: 0,
  },
  focado: { borderColor: cores.primaria, backgroundColor: cores.superficie },
  comErro: { borderColor: cores.perigo },
  erro: { fontSize: 13, color: cores.perigo },
});
