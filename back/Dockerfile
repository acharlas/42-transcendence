FROM node:slim

RUN apt-get update && apt-get install -y procps

WORKDIR /nest

ENV PATH /nest/node_modules/.bin:$PATH

COPY ./nest ./

RUN npm install --silent
RUN nest build

CMD ["npm", "run", "start:dev"]