FROM praekeltfoundation/vxsandbox
MAINTAINER Praekelt Foundation <dev@praekeltfoundation.org>


RUN apt-get-install.sh npm
RUN npm install vumigo_v02 lodash
COPY . /app
WORKDIR /app
RUN npm install .

ENTRYPOINT ["./momspeak-entrypoint.sh"]

CMD []
