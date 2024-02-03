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

# Run composer install
RUN composer install

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
