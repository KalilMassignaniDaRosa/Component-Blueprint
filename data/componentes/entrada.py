"""Componentes de ENTRADA: como a pessoa fornece dados e dispara ações."""

COMPONENTES = [
    {
        "slug": "botoes",
        "nome": "Botões",
        "resumo": "Disparam uma ação. A hierarquia visual (primário, secundário, destrutivo) diz qual é a principal e qual é arriscada.",
        "quando_usar": [
            "Para ações que mudam algo: salvar, enviar, excluir, abrir um diálogo.",
            "Primário para a ação principal da tela, e só um por contexto.",
            "Secundário para alternativas (cancelar, voltar, ver detalhes).",
            "Destrutivo para ações que apagam ou não têm volta.",
        ],
        "quando_evitar": [
            "Para navegar para outra página: isso é um link (<a href>).",
            "Vários primários lado a lado: a pessoa não sabe qual é o caminho.",
            "Rótulos vagos como \"OK\" ou \"Sim\": prefira o verbo da ação (\"Excluir\").",
            "Botões só com ícone sem nome acessível ou dica visível.",
        ],
        "checklist": [
            ("Teclado", "Use <button type=\"button\">: Tab, Enter e Espaço já funcionam. Uma <div> clicável não funciona."),
            ("ARIA", "Botão só com ícone precisa de aria-label (ex.: \"Fechar\"); o SVG leva aria-hidden=\"true\"."),
            ("Foco", "Nunca remova o outline: troque-o por um anel de foco que combine com o design."),
            ("Contraste", "Texto do botão com 4.5:1; borda ou fundo com 3:1 contra a página."),
        ],
        "principios": [
            {
                "nome": "Lei de Fitts",
                "texto": "O tempo para atingir um alvo depende da distância e do tamanho dele. Botões importantes devem ser grandes (mínimo de 44×44 px no toque) e ficar perto de onde a atenção já está.",
            },
            {
                "nome": "Nielsen #5: Prevenção de erros",
                "texto": "Separe visualmente e fisicamente a ação destrutiva da ação segura, e peça confirmação quando não houver como desfazer.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Button", "https://www.w3.org/WAI/ARIA/apg/patterns/button/"),
            ("NN/g: Fitts's Law", "https://www.nngroup.com/articles/fitts-law/"),
        ],
        "script": True,
        "busca_extra": "botão cta ação",
    },
    {
        "slug": "inputs",
        "nome": "Inputs com validação",
        "resumo": "Campos de texto com rótulo visível, dica de formato e mensagem de erro que explica o problema perto de onde ele acontece.",
        "quando_usar": [
            "Para texto livre: nome, e-mail, senha, endereço.",
            "Com validação ao sair do campo, e não a cada tecla, para não acusar erro antes da hora.",
            "Sempre validando de novo no servidor: a validação no navegador é só conforto e pode ser burlada.",
        ],
        "quando_evitar": [
            "Placeholder no lugar do rótulo: ele some quando a pessoa digita.",
            "Erros genéricos (\"Campo inválido\"): diga como corrigir.",
            "Exigir um formato rígido que o sistema poderia aceitar e normalizar (telefone com ou sem traço).",
        ],
        "checklist": [
            ("ARIA", "Ligue o <label for> ao campo; ligue a dica e o erro com aria-describedby."),
            ("ARIA", "Campo com erro: aria-invalid=\"true\" e a mensagem em texto, perto do campo."),
            ("Foco", "Ao tentar enviar com erros, leve o foco ao primeiro campo inválido."),
            ("Contraste", "Borda do campo com 3:1. Mostre o erro com ícone e texto, não só com borda vermelha."),
        ],
        "principios": [
            {
                "nome": "Nielsen #9: Ajudar a reconhecer, diagnosticar e corrigir erros",
                "texto": "A mensagem de erro diz o que aconteceu e como resolver, em linguagem simples, no lugar do problema.",
            },
            {
                "nome": "Lei de Postel",
                "texto": "Seja liberal no que aceita: aceite \"(11) 9 1234-5678\" e \"11912345678\" e normalize você mesmo.",
            },
        ],
        "referencias": [
            ("W3C WAI: Form Validation", "https://www.w3.org/WAI/tutorials/forms/validation/"),
            ("NN/g: Error Messages", "https://www.nngroup.com/articles/error-message-guidelines/"),
        ],
        "script": True,
        "busca_extra": "formulário campo texto erro email senha validação",
    },
    {
        "slug": "select",
        "nome": "Select / Combobox",
        "resumo": "Escolha de uma opção numa lista fechada. O select nativo é o padrão; o combobox personalizado só quando o nativo não basta.",
        "quando_usar": [
            "Entre 5 e 15 opções mutuamente exclusivas (estado, país, categoria).",
            "Prefira o <select> nativo: no celular ele abre o seletor do sistema.",
            "Combobox personalizado quando as opções precisam de mais que texto (ícone, descrição).",
        ],
        "quando_evitar": [
            "Com 2 a 4 opções: radios mostram tudo de uma vez.",
            "Com centenas de opções: use um autocomplete com busca.",
            "Para disparar ações (\"Exportar como…\"): isso é um menu.",
        ],
        "checklist": [
            ("Teclado", "No personalizado: ↑ ↓ movem, Enter escolhe, Esc fecha, e digitar uma letra pula para a opção."),
            ("ARIA", "Use role=\"combobox\" com aria-expanded e aria-controls, role=\"listbox\" e role=\"option\" com aria-selected."),
            ("Foco", "O foco fica no combobox; a opção ativa é indicada por aria-activedescendant."),
            ("Contraste", "A opção destacada e a selecionada precisam ser distinguíveis entre si e do resto."),
        ],
        "principios": [
            {
                "nome": "Lei de Jakob",
                "texto": "O select nativo funciona como em todo lugar. Recriar do zero quebra hábitos e costuma quebrar a acessibilidade.",
            },
            {
                "nome": "Nielsen #8: Estética e design minimalista",
                "texto": "Esconde a lista até ser necessária. A tela mostra só o valor escolhido.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Select-Only Combobox", "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/"),
            ("MDN: <select>", "https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/select"),
        ],
        "script": True,
        "busca_extra": "lista suspensa opções listbox",
    },
    {
        "slug": "checkbox-radio-switch",
        "nome": "Checkbox, radio e switch",
        "resumo": "Três controles de escolha com significados diferentes: marcar vários, escolher um, ou ligar e desligar na hora.",
        "quando_usar": [
            "Checkbox: escolhas independentes (vários podem estar marcados).",
            "Radio: uma única escolha entre poucas opções, todas visíveis.",
            "Switch: liga/desliga com efeito imediato, sem botão \"Salvar\".",
        ],
        "quando_evitar": [
            "Switch para uma escolha que só vale depois de \"Salvar\": use checkbox.",
            "Radio com uma opção só: não dá para desmarcar.",
            "Rótulos negativos (\"Não me enviar e-mails\"): confundem o significado do marcado.",
        ],
        "checklist": [
            ("Teclado", "Checkbox e switch alternam com Espaço; num grupo de radios, as setas mudam a escolha."),
            ("ARIA", "Agrupe radios e checkboxes relacionados em <fieldset> com <legend>."),
            ("ARIA", "Switch: <input type=\"checkbox\" role=\"switch\">. O \"selecionar todos\" parcial usa o estado indeterminate."),
            ("Contraste", "A caixa ou trilho com 3:1; o marcado se diferencia por forma (✓, bolinha, posição), não só por cor."),
        ],
        "principios": [
            {
                "nome": "Affordance e significantes",
                "texto": "A caixa \"pede\" para ser marcada, o círculo indica exclusividade, o trilho sugere deslizar. A forma comunica o comportamento.",
            },
            {
                "nome": "Lei de Fitts",
                "texto": "O rótulo inteiro deve ser clicável, não só a caixinha de 16 px.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Switch", "https://www.w3.org/WAI/ARIA/apg/patterns/switch/"),
            ("NN/g: Toggle Switch Guidelines", "https://www.nngroup.com/articles/toggle-switch-guidelines/"),
        ],
        "script": True,
        "busca_extra": "caixa de seleção opção alternar toggle",
    },
    {
        "slug": "slider",
        "nome": "Slider",
        "resumo": "Escolhe um valor dentro de uma faixa contínua arrastando um controle, com resposta visual imediata.",
        "quando_usar": [
            "Valores aproximados em que a sensação importa mais que o número (volume, brilho).",
            "Quando a pessoa ajusta e vê o efeito na hora.",
            "Junto com um campo numérico quando o valor exato também importa.",
        ],
        "quando_evitar": [
            "Para valores precisos (idade, CPF, preço exato).",
            "Faixas enormes (de 1 a 10.000), em que cada pixel salta muitos valores.",
            "Como único controle no celular, onde arrastar com precisão é difícil.",
        ],
        "checklist": [
            ("Teclado", "Prefira <input type=\"range\">: setas, Page Up/Down, Home e End já funcionam."),
            ("ARIA", "Mostre o valor em texto ao lado (<output>) e use aria-valuetext quando o número sozinho não diz nada (\"70% · alto\")."),
            ("Foco", "Garanta um anel de foco visível no controle deslizante: o estilo padrão some quando você personaliza o slider."),
            ("Contraste", "Trilho e controle com 3:1, e alvo de arrasto de pelo menos 24 px."),
        ],
        "principios": [
            {
                "nome": "Manipulação direta",
                "texto": "A pessoa age sobre a representação e vê o resultado imediatamente, sem digitar comandos.",
            },
            {
                "nome": "Limite de Doherty",
                "texto": "Quando a resposta vem em menos de 400 ms, a interação parece fluida. O slider só funciona se o efeito acompanhar o dedo.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Slider", "https://www.w3.org/WAI/ARIA/apg/patterns/slider/"),
        ],
        "script": True,
        "busca_extra": "range faixa deslizar volume",
    },
    {
        "slug": "date-picker",
        "nome": "Date picker",
        "resumo": "Seleção de datas sem erro de formato, digitando ou escolhendo num calendário.",
        "quando_usar": [
            "Datas próximas, em que ver o dia da semana ajuda (agendamento, reserva).",
            "Prefira o <input type=\"date\"> nativo quando o visual dele for aceitável.",
            "Sempre permitindo também digitar a data.",
        ],
        "quando_evitar": [
            "Data de nascimento: rolar décadas no calendário é lento; três campos ou digitação são melhores.",
            "Datas aproximadas (\"mês que vem\"): um select de mês resolve.",
            "Calendário sem indicar quais dias estão indisponíveis.",
        ],
        "checklist": [
            ("Teclado", "No calendário: setas movem o dia, Page Up/Down trocam o mês, Enter escolhe e Esc fecha."),
            ("ARIA", "O calendário é um diálogo (role=\"dialog\") com uma grade (role=\"grid\"); o dia escolhido leva aria-selected."),
            ("Foco", "Ao abrir, o foco vai para o dia selecionado (ou hoje); ao fechar, volta ao botão do calendário."),
            ("Contraste", "Mostre o formato esperado em texto (dd/mm/aaaa) e diferencie hoje e o selecionado sem depender da cor."),
        ],
        "principios": [
            {
                "nome": "Nielsen #5: Prevenção de erros",
                "texto": "Escolher no calendário evita datas impossíveis e formatos trocados (mês/dia).",
            },
            {
                "nome": "Nielsen #7: Flexibilidade e eficiência",
                "texto": "Quem é rápido digita; quem prefere ver o mês clica. Os dois caminhos convivem.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Date Picker Dialog", "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/"),
            ("NN/g: Date-Input Form Fields", "https://www.nngroup.com/articles/date-input/"),
        ],
        "script": True,
        "busca_extra": "data calendário agenda",
    },
    {
        "slug": "autocomplete",
        "nome": "Autocomplete",
        "resumo": "Sugere opções enquanto a pessoa digita, para encontrar um item numa lista grande sem rolar.",
        "quando_usar": [
            "Listas grandes e conhecidas: cidades, produtos, pessoas.",
            "Quando a pessoa sabe o que procura, mas não a grafia exata.",
            "Mostrando o trecho que casou com o que foi digitado.",
        ],
        "quando_evitar": [
            "Listas curtas: um select ou radios mostram tudo.",
            "Quando a pessoa não sabe o que existe: ela precisa navegar, não adivinhar.",
            "Substituindo o texto digitado sem a pessoa confirmar.",
        ],
        "checklist": [
            ("Teclado", "↓ abre e percorre as sugestões; Enter escolhe; Esc fecha e mantém o que foi digitado."),
            ("ARIA", "O input leva role=\"combobox\", aria-autocomplete=\"list\", aria-expanded e aria-controls."),
            ("Foco", "O foco fica no input; a sugestão ativa é indicada por aria-activedescendant."),
            ("ARIA", "Anuncie quantas sugestões há (\"5 resultados\") numa região aria-live, com atraso."),
        ],
        "principios": [
            {
                "nome": "Nielsen #6: Reconhecer em vez de lembrar",
                "texto": "Ver \"São José dos Campos\" é mais fácil do que lembrar a grafia completa.",
            },
            {
                "nome": "Nielsen #7: Flexibilidade e eficiência",
                "texto": "Três letras e Enter substituem rolar uma lista de 5.000 itens.",
            },
        ],
        "referencias": [
            ("WAI-ARIA APG: Combobox (List Autocomplete)", "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/"),
        ],
        "script": True,
        "busca_extra": "sugestões busca typeahead combobox",
    },
]
