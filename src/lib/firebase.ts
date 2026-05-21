import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// Use initializeFirestore with experimentalForceLongPolling to prevent connection timeouts in iframe/sandbox environments.
// We also use the correct firestoreDatabaseId specified in firebase-applet-config.json.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connectivity check as per skill requirements
async function testConnection() {
  try {
    // Try to query the jobs collection (which is public) instead of a forbidden path
    const { getDocs, collection, limit, query } = await import("firebase/firestore");
    const q = query(collection(db, "jobs"), limit(1));
    await getDocs(q);
    console.log("Firebase initialized and connected successfully.");
  } catch (error) {
    if (error instanceof Error) {
      // Ignore permission denied for writes if we were just testing connectivity
      // But if it's a general network/config error:
      if (error.message.includes("the client is offline") || error.message.includes("Configuration")) {
         console.error("Firebase Connection Error:", error.message);
         console.error("Please check your Firebase configuration in firebase-applet-config.json");
      }
    }
  }
}

testConnection();
