# Imagem oficial do PHP + Composer
FROM php:8.3-fpm

# Recebe o UID e GID como argumentos do build
ARG UID
ARG GID

# Criar grupo e usuário com os argumentos recebidos
RUN groupadd -g ${GID} hostgroup \
    && useradd -u ${UID} -g hostgroup -m hostuser

# Ajustar permissões para o diretório de trabalho
RUN chown -R hostuser:hostgroup /var/www/html

# Instalando extensões e dependências
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libgd-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd

# Instalar o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do Laravel
COPY . .

# Instalar dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Ajustar permissões do Laravel (para cache, logs e framework)
RUN chown -R hostuser:hostgroup bootstrap/cache storage/logs storage/framework \
    && chmod -R 775 bootstrap/cache storage/logs storage/framework

# Definir o usuário padrão para rodar a aplicação
USER hostuser

# Expor a porta do Laravel
EXPOSE 8000

# Comando padrão para rodar a aplicação
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
