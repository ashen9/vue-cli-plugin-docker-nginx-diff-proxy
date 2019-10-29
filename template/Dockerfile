# stage-1: build dist folder
FROM node:alpine as build
ARG MODE='proxy'
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "/usr/src/app/"]
RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
#RUN npm config set imagemin-gifsicle https://npm.taobao.org/mirrors/imagemin-gifsicle/
RUN npm install --silent
COPY . .
#RUN npm install cnpm
#RUN cnpm install --silent
RUN npm run build-${MODE}

# stage-2: copy static files to nginx image
FROM nginx:alpine
ARG ENV=''
EXPOSE 80
COPY nginx/gzip.conf /etc/nginx/conf.d/gzip.conf
#COPY nginx/default.conf /etc/nginx/default.conf
COPY --from=build /usr/src/app/nginx/default-${ENV}.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
