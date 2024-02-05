FROM mysql:5.7

COPY ./my.cnf /etc/mysql/my.cnf

COPY ./boxprint.sql /docker-entrypoint-initdb.d/boxprint.sql

# Adjust the entrypoint to create the database before running the SQL dump
# COPY ./init-db.sh /docker-entrypoint-initdb.d/init-db.sh
# Copy the pub folder to use later in magento setup progress
COPY ./pub /var/www/

EXPOSE 3306
