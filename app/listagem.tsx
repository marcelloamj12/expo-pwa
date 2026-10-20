import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Avatar } from "../src/components/Avatar";
import { Botao } from "../src/components/Botao";
import { Mensagem } from "../src/components/Mensagem";
import { Pagina } from "../src/components/Pagina";
import { firebaseConfigurado } from "../src/services/firebase";
import { excluirUsuario, listarUsuarios } from "../src/services/usuarios";
import { cores, raio } from "../src/theme";
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
      setErro("Firebase não configurado. Cadastre as variáveis EXPO_PUBLIC_FIREBASE_* na Vercel e faça um novo deploy.");
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

  const primeiraCarga = carregando && usuarios.length === 0 && !erro;
  const vazio = !carregando && !erro && usuarios.length === 0;

  return (
    <Pagina>
      <Stack.Screen options={{ title: "Usuários cadastrados" }} />

      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>Usuários cadastrados</Text>
          {usuarios.length > 0 && (
            <Text style={styles.subtitulo}>
              {usuarios.length} {usuarios.length === 1 ? "usuário" : "usuários"}
            </Text>
          )}
        </View>
        <Botao titulo="Atualizar" variante="suave" pequeno onPress={carregar} carregando={carregando} />
      </View>

      {erro && <Mensagem tipo="erro" texto={`Não foi possível carregar a lista: ${erro}`} />}
      {erroExclusao && <Mensagem tipo="erro" texto={`Não foi possível excluir: ${erroExclusao}`} />}

      {primeiraCarga && (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={styles.centroTexto}>Carregando usuários...</Text>
        </View>
      )}

      {vazio && (
        <View style={[styles.cartao, styles.vazio]}>
          <Text style={styles.vazioTitulo}>Nenhum usuário cadastrado</Text>
          <Text style={styles.vazioTexto}>Cadastre o primeiro e ele aparece aqui.</Text>
          <Botao titulo="Cadastrar usuário" onPress={() => router.navigate("/")} />
        </View>
      )}

      {usuarios.length > 0 && (
        <View style={styles.cartao}>
          {usuarios.map((u, i) => {
            const confirmando = confirmandoId === u.id;
            const excluindo = excluindoId === u.id;
            return (
              <View
                key={u.id}
                style={[styles.linha, i > 0 && styles.linhaDivisor, confirmando && styles.linhaPerigo]}
              >
                <View style={styles.pessoa}>
                  <Avatar nome={u.nome} />
                  <View style={styles.dados}>
                    <Text style={styles.nome} numberOfLines={1}>
                      {confirmando ? `Excluir ${u.nome}?` : u.nome}
                    </Text>
                    <Text style={styles.email} numberOfLines={1}>
                      {confirmando ? "Esta ação não pode ser desfeita." : u.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.acoes}>
                  {confirmando ? (
                    <>
                      <Botao
                        titulo="Excluir"
                        variante="perigo"
                        pequeno
                        carregando={excluindo}
                        onPress={() => confirmarExclusao(u.id)}
                      />
                      <Botao
                        titulo="Cancelar"
                        variante="contorno"
                        pequeno
                        desativado={excluindo}
                        onPress={() => setConfirmandoId(null)}
                      />
                    </>
                  ) : (
                    <>
                      <Botao titulo="Editar" variante="suave" pequeno onPress={() => editar(u)} />
                      <Botao
                        titulo="Excluir"
                        variante="textoPerigo"
                        pequeno
                        onPress={() => {
                          setErroExclusao(null);
                          setConfirmandoId(u.id);
                        }}
                      />
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Pagina>
  );
}

const styles = StyleSheet.create({
  cabecalho: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 4 },
  cabecalhoTexto: { flex: 1, gap: 2 },
  titulo: { fontSize: 26, fontWeight: "800", color: cores.texto, letterSpacing: -0.5 },
  subtitulo: { fontSize: 15, color: cores.textoSuave },
  centro: { alignItems: "center", gap: 12, paddingVertical: 48 },
  centroTexto: { fontSize: 15, color: cores.textoSuave },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.grande,
    borderWidth: 1,
    borderColor: cores.borda,
    overflow: "hidden",
  },
  vazio: { alignItems: "center", padding: 28, gap: 8 },
  vazioTitulo: { fontSize: 18, fontWeight: "700", color: cores.texto },
  vazioTexto: { fontSize: 15, color: cores.textoSuave, marginBottom: 8, textAlign: "center" },
  linha: { padding: 16, gap: 12 },
  linhaDivisor: { borderTopWidth: 1, borderTopColor: cores.borda },
  linhaPerigo: { backgroundColor: cores.perigoClaro },
  pessoa: { flexDirection: "row", alignItems: "center", gap: 12 },
  dados: { flex: 1, gap: 2 },
  nome: { fontSize: 17, fontWeight: "700", color: cores.texto },
  email: { fontSize: 14, color: cores.textoSuave },
  acoes: { flexDirection: "row", gap: 8, justifyContent: "flex-end" },
});
