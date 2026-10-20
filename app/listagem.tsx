import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Mensagem } from "../src/components/Mensagem";
import { firebaseConfigurado } from "../src/services/firebase";
import { excluirUsuario, listarUsuarios } from "../src/services/usuarios";
import type { Usuario } from "../src/types";
import { mensagemDeErro } from "../src/utils/validacao";

// Tela 2 — Listagem. Busca os registros reais do Firestore toda vez que a tela ganha foco
// (ao abrir e ao voltar do cadastro) e também pelo botão "Atualizar".
export default function Listagem() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!firebaseConfigurado) {
      setErro("Firebase não configurado. Cadastre as variáveis EXPO_PUBLIC_FIREBASE_* e faça um novo deploy.");
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      setUsuarios(await listarUsuarios());
    } catch (e) {
      // Mantém a lista que já estava na tela; só mostra o erro.
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function editar(u: Usuario) {
    router.navigate({ pathname: "/", params: { id: u.id, nome: u.nome, email: u.email } });
  }

  async function confirmarExclusao(id: string) {
    if (excluindoId) return;
    setExcluindoId(id);
    setErroExclusao(null);
    try {
      await excluirUsuario(id);
      setConfirmandoId(null);
      await carregar(); // recarrega do Firestore para refletir o que foi gravado
    } catch (e) {
      // Falhou: o registro continua na lista.
      setErroExclusao(mensagemDeErro(e));
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.pagina}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Usuários cadastrados</Text>

        <View style={styles.barra}>
          <Pressable
            style={[styles.botaoAtualizar, carregando && styles.desativado]}
            onPress={carregar}
            disabled={carregando}
            accessibilityRole="button"
          >
            <Text style={styles.textoAtualizar}>Atualizar</Text>
          </Pressable>
          <Link href="/" style={styles.link}>
            Voltar ao cadastro
          </Link>
        </View>

        {erro && <Mensagem tipo="erro" texto={`Não foi possível carregar: ${erro}`} />}
        {erroExclusao && <Mensagem tipo="erro" texto={`Não foi possível excluir: ${erroExclusao}`} />}

        {carregando && <ActivityIndicator size="large" color="#2563eb" style={styles.carregando} />}

        {!carregando && !erro && usuarios.length === 0 && (
          <Text style={styles.vazio}>Nenhum usuário cadastrado ainda.</Text>
        )}

        {usuarios.map((u) => (
          <View key={u.id} style={styles.cartao}>
            <Text style={styles.nome}>{u.nome}</Text>
            <Text style={styles.email}>{u.email}</Text>

            {confirmandoId === u.id ? (
              <View style={styles.confirmacao}>
                <Text style={styles.pergunta}>Excluir este usuário?</Text>
                <View style={styles.linhaBotoes}>
                  <Pressable
                    style={[styles.btn, styles.btnPerigo, excluindoId === u.id && styles.desativado]}
                    onPress={() => confirmarExclusao(u.id)}
                    disabled={excluindoId === u.id}
                    accessibilityRole="button"
                  >
                    {excluindoId === u.id ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.txtBtnClaro}>Sim, excluir</Text>
                    )}
                  </Pressable>
                  <Pressable
                    style={[styles.btn, styles.btnNeutro]}
                    onPress={() => setConfirmandoId(null)}
                    disabled={excluindoId === u.id}
                    accessibilityRole="button"
                  >
                    <Text style={styles.txtBtnEscuro}>Cancelar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.linhaBotoes}>
                <Pressable
                  style={[styles.btn, styles.btnNeutro]}
                  onPress={() => editar(u)}
                  accessibilityRole="button"
                >
                  <Text style={styles.txtBtnEscuro}>Editar</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.btnContorno]}
                  onPress={() => {
                    setErroExclusao(null);
                    setConfirmandoId(u.id);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={styles.txtBtnPerigo}>Excluir</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pagina: { flexGrow: 1, backgroundColor: "#ffffff", alignItems: "center" },
  conteudo: { width: "100%", maxWidth: 560, padding: 24, gap: 12 },
  titulo: { fontSize: 24, fontWeight: "700", color: "#111827" },
  barra: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  botaoAtualizar: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textoAtualizar: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  link: { fontSize: 16, color: "#2563eb", fontWeight: "600" },
  carregando: { marginVertical: 24 },
  vazio: { fontSize: 16, color: "#6b7280", textAlign: "center", marginVertical: 24 },
  cartao: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    gap: 4,
    backgroundColor: "#ffffff",
  },
  nome: { fontSize: 17, fontWeight: "600", color: "#111827" },
  email: { fontSize: 15, color: "#4b5563", marginBottom: 8 },
  linhaBotoes: { flexDirection: "row", gap: 10 },
  confirmacao: { gap: 8 },
  pergunta: { fontSize: 15, fontWeight: "600", color: "#991b1b" },
  btn: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  btnNeutro: { backgroundColor: "#f3f4f6", borderWidth: 1, borderColor: "#d1d5db" },
  btnContorno: { borderWidth: 1, borderColor: "#f87171", backgroundColor: "#ffffff" },
  btnPerigo: { backgroundColor: "#dc2626" },
  txtBtnEscuro: { color: "#374151", fontSize: 15, fontWeight: "600" },
  txtBtnClaro: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  txtBtnPerigo: { color: "#b91c1c", fontSize: 15, fontWeight: "600" },
  desativado: { opacity: 0.6 },
});
