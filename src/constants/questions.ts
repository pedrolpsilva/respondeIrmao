export interface Question {
  id: string;
  text: string;
  level?: string; // ex: 'multidão', 'discípulo', 'apóstolo' | 'comunhão', 'testemunho', 'confissão'
  correctAnswer?: string; // optional for Quiz mode display
}

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
