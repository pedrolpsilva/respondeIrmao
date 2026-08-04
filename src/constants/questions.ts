export interface Question {
  id: string;
  text: string;
  level?: string; // ex: 'multidão', 'discípulo', 'apóstolo' | 'comunhão', 'testemunho', 'confissão' | 'facil', 'media', 'dificil', 'muito_dificil'
  correctAnswer?: string; // optional for Quiz mode display
  wrongAnswers?: string[];
  bibleReference?: string;
  classe?: 'facil' | 'medio' | 'dificil'; // Torre de Babel question difficulty class
}

export interface WhoAmICard {
  id: string;
  answer: string;    // ex: "Pedro"
  category: string;  // ex: "Apóstolo", "Profeta", "Local", "Evento"
  hints: string[];   // ex: ["Andei sobre as águas", "Neguei a Jesus 3x", ...]
}

// Cards are populated at runtime via Google Sheets sync (aba "Quem Sou Eu")
export const WHO_AM_I_CARDS: WhoAmICard[] = [];

export const QUIZ_QUESTIONS: Record<string, Question[]> = {
  multidao: [
    { id: 'qm1', text: 'Quem construiu a arca que salvou os animais do dilúvio?', correctAnswer: 'Noé' },
    { id: 'qm2', text: 'Quantos discípulos Jesus escolheu inicialmente?', correctAnswer: '12 discípulos' },
    { id: 'qm3', text: 'Quem derrotou o gigante Golias com apenas uma funda?', correctAnswer: 'Davi' },
    { id: 'qm4', text: 'Qual é o primeiro livro da Bíblia?', correctAnswer: 'Gênesis' },
    { id: 'qm5', text: 'Quem foi jogado na cova dos leões mas não sofreu nenhum arranhão?', correctAnswer: 'Daniel' },
    { id: 'qm6', text: 'Quantos mandamentos Deus deu a Moisés no Monte Sinai?', correctAnswer: '10 mandamentos' },
    { id: 'qm7', text: 'O que Deus criou no sétimo dia de acordo com Gênesis?', correctAnswer: 'Ele descansou' },
    { id: 'qm8', text: 'Quem foi a primeira mulher criada por Deus?', correctAnswer: 'Eva' },
    { id: 'qm9', text: 'Qual mar se abriu para que o povo de Israel passasse?', correctAnswer: 'Mar Vermelho' },
    { id: 'qm10', text: 'Em qual cidade Jesus nasceu?', correctAnswer: 'Belém' },
    { id: 'qm11', text: 'Quem foi traído por seu próprio irmão e vendido como escravo para o Egito?', correctAnswer: 'José' },
    { id: 'qm12', text: 'Como era chamado o rio onde Jesus foi batizado?', correctAnswer: 'Rio Jordão' },
    { id: 'qm13', text: 'Quantos livros tem a Bíblia Protestante no total?', correctAnswer: '66 livros' },
    { id: 'qm14', text: 'Quem foi engolido por um grande peixe?', correctAnswer: 'Jonas' },
    { id: 'qm15', text: 'Quem era a esposa de Abraão?', correctAnswer: 'Sara' },
  ],
  discipulo: [
    { id: 'qd1', text: 'Qual discípulo era cobrador de impostos antes de seguir Jesus?', correctAnswer: 'Mateus' },
    { id: 'qd2', text: 'Quantos anos durou o ministério público de Jesus na Terra?', correctAnswer: 'Cerca de 3 anos' },
    { id: 'qd3', text: 'Qual rei pediu sabedoria a Deus em vez de riquezas?', correctAnswer: 'Salomão' },
    { id: 'qd4', text: 'Quem escreveu o livro de Apocalipse?', correctAnswer: 'João' },
    { id: 'qd5', text: 'Em qual idioma original a maior parte do Novo Testamento foi escrita?', correctAnswer: 'Grego (Koiné)' },
    { id: 'qd6', text: 'Quantos dias Jesus jejuou no deserto antes de ser tentado?', correctAnswer: '40 dias' },
    { id: 'qd7', text: 'Quem foi a primeira pessoa a ver Jesus ressuscitado?', correctAnswer: 'Maria Madalena' },
    { id: 'qd8', text: 'Qual o menor livro da Bíblia em número de versículos?', correctAnswer: 'II João (13 versículos)' },
    { id: 'qd9', text: 'Quais eram os nomes dos três amigos de Daniel jogados na fornalha?', correctAnswer: 'Sadraque, Mesaque e Abede-Nego' },
    { id: 'qd10', text: 'Quem substituiu Moisés na liderança do povo rumo à Terra Prometida?', correctAnswer: 'Josué' },
    { id: 'qd11', text: 'De quem é a famosa passagem do "vale de ossos secos"?', correctAnswer: 'Ezequiel' },
    { id: 'qd12', text: 'Em qual das suas viagens missionárias Paulo foi preso em Filipos?', correctAnswer: 'Segunda viagem' },
    { id: 'qd13', text: 'Qual era a profissão do apóstolo Paulo?', correctAnswer: 'Fabricador de tendas' },
    { id: 'qd14', text: 'Quem é considerado o autor de grande parte do livro de Provérbios?', correctAnswer: 'Salomão' },
    { id: 'qd15', text: 'Em qual livro bíblico se encontra a história da Rainha Ester?', correctAnswer: 'Ester' },
  ],
  apostolo: [
    { id: 'qa1', text: 'Quem foi o pai de Matusalém?', correctAnswer: 'Enoque' },
    { id: 'qa2', text: 'Em Atos, quem ensinou de forma mais exata o caminho de Deus a Apolo?', correctAnswer: 'Áquila e Priscila' },
    { id: 'qa3', text: 'Qual dos juízes de Israel sacrificou a própria filha após fazer um voto tolo?', correctAnswer: 'Jefté' },
    { id: 'qa4', text: 'Em qual monte a arca de Noé repousou após o dilúvio?', correctAnswer: 'Monte Ararat' },
    { id: 'qa5', text: 'Qual foi o nome do sucessor do rei Saul em Judá?', correctAnswer: 'Davi' },
    { id: 'qa6', text: 'Quantos capítulos tem o livro de Obadias?', correctAnswer: 'Apenas 1 capítulo' },
    { id: 'qa7', text: 'Qual profeta comprou um cinto de linho e o escondeu na fenda de uma rocha perto do Eufrates?', correctAnswer: 'Jeremias' },
    { id: 'qa8', text: 'Qual o nome da única mulher citada nominalmente como Juíza em Israel?', correctAnswer: 'Débora' },
    { id: 'qa9', text: 'Quem era a rainha malvada que ameaçou a vida de Elias?', correctAnswer: 'Jezabel' },
    { id: 'qa10', text: 'Quais eram os nomes dos dois filhos de Eli que profanavam as ofertas do Senhor?', correctAnswer: 'Hofni e Fineias' },
    { id: 'qa11', text: 'Quantas igrejas da Ásia recebem cartas específicas em Apocalipse?', correctAnswer: '7 igrejas' },
    { id: 'qa12', text: 'Qual o nome do profeta que foi engolido pela terra juntamente com Corá e Abirão?', correctAnswer: 'Datã' },
    { id: 'qa13', text: 'Quem foi o companheiro de Paulo na sua primeira viagem missionária?', correctAnswer: 'Barnabé' },
    { id: 'qa14', text: 'De qual tribo de Israel pertencia o apóstolo Paulo?', correctAnswer: 'Tribo de Benjamim' },
    { id: 'qa15', text: 'Qual era a nacionalidade de Timóteo pela parte paterna?', correctAnswer: 'Grega (pai grego, mãe judia)' },
  ]
};

export const COMPARTILHAR_QUESTIONS: Record<string, Question[]> = {
  comunhao: [
    { id: 'cc1', text: 'Qual é o seu hino ou música gospel favorita de cantar no carro?' },
    { id: 'cc2', text: 'Qual comida você mais gosta de comer depois de um culto de domingo?' },
    { id: 'cc3', text: 'Qual personagem bíblico você acha mais parecido com seu jeito?' },
    { id: 'cc4', text: 'Conte uma situação engraçada ou mico que você já pagou na igreja.' },
    { id: 'cc5', text: 'Qual é o versículo que você sempre lembra em momentos de correria?' },
    { id: 'cc6', text: 'Se você pudesse viajar no tempo, qual milagre de Jesus gostaria de ter presenciado?' },
    { id: 'cc7', text: 'Quem é a pessoa que mais te faz rir no seu grupo da igreja?' },
    { id: 'cc8', text: 'Qual foi a pregação ou lição que mais te marcou nos últimos meses?' },
    { id: 'cc9', text: 'Com quantos anos você começou a frequentar a igreja ativamente?' },
    { id: 'cc10', text: 'Qual ministério da igreja você acha que tem mais a ver com suas habilidades?' },
  ],
  testemunho: [
    { id: 'ct1', text: 'Conte sobre um livramento ou milagre claro de Deus na sua vida (ou na sua família).' },
    { id: 'ct2', text: 'Como foi o momento em que você sentiu que Deus realmente mudou sua história?' },
    { id: 'ct3', text: 'Fale sobre uma pessoa da igreja que foi essencial para manter a sua fé acesa.' },
    { id: 'ct4', text: 'Qual foi a resposta de oração mais inesperada ou rápida que você já teve?' },
    { id: 'ct5', text: 'Já existiu um momento em que você pensou em desistir, mas Deus te segurou?' },
    { id: 'ct6', text: 'Como você falaria do amor de Deus para alguém que nunca ouviu falar sobre Ele?' },
    { id: 'ct7', text: 'Conte uma ocasião em que você precisou dar um "passo de fé" sem saber o que aconteceria.' },
    { id: 'ct8', text: 'Qual atitude de um pastor, líder ou obreiro já impactou profundamente sua conduta?' },
    { id: 'ct9', text: 'Compartilhe um período difícil que você superou e percebeu que ficou mais forte na fé.' },
    { id: 'ct10', text: 'Como a sua rotina diária de oração e leitura bíblica mudou quem você é no trabalho ou escola?' },
  ],
  confissao: [
    { id: 'cf1', text: 'Qual é a área ou atitude da sua vida em que você mais sente dificuldade em entregar o controle a Deus?' },
    { id: 'cf2', text: 'Você já julgou mal alguém da igreja e depois se arrependeu amargamente? Como foi?' },
    { id: 'cf3', text: 'Qual "pecadinho" de estimação (fofoca, ira, mentira, orgulho) você tem lutado mais frequentemente ultimamente?' },
    { id: 'cf4', text: 'Compartilhe uma vez em que você sabia o que Deus queria que fizesse, mas escolheu o seu próprio caminho.' },
    { id: 'cf5', text: 'Em quais momentos do dia você mais sente o peso da tentação ou o distanciamento da presença de Deus?' },
    { id: 'cf6', text: 'Qual perdão você demorou muito tempo para liberar para alguém e como isso te consumiu?' },
    { id: 'cf7', text: 'Você já sentiu inveja do dom ou da vida de algum irmão da igreja? Como lidou com esse sentimento?' },
    { id: 'cf8', text: 'Qual a maior mentira que você já contou a si mesmo sobre o seu relacionamento atual com Deus?' },
    { id: 'cf9', text: 'Você já fingiu estar bem espiritualmente para os outros enquanto estava em pedaços por dentro?' },
    { id: 'cf10', text: 'O que você gostaria de mudar urgentemente no seu caráter hoje para parecer mais com Jesus?' },
  ]
};

export const TORRE_QUESTIONS: Question[] = [
  {
    "id": "tb1",
    "text": "Quem construiu a arca?",
    "correctAnswer": "Noé",
    "wrongAnswers": [
      "Moisés",
      "Abraão",
      "Davi"
    ],
    "bibleReference": "Gênesis 6:14",
    "level": "facil"
  },
  {
    "id": "tb2",
    "text": "Quem foi engolido por um grande peixe?",
    "correctAnswer": "Jonas",
    "wrongAnswers": [
      "Pedro",
      "Paulo",
      "João"
    ],
    "bibleReference": "Jonas 1:17",
    "level": "facil"
  },
  {
    "id": "tb3",
    "text": "Qual o primeiro livro da Bíblia?",
    "correctAnswer": "Gênesis",
    "wrongAnswers": [
      "Êxodo",
      "Salmos",
      "Mateus"
    ],
    "bibleReference": "Gênesis 1:1",
    "level": "facil"
  },
  {
    "id": "tb4",
    "text": "Quem derrotou o gigante Golias?",
    "correctAnswer": "Davi",
    "wrongAnswers": [
      "Sansão",
      "Saul",
      "Salomão"
    ],
    "bibleReference": "1 Samuel 17:50",
    "level": "facil"
  },
  {
    "id": "tb5",
    "text": "Onde Jesus nasceu?",
    "correctAnswer": "Belém",
    "wrongAnswers": [
      "Nazaré",
      "Jerusalém",
      "Jericó"
    ],
    "bibleReference": "Mateus 2:1",
    "level": "facil"
  },
  {
    "id": "tb6",
    "text": "Quem abriu o Mar Vermelho?",
    "correctAnswer": "Moisés",
    "wrongAnswers": [
      "Josué",
      "Arão",
      "Elias"
    ],
    "bibleReference": "Êxodo 14:21",
    "level": "facil"
  },
  {
    "id": "tb7",
    "text": "Quantos discípulos Jesus escolheu?",
    "correctAnswer": "12",
    "wrongAnswers": [
      "10",
      "7",
      "3"
    ],
    "bibleReference": "Lucas 6:13",
    "level": "facil"
  },
  {
    "id": "tb8",
    "text": "Quem foi o primeiro homem?",
    "correctAnswer": "Adão",
    "wrongAnswers": [
      "Caim",
      "Abel",
      "Sete"
    ],
    "bibleReference": "Gênesis 2:7",
    "level": "facil"
  },
  {
    "id": "tb9",
    "text": "Quem foi a primeira mulher?",
    "correctAnswer": "Eva",
    "wrongAnswers": [
      "Sara",
      "Maria",
      "Rute"
    ],
    "bibleReference": "Gênesis 3:20",
    "level": "facil"
  },
  {
    "id": "tb10",
    "text": "Quem foi lançado na cova dos leões?",
    "correctAnswer": "Daniel",
    "wrongAnswers": [
      "Sadraque",
      "Mesaque",
      "Abede-Nego"
    ],
    "bibleReference": "Daniel 6:16",
    "level": "facil"
  },
  {
    "id": "tb11",
    "text": "Quem traiu Jesus?",
    "correctAnswer": "Judas Iscariotes",
    "wrongAnswers": [
      "Pedro",
      "Tomé",
      "João"
    ],
    "bibleReference": "Mateus 26:14-15",
    "level": "facil"
  },
  {
    "id": "tb12",
    "text": "O que Jesus multiplicou para alimentar a multidão?",
    "correctAnswer": "Pães e peixes",
    "wrongAnswers": [
      "Água e vinho",
      "Frutas e pães",
      "Carne e pães"
    ],
    "bibleReference": "Mateus 14:19",
    "level": "facil"
  },
  {
    "id": "tb13",
    "text": "Qual o último livro da Bíblia?",
    "correctAnswer": "Apocalipse",
    "wrongAnswers": [
      "Judas",
      "Romanos",
      "Hebreus"
    ],
    "bibleReference": "Apocalipse 1:1",
    "level": "facil"
  },
  {
    "id": "tb14",
    "text": "Quem era o homem mais forte da Bíblia?",
    "correctAnswer": "Sansão",
    "wrongAnswers": [
      "Davi",
      "Golias",
      "Saul"
    ],
    "bibleReference": "Juízes 14:6",
    "level": "facil"
  },
  {
    "id": "tb15",
    "text": "Qual animal enganou Eva?",
    "correctAnswer": "Serpente",
    "wrongAnswers": [
      "Leão",
      "Urso",
      "Raposa"
    ],
    "bibleReference": "Gênesis 3:1",
    "level": "facil"
  },
  {
    "id": "tb16",
    "text": "Quem foi vendido como escravo pelos irmãos?",
    "correctAnswer": "José",
    "wrongAnswers": [
      "Benjamim",
      "Rúben",
      "Judá"
    ],
    "bibleReference": "Gênesis 37:28",
    "level": "facil"
  },
  {
    "id": "tb17",
    "text": "Quem negou Jesus três vezes?",
    "correctAnswer": "Pedro",
    "wrongAnswers": [
      "Tiago",
      "João",
      "André"
    ],
    "bibleReference": "Lucas 22:61",
    "level": "facil"
  },
  {
    "id": "tb18",
    "text": "Quem batizou Jesus?",
    "correctAnswer": "João Batista",
    "wrongAnswers": [
      "Pedro",
      "Paulo",
      "Tiago"
    ],
    "bibleReference": "Mateus 3:13",
    "level": "facil"
  },
  {
    "id": "tb19",
    "text": "Quantas pragas foram enviadas ao Egito?",
    "correctAnswer": "10",
    "wrongAnswers": [
      "7",
      "12",
      "3"
    ],
    "bibleReference": "Êxodo 7-12",
    "level": "facil"
  },
  {
    "id": "tb20",
    "text": "Qual o mandamento com promessa?",
    "correctAnswer": "Honra teu pai e tua mãe",
    "wrongAnswers": [
      "Não matarás",
      "Não furtarás",
      "Não dirás falso testemunho"
    ],
    "bibleReference": "Efésios 6:2",
    "level": "facil"
  },
  {
    "id": "tb21",
    "text": "Quem subiu em uma árvore para ver Jesus?",
    "correctAnswer": "Zaqueu",
    "wrongAnswers": [
      "Bartimeu",
      "Lázaro",
      "Nicodemos"
    ],
    "bibleReference": "Lucas 19:4",
    "level": "facil"
  },
  {
    "id": "tb22",
    "text": "Qual o nome da mãe de Jesus?",
    "correctAnswer": "Maria",
    "wrongAnswers": [
      "Marta",
      "Isabel",
      "Ana"
    ],
    "bibleReference": "Lucas 1:30-31",
    "level": "facil"
  },
  {
    "id": "tb23",
    "text": "O que Deus usou para criar Eva?",
    "correctAnswer": "Uma costela de Adão",
    "wrongAnswers": [
      "Barro",
      "Água",
      "Uma palavra"
    ],
    "bibleReference": "Gênesis 2:21-22",
    "level": "facil"
  },
  {
    "id": "tb24",
    "text": "Quem era o rei sábio?",
    "correctAnswer": "Salomão",
    "wrongAnswers": [
      "Davi",
      "Saul",
      "Ezequias"
    ],
    "bibleReference": "1 Reis 4:29",
    "level": "facil"
  },
  {
    "id": "tb25",
    "text": "Quem sobreviveu na fornalha de fogo?",
    "correctAnswer": "Sadraque, Mesaque e Abede-Nego",
    "wrongAnswers": [
      "Daniel",
      "Pedro e João",
      "Paulo e Silas"
    ],
    "bibleReference": "Daniel 3:26",
    "level": "facil"
  },
  {
    "id": "tb26",
    "text": "Quem chorou amargamente após negar Jesus?",
    "correctAnswer": "Pedro",
    "wrongAnswers": [
      "Judas",
      "Tomé",
      "Filipe"
    ],
    "bibleReference": "Mateus 26:75",
    "level": "facil"
  },
  {
    "id": "tb27",
    "text": "Qual o nome do jardim onde Adão e Eva viveram?",
    "correctAnswer": "Éden",
    "wrongAnswers": [
      "Getsêmani",
      "Carmelo",
      "Sinai"
    ],
    "bibleReference": "Gênesis 2:8",
    "level": "facil"
  },
  {
    "id": "tb28",
    "text": "Qual o sinal da aliança de Deus com Noé?",
    "correctAnswer": "Arco-íris",
    "wrongAnswers": [
      "Estrela",
      "Nuvem",
      "Fogo"
    ],
    "bibleReference": "Gênesis 9:13",
    "level": "facil"
  },
  {
    "id": "tb29",
    "text": "Quantos dias Deus levou para criar o mundo?",
    "correctAnswer": "6",
    "wrongAnswers": [
      "7",
      "5",
      "3"
    ],
    "bibleReference": "Gênesis 1:31",
    "level": "facil"
  },
  {
    "id": "tb30",
    "text": "Quem ressuscitou ao quarto dia?",
    "correctAnswer": "Lázaro",
    "wrongAnswers": [
      "Jairo",
      "Estêvão",
      "Tabita"
    ],
    "bibleReference": "João 11:43-44",
    "level": "facil"
  },
  {
    "id": "tb31",
    "text": "Quem foi o sucessor de Moisés?",
    "correctAnswer": "Josué",
    "wrongAnswers": [
      "Calebe",
      "Arão",
      "Samuel"
    ],
    "bibleReference": "Josué 1:1-2",
    "level": "media"
  },
  {
    "id": "tb32",
    "text": "Quem escreveu a maior parte do Novo Testamento?",
    "correctAnswer": "Paulo",
    "wrongAnswers": [
      "Pedro",
      "João",
      "Lucas"
    ],
    "bibleReference": "Epístolas Paulinas",
    "level": "media"
  },
  {
    "id": "tb33",
    "text": "Qual era a profissão de Mateus antes de seguir Jesus?",
    "correctAnswer": "Publicano",
    "wrongAnswers": [
      "Pescador",
      "Carpinteiro",
      "Médico"
    ],
    "bibleReference": "Mateus 9:9",
    "level": "media"
  },
  {
    "id": "tb34",
    "text": "Onde os dez mandamentos foram dados a Moisés?",
    "correctAnswer": "Monte Sinai",
    "wrongAnswers": [
      "Monte Carmelo",
      "Monte das Oliveiras",
      "Monte Sião"
    ],
    "bibleReference": "Êxodo 19:20",
    "level": "media"
  },
  {
    "id": "tb35",
    "text": "Quem era o pai de Davi?",
    "correctAnswer": "Jessé",
    "wrongAnswers": [
      "Saul",
      "Samuel",
      "Jônatas"
    ],
    "bibleReference": "1 Samuel 16:11",
    "level": "media"
  },
  {
    "id": "tb36",
    "text": "Qual foi o primeiro milagre de Jesus?",
    "correctAnswer": "Transformar água em vinho",
    "wrongAnswers": [
      "Multiplicar os pães",
      "Curar um cego",
      "Andar sobre as águas"
    ],
    "bibleReference": "João 2:11",
    "level": "media"
  },
  {
    "id": "tb37",
    "text": "Quem foi a esposa de Isaque?",
    "correctAnswer": "Rebeca",
    "wrongAnswers": [
      "Raquel",
      "Leia",
      "Sara"
    ],
    "bibleReference": "Gênesis 24:67",
    "level": "media"
  },
  {
    "id": "tb38",
    "text": "Quantos anos os israelitas vagaram pelo deserto?",
    "correctAnswer": "40",
    "wrongAnswers": [
      "30",
      "50",
      "7"
    ],
    "bibleReference": "Josué 5:6",
    "level": "media"
  },
  {
    "id": "tb39",
    "text": "Quem foi a mulher que lavou os pés de Jesus com suas lágrimas?",
    "correctAnswer": "Maria (pecadora)",
    "wrongAnswers": [
      "Marta",
      "Maria mãe de Jesus",
      "Mulher samaritana"
    ],
    "bibleReference": "Lucas 7:37-38",
    "level": "media"
  },
  {
    "id": "tb40",
    "text": "Quem foi o apóstolo que duvidou da ressurreição?",
    "correctAnswer": "Tomé",
    "wrongAnswers": [
      "Pedro",
      "João",
      "Judas"
    ],
    "bibleReference": "João 20:24-25",
    "level": "media"
  },
  {
    "id": "tb41",
    "text": "Qual o nome da esposa de Abraão?",
    "correctAnswer": "Sara",
    "wrongAnswers": [
      "Hagar",
      "Rebeca",
      "Raquel"
    ],
    "bibleReference": "Gênesis 17:15",
    "level": "media"
  },
  {
    "id": "tb42",
    "text": "Qual rei da Babilônia conquistou Jerusalém?",
    "correctAnswer": "Nabucodonosor",
    "wrongAnswers": [
      "Ciro",
      "Dario",
      "Belsazar"
    ],
    "bibleReference": "2 Reis 24:10-11",
    "level": "media"
  },
  {
    "id": "tb43",
    "text": "Quem encontrou o bebê Moisés no rio?",
    "correctAnswer": "A filha do Faraó",
    "wrongAnswers": [
      "Miriã",
      "Joquebede",
      "Zípora"
    ],
    "bibleReference": "Êxodo 2:5",
    "level": "media"
  },
  {
    "id": "tb44",
    "text": "Qual profeta fez descer fogo do céu no Monte Carmelo?",
    "correctAnswer": "Elias",
    "wrongAnswers": [
      "Eliseu",
      "Isaías",
      "Jeremias"
    ],
    "bibleReference": "1 Reis 18:38",
    "level": "media"
  },
  {
    "id": "tb45",
    "text": "O que Paulo e Silas estavam fazendo na prisão quando houve um terremoto?",
    "correctAnswer": "Orando e cantando",
    "wrongAnswers": [
      "Dormindo",
      "Discutindo",
      "Comendo"
    ],
    "bibleReference": "Atos 16:25-26",
    "level": "media"
  },
  {
    "id": "tb46",
    "text": "Quem ajudou Jesus a carregar a cruz?",
    "correctAnswer": "Simão Cireneu",
    "wrongAnswers": [
      "José de Arimateia",
      "Pedro",
      "João"
    ],
    "bibleReference": "Lucas 23:26",
    "level": "media"
  },
  {
    "id": "tb47",
    "text": "Qual animal falou com Balaão?",
    "correctAnswer": "Uma jumenta",
    "wrongAnswers": [
      "Um camelo",
      "Uma serpente",
      "Um leão"
    ],
    "bibleReference": "Números 22:28",
    "level": "media"
  },
  {
    "id": "tb48",
    "text": "Qual era a profissão de Lucas?",
    "correctAnswer": "Médico",
    "wrongAnswers": [
      "Pescador",
      "Cobrador de impostos",
      "Fabricante de tendas"
    ],
    "bibleReference": "Colossenses 4:14",
    "level": "media"
  },
  {
    "id": "tb49",
    "text": "Quem interpretou os sonhos do Faraó?",
    "correctAnswer": "José",
    "wrongAnswers": [
      "Daniel",
      "Moisés",
      "Jacó"
    ],
    "bibleReference": "Gênesis 41:25",
    "level": "media"
  },
  {
    "id": "tb50",
    "text": "Quem foi o primeiro rei de Israel?",
    "correctAnswer": "Saul",
    "wrongAnswers": [
      "Davi",
      "Salomão",
      "Roboão"
    ],
    "bibleReference": "1 Samuel 10:1",
    "level": "media"
  },
  {
    "id": "tb51",
    "text": "Quem teve a vida prolongada por 15 anos após orar?",
    "correctAnswer": "Ezequias",
    "wrongAnswers": [
      "Josias",
      "Asa",
      "Acabe"
    ],
    "bibleReference": "2 Reis 20:5-6",
    "level": "media"
  },
  {
    "id": "tb52",
    "text": "Quantos pães e peixes Jesus multiplicou na primeira vez?",
    "correctAnswer": "5 pães e 2 peixes",
    "wrongAnswers": [
      "7 pães e 3 peixes",
      "3 pães e 2 peixes",
      "5 pães e 5 peixes"
    ],
    "bibleReference": "Mateus 14:17",
    "level": "media"
  },
  {
    "id": "tb53",
    "text": "Qual profeta era careca e foi zombado por rapazes?",
    "correctAnswer": "Eliseu",
    "wrongAnswers": [
      "Elias",
      "Isaías",
      "Jeremias"
    ],
    "bibleReference": "2 Reis 2:23-24",
    "level": "media"
  },
  {
    "id": "tb54",
    "text": "Quem era o sumo sacerdote no julgamento de Jesus?",
    "correctAnswer": "Caifás",
    "wrongAnswers": [
      "Anás",
      "Pilatos",
      "Herodes"
    ],
    "bibleReference": "Mateus 26:57",
    "level": "media"
  },
  {
    "id": "tb55",
    "text": "Quem escreveu o livro de Atos?",
    "correctAnswer": "Lucas",
    "wrongAnswers": [
      "Paulo",
      "Pedro",
      "João"
    ],
    "bibleReference": "Atos 1:1",
    "level": "media"
  },
  {
    "id": "tb56",
    "text": "Qual o nome da ilha onde João estava exilado?",
    "correctAnswer": "Patmos",
    "wrongAnswers": [
      "Malta",
      "Chipre",
      "Creta"
    ],
    "bibleReference": "Apocalipse 1:9",
    "level": "media"
  },
  {
    "id": "tb57",
    "text": "Quem ungiu Davi como rei?",
    "correctAnswer": "Samuel",
    "wrongAnswers": [
      "Natan",
      "Elias",
      "Gade"
    ],
    "bibleReference": "1 Samuel 16:13",
    "level": "media"
  },
  {
    "id": "tb58",
    "text": "Qual foi a ave que Noé soltou primeiro da arca?",
    "correctAnswer": "Corvo",
    "wrongAnswers": [
      "Pomba",
      "Águia",
      "Pardal"
    ],
    "bibleReference": "Gênesis 8:7",
    "level": "media"
  },
  {
    "id": "tb59",
    "text": "Qual mulher foi juíza em Israel?",
    "correctAnswer": "Débora",
    "wrongAnswers": [
      "Jael",
      "Rute",
      "Ester"
    ],
    "bibleReference": "Juízes 4:4",
    "level": "media"
  },
  {
    "id": "tb60",
    "text": "Quem foi o avô de Davi?",
    "correctAnswer": "Obede",
    "wrongAnswers": [
      "Boaz",
      "Jessé",
      "Salmon"
    ],
    "bibleReference": "Rute 4:22",
    "level": "media"
  },
  {
    "id": "tb61",
    "text": "Quem foi o pai de João Batista?",
    "correctAnswer": "Zacarias",
    "wrongAnswers": [
      "José",
      "Simeão",
      "Ananias"
    ],
    "bibleReference": "Lucas 1:13",
    "level": "dificil"
  },
  {
    "id": "tb62",
    "text": "Qual rei viu a mão escrevendo na parede?",
    "correctAnswer": "Belsazar",
    "wrongAnswers": [
      "Nabucodonosor",
      "Dario",
      "Ciro"
    ],
    "bibleReference": "Daniel 5:5",
    "level": "dificil"
  },
  {
    "id": "tb63",
    "text": "Qual foi o profeta que se casou com uma prostituta por ordem de Deus?",
    "correctAnswer": "Oseias",
    "wrongAnswers": [
      "Amós",
      "Miqueias",
      "Joel"
    ],
    "bibleReference": "Oseias 1:2",
    "level": "dificil"
  },
  {
    "id": "tb64",
    "text": "Quem foi o homem que caiu da janela enquanto Paulo pregava?",
    "correctAnswer": "Êutico",
    "wrongAnswers": [
      "Timóteo",
      "Tito",
      "Silas"
    ],
    "bibleReference": "Atos 20:9",
    "level": "dificil"
  },
  {
    "id": "tb65",
    "text": "Quantos anos Matusalém viveu?",
    "correctAnswer": "969",
    "wrongAnswers": [
      "930",
      "950",
      "912"
    ],
    "bibleReference": "Gênesis 5:27",
    "level": "dificil"
  },
  {
    "id": "tb66",
    "text": "Qual tribo de Israel não recebeu herança de terras?",
    "correctAnswer": "Levi",
    "wrongAnswers": [
      "Judá",
      "Simeão",
      "Rúben"
    ],
    "bibleReference": "Josué 13:33",
    "level": "dificil"
  },
  {
    "id": "tb67",
    "text": "Quem foi a mãe de Salomão?",
    "correctAnswer": "Bate-Seba",
    "wrongAnswers": [
      "Mical",
      "Abigail",
      "Ainoã"
    ],
    "bibleReference": "2 Samuel 12:24",
    "level": "dificil"
  },
  {
    "id": "tb68",
    "text": "Qual profeta previu que o Messias nasceria em Belém?",
    "correctAnswer": "Miqueias",
    "wrongAnswers": [
      "Isaías",
      "Jeremias",
      "Zacarias"
    ],
    "bibleReference": "Miqueias 5:2",
    "level": "dificil"
  },
  {
    "id": "tb69",
    "text": "Qual foi a deusa adorada pelos efésios que causou um alvoroço contra Paulo?",
    "correctAnswer": "Diana (Ártemis)",
    "wrongAnswers": [
      "Atena",
      "Afrodite",
      "Hera"
    ],
    "bibleReference": "Atos 19:28",
    "level": "dificil"
  },
  {
    "id": "tb70",
    "text": "Quem liderou a reconstrução dos muros de Jerusalém?",
    "correctAnswer": "Neemias",
    "wrongAnswers": [
      "Esdras",
      "Zorobabel",
      "Josué"
    ],
    "bibleReference": "Neemias 2:17",
    "level": "dificil"
  },
  {
    "id": "tb71",
    "text": "Qual apóstolo foi picado por uma víbora na ilha de Malta?",
    "correctAnswer": "Paulo",
    "wrongAnswers": [
      "Pedro",
      "João",
      "Tiago"
    ],
    "bibleReference": "Atos 28:3",
    "level": "dificil"
  },
  {
    "id": "tb72",
    "text": "Qual rei mandou matar os bebês em Belém?",
    "correctAnswer": "Herodes, o Grande",
    "wrongAnswers": [
      "Pilatos",
      "César Augusto",
      "Tibério"
    ],
    "bibleReference": "Mateus 2:16",
    "level": "dificil"
  },
  {
    "id": "tb73",
    "text": "Quem era o sumo sacerdote quando Samuel era menino?",
    "correctAnswer": "Eli",
    "wrongAnswers": [
      "Hofni",
      "Fineias",
      "Zadoque"
    ],
    "bibleReference": "1 Samuel 1:9",
    "level": "dificil"
  },
  {
    "id": "tb74",
    "text": "Qual mulher escondeu os espias israelitas em Jericó?",
    "correctAnswer": "Raabe",
    "wrongAnswers": [
      "Rute",
      "Ester",
      "Tamar"
    ],
    "bibleReference": "Josué 2:1",
    "level": "dificil"
  },
  {
    "id": "tb75",
    "text": "Onde João Batista batizava?",
    "correctAnswer": "Rio Jordão",
    "wrongAnswers": [
      "Mar da Galileia",
      "Mar Morto",
      "Tanque de Siloé"
    ],
    "bibleReference": "Mateus 3:6",
    "level": "dificil"
  },
  {
    "id": "tb76",
    "text": "Quem foi o primeiro mártir cristão?",
    "correctAnswer": "Estêvão",
    "wrongAnswers": [
      "Tiago",
      "Pedro",
      "Paulo"
    ],
    "bibleReference": "Atos 7:59-60",
    "level": "dificil"
  },
  {
    "id": "tb77",
    "text": "Quantos livros têm a Bíblia protestante?",
    "correctAnswer": "66",
    "wrongAnswers": [
      "73",
      "39",
      "27"
    ],
    "bibleReference": "Índice da Bíblia",
    "level": "dificil"
  },
  {
    "id": "tb78",
    "text": "Quem escreveu o livro de Apocalipse?",
    "correctAnswer": "João",
    "wrongAnswers": [
      "Paulo",
      "Pedro",
      "Judas"
    ],
    "bibleReference": "Apocalipse 1:1",
    "level": "dificil"
  },
  {
    "id": "tb79",
    "text": "Qual o nome do servo do sumo sacerdote que teve a orelha cortada por Pedro?",
    "correctAnswer": "Malco",
    "wrongAnswers": [
      "Caifás",
      "Anás",
      "Barrabás"
    ],
    "bibleReference": "João 18:10",
    "level": "dificil"
  },
  {
    "id": "tb80",
    "text": "Quem foi o governador romano que julgou Jesus?",
    "correctAnswer": "Pôncio Pilatos",
    "wrongAnswers": [
      "Herodes",
      "Félix",
      "Festo"
    ],
    "bibleReference": "Mateus 27:2",
    "level": "dificil"
  },
  {
    "id": "tb81",
    "text": "Quem foi o profeta que foi levado ao céu em um redemoinho?",
    "correctAnswer": "Elias",
    "wrongAnswers": [
      "Enoque",
      "Eliseu",
      "Moisés"
    ],
    "bibleReference": "2 Reis 2:11",
    "level": "dificil"
  },
  {
    "id": "tb82",
    "text": "Qual foi o nome do vale onde Davi lutou contra Golias?",
    "correctAnswer": "Vale de Elá",
    "wrongAnswers": [
      "Vale de Cedrom",
      "Vale de Hinom",
      "Vale de Jezreel"
    ],
    "bibleReference": "1 Samuel 17:2",
    "level": "dificil"
  },
  {
    "id": "tb83",
    "text": "Qual foi a primeira cidade conquistada por Josué?",
    "correctAnswer": "Jericó",
    "wrongAnswers": [
      "Ai",
      "Hebrom",
      "Jerusalém"
    ],
    "bibleReference": "Josué 6",
    "level": "dificil"
  },
  {
    "id": "tb84",
    "text": "Quem era o pai de Saul?",
    "correctAnswer": "Quis",
    "wrongAnswers": [
      "Ner",
      "Abner",
      "Jônatas"
    ],
    "bibleReference": "1 Samuel 9:1",
    "level": "dificil"
  },
  {
    "id": "tb85",
    "text": "Qual rei pediu a Deus sabedoria em vez de riquezas?",
    "correctAnswer": "Salomão",
    "wrongAnswers": [
      "Davi",
      "Ezequias",
      "Josias"
    ],
    "bibleReference": "1 Reis 3:9",
    "level": "dificil"
  },
  {
    "id": "tb86",
    "text": "Quem foi o companheiro de Paulo na sua primeira viagem missionária?",
    "correctAnswer": "Barnabé",
    "wrongAnswers": [
      "Silas",
      "Timóteo",
      "Lucas"
    ],
    "bibleReference": "Atos 13:2",
    "level": "dificil"
  },
  {
    "id": "tb87",
    "text": "Qual o nome do irmão de Jacó?",
    "correctAnswer": "Esaú",
    "wrongAnswers": [
      "Ismael",
      "Isaque",
      "José"
    ],
    "bibleReference": "Gênesis 25:25-26",
    "level": "dificil"
  },
  {
    "id": "tb88",
    "text": "Qual o monte onde a arca de Noé repousou?",
    "correctAnswer": "Ararate",
    "wrongAnswers": [
      "Sinai",
      "Carmelo",
      "Sião"
    ],
    "bibleReference": "Gênesis 8:4",
    "level": "dificil"
  },
  {
    "id": "tb89",
    "text": "Quem foi a rainha que visitou Salomão para testar sua sabedoria?",
    "correctAnswer": "Rainha de Sabá",
    "wrongAnswers": [
      "Rainha de Ester",
      "Rainha de Candace",
      "Rainha de Jezabel"
    ],
    "bibleReference": "1 Reis 10:1",
    "level": "dificil"
  },
  {
    "id": "tb90",
    "text": "Qual foi a primeira praga do Egito?",
    "correctAnswer": "Água em sangue",
    "wrongAnswers": [
      "Rãs",
      "Gafanhotos",
      "Trevas"
    ],
    "bibleReference": "Êxodo 7:20",
    "level": "dificil"
  },
  {
    "id": "tb91",
    "text": "Quem foi o profeta que andou nu e descalço por três anos como sinal contra o Egito e a Etiópia?",
    "correctAnswer": "Isaías",
    "wrongAnswers": [
      "Jeremias",
      "Ezequiel",
      "Oseias"
    ],
    "bibleReference": "Isaías 20:2-3",
    "level": "muito_dificil"
  },
  {
    "id": "tb92",
    "text": "Qual o nome do rei de Basã que tinha uma cama de ferro de 9 côvados de comprimento?",
    "correctAnswer": "Ogue",
    "wrongAnswers": [
      "Seom",
      "Balaque",
      "Eglom"
    ],
    "bibleReference": "Deuteronômio 3:11",
    "level": "muito_dificil"
  },
  {
    "id": "tb93",
    "text": "Qual juiz de Israel tinha 30 filhos que cavalgavam 30 jumentos e tinham 30 cidades?",
    "correctAnswer": "Jair",
    "wrongAnswers": [
      "Ibzã",
      "Abdom",
      "Gideão"
    ],
    "bibleReference": "Juízes 10:4",
    "level": "muito_dificil"
  },
  {
    "id": "tb94",
    "text": "Qual era o nome da esposa de Moisés?",
    "correctAnswer": "Zípora",
    "wrongAnswers": [
      "Miriã",
      "Joquebede",
      "Raabe"
    ],
    "bibleReference": "Êxodo 2:21",
    "level": "muito_dificil"
  },
  {
    "id": "tb95",
    "text": "Quem era o rei de Moabe que era muito gordo e foi morto pelo juiz Eúde?",
    "correctAnswer": "Eglom",
    "wrongAnswers": [
      "Ogue",
      "Seom",
      "Balaque"
    ],
    "bibleReference": "Juízes 3:17",
    "level": "muito_dificil"
  },
  {
    "id": "tb96",
    "text": "Qual profeta teve uma visão de um vale de ossos secos que voltaram à vida?",
    "correctAnswer": "Ezequiel",
    "wrongAnswers": [
      "Isaías",
      "Jeremias",
      "Daniel"
    ],
    "bibleReference": "Ezequiel 37:1-2",
    "level": "muito_dificil"
  },
  {
    "id": "tb97",
    "text": "Qual o nome do servo de Eliseu que ficou leproso por causa da sua ganância?",
    "correctAnswer": "Geazi",
    "wrongAnswers": [
      "Ziba",
      "Mefibosete",
      "Obadias"
    ],
    "bibleReference": "2 Reis 5:27",
    "level": "muito_dificil"
  },
  {
    "id": "tb98",
    "text": "Qual o nome da deusa dos sidônios adorada por Salomão em sua velhice?",
    "correctAnswer": "Astarote",
    "wrongAnswers": [
      "Milcom",
      "Quemós",
      "Moloque"
    ],
    "bibleReference": "1 Reis 11:5",
    "level": "muito_dificil"
  },
  {
    "id": "tb99",
    "text": "Quem foi o sumo sacerdote que encontrou o Livro da Lei no templo durante o reinado de Josias?",
    "correctAnswer": "Hilquias",
    "wrongAnswers": [
      "Zadoque",
      "Semaías",
      "Azarias"
    ],
    "bibleReference": "2 Reis 22:8",
    "level": "muito_dificil"
  },
  {
    "id": "tb100",
    "text": "Qual homem na Bíblia teve seu cabelo preso nos galhos de um carvalho durante uma batalha?",
    "correctAnswer": "Absalão",
    "wrongAnswers": [
      "Sansão",
      "Saul",
      "Joabe"
    ],
    "bibleReference": "2 Samuel 18:9",
    "level": "muito_dificil"
  }
];

export const TEOLOGICO_QUESTIONS: Question[] = [
  { id: 'tq1', text: 'O que é o monoteísmo?', correctAnswer: 'A crença na existência de um único Deus, doutrina central do judaísmo e do cristianismo.', level: 'teologico' },
  { id: 'tq2', text: 'O que é o politeísmo?', correctAnswer: 'A crença ou adoração a múltiplos deuses, comum nas nações vizinhas a Israel no Antigo Testamento.', level: 'teologico' },
  { id: 'tq3', text: 'O que é o Pentateuco?', correctAnswer: 'Os cinco primeiros livros do Antigo Testamento, tradicionalmente atribuídos a Moisés. Também chamado de Torá pelos judeus.', level: 'teologico' },
  { id: 'tq4', text: 'O que significa "Evangelho"?', correctAnswer: 'Palavra de origem grega que significa "boas novas" ou "boas notícias", referindo-se à mensagem de salvação em Cristo.', level: 'teologico' },
  { id: 'tq5', text: 'O que era o Tabernáculo?', correctAnswer: 'Tenda móvel que servia como santuário para a adoração a Deus durante a peregrinação dos israelitas no deserto.', level: 'teologico' },
  { id: 'tq6', text: 'O que foi o Êxodo bíblico?', correctAnswer: 'O evento histórico de libertação dos israelitas da escravidão no Egito, liderado por Moisés.', level: 'teologico' },
  { id: 'tq7', text: 'Quem eram os apóstolos?', correctAnswer: 'Os doze discípulos originais escolhidos por Jesus, além de Paulo, comissionados para pregar o evangelho e fundar a Igreja.', level: 'teologico' },
  { id: 'tq8', text: 'O que é o pecado original?', correctAnswer: 'A doutrina de que a humanidade herda uma natureza corrompida devido à desobediência de Adão e Eva no Jardim do Éden.', level: 'teologico' },
  { id: 'tq9', text: 'O que é a Trindade?', correctAnswer: 'Doutrina cristã que afirma que Deus é um em essência, mas existe em três pessoas coiguais: Pai, Filho e Espírito Santo.', level: 'teologico' },
  { id: 'tq10', text: 'O que é a graça na teologia cristã?', correctAnswer: 'O favor imerecido de Deus concedido à humanidade, essencial para a salvação, não dependente de obras humanas.', level: 'teologico' },
  { id: 'tq11', text: 'O que significa "Cristo"?', correctAnswer: 'Título derivado do grego "Christos", que significa "o Ungido", equivalente ao termo hebraico "Messias".', level: 'teologico' },
  { id: 'tq12', text: 'O que era a Arca da Aliança?', correctAnswer: 'Baú sagrado coberto de ouro que continha as tábuas dos Dez Mandamentos, representando a presença de Deus em Israel.', level: 'teologico' },
  { id: 'tq13', text: 'Quem foram os patriarcas de Israel?', correctAnswer: 'Os fundadores da nação de Israel: Abraão, seu filho Isaque e seu neto Jacó.', level: 'teologico' },
  { id: 'tq14', text: 'O que é a crucificação?', correctAnswer: 'Método de execução romano usado para matar Jesus Cristo, considerado o evento central da expiação cristã.', level: 'teologico' },
  { id: 'tq15', text: 'O que é a ressurreição?', correctAnswer: 'O retorno físico de Jesus à vida ao terceiro dia após sua morte, validando sua divindade e promessa de vida eterna.', level: 'teologico' }
];

