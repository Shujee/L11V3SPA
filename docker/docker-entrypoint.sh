#!/bin/bash
set -x

# Define the marker file path
FLAG_FILE="/var/first_run_completed"

# Check if the marker file exists
if [ ! -f "$FLAG_FILE" ]; then
  echo "Running first-time setup tasks..."

  sed -i "s/((server_name))/${server_name}/g" /usr/local/etc/php/conf.d/openssl-san.cnf

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

  #restart Apache for the certificates to take effect
   /etc/init.d/apache2 reload

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

  # create application identity
  php artisan key:generate

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

  sed -i "s/host: true/host: '${server_name}'/g" /var/www/html/client/vite.config.mts
  
  sed -i "s/((server_name))/${server_name}/g" /var/www/html/client/.env.development
  sed -i "s/((server_port))/${server_port}/g" /var/www/html/client/.env.development
  sed -i "s/((server_name))/${server_name}/g" /var/www/html/client/.env.production
  sed -i "s/((server_port))/${server_port}/g" /var/www/html/client/.env.production

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

yarn dev &

# Wait for the certificates to be created
CERT_DIR=/root/.vite-plugin-mkcert/  
CERT_FILE="$CERT_DIR/rootCA.pem"

# Wait for the certificate to be created (max 10 seconds)
for i in {1..10}; do
  if [ -f "$CERT_FILE" ]; then
    echo "Certificates found. Proceeding with copy..."
    
    #copy Vite certificate to host machine
    cp /root/.vite-plugin-mkcert/rootCA.pem /var/www/certs/rootCA.crt
    # cp /root/.vite-plugin-mkcert/dev.pem /var/www/certs/dev.crt
    # cp /root/.vite-plugin-mkcert/cert.pem /var/www/certs/cert.crt

    break
  fi

  echo "Waiting for certificates to be created..."
  sleep 1
done