#Ultima version de Ubuntu en 06/11/26
FROM ubuntu/apache2:latest
LABEL maintainer="Bryan Silva"
#Instalar Python y Git
RUN apt-get update && apt-get install -y python3 libapache2-mod-wsgi-py3 git
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
#Clonar el repositorio desde GitHub en la rama main
RUN git clone -b main https://github.com/dalekprime/ATI_Bryan_Silva.git /var/www/html/ATI
#Abrir Puerto 80
EXPOSE 80