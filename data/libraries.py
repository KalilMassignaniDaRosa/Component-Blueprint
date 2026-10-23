"""Bibliotecas do laboratório e coleções de ícones: versões, links e textos.

Este é o ÚNICO lugar com versões e endereços de CDN. Para trocar uma versão:
    1. mude o número em PACOTES (ou em COLECOES_ICONES);
    2. rode  python tools/atualizar_sri.py  para regenerar data/sri.lock.json;
    3. abra /laboratorio (ou /icones) e confira no navegador.

Os hashes SRI não ficam aqui: o script os calcula a partir destes dados e os
grava em data/sri.lock.json (arquivo gerado, como um package-lock). A
aplicação se recusa a subir se algum arquivo listado aqui não tiver hash.

Campos de uma biblioteca:
    id             usado na URL (/lab/frame/<id>) e no template lab/frames/<id>.html
    nome, tipo     título e natureza ("CSS puro", "Web Components"…)
    licenca, site  texto e link da documentação oficial
    css, js        lista de (pacote, arquivo); viram <link>/<script> com SRI
    js_modulo      como js, mas carregado com type="module"
    modulos        arquivos de entrada cujo grafo de imports é verificado pelo
                   import map ("integrity"), para bibliotecas que carregam
                   dezenas de módulos em cascata; lista de (pacote, arquivo)
    importar       apelidos do import map, {apelido: (pacote, arquivo)}
    scripts_locais nossos scripts de cola em static/js/lab/ (comportamento que
                   a biblioteca não traz, como abrir o modal)
    csp            relaxamentos da CSP SÓ do frame desta biblioteca:
                     "estilo_inline": libera style-src 'unsafe-inline'
                     "nonce_estilo":  libera <style> que tenha o nonce da página
                     "fetch_data":    libera connect-src data: (fetch de data: URI,
                                      sem rede; o Web Awesome lê assim seus ícones)
    pros, contras  listas de frases curtas
    observacao     nota exibida junto ao frame, opcional
    pendencia      se preenchido, o frame não é montado e o texto explica por quê
"""

from urllib.parse import quote

CDN = "https://cdn.jsdelivr.net/npm"

# Pacote npm e versão exata de cada dependência servida pelo CDN.
PACOTES = {
    "bootstrap": ("bootstrap", "5.3.8"),
    "tailwind": ("@tailwindcss/browser", "4.3.3"),
    "daisyui": ("daisyui", "5.7.47"),
    "bulma": ("bulma", "1.0.4"),
    "pico": ("@picocss/pico", "2.1.1"),
    "webawesome": ("@awesome.me/webawesome", "3.14.0"),
    "material": ("@material/web", "2.5.0"),
    "fluent": ("@fluentui/web-components", "3.1.3"),
    "fluent-tokens": ("@fluentui/tokens", "1.0.0-alpha.24"),
    "react": ("react", "18.3.1"),
    "react-dom": ("react-dom", "18.3.1"),
    "dayjs": ("dayjs", "1.11.23"),
    "antd": ("antd", "5.29.3"),
}


def base_pacote(chave: str) -> str:
    """URL da pasta do pacote no CDN, com barra no fim (ex.: .../bootstrap@5.3.8/)."""
    nome, versao = PACOTES[chave]
    return f"{CDN}/{nome}@{versao}/"


def chave_lock(chave: str, arquivo: str) -> str:
    """Chave do arquivo em data/sri.lock.json (ex.: 'bootstrap@5.3.8/dist/css/bootstrap.min.css')."""
    nome, versao = PACOTES[chave]
    return f"{nome}@{versao}/{arquivo}"


_WA = "dist-cdn/components"

BIBLIOTECAS = [
    {
        "id": "bootstrap",
        "nome": "Bootstrap",
        "tipo": "CSS + JS",
        "licenca": "MIT",
        "site": "https://getbootstrap.com/docs/5.3/",
        "css": [("bootstrap", "dist/css/bootstrap.min.css")],
        "js": [("bootstrap", "dist/js/bootstrap.bundle.min.js")],
        "pros": [
            "Modal e tabs já vêm com comportamento acessível: foco preso no modal, setas nas tabs.",
            "Documentação enorme e muita gente sabe usar.",
            "Funciona só com os dois arquivos do CDN, sem build.",
        ],
        "contras": [
            "O visual padrão é reconhecível de longe (\"cara de Bootstrap\").",
            "Personalizar de verdade pede Sass e um passo de build.",
            "Você baixa o CSS inteiro mesmo usando três componentes.",
        ],
    },
    {
        "id": "tailwind",
        "nome": "Tailwind CSS",
        "tipo": "Utilitários (compilador no navegador)",
        "licenca": "MIT",
        "site": "https://tailwindcss.com/docs/installation/play-cdn",
        "js": [("tailwind", "dist/index.global.js")],
        "csp": {"estilo_inline": True},
        "pros": [
            "Controle total do visual, sem estilo imposto.",
            "Com build, o CSS final contém só as classes usadas.",
        ],
        "contras": [
            "Não traz componentes nem comportamento: modal, tabs e ARIA são por sua conta.",
            "Sem build, depende de um compilador que roda no navegador, e a própria equipe o recomenda só para protótipos.",
            "O HTML fica longo, com dezenas de classes por elemento.",
        ],
        "observacao": (
            "Este frame precisa de style-src 'unsafe-inline': o compilador do Tailwind "
            "gera o CSS no navegador e o injeta numa tag <style>. A liberação vale só aqui."
        ),
    },
    {
        "id": "daisyui",
        "nome": "daisyUI",
        "tipo": "Classes de componentes (plugin do Tailwind)",
        "licenca": "MIT",
        "site": "https://daisyui.com/docs/cdn/",
        "css": [("daisyui", "daisyui.css")],
        "pros": [
            "Classes com nome de componente (btn, modal, tabs) em vez de dezenas de utilitários.",
            "O CSS pronto do CDN funciona sem compilar o Tailwind.",
            "Temas trocados com um atributo (data-theme).",
        ],
        "contras": [
            "O arquivo do CDN é grande porque traz todos os componentes de uma vez.",
            "As tabs são feitas com radio buttons: o leitor de tela anuncia \"botão de opção\", não \"guia\".",
            "Pouco comportamento: o modal depende do <dialog> nativo e de JS seu para abrir.",
        ],
        "observacao": "Aqui só o CSS do daisyUI, sem o compilador do Tailwind, para não liberar 'unsafe-inline'.",
    },
    {
        "id": "bulma",
        "nome": "Bulma",
        "tipo": "CSS puro",
        "licenca": "MIT",
        "site": "https://bulma.io/documentation/",
        "css": [("bulma", "css/bulma.min.css")],
        "pros": [
            "Só CSS: nenhum JS para carregar ou manter.",
            "Classes legíveis (is-primary, is-active) e visual neutro.",
        ],
        "contras": [
            "Sem nenhum JS: abrir o modal, fechar com Esc e trocar de tab é código seu.",
            "As tabs são só a barra visual; painéis e ARIA ficam por sua conta.",
        ],
        "observacao": "Modal e tabs funcionam com o nosso script de cola (static/js/lab/frame.js).",
    },
    {
        "id": "pico",
        "nome": "Pico CSS",
        "tipo": "CSS para HTML semântico",
        "licenca": "MIT",
        "site": "https://picocss.com/docs",
        "css": [("pico", "css/pico.min.css")],
        "pros": [
            "Estiliza o HTML semântico direto, quase sem classes.",
            "Usa elementos nativos, como <dialog>, que já trazem acessibilidade.",
            "Leve e com tema escuro automático.",
        ],
        "contras": [
            "Poucos componentes: não existe tabs no Pico.",
            "Pouca margem para fugir do visual padrão sem escrever CSS próprio.",
        ],
        "observacao": "O Pico não tem tabs. O exemplo usa um grupo de botões com role=\"tablist\" e o nosso script.",
    },
    {
        "id": "webawesome",
        "nome": "Web Awesome",
        "tipo": "Web Components",
        "licenca": "MIT (núcleo gratuito)",
        "site": "https://webawesome.com/docs/",
        "css": [("webawesome", "dist-cdn/styles/themes/default.css")],
        "modulos": [
            ("webawesome", f"{_WA}/button/button.js"),
            ("webawesome", f"{_WA}/dialog/dialog.js"),
            ("webawesome", f"{_WA}/tab-group/tab-group.js"),
            ("webawesome", f"{_WA}/tab/tab.js"),
            ("webawesome", f"{_WA}/tab-panel/tab-panel.js"),
        ],
        "csp": {"fetch_data": True},
        "pros": [
            "Funciona em qualquer framework (ou sem nenhum), por ser Web Component.",
            "Foco, teclado e ARIA já resolvidos dentro de cada componente.",
            "Sucessor do Shoelace, com tema configurável por variáveis CSS.",
        ],
        "contras": [
            "Carrega dezenas de módulos JS pequenos (veja a contagem acima).",
            "O interior dos componentes fica no Shadow DOM: estilizar pede ::part e variáveis.",
            "Sem JS, os elementos não aparecem.",
        ],
        "observacao": (
            "Os módulos em cascata são verificados pelo \"integrity\" do import map. "
            "Os dois @import internos do tema (paleta e camadas) não têm SRI, porque o CSS não oferece isso."
        ),
    },
    {
        "id": "material",
        "nome": "Material Web",
        "tipo": "Web Components (Material 3)",
        "licenca": "Apache-2.0",
        "site": "https://material-web.dev/",
        "pros": [
            "Implementação oficial do Material 3, feita pelo Google.",
            "Componentes acessíveis e alinhados às diretrizes do Material.",
        ],
        "contras": [
            "Está em modo de manutenção: o Google não adiciona componentes novos.",
            "É publicado para uso com bundler: os arquivos importam \"lit\" sem caminho.",
            "As tabs (md-tabs) não trocam painéis sozinhas.",
        ],
        "pendencia": (
            "Não roda direto do CDN: os módulos importam \"lit\" e \"tslib\" pelo nome do pacote, "
            "o que só um bundler ou um import map montado à mão resolve. Fica pendente até você escolher como seguir."
        ),
    },
    {
        "id": "fluent",
        "nome": "Fluent UI Web Components",
        "tipo": "Web Components",
        "licenca": "MIT",
        "site": "https://learn.microsoft.com/fluent-ui/web-components/",
        "js_modulo": [("fluent", "dist/web-components-all.min.js")],
        "modulos": [("fluent-tokens", "lib/index.js")],
        "importar": {
            "@fluentui/web-components": ("fluent", "dist/web-components-all.min.js"),
            "@fluentui/tokens": ("fluent-tokens", "lib/index.js"),
        },
        "scripts_locais": ["fluent.js"],
        "pros": [
            "Visual do Microsoft 365 e do Windows.",
            "Os componentes vêm num arquivo único, e a tablist já liga as tabs aos painéis.",
        ],
        "contras": [
            "O tema fica num pacote separado (ainda em alpha) e precisa de JS para ser aplicado.",
            "Pouca documentação para uso sem framework.",
            "Sem JS, os componentes ficam sem estilo.",
        ],
        "observacao": "O tema claro é aplicado por static/js/lab/fluent.js com setTheme().",
    },
    {
        "id": "antd",
        "nome": "Ant Design",
        "tipo": "Componentes React",
        "licenca": "MIT",
        "site": "https://ant.design/components/overview",
        "css": [("antd", "dist/reset.css")],
        "js": [
            ("react", "umd/react.production.min.js"),
            ("react-dom", "umd/react-dom.production.min.js"),
            ("dayjs", "dayjs.min.js"),
            ("antd", "dist/antd.min.js"),
        ],
        "scripts_locais": ["antd.js"],
        "csp": {"nonce_estilo": True},
        "pros": [
            "Catálogo enorme e consistente, forte em sistemas administrativos.",
            "Modal e Tabs completos, com muitas opções prontas.",
        ],
        "contras": [
            "Exige React: é o frame mais pesado do laboratório para três componentes.",
            "A versão 6 deixou de publicar build para navegador; sem build, o limite é a 5.",
            "O CSS é gerado em JS e injetado em tags <style> em tempo de execução.",
            "Tabs com ativação manual: as setas só movem o foco; a tab muda com Enter ou Espaço.",
        ],
        "observacao": (
            "Versão 5 (a 6 não tem build para navegador). O CSS-em-JS é liberado por nonce, "
            "sem 'unsafe-inline'. Uma exceção fica bloqueada de propósito: a trava de rolagem do "
            "Modal injeta um <style> sem nonce, então com o modal aberto o fundo do frame ainda rola."
        ),
    },
]

_POR_ID = {b["id"]: b for b in BIBLIOTECAS}


def buscar_biblioteca(id_: str) -> dict | None:
    return _POR_ID.get(id_)


def pacotes_da_biblioteca(lib: dict) -> list[str]:
    """Chaves de PACOTES usadas pela biblioteca, na ordem em que aparecem."""
    chaves = []
    for campo in ("css", "js", "js_modulo", "modulos"):
        chaves += [pacote for pacote, _ in lib.get(campo, [])]
    chaves += [pacote for pacote, _ in lib.get("importar", {}).values()]
    return list(dict.fromkeys(chaves))


# --------------------------------------------------------------------------
# ÍCONES
# --------------------------------------------------------------------------
# Cada coleção é servida como SVG avulso pelo CDN (só <img>, nenhum script).
# "caminho" monta o arquivo a partir do nome do ícone.
COLECOES_ICONES = [
    {"id": "fa", "nome": "Font Awesome Free", "pacote": "@fortawesome/fontawesome-free", "versao": "7.3.1",
     "caminho": "svgs/{nome}.svg", "licenca": "CC BY 4.0 (ícones)", "site": "https://fontawesome.com/icons"},
    {"id": "lucide", "nome": "Lucide", "pacote": "lucide-static", "versao": "1.52.0",
     "caminho": "icons/{nome}.svg", "licenca": "ISC", "site": "https://lucide.dev/icons/"},
    {"id": "bi", "nome": "Bootstrap Icons", "pacote": "bootstrap-icons", "versao": "1.13.1",
     "caminho": "icons/{nome}.svg", "licenca": "MIT", "site": "https://icons.getbootstrap.com/"},
    {"id": "hero", "nome": "Heroicons", "pacote": "heroicons", "versao": "2.2.0",
     "caminho": "24/outline/{nome}.svg", "licenca": "MIT", "site": "https://heroicons.com/"},
    {"id": "ph", "nome": "Phosphor", "pacote": "@phosphor-icons/core", "versao": "2.1.1",
     "caminho": "assets/regular/{nome}.svg", "licenca": "MIT", "site": "https://phosphoricons.com/"},
    {"id": "tabler", "nome": "Tabler Icons", "pacote": "@tabler/icons", "versao": "3.49.0",
     "caminho": "icons/outline/{nome}.svg", "licenca": "MIT", "site": "https://tabler.io/icons"},
    {"id": "ms", "nome": "Material Symbols", "pacote": "@material-symbols/svg-400", "versao": "0.47.6",
     "caminho": "outlined/{nome}.svg", "licenca": "Apache-2.0", "site": "https://fonts.google.com/icons"},
    {"id": "ri", "nome": "Remix Icon", "pacote": "remixicon", "versao": "4.9.1",
     "caminho": "icons/{nome}.svg", "licenca": "Apache-2.0", "site": "https://remixicon.com/"},
]

ICONIFY_SITE = "https://icon-sets.iconify.design/"

# Conceito → nome do ícone em cada coleção, na ordem de COLECOES_ICONES.
# None = a coleção não tem esse ícone (a página mostra o aviso).
# Nomes conferidos contra a lista de arquivos de cada pacote, na versão acima.
# Font Awesome e Remix Icon incluem a pasta (estilo ou categoria) no nome.
#           (rótulo, palavras extras para a busca, [fa, lucide, bi, hero, ph, tabler, ms, ri])
ICONES = [
    ("Início", "casa home", ["regular/house", "house", "house", "home", "house", "home", "home", "Buildings/home-line"]),
    ("Buscar", "busca pesquisa lupa search", ["solid/magnifying-glass", "search", "search", "magnifying-glass", "magnifying-glass", "search", "search", "System/search-line"]),
    ("Usuário", "pessoa perfil conta user", ["regular/user", "user", "person", "user", "user", "user", "person", "User & Faces/user-line"]),
    ("Configurações", "engrenagem ajustes settings", ["solid/gear", "settings", "gear", "cog-6-tooth", "gear", "settings", "settings", "System/settings-3-line"]),
    ("Excluir", "lixeira apagar remover trash delete", ["regular/trash-can", "trash-2", "trash", "trash", "trash", "trash", "delete", "System/delete-bin-line"]),
    ("Editar", "lápis caneta edit", ["solid/pen", "pencil", "pencil", "pencil", "pencil-simple", "pencil", "edit", "Design/pencil-line"]),
    ("Fechar", "x close sair", ["solid/xmark", "x", "x-lg", "x-mark", "x", "x", "close", "System/close-line"]),
    ("Menu", "hambúrguer navegação", ["solid/bars", "menu", "list", "bars-3", "list", "menu-2", "menu", "System/menu-line"]),
    ("Confirmar", "check ok visto", ["solid/check", "check", "check-lg", "check", "check", "check", "check", "System/check-line"]),
    ("Adicionar", "mais plus novo", ["solid/plus", "plus", "plus-lg", "plus", "plus", "plus", "add", "System/add-line"]),
    ("Alerta", "aviso atenção warning", ["solid/triangle-exclamation", "triangle-alert", "exclamation-triangle", "exclamation-triangle", "warning", "alert-triangle", "warning", "System/alert-line"]),
    ("Informação", "info ajuda", ["solid/circle-info", "info", "info-circle", "information-circle", "info", "info-circle", "info", "System/information-line"]),
    ("Notificação", "sino bell", ["regular/bell", "bell", "bell", "bell", "bell", "bell", "notifications", "Media/notification-3-line"]),
    ("Calendário", "data agenda", ["regular/calendar", "calendar", "calendar", "calendar", "calendar", "calendar", "calendar_today", "Business/calendar-line"]),
    ("E-mail", "email envelope correio", ["regular/envelope", "mail", "envelope", "envelope", "envelope", "mail", "mail", "Business/mail-line"]),
    ("Telefone", "ligar celular", ["solid/phone", "phone", "telephone", "phone", "phone", "phone", "call", "Device/phone-line"]),
    ("Favorito", "coração curtir heart", ["regular/heart", "heart", "heart", "heart", "heart", "heart", "favorite", "Health & Medical/heart-line"]),
    ("Avaliação", "estrela star", ["regular/star", "star", "star", "star", "star", "star", "star", "System/star-line"]),
    ("Baixar", "download", ["solid/download", "download", "download", "arrow-down-tray", "download-simple", "download", "download", "System/download-line"]),
    ("Enviar arquivo", "upload subir", ["solid/upload", "upload", "upload", "arrow-up-tray", "upload-simple", "upload", "upload", "System/upload-line"]),
    ("Compartilhar", "share", ["solid/share-nodes", "share-2", "share", "share", "share-network", "share", "share", "System/share-line"]),
    ("Link", "corrente url", ["solid/link", "link", "link", "link", "link", "link", "link", "Editor/link"]),
    ("Bloqueado", "cadeado senha lock", ["solid/lock", "lock", "lock", "lock-closed", "lock", "lock", "lock", "System/lock-line"]),
    ("Mostrar", "olho visível ver senha", ["regular/eye", "eye", "eye", "eye", "eye", "eye", "visibility", "System/eye-line"]),
    ("Ocultar", "olho riscado esconder senha", ["regular/eye-slash", "eye-off", "eye-slash", "eye-slash", "eye-slash", "eye-off", "visibility_off", "System/eye-off-line"]),
    ("Filtrar", "funil filtro", ["solid/filter", "funnel", "funnel", "funnel", "funnel", "filter", "filter_alt", "System/filter-line"]),
    ("Carrinho", "compras loja", ["solid/cart-shopping", "shopping-cart", "cart", "shopping-cart", "shopping-cart", "shopping-cart", "shopping_cart", "Finance/shopping-cart-line"]),
    ("Arquivo", "documento file", ["regular/file", "file", "file-earmark", "document", "file", "file", "draft", "Document/file-line"]),
    ("Pasta", "diretório folder", ["regular/folder", "folder", "folder", "folder", "folder", "folder", "folder", "Document/folder-line"]),
    ("Imagem", "foto figura", ["regular/image", "image", "image", "photo", "image", "photo", "image", "Media/image-line"]),
    ("Câmera", "foto", ["regular/camera", "camera", "camera", "camera", "camera", "camera", "photo_camera", "Media/camera-line"]),
    ("Reproduzir", "play tocar", ["solid/play", "play", "play", "play", "play", "player-play", "play_arrow", "Media/play-line"]),
    ("Pausar", "pause", ["solid/pause", "pause", "pause", "pause", "pause", "player-pause", "pause", "Media/pause-line"]),
    ("Avançar", "seta direita próximo", ["solid/arrow-right", "arrow-right", "arrow-right", "arrow-right", "arrow-right", "arrow-right", "arrow_forward", "Arrows/arrow-right-line"]),
    ("Voltar", "seta esquerda anterior", ["solid/arrow-left", "arrow-left", "arrow-left", "arrow-left", "arrow-left", "arrow-left", "arrow_back", "Arrows/arrow-left-line"]),
    ("Expandir", "chevron seta baixo abrir", ["solid/chevron-down", "chevron-down", "chevron-down", "chevron-down", "caret-down", "chevron-down", "keyboard_arrow_down", "Arrows/arrow-down-s-line"]),
    ("Atualizar", "recarregar refresh", ["solid/arrows-rotate", "refresh-cw", "arrow-clockwise", "arrow-path", "arrow-clockwise", "refresh", "refresh", "System/refresh-line"]),
    ("Sair", "logout desconectar", ["solid/right-from-bracket", "log-out", "box-arrow-right", "arrow-right-start-on-rectangle", "sign-out", "logout", "logout", "System/logout-box-r-line"]),
    ("Nuvem", "cloud", ["regular/cloud", "cloud", "cloud", "cloud", "cloud", "cloud", "cloud", "Business/cloud-line"]),
    ("Localização", "mapa pin endereço", ["solid/location-dot", "map-pin", "geo-alt", "map-pin", "map-pin", "map-pin", "location_on", "Map/map-pin-line"]),
    ("Horário", "relógio hora tempo", ["regular/clock", "clock", "clock", "clock", "clock", "clock", "schedule", "System/time-line"]),
    ("Copiar", "duplicar copy", ["regular/copy", "copy", "copy", "document-duplicate", "copy", "copy", "content_copy", "Document/file-copy-line"]),
    ("Imprimir", "impressora print", ["solid/print", "printer", "printer", "printer", "printer", "printer", "print", "Business/printer-line"]),
    ("Idioma", "tradução língua translate", ["solid/language", "languages", "translate", "language", "translate", "language", "translate", "Editor/translate"]),
    ("Globo", "mundo internet web", ["solid/globe", "globe", "globe", "globe-alt", "globe", "world", "language", "Business/global-line"]),
    ("Microfone", "áudio voz gravar", ["solid/microphone", "mic", "mic", "microphone", "microphone", "microphone", "mic", "Media/mic-line"]),
    ("Wi-Fi", "rede conexão", ["solid/wifi", "wifi", "wifi", "wifi", "wifi-high", "wifi", "wifi", "Device/wifi-line"]),
    ("Bateria", "carga energia", ["solid/battery-full", "battery-full", "battery-full", "battery-100", "battery-full", "battery-4", "battery_full", "Device/battery-line"]),
    ("Tema escuro", "lua noite dark", ["regular/moon", "moon", "moon", "moon", "moon", "moon", "dark_mode", "Weather/moon-line"]),
    ("Tema claro", "sol dia light", ["regular/sun", "sun", "sun", "sun", "sun", "sun", "light_mode", "Weather/sun-line"]),
    ("Acessibilidade", "a11y deficiência cadeira de rodas", ["solid/universal-access", "accessibility", "universal-access", None, "person-simple-circle", "accessible", "accessibility_new", "Others/wheelchair-line"]),
    ("GitHub", "marca logo git", ["brands/github", None, "github", None, "github-logo", "brand-github", None, "Logos/github-line"]),
    ("WhatsApp", "marca logo mensagem", ["brands/whatsapp", None, "whatsapp", None, "whatsapp-logo", "brand-whatsapp", None, "Logos/whatsapp-line"]),
]

for _rotulo, _extra, _nomes in ICONES:
    if len(_nomes) != len(COLECOES_ICONES):
        raise ValueError(f"Ícone {_rotulo!r}: são {len(COLECOES_ICONES)} coleções, vieram {len(_nomes)} nomes.")


def base_colecao(colecao: dict) -> str:
    return f"{CDN}/{colecao['pacote']}@{colecao['versao']}/"


def url_icone(colecao: dict, nome: str) -> str:
    # Espaços e "&" existem em pastas do Remix Icon ("User & Faces").
    return base_colecao(colecao) + quote(colecao["caminho"].format(nome=nome))
