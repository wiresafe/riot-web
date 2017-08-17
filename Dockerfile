FROM node:6
RUN apt-get update && apt-get install -y nginx
RUN git clone https://github.com/wiresafe/riot-web
WORKDIR /riot-web
RUN npm install
RUN scripts/fetch
RUN npm run build
COPY ./webapp /var/www/html
EXPOSE 80
