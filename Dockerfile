#Ultima version de Ubuntu en 06/11/26
FROM ubuntu/apache2:latest
LABEL maintainer="Bryan Silva"
#Instalar Python
RUN apt-get update && apt-get install -y python3 libapache2-mod-wsgi-py3
# Configurar Apache para mapear el script y servir estáticos
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    WSGIScriptAlias /ATI/index.py /var/www/html/ATI/index.py\n\
    RedirectMatch ^/$ /ATI/index.py\n\
    RedirectMatch ^/ATI/?$ /ATI/index.py\n\
    <Directory /var/www/html/ATI>\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf
RUN rm -f /var/www/html/index.html
#Copiar archivos del directorio actual
RUN mkdir -p /var/www/html/ATI
COPY . /var/www/html/ATI
#Abrir Puerto 80
EXPOSE 80