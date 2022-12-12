FROM node:alpine

ENV PATH /nest/node_modules/.bin:$PATH

WORKDIR /nest

COPY ./nest ./

RUN npm install -g npm@9.2.0
RUN npm install --save --legacy-peer-deps
RUN nest build

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "start:dev:deploy"]