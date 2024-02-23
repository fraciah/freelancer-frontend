FROM node:18-alpine as builder

WORKDIR /freelancer
COPY package.json ./

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /freelancer/dist /var/www/freelancer

# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf