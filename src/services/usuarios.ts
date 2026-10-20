import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Usuario } from "../types";
import { getDb } from "./firebase";

// Todas as operações do Firestore ficam aqui. As telas só chamam estas funções.
const COLECAO = "usuarios";

function colecao() {
  return collection(getDb(), COLECAO);
}

// Checkpoint 2: teste mínimo de conexão. Só LÊ (no máximo 1 documento); não cria nada.
export async function verificarConexao(): Promise<void> {
  await getDocs(query(colecao(), limit(1)));
}

// CREATE
export async function criarUsuario(nome: string, email: string): Promise<string> {
  const ref = await addDoc(colecao(), {
    nome,
    email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// READ (consulta pontual: mais simples que tempo real e suficiente para este exemplo;
// a tela tem botão "Atualizar" e recarrega ao voltar para ela)
export async function listarUsuarios(): Promise<Usuario[]> {
  const snap = await getDocs(query(colecao(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => {
    const dados = d.data() as { nome?: string; email?: string };
    return { id: d.id, nome: dados.nome ?? "", email: dados.email ?? "" };
  });
}

// UPDATE
export async function atualizarUsuario(id: string, nome: string, email: string): Promise<void> {
  await updateDoc(doc(getDb(), COLECAO, id), {
    nome,
    email,
    updatedAt: serverTimestamp(),
  });
}

// DELETE
export async function excluirUsuario(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), COLECAO, id));
}
