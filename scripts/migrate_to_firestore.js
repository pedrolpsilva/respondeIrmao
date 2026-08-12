const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB3KxEi2_4er7lnsk5O3_NFw8tFl1LDEmE",
  authDomain: "responde-irmao-27406.firebaseapp.com",
  projectId: "responde-irmao-27406",
  storageBucket: "responde-irmao-27406.firebasestorage.app",
  messagingSenderId: "459596151804",
  appId: "1:459596151804:web:877a1bd2fe854e33989079",
  measurementId: "G-1D8T6N0N40"
};

const supabaseUrl = 'https://ywzoynxpkymllzathkdd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3em95bnhwa3ltbGx6YXRoa2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMDU0MzAsImV4cCI6MjA5OTc4MTQzMH0.mPmvfeLOSo09Cfh6AXLyElTaqJ5rC7KDlhtXoMkxEws';

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
