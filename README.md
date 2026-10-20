# expo-pwa
App em React + Expo e PWA para exemplo em sala de aula. Conexão com Firebase.

CRUD de usuários (nome e e-mail) no Cloud Firestore, com duas telas: **Cadastro** (também usada para editar) e **Listagem**.

## Sobre o app

### O que é
Um app didático para mostrar, na prática, como uma aplicação web instalável (PWA) conversa com um banco de dados na nuvem (Firebase Firestore). Ele faz as quatro operações básicas, chamadas de CRUD: **criar**, **ler**, **editar** e **excluir** usuários. Funciona no navegador do computador e do celular e pode ser instalado na tela inicial.

### Tecnologias
- React + Expo (com Expo Router) e TypeScript.
- Firebase JavaScript SDK e Cloud Firestore.
- PWA: manifesto, ícones e service worker.
- Hospedagem na Vercel.

### Tela 1 — Cadastro
- Título "Cadastro de usuários".
- Campos **Nome** e **E-mail**, ambos obrigatórios. O e-mail precisa ter um formato válido (por exemplo, `nome@site.com`).
- Botão **Cadastrar**: grava o usuário no Firestore. Mostra um indicador de carregamento enquanto envia e uma mensagem de sucesso ou de erro. Durante o envio, o botão fica travado para não gravar duas vezes.
- Botão **Limpar**: apaga o que foi digitado.
- Depois de cadastrar, os campos são limpos e há um link para ver a lista.
- Um aviso mostra se o app conseguiu conectar ao Firestore.
- **Modo edição:** ao tocar em "Editar" na lista, esta mesma tela abre com os dados do usuário. O botão passa a ser **Salvar** e aparece **Cancelar edição**. Ao salvar, o app volta para a lista.

### Tela 2 — Listagem
- Título "Usuários cadastrados".
- Mostra o **nome** e o **e-mail** de cada usuário gravado no Firestore, do mais novo para o mais antigo.
- Mostra um indicador de carregamento, uma mensagem quando não há nenhum usuário e uma mensagem de erro se a consulta falhar.
- Botão **Atualizar**: busca a lista de novo. A lista também é buscada sozinha ao abrir a tela e ao voltar do cadastro.
- Botão **Editar**: leva o usuário para a tela de cadastro, em modo edição.
- Botão **Excluir**: pede confirmação ("Excluir este usuário?") antes de apagar. Se der erro, o usuário continua na lista e aparece uma mensagem.
- Link **Voltar ao cadastro**.

### Dados
Os dados ficam na coleção `usuarios` do Firestore. Cada documento tem:

| Campo | Tipo | Para que serve |
|---|---|---|
| `nome` | texto | Nome do usuário |
| `email` | texto | E-mail do usuário |
| `createdAt` | data e hora | Quando foi criado (o servidor do Firebase preenche) |
| `updatedAt` | data e hora | Última alteração (o servidor do Firebase preenche) |

O identificador de cada documento é gerado pelo próprio Firestore. O nome e o e-mail nunca são usados como identificador.

### Como o PWA funciona
- **Instalável:** o app tem manifesto, ícones e abre em modo `standalone`, sem a barra do navegador.
- **Cache só do que é do app:** o service worker guarda as telas e os ícones. Os dados do Firebase nunca ficam em cache, então a lista não fica velha.
- **Atualizações:** as páginas buscam primeiro na internet. Quando você publica uma versão nova, ela aparece sozinha.

## Como colocar para funcionar (só no navegador, sem rodar nada na sua máquina)

### 1. Firebase Console (https://console.firebase.google.com)
1. **Adicionar projeto** → dê um nome → crie.
2. Na página inicial do projeto, clique no ícone **`</>` (Web)** → dê um apelido → **Registrar app**.
3. Copie os valores do `firebaseConfig` que aparecer (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
4. Menu **Build → Firestore Database → Criar banco de dados** → escolha uma região → modo **produção**.
5. Aba **Regras** → apague tudo → cole o conteúdo do arquivo [`firestore.rules`](./firestore.rules) → **Publicar**.

### 2. Vercel
1. **Add New → Project** → importe o repositório `expo-pwa`. Não mude nada: o `vercel.json` já traz os comandos.
2. Antes do deploy (ou depois, em **Settings → Environment Variables**), cadastre estas 6 variáveis com os valores do passo 1.3:

| Variável | Valor do firebaseConfig |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | apiKey |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | authDomain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | projectId |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | appId |

3. **Importante:** essas variáveis são gravadas no momento do build. Depois de cadastrá-las, faça **Deployments → ⋯ → Redeploy**.

## Estrutura
- `app/index.tsx` — Tela 1: cadastro e edição (mesma tela).
- `app/listagem.tsx` — Tela 2: lista, editar e excluir (com confirmação).
- `app/+html.tsx` — manifesto, cor do tema e registro do service worker.
- `src/services/firebase.ts` — inicialização do Firebase (lê as variáveis `EXPO_PUBLIC_*`).
- `src/services/usuarios.ts` — todas as operações do Firestore (CREATE, READ, UPDATE, DELETE).
- `src/utils/validacao.ts` — validação dos campos e mensagens de erro.
- `public/manifest.webmanifest`, `public/sw.js`, `public/*.png` — PWA.
- `firestore.rules` — regras **temporárias** (veja a seção de segurança).

## Decisões
- **Leitura com `getDocs`** (consulta pontual), não em tempo real: é mais simples e basta aqui. A lista recarrega ao abrir a tela e no botão "Atualizar".
- **Service worker próprio**: guarda em cache só os arquivos do app. Os dados do Firebase (outro domínio) nunca passam pelo cache, então a lista não fica desatualizada. As páginas usam "rede primeiro", então um deploy novo aparece sem precisar limpar nada.

## Segurança (leia antes de divulgar o link)
- A `apiKey` do Firebase **só identifica o projeto**. Ela não protege o banco.
- As regras do `firestore.rules` deixam **qualquer pessoa** ler e escrever na coleção `usuarios` **até 02/11/2026**; depois disso o Firestore bloqueia tudo sozinho. Servem só para o teste.
- **Pendente:** Firebase Authentication + regras por usuário. Não foi implementado porque não foi autorizado.
- Nunca coloque chave de service account ou credencial de administrador neste projeto.

## Lista de verificação (Checkpoint 6)
Legenda: ✅ verificado com evidência · ⬜ **ainda não verificado** (depende do deploy na Vercel e do Firebase real).

- ✅ Validação de nome e e-mail (testada em Node: vazios, e-mail sem domínio, e-mail válido com espaços).
- ✅ Arquivos JSON (`package.json`, `app.json`, `vercel.json`, manifesto) são JSON válido.
- ✅ Sintaxe do `sw.js` e do TypeScript sem erros.
- ✅ Ícones existem nos tamanhos 192, 512 (comum e maskable), favicon e ícone do app.
- ✅ Nenhuma credencial administrativa no código; o Firebase é configurado só por variáveis `EXPO_PUBLIC_*`.
- ⬜ A aplicação abre no navegador.
- ⬜ O build web conclui (`npx expo export -p web`).
- ⬜ As duas telas funcionam e a navegação entre elas.
- ⬜ O cadastro grava no Firestore (conferir em Firestore Database → `usuarios`).
- ⬜ A listagem mostra os documentos reais.
- ⬜ Editar persiste depois de recarregar a página.
- ⬜ Excluir persiste depois de recarregar a página.
- ⬜ Erros de conexão aparecem como mensagem (testar com regras bloqueadas ou sem internet).
- ⬜ Manifesto válido e app instalável (Chrome F12 → Application → Manifest).
- ⬜ Service worker ativo e sem servir versão antiga.
- ⬜ Regras de segurança substituídas por regras com autenticação (pendente de autorização).
