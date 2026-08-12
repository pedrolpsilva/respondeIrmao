"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const questions_1 = require("../src/constants/questions");
const firebaseConfig = {
    apiKey: "AIzaSyB3KxEi2_4er7lnsk5O3_NFw8tFl1LDEmE",
    authDomain: "responde-irmao-27406.firebaseapp.com",
    projectId: "responde-irmao-27406",
    storageBucket: "responde-irmao-27406.firebasestorage.app",
    messagingSenderId: "459596151804",
    appId: "1:459596151804:web:877a1bd2fe854e33989079",
    measurementId: "G-1D8T6N0N40"
};
const DEFAULT_NAMES = [
    "Pedro", "João", "Maria", "Lucas", "Mateus", "Marcos",
    "Paulo", "Ester", "Rute", "Davi", "Salomão", "Daniel",
    "Samuel", "Moisés", "Abraão", "Isaque", "Jó", "Elias"
];
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
async function seedCollection(collectionName, items) {
    console.log(`[Seeding] Starting seeding for '${collectionName}' (${items.length} items)...`);
    let batch = (0, firestore_1.writeBatch)(db);
    let batchSize = 0;
    let totalCount = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const docId = String(i + 1);
        const docRef = (0, firestore_1.doc)(db, collectionName, docId);
        batch.set(docRef, { ...item, id: i + 1 });
        batchSize++;
        totalCount++;
        if (batchSize === 450) {
            await batch.commit();
            batch = (0, firestore_1.writeBatch)(db);
            batchSize = 0;
        }
    }
    if (batchSize > 0) {
        await batch.commit();
    }
    console.log(`[Seeding] ✅ Finished seeding '${collectionName}' with ${totalCount} documents.\n`);
}
async function runSeeding() {
    console.log('--- SEEDING FIRESTORE WITH INITIAL GAME DATA ---\n');
    try {
        // 1. Nomes
        const nomesData = DEFAULT_NAMES.map(name => ({ nome: name }));
        await seedCollection('nomes', nomesData);
        // 2. Quiz Multidão
        const multidaoData = (questions_1.QUIZ_QUESTIONS.multidao || []).map(q => ({
            pergunta: q.text,
            resposta: q.correctAnswer || ''
        }));
        await seedCollection('quiz_multidao', multidaoData);
        // 3. Quiz Discípulo
        const discipuloData = (questions_1.QUIZ_QUESTIONS.discipulo || []).map(q => ({
            pergunta: q.text,
            resposta: q.correctAnswer || ''
        }));
        await seedCollection('quiz_discipulo', discipuloData);
        // 4. Quiz Apóstolo
        const apostoloData = (questions_1.QUIZ_QUESTIONS.apostolo || []).map(q => ({
            pergunta: q.text,
            resposta: q.correctAnswer || ''
        }));
        await seedCollection('quiz_apostolo', apostoloData);
        // 5. Quiz Teológico
        const teologicoData = (questions_1.TEOLOGICO_QUESTIONS || []).map(q => ({
            pergunta: q.text,
            resposta: q.correctAnswer || ''
        }));
        await seedCollection('quiz_teologico', teologicoData);
        // 6. Compartilhamento Comunhão
        const comunhaoData = (questions_1.COMPARTILHAR_QUESTIONS.comunhao || []).map(q => ({
            pergunta: q.text
        }));
        await seedCollection('compartilhamento_comunhao', comunhaoData);
        // 7. Compartilhamento Testemunho
        const testemunhoData = (questions_1.COMPARTILHAR_QUESTIONS.testemunho || []).map(q => ({
            pergunta: q.text
        }));
        await seedCollection('compartilhamento_testemunho', testemunhoData);
        // 8. Compartilhamento Confissão
        const confissaoData = (questions_1.COMPARTILHAR_QUESTIONS.confissao || []).map(q => ({
            pergunta: q.text
        }));
        await seedCollection('compartilhamento_confissao', confissaoData);
        // 9. Torre de Babel
        const torreData = (questions_1.TORRE_QUESTIONS || []).map(q => ({
            pergunta: q.text,
            resposta_correta: q.correctAnswer || '',
            resposta_incorreta_1: q.wrongAnswers?.[0] || '',
            resposta_incorreta_2: q.wrongAnswers?.[1] || '',
            resposta_incorreta_3: q.wrongAnswers?.[2] || '',
            referencia_biblica: q.bibleReference || '',
            classe: q.classe || 'facil'
        }));
        await seedCollection('torre_de_babel', torreData);
        // 10. Quem Sou Eu
        const sampleWhoAmI = [
            {
                palavra: "Pedro",
                categoria: "Apóstolo",
                dica_1: "Foi pescador no Mar da Galileia",
                dica_2: "Andou sobre as águas com Jesus",
                dica_3: "Negou Jesus 3 vezes antes do galo cantar"
            },
            {
                palavra: "Moisés",
                categoria: "Profeta",
                dica_1: "Foi resgatado das águas em um cesto de junco",
                dica_2: "Viu a sarça ardente no Monte Horebe",
                dica_3: "Guiou o povo de Israel pelo deserto e abriu o Mar Vermelho"
            },
            {
                palavra: "Davi",
                categoria: "Rei",
                dica_1: "Era o filho caçula de Jessé e cuidava das ovelhas",
                dica_2: "Derrotou o gigante Golias com uma pedra",
                dica_3: "Escreveu a maioria dos Salmos"
            },
            {
                palavra: "Daniel",
                categoria: "Profeta",
                dica_1: "Foi levado cativo para a Babilônia",
                dica_2: "Recusou se contaminar com as finas iguarias do rei",
                dica_3: "Foi lançado na cova dos leões e um anjo fechou a boca deles"
            }
        ];
        const whoAmIData = (questions_1.WHO_AM_I_CARDS.length > 0 ? questions_1.WHO_AM_I_CARDS.map(card => {
            const docObj = {
                palavra: card.answer,
                categoria: card.category
            };
            (card.hints || []).forEach((hint, idx) => {
                docObj[`dica_${idx + 1}`] = hint;
            });
            return docObj;
        }) : sampleWhoAmI);
        await seedCollection('quem_sou_eu', whoAmIData);
        console.log('🎉 ALL FIRESTORE COLLECTIONS POPULATED SUCCESSFULLY!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
}
runSeeding();
