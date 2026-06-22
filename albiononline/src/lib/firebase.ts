import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

// Configuración de Firebase leída de firebase-applet-config.json o variables de entorno
const firebaseConfig = {
  projectId: "artful-bee-tnzsc",
  appId: "1:545632035925:web:3f08fc66da7e147b62a0dc",
  apiKey: "AIzaSyC_xFbjmWwBhLZ6EDiu_IhVt6YT_TbUP5s",
  authDomain: "artful-bee-tnzsc.firebaseapp.com",
  storageBucket: "artful-bee-tnzsc.firebasestorage.app",
  messagingSenderId: "545632035925"
};

// ID personalizado de la base de datos de Firestore asignado a este applet
const databaseId = "ai-studio-7c0685b4-e578-4a7f-a999-319a06e4553a";

// Inicializar Firebase de forma perezosa/segura
let db: any = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, databaseId);
} catch (error) {
  console.error("Error al inicializar Firebase Firestore:", error);
}

export { db };

// Interfaz para la estructura de datos sincronizados
export interface AlbionSyncData {
  activeCharName: string;
  characters: any[];
  globalPrices: any;
  activeTheme: string;
  activeTemplate: string;
  globalPremium: boolean;
  discountFromInventory: boolean;
  inventories: Record<string, Record<string, number>>;
  queues: Record<string, any[]>;
  histories: Record<string, any[]>;
}

/**
 * Guarda los datos de Albion en la nube (Firestore) para un ID de sincronización específico.
 */
export async function saveUserDataToCloud(syncId: string, data: AlbionSyncData): Promise<void> {
  if (!db) {
    throw new Error("La base de datos de Firebase no está inicializada.");
  }
  if (!syncId) return;

  const docRef = doc(db, "albion_sync", syncId.toUpperCase().trim());
  
  await setDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Obtiene los datos de Albion desde la nube (Firestore) para un ID de sincronización específico.
 */
export async function loadUserDataFromCloud(syncId: string): Promise<AlbionSyncData | null> {
  if (!db) {
    throw new Error("La base de datos de Firebase no está inicializada.");
  }
  if (!syncId) return null;

  const docRef = doc(db, "albion_sync", syncId.toUpperCase().trim());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const rawData = docSnap.data();
    return {
      activeCharName: rawData.activeCharName || "",
      characters: rawData.characters || [],
      globalPrices: rawData.globalPrices || null,
      activeTheme: rawData.activeTheme || "crystal_neon",
      activeTemplate: rawData.activeTemplate || "classic_panel",
      globalPremium: typeof rawData.globalPremium === "boolean" ? rawData.globalPremium : true,
      discountFromInventory: typeof rawData.discountFromInventory === "boolean" ? rawData.discountFromInventory : true,
      inventories: rawData.inventories || {},
      queues: rawData.queues || {},
      histories: rawData.histories || {}
    };
  }

  return null;
}

/**
 * Genera un código de sincronización único aleatorio de formato CRAFT-XXXX
 */
export function generateSyncId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Evitamos O, 0, I, 1 por legibilidad
  let result = "CRAFT-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
