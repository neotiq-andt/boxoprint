DOCKERIZED BOXOPRINT
====================
Dockerized boxoprint project which included magento web and 3Dtool 

**INSTALATION GUIDE**
1. Setup all the system variables in the `.env` file. E.g

   
3. Create certificates for all 3 subdomains by running the command `bash init_letencrypt.sh`. If you already have the certificate, please ignore this step.
 
We have to renew the certificate from 2nd Oct 2024 due to let's encrypt. If you have the better one, please replace the certificate in the "letsencrypt" folder.

Rerun the command above for the certificate renewal, but have to type `2` for the certificate replacement.

3. Run the docker-compose by using the command `docker compose up -d --build`
4. In my testing, the docker needs 5-7 minutes to finish the setup of all 3 subdomains.

Enjoin your instalation!
