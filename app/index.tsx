import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Botao } from "../src/components/Botao";
import { Campo } from "../src/components/Campo";
import { Mensagem, type TipoMensagem } from "../src/components/Mensagem";
import { Pagina } from "../src/components/Pagina";
import { firebaseConfigurado } from "../src/services/firebase";
import { atualizarUsuario, criarUsuario, verificarConexao } from "../src/services/usuarios";
import { cores, raio } from "../src/theme";
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
        setAviso({ tipo: "sucesso", texto: "Usuário cadastrado com sucesso." });
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
    <Pagina>
      <Stack.Screen options={{ title: editandoId ? "Editar usuário" : "Cadastro de usuários" }} />

      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>{editandoId ? "Editar usuário" : "Cadastro de usuários"}</Text>
        <Text style={styles.subtitulo}>
          {editandoId
            ? "Altere os dados e toque em Salvar alterações."
            : "Preencha o nome e o e-mail e toque em Cadastrar."}
        </Text>
      </View>

      {conexao === "naoConfigurado" && (
        <Mensagem
          tipo="erro"
          texto="Firebase não configurado. Cadastre as variáveis EXPO_PUBLIC_FIREBASE_* na Vercel e faça um novo deploy."
        />
      )}
      {conexao === "erro" && <Mensagem tipo="erro" texto={`Não foi possível conectar: ${conexaoErro}`} />}

      <View style={styles.cartao}>
        <Campo
          rotulo="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Maria da Silva"
          editable={!carregando}
          autoCapitalize="words"
          erro={erros.nome}
        />
        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="Ex.: maria@site.com"
          editable={!carregando}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          erro={erros.email}
        />

        {aviso && <Mensagem tipo={aviso.tipo} texto={aviso.texto} />}

        <Botao
          titulo={editandoId ? "Salvar alterações" : "Cadastrar"}
          onPress={enviar}
          carregando={carregando}
          larguraTotal
        />

        <View style={styles.secundarios}>
          <Botao titulo="Limpar" variante="texto" onPress={limpar} desativado={carregando} pequeno />
          {editandoId && (
            <Botao
              titulo="Cancelar edição"
              variante="textoPerigo"
              onPress={cancelarEdicao}
              desativado={carregando}
              pequeno
            />
          )}
        </View>
      </View>

      <Botao titulo="Ver usuários cadastrados" variante="contorno" onPress={() => router.navigate("/listagem")} larguraTotal />

      {conexao === "ok" && (
        <View style={styles.status}>
          <View style={styles.ponto} />
          <Text style={styles.statusTexto}>Conectado ao Firestore</Text>
        </View>
      )}
    </Pagina>
  );
}

const styles = StyleSheet.create({
  cabecalho: { gap: 4, paddingTop: 4 },
  titulo: { fontSize: 26, fontWeight: "800", color: cores.texto, letterSpacing: -0.5 },
  subtitulo: { fontSize: 15, lineHeight: 22, color: cores.textoSuave },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.grande,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 20,
    gap: 16,
  },
  secundarios: { flexDirection: "row", justifyContent: "space-between", marginTop: -4 },
  status: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  ponto: { width: 8, height: 8, borderRadius: 4, backgroundColor: cores.sucesso },
  statusTexto: { fontSize: 13, color: cores.textoSuave },
});
