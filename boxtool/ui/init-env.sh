#!/bin/sh

echo "PORT=8081" >> .env
echo "REACT_APP_KEYSECRET=\"m5QvrtDeb6YZES9t427eScEcu5CNWVfu\"" >> .env
echo "REACT_APP_ISCHECKIFRAME=false" >> .env
echo "REACT_APP_API=\"$BACKEND_HOST\"" >> .env