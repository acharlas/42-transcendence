FROM node:alpine

WORKDIR /nest

ENV PATH /nest/node_modules/.bin:$PATH

COPY ./nest ./

RUN npm install
RUN nest build
# RUN npm run prisma:dev:deploy

CMD ["npm", "run", "start:dev"]