"""Componentes de FEEDBACK: como o sistema responde e informa o que está acontecendo."""

COMPONENTES = [
    {
        "slug": "toast",
        "nome": "Toast / Notificação",
        "resumo": "Mensagem breve, no canto da tela, que confirma algo que acabou de acontecer sem interromper o trabalho.",
        "quando_usar": [
            "Confirmar ações concluídas (\"Arquivo salvo\").",
            "Oferecer um \"Desfazer\" logo depois de uma ação.",
            "Avisos que não exigem resposta imediata.",
        ],
        "quando_evitar": [
            "Erros que a pessoa precisa corrigir: mostre-os junto do campo ou num alert fixo.",
            "Informação importante que some antes de ser lida.",
            "Vários toasts empilhados ao mesmo tempo.",
        ],
        "checklist": [
            ("ARIA", "Mantenha um contêiner role=\"status\" (aria-live=\"polite\") vazio desde o início e insira as mensagens nele."),
            ("Foco", "Não roube o foco. Se houver ação (Desfazer), ofereça também outro caminho para ela."),
            ("Teclado", "Pause o tempo de saída enquanto o mouse ou o foco estiver no toast, e dê um botão de fechar."),
            ("Contraste", "Texto com 4.5:1 e tipo (sucesso, erro) indicado por ícone e palavra; deixe o toast na tela por pelo menos 5 segundos."),
        ],
        "principios": [
            {
                "nome": "Nielsen #1: Visibilidade do estado do sistema",
                "texto": "Toda ação merece uma resposta. O toast confirma que o clique funcionou.",
            },
            {
                "nome": "Nielsen #3: Controle e liberdade",
                "texto": "O \"Desfazer\" no toast permite agir rápido sem medo, em vez de pedir confirmação antes.",
            },
        ],
        "referencias": [
            ("MDN: ARIA status role", "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role"),
            ("NN/g: Indicators, Validations, Notifications", "https://www.nngroup.com/articles/indicators-validations-notifications/"),
        ],
        "script": True,
        "busca_extra": "notificação snackbar mensagem aviso",
    },
    {
        "slug": "alert",
        "nome": "Alert",
        "resumo": "Mensagem destacada e persistente dentro da página, para informações que a pessoa não pode deixar passar.",
        "quando_usar": [
            "Erros que impedem continuar (\"Pagamento recusado\").",
            "Avisos sobre o contexto da página (\"Você está vendo dados de ontem\").",
            "Resumo de erros no topo de um formulário, com links para cada campo.",
        ],
        "quando_evitar": [
            "Para confirmar coisas pequenas: um toast basta.",
            "Vários alerts ao mesmo tempo: nenhum chama atenção.",
            "Sem dizer o que fazer em seguida.",
        ],
        "checklist": [
            ("ARIA", "Para avisos que surgem depois que a página carregou, use role=\"alert\" (urgente) ou role=\"status\" (discreto)."),
            ("ARIA", "Alerts presentes desde o carregamento não precisam de role: são conteúdo normal da página."),
            ("Contraste", "Tipo (erro, aviso, sucesso, info) com ícone e palavra, além da cor."),
            ("Teclado", "Se o alert puder ser fechado, o botão precisa de nome (\"Fechar aviso\")."),
        ],
        "principios": [
            {
                "nome": "Nielsen #9: Reconhecer, diagnosticar e corrigir erros",
                "texto": "Diga o problema, a causa provável e a solução, com um botão para resolver quando possível.",
            },
            {
                "nome": "Efeito de isolamento (Von Restorff)",
                "texto": "O que é diferente do resto é lembrado. Funciona só se o alert for raro.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Alert", "https://www.w3.org/WAI/ARIA/apg/patterns/alert/"),
        ],
        "script": True,
        "busca_extra": "aviso erro mensagem banner",
    },
    {
        "slug": "modal",
        "nome": "Modal / Dialog",
        "resumo": "Interrompe o fluxo para pedir uma decisão ou foco total numa tarefa curta.",
        "quando_usar": [
            "Confirmar ações destrutivas ou irreversíveis.",
            "Tarefas curtas e autocontidas que precisam de atenção total.",
            "Avisos críticos que a pessoa não pode deixar passar.",
        ],
        "quando_evitar": [
            "Para informação que não exige decisão: use um toast ou um alert na página.",
            "Ao abrir a página, sem a pessoa ter pedido nada (newsletter, cookies…).",
            "Para fluxos longos com muitos campos: uma página própria é melhor.",
            "Modal dentro de modal.",
        ],
        "checklist": [
            ("ARIA", "Use <dialog> com showModal(): ele prende o foco, deixa o fundo inerte e fecha com Esc."),
            ("ARIA", "Dê nome ao diálogo com aria-labelledby (título) e aria-describedby (texto)."),
            ("Foco", "Ao abrir, foque a opção segura (Cancelar); ao fechar, devolva o foco a quem abriu."),
            ("Teclado", "Ofereça sempre uma saída: Cancelar, ✕ e Esc."),
        ],
        "principios": [
            {
                "nome": "Nielsen #3: Controle e liberdade",
                "texto": "Sempre deve haver uma saída óbvia: botão Cancelar, Esc e um botão de fechar. Ninguém deve se sentir preso.",
            },
            {
                "nome": "Nielsen #5: Prevenção de erros",
                "texto": "A confirmação existe para evitar o erro irreversível. Para funcionar, precisa ser rara; se aparece toda hora, a pessoa aprende a clicar em \"Sim\" sem ler.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Dialog (Modal)", "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"),
            ("NN/g: Modal & Nonmodal Dialogs", "https://www.nngroup.com/articles/modal-nonmodal-dialog/"),
        ],
        "script": True,
        "busca_extra": "diálogo janela confirmação popup",
    },
    {
        "slug": "tooltip",
        "nome": "Tooltip",
        "resumo": "Rótulo curto que aparece ao passar o mouse ou focar um elemento, para explicar o que ele faz.",
        "quando_usar": [
            "Nomear botões só com ícone.",
            "Explicar um termo ou abreviação de forma breve.",
            "Mostrar um atalho de teclado (\"Salvar · Ctrl+S\").",
        ],
        "quando_evitar": [
            "Para informação essencial: no celular não existe hover.",
            "Com links ou botões dentro: isso é um popover.",
            "Repetindo exatamente o texto visível do elemento.",
        ],
        "checklist": [
            ("Teclado", "Mostre o tooltip também no foco, não só no hover, e feche com Esc."),
            ("ARIA", "Ligue o tooltip ao gatilho com aria-describedby (ou use-o como nome, via aria-labelledby, em botões só de ícone)."),
            ("Hover", "O mouse precisa poder passar para cima do tooltip sem ele sumir (WCAG 1.4.13)."),
            ("Contraste", "Texto do tooltip com 4.5:1 e atraso curto (~300 ms) para não piscar por acaso."),
        ],
        "principios": [
            {
                "nome": "Nielsen #10: Ajuda e documentação",
                "texto": "A ajuda aparece no lugar e no momento em que a dúvida surge, sem tirar a pessoa da tarefa.",
            },
            {
                "nome": "Nielsen #8: Estética e design minimalista",
                "texto": "Ícones mantêm a interface limpa, e o tooltip garante que eles continuem compreensíveis.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Tooltip", "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"),
            ("WCAG 1.4.13: Conteúdo em hover ou foco", "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"),
        ],
        "script": True,
        "busca_extra": "dica hover legenda",
    },
    {
        "slug": "popover",
        "nome": "Popover",
        "resumo": "Painel flutuante ancorado a um botão, com conteúdo interativo: opções, filtros, um formulário curto.",
        "quando_usar": [
            "Conteúdo interativo ligado a um botão específico (filtros, compartilhar, preferências).",
            "Quando um modal seria pesado demais e um tooltip, pobre demais.",
            "Com fechamento fácil: clique fora ou Esc.",
        ],
        "quando_evitar": [
            "Para uma lista de ações simples: isso é um menu dropdown.",
            "Para tarefas que precisam de atenção total: use um modal.",
            "Abrindo só no hover: conteúdo interativo precisa de clique.",
        ],
        "checklist": [
            ("ARIA", "O atributo nativo popover com popovertarget já cuida de abrir, fechar, clique fora e Esc."),
            ("ARIA", "O botão gatilho mostra o estado com aria-expanded (o navegador faz isso no popover nativo)."),
            ("Foco", "Ao abrir, mova o foco para dentro; ao fechar, devolva-o ao botão."),
            ("Contraste", "Separe o popover da página com borda e sombra, e garanta 4.5:1 no texto."),
        ],
        "principios": [
            {
                "nome": "Proximidade (Gestalt)",
                "texto": "O painel aparece junto do botão que o abriu, e a relação entre os dois fica óbvia.",
            },
            {
                "nome": "Divulgação progressiva",
                "texto": "As opções avançadas ficam a um clique, sem ocupar a tela de quem não precisa delas.",
            },
        ],
        "referencias": [
            ("MDN: Popover API", "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API"),
        ],
        "script": True,
        "busca_extra": "painel flutuante balão",
    },
    {
        "slug": "progress",
        "nome": "Progress bar",
        "resumo": "Mostra quanto de uma tarefa já foi concluído e, idealmente, quanto falta.",
        "quando_usar": [
            "Tarefas com duração mensurável: upload, download, importação.",
            "Esperas acima de uns 10 segundos.",
            "Junto com texto: porcentagem, \"3 de 10 arquivos\" ou tempo restante.",
        ],
        "quando_evitar": [
            "Quando não há como medir o progresso: use um spinner ou uma barra indeterminada.",
            "Esperas curtas (menos de 1 segundo): a barra só pisca.",
            "Barras que \"empacam\" em 99%: são piores que nenhuma.",
        ],
        "checklist": [
            ("ARIA", "Use <progress value max> com um rótulo (<label> ou aria-labelledby)."),
            ("ARIA", "Sem value, o <progress> vira indeterminado: o leitor de tela entende que está ocupado."),
            ("ARIA", "Anuncie só os marcos (25%, 50%, concluído) numa região de status, não cada 1%."),
            ("Contraste", "Barra preenchida com 3:1 contra o trilho e o valor também em texto."),
        ],
        "principios": [
            {
                "nome": "Nielsen #1: Visibilidade do estado do sistema",
                "texto": "Saber quanto falta transforma uma espera ansiosa numa espera aceitável.",
            },
            {
                "nome": "Efeito do gradiente de meta",
                "texto": "Ver que falta pouco motiva a esperar, ou a continuar, até o fim.",
            },
        ],
        "referencias": [
            ("MDN: <progress>", "https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/progress"),
            ("NN/g: Progress Indicators", "https://www.nngroup.com/articles/progress-indicators/"),
        ],
        "script": True,
        "busca_extra": "barra de progresso carregamento upload",
    },
    {
        "slug": "spinner",
        "nome": "Spinner",
        "resumo": "Indica uma espera de duração desconhecida, mostrando que o sistema está trabalhando.",
        "quando_usar": [
            "Esperas curtas (de 1 a 10 segundos) sem progresso mensurável.",
            "Dentro do próprio botão que disparou a ação.",
            "Só depois de uns 300 ms, para não piscar em respostas rápidas.",
        ],
        "quando_evitar": [
            "Esperas longas: mostre progresso ou deixe a pessoa fazer outra coisa.",
            "Tela inteira bloqueada por um spinner quando só uma parte está carregando.",
            "Vários spinners ao mesmo tempo na mesma tela.",
        ],
        "checklist": [
            ("ARIA", "Envolva o spinner num role=\"status\" com texto (\"Carregando pedidos…\"); o desenho leva aria-hidden."),
            ("ARIA", "Marque a área que está carregando com aria-busy=\"true\" e remova ao terminar."),
            ("Foco", "Quando o conteúdo chegar, não mova o foco sem motivo; anuncie que terminou."),
            ("Movimento", "Com prefers-reduced-motion, gire mais devagar, mas não remova: ele ainda comunica \"ocupado\"."),
        ],
        "principios": [
            {
                "nome": "Nielsen #1: Visibilidade do estado do sistema",
                "texto": "Sem sinal de trabalho, a pessoa acha que travou e clica de novo.",
            },
            {
                "nome": "Limite de Doherty",
                "texto": "Abaixo de 400 ms a resposta parece instantânea, e um spinner nesse caso só atrapalha. Acima disso, ele tranquiliza.",
            },
        ],
        "referencias": [
            ("NN/g: Response Times", "https://www.nngroup.com/articles/response-times-3-important-limits/"),
        ],
        "script": True,
        "busca_extra": "carregando loading espera",
    },
    {
        "slug": "skeleton",
        "nome": "Skeleton loading",
        "resumo": "Esboço do layout em blocos cinza enquanto o conteúdo carrega, para a página não \"pular\" quando os dados chegam.",
        "quando_usar": [
            "Listas, cards e perfis com estrutura previsível.",
            "Carregamentos de 1 a 5 segundos.",
            "Para reservar o espaço e evitar que o layout salte.",
        ],
        "quando_evitar": [
            "Quando o formato do conteúdo é imprevisível.",
            "Carregamentos longos: mostre progresso real.",
            "Skeletons que não lembram o conteúdo final.",
        ],
        "checklist": [
            ("ARIA", "Esconda os blocos do leitor de tela (aria-hidden) e anuncie \"Carregando…\" num role=\"status\"."),
            ("ARIA", "Marque o contêiner com aria-busy=\"true\" até o conteúdo real chegar."),
            ("Movimento", "Com prefers-reduced-motion, troque o brilho animado por blocos parados."),
            ("Foco", "Os blocos não devem ser focáveis nem clicáveis."),
        ],
        "principios": [
            {
                "nome": "Percepção de desempenho",
                "texto": "Ver a forma do conteúdo faz a espera parecer menor, porque a pessoa já começa a se orientar.",
            },
            {
                "nome": "Estabilidade visual",
                "texto": "Reservar o espaço evita que botões mudem de lugar no momento em que a pessoa ia clicar.",
            },
        ],
        "referencias": [
            ("NN/g: Skeleton Screens", "https://www.nngroup.com/articles/skeleton-screens/"),
        ],
        "script": True,
        "busca_extra": "esqueleto placeholder carregando shimmer",
    },
]
