import os
import json
import urllib.parse
from http import cookies

def application(environ, start_response):
    #Obtener Query Params
    query_string = environ.get('QUERY_STRING', '')
    params = urllib.parse.parse_qs(query_string)
    action = params.get('action', [None])[0]
    lang_param = params.get('lang', [None])[0]
    ci_param = params.get('ci', [None])[0]
    #Cookie para la sesion del idioma
    cookie_header = environ.get('HTTP_COOKIE', '')
    cookie = cookies.SimpleCookie(cookie_header)
    lang = "ES"
    headers = [('Content-type', 'text/html; charset=utf-8')]
    #Manejador de Lenguaje
    if lang_param:
        lang = lang_param
        c = cookies.SimpleCookie()
        c['lang'] = lang
        c['lang']['path'] = '/'
        cookie_output = c['lang'].OutputString()
        headers.append(('Set-Cookie', cookie_output))
    elif "lang" in cookie:
        lang = cookie["lang"].value
    #Archivos de Configuracion
    base_dir = '/var/www/html/ATI'
    try:
        with open(os.path.join(base_dir, f"conf/config{lang}.json"), "r", encoding="utf-8") as f:
            config = json.load(f)
    except:
        config = {}
    #Auxiliares
    def get_label(key, profile_val, default):
        label = config.get(key, default)
        if isinstance(label, list):
            if isinstance(profile_val, list) and len(profile_val) > 1 and len(label) > 1:
                return label[1]
            return label[0]
        return label
    def format_val(val):
        if isinstance(val, list):
            return ", ".join(val)
        return val
    email_label = config.get("email", "Email:")
    if isinstance(email_label, str) and email_label.endswith(" [email]"):
        email_label = email_label[:-8]

    #Enrutador
    response_body = ""
    #Profile
    if action == 'profile' and ci_param:
        try:
            with open(os.path.join(base_dir, f"{ci_param}/profile.json"), "r", encoding="utf-8") as f:
                profile_data = json.load(f)
            response_body = f'''
            <section class="profile-card" id="profileCard">
                <div class="profile-img" id="profile-img">
                    <img class="img-big" src="{ci_param}/{ci_param}Big{profile_data.get("image_ext", ".jpg")}">
                    <img class="img-small" src="{ci_param}/{ci_param}Small{profile_data.get("image_ext", ".jpg")}">
                </div>
                <div class="profile-data">
                    <h2>{profile_data.get("name", "")}</h2>
                    <p>{profile_data.get("description", "")}</p>
                    <div id="attris">
                        <span>{get_label("color", profile_data.get("color"), "Color")}:</span>
                        <span>{format_val(profile_data.get("color", ""))}</span>
                        <span>{get_label("book", profile_data.get("book"), "Libro")}:</span>
                        <span>{format_val(profile_data.get("book", ""))}</span>
                        <span>{get_label("music", profile_data.get("music"), "Música")}:</span>
                        <span>{format_val(profile_data.get("music", ""))}</span>
                        <span>{get_label("video_game", profile_data.get("video_game"), "Videojuego")}:</span>
                        <span>{format_val(profile_data.get("video_game", ""))}</span>
                        <span>{get_label("language", profile_data.get("language"), "Idioma")}:</span>
                        <span>{format_val(profile_data.get("language", []))}</span>
                    </div>
                    <div class="footer">
                        <span>{email_label}:</span>
                        <a href="mailto:{profile_data.get("email", "")}">{profile_data.get("email", "")}</a>
                    </div>
                </div>
            </section>
            '''
        except Exception as e:
            response_body = f"<p>Error cargando perfil: {str(e)}</p>"
    #Lista de Usuarios
    elif action == 'users':
        try:
            with open(os.path.join(base_dir, "data/index.json"), "r", encoding="utf-8") as f:
                profiles = json.load(f)
            response_body = f'''
            <section class="users-list">
                <h2>{get_label("semester", None, "Semestre")}</h2>
                    <div id="userList">
            '''
            for p in profiles:
                response_body += f'''
                <div class="user-card" onclick="loadProfile('{p["ci"]}')">
                    <img class="img-big" src="{p["ci"]}/{p["ci"]}Big{p.get("image_ext", ".jpg")}">
                    <img class="img-small" src="{p["ci"]}/{p["ci"]}Small{p.get("image_ext", ".jpg")}">
                    <h4>{p["name"]}</h4>
                </div>
                '''
            response_body += f'''
                </div>
                <div id="searchFail" class="hidden">
                    <span>{config.get("emptySearch", "No hay resultados para:")}</span>
                    <span id="searchFailResult"></span>
                </div>
            </section>
            '''
        except Exception as e:
            response_body = f"<p>Error cargando usuarios: {str(e)}</p>"
    else:
        site_list = config.get("site", ["ATI", "[UCV]", "Log"])
        if isinstance(site_list, list) and len(site_list) >= 3:
            site_name_html = f'{site_list[0]}<span>{site_list[1]}</span>{site_list[2]}'
        elif isinstance(site_list, list):
            site_name_html = "".join(site_list)
        else:
            site_name_html = str(site_list)
            
        search_text = get_label("search", None, "Buscar")
        response_body = f'''
        <!DOCTYPE html>
        <html lang="{lang}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ATI[UCV]Log 2026-1</title>
            <link rel="icon" sizes="32x32" href="../icon/cropped-logonuevo-32x32.png"> 
            <link rel="icon" sizes="192x192" href="../icon/cropped-logonuevo-192x192.png">
            <link rel="stylesheet" href="css/style.css">
            <script src="js/app.js" defer></script>
        </head>
        <body>
            <header>
                <nav>
                    <ul id="navBarList">
                        <li>
                            <a onclick="loadHome()" style="cursor:pointer">
                                {site_name_html}
                            </a>
                        </li>
                        <li class="menu-icon-li">
                            <div class="menu-icon">
                                <img src="icon/menuIcon.svg" alt="menuIcon">
                            </div>
                        </li>
                        <li>
                            <div class="search-bar" id="searchBar">
                                <input type="text" placeholder="{config.get("name", "Nombre")}...">
                                <button>{search_text}</button>
                            </div>
                        </li>
                        <li>
                            <div class="user-icon">
                                <img src="icon/userIcon.svg" alt="userIcon">
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>
            <main id="app-content">{response_body}</main>
            <footer data-key="copyRight">{config.get("copyRight", "Derechos Reservados")}</footer>
        </body>
        </html>
        '''
    start_response('200 OK', headers)
    return [response_body.encode('utf-8')]