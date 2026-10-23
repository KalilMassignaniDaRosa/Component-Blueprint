"""Componentes de NAVEGAÇÃO: como a pessoa se localiza e se move pelo produto."""

COMPONENTES = [
    {
        "slug": "breadcrumbs",
        "nome": "Breadcrumbs",
        "resumo": "Mostram onde você está na hierarquia do site e oferecem o caminho de volta, nível por nível.",
        "quando_usar": [
            "Sites com hierarquia de 3 níveis ou mais (loja › categoria › produto).",
            "Quando a pessoa chega por busca ou link direto e precisa se situar.",
            "Como navegação secundária, sempre abaixo da navegação principal.",
        ],
        "quando_evitar": [
            "Sites rasos, de um ou dois níveis: a trilha só ocupa espaço.",
            "Para mostrar o histórico de páginas visitadas: isso é o botão Voltar.",
            "Como única forma de navegar.",
        ],
        "checklist": [
            ("ARIA", "Envolva a trilha em <nav aria-label=\"Trilha de navegação\"> com uma lista <ol>."),
            ("ARIA", "Marque a página atual com aria-current=\"page\" e não a deixe como link."),
            ("Leitor de tela", "Coloque os separadores (/ ou ›) via CSS para o leitor de tela não ler cada um."),
            ("Teclado", "Em telas pequenas, recolha os níveis do meio num botão \"…\" que continue acessível pelo teclado."),
        ],
        "principios": [
            {
                "nome": "Nielsen #1: Visibilidade do estado do sistema",
                "texto": "A trilha responde a \"onde estou?\" sem a pessoa precisar adivinhar pela URL ou pelo título.",
            },
            {
                "nome": "Modelo mental de lugar",
                "texto": "Mostrar a hierarquia ajuda a pessoa a formar um mapa do site, e assim ela navega com mais confiança.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Breadcrumb", "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/"),
            ("NN/g: Breadcrumbs", "https://www.nngroup.com/articles/breadcrumbs/"),
        ],
        "script": True,
        "busca_extra": "trilha caminho hierarquia",
    },
    {
        "slug": "dropdown",
        "nome": "Menu dropdown",
        "resumo": "Um botão que abre uma lista de ações. Agrupa opções secundárias sem poluir a tela.",
        "quando_usar": [
            "Ações secundárias de um item (editar, duplicar, arquivar, excluir).",
            "Quando há mais ações do que cabem como botões visíveis.",
            "Menus de conta ou de configurações no topo da página.",
        ],
        "quando_evitar": [
            "Para a ação principal da tela: ela deve estar sempre visível.",
            "Para escolher um valor num formulário: isso é um select.",
            "Com só 1 ou 2 opções: mostre-as como botões.",
            "Menus dentro de menus, em vários níveis.",
        ],
        "checklist": [
            ("Teclado", "Enter ou ↓ abrem o menu no primeiro item; ↑ ↓ navegam; Esc fecha e devolve o foco ao botão."),
            ("ARIA", "O botão leva aria-haspopup=\"menu\" e aria-expanded; a lista, role=\"menu\"; cada opção, role=\"menuitem\"."),
            ("Foco", "Só um item do menu entra no Tab por vez (tabindex itinerante). Tab sai do menu e o fecha."),
            ("Contraste", "Separe a ação destrutiva com uma linha e cor própria, e mantenha o rótulo explícito."),
        ],
        "principios": [
            {
                "nome": "Lei de Hick",
                "texto": "Quanto mais opções visíveis, mais tempo para decidir. Esconder as secundárias acelera a escolha das principais.",
            },
            {
                "nome": "Nielsen #8: Estética e design minimalista",
                "texto": "Cada ação extra na tela compete pela atenção. O menu tira da vista o que é raro, sem tirar do alcance.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Menu Button", "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"),
        ],
        "script": True,
        "busca_extra": "menu botão ações kebab",
    },
    {
        "slug": "navbar",
        "nome": "Navbar",
        "resumo": "A barra de navegação principal, presente em todas as páginas. Leva às seções mais importantes do site.",
        "quando_usar": [
            "Sempre que o site tem de 2 a 7 seções principais.",
            "No topo da página, no mesmo lugar em todas as páginas.",
            "Com a seção atual destacada, para a pessoa saber onde está.",
        ],
        "quando_evitar": [
            "Com mais de 7 itens: agrupe ou use uma sidebar.",
            "Escondida atrás de um ícone de menu no desktop, onde há espaço.",
            "Com itens que mudam de lugar de uma página para outra.",
        ],
        "checklist": [
            ("ARIA", "Use <nav aria-label=\"Principal\"> com uma lista de links, e aria-current=\"page\" no item atual."),
            ("Teclado", "Ofereça um link \"Pular para o conteúdo\" antes da navbar."),
            ("Foco", "No celular, o botão de menu precisa de aria-expanded e aria-controls, e o Esc deve fechar o menu."),
            ("Contraste", "Marque o item atual com mais do que cor: fundo, sublinhado ou peso."),
        ],
        "principios": [
            {
                "nome": "Lei de Jakob",
                "texto": "As pessoas passam a maior parte do tempo em outros sites. Elas esperam a navegação no topo, com o logo levando ao início.",
            },
            {
                "nome": "Nielsen #4: Consistência e padrões",
                "texto": "A mesma barra, no mesmo lugar e com os mesmos itens em todas as páginas, vira algo que a pessoa nem precisa pensar.",
            },
        ],
        "referencias": [
            ("W3C WAI: Menus de navegação", "https://www.w3.org/WAI/tutorials/menus/"),
            ("NN/g: Menu Design Checklist", "https://www.nngroup.com/articles/menu-design/"),
        ],
        "script": True,
        "busca_extra": "barra navegação topo header menu hambúrguer",
    },
    {
        "slug": "sidebar",
        "nome": "Sidebar",
        "resumo": "Navegação lateral para produtos com muitas seções ou hierarquia profunda, como painéis e documentações.",
        "quando_usar": [
            "Painéis e aplicativos com muitas seções que a pessoa alterna o tempo todo.",
            "Documentação com hierarquia (capítulos e subcapítulos).",
            "Quando a navegação precisa ficar visível enquanto se trabalha.",
        ],
        "quando_evitar": [
            "Sites simples, de poucas páginas: uma navbar basta.",
            "No celular sem recolher: ela come a tela inteira.",
            "Com grupos todos abertos ao mesmo tempo e sem títulos.",
        ],
        "checklist": [
            ("ARIA", "Use <nav> com aria-label próprio (ex.: \"Seções do painel\"), diferente do da navbar."),
            ("Teclado", "Grupos que abrem e fecham são botões com aria-expanded, operáveis com Enter e Espaço."),
            ("Foco", "Ao recolher a sidebar só em ícones, cada link mantém o nome acessível (aria-label ou texto oculto)."),
            ("Contraste", "O item atual precisa de um indicador claro: barra lateral, fundo ou peso, além da cor."),
        ],
        "principios": [
            {
                "nome": "Gestalt: Região comum",
                "texto": "Elementos dentro de uma mesma área delimitada são vistos como um grupo. A sidebar separa \"navegar\" de \"trabalhar\".",
            },
            {
                "nome": "Nielsen #6: Reconhecer em vez de lembrar",
                "texto": "Com todas as seções à vista, a pessoa reconhece para onde ir em vez de lembrar o caminho.",
            },
        ],
        "referencias": [
            ("NN/g: Vertical Navigation", "https://www.nngroup.com/articles/vertical-nav/"),
        ],
        "script": True,
        "busca_extra": "lateral menu painel",
    },
    {
        "slug": "tabs",
        "nome": "Tabs (abas)",
        "resumo": "Alternam entre painéis de conteúdo relacionado no mesmo lugar, mostrando um por vez.",
        "quando_usar": [
            "Conteúdos do mesmo nível que a pessoa não precisa ver ao mesmo tempo.",
            "Entre 2 e 6 abas, com rótulos curtos e previsíveis.",
            "Para trocar de visão sem sair da página (ex.: Resumo / Detalhes).",
        ],
        "quando_evitar": [
            "Quando a pessoa precisa comparar o conteúdo de duas abas: mostre lado a lado.",
            "Para etapas em sequência: isso é um stepper.",
            "Muitas abas que transbordam a tela: use um menu ou uma sidebar.",
            "Como navegação principal entre páginas: isso é uma navbar de links.",
        ],
        "checklist": [
            ("Teclado", "Setas ← → trocam de aba; Home e End vão para a primeira e a última."),
            ("Foco", "Só a aba ativa entra no Tab (tabindex=\"0\"); as outras ficam com tabindex=\"-1\"."),
            ("ARIA", "Use role=\"tablist\", role=\"tab\" com aria-selected e aria-controls, e role=\"tabpanel\"."),
            ("Contraste", "Destaque a aba ativa com sublinhado grosso ou peso, não só com cor."),
        ],
        "principios": [
            {
                "nome": "Nielsen #6: Reconhecer em vez de lembrar",
                "texto": "As abas deixam todas as opções visíveis o tempo todo. A pessoa não precisa lembrar onde está cada conteúdo: ela reconhece pelo rótulo.",
            },
            {
                "nome": "Divulgação progressiva",
                "texto": "Mostra um painel por vez para reduzir a carga cognitiva, sem esconder que o resto existe.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Tabs", "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"),
            ("NN/g: Tabs, Used Right", "https://www.nngroup.com/articles/tabs-used-right/"),
        ],
        "script": True,
        "busca_extra": "abas painéis",
    },
    {
        "slug": "paginacao",
        "nome": "Paginação",
        "resumo": "Divide uma lista longa em páginas numeradas, com controles para avançar, voltar e saltar.",
        "quando_usar": [
            "Resultados de busca e listas em que a pessoa quer saber \"onde parou\".",
            "Quando a posição importa: compartilhar \"a página 3\" com alguém.",
            "Tabelas com muitos registros.",
        ],
        "quando_evitar": [
            "Feeds de consumo contínuo (rolagem infinita ou \"carregar mais\" funcionam melhor).",
            "Listas curtas que cabem numa página só.",
            "Sem refletir a página na URL: o botão Voltar do navegador quebra.",
        ],
        "checklist": [
            ("ARIA", "Use <nav aria-label=\"Paginação\"> e aria-current=\"page\" no número da página atual."),
            ("Teclado", "Use links ou botões de verdade, com área de clique de pelo menos 44 × 44 px."),
            ("ARIA", "Dê nomes completos às setas: aria-label=\"Página anterior\" e \"Próxima página\"."),
            ("Foco", "Ao trocar de página, leve o foco ao início da lista, para não deixar a pessoa no rodapé."),
        ],
        "principios": [
            {
                "nome": "Nielsen #1: Visibilidade do estado do sistema",
                "texto": "\"Página 4 de 12\" diz onde a pessoa está e quanto falta, coisa que a rolagem infinita esconde.",
            },
            {
                "nome": "Nielsen #3: Controle e liberdade",
                "texto": "A pessoa decide quando avançar e consegue voltar exatamente ao ponto em que estava.",
            },
        ],
        "referencias": [
            ("NN/g: Infinite Scrolling vs. Pagination", "https://www.nngroup.com/articles/infinite-scrolling-tips/"),
        ],
        "script": True,
        "busca_extra": "páginas lista resultados",
    },
    {
        "slug": "stepper",
        "nome": "Stepper / Wizard",
        "resumo": "Guia a pessoa por um processo em etapas ordenadas, mostrando em qual está e quantas faltam.",
        "quando_usar": [
            "Processos longos que podem ser divididos em partes lógicas (cadastro, checkout).",
            "Quando a ordem importa: uma etapa depende da anterior.",
            "Entre 3 e 6 etapas, cada uma com um nome claro.",
        ],
        "quando_evitar": [
            "Tarefas curtas que cabem numa tela só.",
            "Quando a pessoa precisa pular livremente entre as partes: use tabs.",
            "Com etapas genéricas (\"Passo 1, Passo 2\") que não dizem o que vem.",
        ],
        "checklist": [
            ("ARIA", "Use uma lista <ol> e marque a etapa atual com aria-current=\"step\"."),
            ("Foco", "Ao avançar, leve o foco para o título da nova etapa e anuncie \"Etapa 2 de 4\"."),
            ("Teclado", "Voltar e Avançar são <button> de verdade, e Voltar nunca apaga o que a pessoa já preencheu."),
            ("Contraste", "Concluída, atual e futura se diferenciam por ícone e texto, não só por cor."),
        ],
        "principios": [
            {
                "nome": "Efeito do gradiente de meta",
                "texto": "As pessoas se esforçam mais quando veem que estão perto do fim. Mostrar o progresso reduz o abandono.",
            },
            {
                "nome": "Divisão em blocos (chunking)",
                "texto": "Quebrar uma tarefa grande em partes menores reduz a carga na memória de trabalho a cada momento.",
            },
        ],
        "referencias": [
            ("NN/g: Wizards", "https://www.nngroup.com/articles/wizards/"),
        ],
        "script": True,
        "busca_extra": "etapas passos wizard progresso checkout",
    },
]
