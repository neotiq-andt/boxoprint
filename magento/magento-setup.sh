#!/bin/bash
set -e

if [ ! -e /var/www/html/magento-setup-done ]; then

  # Wait for MySQL to be ready
  wait-for-it mysql:3306

  # Run Magento setup command
  php bin/magento setup:install \
  --db-host=$MAGENTO_DB_HOST \
  --db-name=$MAGENTO_DB_NAME \
  --db-user=$MAGENTO_DB_USER \
  --db-password=$MAGENTO_DB_PASSWORD \
  --base-url=http://$MAGENTO_DOMAIN/ \
  --base-url-secure=https://$MAGENTO_DOMAIN/ \
  --admin-user=admin123 \
  --admin-password=admin123 \
  --admin-email=admin1@boxoprint.neotiq.com \
  --admin-firstname=Admin \
  --admin-lastname=User \
  --backend-frontname=admin \
  --language=fr_FR \
  --currency=EUR \
  --timezone=Europe/Paris \
  --use-rewrites=1 \
  --search-engine=elasticsearch7 --elasticsearch-host=$MAGENTO_ELASTICSEARCH_HOST --elasticsearch-port=9200
  # Create a flag file to indicate that the setup has been completed
  touch /var/www/html/magento-setup-done
fi

php bin/magento indexer:reindex
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy -f fr_FR en_US
php bin/magento cache:flush
# Start Apache
apache2-foreground
