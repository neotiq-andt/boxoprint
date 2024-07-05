source .env

docker image build -t app .

docker container run \
    -d \
    -p 80:80 \
    -v ${PWD}/nossl-views:/var/www/html/public \
    -v ${PWD}/nossl-views/000-no-ssl-default.conf:/etc/apache2/sites-enabled/000-default.conf \
    -v ${PWD}/letsencrypt/:/var/www/letsencrypt \
    app

docker container run \
    -it \
    --rm \
    -v ${PWD}/letsencrypt/certs:/etc/letsencrypt \
    -v ${PWD}/letsencrypt/data:/data/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/data/letsencrypt \
    --email $EMAIL_SSL --agree-tos --no-eff-email \
    -d $MAGENTO_HOST 

docker container run \
    -it \
    --rm \
    -v ${PWD}/letsencrypt/certs:/etc/letsencrypt \
    -v ${PWD}/letsencrypt/data:/data/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/data/letsencrypt \
    --email $EMAIL_SSL --agree-tos --no-eff-email \
    -d $BACKEND_HOST 

docker container run \
    -it \
    --rm \
    -v ${PWD}/letsencrypt/certs:/etc/letsencrypt \
    -v ${PWD}/letsencrypt/data:/data/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/data/letsencrypt \
    --email $EMAIL_SSL --agree-tos --no-eff-email \
    -d $FRONTEND_HOST

docker rm $(docker stop $(docker ps -a -q --filter ancestor=app --format="{{.ID}}"))