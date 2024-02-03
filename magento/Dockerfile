# Use an official PHP image as a base image
FROM php:7.4-apache

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    libxslt-dev \
    libonig-dev \
    unzip \
    curl \
    git \
    wait-for-it \
    && docker-php-ext-install -j$(nproc) iconv pdo pdo_mysql mysqli gd intl soap bcmath zip opcache xsl sockets

# Enable Apache modules
RUN a2enmod rewrite

# Copy Apache configuration
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Set the working directory
WORKDIR /var/www/html

# Copy the Magento codebase into the container
COPY . .

# Set proper file permissions
RUN chown -R www-data:www-data .

# Configure PHP settings
COPY php.ini /etc/php/7.4/apache2/conf.d/

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy auth.json for Magento Marketplace authentication
COPY auth.json /var/www/html/auth.json

# Run composer install
RUN composer install

COPY magento-setup.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/magento-setup.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# Run Magento setup command with environment variables
# RUN php bin/magento setup:install \
#     --db-host=${MAGENTO_DB_HOST} \
#     --db-name=${MAGENTO_DB_NAME} \
#     --db-user=${MAGENTO_DB_USER} \
#     --db-password=${MAGENTO_DB_PASSWORD} \
#     # Add other setup options as needed \
#     --base-url=http://${MAGENTO_DOMAIN}/ \
#     --base-url-secure=https://${MAGENTO_DOMAIN}/ \
#     --admin-user=admin123 \
#     --admin-password=admin123 \
#     --admin-email=admin1@boxoprint.neotiq.com \
#     --admin-firstname=Admin \
#     --admin-lastname=User \
#     --backend-frontname=admin \
#     --language=fr_FR \
#     --currency=EUR \
#     --timezone=Europe/Paris \
#     --use-rewrites=1 \
#     --search-engine=elasticsearch7 --elasticsearch-host=${MAGENTO_ELASTICSEARCH_HOST} --elasticsearch-port=9200

# RUN php bin/magento indexer:reindex
# RUN php bin/magento setup:upgrade
# RUN php bin/magento setup:static-content:deploy -f fr_FR en_US
# RUN php bin/magento cache:flush

# Expose port 80
EXPOSE 80

# Start Apache
# CMD ["apache2-foreground"]
