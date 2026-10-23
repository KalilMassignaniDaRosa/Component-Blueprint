"""Monta a lista de componentes do guia a partir dos arquivos por categoria.

O conteúdo de cada componente fica em data/componentes/<categoria>.py.
Este módulo só junta tudo, numera, valida os campos obrigatórios e oferece
as funções de busca usadas pelas rotas. Para adicionar um componente novo,
veja o README (seção "Como adicionar um componente").

Campos de um componente:
    slug           identificador na URL (/componentes/<slug>) e nome dos
                   arquivos templates/demos/<slug>.html e static/js/demos/<slug>.js
    nome, resumo   título e descrição curta (card da home e seção "O que é")
    quando_usar    lista de frases curtas
    quando_evitar  lista de frases curtas
    checklist      3 ou 4 pares (tema, texto) para quem vai aplicar o componente
                   no próprio site. Temas usuais: Teclado, Foco, ARIA, Contraste
    principios     lista de {"nome", "texto"} com princípios de IHC
    referencias    lista de (rótulo, url), opcional
    script         True se existe static/js/demos/<slug>.js
    busca_extra    palavras extras para a busca da home, opcional

O texto é sempre texto puro: o Jinja escapa tudo e nada é marcado como seguro.
"""

from data.componentes import entrada, feedback, navegacao, organizacao

# Cada categoria tem um glifo além da cor, para que a cor nunca seja
# a única forma de distinguir (WCAG 1.4.1).
CATEGORIAS = {
    "navegacao": {
        "nome": "Navegação",
        "glifo": "◇",
        "descricao": "Como a pessoa se localiza e se move pelo produto.",
    },
    "entrada": {
        "nome": "Entrada",
        "glifo": "▭",
        "descricao": "Como a pessoa fornece dados e dispara ações.",
    },
    "feedback": {
        "nome": "Feedback",
        "glifo": "◉",
        "descricao": "Como o sistema responde e informa o que está acontecendo.",
    },
    "organizacao": {
        "nome": "Organização",
        "glifo": "▦",
        "descricao": "Como o conteúdo é agrupado, ordenado e resumido.",
    },
}

_OBRIGATORIOS = ("slug", "nome", "resumo", "quando_usar", "quando_evitar", "checklist", "principios")


def _preparar(categoria: str, componentes: list[dict]) -> list[dict]:
    """Valida cada componente e completa os campos opcionais."""
    prontos = []
    for comp in componentes:
        faltando = [campo for campo in _OBRIGATORIOS if not comp.get(campo)]
        if faltando:
            raise ValueError(f"Componente {comp.get('slug', '?')!r} sem os campos: {faltando}")
        if not 3 <= len(comp["checklist"]) <= 4:
            raise ValueError(f"{comp['slug']!r}: o checklist deve ter de 3 a 4 itens.")
        prontos.append({"referencias": [], "script": False, "busca_extra": "", **comp, "categoria": categoria})
    return prontos


# A ordem segue CATEGORIAS; dentro de cada categoria, a ordem dos arquivos.
COMPONENTES = [
    *_preparar("navegacao", navegacao.COMPONENTES),
    *_preparar("entrada", entrada.COMPONENTES),
    *_preparar("feedback", feedback.COMPONENTES),
    *_preparar("organizacao", organizacao.COMPONENTES),
]

# Numeração estável exibida nos cards ("Nº 01", "Nº 02"…)
for _i, _comp in enumerate(COMPONENTES, start=1):
    _comp["numero"] = _i

_POR_SLUG = {c["slug"]: c for c in COMPONENTES}
if len(_POR_SLUG) != len(COMPONENTES):
    raise ValueError("Há slugs repetidos em data/componentes/.")


def buscar_componente(slug: str):
    return _POR_SLUG.get(slug)


def vizinhos(slug: str):
    """Componente anterior e próximo (para a paginação no fim da prancha)."""
    i = next(i for i, c in enumerate(COMPONENTES) if c["slug"] == slug)
    anterior = COMPONENTES[i - 1] if i > 0 else None
    proximo = COMPONENTES[i + 1] if i < len(COMPONENTES) - 1 else None
    return anterior, proximo
