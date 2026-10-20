import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Mensagem, type TipoMensagem } from "../src/components/Mensagem";
import { firebaseConfigurado } from "../src/services/firebase";
import { atualizarUsuario, criarUsuario, verificarConexao } from "../src/services/usuarios";
import { mensagemDeErro, validarUsuario, type ErrosFormulario } from "../src/utils/validacao";

type Aviso = { tipo: TipoMensagem; texto: string };
type Conexao = "verificando" | "ok" | "erro" | "naoConfigurado";

// Tela 1 — Cadastro. A mesma tela serve para EDITAR: quando chegam id/nome/email
// pela rota (vindos da listagem), ela entra em modo de edição.
export default function Cadastro() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; nome?: string; email?: string }>();
  const editandoId = typeof params.id === "string" && params.id ? params.id : null;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [carregando, setCarregando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [conexao, setConexao] = useState<Conexao>("verificando");
  const [conexaoErro, setConexaoErro] = useState("");
  const enviando = useRef(false); // trava contra envio duplo

  // Entrou (ou saiu) do modo de edição: preenche ou limpa os campos.
  useEffect(() => {
    setNome(typeof params.nome === "string" ? params.nome : "");
    setEmail(typeof params.email === "string" ? params.email : "");
    setErros({});
    setAviso(null);
  }, [params.id, params.nome, params.email]);

  // Teste mínimo de conexão: só lê, não cria nada.
  useEffect(() => {
    if (!firebaseConfigurado) {
      setConexao("naoConfigurado");
      return;
    }
    verificarConexao()
      .then(() => setConexao("ok"))
      .catch((e) => {
        setConexao("erro");
        setConexaoErro(mensagemDeErro(e));
      });
  }, []);

  function limpar() {
    setNome("");
    setEmail("");
    setErros({});
    setAviso(null);
  }

  function cancelarEdicao() {
    limpar();
    router.setParams({ id: undefined, nome: undefined, email: undefined });
  }

  async function enviar() {
    if (enviando.current) return;

    const v = validarUsuario(nome, email);
    setErros(v.erros);
    if (!v.ok) {
      setAviso({ tipo: "erro", texto: "Corrija os campos destacados." });
      return;
    }

    enviando.current = true;
    setCarregando(true);
    setAviso(null);
    try {
      if (editandoId) {
        await atualizarUsuario(editandoId, v.nome, v.email);
        limpar();
        router.setParams({ id: undefined, nome: undefined, email: undefined });
        router.navigate("/listagem");
      } else {
        await criarUsuario(v.nome, v.email);
        limpar();
        setAviso({ tipo: "sucesso", texto: "Usuário cadastrado com sucesso!" });
      }
    } catch (e) {
      // Em caso de falha, os campos continuam preenchidos para o usuário tentar de novo.
      setAviso({ tipo: "erro", texto: mensagemDeErro(e) });
    } finally {
      enviando.current = false;
      setCarregando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.pagina} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: editandoId ? "Editar" : "Cadastro" }} />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{editandoId ? "Editar usuário" : "Cadastro de usuários"}</Text>

        {conexao === "naoConfigurado" && (
          <Mensagem
            tipo="erro"
            texto="Firebase não configurado. Cadastre as variáveis EXPO_PUBLIC_FIREBASE_* e faça um novo deploy."
          />
        )}
        {conexao === "erro" && <Mensagem tipo="erro" texto={`Falha ao conectar: ${conexaoErro}`} />}
        {conexao === "ok" && <Text style={styles.conexaoOk}>● Conectado ao Firestore</Text>}

        <Text style={styles.rotulo}>Nome</Text>
        <TextInput
          style={[styles.input, erros.nome ? styles.inputErro : null]}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome"
          editable={!carregando}
          autoCapitalize="words"
        />
        {erros.nome ? <Text style={styles.erroCampo}>{erros.nome}</Text> : null}

        <Text style={styles.rotulo}>E-mail</Text>
        <TextInput
          style={[styles.input, erros.email ? styles.inputErro : null]}
          value={email}
          onChangeText={setEmail}
          placeholder="nome@site.com"
          editable={!carregando}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {erros.email ? <Text style={styles.erroCampo}>{erros.email}</Text> : null}

        {aviso && <Mensagem tipo={aviso.tipo} texto={aviso.texto} />}

        <View style={styles.botoes}>
          <Pressable
            style={[styles.botao, styles.botaoPrincipal, carregando && styles.botaoDesativado]}
            onPress={enviar}
            disabled={carregando}
            accessibilityRole="button"
          >
            {carregando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.textoBotaoPrincipal}>{editandoId ? "Salvar" : "Cadastrar"}</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.botao, styles.botaoSecundario, carregando && styles.botaoDesativado]}
            onPress={limpar}
            disabled={carregando}
            accessibilityRole="button"
          >
            <Text style={styles.textoBotaoSecundario}>Limpar</Text>
          </Pressable>
        </View>

        {editandoId && (
          <Pressable onPress={cancelarEdicao} disabled={carregando} accessibilityRole="button">
            <Text style={styles.link}>Cancelar edição</Text>
          </Pressable>
        )}

        <Link href="/listagem" style={styles.link}>
          Ver usuários cadastrados
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pagina: { flexGrow: 1, backgroundColor: "#ffffff", alignItems: "center" },
  conteudo: { width: "100%", maxWidth: 560, padding: 24, gap: 10 },
  titulo: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 4 },
  conexaoOk: { fontSize: 13, color: "#059669" },
  rotulo: { fontSize: 15, fontWeight: "600", color: "#374151", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  inputErro: { borderColor: "#ef4444" },
  erroCampo: { fontSize: 13, color: "#b91c1c" },
  botoes: { flexDirection: "row", gap: 10, marginTop: 8 },
  botao: {
    flex: 1,
    minHeight: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  botaoPrincipal: { backgroundColor: "#2563eb" },
  botaoSecundario: { backgroundColor: "#f3f4f6", borderWidth: 1, borderColor: "#d1d5db" },
  botaoDesativado: { opacity: 0.6 },
  textoBotaoPrincipal: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  textoBotaoSecundario: { color: "#374151", fontSize: 16, fontWeight: "600" },
  link: { fontSize: 16, color: "#2563eb", fontWeight: "600", marginTop: 8 },
});
