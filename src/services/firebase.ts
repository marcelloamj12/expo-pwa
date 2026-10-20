import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

// Os valores vêm das variáveis EXPO_PUBLIC_* (veja .env.example).
// Atenção: o Expo troca essas variáveis no momento do BUILD. Na Vercel, cadastre-as
// em Settings > Environment Variables e faça um novo deploy.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// A apiKey do Firebase só identifica o projeto. Ela NÃO protege o banco:
// quem protege são as regras do Firestore (firestore.rules) e, depois, a autenticação.
export const firebaseConfigurado: boolean = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Só inicializa se as variáveis existirem (evita quebrar o build/pré-renderização).
export function getDb(): Firestore {
  if (!firebaseConfigurado) {
    throw new Error(
      "Firebase não configurado. Preencha as variáveis EXPO_PUBLIC_FIREBASE_* (veja o README)."
    );
  }
  if (!db) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}
