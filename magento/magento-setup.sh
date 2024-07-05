#!/bin/bash
set -e
 # Function to check if MySQL is ready
wait_for_mysql() {
    until mysqladmin ping -hmysql -u$MAGENTO_DB_USER -p$MAGENTO_DB_PASSWORD --silent; do
        echo "MySQL is not available - sleeping"
        sleep 5
    done
    echo "MySQL is ready!"
}

if [ ! -e /var/www/html/magento-setup-done ]; then

  # Wait for MySQL to be ready
  # wait-for-it mysql:3306
  wait_for_mysql

  # Run Magento setup command
  php bin/magento setup:install \
  --db-host=$MAGENTO_DB_HOST \
  --db-name=$MAGENTO_DB_NAME \
  --db-user=$MAGENTO_DB_USER \
  --db-password=$MAGENTO_DB_PASSWORD \
  --base-url=http://$MAGENTO_DOMAIN/ \
  --admin-user=adminpackrette \
  --admin-password=admin123 \
  --admin-email=admin1@vps.packrette.fr \
  --admin-firstname=Admin \
  --admin-lastname=Packrette \
  --backend-frontname=admin \
  --language=fr_FR \
  --currency=EUR \
  --timezone=Europe/Paris \
  --use-rewrites=1 \
  --search-engine=elasticsearch7 --elasticsearch-host=$MAGENTO_ELASTICSEARCH_HOST --elasticsearch-port=9200 \
  --base-url-secure=https://$MAGENTO_DOMAIN/ 
  # Create a flag file to indicate that the setup has been completed
  touch /var/www/html/magento-setup-done

  # Copy static content from 'pub' to 'magento/pub', including hidden files
  #cp -R /var/www/html/magento/boxopub/* /var/www/html/pub/
  #rm -R /var/www/html/magento/boxopub
fi
  # Copy static content from 'pub' to 'magento/pub', including hidden files
  # cp -R /var/www/html/boxopub/* /var/www/html/pub/
  #rm -R /var/www/html/magento/boxopub

# chown -R www-data:www-data /var/www/html
# chmod -R 775 var/page_cache

php bin/magento indexer:reindex
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy -f fr_FR en_US
php bin/magento cache:flush

chown -R www-data:www-data /var/www/html
chmod -R 775 var/page_cache

# Start Apache
apache2-foreground
