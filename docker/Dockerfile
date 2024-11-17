FROM php:8.3-apache

# install composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# enable ssl module, mod_rewrite for URL rewrite and mod_headers for .htaccess extra headers like Access-Control-Allow-Origin-
RUN a2enmod ssl rewrite headers

# copy opcache configuration
COPY ./docker/opcache.ini /usr/local/etc/php/conf.d/20-opcache.ini

# update packages and install git
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    libwebp-dev \
    git \
    libfreetype6-dev libjpeg62-turbo-dev libpng-dev libzip-dev \
    zip unzip lsof sqlite3 \
    libc6 libstdc++6 libgcc1 ca-certificates wget libfontconfig1 fonts-liberation libpango-1.0-0 libpangocairo-1.0-0 && \
    docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install gd && \
    docker-php-ext-configure opcache --enable-opcache && \
    docker-php-ext-install opcache && \
    docker-php-ext-enable opcache && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# create ssl folder and copy certificates into it
RUN mkdir /etc/apache2/sites-available/ssl

RUN echo "Generating certificates"

COPY ./docker/openssl-san.cnf /usr/local/etc/php/conf.d/openssl-san.cnf

# overwrite conf files of apache with our vhost.conf file
COPY ./docker/vhost.conf /etc/apache2/sites-available/000-default.conf
COPY ./docker/vhost.conf /etc/apache2/sites-available/default-ssl.conf

# start with base php config, then add extensions
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"
 
RUN mkdir -p /var/run/apache2/

# install and enable xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# copy xdebug configuration to apache and update xdebug port specified in the argument (see docker-compose.yml)
COPY ./docker/xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
COPY ./docker/error_reporting.ini /usr/local/etc/php/conf.d/error_reporting.ini

SHELL ["/bin/bash", "-c"]

# set environment variable
ENV APACHE_DOCUMENT_ROOT /var/www/html

# set permissions on web folder
RUN chown -R www-data:www-data /var/www/html && find /var/www/html -type d -exec chmod 755 {} \; && find /var/www/html -type f -exec chmod 644 {} \;

RUN a2ensite default-ssl

# install Node
RUN apt-get update && apt-get install -y software-properties-common npm
RUN npm install npm@latest -g && npm install n -g && n latest

# install Yarn
RUN npm install --global yarn
RUN yarn --version

# Here we are introducing a custom entry point to run Laravel migrations
COPY ./docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# update web folder ownership one more time to make sure all subfolders are accessible to apache process
RUN chown -R www-data:www-data /var/www/html

ENTRYPOINT ["/bin/bash", "/usr/local/bin/docker-entrypoint.sh"]

# Start apache process
CMD ["apache2-foreground"]

SHELL ["/bin/bash", "-c"]