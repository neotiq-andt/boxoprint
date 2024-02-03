FROM mysql:latest


COPY ./boxprint.sql /docker-entrypoint-initdb.d/boxprint.sql

# Adjust the entrypoint to create the database before running the SQL dump
COPY ./init-db.sh /docker-entrypoint-initdb.d/init-db.sh

EXPOSE 3306
