#!/bin/bash
set -x

# Define the marker file path
FLAG_FILE="/var/first_run_completed"

# Check if the marker file exists
if [ ! -f "$FLAG_FILE" ]; then
  echo "Running first-time setup tasks..."

  sed -i "s/((server_name))/${server_name}/g" /usr/local/etc/php/conf.d/openssl-san.cnf

  sed -i "s/((xdebug_port))/${xdebug_port}/g" /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
  sed -i "s/((xdebug_mode))/${xdebug_mode}/g" /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

  openssl req \
      -config /usr/local/etc/php/conf.d/openssl-san.cnf \
      -new \
      -sha256 \
      -newkey rsa:2048 \
      -nodes \
      -x509 \
      -days 3650 \
      -keyout /etc/apache2/sites-available/ssl/server.key \
      -out /etc/apache2/sites-available/ssl/server.crt

  # update server name variable in vhost file
  sed -i "s/((server_name))/${server_name}/g" /etc/apache2/sites-available/000-default.conf
  sed -i "s/((server_name))/${server_name}/g" /etc/apache2/sites-available/default-ssl.conf

  # Set the ServerName globally to avoid build warning
  echo "ServerName ${server_name}" >> /etc/apache2/apache2.conf

  #clone the project
  git clone -b main ${github_link} /var/www/html
  
  cd /var/www/html/server

  composer install

  # copy Laravel .env file and update variables in it
  cp ".env.example" "/var/www/html/server/.env"
  sed -i "s/((server_name))/${server_name}/g" /var/www/html/server/.env
  sed -i "s/((server_port))/${server_port}/g" /var/www/html/server/.env
  sed -i "s/((client_port))/${client_port}/g" /var/www/html/server/.env

  # create application identity and set it to support credentials
  php artisan key:generate

  # publish CORS
  php artisan config:publish cors
  sed -i "s/'supports_credentials' => false,/'supports_credentials' => true,/g" /var/www/html/server/config/cors.php

# create storage link
  php artisan storage:link
  chmod o+w ./storage/ -R

  #update git before seeding
  git config --system --add safe.directory '/var/www/html'

  mkdir /var/www/certs
  cp /etc/apache2/sites-available/ssl/server.crt /var/www/certs/server.$(date +%s).crt

  cd /var/www/html/server
  
  # Run Laravel migrations
  php artisan migrate --seed

  # update node packages of the front-end project
  cd /var/www/html/client
  yarn

  # sed -i "s/host: true/host: '${server_name}'/g" /var/www/html/client/vite.config.mts
  
  sed -i "s/((server_name))/${server_name}/g" /var/www/html/client/.env.development
  sed -i "s/((server_port))/${server_port}/g" /var/www/html/client/.env.development
  sed -i "s/((client_port))/${client_port}/g" /var/www/html/client/.env.development

  sed -i "s/((server_name))/${server_name}/g" /var/www/html/client/.env.production
  sed -i "s/((server_port))/${server_port}/g" /var/www/html/client/.env.production
  sed -i "s/((client_port))/${client_port}/g" /var/www/html/client/.env.production

  # Step 1: Run Vite in the background
  yarn dev &
  VITE_PID=$!

  # Verify if VITE_PID is assigned correctly
  if [ -z "$VITE_PID" ]; then
    echo "Failed to start Vite or retrieve its PID."
    exit 1
  fi

  # Wait for the certificates to be created
  CERT_DIR="/root/.vite-plugin-mkcert"
  CERT_FILES=("rootCA.pem")

  echo "Waiting for Vite to generate certificates..."
  while true; do
    all_files_exist=true
    for cert_file in "${CERT_FILES[@]}"; do
      if [ ! -f "$CERT_DIR/$cert_file" ]; then
        all_files_exist=false
        break
      fi
    done

    # If both certificates exist, break the loop
    if [ "$all_files_exist" = true ]; then
      echo "Certificates generated!"

      #copy Vite certificate to host machine
      cp /root/.vite-plugin-mkcert/rootCA.pem /var/www/certs/rootCA.crt
      echo "and copied!"

      break
    fi

    # Sleep for a short interval before checking again
    sleep 2
  done
  
  # Create the marker file to indicate first run is completed
  touch "$FLAG_FILE"
else
  CUR_DIR=$(pwd)
  
  cd /var/www/html

  git pull

  cd $CUR_DIR
fi

# Now continue executing base image's entrypoint
exec docker-php-entrypoint "$@"