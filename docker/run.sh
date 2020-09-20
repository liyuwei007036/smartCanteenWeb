#!/bin/bash


cd /root/.jenkins/workspace/smartCanteenWeb_deploy

tar -zcvf dist.tar.gz /dist

cp dist.tar.gz docker/dist.tar.gz

cd docker

tar -zxvf dist.tar.gz

docker stop smartcanteenweb && docker rm smartcanteenweb

docker rmi smartcanteenweb:v1

docker build -t smartcanteenweb:v1 .

docker run -d --name="smartcanteenweb" --restart=always -p 90:90 smartcanteenweb:v1
