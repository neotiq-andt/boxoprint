#!/bin/bash
set -e

# Create the Magento database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"

# Create the MySQL user and grant privileges to the database
mysql -u root -e "CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -u root -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';"
mysql -u root -e "FLUSH PRIVILEGES;"

# Import the SQL dump into the database
mysql -u root "$MYSQL_DATABASE" < /docker-entrypoint-initdb.d/db.sql
