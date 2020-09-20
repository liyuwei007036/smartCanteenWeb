#!/bin/bash


cd /root/.jenkins/workspace/smartCanteenWeb_deploy

tar -cvf dist.war /dist

cp dist.war /docker/dist.war

cd docker

docker stop smartcanteenweb && docker rm smartcanteenweb

docker rmi smartcanteenweb:v1

docker build -t smartcanteenweb:v1 .

docker run -d --name="smartcanteenweb" --restart=always -p 90:90 smartcanteenweb:v1
