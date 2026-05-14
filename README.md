\#Responde, Irmão


## Product Overview

\*\*The Pitch:\*\* Um jogo mobile \*pass-and-play\* cristão projetado para quebrar o gelo, aprofundar amizades, gerar boas risadas e lágrimas de emoção. Conecta jovens e adultos através de perguntas que variam do trivial do cotidiano e bíblico a reflexões profundas de vida e bíblico, sempre baseado na vida cristã autêntica.

\*\*For:\*\* Grupos de jovens, células, famílias, igrejas com membros timidos e acampamentos de igreja que buscam entretenimento analógico focado na interação real ou competição amistosa.

\*\*Device:\*\* mobile

\*\*Design Direction:\*\* Neobrutalismo amigável. Cores sólidas e quentes, bordas grossas bem definidas, sombras duras e tipografia geométrica de alto impacto.

\*\*Inspired by:\*\* Kahoot, Heads Up!



\## Rules

* O jogo se baseia em perguntas e respostas, onde cada jogador responderá uma pergunta aleatória dentro de um nível pré selecionado, cada jogador responderá sua pergunta e, logo em seguida,  passará para o próximo jogador.
* O jogo possui dois modos: **Quiz** (competitivo e sobre conhecimento bíblico) e **Compartilhar** (amigável e promove compartilhamento)

  * Modo Quiz:

    * Níveis: Multidão (perguntas fáceis e nada desafiadoras), Discípulo (perguntas médias e pouco desafiadoras), Apóstolo (perguntas difíceis e muito desafiadoras)
    * Jogadores responderão perguntas bíblicas baseadas na Bíblia Protestante, com seus 66 livros, como versículos, personagens, passagens, contextos;
    * Os jogadores precisarão responder de maneira correta, respostas corretas concedem pontos, respostas incorretas tiram pontos;
    * Se o mesmo jogador responder mais de 3 respostas certas seguidas ele ficará com status 'Apóstolo', onde receberá 2 pontos para cada resposta certa. Caso ele erre alguma resposta, perde o status;
    * Erros resetarão o placar do jogador;
    * O jogador terá um tempo para responder a pergunta. O tempo é configurado previamente no jogo.
    * Ao responder o jogador passará para o próximo;
    * Ao errar o jogador passará para o próximo;
  * Modo Compartilhar:

    * Níveis: Comunhão (nivel fácil, com perguntas simples e não intrusivas; não contém perguntas a respeito de membros de igreja, opiniões e erros/pecados), Testemunho (nível médio, que possui todas as perguntas do nível Comunhão juntamente com perguntas mais reflexivas, aqui já é possível perguntar sobre membros/pastores/líderes/obreiros/diáconos da igreja e também utiliza mais perguntas voltadas para testemunho de vida, permite perguntas sobre erros; mas deixa de lado pecados mais pecados ou escandalizadores como pecados sexuais, morais) e Confissão (nível mais alto, aqui todas as outras perguntas fazem parte em conjunto com perguntas envolvendo pecados/erros do indivíduo, sem limitações de temas mas nunca buscando constranger)
    * Jogadores responderão perguntas baseadas em seu cotidiano cristão;
    * Não possui pontuação;
    * Não possui cronômetro;
    * Não existe resposta certa ou errada;
    * Jogador é incentivado a não responder apenas o 'porque/o que' mas também o 'quem/onde/quando'
    * Não é competitivo;





\## Screens

* \*\*Home:\*\* Abertura vibrante com marca, Jogar Compartilhamento, Jogar Quiz
* \*\*Cadastro de Jogadores:\*\* Inserção ágil de nomes com visualização em \*chips\*
* \*\*Configuração:\*\* Definição tátil de regras da partida (níveis, tempo, repetição)
* \*\*Partida:\*\* Cartão de pergunta focado, mostrando tema, nível, nível da pergunta, temporizador visual (se aplicável), placar (se aplicável) e ações de turno



\---

\## Key Flows

\*\*Jogar Compartilhamento:\*\* O anfitrião prepara o jogo para o grupo.

1\. User clicks `Começar Jogo` -> navega para Cadastro

2\. User adds 3 nomes e clicks `Avançar` -> navega para Configuração

3\. User selects `Testemunho`, clicks `Jogar` -> inicia Partida com o primeiro jogador



\*\*Jogar Quiz:\*\* O anfitrião prepara o jogo para o grupo.

1\. User clicks `Começar Jogo` -> navega para Cadastro

2\. User adds 3 nomes e clicks `Avançar` -> navega para Configuração

3\. User selects `Testemunho`, ativa Timer e clicks `Jogar` -> inicia Partida com o primeiro jogador



\---

<details>

<summary>Design System</summary>

\## Color Palette

\- \*\*Primary:\*\* `#2959F8` - Botões principais, CTAs

\- \*\*Background:\*\* `#FEFCE8` - Fundo das telas (Creme suave)

\- \*\*Surface:\*\* `#FFFFFF` - Cartões, modais e \*inputs\*

\- \*\*Text:\*\* `#1C1917` - Texto principal e títulos (Quase preto)

\- \*\*Muted:\*\* `#A8A29E` - Texto secundário, \*placeholders\*

\- \*\*Accent 1:\*\* `#4D7C0F` - Destaques positivos, ícones de ramo de oliveira (Verde oliva)

\- \*\*Accent 2:\*\* `#BE123C` - Botão de pular, ações destrutivas (Rosa escuro)

\## Typography

Tipografia robusta e geométrica, garantindo legibilidade extrema para todas as idades.

\- \*\*Headings:\*\* `Outfit`, 800, 32px (H1), 24px (H2)

\- \*\*Body:\*\* `DM Sans`, 500, 18px

\- \*\*Small text:\*\* `DM Sans`, 500, 14px

\- \*\*Buttons:\*\* `Outfit`, 700, 20px

\*\*Style notes:\*\* Bordas de `3px solid #1C1917`, sombras duras de `4px 4px 0px #1C1917`, cantos arredondados de `16px`. Foco em alvos de toque grandes (mínimo `56px` de altura).

\## Design Tokens

```css

:root {

&#x20; --color-primary: #2959F8;

&#x20; --color-background: #FEFCE8;

&#x20; --color-surface: #FFFFFF;

&#x20; --color-text: #1C1917;

&#x20; --color-muted: #A8A29E;

&#x20; --color-accent-1: #4D7C0F;

&#x20; --color-accent-2: #BE123C;

&#x20; --font-heading: 'Outfit', sans-serif;

&#x20; --font-body: 'DM Sans', sans-serif;

&#x20; --radius-card: 16px;

&#x20; --radius-button: 12px;

&#x20; --border-thick: 3px solid #1C1917;

&#x20; --shadow-hard: 4px 4px 0px #1C1917;

&#x20; --shadow-hard-active: 1px 1px 0px #1C1917;

}

```

</details>

\---

<details>

<summary>Screen Specifications</summary>

\### Home

\*\*Purpose:\*\* Recepcionar o usuário e iniciar o fluxo principal.

\*\*Layout:\*\* Centralizado verticalmente. Logotipo gigante no topo, 2 CTAs gigantes fixos no centro (Jogar Compartilhamento, Jogar Quis), 2 CTAs pequenos lado a lado (Sobre, Ajuda).

\*\*Key Elements:\*\*

\- \*\*Logo Text:\*\* `Outfit`, 800, 48px, texto empilhado "Responde, Irmão!", cor `#1C1917`

\- \*\*Primary CTA:\*\* Botão `Jogar Compartilhamento`, ocupa `100%` da largura (margem `24px`), cor `#2959F8`

\- \*\*Secundary CTA:\*\* Botão `Jogar Quiz`, ocupa `100%` da largura (margem `24px`), cor `#2959F8`

\- \*\*Tertiary CTA:\*\* Botão `Ajuda`, ocupa `49%` da largura (margem `24px`), cor `#2959F8`

\- \*\*Quaternary CTA:\*\* Botão `Sobre`, ocupa `49%` da largura (margem `24px`), cor `#2959F8`



\*\*Components:\*\*

\- \*\*Brutal Button:\*\* `h-64px`, `bg-primary`, `border-thick`, `shadow-hard`, texto `20px`

\*\*Interactions:\*\*

\- \*\*Click Primary CTA:\*\* Botão afunda (sombra reduz para `1px 1px`, translada `3px` para baixo/direita), avança tela após `150ms`

\- \*\*Click Secundary CTA:\*\* Botão afunda (sombra reduz para `1px 1px`, translada `3px` para baixo/direita), avança tela após `150ms`

\- \*\*Click Tertiary CTA:\*\* Botão afunda (sombra reduz para `1px 1px`, translada `3px` para baixo/direita), avança tela após `150ms`

\- \*\*Click Quaternary CTA:\*\* Botão afunda (sombra reduz para `1px 1px`, translada `3px` para baixo/direita), avança tela após `150ms`



\### Cadastro de Jogadores

\*\*Purpose:\*\* Adicionar o nome de quem vai participar da rodada.

\*\*Layout:\*\* Topo com título e input. Centro rolável com \*chips\* dos jogadores. Base com CTA de avanço.

\*\*Key Elements:\*\*

\- \*\*Title:\*\* `Quem vai jogar?`, 24px, alinhado à esquerda

\- \*\*Input Field:\*\* `h-56px`, `bg-surface`, `border-thick`, \*placeholder\* `Nome do abençoado...`

\- \*\*Add Button:\*\* Ícone `+`, `w-56px`, `h-56px`, `bg-accent-1`, posicionado ao lado do input

\- \*\*Player Chips:\*\* Retângulos arredondados (`8px`), `bg-surface`, nome do jogador, ícone `X` para remover

\- \*\*Next CTA:\*\* Botão `Configurar Jogo`, cor `#2959F8`, fixo na base

\*\*States:\*\*

\- \*\*Empty:\*\* Mensagem central `Adicione pelo menos 2 jogadores para começar.`

\- \*\*Error:\*\* Input pisca em vermelho se tentar adicionar nome duplicado ou vazio.

\*\*Components:\*\*

\- \*\*Player Chip:\*\* `px-16px`, `py-12px`, `text-18px`, layout \*flex row\*

\*\*Interactions:\*\*

\- \*\*Click Add:\*\* Chip aparece com animação `slide-in-top`

\- \*\*Click X on Chip:\*\* Chip desaparece com animação `fade-out`



\### Configuração - Compartilhamento

\*\*Purpose:\*\* Ajustar a dificuldade e regras do jogo.

\*\*Layout:\*\* Lista de cartões de opções em pilha vertical. CTA fixo na base.

\*\*Key Elements:\*\*

\- \*\*Nível Selector:\*\* 3 opções em \*segmented control\* gigante.

&#x20; - `Comunhão` (Verde, perguntas leves)

&#x20; - `Testemunho` (Âmbar, histórias pessoais)

&#x20; - `Confissão` (Rosa escuro, perguntas profundas)

\- \*\*Repetir Toggle:\*\* Switch estilizado, texto `Permitir perguntas repetidas`

&#x20; - `Para o mesmo jogador` Toggle

&#x20; - `Para outros jogadores` Toggle

\- \*\*Start CTA:\*\* Botão `Bora Jogar!`, cor `#2959F8`, fixo na base

\*\*States:\*\*

\- \*\*Default:\*\* `Comunhão` selecionado, Repetir `Off`

\*\*Components:\*\*

\- \*\*Segmented Option:\*\* `h-48px`, border, se ativo ganha `shadow-hard` e `bg-primary`

\*\*Interactions:\*\*

\- \*\*Click Option:\*\* Alterna estado com feedback tátil (vibração curta)



\### Configuração - Quiz

\*\*Purpose:\*\* Ajustar a dificuldade e regras do jogo.

\*\*Layout:\*\* Lista de cartões de opções em pilha vertical. CTA fixo na base.

\*\*Key Elements:\*\*

\- \*\*Nível Selector:\*\* 3 opções em \*segmented control\* gigante.

&#x20; - `Multidão` (Verde, perguntas leves)

&#x20; - `Discípulo` (Âmbar, histórias pessoais)

&#x20; - `Apóstolo` (Rosa escuro, perguntas profundas)

\- \*\*Placar Selector:\*\* 3 opções em \*segmented control\* gigante.

&#x20; - `10pts`

&#x20; - `15pts`

&#x20; - `20pts`

\- \*\*Timer Selector:\*\* Switch estilizado (brutalista), texto `Tempo Base (30s)`

&#x20; -`Tempo` Ajusta tempo com botões + e -, adicionando/removendo 30segundos por vez, com o mínimo sendo 30 segundos e máximo 2 minutos

\- \*\*Start CTA:\*\* Botão `Bora Jogar!`, cor `#2959F8`, fixo na base

\*\*States:\*\*

\- \*\*Default:\*\* `Comunhão` selecionado, Placar `10pts`, Timer `On`

\*\*Components:\*\*

\- \*\*Segmented Option:\*\* `h-48px`, border, se ativo ganha `shadow-hard` e `bg-primary`

\*\*Interactions:\*\*

\- \*\*Click Option:\*\* Alterna estado com feedback tátil (vibração curta)



\### Partida - Compartilhamento

\*\*Purpose:\*\* Tela central do jogo de perguntas e respostas.

\*\*Layout:\*\* Cabeçalho com jogador atual. Centro dominado por um cartão gigante de pergunta. Rodapé com ações bicolores.

\*\*Key Elements:\*\*

\- \*\*Current Player Banner:\*\* `Vez de \[Nome]`, `bg-surface`, `border-thick`, centralizado no topo

\- \*\*Question Card:\*\* `bg-surface`, `shadow-hard`, ocupa `60vh`. Ícone de ramo de oliveira no topo, texto da pergunta centralizado, `32px`

\- \*\*Action Pass:\*\* Botão `Responder e Passar`, `bg-accent-1` (Verde), ocupa `65%` da largura da base

\- \*\*Action Skip:\*\* Botão `Outra`, `bg-surface`, texto `#1C1917`, ocupa `30%` da largura da base

\*\*Components:\*\*

\- \*\*Question Text:\*\* `Outfit`, 700, `32px`, `text-center`, `leading-tight`

\*\*Interactions:\*\*

\- \*\*Click Pass:\*\* Cartão atual desliza para a esquerda (`slide-out-left`), novo cartão entra da direita. Banner de jogador atualiza.

\- \*\*Click Skip:\*\* Cartão vira no próprio eixo (3D flip), revelando nova pergunta.



\### Partida - Quiz

\*\*Purpose:\*\* Tela central do jogo de perguntas e respostas.

\*\*Layout:\*\* Cabeçalho com jogador atual e Placar com top 3 mais pontuados. Centro dominado por um cartão gigante de pergunta. Rodapé com ações bicolores.

\*\*Key Elements:\*\*

\- \*\*Score Div:\*\* Área com top 3 jogadores com mais pontos, centralizado no topo

\- \*\*Current Player Banner:\*\* `Vez de \\\[Nome]`, `bg-surface`, `border-thick`, centralizado no topo abaixo do placar

\- \*\*Timer Bar:\*\* Barra de progresso horizontal grudada no banner, reduz de `100%` a `0%`, cor `#BE123C`

\- \*\*Question Card:\*\* `bg-surface`, `shadow-hard`, ocupa `60vh`. Ícone de ramo de oliveira no topo, texto da pergunta centralizado, `32px`

\- \*\*Action Pass:\*\* Botão `Acertou`, `bg-accent-1` (Verde), ocupa `49%` da largura da base

\- \*\*Action Skip:\*\* Botão `Errou`, `bg-surface`, texto `#1C1917`, ocupa `49%` da largura da base

\*\*States:\*\*

\- \*\*Time Up:\*\* Fundo pisca vermelho, cartão mostra `Tempo Esgotado!`.

\- \*\*Bonus status:\*\* Banner do jogador balança e pisca com bordas alaranjadas e com ícone de fogo saindo levemente do banner.

\*\*Components:\*\*

\- \*\*Question Text:\*\* `Outfit`, 700, `32px`, `text-center`, `leading-tight`

\*\*Interactions:\*\*

\- \*\*Click Pass:\*\* Cartão atual desliza para a esquerda (`slide-out-left`), novo cartão entra da direita. Banner de jogador atualiza.

\- \*\*Click Skip:\*\* Cartão vira no próprio eixo (3D flip), revelando nova pergunta.



</details>

\---

<details>

<summary>Build Guide</summary>

\*\*Stack:\*\* HTML + Tailwind CSS v3

\*\*Build Order:\*\*

1\. \*\*Design System \& Base Layout:\*\* Configure o `tailwind.config.js` com as cores (`primary`, `accent-1`), fontes (`Outfit`, `DMSans`) e classes utilitárias personalizadas para as bordas e sombras do neobrutalismo (`border-thick`, `shadow-hard`).

2\. \*\*Components:\*\* Crie o `BrutalButton` e o `Input` como base, pois são recorrentes em todas as telas.

3\. \*\*Home:\*\* Implemente a tela inicial para validar a tipografia, cores principais e o layout de botão fixo na base.

4\. \*\*Partida:\*\* A tela mais complexa. Implemente o layout do cartão de pergunta de tamanho responsivo (`60vh`) e os botões duplos no rodapé.

5\. \*\*Cadastro de Jogadores:\*\* Adicione a lógica de flexbox para os chips fluírem (`flex-wrap`).

6\. \*\*Configuração:\*\* Implemente os \*toggles\* e o \*segmented control\* personalizados.

</details>

