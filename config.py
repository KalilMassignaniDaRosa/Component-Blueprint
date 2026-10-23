"""Configuração lida de variáveis de ambiente (nunca de valores fixos no código).

Em desenvolvimento, `flask run` carrega o arquivo `.env` automaticamente
(graças ao python-dotenv). Em produção, defina as variáveis no ambiente do
servidor (systemd, painel do provedor etc.).
"""

import os


def _bool(nome: str, padrao: bool = False) -> bool:
    valor = os.environ.get(nome)
    if valor is None:
        return padrao
    return valor.strip().lower() in {"1", "true", "yes", "sim", "on"}


class Config:
    APP_ENV = os.environ.get("APP_ENV", "production").strip().lower()
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FORCE_HTTPS = _bool("FORCE_HTTPS", padrao=False)

    # Cookies: o site não usa sessão, mas se um dia usar, já nasce seguro.
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

    # Cache de arquivos estáticos: 1 dia em produção, nenhum em desenvolvimento
    # (assim cada edição de CSS/JS aparece no próximo reload).
    SEND_FILE_MAX_AGE_DEFAULT = 60 * 60 * 24 if APP_ENV == "production" else 0

    @classmethod
    def validar(cls, app) -> None:
        """Falha cedo se a configuração de produção estiver insegura."""
        if cls.APP_ENV == "production":
            if app.debug:
                raise RuntimeError(
                    "APP_ENV=production com debug ligado. Remova FLASK_DEBUG=1."
                )
            if not cls.SECRET_KEY or cls.SECRET_KEY == "troque-esta-chave":
                raise RuntimeError("Defina uma SECRET_KEY forte no ambiente.")
        elif not cls.SECRET_KEY:
            # Em desenvolvimento, uma chave temporária evita travar quem acabou de clonar.
            app.config["SECRET_KEY"] = os.urandom(32).hex()
