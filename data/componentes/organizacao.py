"""Componentes de ORGANIZAÇÃO: como o conteúdo é agrupado, ordenado e resumido."""

COMPONENTES = [
    {
        "slug": "accordion",
        "nome": "Accordion",
        "resumo": "Seções empilhadas que expandem e recolhem sob demanda, mostrando só os títulos até a pessoa pedir mais.",
        "quando_usar": [
            "Perguntas frequentes e conteúdos longos em que a pessoa procura um trecho.",
            "No celular, para encurtar páginas muito longas.",
            "Quando os títulos são bons o bastante para a pessoa escolher.",
        ],
        "quando_evitar": [
            "Quando a pessoa precisa ler quase tudo: só acrescenta cliques.",
            "Com conteúdo curto, que cabe aberto.",
            "Escondendo informação essencial (preço, prazo).",
        ],
        "checklist": [
            ("ARIA", "Cada título é um <button> dentro de um heading (<h3>), com aria-expanded e aria-controls."),
            ("Teclado", "Enter e Espaço abrem e fecham. Para algo simples, <details>/<summary> já resolve."),
            ("Foco", "O foco fica no botão ao abrir; o conteúdo aparece logo abaixo, na ordem natural."),
            ("Contraste", "Indique aberto e fechado com ícone (+/− ou seta), além de cor."),
        ],
        "principios": [
            {
                "nome": "Divulgação progressiva",
                "texto": "Mostra a visão geral (os títulos) e deixa os detalhes a um clique.",
            },
            {
                "nome": "Lei de Hick",
                "texto": "Uma lista de títulos curtos é mais rápida de varrer do que uma parede de texto.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Accordion", "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"),
            ("NN/g: Accordions", "https://www.nngroup.com/articles/accordions-complex-content/"),
        ],
        "script": True,
        "busca_extra": "faq sanfona expandir recolher details",
    },
    {
        "slug": "cards",
        "nome": "Cards",
        "resumo": "Blocos que resumem um item (produto, artigo, pessoa) e levam aos detalhes.",
        "quando_usar": [
            "Coleções de itens heterogêneos, com imagem, título e poucas informações.",
            "Grades responsivas que se reorganizam do celular ao desktop.",
            "Quando a pessoa navega e compara visualmente.",
        ],
        "quando_evitar": [
            "Dados que precisam ser comparados coluna a coluna: use uma tabela.",
            "Cards com cinco botões e três links: ninguém sabe onde clicar.",
            "Tudo dentro de cards, até o que não é um item.",
        ],
        "checklist": [
            ("Teclado", "Card inteiro clicável: um único link no título, ampliado com ::after, não o card dentro de um <a>."),
            ("ARIA", "Cada card é um <article> (ou <li> numa lista) com um heading. O leitor de tela navega pelos títulos."),
            ("Foco", "Mostre o foco no card inteiro (:has(a:focus-visible)), não só no título."),
            ("Contraste", "A borda ou sombra do card com 3:1 quando ela é o único limite visível."),
        ],
        "principios": [
            {
                "nome": "Gestalt: Região comum",
                "texto": "A borda do card diz \"tudo isto pertence ao mesmo item\", sem precisar de explicação.",
            },
            {
                "nome": "Lei de Fitts",
                "texto": "Um card inteiro clicável é um alvo grande e fácil de acertar, principalmente no toque.",
            },
        ],
        "referencias": [
            ("NN/g: Cards", "https://www.nngroup.com/articles/cards-component/"),
            ("Inclusive Components: Cards", "https://inclusive-components.design/cards/"),
        ],
        "script": True,
        "busca_extra": "cartão bloco grade grid",
    },
    {
        "slug": "tabela",
        "nome": "Tabela",
        "resumo": "Dados em linhas e colunas, para comparar valores, com ordenação e filtro.",
        "quando_usar": [
            "Dados estruturados que a pessoa compara (preços, datas, status).",
            "Quando ordenar por uma coluna responde a uma pergunta (\"qual o maior?\").",
            "Com números alinhados à direita, para comparar casas decimais.",
        ],
        "quando_evitar": [
            "Para montar layout: tabela é para dados.",
            "No celular com 8 colunas sem plano B (rolagem horizontal controlada ou cards).",
            "Sem estado vazio quando o filtro não encontra nada.",
        ],
        "checklist": [
            ("ARIA", "Use <table> com <caption>, <th scope=\"col\"> e <th scope=\"row\">."),
            ("Teclado", "O cabeçalho ordenável é um <button> dentro do <th>, e o <th> leva aria-sort."),
            ("ARIA", "Anuncie o resultado do filtro (\"12 de 40 linhas\") numa região de status."),
            ("Foco", "Tabela com rolagem horizontal: contêiner com tabindex=\"0\", role=\"region\" e aria-label."),
        ],
        "principios": [
            {
                "nome": "Nielsen #7: Flexibilidade e eficiência",
                "texto": "Ordenar e filtrar deixa cada pessoa montar a visão que responde à sua pergunta.",
            },
            {
                "nome": "Alinhamento e leitura",
                "texto": "Texto à esquerda e números à direita, com a mesma unidade: o olho compara sem esforço.",
            },
        ],
        "referencias": [
            ("W3C WAI: Tables Tutorial", "https://www.w3.org/WAI/tutorials/tables/"),
            ("WAI-ARIA APG: Sortable Table", "https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/"),
        ],
        "script": True,
        "busca_extra": "grade dados ordenar filtrar colunas",
    },
    {
        "slug": "listas",
        "nome": "Listas",
        "resumo": "Itens em sequência, simples ou com ações, a forma mais básica de organizar conteúdo repetido.",
        "quando_usar": [
            "Qualquer conjunto de itens do mesmo tipo: tarefas, arquivos, contatos.",
            "Lista ordenada (<ol>) quando a ordem tem significado.",
            "Lista de definição (<dl>) para pares nome–valor.",
        ],
        "quando_evitar": [
            "Itens com muitos atributos para comparar: use tabela.",
            "Ações escondidas só no hover: no toque elas não existem.",
            "Listas enormes sem busca, filtro ou agrupamento.",
        ],
        "checklist": [
            ("ARIA", "Use <ul>, <ol> ou <dl> de verdade: o leitor de tela anuncia \"lista, 5 itens\"."),
            ("ARIA", "Botões de ação repetidos precisam dizer o item (\"Remover Relatório.pdf\", não só \"Remover\")."),
            ("Foco", "Ao remover um item, mova o foco para o próximo (ou o anterior), e não para o topo da página."),
            ("Contraste", "Mantenha separadores ou espaçamento claros entre os itens; mostre um estado vazio quando não houver nenhum."),
        ],
        "principios": [
            {
                "nome": "Efeito de posição serial",
                "texto": "Lembramos melhor do primeiro e do último item. Coloque o mais importante nas pontas.",
            },
            {
                "nome": "Gestalt: Similaridade",
                "texto": "Itens com a mesma aparência são entendidos como do mesmo tipo. Diferencie só o que é diferente.",
            },
        ],
        "referencias": [
            ("MDN: <ul>", "https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/ul"),
        ],
        "script": True,
        "busca_extra": "lista itens tarefas",
    },
    {
        "slug": "badges",
        "nome": "Badges / Tags",
        "resumo": "Rótulos curtos que indicam status, contagem ou categoria, e podem servir como filtros removíveis.",
        "quando_usar": [
            "Status de um item (Pago, Pendente, Atrasado).",
            "Contadores de não lidos num ícone ou aba.",
            "Filtros aplicados que a pessoa pode remover um por um.",
        ],
        "quando_evitar": [
            "Texto longo: badge é uma ou duas palavras.",
            "Badges em tudo: se tudo está destacado, nada está.",
            "Status indicado só pela cor da bolinha.",
        ],
        "checklist": [
            ("ARIA", "Contador num ícone precisa de texto completo para o leitor de tela (\"3 notificações não lidas\")."),
            ("Teclado", "Tag removível: o ✕ é um botão com nome (\"Remover filtro Azul\")."),
            ("Foco", "Ao remover uma tag, mova o foco para a próxima ou para o campo de filtro."),
            ("Contraste", "Texto da badge com 4.5:1; o significado vem da palavra (e de um ícone), não só da cor."),
        ],
        "principios": [
            {
                "nome": "Efeito de isolamento (Von Restorff)",
                "texto": "Um item diferente dos outros se destaca, desde que os destaques sejam raros.",
            },
            {
                "nome": "Nielsen #1: Visibilidade do estado do sistema",
                "texto": "O status fica visível no próprio item, sem precisar abrir os detalhes.",
            },
        ],
        "referencias": [
            ("WCAG 1.4.1: Uso de cor", "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"),
        ],
        "script": True,
        "busca_extra": "etiqueta chip status contador rótulo",
    },
]
