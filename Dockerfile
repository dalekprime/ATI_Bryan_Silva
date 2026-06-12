#Ultima version de Ubuntu en 06/11/26
FROM ubuntu/apache2:latest
LABEL maintainer="Bryan Silva"
RUN rm /var/www/html/index.html
#Copiar archivos del directorio actual
COPY . /var/www/html/
EXPOSE 80