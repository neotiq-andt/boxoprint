## Overview box generator

Box Generator is the system front-end based on ReactJS.

## Install Global Packages
Setup environment
1. Install npm version 6.9.0
2. Install node js version 11.14.0
3. Install composer version 2.1.3
4. Install xampp version 3.3 (MYSQL version 10.4.19-MariaDB)
5. Install threejs version 0.103.0

Build Frontend dev
1. .env contain:
1.a  PORT frontend default 8081, 
1.b  REACT_APP_KEYSECRET such as define key access http://localhost:8081/boxo-frontend/store?secret=m5QvrtDeb6YZES9t427eScEcu5CNWVfu
1.c  REACT_APP_ISCHECKIFRAME default false, such as turn off check run iframe, if value equal true to check run in iframe on magento

2. at folder src/ui, copy .example.env and rename .env  
3. npm install
4. cd folder src/ui, run npm start, then auto open on browser http://localhost:8081/boxo-frontend
5. ok run build success frontend. if change port we change PORT default 8081 on .env

Build Backend dev
1. create database in mysql name boxdemo
2. import database path from ./database-init/boxdemo.sql
3. at path ./box-generator/src/app/backend.js set config mysqlConfiguration connect to database in your local 
4. npm install
5. node src/app/backend.js to run build backend, terminal will display Running on https://0.0.0.0:8082
6. Ok run success backend 

Build code before deploy on server:
1. npm run build to build project then push on server, know as deploy project on server