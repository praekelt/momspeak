FROM praekeltfoundation/vxsandbox
MAINTAINER Praekelt Foundation <dev@praekeltfoundation.org>

RUN apt-get-install.sh npm
RUN npm install vumigo_v02 lodash
WORKDIR /app
COPY . /app

RUN npm install .
RUN mv ./node_modules /usr/local/lib/


ENTRYPOINT ["./momspeak-entrypoint.sh"]

CMD []
