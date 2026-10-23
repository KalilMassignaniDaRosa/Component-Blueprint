"""Guia Visual de Componentes de IHC: aplicação Flask.

Rodar em desenvolvimento:  flask run
Rodar em produção:         gunicorn "app:create_app()"  (veja o README)
"""

import mimetypes

from flask import Flask, abort, render_template, url_for
from flask_talisman import Talisman

from config import Config
from data.components import (
    CATEGORIAS,
    COMPONENTES,
    buscar_componente,
    vizinhos,
)
from data.libraries import COLECOES_ICONES, ICONES, ICONIFY_SITE, url_icone
from laboratorio import LAB, csp_icones

# Alguns sistemas (ex.: Windows) não conhecem o tipo das fontes .woff2 e o Flask
# as serviria como application/octet-stream. Com o header nosniff, o tipo certo importa.
mimetypes.add_type("font/woff2", ".woff2")

# Política de Segurança de Conteúdo (CSP) padrão do site.
# O site principal não usa NENHUM CDN: fontes, CSS e JS são servidos por nós,
# então tudo fica restrito a 'self'. Sem 'unsafe-inline' e sem 'unsafe-eval'.
# Exceções, sempre por rota: cada frame do laboratório tem a sua CSP (veja
# laboratorio.py) e a página de ícones libera imagens do CDN.
CSP_PADRAO = {
    "default-src": "'self'",
    "script-src": "'self'",
    "style-src": "'self'",
    "img-src": ["'self'", "data:"],
    "font-src": "'self'",
    "connect-src": "'self'",
    "frame-src": "'self'",
    "frame-ancestors": "'self'",
    "object-src": "'none'",
    "base-uri": "'self'",
    # O site não tem formulários que enviem dados; então nenhum destino é permitido.
    "form-action": "'none'",
}


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    Config.validar(app)

    Talisman(
        app,
        content_security_policy=CSP_PADRAO,
        force_https=app.config["FORCE_HTTPS"],
        strict_transport_security=app.config["FORCE_HTTPS"],
        session_cookie_secure=app.config["FORCE_HTTPS"],
        # SAMEORIGIN (e não DENY) porque o laboratório embute páginas do próprio site.
        frame_options="SAMEORIGIN",
        referrer_policy="strict-origin-when-cross-origin",
        permissions_policy={
            "camera": "()",
            "microphone": "()",
            "geolocation": "()",
            "browsing-topics": "()",
        },
    )

    registrar_rotas(app)
    return app


def registrar_rotas(app: Flask) -> None:
    @app.context_processor
    def dados_globais():
        # Disponível em todos os templates (navbar, sidebar, rodapé).
        return {
            "categorias": CATEGORIAS,
            "componentes": COMPONENTES,
            "nav_principal": [
                ("index", "Componentes"),
                ("laboratorio", "Laboratório"),
                ("icones", "Ícones"),
            ],
        }

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/componentes/<slug>")
    def componente(slug: str):
        comp = buscar_componente(slug)
        if comp is None:
            abort(404)
        anterior, proximo = vizinhos(slug)
        cat = CATEGORIAS[comp["categoria"]]
        trilha = [
            ("Início", url_for("index")),
            (cat["nome"], url_for("index", cat=comp["categoria"])),
            (comp["nome"], None),  # None = página atual
        ]
        return render_template(
            "component.html",
            c=comp,
            categoria=cat,
            anterior=anterior,
            proximo=proximo,
            trilha=trilha,
        )

    @app.route("/laboratorio")
    def laboratorio():
        trilha = [("Início", url_for("index")), ("Laboratório", None)]
        return render_template("lab/index.html", trilha=trilha, bibliotecas=LAB)

    # Um endpoint por biblioteca, porque o Talisman guarda a CSP por view.
    for lib in LAB:
        if not lib["pendencia"]:
            app.add_url_rule(
                f"/lab/frame/{lib['id']}",
                endpoint=f"lab_frame_{lib['id']}",
                view_func=_view_do_frame(lib),
            )

    @app.route("/icones")
    def icones():
        trilha = [("Início", url_for("index")), ("Ícones", None)]
        return render_template(
            "icons.html",
            trilha=trilha,
            colecoes=COLECOES_ICONES,
            icones=ICONES,
            url_icone=url_icone,
            iconify=ICONIFY_SITE,
        )

    icones.talisman_view_options = {"content_security_policy": csp_icones(CSP_PADRAO)}

    @app.errorhandler(404)
    def nao_encontrado(_erro):
        return render_template("errors/404.html"), 404

    @app.errorhandler(500)
    def erro_interno(_erro):
        return render_template("errors/500.html"), 500


def _view_do_frame(lib: dict):
    def frame():
        return render_template(f"lab/frames/{lib['id']}.html", lib=lib)

    frame.talisman_view_options = lib["talisman"]
    return frame
