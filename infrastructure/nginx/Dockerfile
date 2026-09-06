FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/virtus.conf.template
COPY virtus-proxy.conf /etc/nginx/templates/virtus-proxy.conf
