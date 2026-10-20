export type ErrosFormulario = { nome?: string; email?: string };

export type ResultadoValidacao = {
  ok: boolean;
  erros: ErrosFormulario;
  nome: string;
  email: string;
};

// Validação básica: campos obrigatórios e formato simples de e-mail (algo@dominio.ext).
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarUsuario(nomeBruto: string, emailBruto: string): ResultadoValidacao {
  const nome = nomeBruto.trim();
  const email = emailBruto.trim();
  const erros: ErrosFormulario = {};

  if (!nome) erros.nome = "Informe o nome.";
  if (!email) erros.email = "Informe o e-mail.";
  else if (!FORMATO_EMAIL.test(email)) erros.email = "E-mail inválido. Exemplo: nome@site.com";

  return { ok: Object.keys(erros).length === 0, erros, nome, email };
}

// Transforma o erro do Firebase em uma frase fácil de entender.
export function mensagemDeErro(e: unknown): string {
  const erro = e as { code?: string; message?: string };
  if (erro?.code === "permission-denied") {
    return "Sem permissão no Firestore. Publique as regras do arquivo firestore.rules no Firebase Console.";
  }
  if (erro?.code === "unavailable") {
    return "Sem conexão com o Firebase. Verifique a internet e tente de novo.";
  }
  return erro?.message ?? "Erro inesperado. Tente novamente.";
}
