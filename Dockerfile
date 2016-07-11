FROM praekeltfoundation/vxsandbox
MAINTAINER Praekelt Foundation <dev@praekeltfoundation.org>

WORKDIR /app

RUN apt-get-install.sh npm && npm install vumigo_v02 lodash
RUN npm install
RUN mv ./node_modules /usr/local/lib/

COPY . /app

ENTRYPOINT ["./momspeak-entrypoint.sh"]

CMD []
