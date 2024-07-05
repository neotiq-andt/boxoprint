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
    nano \
    build-essential \
    python \
    # openssl \
    && docker-php-ext-install -j$(nproc) iconv pdo pdo_mysql mysqli gd intl soap bcmath zip opcache xsl sockets \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
# Install MySQL client tools
RUN apt-get update \
    && apt-get install -y default-mysql-client \
    && rm -rf /var/lib/apt/lists/*
    
# Enable Apache modules
RUN a2enmod ssl rewrite proxy proxy_http proxy_ajp deflate headers proxy_balancer proxy_connect


# Copy boxo default pub data
#COPY ../data-init/pub /var/www/

# Set the working directory
WORKDIR /var/www/html

# Copy the Magento codebase into the container
COPY . .

# Set proper file permissions
RUN chown -R www-data:www-data .

# Configure PHP settings
COPY php.ini /usr/local/etc/php/

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy auth.json for Magento Marketplace authentication
COPY auth.json /var/www/html/auth.json

# Run composer install
RUN composer install

COPY magento-setup.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/magento-setup.sh

# Copy Apache configuration
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

ENTRYPOINT ["/usr/local/bin/magento-setup.sh"]

# Expose port 80
EXPOSE 80
EXPOSE 443

# Start Apache
# CMD ["apache2-foreground"]
