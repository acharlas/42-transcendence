FROM node:alpine

#set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

#add app

COPY ./react ./

RUN npm install 

#start app

CMD ["npm", "start"]