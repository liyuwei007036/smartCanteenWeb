FROM nginx:latest
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
VOLUME /usr/local/logs/
ADD nginx.conf /etc/nginx/nginx.conf
COPY dist.tar /usr/share/nginx/html/

EXPOSE 90