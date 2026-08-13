const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = values.join('=').trim();
        }
      }
    });
  }
}
loadEnv();

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const tables = [
  'nomes',
  'quiz_multidao',
  'quiz_discipulo',
  'quiz_apostolo',
  'quiz_teologico',
  'compartilhamento_comunhao',
  'compartilhamento_testemunho',
  'compartilhamento_confissao',
  'torre_de_babel',
  'quem_sou_eu'
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchSupabaseTable(tableName) {
  const url = `${supabaseUrl}/rest/v1/${tableName}?select=*`;
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch table ${tableName}: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function migrateTable(tableName) {
  console.log(`[Migration] Fetching '${tableName}' from Supabase...`);
  const rows = await fetchSupabaseTable(tableName);
  console.log(`[Migration] Found ${rows.length} rows in '${tableName}'. Copying to Firestore...`);

  let count = 0;
  // Use batch writes for speed and atomicity in chunks of 500
  let batch = writeBatch(db);
  let batchSize = 0;

  for (const row of rows) {
    const docId = row.id !== undefined ? String(row.id) : undefined;
    const docRef = docId ? doc(db, tableName, docId) : doc(collection(db, tableName));
    
    batch.set(docRef, row);
    batchSize++;
    count++;

    if (batchSize === 450) {
      await batch.commit();
      batch = writeBatch(db);
      batchSize = 0;
    }
  }

  if (batchSize > 0) {
    await batch.commit();
  }

  console.log(`[Migration] ✅ Successfully migrated ${count} documents for collection '${tableName}'.\n`);
}

async function runMigration() {
  console.log('--- STARTING SUPABASE TO FIRESTORE MIGRATION ---\n');
  let successCount = 0;
  let failCount = 0;

  for (const table of tables) {
    try {
      await migrateTable(table);
      successCount++;
    } catch (err) {
      console.error(`[Migration] ❌ Error migrating '${table}':`, err);
      failCount++;
    }
  }

  console.log(`--- MIGRATION COMPLETE ---`);
  console.log(`Successful collections: ${successCount}`);
  console.log(`Failed collections: ${failCount}`);
  process.exit(0);
}

runMigration();
