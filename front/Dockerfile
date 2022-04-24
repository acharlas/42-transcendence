FROM node:slim

#set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

#add app

COPY ./ui ./

RUN npm install
RUN npm install react-scripts -g

#start app

CMD ["npm", "start"]